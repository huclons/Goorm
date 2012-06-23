/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module dialog
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class alert
 * @extends dialog
 **/
org.goorm.core.dialog.alert = function () {
	/**
	 * This presents the current browser version
	 * @property panel
	 **/
	this.panel = null;
	
	/**
	 * This presents the current browser version
	 * @property contextMenu
	 **/
	this.contextMenu = null;
	
	/**
	 * This presents the current browser version
	 * @property path
	 **/
	this.path = null;
	
	/**
	 * This presents the current browser version
	 * @property title
	 **/
	this.title = null;
	
	/**
	 * This presents the current browser version
	 * @property message
	 **/
	this.message = null;

	/**
	 * This presents the current browser version
	 * @property imageURL
	 **/
	this.imageURL = null;

	
	/**
	 * This presents the current browser version
	 * @property type
	 **/
	this.type = null;
	
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
	 * @property width
	 **/
	this.width = null;
	
	/**
	 * This presents the current browser version
	 * @property height
	 **/
	this.height = null;
};

org.goorm.core.dialog.alert.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @Constructor 
	 * @param {String} option The option about contents to be set into the dialog.
	 **/
	init: function () {
		var self = this;

		this.title = "Alert";
		this.imageURL = "images/org.goorm.core.dialog/dialog_alert.png";
		
		this.title = this.title.split(" ").join("_");
		this.timestamp = new Date().getTime();
		
		var handleYes = function() { 
			this.hide();
		};

		if ($("#goormDialogContainer").find("#panelContainer_" + this.title)) {
			$("#goormDialogContainer").find("#panelContainer_" + this.title).remove();
		}
		
		$("#goormDialogContainer").append("<div id='panelContainer_" + this.title + "'></div>");
		
		this.panel = new YAHOO.widget.SimpleDialog(
			"panelContainer_" + this.title, { 
				width: '300px',
				height: '160px',
				visible: false, 
				underlay: "shadow",
				close: true,
				draggable: true,
				modal: true,
				text: "",
				constraintoviewport: true,
				fixedcenter: true,
				effect:{effect:YAHOO.widget.ContainerEffect.FADE,duration:0.2},
				buttons: [ 
					{ text:"OK", handler:handleYes, isDefault:true }
				] 
			} 
		);
		
		this.panel.setHeader(this.title.split("_").join(" "));
		this.panel.setBody("Loading Data...");
		this.panel.render();

		$("#panelContainer_" + this.title).find(".button-group").css("text-align", "center");
		
		//$(document).unbind('keydown', 'esc');
		$(document).bind('keydown', 'esc', function () {
			if (self.panel.cfg.config.visible.value && !core.keydown) {
				self.panel.hide();
			}
		});
		
		//$(document).unbind('keydown', 'return');
		$(document).bind('keydown', 'return', function (e) {
			if (self.buttons && self.panel.cfg.config.visible.value && !core.keydown) {
				$(self.buttons).each(function (i) {
					if (this.isDefault) {
						this.hide = function(){};
						this.handler();
						
						core.keydown = true;
					}
				});
			}
		});	
				
	},
	
	show: function (message) {
		this.message = message;
		
		$("#panelContainer_" + this.title).find(".bd").empty();
		$("#panelContainer_" + this.title).find(".bd").append(this.message);
		$("#panelContainer_" + this.title).find(".bd").prepend("<div class='alertImageDIV'><img src='"+this.imageURL+"'/></div>");
		$("#panelContainer_" + this.title).find(".bd").css("text-align", "left");
		
		this.panel.show();
	}
	
};