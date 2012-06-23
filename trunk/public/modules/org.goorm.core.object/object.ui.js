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
 * @class ui
 * @extends object
 **/
org.goorm.core.object.ui = function () {
	/**
	 * This presents the current browser version
	 * @property target
	 * @type Object
	 * @default null
	 **/
	this.target = null;
	
	/**
	 * This presents the current browser version
	 * @property parent
	 * @type Object
	 * @default null
	 **/
	this.parent = null;
	
	/**
	 * This presents the current browser version
	 * @property type
	 * @type Object
	 * @default null
	 **/
	this.type = null; // square or line
		
	/**
	 * This presents the current browser version
	 * @property kind
	 * @type Object
	 * @default null
	 **/
	this.kind = null;
	
	/**
	 * This presents the current browser version
	 * @property shapeName
	 * @type Object
	 * @default null
	 **/
	this.shapeName = null;
	
	/**
	 * This presents the current browser version
	 * @property shape
	 * @type Object
	 * @default null
	 **/
	this.shape = null;
	
	/**
	 * This presents the current browser version
	 * @property dashed
	 **/
	this.dashed = null;
	
	/**
	 * This presents the current browser version
	 * @property proportion
	 **/
	this.proportion = null;
		
	/**
	 * This presents the current browser version
	 * @property properties
	 * @type Object
	 * @default null
	 **/	
	this.properties = null;
	
	/**
	 * This presents the current browser version
	 * @property selected
	 * @type Object
	 * @default null
	 **/	
	this.selected = false;
	
	/**
	 * This presents the current browser version
	 * @property data_uuid
	 * @type Object
	 * @default null
	 **/
	this.data_uuid = null;
	
	/**
	 * This presents the current browser version
	 * @property contextMenu
	 * @type Object
	 * @default null
	 **/
	this.contextMenu = null;
};

