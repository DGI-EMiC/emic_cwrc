$(document).ready(function() {
    
  $('#full-screen').click(function() {
    
    $('body').toggleClass('annotation-fullscreen');
  
   if ($(this).val() == "Full Width") {
      $(this).val("Exit Full Width");

   }
   else {
      $(this).val("Full Width");

   }

  
  });    
});