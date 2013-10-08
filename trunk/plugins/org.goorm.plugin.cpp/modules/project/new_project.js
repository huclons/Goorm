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
	common = require(__path + "plugins/org.goorm.plugin.cpp/modules/common.js");

var exec = require('child_process').exec;

module.exports = {
	copyFileSync : function(srcFile, destFile) {
	  BUF_LENGTH = 64*1024;
	  buff = new Buffer(BUF_LENGTH);
	  fdr = fs.openSync(srcFile, 'r');
	  fdw = fs.openSync(destFile, 'w');
	  bytesRead = 1;
	  pos = 0;
	  while (bytesRead > 0) {
	    bytesRead = fs.readSync(fdr, buff, 0, BUF_LENGTH, pos);
	    fs.writeSync(fdw,buff,0,bytesRead);
	    pos += bytesRead;
	  }
	  fs.closeSync(fdr);
	  fs.closeSync(fdw);
	},
	do_new : function(req, evt) {
		var self = this;
		var workspace = __workspace + "/" + req.data.project_author + "_" + req.data.project_name;
		var template = common.path + "template";

		
		
		if(req.data.project_detailed_type) {
			template += "/"+req.data.project_detailed_type;
		}
		
		exec('cp -r '+template+'/* '+workspace, function(__err){
			if(__err) console.log(__err);

			fs.chmodSync(workspace+"/make", 0770);
			fs.readFile(workspace+"/project.json", 'utf-8', function (err, file_data) {
				var contents = JSON.parse(file_data);
				contents.plugins = req.data.plugins;

				var detailedtype = "";
				switch(req.data.project_detailed_type){
					case "c":
						detailedtype = "C Console Project"
						break;

					case "cpp":
						detailedtype = "C++ Console Project"
						break;

					default:
						detailedtype = "C Console Project"
						break;
				}

				contents.detailedtype = detailedtype;
				fs.writeFile(workspace+"/project.json", JSON.stringify(contents), 'utf-8', function (err) {
					if (err==null) {
						evt.emit("do_new_complete", {
							code : 200,
							message : "success"
						});
					}

					
				});
			});
		});

	}
};