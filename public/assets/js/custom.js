/**
 * Created by joseph on 12/11/16.
 */
$(document).ready(function() {
  // close alert row
  window.setTimeout(function() {
    $('.alert').fadeTo(500, 0).slideUp(500, function() {
      $(this).remove();
    });
  }, 4000);
  
  $('#datefrom').datepicker();
  $('#dateto').datepicker();
  $('#createGiftDate').datepicker({
    dateFormat: 'mm-dd-yy'
  }).datepicker('setDate', '0');
  
  /* Select All */
  $('#checkAll').click(function() {
    $('.check').prop('checked',
      $(this).prop('checked'));
  });
  
  
  $('.dropdown-menu a').click(function() {
    let selectedAction = $(this).text();
    $(this).parents('.dropdown')
           .find('.dropdown-toggle')
           .html(selectedAction + '<span class="caret"></span>');
  });
  
  $('.toggle-nav').on('click', function() {
    $('.navbar-nav').toggleClass('show');
  });
  
  let $acceptGiftModal = $('#acceptGiftModal');
  $acceptGiftModal.on('show.bs.modal', function(e) {
    let button = $(e.relatedTarget);
    let senderFirstName = button.data('sender');
    let id = button.data('id');
    
    let modal = $(this);
    modal.find('form:first').attr('action', '/dashboard/gifts/' + id + '/accepted');
    modal.find('.modal-title').text('Say thanks to ' + senderFirstName);
    modal.find('#message-text').attr('placeholder', 'Hey, ' + senderFirstName + ' thanks for gift!');
  });
  
  $acceptGiftModal.find('form').submit(function(e) {
    e.preventDefault();
    
    let $this = $(this);
    
    $.ajax({
      url: $this.attr('action'),
      type: $this.attr('method'),
      data: $this.serializeArray(),
      success: function(response) {
        $acceptGiftModal.modal('hide');
        window.location.reload();
      },
      error: function() {
        alert('Oops exception happened. Please contact support.');
      }
    });
  });
  
  /**
   * Function generate random number
   * @param  {Integer} lengthSerie
   * @return {String}             string random number
   */
  function generateSerieRandomNumber(lengthSerie) {
    var finalNumber = "";
    for(var i = 0; i < lengthSerie; i++) {
      //generate random number between 1 to 9
      var randomn = Math.floor((Math.random() * 9 ) + 1);
      finalNumber = finalNumber + randomn;
    }
    return finalNumber;
  }
  
  $('#giftNumber').val(generateSerieRandomNumber(8));
});