/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jshint newcap:false, debug:true, unused: true, evil: true, devel: true, node: true, plusplus: false, undef: false */
/*serverside jslint comment for global */

/*jshint unused: false */



var exec = require('child_process').exec;

module.exports = {
	get_function_explorer: function (query, evt) {

		var self = this;
		self.function_explorer_data = [];
		//project 

		//project type check
		if (query.selected_project_type == 'c') {
			self.get_function_explorer_c(query, evt);
		} else if (query.selected_project_type == 'cpp') {
			self.get_function_explorer_cpp(query, evt);
		} else if (query.selected_project_type == 'js') {
			self.get_function_explorer_js(query, evt);
		} else {
			evt.emit("got_function_explrorer", "no support");
		}

	},

	get_function_explorer_c: function (query, evt) {
		var self = this;
		exec('find ./workspace/' + query.selected_project_path + ' -name "*.c" ', function (err, stdout, stderr) {
			var sources = stdout;
			evt.emit("got_function_explrorer", "data");
		});
	},
	get_function_explorer_cpp: function (query, evt) {
		var self = this;
		exec('find ./workspace/' + query.selected_project_path + ' -name  "*.c" ', function (err, stdout, stderr) {
			if (stderr || err) {
				console.log('find stderr');
				console.log(stderr);
				console.log(err);
				evt.emit("got_function_explrorer", "find error");
				return false;

			}
			var sources = stdout; //src file list
			sources = sources.replace(/\n/gi, "  ");

			exec('cflow ' + sources, function (err, stdout, stderr) {
				if (stderr || err) {
					console.log(stderr);
					console.log(err);
					evt.emit("got_function_explrorer", "cflow error");
					return false;
				}
				var data = stdout.split("\n");

				data.pop(); //last one is "" so pop

				self.parsing_data(data);
				evt.emit("got_function_explrorer", self.function_explorer_data);
			});

		});
	},

	get_function_explorer_js: function (query, evt) {

	},

	parsing_data: function (input) {
		var self = this;
		for (var i = 0; i < input.length; i++) {
			self.function_explorer_data[i] = {};
			self.function_explorer_data[i].content = input[i];
			self.function_explorer_data[i].depth = 0;
			self.function_explorer_data[i].index = i;
			self.function_explorer_data[i].children = [];
			self.function_explorer_data[i].parent = [];
			while (true) {
				if (self.function_explorer_data[i].content.indexOf("    ") === 0) {
					self.function_explorer_data[i].depth++;
					self.function_explorer_data[i].content = self.function_explorer_data[i].content.substring(4);
				} else {
					break;
				}
			}
		}
		if (input.length > 0) {
			self.dfs(self.function_explorer_data[0]);
		}
	},

	dfs: function (target) {
		var self = this;
		for (var i = target.index + 1; i < self.function_explorer_data.length; i++) {
			if (self.function_explorer_data[i].depth - 1 == target.depth) {
				//child!!!!
				target.children.push(self.function_explorer_data[i]);
				self.dfs(self.function_explorer_data[i]);

			} else if (self.function_explorer_data[i].depth <= target.depth) {
				//no more child
				break;
			} else {
				//child's child ignore
				continue;
			}
		}

	}
};