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

