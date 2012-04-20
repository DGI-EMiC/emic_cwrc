<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
  <head>
    <title>CWRCWriter</title>
    <link type="text/css" rel="stylesheet" href="css/danny.css" />
    <link type="text/css" rel="stylesheet" href="smoothness/jquery-ui-1.8.13.custom.css" />
    <link type="text/css" rel="stylesheet" href="js/snippet/jquery.snippet.css" />
    <script type="text/javascript" src="js/jquery/jquery-1.6.1.js"></script>
    <script type="text/javascript" src="js/jquery/jquery-ui-1.8.13.custom.min.js"></script>
    <script type="text/javascript" src="js/jquery/jquery.contextmenu.js"></script>
    <script type="text/javascript" src="js/jquery/jquery.mousewheel.js"></script>
    <script type="text/javascript" src="js/jquery/jquery.watermark.min.js"></script>
    <script type="text/javascript" src="js/tinymce/jscripts/tiny_mce/jquery.tinymce.js"></script>
    <script type="text/javascript" src="js/jstree/jquery.hotkeys.js"></script>
    <script type="text/javascript" src="js/jstree/jquery.jstree.js"></script>
    <script type="text/javascript" src="js/snippet/jquery.snippet.min.js"></script>
    <script type="text/javascript" src="js/dialogs/dialog_settings.js"></script>
    <script type="text/javascript" src="js/editor.js"></script>
    <script type="text/javascript" src="js/dialog.js"></script>
    <script type="text/javascript" src="js/filemanager.js"></script>
    <script type="text/javascript" src="js/gzoom.js"></script>
    <script type="text/javascript" src="js/structuretree.js"></script>
    <script type="text/javascript" src="js/entitieslist.js"></script>
    <script type="text/javascript" src="Islandora/js/startup.js"></script>
	<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
	<link type="text/css" rel="stylesheet" href="css/screen.css" />
  <link type="text/css" rel="stylesheet" href="css/style.css" />
  <link type="text/css" rel="stylesheet" href="css/gzoom.css" />
    <script type="text/javascript">
      window.onbeforeunload = function() {
        if (this.tinymce.get('editor').isDirty()) {
          return 'You have unsaved changes.';
        }
      }
      $(function() {
        writer = null;
        $.ajax({
          url: 'http://apps.testing.cwrc.ca/editor/documents/info/projectname',
          success: function(data, status, xhr) {
            writer = new Writer({
              project: data
            });
            writer.init();
          },
          error: function() {
            writer = new Writer();
            writer.init();
          }
        });
      });
    </script>
  </head>
  <body>
    <div id="wrap">
      <div id="header">
        <h1>CWRCWriter v0.18</h1>
      </div>
      <div id="leftcol">
        <div id="tabs">
          <ul>
            <li><a href="#entities">Entities</a></li>
            <li><a href="#structure">Structure</a></li>
          </ul>
          <div id="entities">
            <div id="sortBy">
              <span>Sort By</span>
              <input type="radio" id="sequence" name="sortBy" checked="checked"><label for="sequence">Sequence</label></input>
              <input type="radio" id="category" name="sortBy"><label for="category">Category</label></input>
            </div>
            <ul></ul>
          </div>
          <div id="structure">
            <div id="tree"></div>
          </div>
        </div>
        <div id="separator" class="arrowLeft" title="Click to expand/contract"></div>
      </div>
      <div id="rightcol">
			<div id="zoom01" class="zoom">
				<img id="reference_image" src="http://localhost:8080/fedora/objects/islandora%3A1709-006/datastreams/JPEG/content" alt="Image Loading" title="Repository Image" />
			</div>
      </div>
      <div id="main">
        &nbsp;
				<form method="post" action="">
          <textarea id="editor" name="editor" class="tinymce">Loading</textarea>
        </form>
      </div>
    </div>

  		<script type= "text/javascript">

			$(function() {
				$("#zoom01").gzoom({
						sW: 400,
						sH: 650,
						lW: 1600,
						lH: 2600,
						lighbox : false
				});


			});

		</script>

  </body>
</html>