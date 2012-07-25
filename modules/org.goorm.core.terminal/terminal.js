var pty = require('../../libs/pty/pty.js');

var term = pty.spawn('bash', [], {
	name: 'xterm-color',
	cols: 80,
	rows: 30,
	cwd: process.env.HOME,
	env: process.env
});


module.exports = {
	start: function (io) {
		var self = this;
		
		io.set('log level', 0);
		io.sockets.on('connection', function (socket) {
			socket.on('pty_execute_command', function (command) {
				self.exec(command);
			});
			
			term.on('data', function (data) {
				var result = {};
				result.stdout = data;
				//evt.emit("executed_command", result);
				//console.log(data);
				socket.emit("pty_command_result", result);
			});
		});
	},
	
	exec: function (command) {
		if (command == '^C') {
			term.write(command);
		}
		else if (command.indexOf('\t') > -1) { //TAB
			term.write(command);
		}
		else {
			term.write(command + ' \r');
		}
	}
};
