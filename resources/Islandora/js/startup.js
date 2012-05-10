//function to retrieve url params

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
basedir = base[0];


$('document').ready(function(){
  PID = $.urlParam('PID');
  $.ajax({
    url: basedir +'/cwrc/setupCWRC/' + PID,
    async:false,
    success: function(data, status, xhr) {
      cwrc_params = data;
    },
    error: function() {
      alert("Please log in to EMiC site");
    },
    dataType: 'json'

  });

  $(this).attr("title", cwrc_params.title);
  $('#header h1').text( cwrc_params.title + " - Seq# 1");
  // instantiate and initialize writer object

  writer = new Writer({
    'project':'EMiC'
  });
  writer.init();
  init_canvas_div();
  if(cwrc_params.position == 0){
    $('#page-prev').css('opacity', '.6').addClass('disabled');
  }
  if(cwrc_params.position == cwrc_params.pages.length -1){
    $('#page-next').css('opacity', '.6').addClass('disabled');
  }
  // build and populate page choice dropdown
  $('#page_selector').html('<select id="page_choose"></select>');
  $.each(cwrc_params.pages, function(key, value){
    $('#page_choose').append('<option  value="' + key + '">Seq# ' + (key + 1) + '</option>');
  });

  // synchronize displayed page with dropdown

  var selector = "#page_choose option[value='" + cwrc_params.position + "']";
  $(selector).attr('selected','selected');

  // add page choice behavior to dropdown
  $('#page_choose').change(function(e){
    selector = "#page_choose option[value='" + cwrc_params.position + "']";
   
    cwrc_params.position = $('#page_choose :selected').attr('value');
    PID = cwrc_params.pages[ cwrc_params.position];
    writer.fm.loadEMICDocument();
    init_canvas_div();
    $('#header h1').text( cwrc_params.title + " - Seq# " + (parseInt(cwrc_params.position) +1));
    $('#page-prev').css('opacity', '1').removeClass('disabled');
    $('#page-next').css('opacity', '1').removeClass('disabled');
    
    if(cwrc_params.position ==0){
      $('#page-prev').css('opacity', '.6').addClass('disabled');
    }
    if(cwrc_params.position == cwrc_params.pages.length -1){
      $('#page-next').css('opacity', '.2').addClass('disabled');
    }
    selector = "#page_choose option[value='" + cwrc_params.position + "']";
    $(selector).attr('selected','selected');
  });

  $('#page-prev').click(function(e){
    e.preventDefault();
    if(cwrc_params.position > 0){
      $('#page-next').css('opacity', '1').removeClass('disabled');
      
      var selector = "#page_choose option[value='" + cwrc_params.position + "']";
      $(selector).removeAttr('selected');
      cwrc_params.position--;
      selector = "#page_choose option[value='" + cwrc_params.position + "']";
      $(selector).attr('selected','selected');
      PID = cwrc_params.pages[ cwrc_params.position];
      writer.fm.loadEMICDocument();
      init_canvas_div();
      $('#header h1').text( cwrc_params.title + " - Seq# " + (parseInt(cwrc_params.position) +1));
      if(cwrc_params.position == 0){
        $('#page-prev').css('opacity', '.6').addClass('disabled');
      }
    }
  });
  $('#page-next').click(function(e){
    e.preventDefault();
    if(cwrc_params.position < cwrc_params.pages.length -1){
      $('#page-prev').css('opacity', '1').removeClass('disabled');
     
      var selector = "#page_choose option[value='" + cwrc_params.position + "']";
      $(selector).removeAttr('selected');
      cwrc_params.position++;
      selector = "#page_choose option[value='" + cwrc_params.position + "']";
      $(selector).attr('selected','selected');
      PID = cwrc_params.pages[ cwrc_params.position];
      writer.fm.loadEMICDocument();
      init_canvas_div();
      $('#header h1').text( cwrc_params.title + " - Seq # " + (parseInt(cwrc_params.position) +1));
      if(cwrc_params.position == cwrc_params.pages.length -1){
        $('#page-next').css('opacity', '.2').addClass('disabled');
      }
    }
  });

});


function init_canvas_div(){
  pagePid =cwrc_params.pages[ cwrc_params.position];
  $.ajax({
    url: basedir +'/emic/shared/setup/' + pagePid,
    async:false,
    success: function(data, status, xhr) {
      emic_canvas_params = data;
    },
    error: function() {
      alert("Please Login to EMiC site");
    },
    dataType: 'json'

  });

  if(emic_canvas_params.no_edit == true){
    $('#create_annotation').hide();
  }
  opts.base = emic_canvas_params.object_base;



  // build and populate page choice dropdown
  $('#canvas_page_selector').html('<select id="canvas_page_choose"></select>');
  $.each(emic_canvas_params.pages, function(key, value){
    $('#canvas_page_choose').append('<option  value="' + key + '">Page ' + (key + 1) + '</option>');
  });  // build and populate page choice dropdown
  $('#canvas_page_selector').html('<select id="canvas_page_choose"></select>');
  $.each(emic_canvas_params.pages, function(key, value){
    $('#canvas_page_choose').append('<option  value="' + key + '">Page ' + (key + 1) + '</option>');
  });


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
  initCanvas(nCanvas)

  // Manifest Initialization
  var manuri = emic_canvas_params.manifest_url;
  if (manuri != undefined) {
    fetchTriples(manuri, rdfbase, cb_process_manifest);
  } else {
    repouri = $('#repository').attr('href');
    fetchTriples(repouri, rdfbase, cb_process_repository);
  }




}

