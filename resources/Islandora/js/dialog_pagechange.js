
$('document').ready(function(){

  var safeMove = $('#pageChange');
  var savePage = function(){
    alert('saving page');
  }
  var nextPage = function(){
    alert("go to next page");
  }
  safeMove.dialog({
    'title':"You have unsaved changes on this page",
    'width': 675,
    'show' : 'fade',
    'modal': true,
    'autoOpen': false,
    'buttons' : [
    {
      'text':'Continue without saving'
    },

    {
      'text': "Save changes and continue",
      'click' : savePage
    },

    {
      'text': "Cancel",
      'click': function(){
        safeMove.dialog('close');
      }
    }]
  });


});

