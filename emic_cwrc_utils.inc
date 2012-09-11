<?php

function emic_cwrc_get_critical_editions($pid) {
  module_load_include('inc', 'fedora_repository', 'api/fedora_utils');
  $query = <<<STRING
select \$subject \$title from <#ri>
where (\$subject <http://islandora.ca/ontology/relsext#isCriticalEditionOf> '$pid'
and \$subject <info:fedora/fedora-system:def/model#state> <info:fedora/fedora-system:def/model#Active>
and \$subject <dc:title> \$title)
STRING;

  $query_string = htmlentities(urlencode($query));
  $url = variable_get('fedora_repository_url', 'http://localhost:8080/fedora/risearch');
  $url .= '?type=tuples&flush=true&format=Sparql&limit=13000&lang=itql&stream=on&query=' . $query_string;
  $data = do_curl($url, TRUE);
  $xml = simplexml_load_string($data);
  foreach ($xml->results->result as $result) {
    $pid = str_replace('info:fedora/', '', $result->subject->attributes()->uri);
    $label = (string) $result->title;
    $editions[$pid] = $label;
  }
  return $editions;
}

function emic_cwrc_get_critical_edition_pages($pid) {
  module_load_include('inc', 'fedora_repository', 'api/fedora_utils');
  $query = <<<STRING
select \$subject from <#ri>
where
\$subject <http://islandora.ca/ontology/relsext#isPageOf> <info:fedora/$pid>
STRING;

  $query_string = htmlentities(urlencode($query));
  $url = variable_get('fedora_repository_url', 'http://localhost:8080/fedora/risearch');
  $url .= '?type=tuples&flush=true&format=Sparql&limit=13000&lang=itql&stream=on&query=' . $query_string;
  $data = do_curl($url, TRUE);
  $xml = simplexml_load_string($data);
  foreach ($xml->results->result as $result) {
    $pages[] = str_replace('info:fedora/', '', $result->subject->attributes()->uri);
  }
  return $pages;
}

function emic_cwrc_clone_object($pid) {
  global $base_url;
  module_load_include('inc', 'fedora_repository', 'api/fedora_item');
  // get information from original object
  $original = new Fedora_Item($pid);
  $rels = $original->get_rdf_relationships();
  $object_label = $original->objectProfile->objLabel;
  $datastreams = $original->datastreams;
  $namespace = substr($pid, 0, strpos($pid, ":"));
  //create new object
  $cloned_object_pid = FEDORA_ITEM::get_next_PID_in_namespace($namespace);
  $item = fedora_item::ingest_new_item($cloned_object_pid, 'A', $object_label . ' (Cloned)', $user->name);
  //populate datastreams
  foreach ($datastreams as $key => $values) {
    $label = $original->datastreams[$key]['label'];
    $mimetype = $original->datastreams[$key]['MIMEType'];
    $url = "$base_url/fedora/repository/$pid/$key";
    $controlGroup = $original->get_datastream($key)->controlGroup;

    switch ($key) {
      case 'DC':
        $content = str_replace($pid, $cloned_object_pid, $original->get_datastream_dissemination($key));
        $content = str_replace($object_label, $object_label . ' (Cloned)', $content);
        $item->modify_datastream($content, $key, $label, $mime_type);
        break;
      case 'RELS-EXT':
        $content = str_replace($pid, $cloned_object_pid, $original->get_datastream_dissemination($key));
        $item->add_datastream_from_string($content, $key, $label, $mimetype, $controlGroup);
        break;
      default:
        $item->add_datastream_from_url($url, $key, $label, $mimetype, $controlGroup);
    }
  }
  drupal_set_message("Successfully created $cloned_object_pid");
  return $cloned_object_pid;
}