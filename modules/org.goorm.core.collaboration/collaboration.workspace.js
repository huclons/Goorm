module.exports = {
	join: function (socket, msg) {
		socket.join(msg.workspace);
		socket.set('workspace', msg.workspace);
		
		socket.broadcast.emit("communication_someone_joined", msg.user);
	}
};
