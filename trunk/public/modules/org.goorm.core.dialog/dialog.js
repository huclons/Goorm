/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module dialog
 **/

/**
 * This is an goorm dialog.  
 * @class dialog
 **/
org.goorm.core.dialog = function () {
	/**
	 * This presents the current browser version
	 * @property panel
	 **/
	this.panel = null;
	
	/**
	 * This presents the current browser version
	 * @property panel
	 **/
	this.containerID = null;
	
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
	 * @property yes
	 **/	
	this.yes = null;
	
	/**
	 * This presents the current browser version
	 * @property no
	 **/
	this.no = null;
	
	/**
	 * The array object that contains the information about buttons on the bottom of a dialog 
	 * @property buttons
	 * @type Object
	 * @default null
	 **/
	this.buttons = null;
	
	/**
	 * This presents the current browser version
	 * @property success
	 **/
	this.success = null;
	
	/**
	 * This presents the current browser version
	 * @property zIndex
	 **/
	this.zindex = null;
	
	/**
	 * This presents the current browser version
	 * @property modal
	 **/
	this.modal = null;		
};

org.goorm.core.dialog.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 * @param {String} option The option about contents to be set into the dialog.
	 **/
	init: function (option, appendded) {
		var self = this;

		this.title = option["title"];
		this.path = option["path"];		
		this.width = option["width"];
		this.height = option["height"];
		this.modal = option["modal"];
		this.zindex = parseInt(option["zindex"]);
		
		// this.yesText = option["yesText"];
		// this.noText = option["noText"];	
		this.buttons = option["buttons"];
		// this.yes = option["yes"];
		// this.no = option["no"];
		
		this.success = option["success"];
		
		this.title = this.title.split(" ").join("_");
		this.timestamp = new Date().getTime();
		
		
		if (appendded == undefined) {
			appendded = false;
		}
		
		
		if ($("#goormDialogContainer").find("#panelContainer_" + this.title)) {
			$("#goormDialogContainer").find("#panelContainer_" + this.title).remove();
		}
		
		
		this.containerID = "panelContainer_" + this.title + "_" + this.timestamp;
		
		
		
		$("#goormDialogContainer").append("<div id='" + this.containerID + "'></div>");
		
		this.panel = new YAHOO.widget.Dialog(
			this.containerID, { 
				width: self.width+'px',
				height: self.height+'px', 
				visible: false, 
				underlay: "shadow",
				close: true,
				autofillheight: "body",
				draggable: true,
				constraintoviewport: true,
				modal: false,
				zindex: self.zindex,
				fixedcenter: true,
				effect:{effect:YAHOO.widget.ContainerEffect.FADE,duration:0.2},
				buttons:  this.buttons
					// [ { text:self.yesText, handler:handleYes, isDefault:true },
					// { text:self.noText,  handler:handleNo }] 
				 
			} 
		);

		this.panel.setHeader(this.title.split("_").join(" "));
		this.panel.setBody("Loading Data...");
		this.panel.render();
		

		//$(document).unbind('keydown', 'esc');
		$(document).bind('keydown', 'esc', function () {
			//console.log(confirmation);
			if (confirmation.panel == undefined) {
				confirmation.panel = {};
				confirmation.panel.cfg = {};
				confirmation.panel.cfg.config = {};
				confirmation.panel.cfg.config.visible = {};
				confirmation.panel.cfg.config.visible.value = false;
			}
			
			if (self.buttons && self.panel.cfg.config.visible.value && !core.keydown && !alert.panel.cfg.config.visible.value && !notice.panel.cfg.config.visible.value && !confirmation.panel.cfg.config.visible.value) {
				$(self.buttons).each(function (i) { 
					if (this.text == "Cancel") {
						this.hide = function(){};
						this.handler();
						
						core.keydown = true;
				
						self.panel.hide();
					}
				});
			}
		});
		
		//$(document).unbind('keydown', 'return');
		$(document).bind('keydown', 'return', function (e) {
			if (confirmation.panel == undefined) {
				confirmation.panel = {};
				confirmation.panel.cfg = {};
				confirmation.panel.cfg.config = {};
				confirmation.panel.cfg.config.visible = {};
				confirmation.panel.cfg.config.visible.value = false;
			}
		
			if (self.buttons && self.panel.cfg.config.visible.value && !core.keydown && !alert.panel.cfg.config.visible.value && !notice.panel.cfg.config.visible.value && !confirmation.panel.cfg.config.visible.value) {
				$(self.buttons).each(function (i) {
					if (this.isDefault) {
						this.hide = function(){};
						this.handler();
						
						core.keydown = true;
					}
				});
			}
		});		
		
		

		
		var url = "file/get_contents";	
		
		$.ajax({
			url: url,			
			type: "GET",
			data: "path="+self.path,
			success: function(data) {

				self.panel.setBody(data);
				
				if ( typeof self.success == "function" )
					//self.success();			
				
				if (!appendded) {
					
					core.dialogLoadingCount++;
					
					if (core.dialogLoadingCount == core.dialogCount) {
	/*
						$(core).trigger("coreDialogLoaded");
	*/
					}
	
					$(core).trigger("goormLoading");
				}
			}
		});
		
		
		return this;
	}
	
};