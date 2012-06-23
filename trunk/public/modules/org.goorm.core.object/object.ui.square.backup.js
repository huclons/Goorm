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
 * @class backup
 * @extends square
 **/
org.goorm.core.object.ui.square = function () {
	/**
	 * This presents the current browser version
	 * @property target
	 * @type Object
	 * @default null
	 **/
	this.target = null;
	
	/**
	 * This presents the current browser version
	 * @property timestamp
	 * @type String	
	 * @default null
	 **/
	this.timestamp = null;
	
	/**
	 * This presents the current browser version
	 * @property container
	 * @type Object
	 * @default null
	 **/
	this.container = null;
	
	/**
	 * This presents the current browser version
	 * @property contextMenu
	 * @type Object
	 * @default null
	 **/
	this.contextMenu = null;
	
	/**
	 * This presents the current browser version
	 * @property id
	 * @type Object
	 * @default null
	 **/
	this.id = null;
	
	/**
	 * This presents the current browser version
	 * @property name
	 * @type String
	 * @default null
	 **/
	this.name = null;	
	
	/**
	 * This presents the current browser version
	 * @property x
	 * @type Number
	 * @default null
	 **/
	this.x = null;
	
	/**
	 * This presents the current browser version
	 * @property y
	 * @type Number
	 * @default null
	 **/
	this.y = null;
	
	/**
	 * This presents the current browser version
	 * @property sx
	 * @type Number
	 * @default null
	 **/
	this.sx = null;
	
	/**
	 * This presents the current browser version
	 * @property sy
	 * @type Number
	 * @default null
	 **/
	this.sy = null;
	
	/**
	 * This presents the current browser version
	 * @property ex
	 * @type Number
	 * @default null
	 **/
	this.ex = null;
	
	/**
	 * This presents the current browser version
	 * @property ey
	 * @type Number
	 * @default null
	 **/
	this.ey = null;	
	
	/**
	 * This presents the current browser version
	 * @property width
	 * @type Number
	 * @default null
	 **/
	this.width = null;
	
	/**
	 * This presents the current browser version
	 * @property height
	 * @type Number
	 * @default null
	 **/
	this.height = null;
	
	/**
	 * This presents the current browser version
	 * @property connector
	 * @type Number
	 * @default null
	 **/	
	this.connector = null;
	
	/**
	 * This presents the current browser version
	 * @property attrList
	 * @type Array
	 * @default Array("id", "name", "x", "y", "width", "height")
	 **/
	this.attrList = new Array("id", "name", "x", "y", "width", "height");
};

org.goorm.core.object.ui.square.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 * @param {Object} target The target.
	 **/
	init: function (target) {
		var self = this;

		//Set 
		this.target = target; //target container for adding this object
		this.timestamp = new Date().getTime(); //For distinguishing objects, using the timestamp
		this.container = "objectContainer_" + this.timestamp; //object presentation container
		
		this.connector = $.makeArray();
		this.connector['n'] = null;
		this.connector['e'] = null;
		this.connector['s'] = null;
		this.connector['w'] = null;
		this.connector['ne'] = null;
		this.connector['se'] = null;
		this.connector['nw'] = null;
		this.connector['sw'] = null;
		
		
		//adding html container and set default shapes
		$(target).append("<div class='" + this.container + "'></div>");
		$(target).find("." + this.container).css("position", "absolute");
		$(target).find("." + this.container).css("border", "1px solid #ccc");
		$(target).find("." + this.container).width(100);
		$(target).find("." + this.container).height(100);
		$(target).find("." + this.container).css("left", 0);
		$(target).find("." + this.container).css("top", 0);
		
		//Set Properties		
		this.id = "square";
		this.name = "square_" + this.timestamp;	
		this.sx = $(target).find("." + this.container).position().left;
		this.sy = $(target).find("." + this.container).position().top;
		this.x = this.sx;
		this.y = this.sy;
		this.width = $(target).find("." + this.container).width();
		this.height = $(target).find("." + this.container).height();
		this.ex = this.sx + this.width;
		this.ey = this.sy + this.height;		
		
		//Set context menu
		this.contextMenu = new org.goorm.core.menu.context();
		this.contextMenu.init("configs/menu/org.goorm.core.object/object.ui.html", "object.ui", $(target).find("." + this.container), this.timestamp);
		
		//Set Draggable
		$(target).find("." + this.container).draggable({
			containment: $(self.target).find(".canvas"),
			scroll: false,
			//grid: [10, 10],
			stop: function (event, ui) {
				self.sx = $(self.target).find("." + self.container).position().left;
				self.sy = $(self.target).find("." + self.container).position().top;
				self.ex = self.sx + self.width;
				self.ey = self.sy + self.height;
				self.x = self.sx;
				self.y = self.sy;				
			}
		});
		
		//Set Resizable
		$(target).find("." + this.container).resizable({
			maxHeight: $(self.target).height(),
			maxWidth: $(self.target).width(),
			minHeight: 10,
			minWidth: 10,
			handles: 'n,e,s,w,ne,se,nw,sw',
			knobHandles: true,
			stop: function (event, ui) {
				self.width = $(self.target).find("." + self.container).width();
				self.height = $(self.target).find("." + self.container).height();
				self.ex = self.sx + self.width;
				self.ey = self.sy + self.height;
			}
		});
		
		//Resize handle status is hidden in default
		$(target).find("." + self.container).find(".ui-resizable-handle").hide();
		
		//Hover event in resize handle toggle for showing
		$(target).find("." + this.container).hover(function () {
			$(target).find("." + self.container).find(".ui-resizable-handle").show();
			$(target).find("." + self.container).css("cursor", "move");
		}, function () {
			$(target).find("." + self.container).find(".ui-resizable-handle").hide();
			$(target).find("." + self.container).css("cursor", "default");
		});	
		
		return this;
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * This operates the initialization tasks for layout, actions, plugins...
	 * First written: Sung-tae Ryu 
	 * Latest modified: Sung-tae Ryu 
	 * @method select() 
	 * @return void
	 **/
	select: function () {
		$(this.target).find("." + this.container).find(".ui-resizable-handle").show();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method deselect 
	 **/
	deselect: function () {
		$(this.target).find("." + this.container).find(".ui-resizable-handle").hide();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method remove 
	 **/
	remove: function () {
		
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method apply 
	 **/
	apply: function () {
		$(this.target).find("." + this.container).width(this.width);
		$(this.target).find("." + this.container).height(this.height);
		$(this.target).find("." + this.container).css("left", parseInt(this.x));
		$(this.target).find("." + this.container).css("top", parseInt(this.y));
	}
};