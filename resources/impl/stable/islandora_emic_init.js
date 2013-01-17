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
  
  var w = $('#canvas-body').width();
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

  $('.dragBox').draggable({
    containment: ".threecol",
    scroll: false,
    iframeFix: true,
  }).resizable();
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



  try {
    // May not want to allow annotation
    maybe_config_create_annotation();
  } catch (e) {
  // XXX Remove annotation button and shape menu

  }
  // Refresh Canvas if browser is resized
  // We're called as per move... so need wait till finished resizing
  $(window).resize(function() {
    // call resize function
    resizeCanvas();
  });
}


function resizeCanvas() {
  closeAndEndAnnotating();
  var w = $('#canvas-body').width();
  topinfo['bodyWidth'] = w;
  if (toid != null) {
    // Be considerate and clear previous timeout
    window.clearTimeout(toid)
  }
  toid = window.setTimeout(maybeResize, 500)
}


function maybeResize() {
  var baseid = '#' + $('.base_img').attr('id');
  var imgid = '#' + $('.base_img').children(":first").attr('id');

  var w = $('#canvas-body').width();
  // Allow for slight tweak on size from original for scrollbars
  if (w == topinfo['bodyWidth'] && Math.abs(topinfo['origBodyWidth']-w) > 20) {
    // We've been stationary for 1 second
    toid = null;
    var b = topinfo['origBodyWidth'];
    topinfo['bodyWidth'] = 0;
    if (w != b) {
    initCanvas(topinfo['numCanvases']);

    $(imgid).width(w);
    $(imgid).css("height", "auto");

  //  $(baseid).css("width", (w + 30));
    $(baseid).css("height", $(imgid).height());
    $('#canvas_0').css("width", (w));
  //  $('#canvas_0').css("height", $(imgid).height());
    }
  }
}


