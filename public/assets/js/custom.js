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

  /* Profile Pic */
  $('#profile-pic-chooser').change((e) => {
    // console.log($(this));
    let file = $(this).get(0).files[0];
    let reader = new FileReader();
    reader.addEventListener('load', () => {
      $('#profile-pic-data-url').val(reader.result);
      $('#profile-pic-show').attr('src', reader.result);
      // console.log(reader.result);
    }, false);
    if (file) {
      reader.readAsDataURL(file);
    }
  });

  /* Select All */
  $('#checkAll').click(function () {
    $('.check').prop('checked',
      $(this).prop('checked'));
  });

  $('#userSearch').autocomplete({
    source: (request, responce) => {
      $.ajax({
        url: '/search',
        type: 'GET',
        data: {aliasFirstName: request.term},
        success: (data) => {
          responce($.map(data, (el) => {
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

  $('.dropdown-menu a').click(() => {
    let selectedAction = $(this).text();
    $(this).parents('.dropdown')
      .find('.dropdown-toggle')
      .html(selectedAction+'<span class="caret"></span>');
  });

});