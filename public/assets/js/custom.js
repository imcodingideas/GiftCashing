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
} );