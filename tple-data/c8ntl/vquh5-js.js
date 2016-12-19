
//console.log(vvd_icons2)


var icn = music_playback.icons;

var tplil = '';

for(var i=0;i<icn.length;i++){
    //console.log(-i)

    var logoName = icn[i].properties.name;
  
  console.log('logoName: ',logoName )


    tplil += '<div class="font-icon-list">';
    tplil +=    '<div class="font-icon-detail">';
    tplil +=        '<div class="icon-'+logoName+' icons" farm-icon="#icon-'+logoName+'"></div>';
    tplil +=        '<input type="text" value="icon-'+logoName+'" class="font-icon-name">';
    tplil +=    '</div>'
    tplil += '</div>';


        }
var icons_list = document.getElementById("icons-list");
farm_icons.load(icons_list, tplil);

///////////////////////////////////////

/*
var logos = vvd_logos.icons;


var tplil = '';

for(var i=0;i<logos.length;i++){
    //console.log(-i)

    var logoName = logos[i].properties.name;
  
  console.log('logoName: ',logoName )


    tplil += '<div class="font-icon-list">';
    tplil +=    '<div class="font-icon-detail">';
    tplil +=        '<div class="icon-'+logoName+' icons" farm-icon="#icon-'+logoName+'"></div>';
    tplil +=        '<input type="text" value="icon-'+logoName+'" class="font-icon-name">';
    tplil +=    '</div>'
    tplil += '</div>';


        }
var logos_list = document.getElementById("logos-list");


console.log('tplil', tplil)
farm_icons.load(logos_list, tplil);

*/