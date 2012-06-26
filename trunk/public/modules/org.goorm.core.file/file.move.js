/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.file.move = function () {
	this.dialog = null;
	this.buttons = null;
	this.treeview = null;
	this.filename = null;
	this.filetype = null;
	this.filepath = null;
	this.current_path = null;
	this.is_alive_window = null;
};

org.goorm.core.file.move.prototype = {
	init: function () { 
		
		var self = this;
				
		var handle_ok = function() { 

			var input_filename = $("#file_move_input_filename").val();
						
			if (input_filename == "") {
				alert.show(core.module.localization.msg["alertFileNameEmpty"]);
				return false;
			}
			
			var target_filepath = "../../project/"+self.current_path;
			
			var postdata = {
				original_file: $("#input_move_old_filepath").val() + "/" + $("#input_move_old_filename").val(),
				target_file: target_filepath+"/"+input_filename
			};

			$.post("file/move", postdata, function (data) {
				var received_data = eval("("+data+")");
				
				if(received_data.errCode==0) {
					if(self.is_alive_window) {
						var window_manager = core.module.layout.workspace.window_manager;
						var filetype = window_manager.window[window_manager.active_window].filetype;
						window_manager.window[window_manager.active_window].close();
						window_manager.open(target_filepath, input_filename, filetype);
					}
					core.module.layout.project_explorer.refresh();
				}
				else {
					alert.show(core.module.localization.msg["alertError"] + received_data.message);
				}
			});
			
			this.hide(); 
		};

		var handle_cancel = function() { 
			
			this.hide(); 
		};
		
		this.buttons = [ {text:"OK", handler:handle_ok, isDefault:true},
						 {text:"Cancel",  handler:handle_cancel}]; 

		this.dialog = new org.goorm.core.file.move.dialog();
		this.dialog.init({
			title:"Move file", 
			path:"configs/dialogs/org.goorm.core.file/file.move.html",
			width:800,
			height:500,
			modal:true,
			buttons:this.buttons, 
			success: function () {
				var resize = new YAHOO.util.Resize("move_dialog_left", {
		            handles: ['r'],
		            minWidth: 200,
		            maxWidth: 400
		        });
				
		        resize.on('resize', function(ev) {
					var width = $("#move_dialog_middle").width();
		            var w = ev.width;
		            $("#move_dialog_center").css('width', (width - w - 9) + 'px');
		        });
		        
		        $("#file_move_project_type").change(function() {
		        	var type = $(this).val();
		        	$("#move_dialog_center").find(".file_item").each(function() {
		        		if (type==0) {
		        			$(this).css("display","block");
		        		}
		        		else if($(this).attr('filetype')==type) {
		        			$(this).css("display","block");
		        		}
		        		else {
		        			$(this).css("display","none");
		        		}
		        	});
		        });
			}
		});
		this.dialog = this.dialog.dialog;
	},
	
	show: function (context) {
	
		var self = this;
	
		self.is_alive_window = false;
	
		this.current_path = "/"+core.status.current_project_path;
		
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

		if (context) {
			var filename = (core.status.selected_file.split("/")).pop();
			var filepath = 	core.status.selected_file.replace(filename, "");
			filepath = filepath.replace("//", "/");
			
			$("#file_move_input_filename").attr("value", filename);
			$("#input_move_old_filepath").attr("value", filepath);
			$("#input_move_old_filename").attr("value", filename);
			
			var dir =  filepath;

			dir = dir.replace(/\.\.\/\.\.\/project\/\//, "");
			dir = dir.replace(/\.\.\/\.\.\/project\//, "");
			dir = "/" + dir;
			dir = dir.replace(/\/\/\//, "/");
			dir = dir.replace(/\/\//, "/");

			$("#file_move_input_location_path").val(dir);
			
			var window_manager = core.module.layout.workspace.window_manager;
			
			for (var i = 0; i < window_manager.index; i++) {
				var window_filename = window_manager.window[i].filename;
				var window_filepath = window_manager.window[i].filepath;
				window_filepath = window_filepath + "/";
				window_filepath = window_filepath.replace("//", "/");				
			
				if( window_manager.window[i].alive && window_filename == filename && window_filepath == filepath) {
					self.is_alive_window = true;
				}
			}
			
			this.dialog.panel.show();
		}
		else {
			self.is_alive_window = false;	
	
			for (var i = 0; i < core.module.layout.workspace.window_manager.index; i++) {
				if(core.module.layout.workspace.window_manager.window[i].alive) {
					self.is_alive_window = true;
				}
			}
		
			if(self.is_alive_window) {
				$("#file_move_input_filename").attr("value", core.module.layout.workspace.window_manager.window[core.module.layout.workspace.window_manager.active_window].filename);
				$("#input_move_old_filepath").attr("value", core.module.layout.workspace.window_manager.window[core.module.layout.workspace.window_manager.active_window].filepath);
				$("#input_move_old_filename").attr("value", core.module.layout.workspace.window_manager.window[core.module.layout.workspace.window_manager.active_window].filename);
				
				this.dialog.panel.show();
			}
			
			$("#file_move_input_location_path").val(this.current_path);
		}
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
			
			var new_data = new Array();

			for(var name in sorting_data) {
				if(sorting_data[name].cls=="folder") {
					new_data.push(sorting_data[name]);
				}
			}

			self.treeview = new YAHOO.widget.TreeView("file_move_treeview", new_data);

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

					$("#file_move_input_location_path").attr("value", self.current_path);

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
				$("#file_move_treeview").find(".ygtvdepth0").find(".ygtvcell").prev().addClass("ygtvfocus");
				$("#file_move_treeview").find(".ygtvdepth0").find(".ygtvcell").addClass("ygtvfocus");
			}
			
		});
	},

	expand_directory: function (directory) {
		$("#file_move_treeview").find(".ygtvfocus").parent().parent().parent().parent().find(".ygtvcell").each(function () {
			if ($(this).find(".fullpath").text().split("/").pop() == directory) {
				$("#file_move_treeview").find(".ygtvfocus").removeClass("ygtvfocus");
				
				$(this).prev().addClass("ygtvfocus");
				$(this).addClass("ygtvfocus");
			}
		});

		this.treeview.getNodeByElement($("#file_move_treeview").find(".ygtvfocus")[0]).expand();
	},
	
	tree_expand_complete: function () {
		$("#file_move_treeview").find(".ygtvcell").unbind("mousedown");		
		$("#file_move_treeview").find(".ygtvcell").mousedown(function (e) {
			if ($(this).hasClass("ygtvfocus") == false) {
				$("#file_move_treeview").find(".ygtvfocus").removeClass("ygtvfocus");
				
				if ($(this).hasClass("ygtvcontent")) {
					$(this).prev().addClass("ygtvfocus");
					$(this).addClass("ygtvfocus");		
				}
			}
		});	
	},
	
	add_file_items: function (postdata) {

		$("#move_dialog_center").empty();
	
		var self = this;
		
		$.post("file/get_nodes", postdata, function (data) {
			
			var sort_project_treeview = function (sorting_data) { 				
				s.quick_sort(sorting_data);
			};

			var sorting_data = eval(data);
			
			sort_project_treeview(sorting_data);

			/*
			// back icon add
			if(postdata.project_name!="./" && postdata.project_name.indexOf("..") < 0 && postdata.project_name != core.status.current_project_path) {
				var icon_str = "";
				icon_str += "<div class='move_dialog_center_item move_dialog_center_folder'";
				icon_str +=" filename='/..' filetype='' filepath=''>";
				icon_str += "..";
				icon_str += "</div>";
			
				$("#move_dialog_center").append(icon_str);
			}
			*/
			
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
				icon_str += "<div style='word-break:break-all; width:60px; line-height:12px; margin-left:5px; margin-right:5px; margin-bottom:5px;'>";
				icon_str += sorting_data[name].filename;
				icon_str += "</div>";
				icon_str += "</div>";
				
				$("#move_dialog_center").append(icon_str);
			}
			
			$("#move_dialog_center").find(".folder_item").dblclick(function() {

				if (self.current_path == "/")	self.current_path = "";
				self.current_path = self.current_path+"/"+$(this).attr("filename");
				$("#file_move_input_location_path").val(self.current_path);

				var postdata = {
					kind: "project",
					project_name: self.current_path,
					folder_only: "false"
				};
									
				self.add_file_items(postdata);
				
				self.expand_directory($(this).attr("filename"));
			});
			
			$("#move_dialog_center").find(".file_item").click(function() {
				$("#move_dialog_center").find(".file_item").removeClass("selected_item");
				$("#move_dialog_center").find(".folder_item").removeClass("selected_item");
				$(this).addClass("selected_item");
			});
			
			$("#move_dialog_center").find(".folder_item").click(function() {
				$("#move_dialog_center").find(".file_item").removeClass("selected_item");
				$("#move_dialog_center").find(".folder_item").removeClass("selected_item");
				$(this).addClass("selected_item");
			});	
			
			$("#move_dialog_center").find(".file_item").click(function() {			
				$("#file_open_input_filename").attr("value", $(this).attr("filename"));
				
				self.filename = $(this).attr("filename");
				self.filetype = $(this).attr("filetype");
				self.filepath = $(this).attr("filepath");
			});
			
        	var type = $("#file_move_project_type").val();
        	$("#move_dialog_center").find(".file_item").each(function() {
        		if (type==0) {
        			$(this).css("display","block");
        		}
        		else if($(this).attr('filetype')==type) {
        			$(this).css("display","block");
        		}
        		else {
        			$(this).css("display","none");
        		}
        	});

		});
	}
};