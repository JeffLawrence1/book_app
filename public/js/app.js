
$('#bookSearchSection').on('click', 'button', function(event) {
  event.preventDefault();

  let className = $(event.target).siblings('form').attr('class');

  if(event.target.className.includes('viewBut')){
    if (className.includes('hiddenForm')) {
      $(event.target).siblings('form').removeClass('hiddenForm');
    } else {
      $(event.target).siblings('form').addClass('hiddenForm');
    }
  }
});
