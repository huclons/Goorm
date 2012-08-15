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
		
		jdb = spawn('jdb', ["-classpath", workspace+"/src/project/", "HelloWorld"]);
		
		jdb.stdout.setEncoding('utf8');
		jdb.stdout.on('data', function (data) {
			if(data == "> ") {
				evt.emit("response", "ready");
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
			evt.emit('response', 'child process exited with code ' + code);
		});
	},
	
	debug: function(req, evt) {
		jdb.stdin.end("run");
	},
	
	close: function() {
		jdb.kill('SIGHUP');
//		jdb.disconnect();
		console.log("jdb process was closed");
	}
};