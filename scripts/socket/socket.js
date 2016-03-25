// sockets.js
var socketio = require('socket.io')
var User = require('../models/Users');
var Post = require('../models/Posts');
var fs = require('fs');
var path = require('path');

module.exports.listen = function(app){
    io = socketio.listen(app)

	io.on('connection', function(socket) {
  		console.log("A User Connected");

  		socket.on('chat message', function(data) {
  			console.log(data.user + ': ' + data.msg);
    		io.emit('chat message', data.msg, data.user);
  		});

  		socket.on('create', function(data, buffer) {
        function genKey() {
          function s4() {
            var temp = (Math.floor(Math.random()*20));
            console.log("TEMP: " + temp);
            return temp;
          }
          return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4()
           + '-' + s4() + s4() + s4();
        }

        var newPost = new Post();

        if (data.post.isImage == true) {
          var imageID = genKey();
          var desiredPath = path.resolve('../lib/images/' + imageID);
          console.log(data.post.content);

          var fileName = path.resolve(__dirname, '../../lib/images/' + imageID);
          console.log(fileName);

          fs.open(fileName, 'a', 0755, function(err, fd) {
            if (err) throw err;

            fs.write(fd, buffer, null, 'Binary', function(err, written, buf) {
              fs.close(fd, function() {
                console.log("File saved successful!");
              })
            })
          })
          
          newPost.content = path.resolve(__dirname, '../../lib/images/' + imageID);

        } else {
          newPost.content = data.post.content;
        }
  			console.log("Creating " + data.post.title);

  			
  			newPost.title = data.post.title;
        newPost.date = data.post.date;
        newPost.postedOn = new Date();
        newPost.upvotes = 0;
        newPost.comments = [];
        newPost.tags = data.post.tags;

			newPost.save(function(err) {
				if (err)
					throw err;
				socket.emit('createFin', newPost);
			});
  		});


  		socket.on('disconnect', function() {
    		console.log("A User Disconnected");
  		});

	});

    return io;
}