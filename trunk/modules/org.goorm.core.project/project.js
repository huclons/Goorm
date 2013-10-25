/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jshint newcap:false, debug:true, unused: true, evil: true, devel: true, node: true, plusplus: false, undef: false */
/*serverside jslint comment for global */
/*global __local_mode: false, __workspace: false, __temp_dir: false, __service_mode: false */
/*jshint unused: false */



var fs = require('fs');
var rimraf = require('rimraf');
var EventEmitter = require("events").EventEmitter;
var exec = require('child_process').exec;






var check_valid_path = function(str){
	if(!str)return false;
	return !(/\.\.|~|;|&|\|/.test(str));
};

module.exports = {
	do_new: function (query, evt) {
		var self = this;
		var data = {};
		data.err_code = 0;
		data.message = "process done";

		if (query.project_type && query.project_detailed_type  && query.project_author  && query.project_name  && query.project_desc  && query.use_collaboration) {
			fs.readdir(__workspace + '/', function (err, files) {
				if (err ) {
					data.err_code = 10;
					data.message = "Server can not response";

					evt.emit("project_do_new", data);
				} else {
					var project_dir = query.project_author + '_' + query.project_name;
					if (files.hasObject(project_dir)) {
						data.err_code = 20;
						data.message = "Same project name is exist.";

						evt.emit("project_do_new", data);
					} else {
						
						fs.mkdir(__workspace + '/' + project_dir, '0777', function (err) {
							if (err ) {
								data.err_code = 30;
								data.message = "Cannot make directory";

								evt.emit("project_do_new", data);
							} else {
								var today = new Date();
								var today_month = parseInt(today.getMonth(), 10) + 1;
								var date_string = today.getFullYear() + '/' + today_month + '/' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

								var file_contents = {
									type: query.project_type,
									detailedtype: query.project_detailed_type,
									author: query.project_author,
									name: query.project_name,
									description: query.project_desc,
									date: date_string,
									collaboration: query.use_collaboration,
									plugins: query.plugins
								};

								fs.writeFile(__workspace + '/' + project_dir + '/project.json', JSON.stringify(file_contents), function (err) {
									if (err) {
										data.err_code = 40;
										data.message = "Can not make project file";

										evt.emit("project_do_new", data);
									} else {
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
		} else {
			data.err_code = 10;
			data.message = "Invalid query";

			evt.emit("project_do_new", data);
		}
	},

	do_delete: function (query, evt) {
		var data = {};
		data.err_code = 0;
		data.message = "process done";

		

		
		if (query.project_path ) {
			rimraf(__workspace + '/' + query.project_path, function (err) {
				if (err ) {
					data.err_code = 20;
					data.message = "Can not delete project";

					evt.emit("project_do_delete", data);
				} else {
					//success
					evt.emit("project_do_delete", data);
				}
			});
		} else {
			data.err_code = 10;
			data.message = "Invalide query";

			evt.emit("project_do_delete", data);
		}
		
	},

	do_import: function (query, file, evt) {
		var data = {};
		data.err_code = 0;
		data.message = "process done";
		var save_project_json = {};
		if (query.project_import_location  && file ) {
			var project_abs_path = __workspace + "/" + query.project_import_location;
			project_abs_path = project_abs_path.replace(/\/\//g, "/");

			if (project_abs_path === __workspace || project_abs_path.indexOf('..') > -1) {
				data.err_code = 10;
				data.message = "Invalid Import Location";
				evt.emit("project_do_import", data);
				return false;
			}
			fs.readFile(project_abs_path + "/project.json", 'utf-8', function (err, project_json_data) {
				if (!err) {
					save_project_json = project_json_data;
					save_project_json = JSON.parse(save_project_json);
					//var clear_command = "find "+project_abs_path+"/*   | xargs rm -rf ;";
					var clear_command = "rm -rf  " + project_abs_path + "/* ;";

					exec(clear_command + " unzip -o " + file.path + " -d " + __workspace + "/" + query.project_import_location, {
						maxBuffer: 400 * 1024
					}, function (error, stdout, stderr) {
						//temp_file delete
						rimraf(file.path, function (err) {});

						if (!error) {
							//mv 
							
							fs.readdir(project_abs_path, function (err, stdout) {

								if (!err && stdout && stdout.length !== 0 ) {
									var ori_project_name = '';
									for(var i=0;i<stdout.length;i++){
										if(stdout[i][0]!=='.'){
											ori_project_name = stdout[i];
											break;
										}
									}
									if(ori_project_name === ''){
										data.message = 'Import Fail';
										evt.emit("project_do_import", data);
										return false;
									}
									

									var mv_command = "mv " + project_abs_path + "/" + ori_project_name + "/*   " + project_abs_path ;

									mv_command = mv_command.replace(/\/\//g, "/");
									exec(mv_command, function (err, stdout) {
										if(err)console.log(err);

										

										evt.emit("project_do_import", data);

										fs.writeFile(project_abs_path + "/project.json", JSON.stringify(save_project_json), function (err) {});
										
										//delete empty folder
										rimraf(project_abs_path + "/" + ori_project_name, function(err){});

									});
								} else {
									evt.emit("project_do_import", data);
								}
							});




						} else {
							

							data.err_code = 20;
							data.message = "Cannot extract zip file";

							evt.emit("project_do_import", data);
							fs.writeFile(project_abs_path + "/project.json", JSON.stringify(save_project_json), function (err) {});
						}
					});
				} else {
					data.err_code = 11;
					data.message = "project.json doesn't exist";
					evt.emit("project_do_import", data);
				}
			});

		} else {
			data.err_code = 10;
			data.message = "Invalid query ";

			evt.emit("project_do_import", data);
		}
	},

	do_export: function (query, evt) {
		var data = {};
		data.err_code = 0;
		data.message = "process done";

		if (query.user  && query.project_path  && query.project_name ) {

			fs.mkdir(__temp_dir + '/' + query.user, '0777', function (err) {

				if (!err  || err.errno === 47) { //errno 47 is exist folder error
					//$tar cvzf filename.tar.gz file1
					var export_terminal_command;
					var export_file_extension;

					if (query.export_type == "zip") {
						export_terminal_command = "zip -r ";
						export_file_extension = ".zip";
					} else if (query.export_type == "tar") {

						export_terminal_command = "tar cvzf ";
						export_file_extension = ".tar";
					}

					var command = exec("cd " + __workspace + "; " + export_terminal_command + __temp_dir + "/" + query.user + "/" + query.project_name + export_file_extension + " ./" + query.project_path, function (error, stdout, stderr) {
						if (!error ) {
							data.path = query.user + '/' + query.project_name + export_file_extension;
							evt.emit("project_do_export", data);
						} else {
							data.err_code = 20;
							data.message = "Cannot make export file";

							evt.emit("project_do_export", data);
						}
					});

				} else {
					data.err_code = 30;
					data.message = "Cannot make directory";

					evt.emit("project_do_export", data);
				}
			});
		} else {
			data.err_code = 10;
			data.message = "Invalide query";

			evt.emit("project_do_export", data);
		}
	},

	get_list: function (project_option, evt) {

		var self = this;
		var projects = [];

		var author = project_option.author;
		var get_list_type = project_option.get_list_type;

		var options = {
			followLinks: false
		};

		var is_empty = true;

		
		var __path = __workspace + '/';
		fs.readdir(__path, function (err, files) {
			if (!err) {
				var evt_get_project = new EventEmitter();
				evt_get_project.on('get_project_list', function (__evt_get_project, i) {
					if (files[i]) {
						var target_dir = __workspace + '/' + files[i];

						fs.exists(target_dir, function (exists) {
							if (exists && !fs.statSync(target_dir).isFile()) {
								fs.readFile(__workspace + '/' + files[i] + "/project.json", 'utf-8', function (err, data) {
									if (!err ) {
										var project = {};
										project.name = files[i];
										project.contents = JSON.parse(data);

										projects.push(project);
									}

									evt_get_project.emit('get_project_list', evt_get_project, ++i);
								});
							} else {
								evt_get_project.emit('get_project_list', evt_get_project, ++i);
							}
						});
					} else {
						projects.sort(function(a,b){
							if (a.name < b.name) return -1;
							return 1;
						});
						evt.emit("project_get_list", projects);
					}
				});
				evt_get_project.emit('get_project_list', evt_get_project, 0);
			} else {
				console.log('Directory Error : ', err);
				evt.emit("project_get_list", projects);
			}
		});
		

		
	},

	

	set_property: function (query, evt) {
		var data = {};
		data.err_code = 0;
		data.message = "process done";

		if (query.project_path ) {
			fs.writeFile(__workspace + '/' + query.project_path + "/project.json", query.data, 'utf-8', function (err) {
				if (!err ) {
					evt.emit("set_property", data);
				} else {
					data.err_code = 20;
					data.message = "Can not write project file.";
					evt.emit("set_property", data);
				}
			});
		} else {
			data.err_code = 10;
			data.message = "Invalid query";
			evt.emit("set_property", data);
		}
	},

	get_property: function (query, evt) {
		var data = {};
		data.err_code = 0;
		data.message = "process done";
		if (query.project_path!==null && query.project_path!==undefined ) {
			if (query.project_path === "") {
				evt.emit("get_property", data);
			} else {
				fs.readFile(__workspace + '/' + query.project_path + "/project.json", 'utf-8', function (err, file_data) {
					if (!err ) {
						data.contents = JSON.parse(file_data);
						evt.emit("get_property", data);
					} else {
						data.err_code = 20;
						data.message = "Can not open project.";
						evt.emit("get_property", data);
					}
				});
			}
		} else {
			data.err_code = 10;
			data.message = "Invalid query";
			evt.emit("get_property", data);
		}
	},

	do_clean: function (query, evt) {
		var self = this;
		var data = {};
		data.err_code = 0;
		data.message = "process done";

		if (query.project_list ) {

			var total_count = query.project_list.length;
			var clean_count = 0;
			var evt_clean = new EventEmitter();

			evt_clean.on("do_delete_for_clean", function () {

				clean_count++;
				if (clean_count < total_count) {
					self.do_delete_for_clean(query.project_list[clean_count], evt_clean);
				} else {
					evt.emit("project_do_clean", data);
				}
			});

			self.do_delete_for_clean(query.project_list[clean_count], evt_clean);
		} else {
			data.err_code = 10;
			data.message = "Invalide query";

			evt.emit("project_do_clean", data);
		}
	},

	do_delete_for_clean: function (project_path, evt_clean) {
		rimraf(__workspace + '/' + project_path + "/build", function (err) {
			evt_clean.emit("do_delete_for_clean");
		});
	},

	move_file: function (data, res) {
		var length = data.current_path.length;
		for (var i = 0; i < length; i++) {
			exec('mv ' + __workspace + data.current_path[i] + " " + __workspace + data.after_path, function (err, stdout, stderr) {
				if (err) {
					console.log(err, stdout, stderr);
					res.json({
						flag: false
					});
				}
				if (i == length - 1 || i == length) {
					res.json({
						flag: true
					});
				}
			});
		}
	},

	check_running_project: function (req, evt) {
		var res = {};
		var i=0;

		//"not_running_project";	-> can run user's proc
		res.result=0;	

		//by session id
		var id=req.id;

		//get user's bash
		exec("ps -lu "+id+ "  | awk '{print $4, $5, $14}' | grep -v PID ", function (err,stdout,stderr){
			//pid ppid cmd
			if(err || stderr){
				evt.emit('check_running_project', res);	
				return false;
			}

			var procs=stdout.split('\n');
			//bash's pid
			var bash_procs_pid=[];

			//etc proc's ppid
			var etc_procs_ppid=[];

			for(i=0;i<procs.length;i++){
				if(procs[i]==='')continue;

				if(procs[i].split(' ').pop() === 'bash' ){
					bash_procs_pid.push(procs[i].split(' ')[0]);
				}else{
					etc_procs_ppid.push(procs[i].split(' ')[1]);
				}
			}

			for(i=0;i<bash_procs_pid.length;i++){
				for(var k=0;k<etc_procs_ppid.length;k++){
					if(etc_procs_ppid[k]===bash_procs_pid[i]){
						//already running user's process 
						res.result = 1;
						break;
					}
				}
			}
			evt.emit('check_running_project', res);	



		});


	},


	check_latest_build : function(query,evt){
		if(!query || !query.project_path || !check_valid_path(query.project_path)){
			evt.emit('check_latest_build',false);
			return false;
		}
		var exec_option={};
		exec_option.cwd=global.__workspace+query.project_path;
		exec(" find . -type f -not -name '.*' -printf '%T@      %p\n' | sort -nr | head -n 1 | awk '{print $2}'", exec_option,function(err,stdout,stderr){
			if(err){
				evt.emit('check_latest_build',false);
			}else{
				evt.emit('check_latest_build',stdout);
			}
		});
	},
	

	count_project_by_id: function (id, evt) {
		evt.emit("count_project_by_id", 1);
	},


	authorize_project_by_id : function(id, project_path, evt){
		
	}
};
