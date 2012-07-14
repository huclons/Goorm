var walk = require('walk');
var g_env = require("../../configs/env.js");

var EventEmitter = require("events").EventEmitter;

Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

Array.prototype.hasObject = (
  !Array.indexOf ? function (o)
  {
    var l = this.length + 1;
    while (l -= 1)
    {
        if (this[l - 1] === o)
        {
            return true;
        }
    }
    return false;
  } : function (o)
  {
    return (this.indexOf(o) !== -1);
  }
);

module.exports = {
	init: function () {
	
	},
		
	get_nodes: function (path, evt) {
		var self = this;
		
		var evt_dir = new EventEmitter();
				
		var nodes = [];
		
		evt_dir.on("got_dir_nodes_for_get_nodes", function (dirs) {
			var options = {
				followLinks: false
			};

			walker = walk.walk(path, options);
			
			walker.on("files", function (root, fileStats, next) {
				for (var i=0; i < fileStats.length; i++) {
					var node = {};
					node.root = root.replace(g_env.path + "workspace/", "") + "/";
					node.filename = fileStats[i].name;
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
					nodes.push(node);
				}
				
				next();
			});
			
			walker.on("end", function () {
				tree = self.make_dir_tree('/', dirs);
//				console.log(tree);
				tree = self.make_file_tree(tree, nodes);
				evt.emit("got_nodes", tree);
				//console.log(tree);
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
		
		walker = walk.walk(path, options);
		
		walker.on("directories", function (root, dirStatsArray, next) {
			for (var i=0; i < dirStatsArray.length; i++) {
				var dir = {};
				dir.root = root.replace(g_env.path + "workspace/", "") + "/";
				dir.name = dirStatsArray[i].name;
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
			tree = self.make_dir_tree('/', dirs);
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
				if (files[j].root == "/") {
					marked.push(j);
					tree.push(files[j]);
				}
			}
			
			for (var i=0; i<tree.length; i++) {
				for (var j=0; j<files.length; j++) {
//					console.log(tree[i].root + tree[i].name + '/' +"        "+ files[j].root +"        "+ files[j].filename);
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
};
