var fs = require('fs');
var walk = require('walk');
var EventEmitter = require("events").EventEmitter;
var rimraf = require('rimraf');

var root_dir = "";

module.exports = {
	init: function () {
	
	},
	
	do_new: function (path, evt) {
		
	},
	
	do_new_folder: function (query, evt) {
		var self = this;
		
		var data = {};
		data.err_code = 0;
		data.message = "process done";

		if ( query.current_path!=null && query.folder_name!=null ) {

			fs.readdir(__path+'workspace/'+query.current_path, function(err, files) {
				if (err!=null) {
					data.err_code = 10;
					data.message = "Server can not response";

					evt.emit("file_do_new_folder", data);
				}
				else {
					if (files.hasObject(query.folder_name)) {
						data.err_code = 20;
						data.message = "Exist folder";

						evt.emit("file_do_new_folder", data);
					}
					else {
						fs.mkdir(__path+'workspace/'+query.current_path+'/'+query.folder_name, '0777', function(err) {
							if (err!=null) {
								data.err_code = 30;
								data.message = "Cannot make directory";
		
								evt.emit("file_do_new_folder", data);							}
							else {
								evt.emit("file_do_new_folder", data);
							}
						});
					}					
				}
			});
		}
		else {
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
		
		if ( query.current_path!=null ) {
			fs.readdir(__path+'workspace/'+query.current_path, function(err, files) {
				if (err!=null) {
					data.err_code = 10;
					data.message = "Server can not response";

					evt.emit("file_do_new_untitled_text_file", data);
				}
				else {
					var temp_file_name = "untitled";
					var i=1;
					
					while(1) {
						if (files.hasObject(temp_file_name+i+".txt")) {
						}
						else {
							break;
						}
						i++;
					}
					
					fs.writeFile(__path+'workspace/'+query.current_path+'/'+temp_file_name+i+'.txt', "", function(err) {
						if (err!=null) {
							data.err_code = 40;
							data.message = "Can not make project file";
							
							evt.emit("file_do_new_untitled_text_file", data);
						}
						else {
							//data.

							evt.emit("file_do_new_untitled_text_file", data);
						}
					});
				}
			});
		}
		else {
			data.err_code = 10;
			data.message = "Invalid query";
			evt.emit("file_do_new_untitled_text_file", data);
		}
	},
	
	put_contents: function (query, evt) {

		var data = {};

		fs.writeFile(__path+'/workspace/'+query.path, query.data, function(err) {
			if (err!=null) {
				data.err_code = 10;
				data.message = "Can not save";
	
				evt.emit("file_put_contents", data);
			}
			else {
				data.err_code = 0;
				data.message = "saved";
	
				evt.emit("file_put_contents", data);
			}
		});		
	},
		
	get_nodes: function (path, evt) {
		var self = this;
		
		var evt_dir = new EventEmitter();
				
		var nodes = [];
		
		root_dir = path.replace(__path + "workspace/", "") + "/";
		
		evt_dir.on("got_dir_nodes_for_get_nodes", function (dirs) {
			var options = {
				followLinks: false
			};

			var walker = walk.walk(path, options);
			
			walker.on("files", function (root, file_stats, next) {
				for (var i=0; i < file_stats.length; i++) {
					var node = {};
					node.root = root.replace(__path + "workspace/", "") + "/";
					node.filename = file_stats[i].name;
					node.parent_label = node.root;
					node.cls = "file";
					node.expanded = false;
					node.sortkey = 1 + node.filename;
					node.type = "html";
					
					var extension = node.filename.split('.').pop();
					if (extension == node.filename) {
						extension = "etc";
					}
					node.html = "<div style=\'height:22px; line-height:11px; padding-right:4px; overflow:hidden; white-space:nowrap;\'>" 
								+ "<img src=images/icons/filetype/" + extension + ".filetype.png class=\"directory_icon file\" />"
								+ node.filename
								+ "<div class=\"fullpath\" style=\"display:none;\">" + node.root + node.filename + "</div>"
							  + "</div>";
					node.children = [];
					node.filetype = extension;
					nodes.push(node);
				}
				
				next();
			});
			
			walker.on("end", function () {
				tree = self.make_dir_tree(root_dir, dirs);
				tree = self.make_file_tree(tree, nodes);
				evt.emit("got_nodes", tree);
			});
		
		});
		
		this.get_dir_nodes(path, evt_dir);
	},
	
	get_dir_nodes: function (path, evt) {
		var self = this;
		
		var options = {
			followLinks: false
		};
		
		var dirs = [];
		
		var walker = walk.walk(path, options);
		
		walker.on("directories", function (root, dir_stats_array, next) {
			for (var i=0; i < dir_stats_array.length; i++) {
				var dir = {};
				dir.root = root.replace(__path + "workspace/", "") + "/";
				dir.name = dir_stats_array[i].name;
				dir.parent_label = dir.root;
				dir.cls = "dir";
				dir.expanded = true;
				dir.sortkey = 0 + dir.name;
				dir.type = "html";
				dir.html = "<div style=\'height:22px; line-height:11px; padding-right:4px; overflow:hidden; white-space:nowrap;\'>" 
							+ "<img src=images/icons/filetype/folder.filetype.png class=\"directory_icon file\" />"
							+ dir.name
							+ "<div class=\"fullpath\" style=\"display:none;\">" + dir.root + dir.name + "</div>"
						 + "</div>";
				dir.children = [];
				dirs.push(dir);
			}
			
			next();
		});
		
		walker.on("end", function () {
			tree = self.make_dir_tree(root_dir, dirs);
			evt.emit("got_dir_nodes", tree);
			evt.emit("got_dir_nodes_for_get_nodes", dirs);
		});
	},
	
	make_dir_tree: function (root, dirs) {
		var tree = [];
		var rest = [];
				
		for (var i=0; i<dirs.length; i++) {
			if (dirs[i].root == root) {
				tree.push(dirs[i]);
			}
			else {
				rest.push(dirs[i]);
			}
		}
		
		for (var i=0; i<tree.length; i++) {
			var children = this.make_dir_tree(root + tree[i].name + '/', rest);
			tree[i].children = children;
		}
		
		return tree;
	},
	
	make_file_tree: function (tree, files) {
		if (tree != undefined) {
			var marked = [];

			//fucking root			
			for (var j=0; j<files.length; j++) {
				if (files[j].root == root_dir) {
					marked.push(j);
					tree.push(files[j]);
				}
			}
			
			for (var i=0; i<tree.length; i++) {
				for (var j=0; j<files.length; j++) {
					if (!marked.hasObject(j) && tree[i].root + tree[i].name + '/' == files[j].root) {
						marked.push(j);
						tree[i].children.push(files[j]);
					}
				}
			}
			
			var rest_files = [];
			
			for (var j=0; j<files.length; j++) {
				if (!marked.hasObject(j)) {
					rest_files.push(files[j]);
				}
			}
			
			for (var i=0; i<tree.length; i++) {
				if (tree[i].children.length > 0) {
					tree[i].children.join(this.make_file_tree(tree[i].children, rest_files));
				}
			}
			
			return tree;
		}
		else {
			return null;
		}
	},
	
	do_delete: function (query, evt) {
		var data = {};
		data.err_code = 0;
		data.message = "process done";
		
		if (query.file_path != null) {
			rimraf(__path+"workspace/"+query.file_path, function(err) {
				if (err!=null) {
					data.err_code = 20;
					data.message = "Can not delete file";
					
					evt.emit("file_do_delete", data);
				}
				else {
					//success
					evt.emit("file_do_delete", data);
				}
			});
		}
		else {
			data.err_code = 10;
			data.message = "Invalide query";
			
			evt.emit("file_do_delete", data);
		}		
/*
		rimraf(__path+query.path, function(err) {
		evt.emit("project_do_delete", err);			
		});
*/
		
	},
	
	do_rename: function (query, evt) {
		var data = {};
		data.err_code = 0;
		data.message = "process done";
				
		if (query.ori_path != null && query.ori_name != null && query.dst_name != null) {
			var path = __path+"workspace/"+query.ori_path
			fs.rename(path+query.ori_name, path+query.dst_name, function (err) {

				data.path = query.ori_path;
				data.file = query.dst_name;

				evt.emit("file_do_rename", data);
			});
		}
		else {
			data.err_code = 10;
			data.message = "Invalide query";
			
			evt.emit("file_do_rename", data);
		}		
/*
		rimraf(__path+query.path, function(err) {
		evt.emit("project_do_delete", err);			
		});
*/
		
	}
};
