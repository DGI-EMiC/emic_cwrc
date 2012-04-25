
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

// toggle full window
Drupal.behaviors.emicCwrcFullWindow = function(context) {

  $('#full-window-button').click(function() {
    
    $('.emic-cwrc-wrapper').toggleClass('cwrc-fullwindow');
  
    if ($(this).val() == Drupal.t('Full Window')) {
      $(this).val(Drupal.t('Exit Full Window'));

    }
    else {
      $(this).val(Drupal.t('Full Window'));
    }
  });  
};

