/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module object
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class manager
 * @extends object
 **/
org.goorm.core.object.manager = function () {
	/**
	 * This presents the current browser version
	 * @property tableProperties
	 * @type Object
	 * @default null
	 **/
	this.tableProperties = null;
};

org.goorm.core.object.manager.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 * @param {String} tableProperties The table properties.
	 * @param {Object} canvas The canvas
	 **/
	init: function (tableProperties, canvas) {
		
		this.tableProperties = tableProperties;
		this.canvas = canvas;
		
		if (tableProperties == "") {
			this.tableProperties = core.mainLayout.tableProperties;
		}
		
		this.tableProperties.connectManager(this);
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method set 
	 * @param {Object} object The object.
	 **/
	set: function (object) {
		this.tableProperties.set(object);
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method unset 
	 * @param {Object} object The object.
	 **/
	unset: function (object) {
		this.tableProperties.unset();
	}
	
};