module.exports = {
	workspaces: [],
	
	join: function (socket, msg_obj) {
		socket.join(msg_obj.workspace);
		socket.set('workspace', msg_obj.workspace);
		
		//workspaces.push({name:msg_obj.workspace, :msg_obj.});
		
		socket.broadcast.emit("communication_someone_joined", msg_obj.user);
	}
};
