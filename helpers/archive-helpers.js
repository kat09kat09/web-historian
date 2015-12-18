var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var httpHelpers= require('../web/http-helpers.js'); 
/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){

  fs.readFile('../archives/sites.txt', function (err, data) {
    if (err) console.log(err); 
    urlList = data.toString('ascii'); 
    callback(urlList); 

  }); 

};

exports.isUrlInList = function (targetUrl, cb) {
  exports.readListOfUrls(function (urlList) {
    cb(urlList.search(targetUrl)); 
  }); 
};

exports.addUrlToList = function (targetUrl) {
  fs.appendFile('../archives/sites.txt', targetUrl + '\r\n', function (err) {
    if (err) {
      console.log(err);
    }
  });
};

exports.isUrlArchived = function (targetUrl, callback) {
  var isHere = true;
  fs.readFile('../archives/sites/' + targetUrl, function (err) {
    if (err) {
      isHere = false;
    }
    callback(isHere); 

    });
};

exports.downloadUrls = function (res, targetValue) {
  console.log('gets to downloadUrls');
  exports.isUrlInList(targetValue, function (idxOfMatch){
    if(idxOfMatch >-1) {
      //found it
      exports.isUrlArchived(targetValue, function (isHere) {
        if (isHere) {
        console.log('option a')
        //serve the file from the sites folder
        httpHelpers.serveAssets(res, '../archives/sites/' + targetValue, function () {
          console.log('sent ', targetFile); 
        }, 200, 'served archived file');
        } else {
          console.log('optionb')
          //serve loading.html
          httpHelpers.serveAssets(res, './public/loading.html', function () {
            console.log('sent loading.html'); 
          }, 202, 'working on archiving that file');
        }
      });  
    } else {
      //didn't find it
      console.log('option2')
      exports.addUrlToList(targetValue);
    }
  }); 
  // if (exports.isUrlInList()) {
  //   console.log('option1')
  //   if (exports.isUrlArchived()) {
  //     console.log('option a')
  //     //serve the file from the sites folder
  //     httpHelpers.serveAssets(res, '../archives/sites/' + targetValue, function () {
  //       console.log('sent ', targetFile); 
  //     }, 200, 'served archived file');
  //   } else {
  //     console.log('optionb')
  //     //serve loading.html
  //     httpHelpers.serveAssets(res, './public/loading.html', function () {
  //       console.log('sent loading.html'); 
  //     }, 202, 'working on archiving that file');
  //   }
  // } else {
  //   console.log('option2')
  //   exports.addUrlToList(targetValue);
  // }
};
