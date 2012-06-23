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
 * @class design
 **/
org.goorm.core.design.canvas.toolbar = function () {
	/**
	 * This presents the current browser version
	 * @property canvas
	 **/
	this.canvas = null;

	/**
	 * This presents the current browser version
	 * @property target
	 **/
	this.target = null; 
	
	/**
	 * This presents the current browser version
	 * @property isCollaborationON
	 **/
	this.isCollaborationON = false; 
	
	/**
	 * This presents the current browser version
	 * @property isPreviewOn
	 **/
	this.isPreviewOn = true;
	
	/**
	 * This presents the current browser version
	 * @property isPreviewOn
	 **/
	this.isRulerOn = true; 	
	
	/**
	 * This presents the current browser version
	 * @property isGridOn
	 **/
	this.isGridOn = true; 	

	/**
	 * This presents the current browser version
	 * @property zoomLevel
	 **/
	this.zoomLevel = 100;
};

org.goorm.core.design.canvas.toolbar.prototype = {
	init: function(canvas) {
		var self = this;
		
		this.canvas = canvas;
		this.target = canvas.target;
		
		$(this.target).parent().prepend("<div class='designToolbarContainer'></div>");
		$(this.target).parent().append("<div class='designPreviewContainer'></div>");
		//$(this.target).append("<div class='designStatusContainer'></div>");
		
		$(this.target).parent().find(".designToolbarContainer").append("<img src='images/org.goorm.core.design/grid.png' action='gridOnOff' class='toolbarButton toolbarButtonPressed' border='0' />"); 
		$(this.target).parent().find(".designToolbarContainer").append("<img src='images/org.goorm.core.design/grid-snap.png' action='snapToGrid' class='toolbarButton' border='0' />"); 
		$(this.target).parent().find(".designToolbarContainer").append("<img src='images/org.goorm.core.design/resize.png' action='resize' class='toolbarButton' border='0' />"); 
		$(this.target).parent().find(".designToolbarContainer").append("<img src='images/org.goorm.core.design/printer.png' class='toolbarButton' border='0' />"); 
		$(this.target).parent().find(".designToolbarContainer").append("<img src='images/org.goorm.core.design/ruler_onoff.png' action='rulerOnOff' class='toolbarButton toolbarButtonPressed' border='0' />"); 
		$(this.target).parent().find(".designToolbarContainer").append("<img src='images/org.goorm.core.design/share.png' action='collaborationOnOff' class='toolbarButton' border='0' />");
		$(this.target).parent().find(".designToolbarContainer").append("<img src='images/org.goorm.core.design/preview.png' action='previewOnOff' class='toolbarButton toolbarButtonPressed' border='0' />"); 
		$(this.target).parent().find(".designToolbarContainer").append("<img src='images/org.goorm.core.design/zoom-fit.png' action='zoomFit' class='toolbarButton' border='0' />"); 
		$(this.target).parent().find(".designToolbarContainer").append("<img src='images/org.goorm.core.design/zoom-in.png' action='zoomIn' class='toolbarButton' border='0' />"); 
		$(this.target).parent().find(".designToolbarContainer").append("<img src='images/org.goorm.core.design/zoom-out.png' action='zoomOut' class='toolbarButton' border='0' />"); 
		
		$(this.target).parent().find(".designToolbarContainer").append("<div style='float:right; width:150px; text-align:right; padding-top:2px;'><select class='zoomLevelSelector'><option value='25'>25%</option><option value='50'>50%</option><option value='75'>75%</option><option value='100' selected=true>100%</option><option value='150'>150%</option><option value='200'>200%</option><option value='400'>400%</option><option value='800'>800%</option><option value='1600'>1600%</option></select></div>"); 
		
		$(this.target).parent().find(".zoomLevelSelector").change(function () {
			self.zoom($(this).val());
		});		

		$(this.target).parent().find(".designToolbarContainer").find("img[action='gridOnOff']").click(function () {
			self.toggleGrid();
		});

		$(this.target).parent().find(".designToolbarContainer").find("img[action='snapToGrid']").click(function () {
			self.toggleSnapToGrid();
		});
		
		$(this.target).parent().find(".designToolbarContainer").find("img[action='resize']").click(function () {			
			self.canvas.dialog.panel.show();
		});
		
//		$(this.target).find(".designToolbarContainer").find("img[action='collaborationOnOff']").click(function () {
//			if (self.isCollaborationON) {
//				self.isCollaborationON = false;
//				
//				//TO-DO: Change to event-based
//				self.canvas.setCollaborationOff();
//				$(self.target).find(".designToolbarContainer").find("img[action='collaborationOnOff']").removeClass("toolbarButtonPressed");
//			}
//			else {
//				self.isCollaborationON = true;
//				self.canvas.setCollaborationOn();
//				$(self.target).find(".designToolbarContainer").find("img[action='collaborationOnOff']").addClass("toolbarButtonPressed");
//			}
//		});
		
		$(this.target).parent().find(".designToolbarContainer").find("img[action='previewOnOff']").click(function () {
			self.togglePreview();
		});
		
		$(this.target).parent().find(".designToolbarContainer").find("img[action='rulerOnOff']").click(function () {
			self.toggleRuler();
		});
		
		$(this.target).parent().find(".designToolbarContainer").find("img[action='zoomFit']").click(function () {
			self.zoomFit();
		});
		
		$(this.target).parent().find(".designToolbarContainer").find("img[action='zoomIn']").click(function () {
			self.zoomIn();
		});
		
		$(this.target).parent().find(".designToolbarContainer").find("img[action='zoomOut']").click(function () {
			self.zoomOut();
		});
		
		
		//$(this.target).find(".designStatusContainer").append("<img src='images/org.goorm.core.design/line.png' class='lineDrawing toolbarButton' border='0' />");
		//$(this.target).find(".designStatusContainer").append("<img src='images/org.goorm.core.design/shape.png' class='squareDrawing toolbarButton' border='0' />"); 
		
	},
	
	zoom: function(value) {
		if (0< value && value < 1600) {
			this.zoomLevel = value;
		}
		
		$(this.target).find(".space").css("zoom", this.zoomLevel + "%");	
		$(this.target).find(".skin").css("zoom", this.zoomLevel + "%");	
		$(this.target).find(".canvas").css("zoom", this.zoomLevel + "%");	
	},
	
	zoomFit: function() {
		this.zoomLevel = 100;
		
		$(this.target).find(".space").css("zoom", "100%");	
		$(this.target).find(".skin").css("zoom", "100%");	
		$(this.target).find(".canvas").css("zoom", "100%");	
	},
	
	zoomIn: function() {
		if (this.zoomLevel < 1600) {
			this.zoomLevel += 10;
		}
		
		$(this.target).find(".space").css("zoom", this.zoomLevel + "%");	
		$(this.target).find(".skin").css("zoom", this.zoomLevel + "%");	
		$(this.target).find(".canvas").css("zoom", this.zoomLevel + "%");	
	},	

	zoomOut: function() {
		if (this.zoomLevel >= 20) {
			this.zoomLevel -= 10;
		}
		
		$(this.target).find(".space").css("zoom", this.zoomLevel + "%");	
		$(this.target).find(".skin").css("zoom", this.zoomLevel + "%");	
		$(this.target).find(".canvas").css("zoom", this.zoomLevel + "%");	
	},		
	
	togglePreview: function() {
		var self = this;
		if (self.isPreviewOn) {
			self.isPreviewOn = false;
			$(self.target).parent().find(".designToolbarContainer").find("img[action='previewOnOff']").removeClass("toolbarButtonPressed");
			$(self.target).parent().find(".designPreviewContainer").hide();
		}
		else {
			self.isPreviewOn = true;
			$(self.target).parent().find(".designToolbarContainer").find("img[action='previewOnOff']").addClass("toolbarButtonPressed");
			$(self.target).parent().find(".designPreviewContainer").show();
		}
	},
	
	toggleRuler: function() {
		var self = this;
		if (self.isRulerOn) {
			self.isRulerOn = false;
			$(self.target).parent().find(".designToolbarContainer").find("img[action='rulerOnOff']").removeClass("toolbarButtonPressed");
			self.canvas.parent.ruler.show(false);
		}
		else {
			self.isRulerOn = true;
			$(self.target).parent().find(".designToolbarContainer").find("img[action='rulerOnOff']").addClass("toolbarButtonPressed");
			self.canvas.parent.ruler.show(true);
		}
		
		console.log("3");
		self.canvas.parent.resizeAll();
	},
	
	toggleSnapToGrid: function() {
		var self = this;
		console.log("toggleSnapToGrid");
		if (self.canvas.snapToGrid) {
			console.log("set false");
			self.canvas.snapToGrid = false;
			$(self.target).parent().find(".designToolbarContainer").find("img[action='snapToGrid']").removeClass("toolbarButtonPressed");
		}
		else {
			console.log("set true");
			self.canvas.snapToGrid = true;
			$(self.target).parent().find(".designToolbarContainer").find("img[action='snapToGrid']").addClass("toolbarButtonPressed");
		}
	},
	
	toggleGrid: function() {
		var self = this;
		if (self.isGridOn) {
			self.isGridOn = false;
			$(self.target).find(".grid").css("display", "none");
			$(self.target).find(".designToolbarContainer").find("img[action='gridOnOff']").removeClass("toolbarButtonPressed");
		}
		else {
			self.isGridOn = true;
			$(self.target).find(".grid").css("display", "block");
			$(self.target).find(".designToolbarContainer").find("img[action='gridOnOff']").addClass("toolbarButtonPressed");
		}
	},
	
	changeGridUnit: function(size) {
		var self = this;
		$(self.target).find(".grid").css("background-image","url(images/org.goorm.core.design/grid_"+size+"px.png)");
	},
	
	changeGridOpacity: function(opacity) {
		var self = this;
		$(self.target).find(".grid").css("-moz-opacity",opacity);
		$(self.target).find(".grid").css("filter","alpha(opacity="+(opacity*100)+")");
		$(self.target).find(".grid").css("opacity",opacity);
	},
	
	changeRulerUnit: function(unit) {
		var self = this;
		$(self.target).parent().find(".ruler_x").css("background-image","url(images/org.goorm.core.design/ruler_"+unit+"_x.png)");
		$(self.target).parent().find(".ruler_y").css("background-image","url(images/org.goorm.core.design/ruler_"+unit+"_y.png)");
	}
};