var path = require('path');
var archive = require('../helpers/archive-helpers');
var url= require('url'); 
var httpHelpers= require('./http-helpers.js'); 
var fs= require('fs');
// require more modules/folders here!

var actions= {
  'GET': function (req, res) {
    var params= url.parse(req.url, false).path; 
    // var params= url.parse(req.url, true).query; 
    if(params= '/') {
      httpHelpers.serveAssets(res, './public/index.html', function () {
        console.log('sent assets'); 
      },200, 'sent assets'); 
    }
  },
  'POST': function (req, res) {
    console.log('post request'); 
    var targetUrl=''

    req.on('data', function(chunk){
      targetUrl+=chunk; 
      targetUrl= targetUrl.replace('url=',''); 
      console.log('data', targetUrl);
    }); 

    req.on('end', function (){
      archive.downloadUrls(res, targetUrl); 
    }); 
    console.log('there was a post request'); 
  },
  'OPTIONS': function (){

  },
}

//get/post/etc handlers will be place here
exports.handleRequest = function (req, res) {
  //handles incoming requests
  actions[req.method](req,res); 
  // res.end(archive.paths.list);
};
