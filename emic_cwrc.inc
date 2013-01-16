<?php

/**
 * Form to select page for CWRC editing
 * @param array $form
 * @param string $pid
 * @return string
 */
function cwrc_page_select_form($form, $pid) {
  module_load_include('inc', 'islandora_book', 'book_pack_utils');
  $page_pids = get_page_pids($pid);
  $form = array();
  $form['pages'] = array(
    '#title' => t('Choose page to annotate'),
    '#type' => 'select',
    '#options' => $page_pids,
  );

  return $form;
}

/**
 * Persists CWRC datastream to page object
 */
function save_cwrc_data() {
  module_load_include('inc', 'fedora_repository', 'api/fedora_item');
  $data = html_entity_decode(stripslashes($_POST['text']), ENT_QUOTES, 'UTF-8');
  $cwrc = str_replace('<br>', '<br />', $data);
  $cwrc = str_replace('&', '&amp;', $cwrc);
  $pid = ($_POST['file_pid']);
  save_cwrc_to_fedora($pid, $cwrc);
  echo "Success";
}

/**
 * Retrieves CWRC datastream from object
 * @param string $pid
 */
function get_cwrc_data($pid) {
  module_load_include('inc', 'fedora_repository', 'api/fedora_item');
  $item = new Fedora_Item($pid);
  global $base_url;
  guarantee_cwrc_datastream($pid);
  $fedora_url = variable_get('fedora_base_url', 'http://localhost:8080/fedora');
  $file_url = "$base_url/fedora/repository/$pid/CWRC";
  $file = $item->get_datastream_dissemination("CWRC");


  echo $file;
}

/**
 * Setup params for CWRC - if CWRC datastream does not exit, make one.
 * @global url $base_url
 * @global user object $user
 * @param string $pid
 */
function setupCWRC($pid) {
  global $base_url;
  global $user;
  module_load_include('inc', 'fedora_repository', 'ContentModel');

  if (!user_access('use CWRC')) {
    return;
  }
  $cant_edit = user_access('edit CWRC') ? false : true;
  module_load_include('inc', 'islandora_book', 'book_pack_utils');
  module_load_include('inc', 'fedora_repository', 'api/fedora_item');
  $fedora_url = variable_get('fedora_base_url', 'http://localhost:8080/fedora');
  guarantee_cwrc_datastream($pid);
  $books = get_collection_from_pid($pid);
  $book = $books[0];
  $item = new Fedora_Item($book);
  $title = $item->objectProfile->objLabel;
  $pages = get_sorted_pages($book);
  $cModels = array();
  foreach ($pages as $page) {
    $cm_object = ContentModel::loadFromObject($page);
    $cModels[] = $cm_object->pid;
  }
  $position = array_search($pid, $pages);
  $results = array();
  $results['BASE_PATH'] = $base_url;
  $results['uid'] = $user->uid;
  $results['fedora_url'] = $fedora_url;
  $results['position'] = $position;
  $results['pages'] = $pages;
  $results['cModels'] = $cModels;
  $results['title'] = $title;
  $results['authority_url'] = $base_url . '/cwrc/authorities/';
  $results['no_edit'] = $cant_edit;
  $results['page_count'] = count($pages);
  $results['authority_mappings'] = emic_cwrc_get_authority_mappings();
  $json = json_encode($results);
  echo $json;
}

/**
 * Constructs cwrc datastream if none exists
 * @param string $pid
 */
function make_cwrc_datastream($pid) {
  global $base_url;
  module_load_include('inc', 'fedora_repository', 'api/fedora_item');
  $item = new Fedora_Item($pid);
  $ocr_in = $item->get_datastream_dissemination('OCR');

  $lines = explode("\n", $ocr_in);
  $preface = '<?xml version="1.0"?>
<html>
    <head>
        <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
            xmlns:w="http://cwrctc.artsrn.ualberta.ca/#"></rdf:RDF>
    </head>
    <body>
        <tei id="struct_01" _tag="TEI" _display="TEI" _struct="true">
            <span _tag="text" _struct="true" id="struct_02" _display="text">';

  $postscript = '            </span>
        </tei>
    </body>
</html>';
  $ocr = "";
  $count = 100;
  if (is_array($lines)) {
    foreach ($lines as $line) {
      $line = trim(preg_replace('/&£/', '£', $line));

      $line = htmlspecialchars($line);
      $count++;
      // the l tag is not supported in version 2 of cwrcwriter
      // $ocr .=   "<l xml:id='struct_$count'>$line</l>";
      // $ocr .= $line . '<span _editable="true" _struct="true" _tag="lb" id="struct_' . $count++ . '">﻿</span>';
      $count++;
       $ocr .= $line . trim("<span _editable='true' _struct='true' _tag='lb' id='struct_$count' />﻿");
    }
  }
  if (empty($ocr)) {
    $ocr = "Blank Page";
  }
  $cwrc_stream = $preface . $ocr . $postscript;
  save_cwrc_to_fedora($pid, $cwrc_stream);
}

/**
 * Persists stream to fedora object
 * @param string $pid
 * @param xml $cwrc_stream
 */
