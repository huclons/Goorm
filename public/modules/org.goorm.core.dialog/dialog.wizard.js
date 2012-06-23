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
org.goorm.core.dialog.wizard = function () {

	/**
	 * This presents the current browser version
	 * @property panel
	 **/
	this.totalStep = null;

	/**
	 * This presents the current browser version
	 * @property panel
	 **/
	this.step = null;
	
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
	
	this.kind = null;
};

org.goorm.core.dialog.wizard.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 * @param {String} option The option about contents to be set into the dialog.
	 **/
	init: function (option) {
		var self = this;
		
		this.step = 1;
		
		this.title = option["title"];
		this.path = option["path"];		
		this.width = option["width"];
		this.height = option["height"];
		this.modal = option["modal"];
		
		// this.yesText = option["yesText"];
		// this.noText = option["noText"];	
		this.buttons = option["buttons"];
		// this.yes = option["yes"];
		// this.no = option["no"];
		
		this.success = option["success"];

	
		this.title = this.title.split(" ").join("_");
		this.kind = option["kind"];		

		
		if ($("#goormDialogContainer").find("#panelContainer_" + this.title)) {
			$("#goormDialogContainer").find("#panelContainer_" + this.title).remove();
		}
		
		$("#goormDialogContainer").append("<div id='panelContainer_" + this.title + "'></div>");
		
		var handleNext = function() { 
			console.log(self.totalStep);
			console.log(self.step);
			
			var stopNext = false;
			$("#goormDialogContainer").find("#panelContainer_" + self.title).find(".bd").find(".wizardStep").each(function (i){
				if(i==self.step-1) {
					$(this).find("input[checkField=yes]").each(function (i){
						if($(this).attr("value")=="") {
							stopNext = true;
						}
					});
				}
			});
			if (stopNext) {
				alert.show(core.localization.msg["alertDialogMissing"]);
				return false;
			}
			
			if (self.step < self.totalStep) {
				self.showPreviousButton(true);
			
				$("#goormDialogContainer").find("#panelContainer_" + self.title).find(".bd").find(".wizardStep[step='" + self.step + "']").css("display", "none");
			
				if ($("#goormDialogContainer").find("#panelContainer_" + self.title).find(".bd").find(".wizardStep[step='" + self.step + "']")) {
					self.step++;
					$("#goormDialogContainer").find("#panelContainer_" + self.title).find(".bd").find(".wizardStep[step='" + self.step + "']").css("display", "block");
					if (self.step == self.totalStep) {
						self.showNextButton(false);
					}	
				}
			}
		};
		
		var handlePrev = function() { 
			if (1 < self.step) {
				self.showNextButton(true);
				$("#goormDialogContainer").find("#panelContainer_" + self.title).find(".bd").find(".wizardStep[step='" + self.step + "']").css("display", "none");			
				self.step--;
				
				if (self.step == 1) {
					self.showPreviousButton(false);
				}
				
				$("#goormDialogContainer").find("#panelContainer_" + self.title).find(".bd").find(".wizardStep[step='" + self.step + "']").css("display", "block");		
			}
		};

		this.buttons.unshift({ text:"Next", handler:handleNext });
		this.buttons.unshift({ text:"Previous", handler:handlePrev });
		
		
		
		this.panel = new YAHOO.widget.Dialog(
			"panelContainer_" + this.title, { 
				width: self.width+'px',
				height: self.height+'px', 
				visible: false, 
				underlay: "shadow",
				close: true,
				autofillheight: "body",
				draggable: true,
				constraintoviewport: true,
				modal: self.modal,
				fixedcenter: true,
				effect:{effect:YAHOO.widget.ContainerEffect.FADE,duration:0.2},
				buttons:  this.buttons
			} 
		);
		
		this.panel.setHeader(this.title.split("_").join(" "));
		this.panel.setBody("Loading Data...");
		this.panel.render();
		
		
		//$(document).unbind('keydown', 'esc');
		$(document).bind('keydown', 'esc', function () {
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
					self.success();			


				core.dialogLoadingCount++;

				if (core.dialogLoadingCount == core.dialogCount) {
/*
					$(core).trigger("coreDialogLoaded");
*/
				}
			
				$(core).trigger("goormLoading");
			}
		});
		
		self.showPreviousButton(false);
		return this;
	},
	
	showPreviousButton: function(show) {
		var self = this;

		if (show) {
			self.panel._aButtons[0].set("disabled", false);
		}
		else {
			self.panel._aButtons[0].set("disabled", true);
		}
	},
	
	showNextButton: function(show) {
		var self = this;

		if (show) {
			self.panel._aButtons[1].set("disabled", false);
		}
		else {
			self.panel._aButtons[1].set("disabled", true);
		}
	},
	
	showFirstPage: function() {
		var self = this;
		self.step=1;
		$("#goormDialogContainer").find("#panelContainer_" + self.title).find(".bd").find(".wizardStep").each(function (i){
			$(this).css("display", "none");
			if(i==0) {
				$(this).css("display", "block");
			}
		});
		self.showPreviousButton(false);
		self.showNextButton(true);
	}
	
};