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
org.goorm.core.design.canvas.preview = function () {
	
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
	
	/**
	 * This presents the current browser version
	 * @property indicatorTopFake
	 **/
	this.indicatorTopFake = null;
};


org.goorm.core.design.canvas.preview.prototype = {
	init: function (target, width, height, scale, parent) {
		var self = this;

		//Set Properties
		self.target = target;
		self.realWidth = width;
		self.width = width*scale;
		self.realHeight = height;
		self.height = height*scale;
		self.scale = scale;
		self.parent = parent;
		self.isPreviewClicked = false;
		
		self.indicatorTopFake = 30;
				
		this.panel = new YAHOO.widget.Panel(
			target, { 
				visible: true, 
				underlay: "none",
				close: false,
				autofillheight: "body",
				draggable: true,
				constraintoviewport: true
			} 
		);	
		
		//////////////////////////////////////////////////////////////////////////////////////////
		// Window setting
		//////////////////////////////////////////////////////////////////////////////////////////	
		
		this.panel.setHeader("<div style='overflow:auto' class='titlebar'><div style='float:left; font-size:9px;'>Preview</div><div style='float:right;'><img src='images/icons/context/closebutton.png' class='closePreview windowButton' /></div></div>");
		this.panel.setBody("<div class='windowContainer'></div>");
		this.panel.render();
		
		$(target).parent().css("left", 30);
		$(target).parent().css("top", 70);
		
		$(target).find(".hd").mouseup(function () {
			self.left = parseInt($(self.target).parent().offset().left-$(self.target).parent().parent().offset().left);
			self.top = parseInt($(self.target).parent().offset().top-$(self.target).parent().parent().offset().top);
		});
		

		//adding html container
		$(target).find(".windowContainer").append("<div class='previewCanvasIndicator'></div>");
		$(target).find(".windowContainer").append("<div class='previewCanvas'></div>");
		$(target).find(".windowContainer").find(".previewCanvas").append("<canvas width='"+self.width+"' height='"+self.height+"'></canvas>");
		$(target).find(".windowContainer").find(".previewCanvas").append("<div class='previewEvent' style='width:"+self.width+"px; height:"+self.height+"px;'></div>");		
		
		$(self.target).find(".closePreview").click(function() {
			self.parent.toolbar.togglePreview();
		});

	},
	
	setSize: function (option, indicatorTopFake) {
		var self = this;
		
		if (option=="change") {
			self.realWidth = self.parent.width;
			self.width = self.parent.width*self.scale;
			self.realHeight = self.parent.height;
			self.height = self.parent.height*self.scale;
			
			if (!indicatorTopFake) {
				self.indicatorTopFake = 30;
			}
			else {
				self.indicatorTopFake = indicatorTopFake;
			}
			
			$(self.target).find(".windowContainer").find(".previewCanvas").find("canvas").attr("width", self.width);
			$(self.target).find(".windowContainer").find(".previewCanvas").find("canvas").attr("height", self.height);
			$(self.target).find(".windowContainer").find(".previewCanvas").find(".previewEvent").width(self.width);
			$(self.target).find(".windowContainer").find(".previewCanvas").find(".previewEvent").height(self.height);
		}
		
		// set windowContainer size
		$(self.target).find(".windowContainer").width(self.width);
		$(self.target).find(".windowContainer").height(self.height);
		
		// set indicator size
		if(($(self.target).parent().parent().find(".canvasContainer").width()-14) > self.realWidth) {
			self.indicatorWidth = $(self.target).find(".windowContainer").width()+3;
		}
		else {
			self.indicatorWidth = ($(self.target).parent().parent().find(".canvasContainer").width()-14)*self.scale;
		}
		self.indicatorHeight = ($(self.target).parent().parent().find(".canvasContainer").height()-14)*self.scale;
		$(self.target).find(".previewCanvasIndicator").width(self.indicatorWidth-5);
		$(self.target).find(".previewCanvasIndicator").height(self.indicatorHeight-5);
		
	},

	setup: function () {
		
		var self = this;
		
		self.left = parseInt($(self.target).parent().css("left"));
		self.top = parseInt($(self.target).parent().css("top"));
		
		self.indicatorTopFake = 30;
		
		// set scroll event
		$(self.parent.target).scroll(function () {

			var movedLeft = $(this).scrollLeft();
			var movedTop = $(this).scrollTop();
			
/*
			var zoomValue = self.parent.toolbar.zoomLevel/100;
			
			console.log(zoomValue);
			
			movedLeft = movedLeft/zoomValue;
			movedTop = movedTop/zoomValue;
*/
			
			var threshold = self.realHeight * self.scale - $(self.target).find(".previewCanvasIndicator").height();
			
			if ((movedLeft-45) * self.scale <= 0) {
				$(self.target).find(".previewCanvasIndicator").css("left", 0);
			}
			else if ( (movedLeft-45) * self.scale > self.width - self.indicatorWidth + 3) {
				$(self.target).find(".previewCanvasIndicator").css("left", "");
				$(self.target).find(".previewCanvasIndicator").css("right", 0);
			}
			else {
				$(self.target).find(".previewCanvasIndicator").css("left", ((movedLeft-45) * self.scale));
			}
			
			if ((movedTop-self.indicatorTopFake) * self.scale <= 0) {
				$(self.target).find(".previewCanvasIndicator").css("top", 0);
			}
			else if ( (movedTop-self.indicatorTopFake) * self.scale > self.height - self.indicatorHeight + 3) {
				$(self.target).find(".previewCanvasIndicator").css("top", "");
				$(self.target).find(".previewCanvasIndicator").css("bottom", 0);
			}
			else {
				$(self.target).find(".previewCanvasIndicator").css("top", ((movedTop-self.indicatorTopFake) * self.scale));
			}

		});
		
		
		// set previewEvent
		$(self.target).find(".previewEvent").mousedown(function (event) {
			self.isPreviewClicked=true;
		});
		
		$(self.target).find(".previewEvent").mouseup(function (event) {
			self.isPreviewClicked = false;
			var clickedX = event.pageX-$(this).offset().left;
			var clickedY = event.pageY-$(this).offset().top;
									
			self.moveScrollFromEvent(clickedX, clickedY);
		});
		
		$(self.target).find(".previewEvent").mousemove(function (event) {
			if(self.isPreviewClicked) {
				var clickedX = event.pageX-$(this).offset().left;
				var clickedY = event.pageY-$(this).offset().top;
				
				self.moveScrollFromEvent(clickedX, clickedY);
			}
		});
				
		$(self.target).find(".previewEvent").mouseout(function (event) {
			self.isPreviewClicked=false;
		});
	},
	
	moveScrollFromEvent: function (clickedX, clickedY) {
		var self = this;

		if ( clickedY < self.indicatorHeight/2 ) {
			$(self.target).parent().parent().find(".canvasContainer").scrollTop(self.indicatorTopFake);			
		}
		else if ( clickedY > self.height - self.indicatorHeight/2 ) {
			var totalHeight = $(self.target).parent().parent().find(".canvasContainer").find(".space").height();
			var currentWindowHeight = $(self.target).parent().parent().find(".canvasContainer").height()-14;

			$(self.target).parent().parent().find(".canvasContainer").scrollTop(totalHeight-currentWindowHeight-self.indicatorTopFake);
		}
		else {
			$(self.target).parent().parent().find(".canvasContainer").scrollTop((clickedY-(self.indicatorHeight/2))/self.scale+self.indicatorTopFake);			
		}
				
		if ((self.width-2) > $(self.target).find(".previewCanvasIndicator").width()) {
			if ( clickedX < self.indicatorWidth/2 ) {
				$(self.target).parent().parent().find(".canvasContainer").scrollLeft(18);			
			}
			else if ( clickedX > self.width - self.indicatorWidth/2 + 5 ) {				
				var totalWidth = $(self.target).parent().parent().find(".canvasContainer").find(".space").width();
				var currentWindowWidth = $(self.target).parent().parent().find(".canvasContainer").width()-14;
				
				$(self.target).parent().parent().find(".canvasContainer").scrollLeft(totalWidth-currentWindowWidth-18+14);
			}
			else {
				$(self.target).parent().parent().find(".canvasContainer").scrollLeft((clickedX-(self.indicatorWidth/2)+4)/self.scale);
			}
		}
		else {
			var totalWidth = $(self.target).parent().parent().find(".canvasContainer").find(".space").width();
			var currentWindowWidth = $(self.target).parent().parent().find(".canvasContainer").width()-14;
	
			$(self.target).parent().parent().find(".canvasContainer").scrollLeft((totalWidth-currentWindowWidth)/2);
		}
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * <br>This operates the initialization tasks for layout, actions, plugins...
	 * @method draw 
	 **/
	draw: function () {
		//console.log("draw");
		var self = this;
		
		
/*
		this.selectedIndex = $.unique(this.selectedIndex);
*/
		
		
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
};
