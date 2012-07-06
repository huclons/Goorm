var pty = require('../../libs/pty/pty.js');

var socketio = require('socket.io')
  , express = require('express')
  , util = require('util')
  , app = express.createServer()
  , connect = require('connect');


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
		
		io.set('log level', 0);
		io.sockets.on('connection', function (socket) {
			socket.on('execute_command', function (command) {
				self.exec(command);
			});
			
			term.on('data', function (data) {
				var result = {};
				result.stdout = data;
				//evt.emit("executed_command", result);
				//console.log(data);
				socket.emit("command_result", result);
			});
		});
		

	},
	
	exec: function (command) {
		if (command.indexOf('\e[9') > -1) { //TAB
			term.write(command);
		}
		else {
			term.write(command + ' \r');
		}
	}
};
