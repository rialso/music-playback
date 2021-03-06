define(['utilsTPL', 'farm_router', 'farm_section'], 
function(utilsTPL, farm_router, farm_section) {
    'use strict';

    function extend(){
        for(var i=1; i<arguments.length; i++)
            for(var key in arguments[i])
                if(arguments[i].hasOwnProperty(key))
                    arguments[0][key] = arguments[i][key];

        return arguments[0];
    };

    /**********************************************/

    function goToPage(page) {
        farm_router(page);
    };

    function changeURL($route) {
        farm_router.show( $route );
    };

    /**********************************************/

    function changeSection($sectionName, $animation) {

        farm_section.base($sectionName, $animation);
    };

        /**********************************************/

    function mr($dts) {

        return utilsTPL.mr($dts);

    }

    function templateToObj($tpl) {

        return utilsTPL.templateToObj($dts);

    }

    function i18nInit(lang, namespace, ccaa, callback){


        return utilsTPL.i18nInit(lang, namespace, ccaa, callback);
    }

    /**********************************************/

    function decodeHTMLEntities (str) {

            str = str.replace(/%20/gmi, ' ');

            return str;
    }




    // get the folder of index.html, mame of last '/' of window.location.pathname
    function folderURL($url) {

        var url, pathArray, last, getext, folder;

        //var url = 'file:///Users/rtb/Sites/front/marmitefrwk/legal2/index.html';
        url = window.location.pathname;
        console.log(url)
        url = url.replace(/\/$/, '') // Match a forward slash / at the end of the string ($)        
        pathArray = url.split( '/' );
        last = pathArray[pathArray.length-1];
        getext = last.lastIndexOf(".");
        if(getext > 0){
            folder = pathArray[pathArray.length-2];
        }
        else{
            folder = pathArray[pathArray.length-1];
        }

        //console.log('folder: ', folder);

        return folder;
    };
    function firstURL($url) {

        var url, pathArray, last, getext, folder;

        //var url = 'file:///Users/rtb/Sites/front/marmitefrwk/legal2/index.html';
        url = window.location;
        console.log(url)

    };

    function parseQueryString(b){
        console.log('parseQueryString: ',b)
        var ret = {};
        var v = b.split("&");
        for (var i = 0; i < v.length; i++) {
            var s = v[i].split('=');
            ret[s[0]] = s[1];
        }
        return ret;        
    };

    /*

    Necesita store


    function storeLoad( key, value ){

        if(typeof( store.get(key) ) != 'object'){
            // ia -> informacion actividades
            // ep -> equivalencia papel
            store.set(key,value);

            storeGet(key);
        }
    };

    function storeGet( key ){
        /---*
        var x = store.get('infoqs');
        farm.o.infoqs = x;
        *---/
        var x = store.get(key);
        
        farm.o[key]= x;
    };
    
    function storeSet( key, value ){

        store.set(key, value);

        farm.o[key]= value;
    };
    */

 

/*********************************************/

    function animationEndName() {

        var  s = document.body.style
            ,animationProperty =
                'WebkitAnimation' in s ? 'webkitAnimationEnd' :
                'OAnimation' in s ? 'oAnimationEnd' :
                'msAnimation' in s ? 'MSAnimationEnd':
                'animation' in s ? 'animationend': 'no-supported'
            ;

        //console.log( s ) ;
        //console.log( 'animationProperty -->', animationProperty );

        return animationProperty === 'no-supported' ? false : animationProperty;
    };

    /* From Modernizr */
    //function whichTransitionEvent(){
    function transitionEndName(){
        var t;
        var el = document.createElement('fakeelement');
        var transitions = {
          'transition':'transitionend',
          'OTransition':'oTransitionEnd',
          'MozTransition':'transitionend',
          'WebkitTransition':'webkitTransitionEnd'
        }

        for(t in transitions){
            if( el.style[t] !== undefined ){
                return transitions[t];
            }
        }
    };
    // function whichAnimationEvent(){
    //   var t,
    //       el = document.createElement("fakeelement");

    //   var animations = {
    //     "animation"      : "animationend",
    //     "OAnimation"     : "oAnimationEnd",
    //     "MozAnimation"   : "animationend",
    //     "WebkitAnimation": "webkitAnimationEnd"
    //   }

    //   for (t in animations){
    //     if (el.style[t] !== undefined){
    //       return animations[t];
    //     }
    //   }
    // }

    function animationCallback (id, options, callback) {
        // console.log('animationCallback',id)
        // console.log('animationCallback',options)
        // console.log('animationCallback',farm.o.animationEndName).  webkitAnimationDuration

        var elem = document.getElementById(id);

        // var gCS = getComputedStyle(elem);
        // console.log('.......'+farm.o.animationEndName + 'animation-duration')
        // console.log(gCS);


        if( getComputedStyle( elem )['animationDuration'] == '0s' ){

                // Make sure the callback is a function​
                if (typeof callback === "function") {
                // Call it, since we have confirmed it is callable​
                    //callback(options);
                    callback.apply(callback, options)
                }

        }
        else{

            var func = function(event) {
                    elem.removeEventListener(farm.o.animationEndName, func);
           
                    // Make sure the callback is a function​
                    if (typeof callback === "function") {
                    // Call it, since we have confirmed it is callable​
                        //callback(options);
                        callback.apply(this, options)
                    }
            };
            elem.addEventListener(farm.o.animationEndName, func, false);
        }
    };



    /********************************************/

    function storeLoad( key, value ){

        if(typeof( store.get(key) ) != 'object'){
            // ia -> informacion actividades
            // ep -> equivalencia papel
            store.set(key,value);

            storeGet(key);
        }
    };

    function storeGet( key ){
        //var x = store.get(key);
        //farm.o[key]= x;

        var get = localStorage.getItem( key );
        // console.log( 'typeof get: ',typeof( get ) )
        // console.log( 'typeof get: ', get )

        if(get){
            if(typeof( get ) == 'object'){
                    return get;
            }else{
                    return JSON.parse( get );  
            }
        }else{
            return false;
        }
    };
    
    function storeSet( key, value ){
        //store.set(key, value);
        //farm.o[key]= value;

        if(typeof( value ) == 'object'){

                var save = JSON.stringify( value );
        }else{
                var save = value;
        }
        localStorage.setItem( key, save );
    };
    function storeRemove( key ){

        localStorage.removeItem( key );
    };


    /********************************************/

    // get object of elements or form
    function formElements(form){
        var formElements=form;    
        var postData={};
        for (var i=0; i<formElements.length; i++){
            //we dont want to include the submit-buttom
            if (formElements[i].type!="submit"){
                postData[formElements[i].name]=formElements[i].value;
            }
        }
        return postData;        
    };





    function HTMLtitle ($name, $ns, $tpl){

        var txt = mr({
            ns    :$ns,
            tpl   :$tpl
        }); 

        var obj = templateToObj(txt);

        if(obj[$name]){
            document.title = obj[$name];
        }
        else{
            document.title = obj['titleDefault'];
        }

        //console.log(obj)
    }
    function navigator_language ($name, $ns, $tpl){

        var language = window.navigator.userLanguage || window.navigator.language;
        //works IE/SAFARI/CHROME/FF
        var idm = language.substring(0,2);
        

        var idioma = '';
     
        switch(idm) {
            case 'es':
                idioma = 'es';
                break;
            case 'ca':
                idioma = 'ca';
                break;
            // case 'en':
            //     idioma = 'en';
            //     break;
            default:
                idioma = 'es';
        }
        console.log('%c navigator.language : ', "background:green;color:white", language +' | '+idm +' | '+idioma);

        return idioma;
    };

    function createCookie(name,value,days,Domain) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
        var dom = '';
        if(Domain){

            dom = 'Domain='+Domain;
        }
        //console.log( name+"="+value+expires+"; "+dom+"; path=/;" )

        document.cookie = name+"="+value+expires+"; "+dom+"; path=/;";
    }

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    function eraseCookie(name) {
        createCookie(name,"",-1);
    }

    function cookies_policy( lang ){

        var copo = readCookie('cookies-policy') ? true : false;
        //console.log('%c cookies : ', "background:green;color:white", document.cookie );

        if(!copo){

            //console.log( document.getElementById('cookies-policy') )

            i18nInit(lang, 'pb', function(err, t){



                var bn = mr({ ns:'pb', tpl:tpl_cookies_policy, data:{lang:lang, route:routes_lang.init[lang]['pb']} });

                // http://clubmate.fi/append-and-prepend-elements-with-pure-javascript/
                var el = document.getElementById('farm-main');
                var elChild = document.createElement('section');
                elChild.innerHTML = bn;
                el.insertBefore(elChild.firstChild, el.firstChild);
      
                var ccp = document.getElementById('close-cookies-policy');

                ccp.addEventListener('click', function(){

                    createCookie('cookies-policy', 'true', 365, '.'+farm.r.domain);
                    var secopo = document.getElementById('cookies-policy');
                    el.removeChild(secopo);
                })
            })
        }
    }

	return {

        goToPage        :goToPage,
        changeURL       :changeURL,
        changeSection   :changeSection,

        mr                  :mr,
        templateToObj       :templateToObj,
        i18nInit            :i18nInit,

        folderURL       :folderURL,
        firstURL        :firstURL,

        parseQueryString    :parseQueryString,

        formElements        :formElements,

        HTMLtitle           :HTMLtitle,
        navigator_language  :navigator_language,

        createCookie        :createCookie,
        readCookie          :readCookie,
        eraseCookie         :eraseCookie,
        cookies_policy      :cookies_policy,

        storeLoad           :storeLoad,
        storeGet            :storeGet,
        storeSet            :storeSet,
        storeRemove         :storeRemove,

        decodeHTMLEntities  :decodeHTMLEntities,

        animationEndName    :animationEndName,
        transitionEndName   :transitionEndName,
        animationCallback   :animationCallback,
  	}
});

