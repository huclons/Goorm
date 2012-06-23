/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module collaboration
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class settings
 * @extends collaboration
 **/
org.goorm.core.collaboration.settings = function () {
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
	 * @property tabView
	 * @type Object
	 * @default null
	 **/
	this.tabView = null;
	
	/**
	 * This presents the current browser version
	 * @property treeView
	 * @type Object
	 * @default null
	 **/
	this.treeView = null;
};

org.goorm.core.collaboration.settings.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 **/
	init: function () { 
		
		var handleOk = function() { 
			localStorage['CollaborationNickname'] = $("#dialogCollaborationSettings #CollaborationNickname").val();
			
			core.dialogPreference.ini['CollaborationServerURL'] = $("#dialogCollaborationSettings #CollaborationServerURL").val();
			core.dialogPreference.ini['CollaborationServerPort'] = $("#dialogCollaborationSettings #CollaborationServerPort").val();
			
			var str = JSON.stringify(core.dialogPreference.ini);
			core.dialogPreference.manager.iniMaker(str);
			
			this.hide(); 
		};

		var handleCancel = function() { 
			
			this.hide(); 
		};
		
		this.buttons = [ {text:"OK", handler:handleOk, isDefault:true},
						 {text:"Cancel",  handler:handleCancel}]; 
						 
		this.dialog = new org.goorm.core.collaboration.settings.dialog();
		this.dialog.init({
			title:"Settings", 
			path:"configs/dialogs/org.goorm.core.collaboration/collaboration.settings.html",
			width:700,
			height:500,
			modal:true,
			buttons:this.buttons,
			success: function () {
				//TabView Init
				self.tabView = new YAHOO.widget.TabView('settingsContents');
				
				//TreeView Init
				self.treeView = new YAHOO.widget.TreeView("settingsTreeview");
				self.treeView.render();
				if(localStorage['CollaborationNickname'] == undefined || localStorage['CollaborationNickname'] == ""){
					localStorage['CollaborationNickname'] = "unknownUser";
				}
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
		$("#dialogCollaborationSettings #CollaborationServerURL").val(core.dialogPreference.ini['CollaborationServerURL']);
		$("#dialogCollaborationSettings #CollaborationServerPort").val(core.dialogPreference.ini['CollaborationServerPort']);
		
		if(core.lastName != null && core.firstName != null){
			$("#dialogCollaborationSettings #CollaborationNickname").val(core.lastName+" "+core.firstName).attr("readonly","readonly");
		}
		else {
			$("#dialogCollaborationSettings #CollaborationNickname").val(localStorage['CollaborationNickname']);
		}
		this.dialog.panel.show();
	}	
};