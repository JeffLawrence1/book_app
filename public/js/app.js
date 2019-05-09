'use strict';

$('form').hasClass('hiddenForm');
$('.toggleButton').click(function() {
  $('form').removeClass('hiddenForm');
});
