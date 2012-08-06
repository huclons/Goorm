/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.file._export = function () {
	this.dialog = null;
	this.buttons = null;
	this.tabview = null;
	this.treeview = null;
	this.current_path = null;
};

org.goorm.core.file._export.prototype = {
	init: function () { 
		var self = this;
		
		var handle_ok = function() {
			if($("#file_export_project_name_read").attr("value")=="") {
				//alert.show(core.module.localization.msg["alertFileNotSelect"]);
				alert.show("Not Selected");
				return false;
			}

			var postdata = {
				selected_project_name: $("#file_export_project_name_read").attr("value"),
				selected_project_path: self.current_path,
				export_type: $("#export_type").attr("value")
			};
						
			$.post("file/export", postdata, function (data) {
			
				var received_data = eval("("+data+")");

				if(received_data.errCode==0) {
					location.href=received_data.download_path;
					setTimeout(function() {
						core.module.layout.project_explorer.refresh();
					}, 50);
				}
			});
		
			//
			this.hide(); 
		};

		var handle_cancel = function() { 
			
			this.hide(); 
		};
		
		this.buttons = [ {text:"OK", handler:handle_ok, isDefault:true},
						 {text:"Cancel",  handler:handle_cancel}]; 
						 
		this.dialog = new org.goorm.core.file._export.dialog();
		this.dialog.init({
			title:"Export File", 
			path:"configs/dialogs/org.goorm.core.file/file._export.html",
			width:800,
			height:500,
			modal:true,
			yes_text:"Open",
			no_text:"Cancel",
			buttons:this.buttons,
			success: function () {
				var resize = new YAHOO.util.Resize("file_export_dialog_left", {
		            handles: ['r'],
		            minWidth: 200,
		            maxWidth: 400
		        });
				
		        resize.on('resize', function(ev) {
					var width = $("#file_export_dialog_middle").width();
		            var w = ev.width;
		            $("#file_export_dialog_center").css('width', (width - w - 9) + 'px');
		        });
			}
		});
		this.dialog = this.dialog.dialog;
		
		//this.dialog.panel.setBody("AA");
	},
	
	show: function () {
	
		$("#file_export_project_name_read").val("");
		
		this.refresh_all();
	
		this.dialog.panel.show();
	},
	
	add_directories: function(postdata) {		
		var self = this;

		$.post("file/get_nodes", postdata, function (data) {

			var sort_project_treeview = function (sorting_data) {
				s.quick_sort(sorting_data);
				
				for(i=0; i<sorting_data.length; i++) {
					if(sorting_data[i].children) {
						s.quick_sort(sorting_data[i].children);
					}
				}
			};

			var sorting_data = eval(data);
			
			sort_project_treeview(sorting_data);

			self.treeview = new YAHOO.widget.TreeView("file_export_treeview", sorting_data);
		    
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

					$("#file_export_input_location_path").attr("value", self.current_path);

					var postdata = {
						kind: "project",
						project_name: self.current_path,
						folder_only: "false"
					};
					self.add_file_items(postdata);
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
				$("#file_export_treeview").find(".ygtvdepth0").find(".ygtvcell").prev().addClass("ygtvfocus");
				$("#file_export_treeview").find(".ygtvdepth0").find(".ygtvcell").addClass("ygtvfocus");
			}

			
		});
	},

	expand_directory: function (directory) {
				
		$("#file_export_treeview").find(".ygtvfocus").parent().parent().parent().parent().find(".ygtvcell").each(function () {
			if ($(this).find(".fullpath").text().split("/").pop() == directory) {
				$("#file_export_treeview").find(".ygtvfocus").removeClass("ygtvfocus");
				
				$(this).prev().addClass("ygtvfocus");
				$(this).addClass("ygtvfocus");
			}
		});

		this.treeview.getNodeByElement($("#file_export_treeview").find(".ygtvfocus")[0]).expand();
	},
	
	tree_expand_complete: function () {
		$("#file_export_treeview").find(".ygtvcell").unbind("mousedown");		
		$("#file_export_treeview").find(".ygtvcell").mousedown(function (e) {
			if ($(this).hasClass("ygtvfocus") == false) {
				$("#file_export_treeview").find(".ygtvfocus").removeClass("ygtvfocus");
				
				if ($(this).hasClass("ygtvcontent")) {
					$(this).prev().addClass("ygtvfocus");
					$(this).addClass("ygtvfocus");
				}		
	
			}
		});	
	},
	
	add_file_items: function (postdata) {
	
		$("#file_export_dialog_center").empty();
	
		var self = this;
		
		$.post("file/get_nodes", postdata, function (data) {
			
			var sort_project_treeview = function (sorting_data) { 				
				s.quick_sort(sorting_data);
			};

			var sorting_data = eval(data);
			
			sort_project_treeview(sorting_data);
			
			for(var name in sorting_data) {
				var icon_str = "";
				if(sorting_data[name].cls=="folder") {
					icon_str += "<div class='folder_item'";
				}
				else {
					icon_str += "<div class='file_item'";
				}
				
				icon_str +=" filename='"+sorting_data[name].filename+"' filetype='"+sorting_data[name].filetype+"' filepath='"+sorting_data[name].parentLabel+"'>";
				if(sorting_data[name].cls=="folder") {
					icon_str += "<img src='images/org.goorm.core.file/folder.png'>";
				}
				else {
					icon_str += "<img src='images/org.goorm.core.file/file.png'>";
				}
				icon_str += "<div style='word-break:break-all; word-wrap: break-word; width:60px; line-height:12px; margin-left:5px; margin-right:5px; margin-bottom:5px;'>";
				icon_str += sorting_data[name].filename;
				icon_str += "</div>";
				icon_str += "</div>";
				
				$("#file_export_dialog_center").append(icon_str);
			}
			

			$("#file_export_dialog_middle").find(".folder_item").dblclick(function() {

				if (self.current_path == "/")	self.current_path = "";
				self.current_path = self.current_path+"/"+$(this).attr("filename");
				$("#file_export_input_location_path").val(self.current_path);

				var postdata = {
					kind: "project",
					project_name: self.current_path,
					folder_only: "false"
				};
									
				self.add_file_items(postdata);
				self.expand_directory($(this).attr("filename"));
			});
			

			$("#file_export_dialog_middle").find(".file_item").click(function() {
				$("#file_export_dialog_middle").find(".file_item").removeClass("selected_item");
				$("#file_export_dialog_middle").find(".folder_item").removeClass("selected_item");
				$(this).addClass("selected_item");
			});
			
			$("#file_export_dialog_middle").find(".folder_item").click(function() {
				$("#file_export_dialog_middle").find(".file_item").removeClass("selected_item");
				$("#file_export_dialog_middle").find(".folder_item").removeClass("selected_item");
				$(this).addClass("selected_item");
			});			

			$("#file_export_dialog_middle").find(".file_item").click(function() {			
				$("#file_export_project_name_read").attr("value", $(this).attr("filename"));
				
				self.filename = $(this).attr("filename");
				self.filetype = $(this).attr("filetype");
				self.filepath = $(this).attr("filepath");
			});

		});
	},
	
	refresh_all: function() {
		this.current_path = "/"+core.status.current_project_path;

		$("#file_export_input_location_path").val(this.current_path);

		var postdata = {
			kind: "project",
			project_name: this.current_path,
			folder_only: "true"
		};
		
		this.add_directories(postdata);
		
		postdata = {
			kind: "project",
			project_name: this.current_path,
			folder_only: "false"
		};
		
		this.add_file_items(postdata);
	}
};