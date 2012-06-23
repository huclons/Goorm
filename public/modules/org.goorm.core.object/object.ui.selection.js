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
 * @class selection
 * @extends ui
 **/
org.goorm.core.object.ui.selection = function () {
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
	 * @property contextMenu
	 * @type Object
	 * @default null
	 **/
	this.contextMenu = null;
	
	/**
	 * This presents the current browser version
	 * @property focus
	 * @type Boolean
	 * @default true
	 **/
	this.focus = true;
	
	/**
	 * This presents the current browser version
	 * @property isDrag
	 * @type Boolean
	 * @default false
	 **/
	this.isDrag = false;
	
	/**
	 * This presents the current browser version
	 * @property isDrawFinished
	 * @type Boolean
	 * @default false
	 **/
	this.isDrawFinished = false;
	
	/**
	 * This presents the current browser version
	 * @property selectedNode
	 * @type Object
	 * @default null
	 **/
	this.selectedNode = null;
	
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
	 * @property prevX
	 * @type Number
	 * @default null
	 **/
	this.prevX = null;
	
	/**
	 * This presents the current browser version
	 * @property prevY
	 * @type Number
	 * @default null
	 **/
	this.prevY = null;
	
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
	 * @type Object
	 * @default null
	 **/	
	this.connector = null;	
	
	/**
	 * This presents the current browser version
	 * @property attrList
	 * @type Array
	 * @default Array("id", "name", "sx", "sy", "ex", "ey")
	 **/
	this.attrList = new Array("id", "name", "sx", "sy", "ex", "ey");
};

