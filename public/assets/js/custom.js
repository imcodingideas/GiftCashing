/**
 * Created by joseph on 12/11/16.
 */
$( document ).ready(function() {
    // close alert row
    window.setTimeout(function() {
        $('.alert').fadeTo(500, 0).slideUp(500, function(){
            $(this).remove();
        });
    }, 4000);

    $( '#datefrom' ).datepicker();
    $( '#dateto' ).datepicker();

    /* Profile Pic */
    $('#profile-pic-chooser').change(function (e) {
        console.log($(this));
        var file = $(this).get(0).files[0];
        var reader = new FileReader();
        reader.addEventListener('load', function () {
            $('#profile-pic-data-url').val(reader.result);
            $('#profile-pic-show').attr('src', reader.result);
            // console.log(reader.result);
        }, false);
        if (file) {
            reader.readAsDataURL(file);
        }
    })

} );