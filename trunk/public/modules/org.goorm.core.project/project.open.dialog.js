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
 * @class open.dialog
 * @extends project
 * 
 **/
org.goorm.core.project.open.dialog = function () {
	/**
	 * This presents the current browser version
	 * @property dialog
	 * @type Object
	 * @default null
	 **/
	this.dialog = null;
};

org.goorm.core.project.open.dialog.prototype = {
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 * @param {Object} option The option for dialog.
	 **/
	init: function (option) {
		this.dialog = new org.goorm.core.dialog();
		this.dialog.init(option);
		
		return this;
	}
};