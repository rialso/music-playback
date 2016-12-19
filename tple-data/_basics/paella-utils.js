//define(['mustache', 'mustache_response', 'i18next', 'farm_icons', 'farm_router', 'routes_lang'], 
//function(Mustache, MustacheResponse, i18n, farm_icons, farm_router, routes_lang) {
    'use strict';

    function extend(){
        for(var i=1; i<arguments.length; i++)
            for(var key in arguments[i])
                if(arguments[i].hasOwnProperty(key))
                    arguments[0][key] = arguments[i][key];

        return arguments[0];
    };

    var farm = {
        r:{
            covers : 'http://content.vicensvivesdigital.com/covers/',
            covers_EXT : 'http://content.vicensvivesdigital.com/covers/'
        }
    }



    var call = {};

    //console.log('farm_box_paella: ', farm_box_paella)

    for(var key in farm_box_paella){
        if(farm_box_paella.hasOwnProperty(key)){

            //console.log(farm_box_paella[key])

            var obj = farm_box_paella[key];

            if(obj.type === 'json'){
                //console.log('------',obj.name)
                // console.log(JSON.parse(obj.data))
                //console.log(obj.data)

                //var dt = obj.data

                cl ( obj.data )

                // call[obj.name] = function(){ 
                //     return new Promise(function(resolve, reject) { 
                //         console.log(dt)
                //         resolve( JSON.parse(dt) ) 
                //     }) 
                // };

            }
            else if (obj.type === 'js'){
                //console.log('------',obj.name)

                if(obj.name === 'icons'){

                    var s = document.createElement('script');
                    s.async = true;
                    s.innerHTML = obj.data;

                    document.body.appendChild(s);
                }
            }
            else if (obj.type === 'tpl'){
                // '<script> var tpl_'+namefunc+' = '+ctpl+'</script>';

                //console.log(obj.data)
                //console.log(obj.name)

                window['tpl_'+obj.name] = obj.data;
            }
            else if (obj.type === 'css'){
                // '<script> var tpl_'+namefunc+' = '+ctpl+'</script>';
                //window['tpl_'+obj.name] = obj.data;

                var link = document.createElement("style");
                //link.type = "text/css";
                link.rel = "stylesheet";
                link.innerHTML = obj.data;

                document.getElementsByTagName("head")[0].appendChild(link);
            }
        }
    }

    function cl ( $data ){
        call[obj.name] = function(){ 
            return new Promise(function(resolve, reject) { 
                //console.log($data)
                resolve( JSON.parse($data) ) 
            }) 
        };    
    };