function save_cwrc_to_fedora($pid, $cwrc_stream) {
  global $base_url;

  $xml = simplexml_load_string($cwrc_stream);
  $xml->registerXPathNamespace('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#');
  $entities = $xml->xpath("//rdf:Description");
  foreach ($entities as $entity) {
    $urn = emic_cwrc_generate_uuid();
    $entity->addAttribute('rdf:about', "urn:uuid:$urn", 'http://www.w3.org/1999/02/22-rdf-syntax-ns#');
    $entity->addChild('w:urn', "urn:uuid:$urn", 'http://cwrctc.artsrn.ualberta.ca/#');
    $output = $entity->asXML();
  }
  $flat_pid = str_replace(':', '_', $pid);
  module_load_include('inc', 'fedora_repository', 'api/fedora_item');
  $cwrc_stream = preg_replace("/&/", '&amp;', $cwrc_stream);
  $cwrc_stream = preg_replace("/<>/", '', $cwrc_stream);
  $ocr = get_ocr_from_cwrc($cwrc_stream);
  $item = new Fedora_Item($pid);

  if ($item->datastreams['CWRC']) {
    $item->modify_datastream_by_value($xml->asXML(), 'CWRC', 'CWRC', 'text/plain', 'M');
  }
  else {
    $item->add_datastream_from_string($cwrc_stream, 'CWRC', 'CWRC', 'text/plain', 'M');
  }
}

/**
 * Causes cwrc datatream to be built if not already present in object.
 *
 * @param string $pid
 */
function guarantee_cwrc_datastream($pid) {
  global $base_url;
  module_load_include('inc', 'fedora_repository', 'api/fedora_item');
  $item = new Fedora_Item($pid);
  if (!array_key_exists("CWRC", $item->datastreams)) {
    make_cwrc_datastream($pid);
  }
}

// maps types to collections
function emic_cwrc_get_authorities($dataType, $query = "") {
  $mappings = array(
    'Tag Place' => array('collection' => 'islandora:9247', 'type' => t('Place')),
    'Tag Person' => array('collection' => 'islandora:9239', 'type' => t('Person')),
    'Tag Event' => array('collection' => 'islandora:9242', 'type' => t('Event')),
    'Tag Organization' => array('collection' => 'islandora:9236', 'type' => t('Organization')),
  );



  $authorities = cwrc_get_authorities_list($mappings[$dataType], $query);
  if ($authorities) {
    $json = json_encode($authorities);
    echo $json;
  }
}

// builds resultset for typeahead

function cwrc_get_authorities_list($setup_data, $query) {
  $collection = $setup_data['collection'];
  $query_string = 'collection:"' . $collection . '"';
 // $records = emic_process_query($query_string);
  $terms = explode(' ', $query);
  $terms = array_filter($terms);
  $solr = variable_get('islandora_solr_search_block_url', 'http://localhost:8080/solr');

  $url = "http://$solr/select?indent=on&version=2.2&q=$query_string&fq=&start=0&rows=1000&qt=standard&wt=json&explainOther=&hl.fl=";
  $results = json_decode(file_get_contents($url), TRUE);
  $docs = $results['response']['docs'];
  foreach($docs as $doc){
    $pid = $doc['PID'];
    $contents = array();
    foreach($doc['emic.searchname'] as $sample){
      $identifier = null;
      if(!empty($sample) &! $identifier){
        $identifier = $sample;
      }
    }
    //$identifier = implode('', $doc['emic.searchname']);
    $contents['identifier'] = $identifier;
    $contents['Object'] = "<a href='/fedora/repository/$pid' target='_blank'>$pid</a>";
    $contents['Note'] = $doc['dc.description'][0];
    $records[$doc['PID']] = $contents;
  }
  
  while (count($terms) > 0) {
    $term = array_shift($terms) . "*";
    $query_string = 'collection:"' . $collection . '" AND emic.searchname:' . strtolower($term);
 
    $new_records = emic_process_query($query_string);
    $records = array_intersect_key($records, $new_records);
  }
  if (is_array($records)) {
    return array_values($records);
  }
}

function get_ocr_from_cwrc($cwrc) {
  $doc = new DOMDocument();
  $doc->strictErrorChecking = FALSE;
  @$doc->loadHTML($cwrc);
  $xml = @simplexml_import_dom($doc);
  $body = $xml->body->asXML();
  $body = preg_replace('/<br.>/', "\n", $body);
  $ocr = strip_tags($body);
  return $ocr;
}

function emic_cwrc_get_authority_mappings() {
  $mappings = array(
    'Place' => 'islandora:9247',
    'Person' => 'islandora:9239',
    'Event' => 'islandora:9242',
    'Organization' => 'islandora:9236',
  );
  return $mappings;
}

/**
 * Generates uuid
 * @return uuid
 */
function emic_cwrc_generate_uuid() {
  return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
      mt_rand(0, 0xffff), mt_rand(0, 0xffff),
      mt_rand(0, 0xffff),
      mt_rand(0, 0x0fff) | 0x4000,
      mt_rand(0, 0x3fff) | 0x8000,
      mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
  );
}

function emic_process_query($query_string) {
  module_load_include('inc', 'islandora_solr_search', 'IslandoraSolrQueryProcessor');
  $query_processor = new IslandoraSolrQueryProcessor();
  $query_processor->buildAndExecuteQuery($query_string);
  $raw_results = $query_processor->solrResult;

  $rawResponse = $raw_results->getRawResponse();
  $responseArray = json_decode($rawResponse, true);
  $records = array();
  $options = array(
    'attributes' => array('target' => '_blank'),
  );
  foreach ($responseArray['response']['docs'] as $result) {

    $title = $result['dc.subjectFacet'][0];
    if (isset($result['dc.date'][0])) {
      $title .= ' - ' . $result['dc.date'][0];
    }
    $auth_pid = str_replace('info:fedora/', '', $result['PID']);
    if (!$title) {
      $title = str_replace('info:fedora/', '', $result['title'][0]);
    }
    $note = $result['dc.description'][0];
    $link = l($auth_pid, "fedora/repository/$auth_pid", $options);

    $record = array('identifier' => $title, 'Object' => $link);
    if ($note) {
      $record['Note'] = $note;
    }
    $records[$result['PID']] = $record;
  }
  return $records;
}