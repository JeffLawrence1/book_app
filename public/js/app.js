
$('.viewBut').on('click', function(event) {
  event.preventDefault();

  let className = $(event.target).siblings('form').attr('class');

  if (className.includes('hiddenForm')) {
    $(event.target).siblings('form').removeClass('hiddenForm');
  } else {
    $(event.target).siblings('form').addClass('hiddenForm');
  }
});
