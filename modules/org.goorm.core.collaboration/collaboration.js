var users = require('./collaboration.users.js');
var workspace = require('./collaboration.workspace.js');
var communication = require('./collaboration.communication.js');
var editing = require('./collaboration.editing.js');
var composing = require('./collaboration.composing.js');
var drawing = require('./collaboration.drawing.js');


module.exports = {
	start: function (io) {
		var self = this;
		
		
		
		io.set('log level', 0);
		io.sockets.on('connection', function (socket) {
			
			
			socket.on('message', function (raw_msg) {
				var msg_obj = JSON.parse(raw_msg);
				
				var channel = "";
				var messgae = "";
				var identifier = "";
				var action = "";
				var user = "";

				if(msg_obj["channel"] != undefined) {
					channel = msg_obj["channel"];
				}
				
				if(msg_obj["message"] != undefined) {
					message = msg_obj["message"];
				}
				
				if(msg_obj["identifier"] != undefined) {
					identifier = msg_obj["identifier"];
				}
				
				if(msg_obj["action"] != undefined) {
					action = msg_obj["action"];
				}
				
				if(msg_obj["user"] != undefined) {
					user = msg_obj["user"];
				}
				else {
					user = this.user_id;
				}
					
				var timestamp = new Date().getTime();
				
				if (channel == "workspace") {
					workspace.join(socket, msg_obj);
				}
				if (channel == "communication") {
					communication.msg(socket, msg_obj);
				}
				else if (channel == "editing") {
					editing.msg(socket, msg_obj);
				}
				else if (channel == "composing") {
					composing.msg(socket, msg_obj);
				}
				else if (channel == "drawing") {
					drawing.msg(socket, msg_obj);
				}
			});
		}); 
		
		io.sockets.on('close', function (socket) {
			
		});
	}
};
