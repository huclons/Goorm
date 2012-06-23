/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module file
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class open
 * @extends file
 **/
org.goorm.core.file.open = function () {
	/**
	 * This presents the current browser version
	 * @property dialog
	 **/
	this.dialog = null;
	
	/**
	 * The array object that contains the information about buttons on the bottom of a dialog 
	 * @property buttons
	 * @type Object
	 * @default null
	 **/
	this.buttons = null;
	
	/**
	 * This presents the current browser version
	 * @property treeView
	 **/
	this.treeView = null;
	
	/**
	 * This presents the current browser version
	 * @property filename
	 **/
	this.filename = null;

	/**
	 * This presents the current browser version
	 * @property filetype
	 **/
	this.filetype = null;

	/**
	 * This presents the current browser version
	 * @property filepath
	 **/
	this.filepath = null;
	
	/**
	 * This presents the current browser version
	 * @property filepath
	 **/
	this.currentPath = null;
};

org.goorm.core.file.open.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 **/
	init: function () { 
		
		var self = this;
				
		var handleOk = function() { 
			
			if(self.filepath == "" || self.filename == "" || self.filetype == "" || self.filepath == null || self.filename == null || self.filetype == null || $("#fileOpenInputFileName").val()=="") {
				alert.show(core.localization.msg["alertFileNotSelect"]);
				return false;
			}

			core.mainLayout.workSpace.windowManager.open(self.filepath, $("#fileOpenInputFileName").val(), self.filetype);
					
			
			this.hide(); 
		};

		var handleCancel = function() { 
			
			this.hide(); 
		};
		
		this.buttons = [ {text:"OK", handler:handleOk, isDefault:true},
						 {text:"Cancel",  handler:handleCancel}]; 

		this.dialog = new org.goorm.core.file.open.dialog();
		this.dialog.init({
			title:"Open file", 
			path:"configs/dialogs/org.goorm.core.file/file.open.html",
			width:800,
			height:500,
			modal:true,
			buttons:this.buttons, 
			success: function () {
				var resize = new YAHOO.util.Resize("openDialogLeft", {
		            handles: ['r'],
		            minWidth: 200,
		            maxWidth: 400
		        });
				
		        resize.on('resize', function(ev) {
					var width = $("#openDialogMiddle").width();
		            var w = ev.width;
		            $("#openDialogCenter").css('width', (width - w - 9) + 'px');
		        });
		        
		        $("#fileOpenProjectType").change(function() {
		        	var type = $(this).val();
		        	$("#openDialogCenter").find(".fileitem").each(function() {
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
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method show 
	 **/
	show: function () {
		$("#fileOpenInputFileName").val("");
		this.refreshAll();
		this.dialog.panel.show();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method addDirectories 
	 **/	
	addDirectories: function(postdata) {		
		var self = this;

		$.post("file/get_nodes", postdata, function (data) {

			var sortProjectTreeview = function (sortingData) { 				
				s.quickSort(sortingData);
				
				for(i=0; i<sortingData.length; i++) {
					if(sortingData[i].children) {
						s.quickSort(sortingData[i].children);
					}
				}
			};

			var sortingData = eval(data);
			
			sortProjectTreeview(sortingData);

			self.treeView = new YAHOO.widget.TreeView("fileOpenTreeview", sortingData);
		    
			self.treeView.subscribe("clickEvent", function(nodedata) {	
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
						
					self.currentPath = dir;

					$("#fileOpeninputLocationPath").attr("value", self.currentPath);

					var postdata = {
						kind: "project",
						projectName: self.currentPath,
						folderOnly: "false"
					};
					self.addFileItems(postdata);
				}
				
				return false;
			});

			self.treeView.subscribe("dblClickEvent", function(nodedata) {	
				if(nodedata.node.data.cls == "folder") {
					if (nodedata.node.expanded) {
						nodedata.node.collapse();
					}
					else { 
						nodedata.node.expand();
					}
				}
			});
						
			self.treeView.render();
			
			self.treeExpandComplete();
			
			self.treeView.subscribe("expandComplete", function () {
				self.treeExpandComplete();	
			});
			
			if (self.currentPath == "") {
				$("#fileOpenTreeview").find(".ygtvdepth0").find(".ygtvcell").prev().addClass("ygtvfocus");
				$("#fileOpenTreeview").find(".ygtvdepth0").find(".ygtvcell").addClass("ygtvfocus");
			}

			
		});
	},

	/**
	 * This function is an goorm core initializating function.  
	 * @method expandDirectory
	 **/	
	expandDirectory: function (directory) {
				
		$("#fileOpenTreeview").find(".ygtvfocus").parent().parent().parent().parent().find(".ygtvcell").each(function () {
			if ($(this).find(".fullpath").text().split("/").pop() == directory) {
				$("#fileOpenTreeview").find(".ygtvfocus").removeClass("ygtvfocus");
				
				$(this).prev().addClass("ygtvfocus");
				$(this).addClass("ygtvfocus");
			}
		});

		this.treeView.getNodeByElement($("#fileOpenTreeview").find(".ygtvfocus")[0]).expand();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method treeExpandComplete
	 **/	
	treeExpandComplete: function () {
		$("#fileOpenTreeview").find(".ygtvcell").unbind("mousedown");		
		$("#fileOpenTreeview").find(".ygtvcell").mousedown(function (e) {
			if ($(this).hasClass("ygtvfocus") == false) {
				$("#fileOpenTreeview").find(".ygtvfocus").removeClass("ygtvfocus");
				
				if ($(this).hasClass("ygtvcontent")) {
					$(this).prev().addClass("ygtvfocus");
					$(this).addClass("ygtvfocus");		
				}
			}
		});	
	},
	
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method addFileItems
	 **/	
	addFileItems: function (postdata) {
	
		$("#openDialogCenter").empty();
	
		var self = this;
		
		$.post("file/get_nodes", postdata, function (data) {
			var sortProjectTreeview = function (sortingData) { 				
				s.quickSort(sortingData);
			};

			var sortingData = eval(data);
			
			sortProjectTreeview(sortingData);

			
			for(var name in sortingData) {
				var iconStr = "";
				if(sortingData[name].cls=="folder") {
					iconStr += "<div class='folderitem'";
				}
				else {
					iconStr += "<div class='fileitem'";
				}
				
				iconStr +=" filename='"+sortingData[name].filename+"' filetype='"+sortingData[name].filetype+"' filepath='"+sortingData[name].parentLabel+"'>";
				if(sortingData[name].cls=="folder") {
					iconStr += "<img src='images/org.goorm.core.file/folder.png'>";
				}
				else {
					iconStr += "<img src='images/org.goorm.core.file/file.png'>";
				}
				iconStr += "<div style='word-break:break-all; word-wrap: break-word; width:60px; line-height:12px; margin-left:5px; margin-right:5px; margin-bottom:5px;'>";
				iconStr += sortingData[name].filename;
				iconStr += "</div>";
				iconStr += "</div>";
				
				$("#openDialogCenter").append(iconStr);
			}
			

			$("#openDialogMiddle").find(".folderitem").dblclick(function() {
			
				if (self.currentPath == "/")	self.currentPath = "";
				self.currentPath = self.currentPath+"/"+$(this).attr("filename");
				$("#fileOpeninputLocationPath").val(self.currentPath);
			
				var postdata = {
					kind: "project",
					projectName: self.currentPath,
					folderOnly: "false"
				};
									
				self.addFileItems(postdata);
				self.expandDirectory($(this).attr("filename"));
			});
			

			$("#openDialogMiddle").find(".fileitem").click(function() {
				$("#openDialogMiddle").find(".fileitem").removeClass("selectedItem");
				$("#openDialogMiddle").find(".folderitem").removeClass("selectedItem");
				$(this).addClass("selectedItem");
			});
			
			$("#openDialogMiddle").find(".folderitem").click(function() {
				$("#openDialogMiddle").find(".fileitem").removeClass("selectedItem");
				$("#openDialogMiddle").find(".folderitem").removeClass("selectedItem");
				$(this).addClass("selectedItem");
			});			
			
			$("#openDialogMiddle").find(".fileitem").dblclick(function() {
				core.mainLayout.workSpace.windowManager.open($(this).attr("filepath"), $(this).attr("filename"), $(this).attr("filetype"));
				self.hide(); 
			});

			$("#openDialogMiddle").find(".fileitem").click(function() {			
				$("#fileOpenInputFileName").attr("value", $(this).attr("filename"));
				
				self.filename = $(this).attr("filename");
				self.filetype = $(this).attr("filetype");
				self.filepath = $(this).attr("filepath");
			});
			
        	var type = $("#fileOpenProjectType").val();
        	$("#openDialogCenter").find(".fileitem").each(function() {
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
	},
	
	refreshAll: function() {
		this.currentPath = "/"+core.currentProjectPath;

		$("#fileOpeninputLocationPath").val(this.currentPath);
	
		var postdata = {
			kind: "project",
			projectName: this.currentPath,
			folderOnly: "true"
		};
		
		this.addDirectories(postdata);
		
		postdata = {
			kind: "project",
			projectName: this.currentPath,
			folderOnly: "false"
		};
		
		this.addFileItems(postdata);
	}
};