var fs = require('fs');
var walk = require('walk');
var rimraf = require('rimraf');
var g_env = require("../../configs/env.js");
var EventEmitter = require("events").EventEmitter;

var projects = [];

module.exports = {
	do_new: function (query, evt) {

		var data = {};
		data.err_code = 0;
		data.message = "process done";

		if ( query.project_type!=null && query.project_detailed_type !=null && query.project_author!=null && query.project_name!=null && query.project_about!=null && query.use_collaboration ) {
			fs.readdir(g_env.path+'workspace/', function(err, files) {
				if (err!=null) {
					data.err_code = 10;
					data.message = "Server can not response";

					evt.emit("project_do_new", data);
				}
				else {
					var project_dir = query.project_author+'_'+query.project_name;
					if (files.hasObject(project_dir)) {
						data.err_code = 20;
						data.message = "Exist project";

						evt.emit("project_do_new", data);
					}
					else {
						fs.mkdir(g_env.path+'workspace/'+project_dir, '0777', function(err) {
							if (err!=null) {
								data.err_code = 30;
								data.message = "Cannot make directory";
		
								evt.emit("project_do_new", data);
							}
							else {
								var today = new Date();
								var date_string = today.getFullYear()+'/'+today.getMonth()+'/'+today.getDate()+' '+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();
							
								var file_contents = '{"type": "'+query.project_type+'", "detailedtype": "'+query.project_detailed_type+'", "author": "'+query.project_author+'", "name": "'+query.project_name+'", "about": "'+query.project_about+'", "date": "'+date_string+'", "collaboration": "'+query.use_collaboration+'"}';

								fs.writeFile(g_env.path+'workspace/'+project_dir+'/project.json', file_contents, function(err) {
									if (err!=null) {
										data.err_code = 40;
										data.message = "Can not make project file";
										
										evt.emit("project_do_new", data);
									}
									else {
										data.project_name = query.project_name;
										data.project_author = query.project_author;
										data.project_type = query.project_type;

										evt.emit("project_do_new", data);
									}
								});
							}
						});
					}
				}
			});	
		}
		else {
			data.err_code = 10;
			data.message = "Invalid query";

			evt.emit("project_do_new", data);
		}
	},
	
	do_delete: function (query, evt) {
		var data = {};
		data.err_code = 0;
		data.message = "process done";
		
		console.log(query);
		
		if (query.project_path != null) {
			rimraf(g_env.path+"workspace/"+query.project_path, function(err) {
				console.log(g_env.path+query.project_path);
				console.log(err);
				if (err!=null) {
					data.err_code = 20;
					data.message = "Can not delete project";
					
					evt.emit("project_do_delete", data);
				}
				else {
					//success
					evt.emit("project_do_delete", data);
				}
			});
		}
		else {
			data.err_code = 10;
			data.message = "Invalide query";
			
			evt.emit("project_do_delete", data);
		}		
/*
		rimraf(g_env.path+query.path, function(err) {
		evt.emit("project_do_delete", err);			
		});
*/
		
	},
	
	get_list: function (evt) {
	
		var self = this;
		projects = [];
		
		var options = {
			followLinks: false
		};
				
		walker = walk.walk(g_env.path+"workspace", options);
		
		walker.on("directories", function (root, dirStatsArray, next) {

			var count = dirStatsArray.length;
			if (root==g_env.path+"workspace" ) {
				var dir_count = 0;

				var evt_dir = new EventEmitter();
	
				evt_dir.on("get_list", function () {
					dir_count++;
					if (dir_count<dirStatsArray.length) {
						self.get_project_info(dirStatsArray[dir_count], evt_dir);						
					}
					else {
						evt.emit("project_get_list", projects);
					}
				});
				
				self.get_project_info(dirStatsArray[dir_count], evt_dir);
			}
			
			next();
		});
		
		walker.on("end", function () {
		});
	},
	
	get_project_info: function (dirStatsArray, evt_dir) {
		var project = {};
		project.name = dirStatsArray.name;

		fs.readFile(g_env.path+"workspace/"+project.name+"/project.json", 'utf-8', function (err, data) {
			if (err==null) {
				project.contents = JSON.parse(data);
				console.log(project.contents.type);
				projects.push(project);
			}
			evt_dir.emit("get_list");
		});
	}
};