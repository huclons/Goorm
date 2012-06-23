/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module design
 **/

/**
 * This is an goorm code generator.  
 * <br>goorm starts with this code generator.
 * @class ruler
 * @extends design
 **/
org.goorm.core.design.ruler = function () {
	/**
	 * This presents the current browser version
	 * @property target
	 **/
	this.target = null;
	
	/**
	 * This presents the current browser version
	 * @property value
	 **/
	this.value = null;
	
	/**
	 * This presents the current browser version
	 * @property unit
	 **/
	this.unit = null;
	
	/**
	 * This presents the current browser version
	 * @property contextMenu
	 **/
	this.contextMenu = new Array();
	
};

org.goorm.core.design.ruler.prototype = {
	
	/**
	 * The constructor function of the ruler class.
	 * @constructor 
	 * @param {String} target The target.
	 * @param {String} value The value.
	 * @param {String} unit The unit.
	 * @param {String} title The title of the ruler.
	 **/
	init: function (target, value, unit, title) {
		this.target = target;
		this.title = title;
		
		$(target).append("<div class='ruler'></div>");
		$(target).append("<div class='ruler_x'></div>");
		$(target).append("<div class='ruler_y'></div>");

		
		this.setUnit(value, unit);
		
		this.contextMenu[0] = new org.goorm.core.menu.context();
		this.contextMenu[0].init("configs/menu/org.goorm.core.design/design.ruler.html", "design.ruler", $(target).find(".ruler"), this.title);
		
		this.contextMenu[1] = new org.goorm.core.menu.context();
		this.contextMenu[1].init("configs/menu/org.goorm.core.design/design.ruler_x.html", "design.ruler_x", $(target).find(".ruler_x"), this.title);		
		
		this.contextMenu[2] = new org.goorm.core.menu.context();
		this.contextMenu[2].init("configs/menu/org.goorm.core.design/design.ruler_y.html", "design.ruler_y", $(target).find(".ruler_y"), this.title);		
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method setUnit 
	 * @param {String} value The value.
	 * @param {String} unit The unit.
	 **/
	setUnit: function (value, unit) {
		this.value = value;
		this.unit = unit;
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method setUnit 
	 * @param {String} value The value.
	 * @param {String} unit The unit.
	 **/
	show: function (value) {
		var self = this;
		
		if(value) {
			$(this.target).find(".ruler").css("display", "block");
			$(this.target).find(".ruler_x").css("display", "block");
			$(this.target).find(".ruler_y").css("display", "block");
			$(this.target).find(".canvasContainer").css("left", "14px");
			$(this.target).find(".canvasContainer").css("top", "14px");
			$(this.target).find(".canvasContainer").width($(self.target).find(".canvasContainer").width()-14);
			$(this.target).find(".canvasContainer").height($(self.target).find(".canvasContainer").height()-14);
		}
		else {
			$(this.target).find(".ruler").css("display", "none");
			$(this.target).find(".ruler_x").css("display", "none");
			$(this.target).find(".ruler_y").css("display", "none");
			$(this.target).find(".canvasContainer").css("left", "0");
			$(this.target).find(".canvasContainer").css("top", "0");
			$(this.target).find(".canvasContainer").width($(self.target).find(".canvasContainer").width()+14);
			$(this.target).find(".canvasContainer").height($(self.target).find(".canvasContainer").height()+14);
		}
	}
};