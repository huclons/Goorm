var	emitter,
	common = require(__path + "plugins/org.goorm.plugin.java/modules/common.js"),
	util  = require('util'),
    spawn = require('child_process').spawn,
    jdb = null;

module.exports = {
	init: function(req, evt) {
		var workspace = __path + "workspace/" + req.path;
		var template = common.path + "template";

		if(jdb !== null) jdb.kill('SIGHUP');
		
		jdb = spawn('jdb', ["-classpath", workspace+"/src/project/", "main"]);
		jdb.started=false;
		jdb.command = false;
		jdb.stdout.setEncoding('utf8');
		jdb.stdout.on('data', function (data) {
			if(jdb.started===false && data.trim() == ">") {
				evt.emit('response', "Ready:");
				jdb.started=true;
			}
			else if (jdb.command===true && /main\[1\]/.test(data)) {
				if(!jdb.killed) {
					jdb.stdin.write("locals\n");
					setTimeout(function(){
						evt.emit('response', "Where:");
						jdb.stdin.write("where\n");
					}, 100);
				}
				jdb.command = false;
			}
			else {
				evt.emit('response', data);
			}
		});

		jdb.stderr.setEncoding('utf8');
		jdb.stderr.on('data', function (data) {
			evt.emit('response', data);
		});

		jdb.on('exit', function (code) {
			evt.emit('response', "exited");
			jdb.killed=true;
			jdb.started=false;
			jdb.command = false;
		});
		
		jdb.breakpoints = [];
	},
	
	debug: function(req, evt) {
		if(req.mode == "init_run") {
			jdb.stdin.write("run\n");
		}
		else if(req.mode == "set_breakpoints") {
			var classname = req.classname;
			var breakpoints = req.breakpoints;
			var remains = [];
			
			for(var i=0; i < jdb.breakpoints.length; i++) {
				remains.push(jdb.breakpoints[i]);
			}
			
			for(var i=0; i < breakpoints.length; i++) {
				var breakpoint = breakpoints[i];
				breakpoint += 1;
				breakpoint = classname+":"+breakpoint;
				var result = remains.inArray(breakpoint);
				if(result == -1) {
					jdb.breakpoints.push(breakpoint);
					jdb.stdin.write("stop at "+breakpoint+"\n");
				}
				else {
					remains.remove(result);
				}
			}
			
			for(var i=0; i < remains.length; i++) {
				var result = jdb.breakpoints.inArray(remains[i]);
				if(result != -1) {
					jdb.breakpoints.remove(result);
					jdb.stdin.write("clear "+remains[i]+"\n");
				}
			}
			return ;
			// testcode
//			jdb.stdin.write("clear\n");
		}
		else if (req.mode == "continue") {
			jdb.stdin.write("cont\n");
		}
		else if (req.mode == "terminate") {
			jdb.stdin.write("exit\n");
		}
		else if (req.mode == "step_over") {
			jdb.stdin.write("next\n");
		}
		else if (req.mode == "step_in") {
			jdb.stdin.write("step\n");
		}
		else if (req.mode == "step_out") {
			jdb.stdin.write("step up\n");
		}
		else if (req.mode == "set_value") {
			jdb.stdin.write("set "+req.variable+"="+req.value+"\n");
		}
		jdb.command = true;
	},
	
	close: function() {
		jdb.kill('SIGHUP');
//		jdb.disconnect();
		console.log("jdb process was closed");
	}
};