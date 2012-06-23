/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module project
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class _new
 * @extends layout
 **/
org.goorm.core.layout.startpage = function () {
	/**
	 * This presents the current browser version
	 * @property pushbutton
	 * @type Object
	 * @default null
	 **/
	this.pushbutton = null;
};

org.goorm.core.layout.startpage.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 **/
	init: function (target) {
		var self = this;
		
		this.pushbutton = $.makeArray();
		 
		$("#" + target).append("<div id='startpageContainer'>abcde</div>");
		
		var url = "file/get_contents";
			
		$.ajax({
			url: url,			
			type: "GET",
			data: "path=../../config/startpage.html",
			success: function(data) {
				
				$("#startpageContainer").html(data);
				
				self.pushbutton = new YAHOO.widget.Button($("#startpageContainer").find("#closeButton").get(0));
				
				$("#startpageContainer").find("#closeButton").click(function () {
					$("#startpageContainer").hide();
				});
			}
		});
	}
};