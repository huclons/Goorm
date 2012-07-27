module.exports = {
	files: [],
	
	msg: function (socket, msg) {
		chatting_message = msg.user + " : " + msg.message; 
		
		socket.broadcast.emit("communication_message", chatting_message);
		socket.emit("communication_message", chatting_message);
	}
};
