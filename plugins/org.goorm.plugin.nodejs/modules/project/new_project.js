var fs = require('fs'),
	walk = require('walk'),
	emitter,
	common = require(__path + "plugins/org.goorm.plugin.nodejs/modules/common.js");

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

			fs.readFile(workspace+"/project.json", 'utf-8', function (err, file_data) {
				var contents = JSON.parse(file_data);
				contents.plugins = req.data.plugins;
				contents.detailedtype = req.data.project_detailed_type;
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