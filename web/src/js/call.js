
//http://codepen.io/the_ruther4d/pen/frbdH
//http://codepen.io/simurai/pen/Btnrc
//http://codepen.io/Cweili/pen/zxwaJm

//http://codepen.io/oknoblich/pen/EgklK

//http://codepen.io/jonomcleish/pen/rDIsJ



// http://codepen.io/macielsds/pen/wBNYWP
// http://codepen.io/jameshenson/pen/rOqbap


//http://codepen.io/ARS/pen/sLDjh
//http://codepen.io/davepvm/pen/DgwlJ


    // the playlist is just a JSON-style object.



define(['farm_ajax', 'utils'], 
function(farm_ajax, utils) {
    'use strict';

    function albums (){

        return new Promise(function(resolve, reject) {

            var cn = utils.storeGet('token');

            //console.log('verifing cn: ', cn).     //artists_obj

            new farm_ajax({ 
                type: "GET",
                cache: false, 
                headers: { 'x-access-token': cn.token },
                url: farm.r.bk+'albums',
                //data: {},
                error: function(obj, error, otroobj){ reject(obj.responseText); console.log('GET: error ', obj);},
                success: function (json) {   

                    //console.log('data: ', json); 
                 
                    var data = typeof json !== 'object' ? JSON.parse(json) : json;
                    resolve(data);
                }
            });
        });
    };

    function artists (){

        return new Promise(function(resolve, reject) {

            var cn = utils.storeGet('token');

            //console.log('verifing cn: ', cn).     //artists_obj

            new farm_ajax({ 
                type: "GET",
                cache: false, 
                headers: { 'x-access-token': cn.token },
                url: farm.r.bk+'artists',
                //data: {},
                error: function(obj, error, otroobj){ reject(obj.responseText); console.log('GET: error ', obj);},
                success: function (json) {   

                    //console.log('data: ', json); 
                 
                    var data = typeof json !== 'object' ? JSON.parse(json) : json;
                    resolve(data);
                }
            });
        });
    };

    function artist ( artist ){

        return new Promise(function(resolve, reject) {

            var cn = utils.storeGet('token');

            //console.log('verifing cn: ', cn).     //artists_obj

            new farm_ajax({ 
                type: "GET",
                cache: false, 
                headers: { 'x-access-token': cn.token },
                url: farm.r.bk+'artist/'+artist,
                //data: {},
                error: function(obj, error, otroobj){ reject(obj.responseText); console.log('GET: error ', obj);},
                success: function (json) {   

                    //console.log('data: ', json); 
                 
                    var data = typeof json !== 'object' ? JSON.parse(json) : json;
                    resolve(data);
                }
            });
        });
    };

    function artist_album ( artist, album ){

        return new Promise(function(resolve, reject) {

            var cn = utils.storeGet('token');

            //console.log('verifing cn: ', cn).     //artists_obj

            new farm_ajax({ 
                type: "GET",
                cache: false, 
                headers: { 'x-access-token': cn.token },
                url: farm.r.bk+'artist/'+artist+'/album/'+album,
                //data: {},
                error: function(obj, error, otroobj){ reject(obj.responseText); console.log('GET: error ', obj);},
                success: function (json) {   

                    //console.log('data: ', json); 
                 
                    var data = typeof json !== 'object' ? JSON.parse(json) : json;
                    resolve(data);
                }
            });
        });
    };














    // function all_tracks ( $params ){ 

    //     return new Promise(function(resolve, reject) { 


    //         var request = new XMLHttpRequest();
    //         request.open('GET', farm.r.bk+'/all', true);

    //         request.onload = function() {
    //             if (request.status >= 200 && request.status < 400) {
    //                 // Success!
    //                 var json = JSON.parse(request.responseText);
    //                 var dta = typeof json !== 'object' ? JSON.parse(json) : json;       
    //                 resolve(dta); 


    //             } else {
    //                 // We reached our target server, but it returned an error

    //             }
    //         };
    //         request.onerror = function() {
    //           // There was a connection error of some sort
    //         };
    //         request.send();
    //     }); 
    // }



    // function artist_album ( artist, album ){

    //     //console.log(artist +' | '+album)

    //     return new Promise(function(resolve, reject) { 

    //         var request = new XMLHttpRequest();
    //         request.open('GET', farm.r.bk+'/artist/'+artist+'/'+album, true);

    //         request.onload = function() {
    //             if (request.status >= 200 && request.status < 400) {
    //                 // Success!
    //                 var json = JSON.parse(request.responseText);
    //                 var dta = typeof json !== 'object' ? JSON.parse(json) : json;       
    //                 resolve(dta); 


    //             } else {
    //                 // We reached our target server, but it returned an error

    //             }
    //         };
    //         request.onerror = function() {
    //           // There was a connection error of some sort
    //         };
    //         request.send();
    //     }); 
    // }

    return {
        
        // all_tracks      :all_tracks,
        albums          :albums,
        artists         :artists,
        artist          :artist,
        artist_album    :artist_album,
    };

});
