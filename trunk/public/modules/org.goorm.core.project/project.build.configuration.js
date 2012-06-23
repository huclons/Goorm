/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module project
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class open
 * @extends project
 **/
org.goorm.core.project.build.configuration = function () {
	/**
	 * This presents the current browser version
	 * @property dialog
	 * @type Object
	 * @default null
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
	 * @property Object
	 * @type Object
	 * @default null
	 **/
	this.chat = null;
};

org.goorm.core.project.build.configuration.prototype = {
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor
	 **/
	init: function () {
		
		var self = this;
				
		var handleOpen = function() { 
			if(core.pluginManager.plugins["org.goorm.plugin."+core.currentProjectType]!=undefined) {
				core.pluginManager.plugins["org.goorm.plugin."+core.currentProjectType].build(core.currentProjectName,core.currentProjectPath);
			}
			this.hide(); 
		};

		var handleCancel = function() { 	
			this.hide(); 
		};
		
		this.buttons = [ {text:"Build", handler:handleOpen, isDefault:true},
						 {text:"Cancel",  handler:handleCancel}]; 
						 
		this.dialog = new org.goorm.core.project.build.configuration.dialog();
		var path = "configs/dialogs/org.goorm.core.project/project.build.configuration.html";
		this.dialog.init({
			title:"Build Configuration", 
			path:path,
			width:600,
			height:400,
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
	show: function () {
		if(core.currentProjectPath != "")
			this.dialog.panel.show();
		else {
			alert.show(core.localization.msg["alertProjectNotOpend"]);
		}
	},
	
	initDialog: function(path,callback){
		var postdata = {'path':path};
		$.get("file/get_contents", postdata, function (data) {
			$("#buildConfiguration").append(data);
			callback();
		});
	},
	
	setBuildConfig: function(){
		$("#buildConfiguration").text('');
		if(core.pluginManager.plugins['org.goorm.plugin.'+core.currentProjectType] != undefined) {
			if(core.pluginManager.plugins['org.goorm.plugin.'+core.currentProjectType].setBuildConfig)				
			core.pluginManager.plugins['org.goorm.plugin.'+core.currentProjectType].setBuildConfig(this);
		}
	}
};