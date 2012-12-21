<div class="emic-cwrc-wrapper">
  <input id="full-window-button" type="button" value="<?php print t('Full Window'); ?>" />
  <input id="bookview_button" type="button" value="<?php print t('Return to Book View'); ?>" />
  <div class="cwrc-iframe-wrapper">
    <iframe id="shared_canvas_iframe" src="<?php print $src['src']; ?>" scrolling="0" frameborder="0" style="width: 100%; height: 800px;"><?php print t('Errors: unable to load SharedCanavas'); ?></iframe>
  </div>
</div>