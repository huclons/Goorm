var sys = require('sys');
var pty = require('../../libs/pty/pty.js');

var socketio = require('socket.io')
  , express = require('express')
  , util = require('util')
  , app = express.createServer()
  , connect = require('connect')
  , parseCookie = connect.utils.parseCookie
  , MemoryStore = connect.middleware.session.MemoryStore
  , store;


var term = pty.spawn('bash', [], {
	name: 'xterm-color',
	cols: 80,
	rows: 30,
	cwd: process.env.HOME,
	env: process.env
});


module.exports = {
	start: function (app) {
		var self = this;
		
		var io = socketio.listen(app);
		
		io.set('log level', 2);
		/*
		io.set('authorization', function (data, accept) {
			if (!data.headers.cookie) 
				return accept('No cookie transmitted.', false);
		
			data.cookie = parseCookie(data.headers.cookie);
			data.sessionID = data.cookie['express.sid'];
		
			store.load(data.sessionID, function (err, session) {
				if (err || !session) return accept('Error', false);
		
				data.session = session;
				return accept(null, true);
			});
		});
		*/
		io.sockets.on('connection', function (socket) {
			/*
			var sess = socket.handshake.session;
			
			console.log("asdf");
			
			socket.log.info(
				'a socket with sessionID'
				, socket.handshake.sessionID
				, 'connected'
			);
			
			console.log("asdf");
			*/
			
			socket.on('execute_command', function (command) {
				self.exec(command, socket);
			});
		});
	},
	
	exec: function (command, socket) {
		term.on('data', function (data) {
			var result = {};
			result.stdout = data;
			//evt.emit("executed_command", result);
			socket.emit("command_result", result);
		});
		
		term.write(command + ' /\r');
		//term.end();
	}
};