var prep = {

    albums: function($obj) {

        return new Promise(function(resolve, reject) {

            //var playlist = [];

            var albums = $obj;

            for(var i=0;i<albums.length;i++){
                //console.log( albums[i] )
                albums[i].songs = 0;
                albums[i]._COVER = farm.r.noCover;
                albums[i].tracks = [];
                var disc = albums[i].disc
                for(var x=0;x<disc.length;x++){
                    
                    var tracks = disc[x].tracks;
                    //console.log('tracks.length: ', tracks.length)
                    var cover = false;
                    for(var c=0;c<tracks.length;c++){
                        if(tracks[c].cover){
                            if(tracks[c].cover){
                            tracks[c]._COVER = farm.r.server+tracks[c].cover;
                            }else{
                                tracks[c]._COVER = farm.r.noCover;
                            }
                            if(!cover){
                                cover = true;
                                albums[i]._COVER = farm.r.server+tracks[c].cover;  //"http://localhost:3023/"
                            }                          
                            // pasar duration segundos a minutos segundos
                            var time = tracks[c].duration.seconds;
                            var minutes = Math.floor(time / 60);
                            var seconds = time - minutes * 60;
                            seconds = (seconds < 10 ? "0" : "") + seconds;
                            tracks[c].duration._TIME = minutes+':'+seconds;
                        }
                        // clone obj para no incluir _DATA_TRACK
                        var nobj = {};
                        var obj = tracks[c];
                        for(var o in obj) {
                            if( obj.hasOwnProperty(o) ) {
                                nobj[o]=obj[o];
                            }
                        }
                        tracks[c]._DATA_TRACK = nobj;
                        console.log(tracks[c])

                        albums[i].songs++
                        //playlist.push( tracks[c] );

                        albums[i].tracks.push( tracks[c] )
                    }
                }  
            }

            var a = {
                albums:albums,
                //playlist:playlist
            }

            //console.log('----------albums ', albums)

            resolve( albums )
        });


    }




}
    





    // farm_icons({

    //     vvd_icons2 :'/src/icons/vvd-icons2',
    //     vvd_logos2 :'/src/icons/vvd-logos2'
    // });



    /*
    function rp ( $page, $params ){
        return new Promise(function(resolve, reject) {

                if(err){
                    reject(err)
                }
                else{

                    resolve(dtosrp);
                }
            });  
        });     
    };


    call.rp( $page, $params ).then(function(response) {
        console.log("0023 rp.js Success!", response);

    }, function(error) {
        console.error("0051 rp.js call Failed!", error);
    }); 


    call.dataInfo().then(function(response) {
   console.log("dataInfo Success!", response);

    }, function(error) {
        console.error("dataInfo Failed!", error);
    }); 

    */


        //function call($dts) { }



    //console.log('·············', farm_box_paella);


    // var preTPL = '';
    // for(var i=0;i<divTPL.length;i++){
    //     var ctpl = JSON.stringify( editorCM['tpl_'+i].getValue() );
    //     var namefunc = document.getElementById( 'input-tpl-'+i ).value;
    //     preTPL += '<script> var tpl_'+namefunc+' = '+ctpl+'</script>';
    // }

    // //preJSON += '<script> var json_'+divJSON[i].name+' = '+editorCM['json_'+i].getValue()+'</script>';
    // var preJSON = '<script>';
    // //var preJSON = '';
    //     preJSON += 'var call = {};';
    // for(var i=0;i<divJSON.length;i++){
    //     var namefunc = document.getElementById( 'input-json-'+i ).value;
    //     preJSON += '\
    //         call["'+namefunc+'"] = function(){ \
    //             return new Promise(function(resolve, reject) { \
    //                 resolve( '+editorCM['json_'+i].getValue()+' ) \
    //             }) \
    //         };'
    // }
    // preJSON += '</script>';



