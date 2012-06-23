/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module module
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class square
 * @extends ui
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
	 * @type Number
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
	 * @property kind
	 * @type String
	 * @default null
	 **/
	this.kind = null;		
	
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
	 * @property status
	 * @type Object
	 * @default null
	 **/
	this.status = null;	
	
	/**
	 * This presents the current browser version
	 * @property status
	 * @type Object
	 * @default null
	 **/
	this.proportion = null;	
	
	/**
	 * This presents the current browser version
	 * @property attrList
	 * @type Array
	 * @default Array("id", "name", "sx", "sy", "ex", "ey")
	 **/
	this.attrList = new Array("id", "name", "kind", "timestamp", "sx", "sy", "ex", "ey");
};

org.goorm.core.object.ui.square.prototype = {
	
	/**
	 *	Initializing Line Object
	 *	@constructor
	 *	@param {Object} target The target.
	 **/
	init: function (target, kind, proportion) {
		var self = this;
		
		//Set 
		this.target = target;
		this.timestamp = new Date().getTime();
		
		this.connector = $.makeArray();
		this.connector['tl'] = null;
		this.connector['t'] = null;
		this.connector['tr'] = null;
		this.connector['r'] = null;
		this.connector['br'] = null;
		this.connector['b'] = null;
		this.connector['bl'] = null;
		this.connector['l'] = null;
		
		this.proportion = proportion;
		
		//Set the properties
		this.id = "square_"+this.timestamp;
		this.name = "square_"+this.timestamp;	
		this.kind = kind;			
		this.x = 0;
		this.y = 0;
		this.width = 0;
		this.height = 0;
		
		
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
			
			
			//Select Body of Square
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
					
	
					if (self.sy - 3 < y && y < self.sy + 3 && self.sx - 3 < x && x <  self.sx + 3) {
						//Set the cursor is resize
						self.changeStatus("statusResizeTopLeft");
						
						self.isDrag = true;
						self.isDrawFinished = false;
						
						self.selectedNode = "tl";
					}
					else if (self.sy - 3 < y && y < self.sy + 3 && self.ex - 3 < x && x <  self.ex + 3) {
						//Set the cursor is resize
						self.changeStatus("statusResizeTopRight");
						
						self.isDrag = true;
						self.isDrawFinished = false;
						
						self.selectedNode = "tr";
					}
					else if (self.ey - 3 < y && y < self.ey + 3 && self.ex - 3 < x && x <  self.ex + 3) {
						//Set the cursor is resize
						self.changeStatus("statusResizeBottomRight");
						
						self.isDrag = true;
						self.isDrawFinished = false;
						
						self.selectedNode = "br";
					}
					else if (self.ey - 3 < y && y < self.ey + 3 && self.sx - 3 < x && x <  self.sx + 3) {
						//Set the cursor is resize
						self.changeStatus("statusResizeBottomLeft");
						
						self.isDrag = true;
						self.isDrawFinished = false;
						
						self.selectedNode = "bl";
					}
					else if ((self.sy+self.ey)/2 - 3 < y && y < (self.sy+self.ey)/2 + 3 && self.sx - 3 < x && x <  self.sx + 3) {
						//Set the cursor is resize
						self.changeStatus("statusResizeLeft");
						
						self.isDrag = true;
						self.isDrawFinished = false;
						
						self.selectedNode = "l";
					}
					else if ((self.sy+self.ey)/2 - 3 < y && y < (self.sy+self.ey)/2 + 3 && self.ex - 3 < x && x <  self.ex + 3) {
						//Set the cursor is resize
						self.changeStatus("statusResizeRight");
						
						self.isDrag = true;
						self.isDrawFinished = false;
						
						self.selectedNode = "r";
					}
					else if (self.sy - 3 < y && y < self.sy + 3 && (self.sx+self.ex)/2 - 3 < x && x < (self.sx+self.ex)/2 + 3) {
						//Set the cursor is resize
						self.changeStatus("statusResizeTop");
						
						self.isDrag = true;
						self.isDrawFinished = false;
						
						self.selectedNode = "t";
					}
					else if (self.ey - 3 < y && y < self.ey + 3 && (self.sx+self.ex)/2 - 3 < x && x < (self.sx+self.ex)/2 + 3) {
						//Set the cursor is resize
						self.changeStatus("statusResizeBottom");
						
						self.isDrag = true;
						self.isDrawFinished = false;
						
						self.selectedNode = "b";
					}
					else {
						if (self.selectedNode != "body") {
							self.selectedNode = null;
						}
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
				
				//Dragging Body
				if (self.selectedNode == "body") {
					self.sx += x - self.prevX;
					self.sy += y - self.prevY;
					self.ex += x - self.prevX;
					self.ey += y - self.prevY;
					
					self.prevX = x;
					self.prevY = y;
				}
				//Dragging Top Left
				else if (self.selectedNode == "tl") {
					
					if (self.proportion) {
						var ratio = self.proportion[1] / self.proportion[0];
						
						self.sx = x;
						
						var width = Math.abs(self.ex - self.sx);
						var height = width * ratio;
						
						self.sy = self.ey - parseInt(height);
					}
					else {
						self.sx = x;
						self.sy = y;
					}
				}				
				//Dragging Top
				else if (self.selectedNode == "t") {
					if (self.proportion) {
						var ratio = self.proportion[0] / self.proportion[1];
						
						self.sy = y;
						
						var height = Math.abs(self.ey - self.sy);
						var width = height * ratio;
						var middle = (self.sx + self.ex) / 2;
						
						self.sx = middle - parseInt(width/2);
						self.ex = middle + parseInt(width/2);
					}
					else {
						self.sy = y;
					}
				}
				//Dragging Top Right
				else if (self.selectedNode == "tr") {
					if (self.proportion) {
						var ratio = self.proportion[1] / self.proportion[0];
						
						self.ex = x;
						
						var width = Math.abs(self.ex - self.sx);
						var height = width * ratio;
						
						self.sy = self.ey - parseInt(height);
					}
					else {
						self.ex = x;
						self.sy = y;
					}
				}				
				//Dragging Right
				else if (self.selectedNode == "r") {
					if (self.proportion) {
						var ratio = self.proportion[1] / self.proportion[0];
						
						self.ex = x;
					
						var width = Math.abs(self.ex - self.sx);
						var height = width * ratio;
						
						self.ey = self.sy + parseInt(height);
					}
					else {
						self.ex = x;
					}
				}	
				//Dragging Bottom Right
				else if (self.selectedNode == "br") {
					if (self.proportion) {
						var ratio = self.proportion[1] / self.proportion[0];
						
						self.ex = x;
					
						var width = Math.abs(self.ex - self.sx);
						var height = width * ratio;
						
						self.ey = self.sy + parseInt(height);
					}
					else {
						self.ex = x;
						self.ey = y;
					}
				}				
				//Dragging Bottom
				else if (self.selectedNode == "b") {
					if (self.proportion) {
						var ratio = self.proportion[0] / self.proportion[1];
						
						self.ey = y;
						
						var height = Math.abs(self.ey - self.sy);
						var width = height * ratio;
						var middle = (self.sx + self.ex) / 2;
						
						self.sx = middle - parseInt(width/2);
						self.ex = middle + parseInt(width/2);
					}
					else {
						self.ey = y;
					}
				}	
				//Dragging Bottom Left
				else if (self.selectedNode == "bl") {
					if (self.proportion) {
						var ratio = self.proportion[1] / self.proportion[0];
						
						self.sx = x;
					
						var width = Math.abs(self.ex - self.sx);
						var height = width * ratio;
						
						self.ey = self.sy + parseInt(height);
					}
					else {
						self.sx = x;
						self.ey = y;
					}
				}				
				//Dragging Left
				else if (self.selectedNode == "l") {
					if (self.proportion) {
						var ratio = self.proportion[1] / self.proportion[0];
						
						self.sx = x;
					
						var width = Math.abs(self.ex - self.sx);
						var height = width * ratio;
						
						self.ey = self.sy + parseInt(height);
					}
					else {
						self.sx = x;
					}
				}
				//Dragging Default
				else {
					if (self.proportion) {
						var ratio = self.proportion[1] / self.proportion[0];
						
						self.ex = x;
					
						var width = Math.abs(self.ex - self.sx);
						var height = width * ratio;
						
						self.ey = self.sy + parseInt(height);
					}
					else {
						self.ex = x;
						self.ey = y;
					}
				}	
				
				
				/*
				if (self.proportion) {
					var ratio = self.proportion[1] / self.proportion[0];
						
					self.ex = x;
					
					var width = Math.abs(self.ex - self.sx);
					var height = width * ratio;
						
					self.ey = self.sy + parseInt(height);
				}
				*/
				
				self.drawSquare(self.sx, self.sy, self.ex, self.ey);
			}
			
			if (self.sy - 3 < y && y < self.sy + 3 && self.sx - 3 < x && x <  self.sx + 3) {
				//Set the cursor is resize
				self.changeStatus("statusResizeTopLeft");
			}
			else if (self.sy - 3 < y && y < self.sy + 3 && self.ex - 3 < x && x <  self.ex + 3) {
				//Set the cursor is resize
				self.changeStatus("statusResizeTopRight");
			}
			else if (self.ey - 3 < y && y < self.ey + 3 && self.ex - 3 < x && x <  self.ex + 3) {
				//Set the cursor is resize
				self.changeStatus("statusResizeBottomRight");
			}
			else if (self.ey - 3 < y && y < self.ey + 3 && self.sx - 3 < x && x <  self.sx + 3) {
				//Set the cursor is resize
				self.changeStatus("statusResizeBottomLeft");
			}
			else if ((self.sy+self.ey)/2 - 3 < y && y < (self.sy+self.ey)/2 + 3 && self.sx - 3 < x && x <  self.sx + 3) {
				//Set the cursor is resize
				self.changeStatus("statusResizeLeft");
			}
			else if ((self.sy+self.ey)/2 - 3 < y && y < (self.sy+self.ey)/2 + 3 && self.ex - 3 < x && x <  self.ex + 3) {
				//Set the cursor is resize
				self.changeStatus("statusResizeRight");
			}
			else if (self.sy - 3 < y && y < self.sy + 3 && (self.sx+self.ex)/2 - 3 < x && x < (self.sx+self.ex)/2 + 3) {
				//Set the cursor is resize
				self.changeStatus("statusResizeTop");
			}
			else if (self.ey - 3 < y && y < self.ey + 3 && (self.sx+self.ex)/2 - 3 < x && x < (self.sx+self.ex)/2 + 3) {
				//Set the cursor is resize
				self.changeStatus("statusResizeBottom");
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
					
					self.status = "modified";
				}
				
				//Set the cursor is default
				self.changeStatus("statusDefault");
			}
			else if (e.which == 3) {
				
				e.preventDefault();
				e.stopPropagation();
				
				return false;
			}

			self.clear();	
			
			
					
		});
		
		$(target).find("canvas").click(function (e) {
			if (!self.focus) {
				return false;
			}
			
			if (e.which == 3) {
				e.preventDefault();
				e.stopPropagation();
				
				return false;
			}
		});
		
		return this;
	},
	
	/**
	 * Drawing Line Function
	 * @method drawSquare
	 * @param {Number} sx The position on x-coordinate of the starting point of the square.
	 * @param {Number} sy The position on y-coordinate of the end point of the square.
	 * @param {Number} ex The position on x-coordinate of the starting point of the square.
	 * @param {Number} ey The position on y-coordinate of the end point of the square.
	 **/
	drawSquare: function (sx, sy, ex, ey) {
		
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
		// remove [1] nulla
		if($(this.target).find("canvas").getContext) {
			var context = $(this.target).find("canvas").getContext('2d');
			
			//clear whole canvas
			context.clearRect (0, 0, $(this.target).find("canvas").width(), $(this.target).find("canvas").height());	
		
			/*
			if(this.isDrag) {	
				context.strokeStyle = "#ccc";
				context.lineWidth = 0.5;
						
				context.beginPath();			
				context.rect(sx, sy, ex-sx, ey-sy);				
				context.closePath();
				context.stroke();
			}
			*/
		}
	},
	
	// remove [1] nula
	clear: function () {
		if($(this.target).find("canvas").getContext) {
			var context = $(this.target).find("canvas").getContext('2d');
			//clear whole canvas
			context.clearRect (0, 0, $(this.target).find("canvas").width(), $(this.target).find("canvas").height());	
		}
	},
	
	/**
	 * Drawing Line Function
	 * @method remove
	 **/
	remove: function () {
		this.target = null;
		this.timestamp = null;
	
		this.focus = null;
		this.isDrag = null;
		this.isDrawFinished = null;
		this.selectedNode = null;
		
		this.sx = null;
		this.sy = null;
		this.ex = null;
		this.ey = null;
		
		this.prevX = null;
		this.prevY = null;
		
		this.id = null;
		this.name = null;	
		this.x = null;
		this.y = null;
		this.width = null;
		this.height = null;
		
		this.connector = null;	
		
		delete this;
	},
	
	/**
	 * Change status of the class.
	 * @method changeStatus 
	 * @param {String} className The name of the class.
	 */
	changeStatus: function (className) {
		$(this.target).removeClass("statusDefault");
		$(this.target).removeClass("statusDrawingLine");
		$(this.target).removeClass("statusDrawingSquare");
		$(this.target).removeClass("statusMove");

		$(this.target).removeClass("statusResizeTopLeft");
		$(this.target).removeClass("statusResizeTopRight");
		$(this.target).removeClass("statusResizeBottomLeft");
		$(this.target).removeClass("statusResizeBottomRight");
		$(this.target).removeClass("statusResizeTop");
		$(this.target).removeClass("statusResizeBottom");
		$(this.target).removeClass("statusResizeLeft");
		$(this.target).removeClass("statusResizeRight");		
		
		$(this.target).addClass(className);
	},
	
	/**
	 * Change status of the class.
	 * @method move 
	 * @param {Number} offsetX The offset on the x-coordinate of moving distance.
	 * @param {Number} offsetY The offset on the y-coordinate of moving distance.
	 **/
	move: function (offsetX, offsetY) {
		this.sx += offsetX;
		this.sy += offsetY;
		this.ex += offsetX;
		this.ey += offsetY;
		
		self.status = "modified";
	}
};