define(['utils', 'albums', 'artists', 'artist', 'artist_album'], 
function(utils, albums, artists, artist, artist_album) {
    'use strict';

    // data is obj with language , namespace and callback

    function init (data){

        console.log('---------------start --> ', data)

        var key = data.key;
        var params = data.params;

        if(key == 'login'){

            //farm_section.base('login');
            //login.init();
        }
        else if(key == 'home'){

            //farm_section.base('projects', 25);
            //projects.init();
        }
        else if(key == 'albums'){
            albums.init(params);
        }
        else if(key == 'artists'){
            artists.init();
        }
        else if(key == 'artist'){
            artist.init(params);
        }
        else if(key == 'artist_album'){
            artist_album.init(params);
        }


    }

    return {

        init : init
    }
});