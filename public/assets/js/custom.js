/**
 * Created by joseph on 12/11/16.
 */

// close alert row
window.setTimeout(function() {
    $('.alert').fadeTo(500, 0).slideUp(500, function(){
        $(this).remove();
    });
}, 4000);