/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module object
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class object
 **/
org.goorm.core.project.explorer = function () {
	this.target = null;
	this.treeview = null;
	this.context_menu_file = null;
	this.context_menu_folder = null;	
	this.context_menu_project = null;	
	this.current_tree_data = null;	
	this.current_project = null;
};

org.goorm.core.project.explorer.prototype = {
	init: function () {
		
		var self = this;

		$("#projectExplorer").prepend("<div id='projectSelector' style='height:27px; padding-left:5px; padding-right:5px; padding-top:5px; background-color:#eee; border-bottom:1px solid #ddd; font-size:10px; overflow:hidden; text-align:center;'></div>");
		$("#projectSelector").append("<select id='projectSelectBox'></select>")

		$("#projectSelectBox").change(function() {
			self.onProjectSelectBoxChange($(this).val());
		});

		$.get("project/get_list", "", function (data) {
			var sorting_data = eval(data);
			self.makeProjectSelectBox(sorting_data);			
		});
		
		$("#projectExplorer").append("<div id='projectTreeview' style='overflow-x:hidden'></div>");
		
		var postdata = {
			kind: "project",
			path: "" + core.status.current_project_path
		};
		
		$.get("file/get_nodes", postdata, function (data) {
			
			if (data != null) {
			
				var sorting_data = eval(data);
				
				self.sortProjectTreeview(sorting_data);
	
				self.treeview = new YAHOO.widget.TreeView("projectTreeview", sorting_data);
				
				self.current_tree_data = self.treeview.getTreeDefinition();
	
				self.treeview.subscribe("clickEvent", function(nodedata) { return false; });
	
				self.treeview.subscribe("dblClickEvent", function(nodedata) {	
					if(nodedata.node.data.cls == "file") {
						var filename = nodedata.node.data.filename;
						var filetype = nodedata.node.data.filetype;
						var filepath = nodedata.node.data.parent_label;
						
						core.module.layout.workSpace.windowManager.open(filepath, filename, filetype);
					}
					else if(nodedata.node.data.cls == "folder") {
						if (nodedata.node.expanded) {
							nodedata.node.collapse();
						}
						else { 
							nodedata.node.expand();
						}
					}
				});
				
	
				self.treeview.render();
				//self.treeviewProject.expandAll();
				
				
				//$("#projectTreeview").prepend("<div class='projectName'>" + core.current_projectName + "</div>");
				
				
				self.treeview.subscribe("expandComplete", function () {
					self.refreshContextMenu();
					self.current_tree_data = self.treeview.getTreeDefinition();
				});
				
				
				self.setContextMenu();
			}			
		});
		
		//for test
		self.setContextMenu();
		
		$(core).bind("goormLoadingComplete",function(){
			self.current_project = new Object();
			
			if(!$.isEmptyObject(localStorage["current_project"])){
				self.current_project = $.parseJSON(localStorage["current_project"]);
				if(self.current_project.current_projectName != ""){
					core.dialog.open_project.open(self.current_project.current_projectPath, self.current_project.current_projectName, self.current_project.current_projectType);
				}
			}
		});
	},
	
	refresh: function() {
		var self = this;
			
		$.post("project/get_list", "", function (data) {
			var sorting_data = eval(data);
			self.makeProjectSelectBox(sorting_data);			
		});

		var temp_project_path = core.status.current_project_path;
		
		if ( temp_project_path == "" ) {
			$("#projectTreeview").empty();
			$("#projectTreeview").css("background-color", "#CCC");
			$("#projectTreeview").append("<div style='text-align:center;padding-top:50%;'>Project not opened</div>");
		}
		else {

			$("#projectTreeview").css("background-color", "#FFF");

			var postdata = {
				kind: "project",
				path: "" + temp_project_path
			};
			
			$.post("file/get_nodes", postdata, function (data) {
							
				var sorting_data = eval(data);
				console.log(data);
				self.sortProjectTreeview(sorting_data);	
			
				self.treeview.removeChildren(self.treeview.getRoot(), true);
				
				self.expandTreeview(self.current_tree_data, sorting_data);
				
				self.treeview.buildTreeFromObject(sorting_data);
	
				self.treeview.render();
				
				self.refreshContextMenu();
			});
		}
	},
	
	expandTreeview: function (source, target) {
		var self = this;		
		$(source).each(function (i) {
			if (this.expanded == true && this.cls == "folder") {
				var object = this;
				$(target).each(function (j) {
					if (object.filename == this.filename && this.cls == "folder") {
						this.expanded = true;
						
						self.expandTreeview(object.children, this.children);
					}	
				});
			}
		});
	},
	
	makeProjectSelectBox: function(sorting_data) {
		var self = this;

		$("#projectSelectBox").empty();
		
		$("#projectSelectBox").append("<option value='' selected>Select Project</option>");

		var max_num = parseInt($("#projectSelector").width()/8);
		
		for(var name in sorting_data) {
			var temp_name = sorting_data[name].filename;

			if(temp_name.length > max_num) {
				temp_name = temp_name.substring(0, max_num-1);
				temp_name += " …";
			}			
			
			if (sorting_data[name].filename == core.current_projectPath) {
				$("#projectSelectBox").append("<option value='"+sorting_data[name].filename+"' selected>"+temp_name+"</option>");
			}
			else {
				$("#projectSelectBox").append("<option value='"+sorting_data[name].filename+"'>"+temp_name+"</option>");
			}
		}
	},
		
	onProjectSelectBoxChange: function (project) {
		var self = this;
	
		if (project!="") {
			$.ajax({
				type: "GET",
				dataType: "xml",
				async :false,
				url: "project/" +  project + "/project.xml",
				success: function(xml) {
					self.current_project.current_projectPath =  project;
					self.current_project.current_projectName = $(xml).find("NAME").text();
					self.current_project.current_projectType = $(xml).find("TYPE").text();
					localStorage["current_project"] = JSON.stringify(self.current_project);
					core.dialog.open_project.open(project, $(xml).find("NAME").text(), $(xml).find("TYPE").text());
				}
				, error: function(xhr, status, error) {
					alert.show(core.localization.msg["alertProjectCannotOpen"]);
				}
			});
		}
		else {
			core.current_projectName = "";
			core.current_projectPath = "";
			core.current_projectType = "";
			self.current_project.current_projectPath = "";
			self.current_project.current_projectName = "";
			self.current_project.current_projectType = "";
			localStorage["current_project"] = JSON.stringify(self.current_project);

			self.refresh();
		}

	},
	
	sortProjectTreeview: function (sorting_data) { 				
		/*
		s.quickSort(sorting_data);
		
		for(i=0; i<sorting_data.length; i++) {
			if(sorting_data[i].children) {
				s.quickSort(sorting_data[i].children);
			}
		}
		*/
	},	
	
	setContextMenu: function() {
		var self = this;

		self.context_menu_file = new org.goorm.core.menu.context();
		self.context_menu_file.init("configs/menu/org.goorm.core.project/project.explorer.file.html", "project.explorer.file", "", null, null);
		
		self.context_menu_folder = new org.goorm.core.menu.context();
		self.context_menu_folder.init("configs/menu/org.goorm.core.project/project.explorer.folder.html", "project.explorer.folder", "", null, null);

		self.context_menu_project = new org.goorm.core.menu.context();
		self.context_menu_project.init("configs/menu/org.goorm.core.project/project.explorer.html", "project.explorer", "", null, null);
		
		self.refreshContextMenu();

		$(core).trigger("layoutLoaded");
	},
	
	refreshContextMenu: function () {
		var self = this;

		$("#projectTreeview").unbind("mousedown");
		$("#projectTreeview").mousedown(function (e) {
			
			self.context_menu_file.hide()
			self.context_menu_project.hide();
			self.context_menu_folder.hide();
			
			$("#projectTreeview").find(".ygtvfocus").removeClass("ygtvfocus");
				
			if (e.which == 3) {
				
				var offset = 0;
					
				if ( ($(window).height() - 36) < (e.clientY + $("div[id='project.explorer']").height()) ) {
					offset = e.clientY + $("div[id='project.explorer']").height() - $(window).height() + 36;
				};
				
				self.context_menu_project.show();
				$("div[id='project.explorer']").css("left", e.clientX);
				$("div[id='project.explorer']").css("top", e.clientY - offset);				
			}
			
			e.stopPropagation();
			e.preventDefault();
			return false;			
		});


		$("#projectTreeview").find(".ygtvcell").unbind("mousedown");		
		$("#projectTreeview").find(".ygtvcell").mousedown(function (e) {
			
			self.context_menu_project.hide();
			self.context_menu_file.hide();
			self.context_menu_folder.hide();
			
			if ($(this).hasClass("ygtvfocus") == false) {
				$("#projectTreeview").find(".ygtvfocus").removeClass("ygtvfocus");
				
				if ($(this).hasClass("ygtvcontent")) {
					$(this).prev().addClass("ygtvfocus");
					$(this).addClass("ygtvfocus");		
				}
			}

			core.status.selected_file = $(this).find(".fullpath").html();
			
			if (e.which == 3) {
				if ($(this).find("img").hasClass("file")) {
					var offset = 0;
					
					if ( ($(window).height() - 36) < (e.clientY + $("div[id='project.explorer.file']").height()) ) {
						offset = e.clientY + $("div[id='project.explorer.file']").height() - $(window).height() + 36;
					};
					
					self.context_menu_file.show();
					
					$("div[id='project.explorer.file']").css("left", e.clientX);
					$("div[id='project.explorer.file']").css("top", e.clientY - offset);
				}
				else if ($(this).find("img").hasClass("folder")) {
					var offset = 0;
					
					if ( ($(window).height() - 36) < (e.clientY + $("div[id='project.explorer.folder']").height()) ) {
						offset = e.clientY + $("div[id='project.explorer.folder']").height() - $(window).height() + 36;
					};

					self.context_menu_folder.show();
					
					$("div[id='project.explorer.folder']").css("left", e.clientX);
					$("div[id='project.explorer.folder']").css("top", e.clientY - offset);				
				}
			}
			
			e.stopPropagation();
			e.preventDefault();
			return false;			
		});
		
		
		core.module.action.init();
	}
	
};