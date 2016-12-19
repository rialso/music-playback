 


//require('../../lib/utils/load-data.js');

//console.log('-----------@@@@@@@@@@@@@@@@@--------------')

exports.call_load_data = function(){

    var show_console = true;

    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ call_load_data @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')



    var process = require('child_process');



    // var child = process.spawn('node', ['./lib/utils/load-data.js']);

    var child = process.exec('node  ./server/lib/utils/load-data.js');

    //var child = process.exec('node  ./load-data.js');



    child.stdout.on('data', function (data) {
      //if(show_console) console.log('stdout: \n' + data);
      if(show_console) console.log('stdout: '+ data);
    });

    child.stderr.on('data', function (data) {
      if(show_console) console.log('stderr: \n' + data);
    });

    child.on('exit', function (code) {
      if(show_console) console.log('child process exited with exxxxxit code --> ' + code);
    });

    child.on('close', function (code) {
      if(show_console) console.log('child process exited with code --> ' + code);
    });
}
