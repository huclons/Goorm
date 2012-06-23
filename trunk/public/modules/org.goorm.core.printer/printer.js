/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module help
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class about
 * @extends help
 **/
org.goorm.core.printer = function () {
	/**
	 * This presents the current browser version
	 * @property dialog
	 **/
	this.dialog = null;
	
	/**
	 * The array object that contains the information about buttons on the bottom of a dialog 
	 * @property buttons
	 * @type Object
	 * @default null
	 **/
	this.buttons = null;
	
	/**
	 * This presents the current browser version
	 * @property tabView
	 **/
	this.tabView = null;
	
	/**
	 * This presents the current browser version
	 * @property treeView
	 **/
	this.treeView = null;
};

org.goorm.core.printer.prototype = {
	/**
	 * This function is an goorm core initializating function.  
	 * @method init 
	 **/
	
	init: function () {
		var self = this;
		
		var handlePrint = function() { 
			var printWindow = window.open("", "", "width=1000, height=700, scrollbars=yes");
			printWindow.document.write("<div id='printContents'></div>");
			self.setContents(printWindow);
			printWindow.focus();
			
			this.hide(); 
		};

		var handleCancel = function() { 
			
			this.hide(); 
		};		
		
		this.buttons = [
						{text:"Print", handler:handlePrint, isDefault:true},
						{text:"Cancel", handler:handleCancel}
						]; 
						 
		this.dialog = new org.goorm.core.printer.dialog();
		this.dialog.init({
			title:"Print", 
			path:"configs/dialogs/org.goorm.core.printer/printer.html",
			width:620,
			height:450,
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
		this.setPreviewContents($("#printPreview"));
		//$(document).find("#printPreview").html($(document).find(".activated").parent().find(".CodeMirror-lines").html());
		this.dialog.panel.show();
		
	},
	
	setContents: function (target) {
		var windowManager = core.mainLayout.workSpace.windowManager;
		
		if (windowManager.window[windowManager.activeWindow].editor) {
			/*
			var ContentsText = $(opener.document).find(".activated").parent().find(".CodeMirror-lines").html();
		  
			if(ContentsText != "") {
				document.body.innerHTML = ContentsText;
				window.print();
			}
			else {
			}
			*/
		}
		else if (windowManager.window[windowManager.activeWindow].designer) {
			var designPrint = new org.goorm.core.printer.design();
			
			//$(target).find("#printContents").html("fuck");
						
			designPrint.init($(target.document).find("#printContents"), windowManager.window[windowManager.activeWindow].designer.canvas.width, windowManager.window[windowManager.activeWindow].designer.canvas.height, 1, windowManager.window[windowManager.activeWindow].designer.canvas);
			designPrint.draw();
			target.print();
		}
	},
	
	setPreviewContents: function (target) {
		var windowManager = core.mainLayout.workSpace.windowManager;
		
		if (windowManager.window[windowManager.activeWindow].editor) {
			/*
			var ContentsText = $(opener.document).find(".activated").parent().find(".CodeMirror-lines").html();
		  
			if(ContentsText != "") {
				document.body.innerHTML = ContentsText;
				window.print();
			}
			else {
			}
			*/
		}
		else if (windowManager.window[windowManager.activeWindow].designer) {
			var designPrint = new org.goorm.core.printer.designPreview();
									
			designPrint.init($(target).find("#printContents"), windowManager.window[windowManager.activeWindow].designer.canvas.width, windowManager.window[windowManager.activeWindow].designer.canvas.height, 150/windowManager.window[windowManager.activeWindow].designer.canvas.width, windowManager.window[windowManager.activeWindow].designer.canvas);
			designPrint.draw();
		}
	}
};
