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
 * @class _new
 * @extends file
 **/
org.goorm.core.file._new = function () {
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
	 * @property filepath
	 **/
	this.currentPath = null;
	
	this.isNewAnyway = null;
};

org.goorm.core.file._new.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 **/
	init: function () { 
		var self = this;
		
		var handleOk = function() {
			if($("#fileNewInputFileName").attr("value")=="") {
				alert.show(core.localization.msg["alertFileNameEmpty"]);
				return false;
			}
			
			var tempFilePath = $("#fileNewinputLocationPath").val();
			var tempFileName = $("#fileNewInputFileName").val();

			$.ajax({
				url: "file/get_contents",			
				type: "GET",
				data: { path: "workspace/"+$("#fileNewinputLocationPath").val()+"/"+$("#fileNewInputFileName").attr("value")},
				success: function(data) {
					if (data!=0 && !self.isNewAnyway) {
						confirmation.init({
							title: core.localization.msg["confirmationNewTitle"], 
							message: core.localization.msg["confirmationNewMessage"],
							yesText: core.localization.msg["confirmationYes"],
							noText: core.localization.msg["confirmationNo"],
							yes: function () {
								self.isNewAnyway = true;
								handleOk();
							}, no: function () {
							}
						});
						
						confirmation.panel.show();
						return false;
					}

					var postdata = {
						currentProjectPath: $("#fileNewinputLocationPath").val(),
						inputFileName: $("#fileNewInputFileName").attr("value"),
						inputFileType: $("#fileNewInputFileType").attr("value")
					};
		
					$.post("file/new", postdata, function (data) {
		
						var receivedData = eval("("+data+")");
		
						if(receivedData.errCode==0) {
						
							var windowManager = core.mainLayout.workSpace.windowManager;
							
							tempFilePath = "../../project/"+tempFilePath+"/";
							tempFilePath = tempFilePath.replace("///", "/");
							tempFilePath = tempFilePath.replace("//", "/");
							
							for (var i = 0; i < windowManager.index; i++) {
								var windowFileName = windowManager.window[i].filename;
								var windowFilePath = windowManager.window[i].filepath;
								windowFilePath = windowFilePath + "/";
								windowFilePath = windowFilePath.replace("//", "/");
								
								if( windowManager.window[i].alive && windowFileName == tempFileName && windowFilePath == tempFilePath) {
									windowManager.window[i].close();
								}
							}
						
							var tempType = postdata.inputFileName;
							tempType = tempType.split(".");
							tempType = tempType[1];
							
							core.mainLayout.workSpace.windowManager.open(tempFilePath, tempFileName, tempType);
							core.mainLayout.projectExplorer.refresh();
						}
						else {
							alert.show(core.localization.msg["alertError"] + receivedData.message);
						}
						
						core.mainLayout.projectExplorer.refresh();
						self.dialog.panel.hide();
					});
				}
			});

		};

		var handleCancel = function() { 
			
			this.hide(); 
		};
		
		this.buttons = [ {text:"OK", handler:handleOk, isDefault:true},
						 {text:"Cancel",  handler:handleCancel}]; 

		this.dialog = new org.goorm.core.file._new.dialog();
		this.dialog.init({
			title:"New file", 
			path:"configs/dialogs/org.goorm.core.file/file._new.html",
			width:800,
			height:500,
			modal:true,
			buttons:this.buttons, 
			success: function () {
				var resize = new YAHOO.util.Resize("fileNewDialogLeft", {
		            handles: ['r'],
		            minWidth: 200,
		            maxWidth: 400
		        });
				
		        resize.on('resize', function(ev) {
					var width = $("#fileNewDialogMiddle").width();
		            var w = ev.width;
		            $("#fileNewDialogCenter").css('width', (width - w - 9) + 'px');
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
	show: function (context) {
		var self = this;
	
		this.isNewAnyway = false;
	
		this.currentPath = "/"+core.currentProjectPath;
		
		if(context) {
			var dir =  core.selectedFile;
			dir = dir.replace(/\.\.\/\.\.\/project\/\//, "");
			dir = dir.replace(/\.\.\/\.\.\/project\//, "");
			dir = "/" + dir;
			dir = dir.replace(/\/\/\//, "/");
			dir = dir.replace(/\/\//, "/");
			$("#fileNewinputLocationPath").val(dir);
		}
		else {
			$("#fileNewinputLocationPath").val(this.currentPath);
		}
	
		var postdata = {
			kind: "project",
			projectName: this.currentPath,
			folderOnly: "true"
		};
		
		this.addDirectories(postdata);
		
		var postdata = {
			kind: "project",
			projectName: this.currentPath,
			folderOnly: "false"
		};
				
		this.addFileItems(postdata);
	
		$("#fileNewInputFileName").val("");
	
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
			
			var newData = new Array();

			for(var name in sortingData) {
				if(sortingData[name].cls=="folder") {
					newData.push(sortingData[name]);
				}
			}

			self.treeView = new YAHOO.widget.TreeView("fileNewTreeview", newData);

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

					$("#fileNewinputLocationPath").attr("value", self.currentPath);

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
				$("#fileNewTreeview").find(".ygtvdepth0").find(".ygtvcell").prev().addClass("ygtvfocus");
				$("#fileNewTreeview").find(".ygtvdepth0").find(".ygtvcell").addClass("ygtvfocus");
			}
			
		});
	},

	/**
	 * This function is an goorm core initializating function.  
	 * @method expandDirectory
	 **/	
	expandDirectory: function (directory) {
				
		$("#fileNewTreeview").find(".ygtvfocus").parent().parent().parent().parent().find(".ygtvcell").each(function () {
			if ($(this).find(".fullpath").text().split("/").pop() == directory) {
				$("#fileNewTreeview").find(".ygtvfocus").removeClass("ygtvfocus");
				
				$(this).prev().addClass("ygtvfocus");
				$(this).addClass("ygtvfocus");
			}
		});

		this.treeView.getNodeByElement($("#fileNewTreeview").find(".ygtvfocus")[0]).expand();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method treeExpandComplete
	 **/	
	treeExpandComplete: function () {
		$("#fileNewTreeview").find(".ygtvcell").unbind("mousedown");		
		$("#fileNewTreeview").find(".ygtvcell").mousedown(function (e) {
			if ($(this).hasClass("ygtvfocus") == false) {
				$("#fileNewTreeview").find(".ygtvfocus").removeClass("ygtvfocus");
				
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
	
		$("#fileNewDialogCenter").empty();
	
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
				iconStr += "<div style='word-break:break-all; width:60px; line-height:12px; margin-left:5px; margin-right:5px; margin-bottom:5px;'>";
				iconStr += sortingData[name].filename;
				iconStr += "</div>";
				iconStr += "</div>";
				
				$("#fileNewDialogCenter").append(iconStr);
			}
			
			$("#fileNewDialogMiddle").find(".folderitem").dblclick(function() {
				if (self.currentPath == "/")	self.currentPath = "";
				self.currentPath = self.currentPath+"/"+$(this).attr("filename");
				$("#fileNewinputLocationPath").val(self.currentPath);

				var postdata = {
					kind: "project",
					projectName: self.currentPath,
					folderOnly: "false"
				};

				self.addFileItems(postdata);
				self.expandDirectory($(this).attr("filename"));
			});
			
			$("#fileNewDialogMiddle").find(".fileitem").click(function() {
				$("#fileNewDialogMiddle").find(".fileitem").removeClass("selectedItem");
				$("#fileNewDialogMiddle").find(".folderitem").removeClass("selectedItem");
				$(this).addClass("selectedItem");
			});
			
			$("#fileNewDialogMiddle").find(".folderitem").click(function() {
				$("#fileNewDialogMiddle").find(".fileitem").removeClass("selectedItem");
				$("#fileNewDialogMiddle").find(".folderitem").removeClass("selectedItem");
				$(this).addClass("selectedItem");
			});	
			
		});
	}
};