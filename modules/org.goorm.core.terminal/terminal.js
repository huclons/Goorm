/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

if(/v0.10/.test(process.version)){
	var pty = require('../../libs/pty/ver_0.10/pty.js');
}
else{
	var pty = require('../../libs/pty/ver_0.8/pty.js');
}

var os = require('os');
var platform = null;
if(/darwin/.test(os.platform())) {
	platform = "darwin";
}
else if(/linux/.test(os.platform())) {
	platform = "linux";
}
else {
}

var term = [];
module.exports = {
	start: function (io) {
		var self = this;
		
		io.set('log level', 0);
		io.sockets.on('connection', function (socket) {
			socket.on('terminal_init', function (msg) {
				msg = JSON.parse(msg);
				
				term.push({
					pty : pty.spawn('bash', [], {
						name: 'xterm-color',
						cols: parseInt(msg.cols),
						rows: 30,
						cwd: process.env.HOME,
						env: process.env
					}),
					workspace: msg.workspace,
					terminal_name: msg.terminal_name,
				});
				
				var toHex = function (str) {
				    var hex = '';
				    for(var i=0;i<str.length;i++) {
				        hex += ' 0x'+str.charCodeAt(i).toString(16);
				    }
				    return hex;
				}
				
				term[term.length-1].pty.on('data', function (data) {
					var result = {};
					result.stdout = data;
					result.terminal_name = msg.terminal_name;
					result.user = msg.user;
					
//					console.log("on data : " + msg.workspace + '/' + msg.terminal_name);
					// console.log("data: " + data);
					// console.log("hex: " + toHex(data));
					
					//console.log(result.stdout);
//					io.sockets.in("terminal/"+msg.user+"/"+msg.index).emit("pty_command_result", result);
//					socket.emit("pty_command_result", result);
					io.sockets.in(msg.workspace + '/' + msg.terminal_name + '/' + msg.index).emit("pty_command_result", result);
				});

				var data = {
					index: term.length - 1,
					timestamp: msg.timestamp
				};
				msg.index = data.index;
				socket.join(msg.workspace + '/' + msg.terminal_name + '/' + msg.index);
//				socket.join("terminal/"+msg.user+"/"+msg.index);
				socket.to().emit("terminal_index", JSON.stringify(data));
				socket.to().emit("platform", JSON.stringify({"platform":platform}));
			});
			
			socket.on('terminal_join', function (msg) {
				/*
				 * msg = { index, user}
				 */
				if(term[msg.index].pty.socket.readable) {
					term[msg.index].pty.on('data', function (data) {
						var result = {};
						result.stdout = data;
						result.terminal_name = msg.terminal_name;
						result.user = msg.user;
						
						io.sockets.in(msg.workspace + '/' + msg.terminal_name + '/' + msg.index).emit("pty_command_result", result);
					});

					var data = {
						index: msg.index,
						timestamp: msg.timestamp
					};
					
					socket.join(msg.workspace + '/' + msg.terminal_name + '/' + msg.index);
					socket.to().emit("terminal_index", JSON.stringify(data));
				}
			});
			
			socket.on('terminal_resize', function (msg) {
				msg = JSON.parse(msg);

				if (term[msg.index] && term[msg.index].pty) {
					term[msg.index].pty.resize(parseInt(msg.cols), 30);
				}
			});
			
			socket.on('terminal_leave', function (msg) {
				msg = JSON.parse(msg);
				
				socket.leave(msg.workspace + '/' + msg.terminal_name + '/' + msg.index);
//				socket.leave("terminal/"+msg.user+"/"+msg.index);			
				if (term[msg.index] && term[msg.index].pty) {
					term[msg.index].pty.destroy();
					// term[msg.index].pty.kill('SIGTERM');
					term[msg.index].pty.kill('SIGKILL');
				}
			});

			socket.on('pty_execute_command', function (msg) {
				msg = JSON.parse(msg);
				var do_exec=function(msg){
					if(term[msg.index] && term[msg.index].pty){
					self.exec(term[msg.index].pty, msg.command, msg.special_key);
					}
				}
				//self.exec(term[msg.index].pty, msg.command, msg.special_key);
				setTimeout(do_exec(msg),100);
			});
			
			socket.on('change_project_dir', function (msg) {
				msg = JSON.parse(msg);

				if (term[msg.index] && term[msg.index].pty) {
					term[msg.index].pty.write("cd " + __workspace + msg.project_path  + "\r");
					socket.to().emit("on_change_project_dir", msg);
				}
			});
			
		});
	},
	
	exec: function (term, command, special_key) {
		if (term) {
			if (special_key) { //Special Key
				term.write(command);
			}
			else {
				term.write(command);
			}
		}
		else {
		}
	}
};
