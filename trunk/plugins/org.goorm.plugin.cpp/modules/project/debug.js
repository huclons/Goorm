var	emitter,
	common = require(__path + "plugins/org.goorm.plugin.cpp/modules/common.js"),
	util  = require('util'),
    spawn = require('child_process').spawn,
    gdb = null;

module.exports = {
	init: function(req, evt) {
		var workspace = __path + "workspace/" + req.path;
		var template = common.path + "template";

		if(gdb !== null) gdb.kill('SIGHUP');
		
		gdb = spawn('gdb', [workspace+"/main"]);
		gdb.started = false;
		gdb.command = false;
		gdb.stdout.setEncoding('utf8');
		gdb.stdout.on('data', function (data) {
			if(/[\. ]*done/.test(data)) {
				if(gdb.started===false) {
					evt.emit('response', "Ready:");
				}
				gdb.command = true;
			}
			else if (gdb.command===true && /\(gdb\)/.test(data)) {
				setTimeout(function(){
					gdb.stdin.write("where\n");
					evt.emit('response', "Where:");
				}, 100);
				setTimeout(function(){
					gdb.stdin.write("info locals\n");
					evt.emit('response', "Local variables:");
				}, 200);
				gdb.command = false;
			}
			else {
				evt.emit('response', data);
			}
		});

		gdb.stderr.setEncoding('utf8');
		gdb.stderr.on('data', function (data) {
			evt.emit('response', data);
		});

		gdb.on('exit', function (code) {
			evt.emit('response', "exited");
			gdb.started = false;
			gdb.command = false;
//			gdb.killed=true;
		});
	},
	
	debug: function(req, evt) {
		if(req.mode == "init_run") {
			gdb.stdin.write("run\n");
			gdb.started=true;
		}
		else if(req.mode == "set_breakpoints") {
			var filename = req.filename;
			var breakpoints = req.breakpoints;
			
			// reset all breakpoints
			gdb.stdin.write("clear\n");
			
			for(var i=0; i < breakpoints.length; i++) {
				var breakpoint = breakpoints[i];
				breakpoint += 1;
				breakpoint = filename+":"+breakpoint;
				gdb.stdin.write("break "+breakpoint+"\n");
			}
			return ;
//			gdb.stdin.write("info b\n");
		}
		else if (req.mode == "continue") {
			gdb.stdin.write("continue\n");
		}
		else if (req.mode == "terminate") {
			gdb.stdin.write("quit\n");
		}
		else if (req.mode == "step_over") {
			gdb.stdin.write("next\n");
		}
		else if (req.mode == "step_in") {
			gdb.stdin.write("step\n");
		}
		else if (req.mode == "step_out") {
			gdb.stdin.write("finish\n");
		}
		else if (req.mode == "set_value") {
			gdb.stdin.write("p "+req.variable+"="+req.value+"\n");
		}
		gdb.command = true;
	},
	
	close: function() {
		gdb.kill('SIGHUP');
//		gdb.disconnect();
		console.log("gdb process was closed");
	}
};