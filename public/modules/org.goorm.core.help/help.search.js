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
 * @class search
 * @extends help
 **/
org.goorm.core.help.search = function () {
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

org.goorm.core.help.search.prototype = {
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor
	 **/
	
	init: function () {
		var self = this;
		
		var handleClose = function() { 
			this.hide(); 
		};
		
		this.buttons = [ {text:"Close", handler:handleClose, isDefault:true},
						 ]; 

		this.dialog = new org.goorm.core.help.search.dialog();
		this.dialog.init({
			title:"Help search", 
			path:"configs/dialogs/org.goorm.core.help/help.search.html",
			width:400,
			height:500,
			modal:true,
			buttons:this.buttons,
			success: function () {
				// //TabView Init
				// self.tabView = new YAHOO.widget.TabView('helpSearchContents');
// 				
				// //TreeView Init
				// self.treeView = new YAHOO.widget.TreeView("helpSearchTreeview");
				// self.treeView.render();
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
