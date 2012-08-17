var pty = require('../../libs/pty/pty.js');


module.exports = {
	start: function (io) {
		var self = this;
		
		io.set('log level', 0);
		io.sockets.on('connection', function (socket) {
			
			
			var term = pty.spawn('bash', [], {
				name: 'xterm-color',
				cols: 80,
				rows: 30,
				cwd: process.env.HOME,
				env: process.env
			});
			
			socket.on('communication_someone_joined', function (msg) {
				msg = JSON.parse(msg);
				
				socket.join(msg.workspace);
			});
			
			socket.on('communication_someone_leaved', function (msg) {
				msg = JSON.parse(msg);
				
				socket.leave(msg.workspace);
			});

			socket.on('pty_execute_command', function (command) {
				self.exec(term, command);
			});
			
			socket.on('change_project_dir', function (project_path) {
				term.write("cd " + global.__path + "workspace/" + project_path  + "\r");
				term.write("clear\r");
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
	
	exec: function (term, command) {
		if (command.indexOf(/cd */) > -1) {
			//do nothing...
		}
		else if (command.indexOf('\t') > -1) { //TAB
			term.write(command);
		}
		else {
			term.write(command + ' \r');
		}
	}
};
