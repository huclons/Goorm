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
 * @class property
 * @extends file
 **/
org.goorm.core.file.property = function () {
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
};

org.goorm.core.file.property.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor
	 **/
	init: function () { 
		
		var handleOk = function() { 
			
			this.hide(); 
		};

		var handleCancel = function() { 
			
			this.hide(); 
		};
		
		this.buttons = [ {text:"OK", handler:handleOk, isDefault:true},
						 {text:"Cancel",  handler:handleCancel}]; 
		
		
		this.dialog = new org.goorm.core.file.property.dialog();
		this.dialog.init({
			title:"Property", 
			path:"configs/dialogs/org.goorm.core.file/file.property.html",
			width:480,
			height:500,
			modal:true,
			buttons:this.buttons,
			success: function () {
				//TabView Init
				self.tabView = new YAHOO.widget.TabView('propertyFileContents');
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
		if(core.selectedFile != null){
			this.dialog.panel.show();
			var fileName = (core.selectedFile.split("/")).pop();
			var fileType = (fileName.split(".")).pop();
			var fileLocation = core.selectedFile.split("../../project/").pop();
			var url = "file/get_property";
			
			$.ajax({
				url: url,		
				type: "POST",
				data: "path="+core.selectedFile,
				async:false,
				success: function(data) {
					var stat = YAHOO.lang.JSON.parse(data);
					if(stat['dir']) fileType="dir";
					if(stat['size']==null) stat['size']=0;
					$("#propertyFileContents #fileName").html(fileName);
					$("#propertyFileContents #fileType").html(fileType);
					$("#propertyFileContents #fileLocation").html(fileLocation);
					$("#propertyFileContents #fileSize").html(stat['size']+" byte");
					$("#propertyFileContents #aTime").html(stat['atime']);
					$("#propertyFileContents #mTime").html(stat['mtime']);
				}
				, error: function(xhr, status, error) {alert.show(core.localization.msg["alertError"] + error);}
			});
		}
		else {
			alert.show(core.localization.msg["alertFileNotSelect"]);
		}
	}	
};