/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jshint newcap:false, debug:true, unused: true, evil: true, devel: true, node: true, plusplus: false, undef: false */
/*serverside jslint comment for global */
/*global __local_mode: false, __workspace: false, __path: false, __temp_dir: false */
/*jshint unused: false */



var fs = require('fs');
var walk = require('walk');
var EventEmitter = require("events").EventEmitter;
var rimraf = require('rimraf');
var http = require('http');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

var root_dir = ""; // project root
var target_dir = ""; // target root




var check_valid_path = function(str){
	if(!str)return false;
	return !(/\.\.|~|;|&|\|/.test(str));
}


var check_special_characters = function(str) {
	var regex = ['~', '!', '#', '$', '^', '&', '*', '=', '+', '|', ':', ';', '?', '"', '<', '.', '>', ' '];
	var modify_regex = ['\~', '\!', '\#', '\$', '\^', '\&', '\*', '\=', '\+', '\|', '\:', '\;', '\?', '\"', '\<', '\.', '\>', '\ '];

 	if (str) {
		var index = 0;

 		for(index=0; index<regex.length; index++) {
 			var ch = regex[index];
 			var modify_ch = regex[index];

 			str = str.split(ch).join(modify_ch);
 		}
 	}

 	return str;
};


module.exports = {
	init: function (callback) {
		fs.readdir(__path + "public/images/icons/filetype/", function (err, files) {
			for (var i = 0; i < files.length; i++) {
				if (files[i].indexOf("filetype") > -1) {
					global.file_type.push(files[i]);
				}
			}

			if (callback) callback(true);
		});
	},

	do_new: function (query, evt) {
		var self = this;

		var data = {};
		data.err_code = 0;
		data.message = "process done";

		if (query.path !== null && query.new_anyway) {
			var path = query.path;
			if (query.type !== "") {
				path += "." + query.type;
			}

			fs.exists(__workspace + '/' + path, function (exists) {

				if (exists && query.new_anyway == "false") {
					data.err_code = 99;
					data.message = "exist file";
					evt.emit("file_do_new", data);
				} else {
					// var write = spawn('touch', [__workspace + '/' + path], {
					// 	'uid' : query.user.uid,
					// 	'gid' : query.user.gid[0] || query.user.gid
					// });

					// write.stdout.on('data', function(data){
					// 	console.log(data);
					// });

					// write.stderr.on('data', function(err){
					// 	console.log('do_new stderr');
					// 	process.stdout.write(err);

					// 	data.err_code = 40;
					// 	data.message = "Can not make a file";

					// 	evt.emit("file_do_new", data);
					// });

					// write.on('close', function (code){
					// 	if (code !== 0) {
					// 		console.log('touch process exited with code '+code);
					// 	}

					// 	
					// 	evt.emit("file_do_new", data);
					// });

					fs.writeFile(__workspace + '/' + path, "", function (err) {
						if (err !== null) {
							data.err_code = 40;
							data.message = "Can not make a file";

							evt.emit("file_do_new", data);
						} else {
							
							evt.emit("file_do_new", data);
						}
					});
				}
			});
		} else {
			data.err_code = 10;
			data.message = "Invalid query";
			evt.emit("file_do_new", data);
		}
	},

	do_new_folder: function (query, evt) {
		var self = this;

		var data = {};
		data.err_code = 0;
		data.message = "process done";

		if (query.current_path !== null && query.folder_name !== null) {
			fs.exists(__workspace + '/' + query.path, function (exists) {
				if (exists) {
					data.err_code = 20;
					data.message = "Exist folder";

					evt.emit("file_do_new_folder", data);
				} else {
/*					var mkdir = spawn('mkdir', [__workspace + '/' + query.current_path + '/' + query.folder_name, '-m', 0777], {
						'uid' : query.user.uid,
						'gid' : query.user.gid[0] || query.user.gid
					});

					mkdir.stdout.on('data', function(data){
						console.log(data);
					});

					mkdir.stderr.on('data', function(err){
						console.log('mkdir stderr');
						process.stdout.write(err);

						data.err_code = 30;
						data.message = "Cannot make directory";

						evt.emit("file_do_new_folder", data);
					});

					mkdir.on('close', function (code){
						if (code !== 0) {
							console.log('mkdir process exited with code '+code);
						}

						
						evt.emit("file_do_new_folder", data);
					});
*/
					fs.mkdir(__workspace + '/' + query.current_path + '/' + query.folder_name, '0777', function (err) {

						if (err !== null) {
							data.err_code = 30;
							data.message = "Cannot make directory";

							evt.emit("file_do_new_folder", data);
						} else {
							
							evt.emit("file_do_new_folder", data);
						}
					});
				}
			});
		} else {
			data.err_code = 10;
			data.message = "Invalid query";
			evt.emit("file_do_new_folder", data);
		}
	},

	do_new_untitled_text_file: function (query, evt) {
		var self = this;

		var data = {};
		data.err_code = 0;
		data.message = "process done";

		if (query.current_path !== null) {
			fs.readdir(__workspace + '/' + query.current_path, function (err, files) {
				if (err !== null) {
					data.err_code = 10;
					data.message = "Server can not response";

					evt.emit("file_do_new_untitled_text_file", data);
				} else {
					var temp_file_name = "untitled";
					var i = 1;

					while (1) {
						if (files.hasObject(temp_file_name + i + ".txt")) {} else {
							break;
						}
						i++;
					}

					// var write = spawn('touch', [__workspace + '/' + query.current_path + '/' + temp_file_name + i + '.txt'], {
					// 	'uid' : query.user.uid,
					// 	'gid' : query.user.gid[0] || query.user.gid
					// });

					// write.stdout.on('data', function(data){
					// 	console.log(data);
					// });

					// write.stderr.on('data', function(err){
					// 	console.log('do_new_untitled_text_file stderr');
					// 	process.stdout.write(err);

					// 	data.err_code = 40;
					// 	data.message = "Can not make project file";

					// 	evt.emit("file_do_new_untitled_text_file", data);
					// });

					// write.on('close', function (code){
					// 	if (code !== 0) {
					// 		console.log('touch process exited with code '+code);
					// 	}

					// 	
					// 	evt.emit("file_do_new_untitled_text_file", data);
					// });

					fs.writeFile(__workspace + '/' + query.current_path + '/' + temp_file_name + i + '.txt', "", function (err) {
						if (err !== null) {
							data.err_code = 40;
							data.message = "Can not make project file";

							evt.emit("file_do_new_untitled_text_file", data);
						} else {
							
							evt.emit("file_do_new_untitled_text_file", data);
						}
					});
				}
			});
		} else {
			data.err_code = 10;
			data.message = "Invalid query";
			evt.emit("file_do_new_untitled_text_file", data);
		}
	},

	do_new_other: function (query, evt) {
		var self = this;

		var data = {};
		data.err_code = 0;
		data.message = "process done";

		if (query.current_path !== null && query.file_name !== null) {
			fs.exists(__workspace + '/' + query.path, function (exists) {
				if (exists) {
					data.err_code = 20;
					data.message = "Exist file";

					evt.emit("file_do_new_other", data);
				} else {

					// var write = spawn('touch', [__workspace + '/' + query.current_path + '/' + query.file_name], {
					// 	'uid' : query.user.uid,
					// 	'gid' : query.user.gid[0] || query.user.gid
					// });

					// write.stdout.on('data', function(data){
					// 	console.log(data);
					// });

					// write.stderr.on('data', function(err){
					// 	console.log('do_new_other stderr');
					// 	process.stdout.write(err);

					// 	data.err_code = 40;
					// 	data.message = "Can not make file";

					// 	evt.emit("file_do_new_other", data);
					// });

					// write.on('close', function (code){
					// 	if (code !== 0) {
					// 		console.log('touch process exited with code '+code);
					// 	}

					// 	
					// 	evt.emit("file_do_new_other", data);
					// });

					fs.writeFile(__workspace + '/' + query.current_path + '/' + query.file_name, "", function (err) {
						if (err !== null) {
							data.err_code = 40;
							data.message = "Can not make file";

							evt.emit("file_do_new_other", data);
						} else {
							
							evt.emit("file_do_new_other", data);
						}
					});
				}
			});
		} else {
			data.err_code = 10;
			data.message = "Invalid query";
			evt.emit("file_do_new_other", data);
		}
	},

	put_contents: function (query, evt) {

		var data = {};
		var abs_path = __workspace + '/' + query.path;
		if( !check_valid_path(abs_path) ){
			data.err_code = 10;
			data.message = "Can not save";

			evt.emit("file_put_contents", data);
		}else{
			// var echo = spawn('echo', [query.data, '>', abs_path], {
			// 	'uid' : query.user.uid,
			// 	'gid' : query.user.gid[0] || query.user.gid
			// });

			// echo.stdout.on('data', function(data){
			// 	console.log(data);
			// });

			// echo.stderr.on('data', function(err){
			// 	console.log('put_contents stderr');
			// 	process.stdout.write(err);

			// 	data.err_code = 10;
			// 	data.message = "Can not save";

			// 	evt.emit("file_put_contents", data);
			// });

			// echo.on('close', function (code){
			// 	if (code !== 0) {
			// 		console.log('echo process exited with code '+code);
			// 	}

			// 	data.err_code = 0;
			// 	data.message = "saved";

			// 	evt.emit("file_put_contents", data);
			// });

			fs.writeFile(abs_path, query.data, function (err) {
				if (err !== null) {
					data.err_code = 10;
					data.message = "Can not save";

					evt.emit("file_put_contents", data);
				} else {
					data.err_code = 0;
					data.message = "saved";

					evt.emit("file_put_contents", data);
				}
			});
		}
	},


	make_dir_tree: function (root, dirs) {
		var tree = [];
		var rest = [];

		for (var i = 0; i < dirs.length; i++) {
			if (dirs[i].root == root || dirs[i].root == root + '/') {
				tree.push(dirs[i]);
			} else {
				rest.push(dirs[i]);
			}
		}

		for (var i = 0; i < tree.length; i++) {
			var children = this.make_dir_tree(root + tree[i].name + '/', rest);
			tree[i].children = children;
		}

		return tree;
	},

	make_file_tree: function (tree, files) {
		if (tree !== undefined) {
			var marked = [];

			// files on root
			for (var j = 0; j < files.length; j++) {
				if (files[j].root == target_dir) {
					marked.push(j);
					tree.push(files[j]);
				}
			}

			for (var i = 0; i < tree.length; i++) {
				for (var j = 0; j < files.length; j++) {
					if (!marked.hasObject(j) && tree[i].root + tree[i].name + '/' == files[j].root) {
						marked.push(j);
						tree[i].children.push(files[j]);
					}
				}
			}

			var rest_files = [];

			for (var j = 0; j < files.length; j++) {
				if (!marked.hasObject(j)) {
					rest_files.push(files[j]);
				}
			}

			for (var i = 0; i < tree.length; i++) {
				if (tree[i].children.length > 0) {
					tree[i].children.join(this.make_file_tree(tree[i].children, rest_files));
				}
			}

			return tree;
		} else {
			return null;
		}
	},

	do_delete: function (query, evt) {
		var data = {};
		data.err_code = 0;
		data.message = "process done";

		if (query.filename !== null) {

			// var rm = spawn('rm', ['-rf', __workspace + '/' + query.filename], {
			// 	'uid' : query.user.uid,
			// 	'gid' : query.user.gid[0] || query.user.gid
			// });

			// rm.stdout.on('data', function(data){
			// 	console.log(data);
			// });

			// rm.stderr.on('data', function(err){
			// 	console.log('rm stderr');
			// 	process.stdout.write(err);

			// 	data.err_code = 20;
			// 	data.message = "Can not delete file";

			// 	evt.emit("file_do_delete", data);
			// });

			// rm.on('close', function (code){
			// 	if (code !== 0) {
			// 		console.log('rm process exited with code '+code);
			// 	}

			// 	//success
			// 	evt.emit("file_do_delete", data);
			// });

			rimraf(__workspace + '/' + query.filename, function (err) {
				if (err !== null) {
					data.err_code = 20;
					data.message = "Can not delete file";

					evt.emit("file_do_delete", data);
				} else {
					//success
					evt.emit("file_do_delete", data);
				}
			});
		} else {
			data.err_code = 10;
			data.message = "Invalide query";

			evt.emit("file_do_delete", data);
		}

	},

	do_rename: function (query, evt) {
		var data = {};
		data.err_code = 0;
		data.message = "process done";

		if (query.ori_path !== null && query.ori_name !== null && query.dst_name !== null) {
			var path = __workspace + '/' + query.ori_path;
			// var rename = spawn('mv', [path + query.ori_name, path + query.dst_name], {
			// 	'uid' : query.user.uid,
			// 	'gid' : query.user.gid[0] || query.user.gid
			// });

			// rename.stdout.on('data', function(data){
			// 	console.log(data);
			// });

			// rename.stderr.on('data', function(err){
			// 	console.log('rename stderr');
			// 	process.stdout.write(err);

			// 	data.err_code = 11;
			// 	data.message = "Fail to rename";

			// 	evt.emit("file_do_rename", data);
			// });

			// rename.on('close', function (code){
			// 	if (code !== 0) {
			// 		console.log('mv process exited with code '+code);
			// 	}

			// 	data.path = query.ori_path;
			// 	data.file = query.dst_name;

			// 	evt.emit("file_do_rename", data);
			// });

			fs.rename(path + query.ori_name, path + query.dst_name, function (err) {
				if (err) {
					data.err_code = 11;
					data.message = "Fail to rename";

					console.log(err);
				} else {
					data.path = query.ori_path;
					data.file = query.dst_name;
				}

				evt.emit("file_do_rename", data);
			});
		} else {
			data.err_code = 10;
			data.message = "Invalide query";

			evt.emit("file_do_rename", data);
		}
	},

	do_move: function (query, evt) {
		var data = {};
		data.err_code = 0;
		data.message = "process done";

		if (query.ori_path && query.ori_file  && query.dst_path && query.dst_file) {
			var ori_full = __workspace + '/' + query.ori_path + "/" + query.ori_file;
			var dst_full = __workspace + '/' + query.dst_path + "/" + query.dst_file;

			// var rename = spawn('mv', [ori_full, dst_full], {
			// 	'uid' : query.user.uid,
			// 	'gid' : query.user.gid[0] || query.user.gid
			// });

			// rename.stdout.on('data', function(data){
			// 	console.log(data);
			// });

			// rename.stderr.on('data', function(err){
			// 	console.log('rename stderr');
			// 	process.stdout.write(err);

			// 	data.err_code = 20;
			// 	data.message = "Can not move file";

			// 	evt.emit("file_do_move", data);
			// });

			// rename.on('close', function (code){
			// 	if (code !== 0) {
			// 		console.log('mv process exited with code '+code);
			// 	}

			// 	data.path = query.dst_path;
			// 	data.file = query.dst_file;

			// 	evt.emit("file_do_move", data);
			// });

			fs.rename(ori_full, dst_full, function (err) {

				if (err !== null) {
					data.err_code = 20;
					data.message = "Can not move file";

					evt.emit("file_do_move", data);
				} else {

					data.path = query.dst_path;
					data.file = query.dst_file;

					evt.emit("file_do_move", data);
				}
			});
		} else {
			data.err_code = 10;
			data.message = "Invalide query";

			evt.emit("file_do_move", data);
		}
	},

	do_import: function (query, file, evt) {
		var data = {};
		data.err_code = 0;
		data.message = "process done";

		if ( file &&  query.file_import_location_path !== null && query.file_import_location_path !== undefined ) {
			var file_path = query.file_import_location_path + '/' + file.name;

			if (fs.existsSync(__workspace + '/' + file_path) && query.is_overwrite != 'true') {
				data.err_code = 21;
				data.message = "The file already exists. Do you want to overwrite the file?";

				evt.emit("file_do_import", data);
			} else {
				var is = fs.createReadStream(file.path);
				var os = fs.createWriteStream(__workspace + '/' + query.file_import_location_path + "/" + file.name);

				is.pipe(os);

				is.on('end', function () {
					fs.unlink(file.path, function(err){
						if(err)console.log(err);
					});
					evt.emit("file_do_import", data);
				});
			}
		} else {
			data.err_code = 10;
			data.message = "Invalide query";

			evt.emit("file_do_import", data);
		}
	},

	do_export: function (query, evt) {
		var data = {};
		data.err_code = 0;
		data.message = "process done";

		if (query.user  && query.path  && query.file ) {

			// var mkdir = spawn('mkdir', [__temp_dir + '/' + query.user.id, '-m', 0777], {
			// 	'uid' : query.user.uid,
			// 	'gid' : query.user.gid[0] || query.user.gid
			// });

			// mkdir.stdout.on('data', function(data){
			// 	console.log(data);
			// });

			// mkdir.stderr.on('data', function(err){
			// 	console.log('mkdir stderr');
			// 	process.stdout.write(err);

			// 	data.err_code = 30;
			// 	data.message = "Cannot make directory";

			// 	evt.emit("file_do_export", data);
			// });

			// mkdir.on('close', function (code){
			// 	if (code !== 0) {
			// 		console.log('mkdir process exited with code '+code);
			// 	}

			// 	var cp = spawn('cp', [__workspace + '/' + query.path + '/' + query.file, __temp_dir + '/' + query.user.id + '/' + query.file], {
			// 		'uid' : query.user.uid,
			// 		'gid' : query.user.gid[0] || query.user.gid
			// 	});

			// 	cp.stdout.on('data', function(data){
			// 		console.log(data);
			// 	});

			// 	cp.stderr.on('data', function(err){
			// 		console.log('cp stderr');
			// 		process.stdout.write(err);

			// 		data.err_code = 20;
			// 		data.message = "Cannot export file";

			// 		evt.emit("file_do_export", data);
			// 	});

			// 	cp.on('close', function (code){
			// 		if (code !== 0) {
			// 			console.log('cp process exited with code '+code);
			// 		}

			// 		data.path = query.user.id + '/' + query.file;
			// 		evt.emit("file_do_export", data);
			// 	});
			// });

			fs.mkdir(__temp_dir + '/' + query.user, '0777', function (err) {
				if (!err  || err.errno == 47) { //errno 47 is exist folder error

					exec("cp " + __workspace + '/' + query.path + '/' + query.file + " " + __temp_dir + '/' + query.user + '/' + query.file, function (error, stdout, stderr) {
						if (!error) {
							data.path = query.user + '/' + query.file;
							evt.emit("file_do_export", data);
						} else {
							data.err_code = 20;
							data.message = "Cannot export file";

							evt.emit("file_do_export", data);
						}
					});
				} else {
					data.err_code = 30;
					data.message = "Cannot make directory";

					evt.emit("file_do_export", data);
				}
			});
		} else {
			data.err_code = 10;
			data.message = "Invalide query";

			evt.emit("file_do_export", data);
		}

	},

	get_url_contents: function (path, evt) { //file_get_url_contents
		var data = "";
		http.get(path, function (res) {
			res.on("data", function (chunk) {
				data += chunk;
			});

			res.on("end", function () {
				evt.emit("file_get_url_contents", data);
			});
		}).on("error", function (e) {
			data = "Got error: " + e.message;
			evt.emit("file_get_url_contents", data);
		});
	},

	get_property: function (query, evt) {

		var data = {};
		data.err_code = 0;
		data.message = "process done";

		if (query.path !== null) {

			fs.stat(__workspace + '/' + query.path, function (err, stats) {
				if (err === null) {

					var temp_path = query.path.split("/");
					var path = "";
					for (var i = 0; i < temp_path.length - 1; i++) {
						path += temp_path[i] + "/";
					}

					data.filename = temp_path[temp_path.length - 1];
					data.filetype = temp_path[temp_path.length - 1].split(".")[1];
					data.path = path;
					data.size = stats.size;
					data.atime = stats.atime;
					data.mtime = stats.mtime;

					evt.emit("file_get_property", data);
				} else {
					data.err_code = 20;
					data.message = "Can not find target file";

					evt.emit("file_get_property", data);
				}
			});
		} else {
			data.err_code = 10;
			data.message = "Invalide query";

			evt.emit("file_get_property", data);
		}
	},

	do_save_as: function (query, evt) {
		var self = this;

		var data = {};
		data.err_code = 0;
		data.message = "process done";

		if (query.path !== null && query.save_anyway) {
			var path = query.path;
			if (query.type !== "") {
				path += "." + query.type;
			}

			fs.exists(__workspace + '/' + path, function (exists) {
				if (exists && query.save_anyway == "false") {
					data.err_code = 99;
					data.message = "exist file";
					evt.emit("file_do_save_as", data);
				} else {
					// var echo = spawn('echo', [query.data, '>', __workspace + '/' + path], {
					// 	'uid' : query.user.uid,
					// 	'gid' : query.user.gid[0] || query.user.gid
					// });

					// echo.stdout.on('data', function(data){
					// 	console.log(data);
					// });

					// echo.stderr.on('data', function(err){
					// 	console.log('put_contents stderr');
					// 	process.stdout.write(err);

					// 	data.err_code = 40;
					// 	data.message = "Can not save file";

					// 	evt.emit("file_do_save_as", data);
					// });

					// echo.on('close', function (code){
					// 	if (code !== 0) {
					// 		console.log('echo process exited with code '+code);
					// 	}

					// 	evt.emit("file_do_save_as", data);
					// });

					fs.writeFile(__workspace + '/' + path, query.data, function (err) {
						if (err !== null) {
							data.err_code = 40;
							data.message = "Can not save file";

							evt.emit("file_do_save_as", data);
						} else {
							evt.emit("file_do_save_as", data);
						}
					});
				}
			});
		} else {
			data.err_code = 10;
			data.message = "Invalid query";
			evt.emit("file_do_save_as", data);
		}
	},

	get_file: function (filepath, filename, evt) {
		if (!fs.existsSync(__temp_dir)) {
			fs.mkdirSync(__temp_dir);
		}
		if (!fs.existsSync(__temp_dir + "/files")) {
			fs.mkdirSync(__temp_dir + "/files");
		}

		if (filepath) {
			var continue_path = "";
			var paths = filepath.split('/');

			for (var i = 0; i < paths.length; i++) {
				if (paths[i] !== "") {
					continue_path = continue_path + paths[i] + '/';
					if (!fs.existsSync(__temp_dir + "/files/" + continue_path)) {
						fs.mkdirSync(__temp_dir + "/files/" + continue_path);
					}
				}
			}
		}

		this.copy_file_sync(__workspace + filepath + filename, __temp_dir + "/files/" + filepath + filename);

		evt.emit("got_file", {
			result: true
		});
	},

	check_valid_edit : function(project_path, filepath, filename, evt){
		var project_real_path = __workspace+'/'+project_path;

		var valid_path = function(base_path, filepath, filename, evt) {
			if( !check_valid_path(base_path+'/'+filepath+filename) ){
				console.log('!!!!');
				evt.emit("check_valid_edit",{result:false, code:3});
				return false;
			}
			fs.exists(base_path+'/'+filepath+filename, function(exists){
				//valid file
				if(exists){
					evt.emit("check_valid_edit",{result:true});
				}else{
					//not exist -> make

					// var mkdir = spawn('mkdir', ['-p', base_path+'/'+filepath], {
					// 	'uid' : query.user.uid,
					// 	'gid' : query.user.gid[0] || query.user.gid
					// });

					// mkdir.stdout.on('data', function(data){
					// 	console.log(data);
					// });

					// mkdir.stderr.on('data', function(err){
					// 	console.log('mkdir -p stderr');
					// 	process.stdout.write(err);
					// });

					// mkdir.on('close', function (code){
					// 	if (code !== 0) {
					// 		console.log('mkdir process exited with code '+code);
					// 	}

					// 	evt.emit("check_valid_edit",{result:true, code:10});
					// });

					exec('mkdir -p ' + base_path+'/'+filepath , function(err,stdout,stderr){
						evt.emit("check_valid_edit",{result:true, code:10});
					});

				}
			});
		}

		fs.exists(project_real_path, function(project_exists){
			if (project_exists) {
				fs.lstat(project_real_path, function(err, stats){
					if (stats.isDirectory()) {
						if (stats.isSymbolicLink()) {

							// get real path
							//
							fs.readlink(project_real_path, function(read_err, link_path){
							fs.realpath(link_path, function(real_path_err, link_real_path){
								if (read_err || real_path_err) {
									evt.emit("check_valid_edit",{result:false, code:2});
								}
								else {
									valid_path(link_real_path, filepath, filename, evt);
								}
							});
							});
						}
						else {
							valid_path(__workspace, filepath, filename, evt);
						}
					}
					else {
						evt.emit("check_valid_edit",{result:false, code:1});
					}
				});


			}
			else {
				evt.emit("check_valid_edit",{result:false, code:0});
			}
		});
	},

	copy_file_sync: function (srcFile, destFile) {
		var BUF_LENGTH = 64 * 1024;
		var buff = new Buffer(BUF_LENGTH);
		var fdr = fs.openSync(srcFile, 'r');
		var fdw = fs.openSync(destFile, 'w');
		var bytesRead = 1;
		var pos = 0;
		while (bytesRead > 0) {
			bytesRead = fs.readSync(fdr, buff, 0, BUF_LENGTH, pos);
			fs.writeSync(fdw, buff, 0, bytesRead);
			pos += bytesRead;
		}
		fs.closeSync(fdr);
		fs.closeSync(fdw);
	},


	do_delete_all: function (query, callback) {
		var directorys = query.directorys;
		var files = query.files;
		var data = {};
		if (files) {
			files.forEach(function (o) {
				// var rm = spawn('rm', [__workspace + '/' + o], {
				// 	'uid' : query.user.uid,
				// 	'gid' : query.user.gid[0] || query.user.gid
				// });

				// rm.stdout.on('data', function(data){
				// 	console.log(data);
				// });

				// rm.stderr.on('data', function(err){
				// 	console.log('rm stderr');
				// 	process.stdout.write(err);

				// 	data.err_code = 20;
				// 	data.message = "Can not delete file";
				// });

				// rm.on('close', function (code){
				// 	if (code !== 0) {
				// 		console.log('rm process exited with code '+code);
				// 	}
				// });

				rimraf(__workspace + '/' + o, function (err) {
					if (err !== null) {
						data.err_code = 20;
						data.message = "Can not delete file";
					}
				});
			});
		}
		if (directorys) {
			directorys.forEach(function (o) {
				// var rm = spawn('rm', ['-r', __workspace + '/' + o], {
				// 	'uid' : query.user.uid,
				// 	'gid' : query.user.gid[0] || query.user.gid
				// });

				// rm.stdout.on('data', function(data){
				// 	console.log(data);
				// });

				// rm.stderr.on('data', function(err){
				// 	console.log('rm -r stderr');
				// 	process.stdout.write(err);

				// 	data.err_code = 20;
				// 	data.message = "Can not delete file";
				// });

				// rm.on('close', function (code){
				// 	if (code !== 0) {
				// 		console.log('rm -r process exited with code '+code);
				// 	}
				// });

				rimraf(__workspace + '/' + o, function (err) {
					if (err !== null) {
						data.err_code = 20;
						data.message = "Can not delete file";
					}
				});
			});
		}
		callback({
			result: data
		});
	},
	do_copy_file_paste: function (query, callback) {
		var data = "";
		if (query.source) {
			var files = query.source.files;
			var directorys = query.source.directorys;
			var target = query.target;
			if (files) {
				files.forEach(function (o) {
					// var cp = spawn('cp', [__workspace + '/' + o, __workspace + target], {
					// 	'uid' : query.user.uid,
					// 	'gid' : query.user.gid[0] || query.user.gid
					// });

					// cp.stdout.on('data', function(data){
					// 	console.log(data);
					// });

					// cp.stderr.on('data', function(err){
					// 	console.log('cp stderr');
					// 	process.stdout.write(err);
					// });

					// cp.on('close', function (code){
					// 	if (code !== 0) {
					// 		console.log('cp process exited with code '+code);
					// 	}
					// });

					exec("cp " + __workspace + '/' + o + " " + __workspace + target, function (error, stdout, stderr) {
						if (error !== null) {
							console.log(error);
							data += (" " + error.Error);
						}
					});
				});
			}
			if (directorys) {
				directorys.forEach(function (o) {
					// var cp = spawn('cp', ['-r', __workspace + '/' + o, __workspace + target], {
					// 	'uid' : query.user.uid,
					// 	'gid' : query.user.gid[0] || query.user.gid
					// });

					// cp.stdout.on('data', function(data){
					// 	console.log(data);
					// });

					// cp.stderr.on('data', function(err){
					// 	console.log('cp stderr');
					// 	process.stdout.write(err);
					// });

					// cp.on('close', function (code){
					// 	if (code !== 0) {
					// 		console.log('cp process exited with code '+code);
					// 	}
					// });

					exec("cp -r " + __workspace + o + " " + __workspace + target, function (error, stdout, stderr) {
						if (error !== null) {
							console.log(error);
							data += (" " + error.Error);
						}
					});
				});
			}
		}
		callback({
			result: ""
		});
	},
	upload_dir_file :function(req,evt){
		// [ files, target_path, id] needed
		if(!req.body || !req.files.file || !req.body.target_path ||req.body.target_path[0]==='/'){
			//res.json(false);
			evt.emit('upload_dir_file', false);
			return false;
		}


		//1.setting start
		var file_arr=[];

		if(!Array.isArray(req.files.file)){
			//one file
			file_arr.push(req.files.file);
		}else{
			file_arr=req.files.file;
		}


		if( file_arr.length == 0  ){
			//console.log('1-1');
			//res.json({'err_code':10, 'message':'No file to upload'});
			evt.emit('upload_dir_file', false);
			return false;
		}
		

		//file_arr[i].name
		//file_arr[i].path

		file_arr.sort(function(a,b){
			return a.name - b.name
		});

		var target_path=req.body.target_path;
		target_path=global.__workspace+target_path;
		target_path=check_special_characters(target_path);
		//console.log('target_path', target_path);


		//2.validate start
		if( !check_valid_path(target_path) ){
			//res.json(false);
			evt.emit('upload_dir_file', false);
			return false;
		}

		//3.existence target path
		fs.exists(target_path, function(exists){
			if(!exists){
				//res.json(false);
				evt.emit('upload_dir_file', false);
				return false;
			}


			//4. okay move tmp -> workspace start
			var evt_mv = new EventEmitter();
			var total_result=true;
			var current_cnt=0;

			evt_mv.on('end', function(result){
				if(!result)total_result=false;
				current_cnt++;
				if(current_cnt===file_arr.length){
					//res.json(total_result);
					evt.emit('upload_dir_file', total_result);
					
				}

			});

			var mv_exec=function(iterator){
				//console.log('mv  '+file_arr[iterator].path+'  '+target_path+file_arr[iterator].name  );
				if( !check_valid_path(target_path+file_arr[iterator]) ){
						evt.emit('end',false);
						return false;
				}

				// var mv = spawn('mv', [file_arr[iterator].path, target_path+file_arr[iterator].name], {
				// 	'uid' : query.user.uid,
				// 	'gid' : query.user.gid[0] || query.user.gid,
				// 	'cwd' : target_path
				// });

				// mv.stdout.on('data', function(data){
				// 	console.log(data);
				// });

				// mv.stderr.on('data', function(err){
				// 	console.log('rename stderr');
				// 	process.stdout.write(err);

				// 	data.err_code = 20;
				// 	data.message = "Can not move file";

				// 	evt.emit("file_do_move", data);
				// });

				// mv.on('close', function (code){
				// 	if (code !== 0) {
				// 		console.log('mv process exited with code '+code);
				// 	}

				// 	data.path = query.dst_path;
				// 	data.file = query.dst_file;

				// 	evt.emit("file_do_move", data);
				// });

				exec('mv  '+file_arr[iterator].path+'  '+target_path+file_arr[iterator].name   ,  {cwd : target_path}, function(err,stdout, stderr){
					if(err){
						console.log('mv err', err);
					}
					evt_mv.emit('end',!err);
				});

			};





			for(var i=0;i<file_arr.length;i++){
				file_arr[i].name=check_special_characters(file_arr[i].name);
				mv_exec(i);
			}



		});



	},

	upload_dir_skeleton :function(req,evt){
		//exception check start
		//[ dir_arr, target_path, user_id ] 	needed
		if(!req.body || !req.body.dir_arr || !req.body.target_path || req.body.target_path[0]==='/'){
			//res.json(false);
			evt.emit("upload_dir_skeleton", false);
			return false;
		}



		//1.setting start

		//		workspace/demo2_a/a/
		var target_path=req.body.target_path;
		target_path=global.__workspace+target_path;
		target_path=check_special_characters(target_path);
		
		var dir_arr=req.body.dir_arr;




		//2.validate start
		if( !check_valid_path(target_path) ){
			//res.json(false);
			evt.emit("upload_dir_skeleton", false);
			return false;
		}

		//3.existence target path
		fs.exists(target_path, function(exists){
			if(!exists){
				//res.json(false);
				evt.emit("upload_dir_skeleton", false);
				return false;
			}

			//4.okay  mkdir start
			var evt_mkdir = new EventEmitter();
			var total_result=true;
			var current_cnt=0;
			
			
			evt_mkdir.on('end', function(result){
				if(!result)total_result=false;
				current_cnt++;
				if(current_cnt===dir_arr.length){
					//res.json(total_result);
					
					evt.emit("upload_dir_skeleton", total_result);
				}

			});

			var mkdir_p_exec=function(iterator){
				//console.log('mkdir -p '+target_path+dir_arr[iterator]);
				//always check
				if( !check_valid_path(target_path+dir_arr[iterator]) ){
					evt_mkdir.emit('end',false);
					return false;
				}

				// var mkdir = spawn('mkdir', ['-p', target_path+dir_arr[iterator]], {
				// 	'uid' : query.user.uid,
				// 	'gid' : query.user.gid[0] || query.user.gid,
				// 	'cwd' : target_path
				// });

				// mkdir.stdout.on('data', function(data){
				// 	console.log(data);
				// });

				// mkdir.stderr.on('data', function(err){
				// 	console.log('mkdir -p stderr');
				// 	process.stdout.write(err);
				// });

				// mkdir.on('close', function (code){
				// 	if (code !== 0) {
				// 		console.log('mkdir process exited with code '+code);
				// 	}

				// 	evt_mkdir.emit('end',!err);
				// });

				exec('mkdir -p '+target_path+dir_arr[iterator], {cwd : target_path}, function(err,stdout,stderr){

					if(err){
						console.log('mkdir err', err);
					}
					evt_mkdir.emit('end',!err);
				});

			};


			for(var i=0;i<dir_arr.length;i++){
				//change ' ' -> '\ '
				dir_arr[i]=check_special_characters(dir_arr[i]);
				mkdir_p_exec(i);
			}


		});

		//5.chmod, chown, chgrp
	},





	get_result_ls: function (query, evt) {
		var query_path = __workspace + '/' + query.path;
		var author = query.author;
		var owner_roots = [];
		var response_files = [];

		for (var i = 0; i < 4; i++) {
			query_path = query_path.replace(/\/\//g, "/");
		}

		
	
		
		fs.readdir(query_path, function (err, files) {
			if (!err && files.length !== 0 && files !== undefined) {

				var current_node_cnt=0;
				evt.on('tree_push', function(){
					current_node_cnt++;
					if(files.length===current_node_cnt){
						evt.emit('tree_complete');
					}
				});

				evt.on('tree_complete', function(){

					for (var i = response_files.length - 1; i >= 0; i--) {
						if (!response_files[i] || response_files[i] === "") response_files.splice(i, 1);
					}
					response_files.sort(function (a, b) {
						if (a.cls < b.cls) return -1;
						else if (a.cls > b.cls) return 1;
						else {
							if (a.filename < b.filename) return -1;
							else return 1;
						}
					});

					evt.emit('got_result_ls', response_files);
				});

				for (var i = 0; i < files.length; i++) {
					(function (index) {
						var name = files[index] + "";
						if (name[0] == '.' || name == "project.json" || /_run.js$/.test(name)) {
							files[index] = "";
							evt.emit('tree_push');
							return false;
						}

						files[index] = {};
						files[index].filename = name;
						files[index].html = name;
						files[index].type = 'html';
						files[index].children = [];
						files[index].parent_label = query.path;
						files[index].root = query.path;

						

						fs.stat(query_path + '/' + name , function(err, stats){
							if (stats.isFile()) {
								files[index].cls = 'file';
								//expanded???
								//(filename)
								//filetype
								files[index].filetype = 'etc';
								if (name.split('.').length > 1) {
									type = name.split('.').pop();
									switch (type) {
									case 'c':
									case 'c#':
									case 'c++':
									case 'class':
									case 'config':
									case 'cpp':
									case 'css':
									case 'doc':
									case 'docs':
									case 'gif':
									case 'go':
									case 'h':
									case 'html':
									case 'java':
									case 'jpeg':
									case 'jpg':
									case 'js':
									case 'json':
									case 'package':
									case 'pdf':
									case 'php':
									case 'png':
									case 'ppt':
									case 'pptx':
									case 'psd':
									case 'py':
									case 'rb':
									case 'rule':
									case 'tar':
									case 'template':
									case 'txt':
									case 'ui':
									case 'uml':
									case 'xib':
									case 'xls':
									case 'xlsx':
									case 'xml':
									case 'xoz':
									case 'zip':

										files[index].filetype = type;
										break;
									default:
										break;
									}
								}

								//html 
								//"<div class='node'><img src=images/icons/filetype/etc.filetype.png class="directory_icon file" />goorm<div class="fullpath" style="display:none;">core1_simple_c/bin/goorm</div></div>";
								files[index].html = "";
								files[index].html += "<div class='node'><span class=\"directory_icon file filetype-etc filetype-" + files[index].filetype + "\" ></span>";
								files[index].html += name;
								files[index].html += "<div class='fullpath' style='display:none;'>" + files[index].parent_label + '/' + name + "</div>";
								files[index].html += "</div>";

								//parent_label == root??
								//project_path
								//root)
								//sortkey
								//(type)
								response_files[index] = files[index];
								evt.emit('tree_push');

							} else {
								if (query.path === "") {
									files[index].cls = 'dir';

									//(filename)
									//(name)
									//(parent_label)
									//html
									//"<div class='node'><img src=images/icons/filetype/folder.filetype.png class="directory_icon folder" />src<div class="fullpath" style="display:none;">core1_simple_c/src</div></div>";
									files[index].html = "";
									files[index].html += "<div class='node'><span class=\"directory_icon folder filetype-folder\" ></span>";
									files[index].html += name;
									files[index].html += "<div class='fullpath' style='display:none;'>" + files[index].parent_label + '/' + name + "</div>";
									files[index].html += "</div>";

									//root
									//sortkey
									//(type)

									response_files[index] = files[index];
									evt.emit('tree_push');

								} else {
									files[index].cls = 'dir';

									fs.readdir(__workspace + files[index].parent_label + '/' + name, function(err,stdout){
										if(!err && stdout){
											var children = stdout;
											var not_hidden_children_num = 0;
											for (var i = 0; i < children.length; i++) {
												if (children[i][0] != ".") {
													not_hidden_children_num++;
													break;
												}
											}
											//(filename)
											//(name)
											//(parent_label)
											//html
											//"<div class='node'><img src=images/icons/filetype/folder.filetype.png class="directory_icon folder" />src<div class="fullpath" style="display:none;">core1_simple_c/src</div></div>";
											files[index].html = "";
											if (not_hidden_children_num > 0)
												files[index].html += "<div class='node'>";
											else
												files[index].html += "<div class='node no_children'>";

												files[index].html += "<span class=\"directory_icon folder filetype-folder\" ></span>";
											files[index].html += name;
											files[index].html += "<div class='fullpath' style='display:none;'>" + files[index].parent_label + '/' + name + "</div>";
											files[index].html += "</div>";

											//root
											//sortkey
											//(type)

											response_files[index] = files[index];
											
										}
										evt.emit('tree_push');
									});
								}
							}
						});


					})(i);
				}
				
			
			} else {
				evt.emit('got_result_ls', null);
			}
		});
		
	}
};
