module.exports = {
	start: function (io) {
		var self = this;
		
		io.set('log level', 0);
		io.sockets.on('connection', function (socket) {
			
			
			socket.on('message', function (msg) {
				var msg_obj = JSON.parse(raw_message);
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
				serialized_message = JSON.stringify({
					"user" : user,
					"action" : action,
					"identifier" : identifier,
					"message" : message,
					"timestamp" : timestamp,
					"channel" : channel
				});
				
				if (channel == "chatting") {
					self.service.chatting();
				}
				else if (chennel == "editing") {
					self.service.editing();
				}
				else if (chennel == "composing") {
					self.service.composing();
				}
				else if (chennel == "drawing") {
					self.service.drawing();
				}
			});
			

			
		}); 
		
		io.sockets.on('close', function (socket) {
			
		});
	},
	
	service: {
		chatting: function () {
			
		},
		
		editing: function () {
			
		},
		
		composing: function () {
			
		},
		
		drawing: function () {
			
		}
	}
};
