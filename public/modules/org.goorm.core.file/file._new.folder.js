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
org.goorm.core.file._new.folder = function () {
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
};

org.goorm.core.file._new.folder.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 **/
	init: function () { 
		var self = this;
		
		var handleOk = function() {
			if($("#folderNewInputFolderName").attr("value")=="") {
				alert.show(core.localization.msg["alertFolderNameEmpty"]);
				return false;
			}
			else {
				var postdata = {
					currentProjectPath: $("#folderNewinputLocationPath").val(),
					inputFolderName: $("#folderNewInputFolderName").val(),
				};

				$.post("file/new", postdata, function (data) {
					var receivedData = eval("("+data+")");
					core.mainLayout.projectExplorer.refresh();
				});
			}
			
			this.hide();
		};

		var handleCancel = function() { 
			
			this.hide(); 
		};
		
		this.buttons = [ {text:"OK", handler:handleOk, isDefault:true},
						 {text:"Cancel",  handler:handleCancel}]; 

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
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method show 
	 **/
	show: function (context) {
		console.log("show"+context);
		var self = this;
		
		this.currentPath = "/"+core.currentProjectPath;

		if(context) {
			var dir =  core.selectedFile;
			dir = dir.replace(/\.\.\/\.\.\/project\/\//, "");
			dir = dir.replace(/\.\.\/\.\.\/project\//, "");
			dir = "/" + dir;
			dir = dir.replace(/\/\/\//, "/");
			dir = dir.replace(/\/\//, "/");
			$("#folderNewinputLocationPath").val(dir);
		}
		else {
			$("#folderNewinputLocationPath").val(this.currentPath);
		}
	
		var postdata = {
			kind: "project",
			projectName: this.currentPath,
			folderOnly: "true"
		};
		
		this.addDirectories(postdata);
		
		$("#folderNewInputFolderName").val("");
		
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
			};

			var sortingData = eval(data);
			
			sortProjectTreeview(sortingData);
			
			var newData = new Array();

			for(var name in sortingData) {
				if(sortingData[name].cls=="folder") {
					newData.push(sortingData[name]);
				}
			}

			self.treeView = new YAHOO.widget.TreeView("folderNewTreeview", newData);

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

					$("#folderNewinputLocationPath").val(self.currentPath);

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
				$("#folderNewTreeview").find(".ygtvdepth0").find(".ygtvcell").prev().addClass("ygtvfocus");
				$("#folderNewTreeview").find(".ygtvdepth0").find(".ygtvcell").addClass("ygtvfocus");
			}
			
		});
	},

	/**
	 * This function is an goorm core initializating function.  
	 * @method expandDirectory
	 **/	
	expandDirectory: function (directory) {
				
		$("#folerNewTreeview").find(".ygtvfocus").parent().parent().parent().parent().find(".ygtvcell").each(function () {
			if ($(this).find(".fullpath").text().split("/").pop() == directory) {
				$("#folderNewTreeview").find(".ygtvfocus").removeClass("ygtvfocus");
				
				if ($(this).hasClass("ygtvcontent")) {
					$(this).prev().addClass("ygtvfocus");
					$(this).addClass("ygtvfocus");
				}
			}
		});

		this.treeView.getNodeByElement($("#folderNewTreeview").find(".ygtvfocus")[0]).expand();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method treeExpandComplete
	 **/	
	treeExpandComplete: function () {
		$("#folderNewTreeview").find(".ygtvcell").unbind("mousedown");		
		$("#folderNewTreeview").find(".ygtvcell").mousedown(function (e) {
			if ($(this).hasClass("ygtvfocus") == false) {
				$("#folderNewTreeview").find(".ygtvfocus").removeClass("ygtvfocus");
				
				if ($(this).hasClass("ygtvcontent")) {
					$(this).prev().addClass("ygtvfocus");
					$(this).addClass("ygtvfocus");
				}	
			}
		});	
	}
};