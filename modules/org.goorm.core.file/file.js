var walk = require('walk');
var g_env = require("../../configs/env.js");

var EventEmitter = require("events").EventEmitter;

Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

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
					node.parentLabel = "";
					node.cls = "file";
					node.expanded = false;
					node.type = "html";
					node.html = "<div style=\'line-height:9px; white-space: nowrap;\'><img src=images/icons/filetype/" + node.filename.split('.').pop() + ".filetype.png class=directoryIcon /><span style=\'margin-top:7px;\'>" + node.filename + "</span></div>";
					nodes.push(node);
				}
				
				next();
			});
			
			walker.on("end", function () {
				tree = self.make_dir_tree('/', dirs);
				tree = self.make_file_tree(tree, nodes);
				
				console.log(tree);
				//console.log(nodes);
				
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
		
		walker = walk.walk(path, options);
		
		walker.on("directories", function (root, dirStatsArray, next) {
			for (var i=0; i < dirStatsArray.length; i++) {
				var dir = {};
				dir.root = root.replace(g_env.path + "workspace/", "") + "/";
				dir.name = dirStatsArray[i].name;
				dir.parentLabel = "";
				dir.cls = "dir";
				dir.expanded = true;
				dir.type = "html";
				dir.html = dir.name;
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
		var marked = [];
		
		for (var i=0; i<tree.length; i++) {
			for (var j=0; j<files.length; j++) {
				if (tree[i].root + tree[i].name + '/' == files[j].root) {
					marked.push(j);
					tree[i].children.push(files[j]);
				}
			}
		}
		
		return tree;
	},
};
