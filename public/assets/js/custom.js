/**
 * Created by joseph on 12/11/16.
 */
$(document).ready(function () {
  // close alert row
  window.setTimeout(function () {
    $('.alert').fadeTo(500, 0).slideUp(500, function () {
      $(this).remove();
    });
  }, 4000);

  $('#datefrom').datepicker();
  $('#dateto').datepicker();
  $('#createGiftDate').datepicker({
    dateFormat: 'mm-dd-yy'
  }).datepicker('setDate', '0');

  /* Select All */
  $('#checkAll').click(function () {
    $('.check').prop('checked',
      $(this).prop('checked'));
  });

  $('#userSearch').autocomplete({
    source: function (request, responce) {
      $.ajax({
        url: '/admin/search',
        type: 'GET',
        data: {aliasFirstName: request.term},
        success: (data) => {
          responce($.map(data, function (el) {
            let fullName = el.aliasFirstName + ' ' + el.aliasLastName;
            return {
              label: fullName,
              value: el._id
            };
          }));
        }
      });
    },

    focus: function (event, ul) {
      this.value = ul.item.label;
      event.preventDefault();
    }

  });

  $('.dropdown-menu a').click(function () {
    let selectedAction = $(this).text();
    $(this).parents('.dropdown')
      .find('.dropdown-toggle')
      .html(selectedAction + '<span class="caret"></span>');
  });

  $('.toggle-nav').on('click', function () {
    $('.navbar-nav').toggleClass('show');
  });

  $('#acceptGiftModal').on('show.bs.modal', function (e) {
    let button = $(e.relatedTarget);
    let senderFirstName = button.data('whatever');

    let modal = $(this);
    modal.find('.modal-title').text('Say thanks to ' + senderFirstName);
    modal.find('#message-text').attr('placeholder', 'Hey, ' + senderFirstName + ' thanks for gift!');
  });

});
