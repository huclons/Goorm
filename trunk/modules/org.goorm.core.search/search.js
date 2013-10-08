/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jshint newcap:false, debug:true, unused: true, evil: true, devel: true, node: true, plusplus: false, undef: false */
/*serverside jslint comment for global */
/*global __local_mode: false, __workspace: false */
/*jshint unused: false */



var fs = require('fs');
var exec = require('child_process').exec;



module.exports = {

	do_search: function(query, evt) {
		var self = this;

		var author = query.author;
		var find_query = query.find_query;
		var project_path = query.project_path;
		var grep_option = query.grep_option;

		var nodes = {};

		var parser = function(matched_files_list) {
			var nodes = {};

			if( matched_files_list.length != 0) {
				var idx=0;
				var node={};
				for ( idx = 0; idx < matched_files_list.length; idx++) {
					if (matched_files_list[idx].split(":").length > 1) {
						node = {};
						node.filename = matched_files_list[idx].split(":")[0].match(/[^/]*$/)[0];
						node.filetype = matched_files_list[idx].replace(/(\/[a-zA-Z0-9_-]+)+\/?/, "").split(":")[0];
						node.filepath = matched_files_list[idx].split(":")[0].replace(__workspace, "").substring(0, matched_files_list[idx].split(":")[0].replace(__workspace, "").lastIndexOf("/") + 1);
						node.matched_line = 1;
						node.expanded = false;
						node.type = "html";
						node.html = "";
						node.children = [];

						nodes[node.filepath + node.filename] = node;
					}
				}

				for ( idx = 0; idx < matched_files_list.length; idx++) {
					if (matched_files_list[idx].split(":").length > 1) {
						node = {};

						node.filename = matched_files_list[idx].split(":")[0].match(/[^/]*$/)[0];
						node.filetype = matched_files_list[idx].replace(/(\/[a-zA-Z0-9_-]+)+\/?./, "").split(":")[0];
						node.filepath = matched_files_list[idx].split(":")[0].replace(__workspace, "").substring(0, matched_files_list[idx].split(":")[0].replace(__workspace, "").lastIndexOf("/") + 1);
						node.matched_line = matched_files_list[idx].split(":")[1];
						node.expanded = false;
						node.type = "html";
						node.html = "<span style=\"color: #666; font-weight:bold;\">Line: " + node.matched_line + "</span> - <span style=\"color: #808080\">" + matched_files_list[idx].split(":")[2] + "</span>";

						nodes[node.filepath + node.filename].children.push(node);
					}
				}

				var key = null;

				for (key in nodes) {
					nodes[key].matched_line = nodes[key].children[0].matched_line;
					nodes[key].html = "<div class='node'>" + "<span class=\"directory_icon file filetype-etc filetype-etc\" style=\"margin: 0px 3px 0 2px !important; float:left\" ></span>" + nodes[key].filepath + nodes[key].filename + "<div class=\"matched_lines_cnt\" style=\"float:right; background: #99acc4; color: white; width: 14px; height: 14px; text-align:center; -webkit-border-radius:3px; -moz-border-radius:3px; border-radius:3px; margin: 1px 10px 0px;\">" + nodes[key].children.length + "</div>" + "<div class=\"fullpath\" style=\"display:none;\">" + nodes[key].filepath + nodes[key].filename + "</div>" + "</div>";
				}
			}

			return nodes;
		};

		

		
		self.get_data_from_project({
			'find_query' : find_query,
			'project_path' : project_path,
			'grep_option' : grep_option
		}, function(matched_files_list){
			nodes = parser(matched_files_list);
			evt.emit('file_do_search_on_project', nodes);
		});
		
	},

	get_data_from_project: function (option, callback) {
		var find_query = option.find_query;
		var project_path = option.project_path;
		var grep_option = option.grep_option;
		var invert_match = " | grep -v \"/.svn\" | grep -v \"Binary\" | grep -v \"file.list\" | grep -v \"project.json\" | grep -v \".classpath\"";

		fs.exists(__workspace.slice(0, -1) + project_path, function(exists){
			if(exists) {
				var command = exec("grep " + find_query + " " + __workspace.slice(0, -1) + project_path + grep_option + invert_match, function (error, stdout, stderr) {
					if (error === null) {
						var matched_files_list = stdout.split(/\n/);
						matched_files_list.pop();

						callback(matched_files_list);
					} else {
						console.log('Search Error : ', error);
						callback([]);
					}
				});
			}
			else{
				callback([]);
			}
		});
	}
};