$(document).ready(function() {
      
  // resize columns on window resize
  // initialize drag on separator
  $('#column-separator').draggable({
    axis: "x",
    containment: "#colright",
    scroll: false,
    iframeFix: true,
    drag: function(event, ui) {
      resizeColumns(event, ui);
    },
  }).data('ratio', {left: 50, right: 50});

  // check starting width
  checkInitWidth();
  

});

// on resize window event
$(window).resize(function () {
  // resize columns
  resizeColumnsDrag();
  
});



// drag handler
var resizeColumns = function(event, ui) {

  if (!ui) {
    var posLeft = $('#column-separator').position().left;
  }
  else {
    var posLeft = ui.position.left;
  }

  // set variables
  var widthInit = $('#colright').width();
  var separatorOffsetLeft = posLeft + 1;
  var separatorOffsetRight = widthInit - ($('#column-separator').outerWidth() + separatorOffsetLeft);
  
  // apply width
  $('.col1').width(separatorOffsetLeft);
  $('.col3').width(separatorOffsetRight);

  // set ratio
  var leftRatio = (separatorOffsetLeft / widthInit) * 100;
  var rightRatio = (separatorOffsetRight / widthInit) * 100;
  $('#column-separator').data('ratio', {left: leftRatio, right: rightRatio});

  // call resize canvas function
  resizeCanvas();
}


// resize window
var resizeColumnsDrag = function() {

  // set variables
  var widthSeparator = $('#column-separator').outerWidth();
  var widthInit = $('#colright').width();
  var ratioLeft = $('#column-separator').data('ratio').left;
  
  var leftWidth = (widthInit / 100) * ratioLeft;
  
  var separatorOffsetRight = widthInit - leftWidth - widthSeparator;

  // apply width
  $('.col1').width(leftWidth + 1);
  $('.col3').width(separatorOffsetRight);
  $('#column-separator').css({left: leftWidth });

  // call resize canvas function
  resizeCanvas();
}


// check for the left column with on init
var checkInitWidth = function() {
  
  var leftWidth = $('.col1').width();
  
  // if the left column is smaller than the editor
  if (leftWidth < 450) {

    // set variables
    var widthInit = $('#colright').width();
    var widthSeparator = $('#column-separator').outerWidth();
  
    if (450 > widthInit) {
    
      var rightWidth = 0;
      var colSeparatorLeft = widthInit - widthSeparator;
      // apply width
      $('.col1').width(colSeparatorLeft);
      $('.col3').width(rightWidth);
      $('#column-separator').css({left: colSeparatorLeft});
    }
    else {
    
      var rightWidth = widthInit - 451 - widthSeparator;
      // apply width
      $('.col1').width(451);
      $('.col3').width(rightWidth);
      $('#column-separator').css({left: 450});
    }
  
    // set ratio
    var leftRatio = (451 / widthInit) * 100;
    var rightRatio = (rightWidth / widthInit) * 100;
    $('#column-separator').data('ratio', {left: leftRatio, right: rightRatio});
  }
}


