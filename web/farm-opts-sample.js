/*
*
* 
*
*
*/


farm.o = {
    mode            : 1,
    dev             : true,
    animation       : false,
    console         : true,
    opts_ext        : false,

    //cut_the_mustard
    ctm:{
        classList :true,
        querySelector :true,
        localStorage :true,
        addEventListener :true,
        svg : true
    },
    
    bwstatus  : { 'mozilla':'22', 'chrome':'20', 'msie':'10', 'safari':'6', 'opera':'15' },

    cache_ver : '1438169169385'
};

farm.r = {

    //baseUrl for if start in /
    base_url        :'/', 

    //require
    require         :'web/farm/farm-load-require.js', 
    //others roots 
    others          :'/web/farm/farm-load-others.js', 

    //link to require.js
    requirejs       :'node_modules/requirejs/require.js',
    ctm             :'node_modules/farm-base/source/ctm.js', 

    //bk              :'http://localhost:3008/api/'
    bk              :'/api/',
    server          :'http://localhost:3023/',

    //serverTracks    :'http://192.168.1.40:3023/api/track/',

    serverTracks    :'http://localhost:3023/api/track/',

    base_src        :'web/src/',
    lang_dir        :'web/languages/', 

    noCover         :'../web/src/imgs/noCover.jpg'

    /*********************************/

};






