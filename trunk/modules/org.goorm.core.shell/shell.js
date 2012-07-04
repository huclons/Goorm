var sys = require('sys');
var exec = require('child_process').exec;

module.exports = {
	init: function () {
		
	},
	
	exec: function (command, evt) {
		exec(command, function (error, stdout, stderr) {
		
			if(error){
				console.log('error: ');
				console.log(error);
			} else {
				
			}
			
			var data = {};
			data.stdout = stdout;
			
			evt.emit("executed_command", data);
			sys.puts(stdout);
		});
	}
};