org.goorm.core.object.ui.selection.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 * @param {Object} target The target.
	 **/
	init: function (target) {
		var self = this;
		
		//Set 
		this.target = target;
		this.timestamp = new Date().getTime();
		
		this.connector = $.makeArray();
		this.connector['head'] = null;
		this.connector['tail'] = null;
		
		
		//Set the properties
		this.id = "line";
		this.name = "line_"+this.timestamp;	
		this.x = 0;
		this.y = 0;
		this.width = 0;
		this.height = 0;
		
		//Set context menu
		this.contextMenu = new org.goorm.core.menu.context();
		this.contextMenu.init("configs/menu/org.goorm.core.object/object.ui.html", "object.ui", "", this.timestamp, "", function() {
			//Set context menu action
			$("div[id='object.ui_"+self.timestamp+"']").find("a[action=cutObject]").click(function () {
				m.s("cut", "context menu");
			});
			$("div[id='object.ui_"+self.timestamp+"']").find("a[action=copyObject]").click(function () {
				m.s("copy", "context menu");
			});
			$("div[id='object.ui_"+self.timestamp+"']").find("a[action=pasteObject]").click(function () {
				m.s("paste", "context menu");
			});						
			$("div[id='object.ui_"+self.timestamp+"']").find("a[action=deleteObject]").click(function () {
				m.s("delete", "context menu");
			});			
		});
		
		


		//Set Mouse Down Event in Canvas
		$(target).find("canvas").mousedown(function (e) {
			
			if (!self.focus) {
				return false;
			}
			
			//Calculate the position (x, y) in Canvas Axis
			var parentOffset = $(this).parent().offset(); 
			x = e.pageX - parentOffset.left;
			y = e.pageY - parentOffset.top;
			
			
			if (self.sx) {
				self.sx = parseInt(self.sx);
			}
			
			if (self.sy) {
				self.sy = parseInt(self.sy);
			}
			
			if (self.ex) {
				self.ex = parseInt(self.ex);
			}
			
			if (self.ey) {
				self.ey = parseInt(self.ey);		
			}
			
			
			//Select Body of Line
			if ( ( (self.sx - 5 < x && x < self.ex + 5) || (self.ex - 5 < x && x < self.sx + 5) ) && ( (self.sy - 5 < y && y < self.ey + 5) || (self.ey - 5 < y && y < self.sy + 5) ) ) { //Body Selection
				if (e.which == 1) {
					self.isDrag = true;
					self.isDrawFinished = false;
						  
					self.selectedNode = "body";
					
					//Using Current x, y
					x = e.pageX - parentOffset.left;
					y = e.pageY - parentOffset.top;
					
					self.prevX = x;
					self.prevY = y;
				}
				else if (e.which === 3) {
					
					/* Right Mousebutton was clicked! */
					self.contextMenu.menu.show();
	
					$("div[id='object.ui_" + self.timestamp+"']").css("z-index", 5);
					$("div[id='object.ui_" + self.timestamp+"']").css("left", e.pageX);
					$("div[id='object.ui_" + self.timestamp+"']").css("top", e.pageY);	
		
					e.preventDefault();
					e.stopPropagation()
					
					return false;
				}
			}

			if (e.which == 1) {
				
				//First Drawing			
				if (!self.isDrawFinished && !self.isDrag) {
					self.isDrag = true;
					self.isDrawFinished = false;
					
					//Using Current x, y
					x = e.pageX - parentOffset.left;
					y = e.pageY - parentOffset.top;
					
					self.sx = x;
					self.sy = y;
					
					self.selectedNode = null;
				}
				else {
					//Using Current x, y
					x = e.pageX - parentOffset.left;
					y = e.pageY - parentOffset.top;
					
					//Dragging Top Left
					if (self.sy - 3 < y && y < self.sy + 3 && self.sx - 3 < x && x <  self.sx + 3) {
						self.isDrag = true;
						self.isDrawFinished = false;
			
						self.selectedNode = "tl";
					}
					//Dragging Top Right
					if (self.sy - 3 < y && y < self.sy + 3 && self.ex - 3 < x && x <  self.ex + 3) {
						self.isDrag = true;
						self.isDrawFinished = false;
			
						self.selectedNode = "tr";
					}
					//Dragging Bottom Right
					else if (self.ey - 3 < y && y < self.ey + 3 && self.ex - 3 < x && x <  self.ex + 3) {
						self.isDrag = true;
						self.isDrawFinished = false;
						
						self.selectedNode = "br";
					}
					//Dragging Bottom Left
					else if (self.ey - 3 < y && y < self.ey + 3 && self.sx - 3 < x && x <  self.sx + 3) {
						self.isDrag = true;
						self.isDrawFinished = false;
						
						self.selectedNode = "bl";
					}
				}
				
			}

		});
		
		//Set Mouse Move Event in Canvas
		$(target).find("canvas").mousemove(function (e) {
			
			if (!self.focus) {
				return false;
			}
			
			//Calculate the position (x, y) in Canvas Axis
			var parentOffset = $(this).parent().offset(); 	
			x = Math.floor(e.pageX - parentOffset.left);
			y = Math.floor(e.pageY - parentOffset.top);
			  
			if(!self.isDrawFinished && self.isDrag) {
				//Dragging Head
				if (self.selectedNode == "tl") {
					self.sx = x;
					self.sy = y;
				}
				else if (self.selectedNode == "body") {
					self.sx += x - self.prevX;
					self.sy += y - self.prevY;
					self.ex += x - self.prevX;
					self.ey += y - self.prevY;
					
					self.prevX = x;
					self.prevY = y;
				}
				//Dragging Tail and Default
				else {
					self.ex = x;
					self.ey = y;
				}	
				
				self.drawLine(self.sx, self.sy, self.ex, self.ey);
			}
			
			if((self.sy - 3 < y && y < self.sy + 3 && self.sx - 3 < x && x <  self.sx + 3) || (self.sy - 3 < y && y < self.sy + 3 && self.ex - 3 < x && x <  self.ex + 3) || (self.ey - 3 < y && y < self.ey + 3 && self.ex - 3 < x && x <  self.ex + 3) || (self.ey - 3 < y && y < self.ey + 3 && self.sx - 3 < x && x <  self.sx + 3)) {
				//Set the cursor is crosshair
				$(self.target).removeClass("statusDefault");
				$(self.target).removeClass("statusMove");
				$(self.target).removeClass("statusDrawingSquare");
				$(self.target).addClass("statusDrawingLine");
			}
		});		
		
		//Set Mouse Up Event in Canvas  
		$(target).find("canvas").mouseup(function (e) {
			if (!self.focus) {
				return false;
			}			
			
			if (e.which == 1) {
				//If Drawing and Dragging is not finished and
				if(!self.isDrawFinished && self.isDrag) {	
					self.isDrag = false;
					self.isDrawFinished = true;
					
					if (self.sx) {
						self.sx = parseInt(self.sx);
					}
					
					if (self.sy) {
						self.sy = parseInt(self.sy);
					}
					
					if (self.ex) {
						self.ex = parseInt(self.ex);
					}
					
					if (self.ey) {
						self.ey = parseInt(self.ey);		
					}
					
					self.x = self.sx;
					self.y = self.sy;
					self.width = Math.abs(self.ex - self.sx);
					self.height = Math.abs(self.ey - self.sy);
				}
				
				//Set the cursor is default
				$(self.target).removeClass("statusDrawingLine");
				$(self.target).removeClass("statusMove");
				$(self.target).removeClass("statusDrawingSquare");
				$(self.target).addClass("statusDefault");
			}
			else if (e.which === 3) {
				
				e.preventDefault();
				e.stopPropagation()
				
				return false;
			}
		});
		
		$(target).find("canvas").click(function (e) {
			if (!self.focus) {
				return false;
			}
			
			if (e.which === 3) {
				e.preventDefault();
				e.stopPropagation()
				
				return false;
			}
		});
		
		return this;
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method drawLine 
	 * @param {Number} sx The position on x-coordinate of the starting point of the line.
	 * @param {Number} sy The position on y-coordinate of the end point of the line.
	 * @param {Number} ex The position on x-coordinate of the starting point of the line.
	 * @param {Number} ey The position on y-coordinate of the end point of the line.
	 **/
	drawLine: function (sx, sy, ex, ey) {
		
		if (sx) {
			sx = parseInt(sx);
		}
		
		if (sy) {
			sy = parseInt(sy);
		}
		
		if (ex) {
			ex = parseInt(ex);
		}
		
		if (ey) {
			ey = parseInt(ey);		
		}
		
		//drawing the line
		if($(this.target).find("canvas").getContext) {
			var context = $(this.target).find("canvas").getContext('2d');
			
			//clear whole canvas
			context.clearRect (0, 0, $(this.target).find("canvas").width(), $(this.target).find("canvas").height());	
			
			context.strokeStyle = "#000000";
			context.lineWidth = 0.5;
					
			context.beginPath();			
			context.rect(sx, sy, ex-sx, ey-sy);				
			context.closePath();
			context.stroke();
		}
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method remove 
	 **/
	remove: function () {
		
	}
};