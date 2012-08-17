var fs = require('fs');
var walk = require('walk');
var rimraf = require('rimraf');
var EventEmitter = require("events").EventEmitter;
var exec = require('child_process').exec;

var themes = [];

module.exports = {
	init: function () {
		console.log("init!!");	
	},
	
	get_list: function (evt) {
	
		var self = this;
		themes = [];
		
		var options = {
			followLinks: false
		};
				
		var walker = walk.walk(__path+"theme", options);

		walker.on("directories", function (root, dirStatsArray, next) {

			var count = dirStatsArray.length;
			if (root==__path+"theme" ) {
				var dir_count = 0;

				var evt_dir = new EventEmitter();
	
				evt_dir.on("get_list", function () {
					dir_count++;

					if (dir_count<dirStatsArray.length) {
						self.get_theme_info(dirStatsArray[dir_count], evt_dir);						
					}
					else {
						evt.emit("theme_get_list", themes);
					}
				});
				
				self.get_theme_info(dirStatsArray[dir_count], evt_dir);
			}
			
			next();
		});
		
		walker.on("end", function () {
		});
	},
	
	get_theme_info: function (dirStatsArray, evt_dir) {
		var theme = {};
		theme.name = dirStatsArray.name;

		fs.readFile(__path+"theme/"+theme.name+"/theme.json", 'utf-8', function (err, data) {
			if (err==null) {
				theme.contents = JSON.parse(data);
				//theme.contents.title
				
				themes.push(theme);
			}
			evt_dir.emit("get_list");
		});
	}

};
