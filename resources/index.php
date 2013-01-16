<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en-GB">
  <META HTTP-EQUIV="CACHE-CONTROL" CONTENT="NO-CACHE">
    <head>
      <title>DHSI CWRICWriter</title>

      <link type="text/css" rel="stylesheet" href="css/style_2.css" />
      <link type="text/css" rel="stylesheet" href="smoothness/jquery-ui-1.8.13.custom.css" />
      <link type="text/css" rel="stylesheet" href="js/snippet/jquery.snippet.css" />

      <script type="text/javascript" src="js/jquery/jquery-1.7.js"></script>
      <script type="text/javascript" src="js/jquery/jquery-ui-1.8.13.custom.min.js"></script>

      <script type="text/javascript" src="js/jquery/jquery.contextmenu.js"></script>
      <script type="text/javascript" src="js/jquery/jquery.watermark.min.js"></script>
      <script type="text/javascript" src="js/tinymce/jscripts/tiny_mce/jquery.tinymce.js"></script>
      <script type="text/javascript" src="js/jstree/jquery.hotkeys.js"></script>
      <script type="text/javascript" src="js/jstree/jquery.jstree.js"></script>
      <script type="text/javascript" src="js/snippet/jquery.snippet.min.js"></script>
      <script type="text/javascript" src="js/dialogs/dialog_settings.js"></script>
      <script type="text/javascript" src="js/editor.js"></script>
      <script type="text/javascript" src="js/dialog.js"></script>
      <script type="text/javascript" src="js/filemanager.js"></script>
      <script type="text/javascript" src="js/structuretree.js"></script>
      <script type="text/javascript" src="js/entitieslist.js"></script>
      <script type="text/javascript" src="js/relations.js"></script>

      <!-- CWRC stylesheets -->

      <script type="text/javascript" src="js/resize-columns.js"></script>
      <script type="text/javascript" src="Islandora/js/startup.js"></script>
      <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />

      <!-- Canvas js -->
      <script src="impl/js/jquery.rdfquery.rdfa.min-1.1.js" type="text/javascript"></script>
      <script src="impl/js/jquery.rdf.turtle.js" type="text/javascript"></script>

      <script src="impl/js/jquery.touchSwipe-1.2.4.js" type="text/javascript"></script>
      <script src="impl/js/jquery.jplayer.min.js" type="text/javascript"></script>

      <script src="impl/js/raphael.js" type="text/javascript"></script>
      <script src="impl/js/scale.raphael.js" type="text/javascript"></script>
      <script src="impl/js/uuid.js" type="text/javascript"></script>

      <script src="impl/js/ContextMenu/src/jquery.contextMenu.js" type="text/javascript"></script>
      <link href="impl/js/ContextMenu/src/jquery.contextMenu.css" rel="stylesheet" type="text/css" />

      <script src="impl/stable/islandora_emic_init.js" type="text/javascript"></script>
      <script src="impl/stable/sc_ui.js" type="text/javascript"></script>
      <script src="impl/stable/sc_utils.js" type="text/javascript"></script>

      <script src="impl/stable/sc_rdf.js" type="text/javascript"></script>
      <script src="impl/stable/sc_rdfjson.js" type="text/javascript"></script>
      <script src="impl/stable/sc_create.js" type="text/javascript"></script>
      <script src="impl/stable/sc_gdata.js" type="text/javascript"></script>
      <script src="impl/stable/sc_pastebin.js" type="text/javascript"></script>


      <!-- Color selector -->
      <script type="text/javascript" src="impl/js/jquery/jquery.miniColors.js"></script>
      <link type="text/css" rel="stylesheet" href="impl/css/jquery.miniColors.css" />

      <script type="text/javascript">
        window.onbeforeunload = function() {
          if (this.tinymce.get('editor').isDirty()) {
            return 'You have unsaved changes.';
          }
        }

      </script>
      <!-- Canvas css -->
      <link rel="stylesheet" href="impl/css/sc.css" type="text/css" />
      <link rel="stylesheet" href="impl/css/emic_canvas.css" type="text/css" />

      <!-- CWRC stylesheets -->
      <link type="text/css" rel="stylesheet" href="css/screen.css" />
      <link type="text/css" rel="stylesheet" href="css/style.css" />


    </head>
    <body>
      <!-- Header -->
      <div id="header">
        <div id="page_selector">Loading....</div>
        <div id="header-inner">
          <div class="header-nav">
            <a href="" id="page-prev"></a>
            <a href="" id="page-next"></a>
          </div>
          <h1>DHSI CWRCWriter</h1>
        </div>
        <div id ="pageChange">
        </div>
      </div>
      <!-- Body -->
      <div class="colmask threecol">
        <div class="colleft">
          <div class="col2">
            <!-- Tabs -->
            <div id="tabs">
              <ul>
                <li><a href="#entities">Entities</a></li>
                <li><a href="#structure">Structure</a></li>
                <li><a href="#relations">Relations</a></li>
                <li id="annotation_tab"><a href="#image-annotations">Image Annotations</a></li>
              </ul>
              <!-- Entities Panel -->
              <div id="entities">
                <div id="sortBy">
                  <span>Sort By</span>
                  <input type="radio" id="sequence" name="sortBy" checked="checked"><label for="sequence">Sequence</label></input>
                  <input type="radio" id="category" name="sortBy"><label for="category">Category</label></input>
                </div>
                <ul class="entitiesList"></ul>
              </div>
              <!-- Structure Panel -->
              <div id="structure">
                <div id="tree"></div>
              </div>
              <div id="relations">
                <ul class="relationsList"></ul>
              </div>
              <!-- Image Annotations Panel -->
              <div id="image-annotations">
                <div id="comment_annos_block"></div>
              </div>
            </div>
          </div>
        </div>
        <div id="colright" class="colright">
          <div class="col1">
            <!-- Text Annotation -->
            <div class="text-annotation-wrapper">
              <form method="post" action="">
                <textarea id="editor" name="editor" class="tinymce"></textarea>
              </form>
            </div>
          </div>
          <!-- Column Separator -->
          <div id="column-separator"></div>
          <div class="col3">
            <!-- Image annotation -->
            <button id="create_annotation" class="menu_button">Annotate</button>
            <div class="image-annotation-wrapper">

              <!-- Persist a single player and build new interface to it -->
              <div id="canvas-body-wrapper" style="width: 100%; height: 800px;"><div id="canvas-body">

                  <ul class="menu_body" id="show_body">
                    <li class="show_sort" id="li_comment">
                      <span class="ui-icon ui-icon-arrowthick-2-n-s"></span>
                      <span style="margin-left:10px">Commentary:</span>
                      <span style="float:right"><input id="check_show_comment" type="checkbox" checked="true"></input> </span>
                    </li>

                    <li class="show_sort" id="li_audio">
                      <span class="ui-icon ui-icon-arrowthick-2-n-s"></span>
                      <span style="margin-left:10px">Audio: </span>
                      <span style="float:right"><input id="check_show_audio" type="checkbox" checked="true"></input></span>
                      <br/>
                      <span>Volume:</span>
                      <div id="slider_volume" style="height:8px;"></div>
                    </li>
                    <li class="show_sort" id="li_text">
                      <span class="ui-icon ui-icon-arrowthick-2-n-s"></span>
                      <span style="margin-left:10px">Texts: </span>
                      <span style="float:right"><input id="check_show_text" type="checkbox" checked="true"></input></span>
                    </li>
                    <li class="show_sort" id="li_detailImg">
                      <span class="ui-icon ui-icon-arrowthick-2-n-s"></span>
                      <span style="margin-left:10px">Detail Images: </span>
                      <span style="float:right"><input id="check_show_detailImg" type="checkbox" checked="true"></input></span>
                    </li>
                    <li class="show_sort" id="li_baseImg">
                      <span class="ui-icon ui-icon-arrowthick-2-n-s"></span>
                      <span style="margin-left:10px">Base Images:</span>
                      <span style="float:right"><input id="check_show_baseImg" type="checkbox" checked="true"></input>
                    </li>
                  </ul>



                  <ul class="menu_body" id="view_body">
                    <li>Show Image Selection: <span style="float:right"><input id="check_view_imgSel" type="checkbox"></input></li>
                    <li>Number of Folios: <span style="float:right" id="viewNumCanvas">1</span>
                      <div id="slider_folios" style="height:8px;"></div></li>
                    <li>Show Zoom Button: <span style="float:right"><input id="check_view_zpr" type="checkbox"></input></li>
                    <li>Show Canvas URI: <span style="float:right"><input id="check_view_uri" type="checkbox"></input></li>
                  </ul>

                  <!--  Wrapper to create Canvas divs in -->
                  <div id="canvases"></div>

                  <!--  Wrapper to create SVG divs in -->
                  <div id="svg_wrapper"></div>

                  <!--  Wrapper to create annotations in, then reposition -->
                  <div id="annotations"></div>

                  <!-- Progress bar -->
                  <div id="loadprogress"></div>

                  <!--  At least one visible image needed for GData transport -->
                  <div class="shared-canvas-logo" style="font-size:8pt">
                    <img height="25" src="impl/imgs/small-logo.png" style="padding: 0px; margin: 0px; border: 0px; border-top: 2px;" />
                    Powered by SharedCanvas
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="dialogs" width="500">

        <!-- Image annotation box -->
        <div id="create_annotation_box" style="width: 380px" class="dragBox ui-dialog ui-widget ui-corner-all ui-draggable ui-resizable">
          <div id="create_annos_header" class="dragHead ui-dialog-titlebar ui-widget-header ui-corner-all">
            <span>Annotate</span>

          </div>
          <!-- Annotation shapes -->
          <div style="display:inline; margin-top: 3px; padding-left: 5px;">
            <img id="annoShape_rect" class="annoShape" src="imgs/draw_rect.png" style="padding-left: 2px; padding-top: 1px;"/>
            <img id="annoShape_circ" class="annoShape" src="imgs/draw_circ.png" style="padding-left: 1px;"/>
            <img id="annoShape_poly" class="annoShape" src="imgs/draw_poly.png" style="padding: 2px;"/>
            <hr style="margin: 0px; padding: 0px; height: 1px;"/>
          </div>
          <div id="create_annos_block" class="dragBlock">
            <!-- Annotation Title -->

            <div class="element-wrap">
              <label for="anno_title">Title:</label>
              <input id="anno_title" type="text" size="28"></input>
            </div>

            <div id ="islandora_classification"class="element-wrap">
              <label for="anno_type">Type:</label>
              <input id="anno_classification" type="text" size="28"></input>
            </div>


            <div id ="color-picker-wrapper" class="element-wrap">
              <label for="anno_color">Color:</label>
              <input id ="anno_color" type="hidden" name="color4" value="#91843c" class="color-picker" size="7" />
              <input id ="anno_color_activated" type="hidden" value ="" size="7" />
            </div>


            <div class="element-wrap">
              <label for="anno_text">Annotation:</label>
              <textarea id="anno_text" cols="40" rows="5"></textarea>
            </div>
            <!-- Services - to be removed -->
            <span style="width:200px;margin:0px;padding:0px;float:left">
              <ul id="create_body" style="width: 200px; list-style:none;font-size:10pt;margin:0;padding:0;">
              </ul>
            </span>
            <!-- Cancel/Save buttons -->
            <span style="float: right; padding-top: 3px;">
              <button class="diabutton" id="cancelAnno">Cancel</button>
              <button class="diabutton" id="saveAnno">Save</button>
            </span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div id="footer">
        <p>Brought to you by <a href="http://editingmodernism.ca/" title="Editing Modernism in Canada" target="_blank">EMiC</a></p>
      </div>
    </body>
</html>
