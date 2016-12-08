/**
 * Created by joseph on 12/6/16.
 */
$(document).ready(function () {

    var grabUser = $('#username').val();

    var init = {
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