module.exports = {
	msg: function (socket, msg) {
		socket.broadcast.emit("editing_message", JSON.stringify(msg));
	}
};
