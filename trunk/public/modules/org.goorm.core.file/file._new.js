/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.file._new = function () {
	this.dialog = null;
	this.buttons = null;
	this.treeview = null;
	this.current_path = null;
	this.is_new_anyway = null;
};

org.goorm.core.file._new.prototype = {
	init: function () { 
		var self = this;
		
		var handle_ok = function() {
			if($("#file_new_input_filename").attr("value")=="") {
				alert.show(core.module.localization.msg["alertFileNameEmpty"]);
				return false;
			}
			
			var temp_filepath = $("#file_new_input_location_path").val();
			var temp_filename = $("#file_new_input_filename").val();

			$.ajax({
				url: "file/get_contents",			
				type: "GET",
				data: { path: "workspace/"+$("#file_new_input_location_path").val()+"/"+$("#file_new_input_filename").attr("value")},
				success: function(data) {
					if (data!=0 && !self.is_new_anyway) {
						confirmation.init({
							title: core.module.localization.msg["confirmationNewTitle"], 
							message: core.module.localization.msg["confirmationNewMessage"],
							yes_text: core.module.localization.msg["confirmation_yes"],
							no_text: core.module.localization.msg["confirmation_no"],
							yes: function () {
								self.is_new_anyway = true;
								handle_ok();
							}, no: function () {
							}
						});
						
						confirmation.panel.show();
						return false;
					}

					var postdata = {
						current_project_path: $("#file_new_input_location_path").val(),
						input_filename: $("#file_new_input_filename").attr("value"),
						input_filetype: $("#fileNewInputFileType").attr("value")
					};
		
					$.post("file/new", postdata, function (data) {
		
						var received_data = eval("("+data+")");
		
						if(received_data.errCode==0) {
						
							var window_manager = core.module.layout.workspace.window_manager;
							
							temp_filepath = "../../project/"+temp_filepath+"/";
							temp_filepath = temp_filepath.replace("///", "/");
							temp_filepath = temp_filepath.replace("//", "/");
							
							for (var i = 0; i < window_manager.index; i++) {
								var window_filename = window_manager.window[i].filename;
								var window_filepath = window_manager.window[i].filepath;
								window_filepath = window_filepath + "/";
								window_filepath = window_filepath.replace("//", "/");
								
								if( window_manager.window[i].alive && window_filename == temp_filename && window_filepath == temp_filepath) {
									window_manager.window[i].close();
								}
							}
						
							var temp_type = postdata.input_filename;
							temp_type = temp_type.split(".");
							temp_type = temp_type[1];
							
							core.module.layout.workspace.window_manager.open(temp_filepath, temp_filename, temp_type);
							core.module.layout.project_explorer.refresh();
						}
						else {
							alert.show(core.module.localization.msg["alertError"] + received_data.message);
						}
						
						core.module.layout.project_explorer.refresh();
						self.dialog.panel.hide();
					});
				}
			});

		};

		var handle_cancel = function() { 
			
			this.hide(); 
		};
		
		this.buttons = [ {text:"OK", handler:handle_ok, isDefault:true},
						 {text:"Cancel",  handler:handle_cancel}]; 

		this.dialog = new org.goorm.core.file._new.dialog();
		this.dialog.init({
			title:"New file", 
			path:"configs/dialogs/org.goorm.core.file/file._new.html",
			width:800,
			height:500,
			modal:true,
			buttons:this.buttons, 
			success: function () {
				var resize = new YAHOO.util.Resize("file_new_dialog_left", {
		            handles: ['r'],
		            minWidth: 200,
		            maxWidth: 400
		        });
				
		        resize.on('resize', function(ev) {
					var width = $("#file_new_dialog_middle").width();
		            var w = ev.width;
		            $("#file_new_dialog_center").css('width', (width - w - 9) + 'px');
		        });
			}
		});
		this.dialog = this.dialog.dialog;
		
		//this.dialog.panel.setBody("AA");
	},

	show: function (context) {
		var self = this;
	
		this.is_new_anyway = false;
	
		this.current_path = "/"+core.status.current_project_path;
		
		if(context) {
			var dir =  core.status.selected_file;
			dir = dir.replace(/\.\.\/\.\.\/project\/\//, "");
			dir = dir.replace(/\.\.\/\.\.\/project\//, "");
			dir = "/" + dir;
			dir = dir.replace(/\/\/\//, "/");
			dir = dir.replace(/\/\//, "/");
			$("#file_new_input_location_path").val(dir);
		}
		else {
			$("#file_new_input_location_path").val(this.current_path);
		}
	
		var postdata = {
			kind: "project",
			project_name: this.current_path,
			folder_only: "true"
		};
		
		this.add_directories(postdata);
		
		var postdata = {
			kind: "project",
			project_name: this.current_path,
			folder_only: "false"
		};
				
		this.add_file_items(postdata);
	
		$("#file_new_input_filename").val("");
	
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
			
			var new_data = new Array();

			for(var name in sorting_data) {
				if(sorting_data[name].cls=="folder") {
					new_data.push(sorting_data[name]);
				}
			}

			self.treeview = new YAHOO.widget.TreeView("file_new_treeview", new_data);

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

					$("#file_new_input_location_path").attr("value", self.current_path);

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
				$("#file_new_treeview").find(".ygtvdepth0").find(".ygtvcell").prev().addClass("ygtvfocus");
				$("#file_new_treeview").find(".ygtvdepth0").find(".ygtvcell").addClass("ygtvfocus");
			}
			
		});
	},

	expand_directory: function (directory) {
				
		$("#file_new_treeview").find(".ygtvfocus").parent().parent().parent().parent().find(".ygtvcell").each(function () {
			if ($(this).find(".fullpath").text().split("/").pop() == directory) {
				$("#file_new_treeview").find(".ygtvfocus").removeClass("ygtvfocus");
				
				$(this).prev().addClass("ygtvfocus");
				$(this).addClass("ygtvfocus");
			}
		});

		this.treeview.getNodeByElement($("#file_new_treeview").find(".ygtvfocus")[0]).expand();
	},
	
	tree_expand_complete: function () {
		$("#file_new_treeview").find(".ygtvcell").unbind("mousedown");		
		$("#file_new_treeview").find(".ygtvcell").mousedown(function (e) {
			if ($(this).hasClass("ygtvfocus") == false) {
				$("#file_new_treeview").find(".ygtvfocus").removeClass("ygtvfocus");
				
				if ($(this).hasClass("ygtvcontent")) {
					$(this).prev().addClass("ygtvfocus");
					$(this).addClass("ygtvfocus");
				}	
			}
		});	
	},
	
	add_file_items: function (postdata) {
	
		$("#file_new_dialog_center").empty();
	
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
				icon_str += "<div style='word-break:break-all; width:60px; line-height:12px; margin-left:5px; margin-right:5px; margin-bottom:5px;'>";
				icon_str += sorting_data[name].filename;
				icon_str += "</div>";
				icon_str += "</div>";
				
				$("#file_new_dialog_center").append(icon_str);
			}
			
			$("#file_new_dialog_middle").find(".folder_item").dblclick(function() {
				if (self.current_path == "/")	self.current_path = "";
				self.current_path = self.current_path+"/"+$(this).attr("filename");
				$("#file_new_input_location_path").val(self.current_path);

				var postdata = {
					kind: "project",
					project_name: self.current_path,
					folder_only: "false"
				};

				self.add_file_items(postdata);
				self.expand_directory($(this).attr("filename"));
			});
			
			$("#file_new_dialog_middle").find(".file_item").click(function() {
				$("#file_new_dialog_middle").find(".file_item").removeClass("selected_item");
				$("#file_new_dialog_middle").find(".folder_item").removeClass("selected_item");
				$(this).addClass("selected_item");
			});
			
			$("#file_new_dialog_middle").find(".folder_item").click(function() {
				$("#file_new_dialog_middle").find(".file_item").removeClass("selected_item");
				$("#file_new_dialog_middle").find(".folder_item").removeClass("selected_item");
				$(this).addClass("selected_item");
			});	
			
		});
	}
};