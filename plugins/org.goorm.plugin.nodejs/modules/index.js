
/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jslint evil: true, devel: true, node: true, plusplus: true, unparam: false */
/*global mongoose: true, Scheme: true, org: true, core: true, goorm: true, io: true */

var common = require(__path+"plugins/org.goorm.plugin.nodejs/modules/common.js");
var EventEmitter = require("events").EventEmitter

module.exports = {
	do_new: function(req, res) {
		var evt = new EventEmitter();
		var new_project = require(common.path+"modules/project/new_project.js");
		/* req.data = 
		   { 
			project_type,
			project_detailed_type,
			project_author,
			project_name,
			project_desc,
			use_collaboration
		   }
		*/
		
		evt.on("do_new_complete", function (data) {
			res.json(data);
		});
		
		new_project.do_new(req, evt);
	},
	
	debug: function(req, evt) {
		var debug = require(common.path+"modules/project/debug.js");
		
		if(req.mode == "init") {
			debug.init(req, evt);
		}
		else if (req.mode == "close") {
			debug.close();
		}
		else {
			debug.debug(req, evt);
		}
	},

	extend_function: function (req, res) {
		var self = this;
	
		if(req.query.extend_function == "stop"){
			res.json({'result' : true, command: '\x03', special_key: true});
		}
		else if(req.query.extend_function == "replace_app_port") {
			var data = req.query.data;

			var project_path = data['project_path'];
			var source_path = data['source_path'];
			var main = data['main'];

			var main_file = __workspace + project_path + '/' + source_path + main + '.js';

			res.json({
				'result' : true,
				'use_port' : false,
				'run_path' : main_file
			})
		}
	}
};
