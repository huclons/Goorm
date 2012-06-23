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
 * @class move
 * @extends file
 **/
org.goorm.core.file.move = function () {
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
	
	/**
	 * This presents the current browser version
	 * @property isAliveWindow
	 **/
	this.isAliveWindow = null;
};

org.goorm.core.file.move.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 **/
	init: function () { 
		
		var self = this;
				
		var handleOk = function() { 

			var tInputFileName = $("#fileMoveInputFileName").val();
						
			if (tInputFileName == "") {
				alert.show(core.localization.msg["alertFileNameEmpty"]);
				return false;
			}
			
			var tTargetFilePath = "../../project/"+self.currentPath;
			
			var postdata = {
				originalFile: $("#inputMoveOldFilePath").val() + "/" + $("#inputMoveOldFileName").val(),
				targetFile: tTargetFilePath+"/"+tInputFileName
			};

			$.post("file/move", postdata, function (data) {
				var receivedData = eval("("+data+")");
				
				if(receivedData.errCode==0) {
					if(self.isAliveWindow) {
						var windowManager = core.mainLayout.workSpace.windowManager;
						var tFiletype = windowManager.window[windowManager.activeWindow].filetype;
						windowManager.window[windowManager.activeWindow].close();
						windowManager.open(tTargetFilePath, tInputFileName, tFiletype);
					}
					core.mainLayout.projectExplorer.refresh();
				}
				else {
					alert.show(core.localization.msg["alertError"] + receivedData.message);
				}
			});
			
			this.hide(); 
		};

		var handleCancel = function() { 
			
			this.hide(); 
		};
		
		this.buttons = [ {text:"OK", handler:handleOk, isDefault:true},
						 {text:"Cancel",  handler:handleCancel}]; 

		this.dialog = new org.goorm.core.file.move.dialog();
		this.dialog.init({
			title:"Move file", 
			path:"configs/dialogs/org.goorm.core.file/file.move.html",
			width:800,
			height:500,
			modal:true,
			buttons:this.buttons, 
			success: function () {
				var resize = new YAHOO.util.Resize("moveDialogLeft", {
		            handles: ['r'],
		            minWidth: 200,
		            maxWidth: 400
		        });
				
		        resize.on('resize', function(ev) {
					var width = $("#moveDialogMiddle").width();
		            var w = ev.width;
		            $("#moveDialogCenter").css('width', (width - w - 9) + 'px');
		        });
		        
		        $("#fileMoveProjectType").change(function() {
		        	var type = $(this).val();
		        	$("#moveDialogCenter").find(".fileitem").each(function() {
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
	show: function (context) {
	
		var self = this;
	
		self.isAliveWindow = false;
	
		this.currentPath = "/"+core.currentProjectPath;
		
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

		if (context) {
			var filename = (core.selectedFile.split("/")).pop();
			var filepath = 	core.selectedFile.replace(filename, "");
			filepath = filepath.replace("//", "/");
			
			$("#fileMoveInputFileName").attr("value", filename);
			$("#inputMoveOldFilePath").attr("value", filepath);
			$("#inputMoveOldFileName").attr("value", filename);
			
			var dir =  filepath;

			dir = dir.replace(/\.\.\/\.\.\/project\/\//, "");
			dir = dir.replace(/\.\.\/\.\.\/project\//, "");
			dir = "/" + dir;
			dir = dir.replace(/\/\/\//, "/");
			dir = dir.replace(/\/\//, "/");

			$("#fileMoveinputLocationPath").val(dir);
			
			var windowManager = core.mainLayout.workSpace.windowManager;
			
			for (var i = 0; i < windowManager.index; i++) {
				var windowFileName = windowManager.window[i].filename;
				var windowFilePath = windowManager.window[i].filepath;
				windowFilePath = windowFilePath + "/";
				windowFilePath = windowFilePath.replace("//", "/");				
			
				if( windowManager.window[i].alive && windowFileName == filename && windowFilePath == filepath) {
					self.isAliveWindow = true;
				}
			}
			
			this.dialog.panel.show();
		}
		else {
			self.isAliveWindow = false;	
	
			for (var i = 0; i < core.mainLayout.workSpace.windowManager.index; i++) {
				if(core.mainLayout.workSpace.windowManager.window[i].alive) {
					self.isAliveWindow = true;
				}
			}
		
			if(self.isAliveWindow) {
				$("#fileMoveInputFileName").attr("value", core.mainLayout.workSpace.windowManager.window[core.mainLayout.workSpace.windowManager.activeWindow].filename);
				$("#inputMoveOldFilePath").attr("value", core.mainLayout.workSpace.windowManager.window[core.mainLayout.workSpace.windowManager.activeWindow].filepath);
				$("#inputMoveOldFileName").attr("value", core.mainLayout.workSpace.windowManager.window[core.mainLayout.workSpace.windowManager.activeWindow].filename);
				
				this.dialog.panel.show();
			}
			
			$("#fileMoveinputLocationPath").val(this.currentPath);
		}
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
			
			var newData = new Array();

			for(var name in sortingData) {
				if(sortingData[name].cls=="folder") {
					newData.push(sortingData[name]);
				}
			}

			self.treeView = new YAHOO.widget.TreeView("fileMoveTreeview", newData);

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

					$("#fileMoveinputLocationPath").attr("value", self.currentPath);

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
				$("#fileMoveTreeview").find(".ygtvdepth0").find(".ygtvcell").prev().addClass("ygtvfocus");
				$("#fileMoveTreeview").find(".ygtvdepth0").find(".ygtvcell").addClass("ygtvfocus");
			}
			
		});
	},

	/**
	 * This function is an goorm core initializating function.  
	 * @method expandDirectory
	 **/	
	expandDirectory: function (directory) {
		$("#fileMoveTreeview").find(".ygtvfocus").parent().parent().parent().parent().find(".ygtvcell").each(function () {
			if ($(this).find(".fullpath").text().split("/").pop() == directory) {
				$("#fileMoveTreeview").find(".ygtvfocus").removeClass("ygtvfocus");
				
				$(this).prev().addClass("ygtvfocus");
				$(this).addClass("ygtvfocus");
			}
		});

		this.treeView.getNodeByElement($("#fileMoveTreeview").find(".ygtvfocus")[0]).expand();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method treeExpandComplete
	 **/	
	treeExpandComplete: function () {
		$("#fileMoveTreeview").find(".ygtvcell").unbind("mousedown");		
		$("#fileMoveTreeview").find(".ygtvcell").mousedown(function (e) {
			if ($(this).hasClass("ygtvfocus") == false) {
				$("#fileMoveTreeview").find(".ygtvfocus").removeClass("ygtvfocus");
				
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

		$("#moveDialogCenter").empty();
	
		var self = this;
		
		$.post("file/get_nodes", postdata, function (data) {
			
			var sortProjectTreeview = function (sortingData) { 				
				s.quickSort(sortingData);
			};

			var sortingData = eval(data);
			
			sortProjectTreeview(sortingData);

			/*
			// back icon add
			if(postdata.projectName!="./" && postdata.projectName.indexOf("..") < 0 && postdata.projectName != core.currentProjectPath) {
				var iconStr = "";
				iconStr += "<div class='moveDialogCenter_item moveDialogCenter_folder'";
				iconStr +=" filename='/..' filetype='' filepath=''>";
				iconStr += "..";
				iconStr += "</div>";
			
				$("#moveDialogCenter").append(iconStr);
			}
			*/
			
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
				iconStr += "<div style='word-break:break-all; width:60px; line-height:12px; margin-left:5px; margin-right:5px; margin-bottom:5px;'>";
				iconStr += sortingData[name].filename;
				iconStr += "</div>";
				iconStr += "</div>";
				
				$("#moveDialogCenter").append(iconStr);
			}
			
			$("#moveDialogCenter").find(".folderitem").dblclick(function() {

				if (self.currentPath == "/")	self.currentPath = "";
				self.currentPath = self.currentPath+"/"+$(this).attr("filename");
				$("#fileMoveinputLocationPath").val(self.currentPath);

				var postdata = {
					kind: "project",
					projectName: self.currentPath,
					folderOnly: "false"
				};
									
				self.addFileItems(postdata);
				
				self.expandDirectory($(this).attr("filename"));
			});
			
			$("#moveDialogCenter").find(".fileitem").click(function() {
				$("#moveDialogCenter").find(".fileitem").removeClass("selectedItem");
				$("#moveDialogCenter").find(".folderitem").removeClass("selectedItem");
				$(this).addClass("selectedItem");
			});
			
			$("#moveDialogCenter").find(".folderitem").click(function() {
				$("#moveDialogCenter").find(".fileitem").removeClass("selectedItem");
				$("#moveDialogCenter").find(".folderitem").removeClass("selectedItem");
				$(this).addClass("selectedItem");
			});	
			
			$("#moveDialogCenter").find(".fileitem").click(function() {			
				$("#fileOpenInputFileName").attr("value", $(this).attr("filename"));
				
				self.filename = $(this).attr("filename");
				self.filetype = $(this).attr("filetype");
				self.filepath = $(this).attr("filepath");
			});
			
        	var type = $("#fileMoveProjectType").val();
        	$("#moveDialogCenter").find(".fileitem").each(function() {
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