/*



   var utils = {
        /------*
        utils.mr({
            ns       :'vve',
            tpl      :tpl_blocks,
            elem     :elem,
            data     :{blocks: response},
            partials :{blocks: tpl_blocks}
        });
        *----/

        mr: function($dts) {

            var response = new mustacheResponse($dts.ns);

            if($dts.data){
                response = extend( response, $dts.data);
            }
            //console.log('function mr: ', response);
            var partials = {};
            if ($dts.partials){
                partials = $dts.partials;
            }
            var output = Mustache.render($dts.tpl, response, partials);

            // var e = document.createElement('div');
            //  e.innerHTML = output

            // document.body.appendChild(e);

            var html = farm_icons.html(output);
            //var html = output;

            if($dts.elem){
                    $dts.elem.innerHTML = html;
            }else{

                if (output.indexOf(':::') > 0) {
                    return output;
                }else{
                    var d = document.createElement('div');
                    d.innerHTML = html;
                    // var o = d.getElementsByTagName('div')[0];

                    var n = d.childNodes;
                    for (var i = 0 ; i < n.length; i++){
                        if (n[i].nodeType == 1){
                            //console.log(nodes[i]);
                            return n[i];
                        }
                    } 
                }

                //return html;
            }
        },

        templateToObj: function($tpl) {

            //console.log('------', $tpl)

            // http://stackoverflow.com/questions/2024732/parsing-text-with-javascript

            var lines = $tpl.split("\n");

            //console.log(lines)

            var phrases = [];
            var obj = {};

            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];

                //console.log(line.indexOf(':::'))

                if (line.indexOf(':::') > 0) {
                    phrases.push(line);
                }
            }
            //console.log(phrases);

            if(phrases){

                for (var x = 0; x < phrases.length; x++) {
                    var phrase  = phrases[x];
                    var phr     = phrase.split(':::');
                    var key     = phr[0].trim();
                    var name    = phr[1].trim();

                    obj[key] = name;
                }
            }

            //console.log('traducciones_form --> ', obj);

            return obj;
        },

        /-----*
        PUBLISH    FINISHED         -> Normal                   -> FINISHED
        PUBLISH    NOT_ACCESSIBLE   -> NotAvailable             -> NOT_ACCESSIBLE
        PUBLISH    ACCESSIBLE       -> Editing                  -> ACCESSIBLE
        INACTIVE   FINISHED         -> OutOfPrint -> Heredero   -> INACTIVE

        status.EXPIRED                                          -> EXPIRED

        status.ACTIVE                                           -> ACTIVE
        *---/

        prepUserBooks: function(books){

            var obj = books;
            for(var i in obj) {
                if( obj.hasOwnProperty( i ) ) {
                    if(obj[i].status == 'EXPIRED') {

                        obj[i]._EXPIRED = true;
                        obj[i].book._EXPIRED = true;

                    }else{
                        obj[i]._ACTIVE = true;
                        
                        if(obj[i].book.publicationStatus == 'PUBLISH' && obj[i].book.bookStatus == 'FINISHED') {

                            obj[i].book._FINISHED = true; 
                        }
                        else if(obj[i].book.publicationStatus == 'PUBLISH' && obj[i].book.bookStatus == 'NOT_ACCESSIBLE') {

                            obj[i].book._NOT_ACCESSIBLE = true;  
                        }
                        else if(obj[i].book.publicationStatus == 'PUBLISH' && obj[i].book.bookStatus == 'ACCESSIBLE') {

                            obj[i].book._ACCESSIBLE = true;  
                        }
                        else if(obj[i].book.publicationStatus == 'INACTIVE' && obj[i].book.bookStatus == 'FINISHED') {

                            obj[i].book._INACTIVE = true;  
                        }
                    } 
                    obj[i].book._COVER =  farm.r.covers+obj[i].book.covers.cua_256.filepath;
                    obj[i].book._AUTHORS =  obj[i].book.authors.replace( /\/\//g, ', ');
                    obj[i].book._AUTONOMIES = false;
                    if(obj[i].book.autonomies){
                        if(obj[i].book.autonomies.length > 0) {
                            var u = '';
                            var auto = obj[i].book.autonomies;
                            for(var a in auto) {
                                if( auto.hasOwnProperty( a ) ) {
                                    u += auto[a].name+', ';
                                }
                            }
                            u = u.slice(0, -2);
                            obj[i].book._AUTONOMIES = u;
                        }
                    }
                    if(obj[i].classroom) {

                        var txt = utils.mr({ 
                            ns:'pc', 
                            tpl:tpl_enums_text, 
                            data: {}
                        });

                        var text = utils.templateToObj(txt);

                        //console.log('---- text ',text)

                        if(obj[i].classroom.course) {
                            if(obj[i].classroom.course.name) {
                                obj[i].classroom.course._NAME = text[obj[i].classroom.course.name];

                            }
                            if(obj[i].classroom.course.level) {
                                if(obj[i].classroom.course.level.name){
                                    obj[i].classroom.course.level._NAME = text[obj[i].classroom.course.level.name];
                                }
                            }
                        }
                    }
                }
            }
          
            return obj;
        }
    }


*/

    // 'use strict';

    var version = '0.0.2';
    var debug = true;
    var idx = 0;
    var ns;

    function extend(to, from) {
        for (var p in from) {
            if (from.hasOwnProperty(p)) {
                to[p] = from[p];
            }
        }
        return to;
    };
    
    function mustacheResponse(namespace) {
        idx = 0;
        ns  = namespace;
    }

    //utilsTPL.version = version;

    mustacheResponse.prototype.t=function(){
        return function (text, render) {
            var ret = i18next.t(ns+'::::'+render(text));
            console.log('NS', ns);

            var ret = i18next.t(ns+'::::'+text,{defaultValue: render(text) });
            if(ret=='' || ret == undefined ) return render(text);               
            return render(ret);

            //return render(text); 
        };
    }

    mustacheResponse.prototype.idx=function(){
        return function (text, render) {
            var ret = idx;
            idx++;
            return ret;
        };
    }

    // IMPORTANTE: hay que llamar a este metodo si hay dos bucles en el mismo template llamando a idx
    mustacheResponse.prototype.idx_reset=function(){
        return function (text, render) {
            idx=0;
            return render(text);
        };
    }   

    // Divide por diez y formatea el número con comas
    mustacheResponse.prototype.grade=function(){
        return function (text, render) {
            if(isNaN(parseInt(render(text)))) return '';
            return (parseInt(render(text))/10).toString().replace('.', ',');
        };
    }
    /*
    //Cambia las eses de final de palabra para el layout 1
    mustacheResponse.prototype.change_s=function(){
        return function (text, render) {
            var ret = utilities.change_last_word_char(render(text), 's', '„');
            return ret;
        };
    }
    */


    var utilsTPL =  {

        /*
            utils.mr({
                ns       :'vve',
                tpl      :tpl_blocks,
                id       :'temeBox_'+x[i].id,
                data     :{blocks: response},
                partials :{blocks: tpl_blocks}
            });
        */

        mr: function($dts) {

            var response = new mustacheResponse($dts.ns);

            if($dts.data){
                response = extend( response, $dts.data);
            }
            //console.log('function mr: ', response);
            var partials = {};
            if ($dts.partials){
                partials = $dts.partials;
            }

            console.log(Mustache)

            var output = Mustache.render($dts.tpl, response, partials);

            // var e = document.createElement('div');
            //  e.innerHTML = output

            // document.body.appendChild(e);

            var html = farm_icons.html(output);
            //var html = output;

            if($dts.elem){
                    $dts.elem.innerHTML = html;
            }else{

                if (output.indexOf(':::') > 0) {
                    return output;
                }else{
                    var d = document.createElement('div');
                    d.innerHTML = html;
                    // var o = d.getElementsByTagName('div')[0];

                    var n = d.childNodes;
                    for (var i = 0 ; i < n.length; i++){
                        if (n[i].nodeType == 1){
                            //console.log(nodes[i]);
                            return n[i];
                        }
                    } 
                }

                //return html;
            }
        },

        templateToObj: function($tpl) {

            //console.log('------', $tpl)

            // http://stackoverflow.com/questions/2024732/parsing-text-with-javascript

            var lines = $tpl.split("\n");

            //console.log(lines)

            var phrases = [];
            var obj = {};

            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];

                //console.log(line.indexOf(':::'))

                if (line.indexOf(':::') > 0) {
                    phrases.push(line);
                }
            }
            //console.log(phrases);

            if(phrases){

                for (var x = 0; x < phrases.length; x++) {
                    var phrase  = phrases[x];
                    var phr     = phrase.split(':::');
                    var key     = phr[0].trim();
                    var name    = phr[1].trim();

                    obj[key] = name;
                }
            }

            //console.log('traducciones_form --> ', obj);

            return obj;
        },

        i18nInit: function(lang, namespace, country, ccaa, callback){
            // para guardar el namespace de forma global
            if(typeof(namespace) === 'string'){
                namespace = [namespace];
            }
            //farm.s.ns = namespace;

            //console.log('i18nInit')


            // Para cargar idiomas para el modo offline
            // var resources = {
            //   dev: { translation: { 'Mis libros': 'Libross' } },
            //   ca: { translation: { 'Mis libros': 'Llibres' } }
            // }; 

            var translations = lang + '_' + country + '_' + namespace[0];
            if(typeof(ccaa)==='string'){
                translations = lang + '_' + country + '_' + ccaa + '_' + namespace[0];
            }
            else{
                callback = ccaa;
            }


            console.log('TRANSLATIONS: ', translations);
            console.log('NAMESPACE: ', namespace);  

            //i18n.init({ 
            //    lng: farm.l.lang, 
            //    resGetPath: '../languages/__ns_____lng___' + farm.l.country + '.json',
            
            i18next.init({    
                lng: lang + '_' + country, 
                //resStore: eval(translations),
                fallbackNS: namespace[0],
                ns: {  namespaces: namespace,  defaultNs: namespace[0] },  
                fallbackLng: false,  
                keyseparator: ':::', 
                nsseparator: '::::',
                //V2 compatibility
                debug: debug,
                compatibilityAPI: 'v1',
                compatibilityJSON: 'v1'             
            }, function(err, t){
                callback(err, t);
            });

            i18next.addResourceBundle(lang + '_' + country , namespace[0], eval(lang + '_' + country + '_' + namespace[0] +'.' + lang + '_' + country + '.' + namespace[0]));

            for(var i=1; i<namespace.length; i++){
                i18next.addResourceBundle(lang + '_' + country , namespace[i], eval(lang + '_' + country + '_' + namespace[i] +'.' + lang + '_' + country + '.' + namespace[i]));
            }
        }
    }
