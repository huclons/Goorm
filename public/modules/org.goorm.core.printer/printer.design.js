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
 * @class preview
 * @extends design.canvas.preview
 **/
org.goorm.core.printer.design = function () {
	/**
	 * This presents the current browser version
	 * @property canvas
	 **/
	this.canvas = null;
	
	/**
	 * This presents the current browser version
	 * @property panel
	 **/
	this.panel = null;	
	
	/**
	 * This presents the current browser version
	 * @property target
	 **/
	this.target = null;
	
	/**
	 * This presents the current browser version
	 * @property target
	 **/
	this.realTarget = null;
	
	/**
	 * This presents the current browser version
	 * @property width
	 **/
	this.realWidth = null;
	
	/**
	 * This presents the current browser version
	 * @property height
	 **/
	this.realHeight = null;
	
	/**
	 * This presents the current browser version
	 * @property width
	 **/
	this.width = null;
	
	/**
	 * This presents the current browser version
	 * @property height
	 **/
	this.height = null;
	
	/**
	 * This presents the current browser version
	 * @property left
	 **/
	this.left = null;
	
	/**
	 * This presents the current browser version
	 * @property top
	 **/
	this.top = null;
	
	/**
	 * This presents the current browser version
	 * @property scale
	 **/
	this.scale = null;
	
	/**
	 * This presents the current browser version
	 * @property parent
	 **/
	this.parent = null;
	
	/**
	 * This presents the current browser version
	 * @property indicatorWidth
	 **/
	this.indicatorWidth = null;
	
	/**
	 * This presents the current browser version
	 * @property indicatorHeight
	 **/
	this.isPreviewClicked = null;
	
};