org.goorm.core.object.ui.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 * @param {Object} target The target.
	 * @param {Object} type The type.
	 * @param {Object} shapeName The name of shape.
	 **/
	init: function (target, parent, type, shapeName, option, callback) {
		var self = this;
		
		this.target = target;
		this.parent = parent;
		this.type = type;
		this.shapeName = shapeName;
		this.properties = null;
		
		if (option) {
			this.dashed = option['dashed'];
			this.proportion = option['proportion'];
		}
		

		
		if(type == "line") {
			if(shapeName != null) {
				this.shape = new org.goorm.core.stencil();
				this.shape.init(shapeName, this.type, $("#" + core.mainLayout.workSpace.windowManager.window[core.mainLayout.workSpace.windowManager.activeWindow].container).find(".shapes"));
				
				this.kind = this.shapeName.split("/");
				this.kind = this.kind[1];
				
				this.properties = new org.goorm.core.object.ui.line().init(target, this.kind, this.dashed);
			}
			else {
				this.properties = new org.goorm.core.object.ui.line().init(target, "line", this.dashed);
			}
		}
		else if(type == "square") {
			
			
			if(shapeName != null) {
				this.shape = new org.goorm.core.stencil();
				this.shape.init(shapeName, this.type, $("#" + core.mainLayout.workSpace.windowManager.window[core.mainLayout.workSpace.windowManager.activeWindow].container).find(".shapes"), callback);
				
				this.kind = this.shapeName.split("/");
				this.kind = this.kind[1];
				
				this.properties = new org.goorm.core.object.ui.square().init(target, this.kind, this.proportion);
			}
			else {
				this.properties = new org.goorm.core.object.ui.square().init(target, "square", this.proportion);
			}			
		}
		
		
		//Set context menu
		this.contextMenu = new org.goorm.core.menu.context();
		this.contextMenu.init("configs/menu/org.goorm.core.object/object.ui.html", "object.ui", "", this.properties.timestamp, "", function() {
			//Set context menu action
			$("div[id='object.ui_"+self.properties.timestamp+"']").find("a[action=cutObject]").click(function () {
				self.cut();
			});
			$("div[id='object.ui_"+self.properties.timestamp+"']").find("a[action=copyObject]").click(function () {
				self.copy();
			});
			$("div[id='object.ui_"+self.properties.timestamp+"']").find("a[action=pasteObject]").click(function () {
				self.paste();
			});						
			$("div[id='object.ui_"+self.properties.timestamp+"']").find("a[action=deleteObject]").click(function () {
				/*for (var index in self.parent.objects) {
					if (self.parent.objects[index]==self) {
						self.parent.remove(index);
					}
				}*/
				self._delete();
			});	
			$("div[id='object.ui_"+self.properties.timestamp+"']").find("a[action=bringToFront]").click(function () {
				self.bringToFront();
			});	
			$("div[id='object.ui_"+self.properties.timestamp+"']").find("a[action=sendToBack]").click(function () {
				self.sendToBack();
			});	
			$("div[id='object.ui_"+self.properties.timestamp+"']").find("a[action=bringForward]").click(function () {
				self.bringForward();
			});	
			$("div[id='object.ui_"+self.properties.timestamp+"']").find("a[action=sendBackward]").click(function () {
				self.sendBackward();
			});	
			$("div[id='object.ui_"+self.properties.timestamp+"']").find("a[action=propertiesObject]").click(function () {
				self.propertiesObject();
			});				
		});
		
		
		$(target).find("canvas").mousedown(function (e) {
			if (e.which == 3) {
				if (self.type == "square") {
					var parentOffset = $(this).parent().offset(); 
					x = e.pageX - parentOffset.left;
					y = e.pageY - parentOffset.top;
					
					//Select Body of Square
					if ( ( (self.properties.sx - 5 < x && x < self.properties.ex + 5) || (self.properties.ex - 5 < x && x < self.properties.sx + 5) ) && ( (self.properties.sy - 5 < y && y < self.properties.ey + 5) || (self.properties.ey - 5 < y && y < self.properties.sy + 5) ) ) { //Body Selection
					
						
						/* Right Mousebutton was clicked! */
						$("div.yuimenu").css("visibility", "hidden");
						$("div.yui-menu-shadow").removeClass("yui-menu-shadow-visible");
						self.contextMenu.menu.show();
		
						$("div[id='object.ui_" + self.properties.timestamp+"']").css("z-index", 5);
						$("div[id='object.ui_" + self.properties.timestamp+"']").css("left", e.pageX);
						$("div[id='object.ui_" + self.properties.timestamp+"']").css("top", e.pageY);	
						
						e.preventDefault();
						e.stopPropagation();
						
						return false;
					}
				}			
				else if (self.type == "line") {
					//Calculate the position (x, y) in Canvas Axis
					var parentOffset = $(this).parent().offset(); 
					x = e.pageX - parentOffset.left;
					y = e.pageY - parentOffset.top;
					
					
					if (self.properties.sx) {
						self.properties.sx = parseInt(self.properties.sx);
					}
					
					if (self.properties.sy) {
						self.properties.sy = parseInt(self.properties.sy);
					}
					
					if (self.properties.ex) {
						self.properties.ex = parseInt(self.properties.ex);
					}
					
					if (self.properties.ey) {
						self.properties.ey = parseInt(self.properties.ey);		
					}
					
					
					//Select Body of Line
					if ( ( (self.properties.sx - 5 < x && x < self.properties.ex + 5) || (self.properties.ex - 5 < x && x < self.properties.sx + 5) ) && ( (self.properties.sy - 5 < y && y < self.properties.ey + 5) || (self.properties.ey - 5 < y && y < self.properties.sy + 5) ) ) { //Body Selection
						//Calculate the constant for Line Function : y = ax + b
						var a;
						var b1, b2;
						var c = 5;
						
						if ( self.properties.ex - self.properties.sx != 0) {
							a = (self.properties.ey - self.properties.sy) / (self.properties.ex - self.properties.sx);
							
							c = Math.round(5 * Math.sqrt(a * a + 1) * 1000)/1000; // +- 5px
							
							b1 = self.properties.sy - a * self.properties.sx - c;
							b2 = self.properties.sy - a * self.properties.sx + c;
							
							
							if ( Math.round((Math.abs(a)*1000))/1000 < 0.01 || Math.round((Math.abs(1/a)*1000))/1000 < 0.01 ||
							     ( (a * x + b1 <= y && y <= a * x + b2 && (((y - b1) / a <= x && x <=  (y - b2) / a) || ((y - b2) / a <= x && x <=  (y - b1) / a))) ) ) {
								
								/* Right Mousebutton was clicked! */
								$("div.yuimenu").css("visibility", "hidden");
								$("div.yui-menu-shadow").removeClass("yui-menu-shadow-visible");
								self.contextMenu.menu.show();
					
								$("div[id='object.ui_" + self.properties.timestamp+"']").css("z-index", 5);
								$("div[id='object.ui_" + self.properties.timestamp+"']").css("left", e.pageX);
								$("div[id='object.ui_" + self.properties.timestamp+"']").css("top", e.pageY);	

						
								e.preventDefault();
								e.stopPropagation();									
								return false;
							}
						}
					}
				}
			}
			else if (e.which == 1) {
				self.contextMenu.menu.hide();
			}
		});

		return this;
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method setAdapter 
	 **/
	setAdapter: function () {
		
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method select 
	 **/
	select: function () {
		if(this.type == "square") {
			//this.properties.select();
		}
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method deselect 
	 **/
	deselect: function () {
		if(this.type == "square") {
			//this.properties.deselect();
		}
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method bringToFront 
	 **/
	bringToFront: function () {
		this.parent.bringToFront(this);
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method sendToBack 
	 **/
	sendToBack: function () {
		this.parent.sendToBack(this);
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method bringForward 
	 **/
	bringForward: function () {
		this.parent.bringForward(this);
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method sendBackward 
	 **/
	sendBackward: function () {
		this.parent.sendBackward(this);
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method propertiesObject 
	 **/
	propertiesObject: function () {
		//this.parent.propertiesObject(this);
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method remove 
	 **/
	remove: function () {
/*
		//Register the undo function
		
		var properties = new Object();
		properties.sx = this.properties.sx;
		properties.sy = this.properties.sy;
		properties.ex = this.properties.ex;
		properties.ey = this.properties.ey;
		
		this.parent.undoManager.register(
			this.parent, this.parent.add, [this.type, this.shape, this.option, properties], 'Create Item',
			self, self.remove, [], 'Remove Item'
		);
	
*/
		this.properties.remove();
		this.shape.remove();
		
		delete this;
	},
	
	_delete: function () {
		this.parent._delete();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method cut 
	 **/
	cut: function () {
		this.parent.cut();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method copy 
	 **/
	copy: function () {
		this.parent.copy();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method paste 
	 **/
	paste: function () {
		this.parent.paste();
	}
	
};
