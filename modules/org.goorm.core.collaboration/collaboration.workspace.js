module.exports = {
	join: function (socket, msg) {
		socket.join(msg.workspace);
		socket.set('workspace', msg.workspace);
		
		socket.broadcast.emit("communication_someone_joined", msg.user);
	},
	
	leave: function (socket, msg) {
		socket.leave(msg.workspace);
		
		socket.broadcast.emit("communication_someone_leaved", msg.user);
		socket.broadcast.emit("editing_someone_leaved", msg.user);
	}
};
