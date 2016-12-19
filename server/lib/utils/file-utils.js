

/*

http://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search/5827895#5827895

There are basically two ways of accomplishing this.
In an async environment you'll notice that there are two kinds of loops: serial and parallel.
A serial loop waits for one iteration to complete before it moves onto the next iteration
 - this guarantees that every iteration of the loop completes in order. In a parallel loop, 
 all the iterations are started at the same time, and one may complete before another, 
 however, it is much faster than a serial loop. 
 So in this case, it's probably better to use a parallel loop because it doesn't matter 
 what order the walk completes in, just as long as it completes and returns 
 the results (unless you want them in order).
*/


//A parallel loop would look like this:
exports.getLocalFiles_p = function (dir, suffix, callback) {

    var fs   = require('fs');
    var path = require('path');

    var walk = function(dir, done) {
      var results = [];
      fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function(file) {
          file = path.resolve(dir, file);
          fs.stat(file, function(err, stat) {
            if (stat && stat.isDirectory()) {
              walk(file, function(err, res) {
                results = results.concat(res);
                if (!--pending) done(null, results);
              });
            } else {
              results.push(file);
              if (!--pending) done(null, results);
            }
          });
        });
      });
    };

    walk(dir, function(err, results) {
        if (err) throw err;
        //console.log(results);
        var filterRes = [];
        var res = results;
        var count = 0;
        for(var i in res) {
            if( res.hasOwnProperty( i ) ) {
                if( path.extname(res[i]).match(suffix)){
                    filterRes.push(res[i])

                    //console.log(res[i]);

                    //if(path.extname(res[i]) === ".mp3" || path.extname(res[i]) === ".m4a") {

                    //console.log(res[i]);
                    //console.log(count+' | '+res[i]);

                    count ++;
                }
            }
        }
        callback(err, filterRes)
    });
};

//A serial loop would look like this:
exports.getLocalFiles_s = function (dir, suffix, callback) {

    var fs   = require('fs');
    var path = require('path');


    var walk = function(dir, done) {
        var results = [];
          fs.readdir(dir, function(err, list) {
            if (err) return done(err);
            var i = 0;
            (function next() {
              var file = list[i++];
              if (!file) return done(null, results);
              file = dir + '/' + file;
              fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                  walk(file, function(err, res) {
                    results = results.concat(res);
                    next();
                  });
                } else {
                  results.push(file);
                  next();
                }
              });
            })();
        });
    };

    walk(dir, function(err, results) {
        if (err) throw err;
        //console.log(results);

        var filterRes = [];
        var res = results;
    
        var count = 0;
        for(var i in res) {
            if( res.hasOwnProperty( i ) ) {
                if( path.extname(res[i]).match(suffix)){
                    filterRes.push(res[i])

                    //console.log(res[i]);
                    //console.log(count+' | '+res[i]);

                    count ++;
                }
            }
        }
        callback(err, filterRes)
    });
};

/*******





*********/

/*
    MediaCenterJS - A NodeJS based mediacenter solution

    Copyright (C) 2014 - Jan Smolders

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/


/* Global imports */
//var _ = require('underscore'),
//logger = require('winston');

/**
 Reads a folder and writes all files to a json
 @param dir         string, Directory with files
 @param suffix      The file suffix
 @param callback    The Callback function
 */
exports.getLocalFiles = function (dir, suffix, callback) {
    var walk = require('walk'),
        path = require('path');

    var walker = walk.walk(dir);
    var returnFiles = [];
    var uniqueFileNames = {};
    walker.on('file', function(root, fileStat, next) {
        var filePath = path.join(root, fileStat.name);
        root = path.normalize(root);
        if (fileStat.name.match(suffix)) {
            var fileObject = { 'href': filePath, 'dir': root, 'file': fileStat.name };
            if (!uniqueFileNames.hasOwnProperty(fileObject.file)) {
                returnFiles.push(fileObject);
                uniqueFileNames[fileObject.file] = true;
            }
        }

        next();
    });

    walker.on('end', function(err) {
        callback(err, returnFiles);
    });
};

/**
 Reads a folder and writes all files to a json
 @param dir         string, Directory with files
 @param filename    The filename to search for
 @param callback    The Callback function
 */
exports.getLocalFile = function (dir, filename, callback) {
    this.getLocalFiles(dir, '', function(err, returnFiles) {
        var foundFile = false;
        _.forEach(returnFiles, function(file) {
            if (file.file === filename) {
                callback(err, file);
                foundFile = true;
            }
        });
        if (!foundFile) {
            callback(err, null);
        }
    });
};

/**
 Removes corrupted directories.
 @param checkDir         dir to check
 @param callback        The Callback
 */
exports.removeBadDir = function (checkDir, callback){
    var rimraf = require('rimraf'),
        async  = require('async');

    rimraf(checkDir, function (err) {
        if(!err){
            setTimeout(function(){
                /* Send string to client to trigger reload of bad item */
                callback('bad dir');
            },1000);
        } else {
            logger.error('Removing dir error:', err );
        }
    });
};

exports.downloadFile = function (src, output, options, callback){
    var wget = require('wget');
    var download = wget.download(src, output, options);
    download.on('error', function(err) {
        logger.error('Error', err);
        callback();
    });
    download.on('end', function(output) {
        logger.info('File downloaded succesfully...');
        setTimeout(function(){
            callback(output);
        },3000);
    });
    download.on('progress', function(progress) {
        logger.info(progress);
    });
}