org.goorm.core.printer.design.prototype = {
	init: function (target, width, height, scale, parent) {
		var self = this;

		//this.canvas = canvas;

		//Set Properties
		self.target = target;
		self.realWidth = width;
		self.width = width*scale;
		self.realHeight = height;
		self.height = height*scale;
		self.scale = scale;
		self.parent = parent;
		self.isPreviewClicked = false;
		
		

		//adding html container
		$(target).append("<div class='canvas'></div>"); //This is a canvas layer
		$(target).find(".canvas").append("<div class='shapes' style='position:absolute; width:" + width + "px; height:" + height + "px; border:1px solid #ccc;'></div>"); //This is a grid layer which has grid background image and opacity
		$(target).find(".canvas").append("<canvas width='"+self.width+"' height='"+self.height+"' style='position:absolute; background-color:transparent;'></canvas>"); //This is a canvas element which is supported in HTML5
		
		
		//Get the Stencils
		$(target).prepend("<head><style></style></head>");
		
		var url = "file/get_contents";
		
		$.ajax({
			url: url,			
			type: "GET",
			data: "path=../../stencil/org.goorm.stencil.uml/stencil.uml.css",
			success: function(data) {
				$(target).find("style").html(data);
			}
		});
	},

	/**
	 * This function is an goorm core initializating function.  
	 * <br>This operates the initialization tasks for layout, actions, plugins...
	 * @method draw 
	 **/
	draw: function () {
		var self = this;
		
		/*
		this.selectedIndex = $.unique(this.selectedIndex);
		*/
		
		//Canvas Element (Supported in HTML5)
		if($(this.target).find(".canvas").find("canvas")[0].getContext) {
			//Get Context
			var context = $(this.target).find(".canvas").find("canvas")[0].getContext('2d');
			
			//Clear the canvas
			context.clearRect (0, 0, $(this.target).find(".canvas").find("canvas").width(), $(this.target).find(".canvas").find("canvas").height());	
			
			//All objects
			$(this.parent.objects).each(function (i) {
				

				
				if (this.properties.timestamp == null) {
					var a = self.parent.objects.slice(0, i);
					var b = self.parent.objects.slice(i, self.parent.objects.length);
					
					b.shift();
					self.parent.objects = a.concat(b);
					//self.objects.pop(i);					
				}


			
				//if the object is line type
				if($(this)[0].type == 'line') {
					
					var sx=0, sy=0, ex=0, ey=0;
					
					if ($(this)[0].properties.sx) {
						sx = parseInt($(this)[0].properties.sx);
					}
					
					if ($(this)[0].properties.sy) {
						sy = parseInt($(this)[0].properties.sy);	
					}
	
					if ($(this)[0].properties.ex) {
						ex = parseInt($(this)[0].properties.ex);
					}

					if ($(this)[0].properties.ey) {					
						ey = parseInt($(this)[0].properties.ey);
					}
					
					if (!self.parent.multiNodeLine) {
					
						//is hovered?
						if(self.parent.hoveredIndex == i) {
							context.beginPath();
							context.strokeStyle = "#FFFF00";
							
							context.moveTo(sx, sy);
							context.lineTo(ex, ey);
							context.lineWidth = parseFloat($(this)[0].properties.thickness) + 5;
							context.stroke();
						}
						
						
						//drawing the object
						context.beginPath();
						context.strokeStyle = $(this)[0].properties.color;
						
						
						
						
						if (this.properties.dashed) {
							var dashArray=[5*parseFloat($(this)[0].properties.thickness), 4*parseFloat($(this)[0].properties.thickness)];
							var dashCount = dashArray.length;
							
							var dx, dy;
							
							var dashIndex=0, draw=true;
							
							var x, y;
							
							if (ex < sx) {
								x = ex;
								y = ey;
							}
							else {
								x = sx;
								y = sy;
							}
							
							dx = (ex-sx);
							dy = (ey-sy);
							context.moveTo(x, y);
							context.lineWidth = parseFloat($(this)[0].properties.thickness);
							
							var slope = dy/dx;
							var distRemaining = Math.sqrt( dx*dx + dy*dy );
							
							while (distRemaining>=0.1){
								var dashLength = dashArray[dashIndex++%dashCount];
								
								if (dashLength > distRemaining) 
									dashLength = distRemaining;
									
								var xStep = Math.sqrt( dashLength*dashLength / (1 + slope*slope) );
								
								x += xStep
								y += slope*xStep;
								
								context[draw ? 'lineTo' : 'moveTo'](x,y);
							
								distRemaining -= dashLength;
								draw = !draw;
							}
							
							context.stroke();
						}
						else {	
							context.moveTo(sx, sy);
							context.lineTo(ex, ey);
							context.lineWidth = parseFloat($(this)[0].properties.thickness);
							context.stroke();
						}
	
	
						
						//is selected? or hovered?
						if($.inArray(i, self.parent.selectedIndex) >= 0 || self.parent.selected) {
							context.beginPath();
							context.strokeStyle = "#666666";
							
							context.rect(sx- 3, sy - 3, 6, 6);
							context.closePath();
							context.lineWidth = 1;
							context.stroke();
							
							context.fillStyle = "#FFFFFF";
							context.fill();
							
							context.beginPath();
							context.strokeStyle = "#666666";
							
							context.rect(ex- 3, ey - 3, 6, 6);
							context.closePath();
							context.lineWidth = 1;
							context.stroke();
							
							context.fillStyle = "#FFFFFF";
							context.fill();
						}
						
						if (this.shape) {
						
							eval(this.shape.javascript);
						
						}
						
					}
					else {
						
						//drawing the object
						context.beginPath();
						context.strokeStyle = $(this)[0].properties.color;
		
						if (this.properties.dashed) {
							var dashArray=[5*parseFloat($(this)[0].properties.thickness), 4*parseFloat($(this)[0].properties.thickness)];
							var dashCount = dashArray.length;
							
							var dx, dy;
							
							var dashIndex=0, draw=true;
							
							var x, y;
							
							if (ex < sx) {
								x = ex;
								y = ey;
							}
							else {
								x = sx;
								y = sy;
							}
							
							dx = (ex-sx);
							dy = (ey-sy);
							context.moveTo(x, y);
							context.lineWidth = parseFloat($(this)[0].properties.thickness);
							
							var slope = dy/dx;
							var distRemaining = Math.sqrt( dx*dx + dy*dy );
							
							while (distRemaining>=0.1){
								var dashLength = dashArray[dashIndex++%dashCount];
								
								if (dashLength > distRemaining) 
									dashLength = distRemaining;
									
								var xStep = Math.sqrt( dashLength*dashLength / (1 + slope*slope) );
								
								x += xStep
								y += slope*xStep;
								
								context[draw ? 'lineTo' : 'moveTo'](x,y);
							
								distRemaining -= dashLength;
								draw = !draw;
							}
							
							context.stroke();
						}
						else {	
							context.moveTo(sx, sy);
							context.lineTo((sx+ex)/2, sy);							
							context.lineTo((sx+ex)/2, ey);
							context.lineTo(ex, ey);
							context.lineWidth = parseFloat($(this)[0].properties.thickness);
							context.stroke();
						}
	
	
						
						//is selected? or hovered?
						if($.inArray(i, self.parent.selectedIndex) >= 0 || self.parent.selected) {
							context.beginPath();
							context.strokeStyle = "#666666";
							
							context.rect(sx- 3, sy - 3, 6, 6);
							context.closePath();
							context.lineWidth = 1;
							context.stroke();
							
							context.fillStyle = "#FFFFFF";
							context.fill();
							
							context.beginPath();
							context.strokeStyle = "#666666";
							
							context.rect(ex- 3, ey - 3, 6, 6);
							context.closePath();
							context.lineWidth = 1;
							context.stroke();
							
							context.fillStyle = "#FFFFFF";
							context.fill();
						}
						
						if (this.shape) {
						
							eval(this.shape.javascript);
						
						}
					}
					
										
				}
				else if($(this)[0].type == 'square') { //if the object is line type
					
					var sx=0, sy=0, ex=0, ey=0;
					
					if ($(this)[0].properties.sx) {
						sx = parseInt($(this)[0].properties.sx);
					}
					
					if ($(this)[0].properties.sy) {
						sy = parseInt($(this)[0].properties.sy);	
					}
	
					if ($(this)[0].properties.ex) {
						ex = parseInt($(this)[0].properties.ex);
					}

					if ($(this)[0].properties.ey) {					
						ey = parseInt($(this)[0].properties.ey);
					}
					
					//is hovered?
					if(self.parent.hoveredIndex == i) {
						context.beginPath();
						context.strokeStyle = "#FFFF00";
						
						context.rect(sx, sy, ex-sx, ey-sy);
						context.lineWidth = 5;
						context.closePath();
						
						context.stroke();
						
						context.beginPath();
						context.strokeStyle = "#000000";
						context.fillStyle = "#FFFFFF";
						
						context.rect(sx, sy, ex-sx, ey-sy);
						context.lineWidth = 0.5;
						context.closePath();
						
						context.stroke();
					}
										
					//drawing the object
					/*
					context.beginPath();
					context.strokeStyle = "#000000";
					context.fillStyle = "#FFFFFF";
					
					context.rect(sx, sy, ex-sx, ey-sy);
					context.lineWidth = 0.5;
					context.closePath();
					
					context.stroke();
					context.fill();
					*/
					

					
					//is selected?
					if($.inArray(i, self.parent.selectedIndex) >= 0 || self.parent.selected) {
						context.beginPath();
						context.strokeStyle = "#666666";
						context.fillStyle = "#FFFFFF";
						
						context.rect(sx- 3, sy - 3, 6, 6);
						context.closePath();
						context.lineWidth = 1;
						context.stroke();
						context.fill();
						
						context.rect(ex- 3, sy - 3, 6, 6);
						context.closePath();
						context.lineWidth = 1;
						context.stroke();
						context.fill();
						
						context.rect(ex- 3, ey - 3, 6, 6);
						context.closePath();
						context.lineWidth = 1;
						context.stroke();
						context.fill();
						
						context.rect(sx- 3, ey - 3, 6, 6);
						context.closePath();
						context.lineWidth = 1;
						context.stroke();
						context.fill();
						
						context.rect( (sx+ex)/2 - 3, ey - 3, 6, 6);
						context.closePath();
						context.lineWidth = 1;
						context.stroke();
						context.fill();
						
						context.rect( (sx+ex)/2 - 3, sy - 3, 6, 6);
						context.closePath();
						context.lineWidth = 1;
						context.stroke();
						context.fill();
						
						context.rect(ex- 3, (sy+ey)/2 - 3, 6, 6);
						context.closePath();
						context.lineWidth = 1;
						context.stroke();
						context.fill();
						
						context.rect(sx- 3, (sy+ey)/2 - 3, 6, 6);
						context.closePath();
						context.lineWidth = 1;
						context.stroke();
						context.fill();
					}
				
					
					if (this.shape) {
						$(self.target).find(".canvas").find(".shapes").append("<div id='stencil_" + this.shape.timestamp + "' style='position:absolute;'></div>");
						
						if (this.shape.move) {
							var startX, startY, width, height;

							$(self.target).find(".canvas").find(".shapes").find("#"+"stencil_" + this.shape.timestamp).html(this.shape.data);
							
							
							if (this.properties.sx > this.properties.ex) {
								startX = this.properties.ex;
							}
							else {
								startX = this.properties.sx;
							}
							
							if (this.properties.sy > this.properties.ey) {
								startY = this.properties.ey;
							}
							else {
								startY = this.properties.sy;
							}
							
							width = Math.abs(this.properties.ex-this.properties.sx);
							height = Math.abs(this.properties.ey-this.properties.sy);
							
							$(self.target).find(".canvas").find(".shapes").find("#"+"stencil_" + this.shape.timestamp).css("left", startX);
							$(self.target).find(".canvas").find(".shapes").find("#"+"stencil_" + this.shape.timestamp).css("top", startY);
							$(self.target).find(".canvas").find(".shapes").find("#"+"stencil_" + this.shape.timestamp).css("width", width);
							$(self.target).find(".canvas").find(".shapes").find("#"+"stencil_" + this.shape.timestamp).css("height", height);
							//$(self.target).find(".canvas").find(".shapes").find("#"+"stencil_" + this.shape.timestamp).css("border", "1px solid #000");

							self.setShape(this.shape);							
						}
					
					}
				}
			});
		}
		//this.preview.draw();
	},
		
	/**
	 * This function is an goorm core initializating function.  
	 * @method setShape 
	 **/
	setShape: function(object) {
		var self = this;
		
		if (object.properties != null) {
			$.each(object.properties, function (key, state) {
				if (key == "font_size") {
					$(self.target).find(".canvas").find(".shapes").find("#"+"stencil_" + object.timestamp).find("."+key).css("font-size", state);
				}
				else if (key == "font_color") {
					$(self.target).find(".canvas").find(".shapes").find("#"+"stencil_" + object.timestamp).find("."+key).css("color", state);
				}
				else if (key == "font_style") {
					$(self.target).find(".canvas").find(".shapes").find("#"+"stencil_" + object.timestamp).find("."+key).css("font-style", state);
				}
				else if (key == "font_weight") {
					$(self.target).find(".canvas").find(".shapes").find("#"+"stencil_" + object.timestamp).find("."+key).css("font-weight", state);
				}				
				else if (key == "bg_color") {
					$(self.target).find(".canvas").find(".shapes").find("#"+"stencil_" + object.timestamp).find("."+key).css("background-color", state);
				}								
				else {
					$(self.target).find(".canvas").find(".shapes").find("#"+"stencil_" + object.timestamp).find("."+key).html(state);
				}
			});
		}
	}
	
	/**
	 * This function is an goorm core initializating function.  
	 * <br>This operates the initialization tasks for layout, actions, plugins...
	 * @method draw 
	 **/
/*	draw: function () {
		var self = this;
		

		
		
		//Canvas Element (Supported in HTML5)
		if($(this.target).find(".previewCanvas").find("canvas")[0].getContext) {
			//Get Context
			var context = $(this.target).find(".previewCanvas").find("canvas")[0].getContext('2d');

			//Clear the canvas
			context.clearRect (0, 0, $(this.target).find(".previewCanvas").find("canvas").width(), $(this.target).find(".previewCanvas").find("canvas").height());	
			
			//All objects
			$(this.parent.objects).each(function (i) {				
				//if the object is line type
				if($(this)[0].type == 'line') {
					
					var sx=0, sy=0, ex=0, ey=0;
					
					if ($(this)[0].properties.sx) {
						sx = parseInt($(this)[0].properties.sx);
						sx *= self.scale;
					}
					
					if ($(this)[0].properties.sy) {
						sy = parseInt($(this)[0].properties.sy);
						sy *= self.scale;
					}
	
					if ($(this)[0].properties.ex) {
						ex = parseInt($(this)[0].properties.ex);
						ex *= self.scale;
					}

					if ($(this)[0].properties.ey) {					
						ey = parseInt($(this)[0].properties.ey);
						ey *= self.scale;
					}
					

					
					//is hovered?
					if(self.parent.hoveredIndex == i) {
						context.beginPath();
						context.strokeStyle = "#FFFF00";
						
						context.moveTo(sx, sy);
						context.lineTo(ex, ey);
						context.lineWidth = parseFloat($(this)[0].properties.thickness)*self.scale+5;
						context.stroke();
					}
					
					
					//drawing the object
					context.beginPath();
					context.strokeStyle = "#000000";
					
					
					
					
					if (this.properties.dashed) {
						var dashArray=[5, 4];
						var dashCount = dashArray.length;
						
						var dx, dy;
						
						var dashIndex=0, draw=true;
						
						var x, y;
						
						if (ex < sx) {
							x = ex;
							y = ey;
						}
						else {
							x = sx;
							y = sy;
						}
						
						dx = (ex-sx);
						dy = (ey-sy);
						context.moveTo(x, y);
						context.lineWidth = parseFloat($(this)[0].properties.thickness);
						
						var slope = dy/dx;
						var distRemaining = Math.sqrt( dx*dx + dy*dy );
						
						while (distRemaining>=0.1){
							var dashLength = dashArray[dashIndex++%dashCount];
							
							if (dashLength > distRemaining) 
								dashLength = distRemaining;
								
						  	var xStep = Math.sqrt( dashLength*dashLength / (1 + slope*slope) );
							
						  	x += xStep
						  	y += slope*xStep;
							
						  	context[draw ? 'lineTo' : 'moveTo'](x,y);
						
						  	distRemaining -= dashLength;
						  	draw = !draw;
						}
						
						context.stroke();
					}
					else {	
						context.moveTo(sx, sy);
						context.lineTo(ex, ey);
						context.lineWidth = parseFloat($(this)[0].properties.thickness)*self.scale+0.5;
						context.stroke();
					}
					
					if (this.shape) {
											
						if (this.shape.rotate) {
							this.shape.rotate(this.properties.sx, this.properties.sy, this.properties.ex, this.properties.ey);
						}
					
					}					
				}
				else if($(this)[0].type == 'square') { //if the object is line type
					var sx=0, sy=0, ex=0, ey=0;
					
					if ($(this)[0].properties.sx) {
						sx = parseInt($(this)[0].properties.sx);
						sx *= self.scale;
					}
					
					if ($(this)[0].properties.sy) {
						sy = parseInt($(this)[0].properties.sy);	
						sy *= self.scale;
					}
	
					if ($(this)[0].properties.ex) {
						ex = parseInt($(this)[0].properties.ex);
						ex *= self.scale;
					}

					if ($(this)[0].properties.ey) {					
						ey = parseInt($(this)[0].properties.ey);
						ey *= self.scale;
					}
					
					//is hovered?
					if(self.parent.hoveredIndex == i) {
						context.beginPath();
						context.strokeStyle = "#FFFF00";
						
						context.rect(sx, sy, ex-sx, ey-sy);
						context.lineWidth = 5;
						context.closePath();
						
						context.stroke();
						
						context.beginPath();
						context.strokeStyle = "#000000";
						context.fillStyle = "#FFFFFF";
						
						context.rect(sx, sy, ex-sx, ey-sy);
						context.lineWidth = 0.5;
						context.closePath();
						
						context.stroke();
					}
										
					//drawing the object
					
					context.beginPath();
					context.strokeStyle = "#000000";
					context.fillStyle = "#FFFFFF";
					
					context.rect(sx, sy, ex-sx, ey-sy);
					context.lineWidth = 0.5;
					context.closePath();
					
					context.stroke();
					context.fill();
										
					if (this.shape) {
											
						if (this.shape.move) {
							this.shape.move(this.properties.sx, this.properties.sy, this.properties.ex, this.properties.ey);
							this.shape.setShape();
						}
					
					}
				}
			});
		}
	}
*/

};
