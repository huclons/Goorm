var EventEmitter = require("events").EventEmitter;

module.exports = {
	join: function (io, socket, msg) {
		socket.join(msg.workspace);
		
		var index = 0;
		
		if ((index = this.workspaces.inArray(msg.workspace)) > -1) {
			var data = '{"user":"'+msg.user+'", "nick":"'+msg.nick+'", "type":"'+msg.type+'"}';
			
			if(this.users[index].list.inArray(data) == -1)
				this.users[index].list.push(data);
		}
		else {
			this.workspaces.push(msg.workspace);
			this.users.push({workspace:msg.workspace, list:[]});
			this.users[this.users.length-1].list.push('{"user":"'+msg.user+'", "nick":"'+msg.nick+'", "type":"'+msg.type+'"}');
			index = this.users.length - 1;
		}
		
		var return_msg = {
			user: msg.user,
			nick: msg.nick,
			type: msg.type,
			list: this.users[index].list,
			workspace : msg.workspace
		};

		// socket.broadcast.to(msg.workspace).emit("communication_someone_joined", JSON.stringify(return_msg));
		// socket.emit("communication_someone_joined", JSON.stringify(return_msg));
		io.sockets.in(msg.workspace).emit("communication_someone_joined", JSON.stringify(return_msg))
	},
	
	msg: function (io, socket, msg) {
		//socket.broadcast.to(msg.workspace).emit("workspace_message", JSON.stringify(msg));
		io.sockets.in(msg.workspace).emit("workspace_message", JSON.stringify(msg));
	},
	
	leave: function (io, socket, msg) {
		socket.leave(msg.workspace);
		var index = 0;
		
		if ((index = this.workspaces.inArray(msg.workspace)) > -1) {
			var user_index = 0;

			if ((user_index = this.users[index].list.inArray('{"user":"'+msg.user+'", "nick":"'+msg.nick+'", "type":"'+msg.type+'"}')) > -1) {
				this.users[index].list.remove(user_index);
			
				var return_msg = {
					user: msg.user,
					nick: msg.nick,
					type: msg.type,
					list: this.users[index].list,
					workspace : msg.workspace
				};

				//socket.broadcast.to(msg.workspace).emit("communication_someone_leaved", JSON.stringify(return_msg));
				io.sockets.in(msg.workspace).emit("communication_someone_leaved", JSON.stringify(return_msg));
			}
		}

		//socket.broadcast.to(msg.workspace).emit("editing_someone_leaved", msg.nick);
		io.sockets.in(msg.workspace).emit("editing_someone_leaved", msg.nick);
	},

	invite : function(io, socket, msg){

		function send_message(data){
			// var messagedata = {
			// 	'type' : 'invite_user',
			// 	'from' : [{
			// 		'id':msg.user_id,
			// 		'type':msg.user_type
			// 	}],
			// 	'to' : [{
			// 		'id':data.user.id,
			// 		'type':data.user.type
			// 	}],
			// 	'data' : {
			// 		'author_id' : msg.user_id,
			// 		'author_type' : msg.user_type,
			// 		'project_path' : msg.project_path,
			// 		'project_name' : msg.project_name,
			// 		'project_type' : msg.project_type,
			// 		'state' : 'sent'
			// 	},
			// 	'checked' : true
			// }

			// message.add(messagedata);

			var return_msg = {
				'author_id' : msg.user_id,
				'author_type' : msg.user_type,
				'project_path' : msg.project_path,
				'project_type' : msg.project_type,
				'project_name' : msg.project_name,
				'state' : 'sent'
			}

			io.sockets.sockets[data.client.id].emit("invitation_message", JSON.stringify(return_msg));
		}

		function push_message(data){
			var messagedata = {
				'type' : 'invite_user',
				'from' : [{
					'id':msg.user_id,
					'type':msg.user_type
				}],
				'to' : [{
					'id':data.user.id,
					'type':data.user.type
				}],
				'data' : {
					'author_id' : msg.user_id,
					'author_type' : msg.user_type,
					'project_path' : msg.project_path,
					'project_name' : msg.project_name,
					'project_type' : msg.project_type,
					'state' : 'sent'
				},
				'checked' : false
			}

			message.add(messagedata);
		}

		communication.is_connected(io, msg.invite_list, send_message, push_message)
	},

	invitation_answer : function(io, socket, msg){

		function send_message(data){
			var messagedata = {
				'type' : 'invite_answer',
				'from' : [{
					'id':msg.user_id,
					'type':msg.user_type
				}],
				'to' : [{
					'id':data.user.id,
					'type':data.user.type
				}],
				'data' : {
					'answerer_id' : msg.user_id,
					'answerer_type' : msg.user_type,
					'project_path' : msg.project_path,
					'project_name' : msg.project_name,
					'project_type' : msg.project_type,
					'state' : msg.state
				},
				'checked' : true
			}

			message.add(messagedata);

			var return_msg = {
				'answerer_id' : msg.user_id,
				'answerer_type' : msg.user_type,
				'project_path' : msg.project_path,
				'project_name' : msg.project_name,
				'project_type' : msg.project_type,
				'state' : msg.state
			}

			io.sockets.sockets[data.client.id].emit("invitation_message_answer", JSON.stringify(return_msg));
		}

		function push_message(data){
			var messagedata = {
				'type' : 'invite_answer',
				'from' : [{
					'id':msg.user_id,
					'type':msg.user_type
				}],
				'to' : [{
					'id':data.user.id,
					'type':data.user.type
				}],
				'data' : {
					'answerer_id' : msg.user_id,
					'answerer_type' : msg.user_type,
					'project_path' : msg.project_path,
					'project_name' : msg.project_name,
					'project_type' : msg.project_type,
					'state' : msg.state
				},
				'checked' : false
			}

			message.add(messagedata);
		}

		communication.is_connected(io, msg.invite_answer_list, send_message, push_message)
	}
};
