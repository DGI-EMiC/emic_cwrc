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
 * Persists CWRC datastrram to page object
 */
function save_cwrc_data() {
  module_load_include('inc', 'fedora_repository', 'api/fedora_item');
  $data = html_entity_decode(stripslashes($_POST['text']), ENT_QUOTES, 'UTF-8');
  $cwrc = str_replace('<br>', '<br />', $data);
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
      $line = preg_replace('/&£/', '£', $line);

      $line = htmlspecialchars($line);
      $ocr .= $line . '<span _editable="true" _struct="true" _tag="lb" id="struct_' . $count++ . '">﻿</span>';
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
  $string = $xml->asXML();
  if ($item->datastreams['CWRC']) {
    $item->modify_datastream_by_value($xml->asXML(), 'CWRC', 'CWRC', 'text/plain', 'M');
  }
  else {
    $item->add_datastream_from_string($cwrc_stream, 'CWRC', 'CWRC', 'text/plain', 'M');
  }
  $dir_path = file_directory_path() . "/criticalEditionTmp/$flat_pid/ocrtmp";
  $file_path = "$dir_path/ocr.txt";
  if (!is_dir($file_path)) {
    mkdir($dir_path, 0777, TRUE);
  }
  file_put_contents($file_path, $ocr);
  $value = $item->add_or_modify_by_reference("$base_url/$file_path", 'OCR', 'Scanned Text', 'text/plain', 'M');
  unlink("$base_url/$file_path");
  rmdir("$base_url/$dir_path");
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

function cwrc_get_authorities_list($setup_data, $query) {
  module_load_include('inc', 'islandora_solr_search', 'IslandoraSolrQueryProcessor');

  $collection = $setup_data['collection'];
  $type = $setup_data['type'];
  $query_processor = new IslandoraSolrQueryProcessor();
  // test if collection is Person collection - handled differently from the others
  if ($collection == 'islandora:9239') {
    $terms = explode(' ', $query);
    $terms = array_filter($terms);
    // wildcard each term
    foreach ($terms as $term) {
      if ($term != '') {
        $term .= '*';
      }
      $query_string = 'collection:"islandora:9239" AND mads.fullname:' . strtolower($term);
      $new_terms = emic_process_query($query_string);
      if (is_array($new_terms) && is_array($records)) {
        $pids = array_intersect(array_keys($new_terms), array_keys($records));
        $records = array_merge($records, $new_terms);
      }
      else {
        $records = $new_terms;
      }
    }
    if (is_array($pids)) {
      foreach ($pids as $pid) {
        $filtered_results[] = $records[$pid];
      }
      return $filtered_results;
    }
    return array_values($records);
  }
  else {
    if ($query != '') {
      $query .= '*';
      $query_string = "collection:\"$collection\" AND dc.subject:\"$query\"";
      return emic_process_query($query_string);
    }
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
    if ($type == 'Person') {
      $title = $result['dc.subjectFacet'][0];
    }
    else {
      $title = $result['dc.subjectFacet'][0];
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