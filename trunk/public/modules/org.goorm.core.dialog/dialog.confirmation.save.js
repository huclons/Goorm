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
 * @class confirmation
 * @extends dialog
 **/
org.goorm.core.dialog.confirmation.save = function () {
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
	
	/**
	 * This presents the current browser version
	 * @property yesText
	 **/
	this.yesText = null;
	
	/**
	 * This presents the current browser version
	 * @property noText
	 **/
	this.noText = null;
	
	/**
	 * This presents the current browser version
	 * @property yes
	 **/
	this.yes = null;
	
	/**
	 * This presents the current browser version
	 * @property no
	 **/
	this.no = null;
};

org.goorm.core.dialog.confirmation.save.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @Constructor 
	 * @param {String} option The option about contents to be set into the dialog.
	 **/
	init: function (option) {
		var self = this;

		this.title = option["title"];
		this.message = option["message"];
		
		this.yesText = option["yesText"];
		this.cancelText = option["cancelText"];
		this.noText = option["noText"];
		
		this.yes = option["yes"];
		this.cancel = option["cancel"];
		this.no = option["no"];
		
		
		this.title = this.title.split(" ").join("_");
		this.timestamp = new Date().getTime();
		
		var handleYes = function() { 
			if ( typeof self.yes == "function" )
				self.yes();
			this.hide(); 
		};
		
		var handleCancel = function() {
			if ( typeof self.cancel == "function" )
				self.cancel();
			this.hide(); 
		}
		
		var handleNo = function() { 
			if ( typeof self.no == "function" )
				self.no();
			this.hide(); 
		};
		
		if ($("#goormDialogContainer").find("#panelContainer_" + this.title)) {
			$("#goormDialogContainer").find("#panelContainer_" + this.title).remove();
		}
		
		$("#goormDialogContainer").append("<div id='panelContainer_" + this.title + "'></div>");
		
		this.panel = new YAHOO.widget.SimpleDialog(
			"panelContainer_" + this.title, { 
				width: '400px',
				visible: false, 
				underlay: "shadow",
				close: true,
				draggable: true,
				text: this.message,
				constraintoviewport: true,
				fixedcenter: true,
				effect:{effect:YAHOO.widget.ContainerEffect.FADE,duration:0.2},
				buttons: [ 
					{ text:self.yesText, handler:handleYes, isDefault:true },
					{ text:self.cancelText,  handler:handleCancel },
					{ text:self.noText,  handler:handleNo }
				] 
			} 
		);
		
		this.panel.setHeader(this.title.split("_").join(" "));
		this.panel.setBody("Loading Data...");
		this.panel.render();
		
		//$(document).unbind('keydown', 'esc');
		$(document).bind('keydown', 'esc', function () {
			if (self.panel.cfg.config.visible.value && !core.keydown) {
				self.panel.hide();
			}
		});
		
		//$(document).unbind('keydown', 'return');
		$(document).bind('keydown', 'return', function (e) {
			if (self.panel.cfg.config.visible.value && !core.keydown && !alert.panel.cfg.config.visible.value && !notice.panel.cfg.config.visible.value) {
				handleYes();
						
				core.keydown = true;
			}
		});	
	}
	
};