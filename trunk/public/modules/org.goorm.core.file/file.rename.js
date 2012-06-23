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
 * @class rename
 * @extends file
 **/
org.goorm.core.file.rename = function () {
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
	 * @property isAliveWindow
	 **/
	this.isAliveWindow = null;
};

org.goorm.core.file.rename.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 **/
	init: function () { 
		
		var self = this;
		
		var handleOk = function() { 
		
			if ($("#inputRenameNewFileName").attr("value")=="") {
				alert.show(core.localization.msg["alertFileNameEmpty"]);
				return false;
			}
		
			var postdata = {
				selectedFilePath: $("#inputRenameOldFilePath").attr("value"),
				selectedFileName: $("#inputRenameOldFileName").attr("value"),
				inputFileName: $("#inputRenameNewFileName").attr("value")
			};
									
			$.post("module/org.goorm.core.file/file.rename.php", postdata, function (data) {
				var receivedData = eval("("+data+")");
								
				if(receivedData.errCode==0) {
					if(self.isAliveWindow) {
						var windowManager = core.mainLayout.workSpace.windowManager;
						var tFiletype = windowManager.window[windowManager.activeWindow].filetype;
						
						windowManager.window[windowManager.activeWindow].close();
						windowManager.open(postdata.selectedFilePath, postdata.inputFileName, tFiletype);						
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
		
		this.dialog = new org.goorm.core.file.rename.dialog();
		this.dialog.init({
			title:"Rename", 
			path:"configs/dialogs/org.goorm.core.file/file.rename.html",
			width:450,
			height:120,
			modal:true,
			buttons:this.buttons,
			success: function () {
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

		if (context) {
			var filename = (core.selectedFile.split("/")).pop();
			var filepath = 	core.selectedFile.replace(filename, "");
			filepath = filepath.replace("//", "/");
			
			$("#inputRenameNewFileName").attr("value", filename);
			$("#inputRenameOldFilePath").attr("value", filepath);
			$("#inputRenameOldFileName").attr("value", filename);
			
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
			for (var i = 0; i < core.mainLayout.workSpace.windowManager.index; i++) {
				if(core.mainLayout.workSpace.windowManager.window[i].alive) {
					self.isAliveWindow = true;
				}
			}
		
			if(self.isAliveWindow) {
				$("#inputRenameNewFileName").attr("value", core.mainLayout.workSpace.windowManager.window[core.mainLayout.workSpace.windowManager.activeWindow].filename);
				$("#inputRenameOldFilePath").attr("value", core.mainLayout.workSpace.windowManager.window[core.mainLayout.workSpace.windowManager.activeWindow].filepath);
				$("#inputRenameOldFileName").attr("value", core.mainLayout.workSpace.windowManager.window[core.mainLayout.workSpace.windowManager.activeWindow].filename);
				
				this.dialog.panel.show();
			}
		}
	}	
};