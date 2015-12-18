var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var http= require('http'); 
// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.


//read through sites.txt file, convert buffer to an array of strings (w/ \n seperator)
archive.readListOfUrls(function (urlList) {
  var urlArray = urlList.split('\r\n');
  urlArray.pop();//Remove last \r\n
  console.log('what is this??',typeof urlList);
  urlArray.forEach(function (url) {
    archive.isUrlArchived(url, function (isHere) {
      if (!isHere) {
        console.log('we want this URL:', url );
        var stream = fs.createWriteStream('../archives/sites/' + url);
        http.get('http://' + url, function (res) {
          res.on('data', function (chunk) {
           stream.write(chunk); 
           stream.on('finish', function () {
             console.log('file has been written')
           });
           stream.end(); 
          });
        });
      }
    });
  });
});



//fs.mkdir(path[, mode], callback)#

//Asynchronous mkdir(2). No arguments other than a possible exception are given to the completion //callback. mode defaults to 0o777.

///////////////////////////////////////////////////////////////////

// fs.open(path, flags[, mode], callback)#

// Asynchronous file open. See open(2). flags can be:

// 'r' - Open file for reading. An exception occurs if the file does not exist.

// 'r+' - Open file for reading and writing. An exception occurs if the file does not exist.

// 'rs' - Open file for reading in synchronous mode. Instructs the operating system to bypass the local file system cache.

// This is primarily useful for opening files on NFS mounts as it allows you to skip the potentially stale local cache. It has a very real impact on I/O performance so don't use this flag unless you need it.

// Note that this doesn't turn fs.open() into a synchronous blocking call. If that's what you want then you should be using fs.openSync()

// 'rs+' - Open file for reading and writing, telling the OS to open it synchronously. See notes for 'rs' about using this with caution.

// 'w' - Open file for writing. The file is created (if it does not exist) or truncated (if it exists).

// 'wx' - Like 'w' but fails if path exists.

// 'w+' - Open file for reading and writing. The file is created (if it does not exist) or truncated (if it exists).

// 'wx+' - Like 'w+' but fails if path exists.

// 'a' - Open file for appending. The file is created if it does not exist.

// 'ax' - Like 'a' but fails if path exists.

// 'a+' - Open file for reading and appending. The file is created if it does not exist.

// 'ax+' - Like 'a+' but fails if path exists.

// mode sets the file mode (permission and sticky bits), but only if the file was created. It defaults to 0666, readable and writeable.

// The callback gets two arguments (err, fd).

// The exclusive flag 'x' (O_EXCL flag in open(2)) ensures that path is newly created. On POSIX systems, path is considered to exist even if it is a symlink to a non-existent file. The exclusive flag may or may not work with network file systems.

// flags can also be a number as documented by open(2); commonly used constants are available from require('constants'). On Windows, flags are translated to their equivalent ones where applicable, e.g. O_WRONLY to FILE_GENERIC_WRITE, or O_EXCL|O_CREAT to CREATE_NEW, as accepted by CreateFileW.

// On Linux, positional writes don't work when the file is opened in append mode. The kernel ignores the position argument and always appends the data to the end of the file.


// ///////////////////////////////////////////////////////////////////////////////

// //Ideas on how to download url: 
//   //get request to url
//     //grab data from response

// // fs.writeFile('message.txt', 'Hello Node.js', function (err) {
// //   if (err) throw err;
// //   console.log('It\'s saved!');
// // });

// // http.get("http://www.google.com/index.html", function(res) {
// //   console.log("Got response: " + res.statusCode);
// //   // consume response body
// //   res.resume();
// // }).on('error', function(e) {
// //   console.log("Got error: " + e.message);
// // });


// //   req.on('data', function(chunk){
// //       targetUrl+=chunk; 
// //       targetUrl= targetUrl.replace('url=',''); 
// //       console.log('data', targetUrl);
// //     }); 