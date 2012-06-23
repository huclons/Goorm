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
 * @class _export
 * @extends file
 **/
org.goorm.core.file._export = function () {
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
	 * @property tabView
	 **/
	this.tabView = null;
	
	/**
	 * This presents the current browser version
	 * @property treeView
	 **/
	this.treeView = null;
	
	/**
	 * This presents the current browser version
	 * @property filepath
	 **/
	this.currentPath = null;
};

org.goorm.core.file._export.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor
	 **/
	init: function () { 
		var self = this;
		
		var handleOk = function() {
			if($("#fileExportProjectNameRead").attr("value")=="") {
				alert.show(core.localization.msg["alertFileNotSelect"]);
				return false;
			}

			var postdata = {
				selectProjectName: $("#fileExportProjectNameRead").attr("value"),
				selectProjectPath: self.currentPath,
				fileExportType: $("#fileExportType").attr("value")
			};
						
			$.post("file/export", postdata, function (data) {
			
				var receivedData = eval("("+data+")");

				if(receivedData.errCode==0) {
					location.href=receivedData.downloadPath;
					setTimeout(function() {
						core.mainLayout.projectExplorer.refresh();
					}, 50);
				}
			});
		
			//
			this.hide(); 
		};

		var handleCancel = function() { 
			
			this.hide(); 
		};
		
		this.buttons = [ {text:"OK", handler:handleOk, isDefault:true},
						 {text:"Cancel",  handler:handleCancel}]; 
						 
		this.dialog = new org.goorm.core.file._export.dialog();
		this.dialog.init({
			title:"Export File", 
			path:"configs/dialogs/org.goorm.core.file/file._export.html",
			width:800,
			height:500,
			modal:true,
			yesText:"Open",
			noText:"Cancel",
			buttons:this.buttons,
			success: function () {
				var resize = new YAHOO.util.Resize("fileExportDialogLeft", {
		            handles: ['r'],
		            minWidth: 200,
		            maxWidth: 400
		        });
				
		        resize.on('resize', function(ev) {
					var width = $("#fileExportDialogMiddle").width();
		            var w = ev.width;
		            $("#fileExportDialogCenter").css('width', (width - w - 9) + 'px');
		        });
			}
		});
		this.dialog = this.dialog.dialog;
		
		//this.dialog.panel.setBody("AA");
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method show 
	 **/
	show: function () {
	
		$("#fileExportProjectNameRead").val("");
		
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

			self.treeView = new YAHOO.widget.TreeView("fileExportTreeview", sortingData);
		    
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

					$("#fileExportInputLocationPath").attr("value", self.currentPath);

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
				$("#fileExportTreeview").find(".ygtvdepth0").find(".ygtvcell").prev().addClass("ygtvfocus");
				$("#fileExportTreeview").find(".ygtvdepth0").find(".ygtvcell").addClass("ygtvfocus");
			}

			
		});
	},

	/**
	 * This function is an goorm core initializating function.  
	 * @method expandDirectory
	 **/	
	expandDirectory: function (directory) {
				
		$("#fileExportTreeview").find(".ygtvfocus").parent().parent().parent().parent().find(".ygtvcell").each(function () {
			if ($(this).find(".fullpath").text().split("/").pop() == directory) {
				$("#fileExportTreeview").find(".ygtvfocus").removeClass("ygtvfocus");
				
				$(this).prev().addClass("ygtvfocus");
				$(this).addClass("ygtvfocus");
			}
		});

		this.treeView.getNodeByElement($("#fileExportTreeview").find(".ygtvfocus")[0]).expand();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method treeExpandComplete
	 **/	
	treeExpandComplete: function () {
		$("#fileExportTreeview").find(".ygtvcell").unbind("mousedown");		
		$("#fileExportTreeview").find(".ygtvcell").mousedown(function (e) {
			if ($(this).hasClass("ygtvfocus") == false) {
				$("#fileExportTreeview").find(".ygtvfocus").removeClass("ygtvfocus");
				
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
	
		$("#fileExportDialogCenter").empty();
	
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
				
				$("#fileExportDialogCenter").append(iconStr);
			}
			

			$("#fileExportDialogMiddle").find(".folderitem").dblclick(function() {

				if (self.currentPath == "/")	self.currentPath = "";
				self.currentPath = self.currentPath+"/"+$(this).attr("filename");
				$("#fileExportInputLocationPath").val(self.currentPath);

				var postdata = {
					kind: "project",
					projectName: self.currentPath,
					folderOnly: "false"
				};
									
				self.addFileItems(postdata);
				self.expandDirectory($(this).attr("filename"));
			});
			

			$("#fileExportDialogMiddle").find(".fileitem").click(function() {
				$("#fileExportDialogMiddle").find(".fileitem").removeClass("selectedItem");
				$("#fileExportDialogMiddle").find(".folderitem").removeClass("selectedItem");
				$(this).addClass("selectedItem");
			});
			
			$("#fileExportDialogMiddle").find(".folderitem").click(function() {
				$("#fileExportDialogMiddle").find(".fileitem").removeClass("selectedItem");
				$("#fileExportDialogMiddle").find(".folderitem").removeClass("selectedItem");
				$(this).addClass("selectedItem");
			});			

			$("#fileExportDialogMiddle").find(".fileitem").click(function() {			
				$("#fileExportProjectNameRead").attr("value", $(this).attr("filename"));
				
				self.filename = $(this).attr("filename");
				self.filetype = $(this).attr("filetype");
				self.filepath = $(this).attr("filepath");
			});

		});
	},
	
	refreshAll: function() {
		this.currentPath = "/"+core.currentProjectPath;

		$("#fileExportInputLocationPath").val(this.currentPath);

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