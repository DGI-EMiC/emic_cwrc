


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

  $("#bookview_button").click(function(){
    var loc =  Drupal.settings.basePath + 'fedora/repository/' + Drupal.settings.islandora_book_pid;
    document.location.href = loc;
  });

};

