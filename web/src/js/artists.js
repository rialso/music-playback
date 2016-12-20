
define(['utils', 'call'], 
function(utils, call) {
    'use strict';

    function init (){

        call.artists().then(function(response) {
            //console.log("Success!", response);

            artists( response.data );

        }, function(error) {
            console.error("0032 artists Failed!", error);
        }); 
    }

    function artists( obj ){

        console.log('artists --> ', obj)

        var artists = obj;

        //var elem = document.getElementById('content__main');
        utils.mr({ 
            ns:'pb', 
            tpl:tpl_artists_mini, 
            elem:'#content__main', 
            data:artists 
        });
    }

    return {

        init            :init
    }
});

