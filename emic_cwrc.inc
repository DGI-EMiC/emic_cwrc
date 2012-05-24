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
  $pid = ($_POST['file_pid']);
  save_cwrc_to_fedora($pid, $data);
  echo "Success";
}

/**
 * Retrieves CWRC datasgram from object
 * @param string $pid
 */
function get_cwrc_data($pid) {
  guarantee_cwrc_datastream($pid);
  $fedora_url = variable_get('fedora_base_url', 'http://localhost:8080/fedora');
  $file_url = $fedora_url . "/objects/$pid/datastreams/CWRC/content";
  $file = file_get_contents($file_url);

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
  if (!user_access('use CWRC')) {
    return;
  }

  $can_edit = user_access('edit CWRC') ? 'true' : 'false';
  module_load_include('inc', 'islandora_book', 'book_pack_utils');
  module_load_include('inc', 'fedora_repository', 'api/fedora_item');
  $fedora_url = variable_get('fedora_base_url', 'http://localhost:8080/fedora');
  guarantee_cwrc_datastream($pid);
  $books = get_collection_from_pid($pid);
  $book = $books[0];
  $item = new Fedora_Item($book);
  $title = $item->objectProfile->objLabel;
  $pages = get_sorted_pages($book);
  $position = array_search($pid, $pages);
  $results = array();
  $results['BASE_PATH'] = $base_url;
  $results['uid'] = $user->uid;
  $results['fedora_url'] = $fedora_url;
  $results['position'] = $position;
  $results['pages'] = $pages;
  $results['title'] = $title;
  $results['authority_url'] = $base_url . '/cwrc/authorities/';
  // $results['no_edit'] = !user_access('edit CWRC');
  $results['no_edit'] = FALSE;
  $results['page_count'] = count($pages);
  $json = json_encode($results);
  echo $json;
}

/**
 * Constructs cwrc datastream if none exists
 * @param string $pid
 */
function make_cwrc_datastream($pid) {
  module_load_include('inc', 'fedora_repository', 'api/fedora_item');
  $fedora_url = variable_get('fedora_base_url', 'http://localhost:8080/fedora');
  $ocr_url = $fedora_url . "/objects/$pid/datastreams/OCR/content";
  $preface = '<?xml version="1.0"?><html><head><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:w="http://cwrctc.artsrn.ualberta.ca/#"></rdf:RDF></head>
    <body><p class="paraTag" id="struct_1">';
  $postscript = '</p></body></html>';
  $lines = @file($ocr_url);
  if (is_array($lines)) {
    foreach ($lines as $line) {
      $line = preg_replace('/&£/', '£', $line);
      //    $line = preg_replace('/[^(\x20-\x7F)]*/', '', $line);
      $line = htmlspecialchars($line);
      $ocr .= $line . '<br />';
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
  module_load_include('inc', 'fedora_repository', 'api/fedora_item');
  $cwrc_stream = preg_replace("/&/", '&amp;', $cwrc_stream);
  $cwrc_stream = preg_replace("/<>/", '', $cwrc_stream);
  $ocr = get_ocr_from_cwrc($cwrc_stream);
  $item = new Fedora_Item($pid);
  if ($item->datastreams['CWRC']) {
    $item->modify_datastream_by_value($cwrc_stream, 'CWRC', 'CWRC', 'text/plain');
  }
  else {
    $item->add_datastream_from_string($cwrc_stream, 'CWRC', 'CWRC', 'text/plain', 'X');
  }
  $path = file_directory_path() . "/ocrtmp/ocr.txt";
  mkdir(file_directory_path() . "/ocrtmp/");
  file_put_contents($path, $ocr);
  $item->add_or_modify_by_reference("$base_url/$path", 'OCR', 'Scanned Text', 'text/plain', 'M');
}

/**
 * Causes cwrc datatream to be built if not already present in object.
 *
 * @param string $pid
 */
function guarantee_cwrc_datastream($pid) {
  $fedora_url = variable_get('fedora_base_url', 'http://localhost:8080/fedora');
  $file_url = $fedora_url . "/objects/$pid/datastreams/CWRC/content";
  $file_headers = @get_headers($file_url);
  if ($file_headers[0] == 'HTTP/1.1 404 Not Found') {
    make_cwrc_datastream($pid);
  }
}

function emic_cwrc_get_authorities($dataType) {
  $mappings = array(
    'Tag Place' => array('cmodel' => 'islandora:place-entityCModel', 'type' => t('Place')),
    'Tag Person' => array('cmodel' => 'islandora:person-entityCModel', 'type' => t('Person')),
    'Tag Event' => array('cmodel' => 'islandora:event-entityCModel', 'type' => t('Event')),
    'Tag Organization' => array('cmodel' => 'islandora:organization-entityCModel', 'type' => t('Organization')),
  );

  $authorities = cwrc_get_authorities_list($mappings[$dataType]);
  if ($authorities) {
    $json = json_encode($authorities);
    echo $json;
  }
}

function cwrc_get_authorities_list($setup_data) {
  module_load_include('inc', 'fedora_repository', 'CollectionClass');
  $cmodel = $setup_data['cmodel'];
  $type = $setup_data['type'];
  $collection = new CollectionClass($pid);
  $query = <<< EOF
  select \$object \$title from <#ri>
	where (\$object <dc:title> \$title
		and \$object <info:fedora/fedora-system:def/model#hasModel> <info:fedora/$cmodel>
		and \$object <fedora-model:state> <info:fedora/fedora-system:def/model#Active>)
	order by \$title
EOF;

  module_load_include('inc', 'fedora_repository', 'CollectionClass');

  $contents = $collection->getRelatedItems($pid, $query);
  $results_xml = simplexml_load_string($contents);
  $records = array();
  $options = array(
    'attributes' => array('target' => '_blank'),
  );
  foreach ($results_xml->results->result as $result) {
    $auth_pid = str_replace('info:fedora/', '', $result->object->attributes()->uri);
    $title = str_replace('info:fedora/', '', $result->title);
    $link = l($title, "fedora/repository/$auth_pid", $options);
    $records[] = array('identifier' => $auth_pid, $type => $link);
  }
  return $records;
}

function get_ocr_from_cwrc($cwrc) {
  $xml = simplexml_load_string($cwrc);
  $body = $xml->body->asXML();
  $body = preg_replace('/<br.>/', "\n", $body);
  $ocr = strip_tags($body);
  return $ocr;
}