// INIT
var Discordie = require("discordie");
var client = new Discordie({autoReconnect: true});

var fs = require('file-system');

var express = require('express');
var app = express();

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
	var args = e.message.split(" ");
	
	//	PING
	if(args[0].toLocaleLowerCase() == "ping") e.message.channel.sendMessage("pong");

	//	TRANSFORM
	
	if(args[0].toLocaleLowerCase() == "transform") {
		var success = false;
		
		switch(args[1].toLocaleLowerCase()) {
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