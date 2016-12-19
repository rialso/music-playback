/*
 * Incluimos las librerias de las que dependemos
 */

//console.log("main.js: initializing require.config");

requirejs.config({
    baseUrl: farm.r.base_url,
    paths: {
        /*
    	jquery              :'node_modules/jquery/dist/jquery.min',
    	mustache            :'node_modules/mustache/mustache.min',
        
        prettyPrint         :'node_modules/farm-code-prettify/code-prettify-master/loader/prettify',
        prettify            :'js/prettify'
        */

        /******************/
        
        
        mustache            :'node_modules/mustache/mustache.min',
        i18next             :'node_modules/i18next/i18next.min',

        utilsTPL            :'node_modules/utilsTPL/source/utilsTPL',
        farm_bodyLoads      :'node_modules/farm-bodyLoads/source/farm-bodyLoads',

        farm_browser        :'node_modules/farm-browser/source/farm-browser',
        farm_icons          :'node_modules/farm-icons/source/farm-icons',
        farm_router         :'node_modules/farm-router/source/farm-router',
        farm_section        :'node_modules/farm-section/source/farm-section',
        farm_modal          :'node_modules/farm-modal/source/farm-modal',
        farm_ajax           :'node_modules/farm-ajax/source/farm-ajax',

        routes              :farm.r.base_src+'js/routes',
        base                :farm.r.base_src+'js/base',
        start               :farm.r.base_src+'js/start',
        //mustache_response   :farm.r.base_src+'js/MustacheResponse',
        utils               :farm.r.base_src+'js/utils',

        index               :farm.r.base_src+'js/index',
        
        call                :farm.r.base_src+'js/call',

        prep                :farm.r.base_src+'js/prep',

        albums              :farm.r.base_src+'js/albums',
        artists             :farm.r.base_src+'js/artists',
        artist              :farm.r.base_src+'js/artist',

        artist_album        :farm.r.base_src+'js/artist_album',
        AudioPlayer         :farm.r.base_src+'js/AudioPlayer',
        

    },
    shim: {
        /*
       jquery : {
            exports : 'jQuery'
        },
        */
    } ,
    //deps: [farm.r.base_src+'js/index'] 
    deps: ['index']    
});

