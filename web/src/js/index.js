
//console.log("index.js: initializing...");

define(['call', 'utils', 'farm_browser', 'farm_section', 'farm_icons', 'routes'], 
function(call, utils, farm_browser, farm_section, farm_icons, routes) {
    'use strict';

    farm_browser({

        filter : farm.o.bwstatus,

        close  : function (data){ 

            //console.log(data)

            if(data.passFilter){
                    farm.n = data;
                    ini();
            }else{
                    document.body.innerHTML = tpl_browser_alert;
            }
            return true; 
        }
    })

    function ini (){
        //para guardar datos
        farm.s = {};

        // tiene que estar siempre lleno.
        //farm.s.navigator_language = utils.navigator_language();

        farm_section({
            pages :{
                error       :'error',
                login       :'login',
                home        :'home'
            },
            animation:farm.o.animation
        });

        farm_icons();
        farm_icons.extern({
            music_playback     :  '/tple-data/mc6e4/01n99-music_playback'  // '/web/src/imgs/music-playback'
        })

        farm.o.animationEndName = utils.animationEndName();
        farm.o.transitionEndName = utils.transitionEndName();

        // console.log('---------index---------')

        // call.loginCheck().then(function(response) {
        //     //console.log("0064 index.js login Success!", response);

        //     if ( response.status === 200 ){ 
        //             //console.log('@@@@ pasar a la pagina siguiente');
                
        //             routes.init();
        //             //utils.goToPage('home');
        //     }else{
        //             //console.log('@@@@ pasar a login');
        //             routes.init();
        //             utils.goToPage('/login');      
        //     }

        // }, function(error) {
        //     console.error("0072 index.js login Failed!", error);
        //     //window.location = "/login";
        //     routes.init();
        //     utils.goToPage('/login');
        // }); 

        routes.init();
    };

    return {
        ini: ini
    };



});





