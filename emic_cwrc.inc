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

  module_load_include('inc', 'islandora_book', 'book_pack_utils');
  module_load_include('inc', 'fedora_repository', 'api/fedora_item');
  $fedora_url = variable_get('fedora_base_url', 'http://localhost:8080/fedora');
  guarantee_cwrc_datastream($pid);
  $books = get_collection_from_pid($pid);
  $book = $books[0];
  $item = new Fedora_Item($book);
  $title = $item->objectProfile->objLabel;
  $pages = get_page_pids($book);
  $position = array_search($pid, $pages);
  $results = array();
  $results['BASE_PATH'] = $base_url;
  $results['uid'] = $user->uid;
  $results['fedora_url'] = $fedora_url;
  $results['position'] = $position;
  $results['pages'] = $pages;
  $results['title'] = $title;

  $json = json_encode($results);
  echo $json;
}


/**
 * Constructs cwrc datastream if none exists
 * @param <type> $pid
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
  module_load_include('inc', 'fedora_repository', 'api/fedora_item');
  $cwrc_stream = preg_replace("/&/", '&amp;', $cwrc_stream);
  $item = new Fedora_Item($pid);
  if ($item->datastreams['CWRC']) {
    $item->modify_datastream_by_value($cwrc_stream, 'CWRC', 'CWRC', 'text/plain');
  }
  else {
    $item->add_datastream_from_string($cwrc_stream, 'CWRC', 'CWRC', 'text/plain', 'X');
  }
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
