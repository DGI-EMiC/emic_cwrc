//adapted from sc_init

var toid = null;
var startDate = 0;

var topinfo = {
  'canvasWidth' : 0,    // scaled width of canvas in pixels
  'numCanvases' : 0,    // number of canvases to display
  'current' : 0,        // current idx in sequence
  'done': [],           // URLs already processed
  'query' : null,       // top level databank
  'sequence' : [],      // Sequence list
  'sequenceInfo' : {},  // uri to [h,w,title]

  'annotations' : {
    'image':{},
    'text':{},
    'audio':{},
    'zone':{},
    'comment':{}
  },
  'lists' : {
    'image':{},
    'text':{},
    'audio':{},
    'zone':{},
    'comment':{}
  },
  'raphaels' : {
    'image':{},
    'text':{},
    'audio':{},
    'zone':{},
    'comment':{}
  },

  'zOrders' : {
    'image':1,
    'detailImage':1000,
    'text':2000,
    'audio':3000,
    'zone':4000,
    'comment':5000
  },
  'canvasDivHash' : {},
  'builtAnnos' : [],
  'paintedAnnos' : [],
  'audioAnno' : null,
  'waitingXHR' : 0
};


var SVG_NS = "http://www.w3.org/2000/svg";
var XLINK_NS = "http://www.w3.org/1999/xlink";

var opts = {
  base:'http://localhost/EmicShared/impl/',
  namespaces: {
    dc:'http://purl.org/dc/elements/1.1/',
    dcterms:'http://purl.org/dc/terms/',
    dctype:'http://purl.org/dc/dcmitype/',
    oa:'http://www.w3.org/ns/openannotation/core/',
    cnt:'http://www.w3.org/2008/content#',
    dms:'http://dms.stanford.edu/ns/',
    rdf:'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    ore:'http://www.openarchives.org/ore/terms/',
    exif:'http://www.w3.org/2003/12/exif/ns#'
  }
};


function initCanvas(nCanvas) {
  
  var w = $('body').width();
  topinfo['origBodyWidth'] = w;
  $('#top_menu_bar').width(w-5);


  // Make n canvases.  Multiple row logic:
  // 1:  1x1      2: 1x2      3: 1x3
  // 4:  2x2      5: 1x3+1x2  6: 2x3
  // 7:  1x4+1x3  8: 2x4      9: 3x3  (etc)

  var rows = Math.floor(Math.sqrt(nCanvas));
  var perrow = Math.ceil(nCanvas/rows);

  var w = w/perrow - (5*perrow);
  var h = $(window).height() - 50;
  h = h/rows;

  for (var x=0;x<nCanvas;x++) {
    $('#canvases').append('<div id="canvas_' + x + '" class="canvas"></div>')
    $('#canvas_'+x).width(w);
    $('#canvas_'+x).height(h);
    if (x != 0) {
      if (x % perrow == 0) {
        // below previous first in row
        $('#canvas_'+x).position({
          'of':'#canvas_' + (x-perrow),
          'my':'left top',
          'at':'left bottom',
          'collision':'none',
          'offset': '0 10'
        });
      } else {
        $('#canvas_' +x).position({
          'of':'#canvas_' + (x-1),
          'my':'left top',
          'at':'right top',
          'collision':'none',
          'offset': '10 0'
        });
      }
    }
  }
  topinfo['canvasWidth'] = w;
  topinfo['numCanvases'] = nCanvas;

  if (nCanvas > 2) {
    // Default text off if lots of canvases
    $('#check_show_text').attr('checked',false);
  }
};


function init_ui() {

  $('.dragBox').draggable().resizable();
  $('.dragBox').hide();

  $('.dragShade').click(function() {
    var sh = $(this);
    if (sh.text() == '[-]') {
      sh.empty().append('[+]');
      var p = $(this).parent(); // header
      var h = p.height();
      var pp = p.parent(); // box
      var nh = pp.height();
      sh.attr('ph', nh);
      p.next().hide();
      pp.height(h+6);

    } else {
      var n = sh.parent().next();
      var nh = sh.attr('ph');
      var p = sh.parent().parent();
      p.height(nh);
      sh.empty().append('[-]');
      n.show();
    }
  });

  $('#loadprogress').progressbar({
    value: 2
  }).css({
    height:15,
    width:300,
    opacity: 1.0,
    'z-index': 10000
  });
  $('#loadprogress').position({
    of:'#create_annotation',
    my:'left top',
    at:'right top',
    collision:'none',
    offset:'10 0'
  })

  $(".menu_body li:even").addClass("alt");

  // Link to menus
  $('.menu_head').click(function () {
    // First find our id, and then use to find our menu
    var id = $(this).attr('id');
    var menubody = $('#' + id + '_body')
    menubody.slideToggle('medium');
    menubody.position({
      'of':'#'+id,
      'my': 'top left',
      'at': 'bottom left',
      'collision':'fit',
      'offset': '0 8'
    })
  });

  try {
    // May not want to allow annotation
    maybe_config_create_annotation();
  } catch (e) {
  // XXX Remove annotation button and shape menu

  }

  // Refresh Canvas if browser is resized
  // We're called as per move... so need wait till finished resizing
  $(window).resize(function() {
    closeAndEndAnnotating();
    var w = $('body').width();
    topinfo['bodyWidth'] = w;
    if (toid != null) {
      // Be considerate and clear previous timeout
      window.clearTimeout(toid)
    }
    toid = window.setTimeout(maybeResize, 1000)
  });
}

