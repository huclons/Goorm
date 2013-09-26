/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jshint newcap:false, debug:true, unused: true, evil: true, devel: true, node: true, plusplus: false, undef: false */
/*serverside jslint comment for global */
/*global __redis_mode: false, __workspace: false, __service_mode: false */
/*jshint unused: false */




//useonly(mode=basic)
if (/v0.10/.test(process.version)) {
	var pty = require('../../libs/core/pty/ver_0.10/pty.js');
} else {
	var pty = require('../../libs/core/pty/ver_0.8/pty.js');
}
//useonlyend

var os = require('os');
var platform = null;
if (/darwin/.test(os.platform())) {
	platform = "darwin";
} else if (/linux/.test(os.platform())) {
	platform = "linux";
} else {}

module.exports = {
	term: {},
	io: null,

	init: function (user_id) {
		if (!this.term[user_id]) {
			this.term[user_id] = [];
		}
	},

	start: function (io) {
		var self = this;

		

		//useonly(mode=basic)
		self.term = [];
		//useonlyend

		this.io = io;

		io.set('log level', 0);
		io.sockets.on('connection', function (socket) {
			socket.on('terminal_init', function (msg) {
				msg = JSON.parse(msg);

				var uid, gid;
				var data;
				

				//useonly(mode=basic)
				self.term.push({
					pty: pty.spawn('bash', [], {
					// var command = "-p 1234 ssh -p StrictHostKeyChecking=no nys3909@localhost";
					// pty: pty.spawn('sshpass', command.split(' '), {
						name: 'xterm-color',
						cols: parseInt(msg.cols, 10),
						rows: 30,
						cwd: process.env.HOME,
						env: process.env
					}),
					workspace: msg.workspace,
					terminal_name: msg.terminal_name,
				});

				self.term[self.term.length - 1].pty.on('data', function (data) {
					var result = {};
					result.stdout = data;
					result.terminal_name = msg.terminal_name;
					result.user = msg.user;
					io.sockets. in (msg.workspace + '/' + msg.terminal_name + '/' + msg.index).emit("pty_command_result", result);
				});

				data = {
					index: self.term.length - 1,
					timestamp: msg.timestamp
				};
				msg.index = data.index;
				socket.join(msg.workspace + '/' + msg.terminal_name + '/' + msg.index);
				socket.to().emit("terminal_index", JSON.stringify(data));
				socket.to().emit("platform", JSON.stringify({
					"platform": platform
				}));
				//useonlyend
			});

			socket.on('terminal_join', function (msg) {
				/*
				 * msg = { index, user}
				 */
				 var data;
				 

				//useonly(mode=basic)
				if (self.term[msg.index].pty.socket.readable) {
					self.term[msg.index].pty.on('data', function (data) {
						var result = {};
						result.stdout = data;
						result.terminal_name = msg.terminal_name;
						result.user = msg.user;

						io.sockets. in (msg.workspace + '/' + msg.terminal_name + '/' + msg.index).emit("pty_command_result", result);
					});

					data = {
						index: msg.index,
						timestamp: msg.timestamp
					};

					socket.join(msg.workspace + '/' + msg.terminal_name + '/' + msg.index);
					socket.to().emit("terminal_index", JSON.stringify(data));
				}
				//useonlyend
			});

			socket.on('terminal_resize', function (msg) {
				msg = JSON.parse(msg);

				

				//useonly(mode=basic)
				if (self.term[msg.index] && self.term[msg.index].pty && self.term[msg.index].pty.readable) {
					self.term[msg.index].pty.resize(parseInt(msg.cols, 10), parseInt(msg.rows, 10));
				}
				//useonlyend
			});

			socket.on('terminal_refresh', function (msg) {
				var target_terminal;
				msg = JSON.parse(msg);

				

				//useonly(mode=basic)
				if (self.term[msg.index] && self.term[msg.index].pty) {
					target_terminal = self.term[msg.index];
					self.term[msg.index].pty.destroy();
					self.term[msg.index].pty.kill('SIGKILL');

					self.term[msg.index] = {
						pty: pty.spawn('bash', [], {
							name: 'xterm-color',
							cols: parseInt(msg.cols, 10),
							rows: 30,
							cwd: process.env.HOME,
							env: process.env
						}),
						workspace: msg.workspace,
						terminal_name: msg.terminal_name
					};

					self.term[msg.index].pty.on('data', function (data) {
						var result = {};
						result.stdout = data;
						result.terminal_name = msg.terminal_name;
						result.user = msg.user;

						io.sockets. in (msg.workspace + '/' + msg.terminal_name + '/' + msg.index).emit("pty_command_result", result);
					});

					socket.join(msg.workspace + '/' + msg.terminal_name + '/' + msg.index);
					socket.to().emit('terminal_refresh_complete');
				}
				//useonlyend
			});

			socket.on('terminal_leave', function (msg) {
				msg = JSON.parse(msg);

				socket.leave(msg.workspace + '/' + msg.terminal_name + '/' + msg.index);


				

				//useonly(mode=basic)
				if (self.term[msg.index] && self.term[msg.index].pty) {
					self.term[msg.index].pty.destroy();
					self.term[msg.index].pty.kill('SIGKILL');
				}
				//useonlyend
			});

			socket.on('pty_execute_command', function (msg) {
				msg = JSON.parse(msg);
				var do_exec = function (msg) {
					

					//useonly(mode=basic)
					if (self.term[msg.index] && self.term[msg.index].pty) {
						self.exec(self.term[msg.index].pty, msg.command, msg.special_key);
					}
					//useonlyend
				};

				setTimeout(do_exec(msg), 100);
			});

			socket.on('change_project_dir', function (msg) {
				msg = JSON.parse(msg);

				

				//useonly(mode=basic)
				if (self.term[msg.index] && self.term[msg.index].pty) {
					self.term[msg.index].pty.write("cd " + __workspace + msg.project_path + "\r");
					socket.to().emit("on_change_project_dir", msg);
				}
				//useonlyend
			});

		});
	},

	exec: function (term, command, special_key) {
		if (term) {
			if (special_key) { //Special Key
				term.write(command);
			} else {
				term.write(command);
			}
		} else {}
	},

	
};
