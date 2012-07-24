/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.file._new.folder = function () {
	this.dialog = null;
	this.buttons = null;
	this.treeview = null;
	this.current_path = null;
};

org.goorm.core.file._new.folder.prototype = {
	init: function () { 
		var self = this;
		
		var handle_ok = function() {
			if($("#folder_new_input_folder_name").attr("value")=="") {
				//alert.show(core.module.localization.msg["alertFolderNameEmpty"]);
				alert.show("Folder Name is empty.");
				return false;
			}
			else {
				var postdata = {
					current_path: $("#folder_new_input_location_path").val(),
					folder_name: $("#folder_new_input_folder_name").val(),
				};

				$.get("file/new_folder", postdata, function (data) {
					if (data.err_code==0) {
						core.module.layout.project_explorer.refresh();
					}
					else {
						alert.show(data.message);
					}
				});
			}
			
			this.hide();
		};

		var handle_cancel = function() { 
			
			this.hide(); 
		};
		
		this.buttons = [ {text:"OK", handler:handle_ok, isDefault:true},
						 {text:"Cancel",  handler:handle_cancel}]; 

		this.dialog = new org.goorm.core.file._new.folder.dialog();
		this.dialog.init({
			title:"New folder", 
			path:"configs/dialogs/org.goorm.core.file/file._new.folder.html",
			width:400,
			height:500,
			modal:true,
			buttons:this.buttons, 
			success: function () {

			}
		});
		this.dialog = this.dialog.dialog;
		
		//this.dialog.panel.setBody("AA");
	},
	
	show: function (context) {
		var self = this;
		
		this.current_path = "/"+core.status.current_project_path;

		if(context) {
			var dir =  core.status.selected_file;
			dir = dir.replace(/\.\.\/\.\.\/project\/\//, "");
			dir = dir.replace(/\.\.\/\.\.\/project\//, "");
			dir = "/" + dir;
			dir = dir.replace(/\/\/\//, "/");
			dir = dir.replace(/\/\//, "/");
			$("#folder_new_input_location_path").val(dir);
		}
		else {
			$("#folder_new_input_location_path").val(this.current_path);
		}
	
		var postdata = {
			kind: "project",
			project_name: this.current_path,
			folder_only: "true"
		};
		
		this.add_directories(postdata);
		
		$("#folder_new_input_folder_name").val("");
		
		this.dialog.panel.show();
	},
	
	add_directories: function(postdata) {		
		var self = this;

		$.get("file/get_nodes", postdata, function (data) {

			var sort_project_treeview = function (sorting_data) { 				
				s.quick_sort(sorting_data);
			};

			var sorting_data = eval(data);
			
			sort_project_treeview(sorting_data);
			
			var new_data = new Array();

			for(var name in sorting_data) {
				if(sorting_data[name].cls=="folder") {
					new_data.push(sorting_data[name]);
				}
			}

			self.treeview = new YAHOO.widget.TreeView("folder_new_treeview", new_data);

			self.treeview.subscribe("clickEvent", function(nodedata) {	
				if(nodedata.node.data.cls == "folder") {
					var filename = nodedata.node.data.filename;
					var filetype = nodedata.node.data.filetype;
					var filepath = nodedata.node.data.parentLabel;

					var dir = filepath + "/" + filename;
					dir = dir.replace(/\.\.\/\.\.\/project\/\//, "");
					dir = dir.replace(/\.\.\/\.\.\/project\//, "");
					dir = "/" + dir;
					dir = dir.replace(/\/\/\//, "/");
					dir = dir.replace(/\/\//, "/");
						
					self.current_path = dir;

					$("#folder_new_input_location_path").val(self.current_path);

				}
				
				return false;				
			});
			
			self.treeview.subscribe("dblClickEvent", function(nodedata) {	
				if(nodedata.node.data.cls == "folder") {
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
				$("#folder_new_treeview").find(".ygtvdepth0").find(".ygtvcell").prev().addClass("ygtvfocus");
				$("#folder_new_treeview").find(".ygtvdepth0").find(".ygtvcell").addClass("ygtvfocus");
			}
			
		});
	},

	expand_directory: function (directory) {
				
		$("#folerNewTreeview").find(".ygtvfocus").parent().parent().parent().parent().find(".ygtvcell").each(function () {
			if ($(this).find(".fullpath").text().split("/").pop() == directory) {
				$("#folder_new_treeview").find(".ygtvfocus").removeClass("ygtvfocus");
				
				if ($(this).hasClass("ygtvcontent")) {
					$(this).prev().addClass("ygtvfocus");
					$(this).addClass("ygtvfocus");
				}
			}
		});

		this.treeview.getNodeByElement($("#folder_new_treeview").find(".ygtvfocus")[0]).expand();
	},
	
	tree_expand_complete: function () {
		$("#folder_new_treeview").find(".ygtvcell").unbind("mousedown");		
		$("#folder_new_treeview").find(".ygtvcell").mousedown(function (e) {
			if ($(this).hasClass("ygtvfocus") == false) {
				$("#folder_new_treeview").find(".ygtvfocus").removeClass("ygtvfocus");
				
				if ($(this).hasClass("ygtvcontent")) {
					$(this).prev().addClass("ygtvfocus");
					$(this).addClass("ygtvfocus");
				}	
			}
		});	
	}
};