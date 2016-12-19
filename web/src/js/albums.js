
define(['utils', 'call'], 
function(utils, call) {
    'use strict';

    function init (){

        call.albums().then(function(response) {
            //console.log("Success!", response);

            albums( response.data );

        }, function(error) {
            console.error("0032 albums Failed!", error);
        }); 
    }

    function albums( obj ){

        console.log('albums --> ', obj)

        var albums = obj;

        var elem = document.getElementById('content__main');
        utils.mr({ 
            ns:'pb', 
            tpl:tpl_albums_cover, 
            elem:elem, 
            data:albums 
        });
    }

    return {

        init            :init
    }
});

