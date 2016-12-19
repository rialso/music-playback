
define(['farm_router', 'base', 'start'], 
function(farm_router, base, start) {

    function init (){

        /*
        1 - idioma
        2 - name interno para llamar las paginas
        3 - key para buscar las traducciones
        */

        farm_router('',                                     function(params) { run( params, 'home'); });
        farm_router('login',                                function(params) { run( params, 'login'); });
        farm_router('albums',                               function(params) { run( params, 'albums'); });
        farm_router('artists',                              function(params) { run( params, 'artists'); });
        farm_router('artist/:artist',                       function(params) { run( params, 'artist'); });
        farm_router('artist/:artist/album/:album',          function(params) { run( params, 'artist_album'); });
        // farm_router('project/:id/module',                   function(params) { run( params, 'modules'); });
        // farm_router('project/:id_project/module/:id_module',function(params) { run( params, 'module'); });


        // farm_router('', function(ctx, next) { 

        //     console.log('routes: farm_router /')

        //     //start.init({ lg:'es', nm: 'root', cb: function (){  AudioPlayer.init(); } })
        // });

        // farm_router(':lang', function(ctx, next) { 

        //     //start.init({ lg: ctx.lang, nm: 'lang', cb: function (){ AudioPlayer.init(); } }); 
        // });

        // farm_router('artists', function(ctx, next) {

        //     console.log('routes: artists/')

        //     start.init({ lg: ctx.lang, nm: 'lang', cb: function (){ artists.init() } }); 
        // });

        // farm_router('artist/:artist', function(ctx, next) {

        //     console.log('######## artist/:artist - ctx:  ', ctx)

        //     start.init({ lg: ctx.lang, nm: 'lang', cb: function (){ artist.init( ctx.artist) } }); 

        //     //AudioPlayer.artist_album( ctx.artist, ctx.album)
        // });

        // farm_router('artist/:artist/:album', function(ctx, next) {

        //     console.log('######## artist/:artist/:album - ctx:  ', ctx)

        //     //console.log('ctx:  ', ctx)

        //     start.init({ lg: ctx.lang, nm: 'lang', cb: function (){ artist_album.init( ctx.artist, ctx.album) } }); 

        //     //AudioPlayer.artist_album( ctx.artist, ctx.album)
        // });







        // farm_router(/^(.*?)\/open$/, function(ctx, next) {  
        //     console.log('ctx: ', ctx) 
        // });

        //////////// ultima

        farm_router(/(.*)/, function(ctx){
            //console.error('Page not found :( '); 
            console.log('%c Page not found :( ', "background:green;color:white", ctx.path);
        });



        //farm_router();
        farm_router({hash:false});
    }

    function run( $params, $key ){

        base.init({ 
            params: $params, 
            key: $key, 
            cb: function ( $params, $key ){ start.init($params, $key) } 
        });
        
        
    }


    return {

        init : init
    }
});    