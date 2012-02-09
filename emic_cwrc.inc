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
  $data = preg_replace("/&/", '&amp;', $data);
  $pid = ($_POST['file_pid']);
  $item = new Fedora_Item($pid);
  if ($item->datastreams['CWRC']) {
    $item->modify_datastream_by_value($data, 'CWRC', 'CWRC', 'text/plain');
  }
  else {
    $item->add_datastream_from_string($data, 'CWRC', 'CWRC', 'text/plain', 'X');
  }

  echo "Success";
}

/**
 * Retrieves CWRC datasgram from object
 * @param string $pid
 */

function get_cwrc_data($pid) {
  $fedora_url = variable_get('fedora_base_url', 'http://localhost:8080/fedora');
  $file_url = $fedora_url . "/objects/$pid/datastreams/CWRC/content";
  $file = file_get_contents($file_url);
  echo $file;
}

/**
 * Setup params for CWRC - Retreive OCR stream, makes availabality of CWRC sream known, and supplies Drupal base path
 * @global url $base_url
 * @global user object $user
 * @param string $pid
 */

function setupCWRC($pid) {
  global $base_url;
  global $user;
  $fedora_url = variable_get('fedora_base_url', 'http://localhost:8080/fedora');
  $file_url = $fedora_url . "/objects/$pid/datastreams/CWRC/content";
  $file_headers = @get_headers($file_url);
  $exists = ($file_headers[0] == 'HTTP/1.1 404 Not Found') ? "FALSE" : "TRUE";
  $ocr_url = $fedora_url . "/objects/$pid/datastreams/OCR/content";
  $lines = @file($ocr_url);
  if (is_array($lines)) {
    foreach ($lines as $line) {
      $line = preg_replace('/&£/', $replacement, $line);
      $ocr .= $line . '<br />';
    }
  }
  $results = array();
  $results['CWRC'] = $exists;
  $results['BASE_PATH'] = $base_url;
  $results['uid'] = $user->uid;
  $results['ocr'] = $ocr;
  $json = json_encode($results);
  echo $json;
}