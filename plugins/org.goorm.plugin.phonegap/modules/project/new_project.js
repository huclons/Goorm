/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jslint evil: true, devel: true, node: true, plusplus: true, unparam: false */
/*global mongoose: true, Scheme: true, org: true, core: true, goorm: true, io: true */

var fs = require('fs'),
	walk = require('walk'),
	emitter,
	common = require(__path + "plugins/org.goorm.plugin.phonegap/modules/common.js");

var exec = require('child_process').exec;

module.exports = {
	do_new : function(req, evt) {
		var self = this;
		var workspace = __workspace + "/" + req.data.project_author + "_" + req.data.project_name;

		

		fs.readFile(workspace+"/project.json", 'utf-8', function (err, file_data) {
			var contents = JSON.parse(file_data);

			contents.plugins = req.data.plugins;
			contents.building_after_save_option = true;

			fs.writeFile(workspace+"/project.json", JSON.stringify(contents), 'utf-8', function (err) {
				if (err==null) {
					evt.emit("do_new_complete", {
						code : 200,
						message : "success"
					});
				}

				
			});
		});
	}
};