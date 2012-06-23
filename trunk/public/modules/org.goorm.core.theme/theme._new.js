/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module preference
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class preference
 **/
org.goorm.core.theme._new = function () {
	/**
	 * This presents the current browser version
	 * @property dialog
	 * @type Object
	 * @default null
	 **/
	this.dialog = null;
	this.buttons = null;
	this.parent = null;
};

org.goorm.core.theme._new.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor
	 **/
	init: function (parent) {
		var self = this;
		
		this.parent = parent;
		
		var handleOk = function() {
			(self.parent.buttonThemeSelector).getMenu().subscribe("render", self.parent.buttonThemeMenuRender, $("#newThemeName").attr("value"));
			(self.parent.buttonThemeSelector).getMenu().subscribe("click", self.parent.buttonThemeSelectorFunction);	
			
			var url = "module/org.goorm.core.theme/theme.save.php";
			var data = "";
			var path = "configs/themes/"+$("#newThemeName").attr("value");
			var fileName = $("#newThemeName").attr("value");

			$.ajax({
				url: url,			
				type: "POST",
				data: { path: path, fileName: fileName ,data: data, kind: "new" },
				success: function(e) {
					m.s("Create new theme successfully");
				}
			});
						
			this.hide(); 
		};


		var handleCancel = function() { 
			this.hide(); 
		};
		
		this.buttons = [ {text:"OK", handler:handleOk, isDefault:true},
						 {text:"Cancel",  handler:handleCancel}];
						 
		this.dialog = new org.goorm.core.theme._new.dialog();
		this.dialog.init({
			title:"Preference", 
			path:"configs/preferences/org.goorm.core.theme/theme._new.html",
			width:220,
			height:120,
			modal:true,
			buttons:this.buttons,
			success: function () {

			}
		});
		
		this.dialog = this.dialog.dialog;
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method show 
	 **/
	show: function () {
		var self=this;

		this.dialog.panel.show();
	},
	
};