/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.dialog.explorer = function () {
	this.location_path = null;
	this.dir_tree = null;
	this.files = null;
	
	this.treeview = null;	
	
	this.current_path = null;
	
	this.target_name = null;
	
	this.is_dir_only = false;
};

org.goorm.core.dialog.explorer.prototype = {
	init: function (context, is_dir_only) {
		var self = this;
		
		self.location_path = context + "_location_path";
		self.dir_tree_ori = context + "_dir_tree";
		
		self.dir_tree_ori = self.dir_tree_ori.replace("#", "");
		
		self.dir_tree = context + "_dir_tree";
		self.files = context + "_files";

		self.current_path = core.status.current_project_path;

		$(self.location_path).val(self.current_path);
		
		self.target_name = context+"_target_name";
		$(self.target_name).val("");
		
		self.is_dir_only = is_dir_only;
		
		if (self.is_dir_only) {
			self.add_directories();
		}
		else {
			self.add_directories();
			self.add_file_items();
		}
		
		return self.treeview;
	},
	
	get_data: function() {
		var self = this;
	
		var data = {};
		data.path = $(self.location_path).val();
		if (data.path=="") {
			data.path="/";
		}
		data.name = $(self.target_name).val();
		
		return data;	
	},
	
	add_directories: function() {		
		var self = this;

		$(self.dir_tree).empty();		

		var postdata = {
			path: this.current_path
		};

		$.get("file/get_dir_nodes", postdata, function (data) {
			
			self.treeview = new YAHOO.widget.TreeView(self.dir_tree_ori, data);

			self.treeview.subscribe("clickEvent", function(nodedata) {	
				console.log("click!!");
				if(nodedata.node.data.cls == "dir") {

					self.current_path = (nodedata.node.data.parent_label + nodedata.node.data.name).replace("//", "/");

					$(self.location_path).attr("value", self.current_path);

					if (!self.is_dir_only) {
						self.add_file_items();
					}
				}
				
				return false;				
			});
			
			self.treeview.subscribe("dblClickEvent", function(nodedata) {	
				if(nodedata.node.data.cls == "dir") {
					if (nodedata.node.expanded) {
						nodedata.node.collapse();
					}
					else { 
						nodedata.node.expand();
					}
				}
			});
						
			self.treeview.render();
			
			self.tree_expand_complete();
			
			self.treeview.subscribe("expandComplete", function () {
				self.tree_expand_complete();	
			});
			
			if (self.current_path == "") {
				$(self.dir_tree).find(".ygtvdepth0").find(".ygtvcell").prev().addClass("ygtvfocus");
				$(self.dir_tree).find(".ygtvdepth0").find(".ygtvcell").addClass("ygtvfocus");
			}
			
		});
	},

	expand_directory: function (directory) {
				
		$(self.dir_tree).find(".ygtvfocus").parent().parent().parent().parent().find(".ygtvcell").each(function () {
			if ($(this).find(".fullpath").text().split("/").pop() == directory) {
				$(self.dir_tree).find(".ygtvfocus").removeClass("ygtvfocus");
				
				$(this).prev().addClass("ygtvfocus");
				$(this).addClass("ygtvfocus");
			}
		});

		this.treeview.getNodeByElement($(self.dir_tree).find(".ygtvfocus")[0]).expand();
	},
	
	tree_expand_complete: function () {
		$(self.dir_tree).find(".ygtvcell").unbind("mousedown");		
		$(self.dir_tree).find(".ygtvcell").mousedown(function (e) {
			if ($(this).hasClass("ygtvfocus") == false) {
				$(self.dir_tree).find(".ygtvfocus").removeClass("ygtvfocus");
				
				if ($(this).hasClass("ygtvcontent")) {
					$(this).prev().addClass("ygtvfocus");
					$(this).addClass("ygtvfocus");
				}	
			}
		});	
	},
	
	add_file_items: function () {
		
		var self = this;
		
		$(self.files).empty();
		
		var postdata = {
			path: this.current_path
		};
		
		$.get("file/get_nodes", postdata, function (data) {

		for(var idx=0; idx<data.length; idx++) {
				var icon_str = "";
				if(data[idx].cls=="dir") {
					icon_str += "<div class='folder_item'";
					icon_str +=" filename='"+data[idx].name+"' filepath='"+data[idx].parent_label+"'>";
					icon_str += "<img src='images/org.goorm.core.file/folder.png'>";					
				}
				else {
					icon_str += "<div class='file_item'";
					icon_str +=" filename='"+data[idx].filename+"' filetype='"+data[idx].filetype+"' filepath='"+data[idx].parent_label+"'>";
					icon_str += "<img src='images/org.goorm.core.file/file.png'>";					
				}
				
				icon_str += "<div style='word-break:break-all; width:60px; line-height:12px; margin-left:5px; margin-right:5px; margin-bottom:5px;'>";
				
				if(data[idx].cls=="dir") {
					icon_str += data[idx].name;				
				}
				else {
					icon_str += data[idx].filename;
				}
				
				icon_str += "</div>";
				icon_str += "</div>";
				
				$(self.files).append(icon_str);
			}
			
			$(self.files).find(".folder_item").dblclick(function() {
				if (self.current_path == "/")	self.current_path = "";
				self.current_path = self.current_path+"/"+$(this).attr("filename");
				$(self.location_path).val(self.current_path);

				self.add_file_items();
				self.expand_directory($(this).attr("filename"));
			});
			
				
			$(self.files).find(".folder_item").click(function() {
				$(self.files).find(".file_item").removeClass("selected_item");
				$(self.files).find(".folder_item").removeClass("selected_item");
				$(this).addClass("selected_item");
			});	

			if (self.files=="#file_open_files") {
				$(self.files).find(".file_item").dblclick(function() {
					core.module.layout.workspace.window_manager.open($(this).attr("filepath"), $(this).attr("filename"), $(this).attr("filetype"));
					core.dialog.open_file.dialog.panel.hide();
				});
		
				$(self.files).find(".file_item").click(function() {
				
					$(self.files).find(".file_item").removeClass("selected_item");
					$(self.files).find(".folder_item").removeClass("selected_item");
					$(this).addClass("selected_item");				
				
					$(self.target_name).attr("value", $(this).attr("filename"));
					
					self.filename = $(this).attr("filename");
					self.filetype = $(this).attr("filetype");
					self.filepath = $(this).attr("filepath");
				});
			}
			else if (self.files=="#file_export_files") {		
				$(self.files).find(".file_item").click(function() {
				
					$(self.files).find(".file_item").removeClass("selected_item");
					$(self.files).find(".folder_item").removeClass("selected_item");
					$(this).addClass("selected_item");				
				
					$(self.target_name).attr("value", $(this).attr("filename"));
					
					self.filename = $(this).attr("filename");
					self.filetype = $(this).attr("filetype");
					self.filepath = $(this).attr("filepath");
				});
			}
			else {
				$(self.files).find(".file_item").click(function() {
					$(self.files).find(".file_item").removeClass("selected_item");
					$(self.files).find(".folder_item").removeClass("selected_item");
					$(this).addClass("selected_item");
				});
			}
		});
	}	
};