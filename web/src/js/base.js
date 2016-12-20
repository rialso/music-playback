
define(['utils', 'AudioPlayer'], 
function(utils, AudioPlayer) {
    'use strict';

    // data is obj with language , namespace and callback

    function init (data){
        // var cn = utils.storeGet('token');
        // if(!cn){ utils.goToPage('/login'); }

        // console.log('++++++++ datos storeGet: ', cn)

        // console.log('++++++++ datos stateUser: ', utils.stateUser.get() )

        //console.log('data init: ', data);
        var dta = {
            params : data.params,
            key    : data.key
        }

        //window.scrollTo(0, 0);

        //Guardamos donde estamos
        //farm.s.wh = data.nm;





        //utils.animationCallback ('home', [], callArtists)



        if( document.body.classList.contains('load') ) {
            console.log('++++++++++++++++++++++++ continous LOAD' );

            data.cb(dta);
        }
        else{
            console.log('++++++++++++++++++++++++ first LOAD' );
            document.body.classList.add('load');

                utils.changeSection('home', 27)

                //var _home_page = document.getElementById('home-page');
                utils.mr({ 
                    ns:'pb', 
                    tpl:tpl_structure, 
                    elem:'#home-page'
                });

                //var _header = document.getElementById('header');
                // utils.mr({ 
                //     ns:'pb', 
                //     tpl:tpl_header_base, 
                //     elem:'#header'
                // });


                //var _content_one = document.getElementById('content__one');
                utils.mr({ 
                    ns:'pb', 
                    tpl:tpl_library, 
                    elem:'#content__one'
                });



                //var elem_page = document.getElementById("header");
                utils.mr({ 
                    ns:'mlm', 
                    tpl:tpl_player, 
                    elem:'#header' 
                });

                AudioPlayer.init();

            //Guardamos el idioma en una variable
            //farm.lg = data.lg;

            // utils.i18nInit('es', 'vve', function(err, t){


            //     data.cb();
            // });

            data.cb(dta);
        }
    }

    return {

        init : init
    }
});











