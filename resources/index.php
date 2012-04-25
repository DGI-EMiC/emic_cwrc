<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en-GB">

  <head>
    <title>DHSI CWRICWriter</title>
    <link type="text/css" rel="stylesheet" href="smoothness/jquery-ui-1.8.13.custom.css" />
    <link type="text/css" rel="stylesheet" href="js/snippet/jquery.snippet.css" />
    <script type="text/javascript" src="js/jquery/jquery-1.7.js"></script>
    <script type="text/javascript" src="js/jquery/jquery-ui-1.8.13.custom.min.js"></script>
    <script type="text/javascript" src="js/jquery/jquery.contextmenu.js"></script>
    <script type="text/javascript" src="js/jquery/jquery.mousewheel.js"></script>
    <script type="text/javascript" src="js/jquery/jquery.watermark.min.js"></script>
    <script type="text/javascript" src="js/tinymce/jscripts/tiny_mce/jquery.tinymce.js"></script>
    <script type="text/javascript" src="js/jstree/jquery.hotkeys.js"></script>
    <script type="text/javascript" src="js/jstree/jquery.jstree.js"></script>
    <script type="text/javascript" src="js/snippet/jquery.snippet.min.js"></script>
    <script type="text/javascript" src="js/dialogs/dialog_settings.js"></script>
    <script type="text/javascript" src="js/dialogs/dialog_search.js"></script>

    <script type="text/javascript" src="js/editor.js"></script>
    <script type="text/javascript" src="js/dialog.js"></script>
    <script type="text/javascript" src="js/filemanager.js"></script>
    <script type="text/javascript" src="js/gzoom.js"></script>
    <script type="text/javascript" src="js/structuretree.js"></script>
    <script type="text/javascript" src="js/entitieslist.js"></script>
    <script type="text/javascript" src="js/fullscreen.js"></script>
    <script type="text/javascript" src="Islandora/js/startup.js"></script>
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
    <link type="text/css" rel="stylesheet" href="css/screen.css" />
    <link type="text/css" rel="stylesheet" href="css/style.css" />
  

  </head>
  <body>

    <div id="header">
      <h1>DHSI CWRCWriter</h1>
    </div>
    <div class="colmask threecol">
      <div class="colmid">
        <div class="colleft">
          <div class="col1">
            <!-- Column 1 start -->
            <form method="post" action="">
              <textarea id="editor" name="editor" class="tinymce"></textarea>
            </form><!-- Column 1 end -->
          </div>
          <div class="col2">
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
          <div class="col3">
            <div id="page_selector">Loading....</div>
            <!-- Column 3 start -->
            <input type="button" id="full-screen" value="Full Width"/>
            <iframe id="shared_canvas_iframe" src="" scrolling="0" frameborder="0" style="width: 100%; height: 800px;">Errors: unable to load SharedCanavas</iframe>

            <!-- Column 3 end -->
          </div>
        </div>
      </div>
    </div>
    <div id="footer">
      <p>Brought to you  by EMIC</p>
    </div>

  </body>
</html>
