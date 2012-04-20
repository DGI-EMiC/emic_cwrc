$(document).ready(function() {
    
  $('#full-screen').click(function() {
    
    $('body').toggleClass('annotation-fullscreen');
  
   if ($(this).val() == "Full Screen") {
      $(this).val("Exit Full Screen");

   }
   else {
      $(this).val("Full Screen");

   }

  
  });    
});