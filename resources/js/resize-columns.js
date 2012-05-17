// Full width button
$(document).ready(function() {
  
  // separator drag

  // resize columns on init
/*
  var separatorLeft = $('#column-separator').position().left;
  $('#column-separator').css({"left": separatorLeft + "px"});
*/
  //resizeColumns();
    
  // resize columns on window resize

  // initialize drag on separator
  $('#column-separator').draggable({
    axis: "x",
    containment: "#colright",
    scroll: false,
    drag: function(event, ui) {
      resizeColumns(event, ui);
    }
  });



});


$(window).resize(function () {
  // resize columns
  resizeColumns();
  
});


var resizeColumns = function(event, ui) {

  if (!ui) {
    var posLeft = $('#column-separator').position().left;
  }
  else {
    var posLeft = ui.position.left;
  }

  // set variables
  var widthInit = $('#colright').width();
  var separatorOffsetLeft = posLeft;
  var separatorOffsetRight = widthInit - ($('#column-separator').outerWidth() + separatorOffsetLeft);
  
  // apply width
  $('.col1').width(separatorOffsetLeft);
  $('.col3').width(separatorOffsetRight);

  // call resize canvas function
  resizeCanvas();
}