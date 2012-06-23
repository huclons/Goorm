/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module plugin
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class loader
 * @extends plugin
 **/
org.goorm.plugin.loader = function () {
	
};

org.goorm.plugin.loader.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 **/
	init: function () {
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method load 
	 * @param {String} path The path.
	 **/
	load: function (path) {
		$.getScript('plugins/' + 'org.goorm.core.design.uml' + '/plug.js', function () {
			var plug = new org.goorm.core.design.uml();
			
			plug.init();
		});
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method attach 
	 **/
	attach: function () {
	
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method detach 
	 **/
	detach: function () {
		
	}
	
};