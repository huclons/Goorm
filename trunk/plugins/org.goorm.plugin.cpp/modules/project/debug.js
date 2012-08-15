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
		
		gdb.stdout.setEncoding('utf8');
		gdb.stdout.on('data', function (data) {
			evt.emit('response', data);
		});

		gdb.stderr.setEncoding('utf8');
		gdb.stderr.on('data', function (data) {
			evt.emit('response', data);
		});

		gdb.on('exit', function (code) {
			evt.emit('response', 'child process exited with code ' + code);
		});
		
		setTimeout(function(){
			evt.emit("response", "ready");
		}, 1000)
	},
	
	debug: function(req, evt) {
		gdb.stdin.end("run");
	},
	
	close: function() {
		gdb.kill('SIGHUP');
//		gdb.disconnect();
		console.log("gdb process was closed");
	}
};