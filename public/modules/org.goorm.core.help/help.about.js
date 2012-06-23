/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module help
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class about
 * @extends help
 **/
org.goorm.core.help.about = function () {
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

org.goorm.core.help.about.prototype = {
	/**
	 * This function is an goorm core initializating function.  
	 * @method init 
	 **/
	
	init: function () {
		var self = this;
		
		var handleOk = function() { 
			
			this.hide(); 
		};
		
		this.buttons = [ {text:"OK", handler:handleOk, isDefault:true}]; 
						 
		this.dialog = new org.goorm.core.help.about.dialog();
		this.dialog.init({
			title:"About goorm 3", 
			path:"configs/dialogs/org.goorm.core.help/help.about.html",
			width:620,
			height:550,
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
	show: function () {
		this.dialog.panel.show();
	}
};
