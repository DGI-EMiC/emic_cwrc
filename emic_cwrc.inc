<?php

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

function cwrc_ocr($pid) {
  global $user;
  $fedora_url = variable_get('fedora_base_url', 'http://localhost:8080/fedora');
  $file_url = $fedora_url . "/objects/$pid/datastreams/OCR/content";
  $lines = @file($file_url);
  foreach ($lines as $line) {
    $line = preg_replace('/&£/', $replacement, $line);
    echo $line . '<br />';
  }
}

function checkCWRC($pid) {
  $fedora_url = variable_get('fedora_base_url', 'http://localhost:8080/fedora');
  $file_url = $fedora_url . "/objects/$pid/datastreams/CWRC/content";
  $file_headers = @get_headers($file_url);
  $exists = ($file_headers[0] == 'HTTP/1.1 404 Not Found') ? "FALSE" : "TRUE";
  echo $exists;
}

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