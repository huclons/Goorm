var walk = require('walk');
var g_env = require("../../configs/env.js");
var EventEmitter = require("events").EventEmitter;

module.exports = {
	get_list: function (evt) {
		var self = this;
		plugins = [];
		
		var options = {
			followLinks: false
		};
				
		walker = walk.walk(__path + "plugins", options);
		
		walker.on("directories", function (root, dirStatsArray, next) {
			if (root == __path + "plugins" ) {
				for (var i=0; i<dirStatsArray.length; i++) {
					if (dirStatsArray[i].name != '.svn') {
						plugins.push({name:dirStatsArray[i].name});
					}
				}
				
				evt.emit("plugin_get_list", plugins);
			}
			
			next();
		});
		
		walker.on("end", function () {
		});
	}
};
