
var data = {};

function setProp(userId, giftId, action){
  data = {
    userId: userId,
    giftId: giftId,
    action: action
  };
}

function go(){
  
  if (data.userId && data.giftId && data.action) {
    var url = '/admin/users/' +  data.userId + '/gifts/' + data.giftId;
    
    var bodyRequest = {
      action: data.action
    };
    
    if (data.action === 'normal') {
      bodyRequest.foundGift = {
        giftAmount: Number($('#amount').val() || 0),
        passCode: $('#passcode').val() || '',
        giftCode: $('#giftCode').val() || '',
        redeemCode: $('#redeemCode').val() || ''
      };
    }
    
    $.ajax({
      url: url,
      type: 'PUT',
      data: bodyRequest,
      success: function (response){
        
        if(response.message) {
          $('.noty-alerts:first').noty({text: response.message, type: 'success'});
        }
        
        if(response.error) {
          $('.noty-alerts:first').noty({text: response.error, type: 'alert'});
        }
        
        if(response.success) {
          
          if (response.normal) {
            return false;
          }
          
          if(response.gift.status.deleted) {
            setTimeout(function() {
              window.location.href = '/admin/gifts?filter=review';
            }, 2000);
            return;
          }
          
          for(var status in response.gift.status) {
            if(response.gift.status[status]) {
              status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
              $('.gift-status').html(status);
              break;
            }
          }
        }
      },
      error: function (err){
        $('.noty-alerts:first').noty({text: err.message, type: 'alert'});
      }
    });
  }
}

function updateActionAndGo(userId, giftId, action){
  setProp(userId, giftId, action);
  setTimeout(function (){
    go();
  }, 800);
}