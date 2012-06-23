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
 * @class contents
 * @extends help
 **/
org.goorm.core.help.contents = function () {
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

org.goorm.core.help.contents.prototype = {
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 **/
	
	init: function () {
		var self = this;
		
		var handleOk = function() { 
			
			this.hide(); 
		};

		var handleCancel = function() { 
			
			this.hide(); 
		};
		
		this.buttons = [ {text:"OK", handler:handleOk, isDefault:true},
						 {text:"Cancel",  handler:handleCancel}]; 
						 
		this.dialog = new org.goorm.core.help.contents.dialog();
		this.dialog.init({
			title:"Help Contents", 
			path:"configs/dialogs/org.goorm.core.help/help.contents.html",
			width:900,
			height:600,
			modal:true,
			yesText: "OK",
			noText: "Close",
			buttons:this.buttons,
			success: function () {
				//TabView Init
				//self.tabView = new YAHOO.widget.TabView('helpContentsContents');
				
				//TreeView Init
				// var treeviewUrl = "help/help.treeview";	
// 				
				// $.ajax({
					// url: treeviewUrl,			
					// type: "POST",
					// data: "path="+self.path,
					// success: function(data) {
						//var sortingData = eval(data);
						var resize = new YAHOO.util.Resize("helpContentsLeft", {
				            handles: ['r'],
				            minWidth: 150,
				            maxWidth: 350
				        });
						
						resize.on('resize', function(ev) {
				            var w = ev.width;
				            $("#helpContentsMiddle").css('width', (900 - w - 30) + 'px');
				        });
				        
						self.treeView = new YAHOO.widget.TreeView("helpContentsTreeview");
						self.treeView.render();
								
						
						
						//$(".yui-content").append(sortingData[i].url.text());
						
								
					// }
				// });
				
			}			
		
		});
				

		
		
		
		
		
		this.dialog = this.dialog.dialog;
		
		
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method show 
	 **/
	show: function () {
		this.dialog.panel.show();
		
		
		
		
		// this.treeView.subscribe("clickEvent", function(nodedata) {	
// 
			// var contentsUrl = nodedata.node.data.url;
// 						
// 			
// 					
			// $.ajax({
				// url: contentsUrl,			
				// type: "POST",
				// data: "path="+self.path,
				// success: function(data) {
					// $("#helpContents").empty();
					// $("#helpContents").append(data);	
// 							
				// }
			// });
// 				
// 			
// 			
			// //alert.show(label);
// 
			// /*if(nodedata.node.data.cls == "file") {
				// var filename = nodedata.node.data.filename;
				// var filetype = nodedata.node.data.filetype;
				// var filepath = nodedata.node.data.parentLabel;
// 				
				// self.windowManager.open(filepath, filename, filetype);
			// }*/
		// });
// 		
		
		
	}
	
	
};
