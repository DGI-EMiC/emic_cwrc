
Drupal.behaviors.emic = function(context){
  $('.cwrc_submit').hide();
  $(".jumpmenu").change(function() {
    var val = ($('.jumpmenu :selected').attr('value'));
    if (val != '') {
      //location.href=val;
      window.open(val);
    }
  });
};

// toggle full screen
Drupal.behaviors.emicCwrcFullScreen = function(context) {

  $('#full-screen-button').click(function() {
    
    $('.emic-cwrc-wrapper').toggleClass('cwrc-fullscreen');
  
    if ($(this).val() == Drupal.t('Full Screen')) {
      $(this).val(Drupal.t('Exit Full Screen'));

    }
    else {
      $(this).val(Drupal.t('Full Screen'));
    }
  });  
};

