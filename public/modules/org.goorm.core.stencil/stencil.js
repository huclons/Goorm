/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module stencil
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class stencil
 **/
org.goorm.core.stencil = function () {
	/**
	 * This presents the current browser version
	 * @property container
	 * @type Object
	 * @default null
	 **/
	this.container = null;
	
	/**
	 * This presents the current browser version
	 * @property timestamp
	 * @type String
	 * @default null
	 **/
	this.timestamp = null;
	
	/**
	 * This presents the current browser version
	 * @property shape
	 * @type Object
	 * @default null
	 **/
	this.shape = null;

	/**
	 * This presents the current browser version
	 * @property data
	 * @type Object
	 * @default null
	 **/
	this.data = null;	
	
	/**
	 * This presents the current browser version
	 * @property shape
	 * @type String
	 * @default null
	 **/
	this.type = null;
	
	/**
	 * This presents the current browser version
	 * @property properties
	 * @type Object
	 * @default null
	 **/
	this.properties = null;
	
	/**
	 * This presents the current browser version
	 * @property javascript
	 * @type Object
	 * @default null
	 **/
	this.javascript = null;
};

org.goorm.core.stencil.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 * @param {Object} shape The shape.
	 * @param {Object} type The type.
	 * @param {Object} container The container.
	 **/
	init: function(shape, type, container, callback) {
		this.timestamp = new Date().getTime();
		
		this.shape = shape;
		this.type = type;
		this.container = container;

		this.properties = {};
		
		$(this.container).append("<div id='stencil_" + this.timestamp + "' style='position:absolute; display:none;'></div>");

		//$(this.container).find("#"+"stencil_" + this.timestamp).append("shape");
		
		this.adapter(callback);
		
		return this;
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method move 
	 * @param {Number} sx The position on x-coordinate of the starting point of the stencil.
	 * @param {Number} sy The position on y-coordinate of the end point of the stencil.
	 * @param {Number} ex The position on x-coordinate of the starting point of the stencil.
	 * @param {Number} ey The position on y-coordinate of the end point of the stencil.
	 **/
	move: function(sx, sy, ex, ey) {
		var startX, startY, width, height;
		
		if (this.type == "square") {
		
			if (sx > ex) {
				startX = ex;
			}
			else {
				startX = sx;
			}
			
			if (sy > ey) {
				startY = ey;
			}
			else {
				startY = sy;
			}
			
			width = Math.abs(ex-sx);
			height = Math.abs(ey-sy);

			
			$(this.container).find("#"+"stencil_" + this.timestamp).css("left", startX);
			$(this.container).find("#"+"stencil_" + this.timestamp).css("top", startY);
			$(this.container).find("#"+"stencil_" + this.timestamp).css("width", width);
			$(this.container).find("#"+"stencil_" + this.timestamp).css("height", height);
		}
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method rotate
	 * @param {Number} sx The position on x-coordinate of the starting point of the stencil.
	 * @param {Number} sy The position on y-coordinate of the end point of the stencil.
	 * @param {Number} ex The position on x-coordinate of the starting point of the stencil.
	 * @param {Number} ey The position on y-coordinate of the end point of the stencil.
	 **/
	rotate: function(context, sx, sy, ex, ey) {
		var startX, startY, width, height;
		
		if (this.type == "line") {
						
			width = Math.abs(ex-sx);
			
			var length = parseInt(Math.sqrt((ex-sx)*(ex-sx)+(ey-sy)*(ey-sy)));
			var radian = Math.acos((ex-sx)/length);
			
			
			startX = (sx+ex)/2-length/2;
			startY = (sy+ey)/2;
			
			var minus = 1;
			 
			if (ey < sy) {
				minus = -1;
			}
			
			
			$(this.container).find("#"+"stencil_" + this.timestamp).css("left", startX);
			$(this.container).find("#"+"stencil_" + this.timestamp).css("top", startY);
			$(this.container).find("#"+"stencil_" + this.timestamp).css("width", length);
			$(this.container).find("#"+"stencil_" + this.timestamp).css("height", 1);
			
			// For webkit browsers: e.g. Chrome
	        $(this.container).find("#"+"stencil_" + this.timestamp).css({ 'WebkitTransform': 'rotate(' + minus * radian + 'rad)'});
	          // For Mozilla browser: e.g. Firefox
	        $(this.container).find("#"+"stencil_" + this.timestamp).css({ '-moz-transform': 'rotate(' + minus * radian + 'rad)'});
			
			
			//context.rotate(radian);			

			
			
			//context.rotate(-radian);	
						
			
		}
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method adapter
	 **/
	adapter: function(callback) {
		var self = this;
		
		//Get a stencil and adapt it to div
		var url = "file/get_contents";
		
		if (this.type == "square") {
			
			$.ajax({
				url: url,			
				type: "POST",
				data: "path=../../stencil/"+this.shape+".json",
				success: function(data) {
					self.properties = eval("(" + data + ")");

					if (typeof callback == "function") {
						callback();
					}
					
					self.setShape();
				}
			});
			
			$.ajax({
				url: url,			
				type: "POST",
				data: "path=../../stencil/"+this.shape+".html",
				success: function(data) {
					self.data = data;
					$(self.container).find("#"+"stencil_" + self.timestamp).html(data);
					
					if (typeof callback == "function") {
						callback();
					}
				}
			});
			

		}
		else if (this.type == "line") {
			$.ajax({
				url: url,			
				type: "POST",
				data: "path=../../stencil/"+this.shape+".js",
				success: function(data) {
					//$(self.container).find("#"+"stencil_" + self.timestamp).html(data);
					self.javascript = data;
					
					$(document).trigger("lineStencilCodeLoaded");
				}
			});
		}

	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method setShape 
	 **/
	setShape: function() {
		var self = this;
		
		if (this.properties != null) {
			$.each(this.properties, function (key, state) {
				if (key == "font_size") {
					$(self.container).find("#"+"stencil_" + self.timestamp).find("."+key).css("font-size", state);
				}
				else if (key == "font_color") {
					$(self.container).find("#"+"stencil_" + self.timestamp).find("."+key).css("color", state);
				}
				else if (key == "font_style") {
					$(self.container).find("#"+"stencil_" + self.timestamp).find("."+key).css("font-style", state);
				}
				else if (key == "font_weight") {
					$(self.container).find("#"+"stencil_" + self.timestamp).find("."+key).css("font-weight", state);
				}				
				else if (key == "bg_color") {
					$(self.container).find("#"+"stencil_" + self.timestamp).find("."+key).css("background-color", state);
				}								
				else {
					$(self.container).find("#"+"stencil_" + self.timestamp).find("."+key).html(state);
				}
			});
		}
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method remove 
	 **/
	remove: function() {
		$(this.container).find("#"+"stencil_" + this.timestamp).remove();
		
		delete this;
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method remove 
	 **/
	show: function() {
		$(this.container).find("#"+"stencil_" + this.timestamp).show();
	}
	
};