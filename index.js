// INIT
var Discordie = require("discordie");
var client = new Discordie({autoReconnect: true});

var fs = require('file-system');

var express = require('express');
var app = express();

var key = "~";

//
// WEBPAGE
//
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


//
// WEB->DISCORD
//
function disconnect() {
    client.disconnect();
}

//
// DISCORD
//
client.connect({
  token: process.env.BOT_SECRET
});

client.Dispatcher.on("GATEWAY_READY", e => {
  console.log("Connected as: " + client.User.username);
});

client.Dispatcher.on("MESSAGE_CREATE", e => {
    if(e.message.author == client.User.id) return;
    
    var msg = e.message.content;
    if(msg.length == 0) return;
    
    var keyCheck = msg.slice(0, key.length);
    //console.log("key?:" + keyCheck);
    if(keyCheck != key) return;
    
    msg = msg.slice(key.length, msg.length);
	var args = msg.split(" ");
    //console.log("args0?:" + args[0]);
    
	//	PING
	if(args[0].toLocaleLowerCase() == "ping") {
        console.log("replying to ping...");
        e.message.channel.sendMessage("pong");
    }

	//	TRANSFORM
	if(args[0].toLocaleLowerCase() == "transform") {
		var success = false;
		
        if(args.length < 2){
            e.message.channel.sendMessage("is confused?");
            return;
        }
        
        var transformTarget = args[1].toLocaleLowerCase();
        
		switch(transformTarget) {
			case "bulbasaur":
				client.User.setAvatar(fs.readFileSync(__dirname + "/public/dd_bulbasaur.jpg"));
				success = true;
				break;
			case "ditto":
				client.User.setAvatar(fs.readFileSync(__dirname + "/public/dd_ditto.jpg"));
				success = true;
				break;
			default:
				break;
		}
		
		if(success) {
			e.message.channel.sendMessage("is transforming...");
		} else {
			e.message.channel.sendMessage("hasn't learnt that form...");
		}
	}
    
    // DISCONNECT
    if(args[0].toLocaleLowerCase() == "disconnect") {
        client.disconnect();
    }
});