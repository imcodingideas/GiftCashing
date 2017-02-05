/**
 * Created by joseph on 12/11/16.
 */
var uiTools = {
  removeElementByDataId: function(id) {
    $('[data-id="'+id+'"]:first').fadeOut(200, function(){$(this).remove();});
  }
};

$(function() {
  $('.ajax-call').on('click', function(e) {
    e.preventDefault();
    
    var onSuccess = $(this).data('success');
    
    $(this).attr('disabled', 'disabled');
    $.ajax({
      url: $(this).data('action'),
      type: $(this).data('method'),
      success: function(response) {
        if(response.message) {
          $('.noty-alerts:first').noty({text: response.message, type: 'success'});
        }
        
        if(response.error) {
          $('.noty-alerts:first').noty({text: response.error, type: 'alert'});
        }
        
        if(response.success) {
          eval(onSuccess);
        }
      },
      complete: function() {
        $(this).removeAttr('disabled');
      }
    });
  });
});

$(document).ready(function() {
  
  function init() {
    $('#newTweet').on('click', tweetIt);
    $('#shareFacebook').on('click', shareFacebook);
  }
  
  init();
  
  function tweetIt() {
    var getShareMessage = $('#shareMessage').text();
    $('#newTweet').attr('href', 'https://twitter.com/intent/tweet?text=' + getShareMessage)
  }

  function shareFacebook() {
    FB.ui({
      method: 'feed',
      link: 'https://www.giftcashing.com',
      title: 'Gift Cashing',
      caption: $('#shareMessage').text(),
      description: $('#shareMessage').text(),
      picture: 'http://www.mujerhoy.com/pic.aspx/?img=paquete965336792.jpg&w=651'
    }, function(response){});
  }
  
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
  
  
  var giftsFrom = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      // TODO: This search endpoint should be request the data with query parameter instead aliasFirstNAme
      url: '/admin/search?aliasFirstName=%QUERY',
      wildcard: '%QUERY'
    }
  });
  
  $('#typehead-search .typeahead').typeahead(null, {
    name: 'gifts_from',
    display: 'value',
    source: giftsFrom,
    templates: {
      // TODO: Verify why NotFound is not working properly
      // notFound: [
      //   '<div>',
      //     '<div class="row">',
      //       '<div class="col-sm-12">unable to find any User that match the current query</div>',
      //     '</div>',
      //   '</div>'
      // ].join('\n')
      // ,
      suggestion: function(data) {
        console.log(arguments);
        return [
          '<div>',
            '<div class="row">',
              '<div class="col-sm-1">',
                '<img class="profile-picture img-circle" src="' + data.profilePic + '" /></div>',
              '<div class="col-sm-11">' + data.value + '</div>',
            '</div>',
          '</div>'
        ].join('\n')
      }
    }
  }).on('typeahead:selected', function(obj, data) {
    $('#userId').val(data.id);
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
        if(response.error) {
          window.modals.notify('Error', response.error);
          return;
        }
        
        if(response.message) {
          window.modals.notify('Message', response.message, function() {
            $acceptGiftModal.modal('hide');
            window.location.reload();
          });
          return;
        }
  
        $acceptGiftModal.modal('hide');
        window.location.reload();
      },
      error: function() {
        alert('Oops exception happened. Please contact support.');
      }
    });
  });
  
  function generateSerieRandomNumber(lengthSerie) {
    var finalNumber = '';
    for(var i = 0; i < lengthSerie; i++) {
      //generate random number between 1 to 9
      var random = Math.floor((Math.random() * 9 ) + 1);
      finalNumber = finalNumber + random;
    }
    return finalNumber;
  }
  
  $('#giftNumber').val(generateSerieRandomNumber(8));
  
  $('[data-toggle="tooltip"]').tooltip();
  
  $('.dropdown-menu').on('click', 'a', function(){
    $('#bulkActions:first-child').text($(this).text());
    $('#bulkActions:first-child').val($(this).text());
  });
  
});