function maybeResize() {
  var w = $('body').width();
  // Allow for slight tweak on size from original for scrollbars
  if (w == topinfo['bodyWidth'] && Math.abs(topinfo['origBodyWidth']-w) > 20) {
    // We've been stationary for 1 second
    toid = null;
    var b = topinfo['origBodyWidth'];
    topinfo['bodyWidth'] = 0;
    if (w != b) {
      initCanvas(topinfo['numCanvases']);
      showPages();
    }
  }
}




// Let's start it up!

$(document).ready(function(){
  $.urlParam = function(name){
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (!results)
    {
      return 0;
    }
    return results[1] || 0;
  }
 
  // gets setup information from Islandora
  //determine base of Drupal installation

  var here = window.location.toString();
  var splitter = here.indexOf('/sites/');
  if(splitter > 0){
    splitter = '/sites/';
  }else{
    splitter = '/modules/';
  }
  base = here.split(splitter);
  base = base[0];
  PID = $.urlParam('PID');
 
  $.ajax({
    url: base +'/emic/shared/setup/' + PID,
    async:false,
    success: function(data, status, xhr) {
      islandora_canvas_params = data;
    },
    error: function() {
      alert("Please Login to site");
    },
    dataType: 'json'

  });

  //establish color-picker if allowed
  if(islandora_canvas_params.can_choose){
    $('#color-picker-wrapper').click(function(){
      $('#anno_color_activated').attr('value', 'active');
    });
    $('.color-picker').miniColors();
  }else{
    $('#color-picker-wrapper').empty();
  }
 
  if(islandora_canvas_params.no_edit == true){
    $('#create_annotation').hide();
  }else{
    $(function(){
      $.contextMenu({
        selector: '.comment_title',
        callback: function(key, options) {

          var urn = $(this).attr('id');
          urn = urn.substring(5,100);
          var title = $(this).text().substring(2,100);
          title = title.trim();

          var comment_text = $(this).next('.comment_text');
          var anno_type = comment_text.find('.comment_type').text();

          if(key == 'delete'){
            if (confirm("Permananently Delete Annotation '" + title + "'")) {
              islandora_deleteAnno(urn);
            }

          }

          if(key == 'edit'){
            $(this).addClass('annotation-opened').next().show();
            var annotation = comment_text.find('.comment_content').text();
            var pm = $(this).find('.comment_showhide');
            if (pm.text() == '+ ') {
              pm.empty().append('- ');
              var id = $(this).attr('id').substring(5,100);
              var canvas = $(this).attr('canvas');
              paint_commentAnnoTargets(this, canvas, id);
            }
            startEditting(title, annotation, anno_type, urn)
          }
        },
        items: {
          "edit": {
            name: "Edit",
            icon: "edit",
            accesskey: "e"
          },
          "delete": {
            name: "Delete annotation",
            icon: "delete"
          }

        }
      });
    });
  }
  opts.base = islandora_canvas_params.object_base;

  if(islandora_canvas_params.use_dropdown == 1){
    $('#islandora_classification').empty();
    var sel = $('<select  id="anno_classification">').appendTo('#islandora_classification');
    $(islandora_canvas_params.categories).each(function() {
      value = this.toString();
      sel.append($("<option>").attr('value',value).text(value));
    });
  }else{
    $( "#anno_classification" ).autocomplete({
      source: islandora_canvas_params.categories
    });
  }

  // RDF Initializationc
  var rdfbase = $.rdf(opts);
  topinfo['query'] = rdfbase;

  var l = $(location).attr('hash');
  var uriparams = {};
  var nCanvas = 1;
  var start = 0;
  if (l[0] == '#' && l[1] == '!') {
    // Process initialization
    var params = l.substr(2,l.length).split('&');
    for (var p=0,prm;prm=params[p];p++) {
      var tup = prm.split('=');
      var key = tup[0];
      var val = tup[1];
      if (key == 's') {
        start = parseInt(val);
        uriparams['s'] = start;
      } else if (key == 'n') {
        nCanvas = parseInt(val);
        uriparams['n'] = nCanvas;
      }
    }
  }
  topinfo['uriParams'] = uriparams
 

  // Initialize UI
  init_ui();
  // Setup a basic Canvas with explicit width to scale to from browser width
  initCanvas(nCanvas);
   

  // Manifest Initialization
  var manuri = islandora_canvas_params.manifest_url;
  if (manuri != undefined) {
    fetchTriples(manuri, rdfbase, cb_process_manifest);
  } else {
    repouri = $('#repository').attr('href');
    fetchTriples(repouri, rdfbase, cb_process_repository);
  }

});
