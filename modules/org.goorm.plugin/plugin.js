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
				
		walker = walk.walk(g_env.path + "plugins", options);
		
		walker.on("directories", function (root, dirStatsArray, next) {
			if (root == g_env.path + "plugins" ) {
				for (var i=0; i<dirStatsArray.length; i++) {
					plugins.push(dirStatsArray[i].name);
				}
				
				evt.emit("plugin_get_list", plugins);
			}
			
			next();
		});
		
		walker.on("end", function () {
		});
	}
};
