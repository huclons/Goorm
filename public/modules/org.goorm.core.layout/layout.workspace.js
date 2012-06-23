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
 * @class _new
 * @extends layout
 **/
org.goorm.core.layout.workspace = function () {
	/**
	 * This presents the current browser version
	 * @property windowManager
	 * @type Object
	 * @default null
	 **/
	this.windowManager = null;
};

org.goorm.core.layout.workspace.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 **/
	init: function (target) { 
		var self = this;
		
		//attaching tab element
		$("#"+target).append("<div id='workspace'></div>");
		
		//attaching window manager
		this.attachWindowManager('workspace');
		
		$("#workspace").click(function (e) {
			$("#workspace").find(".hd").each(function(i) {
				$(this).removeClass("activated");
			});
		});
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method attachWindowManager 
	 * @param {Object} target The target object.
	 **/
	attachWindowManager: function(target) {
		//attaching window manager
		this.windowManager = new org.goorm.core.window.manager();
		this.windowManager.init(target);
	}
};