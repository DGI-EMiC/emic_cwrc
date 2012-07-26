<?php

/**
 * @file
 * emic_cwrc theme file
 */
 
/**
 * hook_preprocess function
 */
function emic_cwrc_preprocess_emic_cwrc (&$variables) {
  // add js
  $pid = ($variables['src']['book_pid']) ? $variables['src']['book_pid']:$variables['src']['pid'];
  drupal_add_js(array('islandora_book_pid' => $pid), 'setting');
  $path = drupal_get_path('module', 'emic_cwrc');
  drupal_add_js($path . '/js/emic_cwrc.js');

  // add css
  drupal_add_css($path . '/css/emic_cwrc.css');

}