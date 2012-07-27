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
	this.is_new_anyway = false;
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

			var postdata = {
				new_anyway: self.is_new_anyway,
				path: temp_filepath+"/"+temp_filename
				
			};
			
			$.get("file/new", postdata, function (data) {
			console.log(data);
				if (data.err_code == 99) {
				console.log("??");
					confirmation.init({
/*
						title: core.module.localization.msg["confirmationNewTitle"], 
						message: core.module.localization.msg["confirmationNewMessage"],
						yes_text: core.module.localization.msg["confirmation_yes"],
						no_text: core.module.localization.msg["confirmation_no"],
*/
						title: "Confirmation", 
						message: "Exist file. Do you want to make anyway?",
						yes_text: "yes",
						no_text: "no",
						yes: function () {
							self.is_new_anyway = true;
							handle_ok();
						}, no: function () {
						}
					});
					console.log("!!");
					confirmation.panel.show();
				}
				else if (data.err_code == 0) {
					self.dialog.panel.hide();
					core.module.layout.project_explorer.refresh();
				}
				else {
					alert.show(data.message);
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
			conso
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
	
		this.add_directories();

		this.add_file_items();
	
		$("#file_new_input_filename").val("");
	
		this.dialog.panel.show();
	},
	
	add_directories: function() {		
		var self = this;

		var postdata = {
			path: this.current_path
		};

		$.get("file/get_dir_nodes", postdata, function (data) {
			console.log(data);
			
			self.treeview = new YAHOO.widget.TreeView("file_new_treeview", data);

			self.treeview.subscribe("clickEvent", function(nodedata) {	
				if(nodedata.node.data.cls == "dir") {

					self.current_path = nodedata.node.data.parent_label + nodedata.node.data.name;

					$("#file_new_input_location_path").attr("value", self.current_path);

					self.add_file_items();
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
	
	add_file_items: function () {
	
		$("#file_new_dialog_center").empty();
	
		var self = this;
		
		var postdata = {
			path: this.current_path
		};
		
		$.get("file/get_nodes", postdata, function (data) {

			for(var idx in data) {
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
				
				$("#file_new_dialog_center").append(icon_str);
			}
			
			$("#file_new_dialog_middle").find(".folder_item").dblclick(function() {
				if (self.current_path == "/")	self.current_path = "";
				self.current_path = self.current_path+"/"+$(this).attr("filename");
				$("#file_new_input_location_path").val(self.current_path);

				self.add_file_items();
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