/**
 * Created by joseph on 12/6/16.
 */
$(document).ready(function () {

    let grabUser = $('#username').val();

    let init = {
        url: '/search?',
        search: 'grabUser'
    };

    $.ajax({
        url: init.url + 'firstName=' + init.search,
        dataType: 'json',
        success: function(results){
            console.log(results);
        }
    });

});
