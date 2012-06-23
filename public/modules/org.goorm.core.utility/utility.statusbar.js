/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module utility
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class statusbar
 * @extends utility
 **/
org.goorm.core.utility.statusbar = function () {
	/**
	 * This presents the current browser version
	 * @property progressbar
	 * @type Object
	 * @default null
	 **/
	this.progressbar = null
};

org.goorm.core.utility.statusbar.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 **/
	init: function () {
		this.progressbar = new YAHOO.widget.ProgressBar({
			minValue: 0,
			maxValue: 100,
			value: 0,
			height: 15,
			width: 100
		}).render("goormProgressBar");
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method startLoading 
	 **/
	startLoading: function () {
		$("#goormStatusbarMessage").html("Loading...");
		$("#goormLoadingIndicator").html("<img src='images/org.goorm.core.utility/loading.gif' />");
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method stopLoading 
	 **/
	stopLoading: function () {
		$("#goormStatusbarMessage").html("");
		$("#goormLoadingIndicator").html("");
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method s
	 * @param {String} text The text.
	 * @param {String} from The source of the text.  
	 **/
	s: function (text, from) {
		var header = "Success";
		var color = "blue";
	
		$("#goormStatusbarMessage").prepend(this.makeMessage(header, color, text, from)); 
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method f
	 * @param {String} text The text.
	 * @param {String} from The source of the text.  
	 **/
	f: function (text, from) {
		var header = "Fail";
		var color = "#f66";
		
		$("#goormStatusbarMessage").prepend(this.makeMessage(header, color, text, from)); 
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method w
	 * @param {String} text The text.
	 * @param {String} from The source of the text.  
	 **/
	w: function (text, from) {
		var header = "Warning";
		var color = "orange";
		
		$("#goormStatusbarMessage").prepend(this.makeMessage(header, color, text, from)); 
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method er
	 * @param {String} text The text.
	 * @param {String} from The source of the text.  
	 **/
	er: function (text, from) {
		var header = "Error";
		var color = "red";
		
		$("#goormStatusbarMessage").prepend(this.makeMessage(header, color, text, from)); 
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method ev
	 * @param {String} text The text.
	 * @param {String} from The source of the text.  
	 **/
	ev: function (text, from) {
		var header = "Event";
		var color = "sky";
		
		$("#goormStatusbarMessage").prepend(this.makeMessage(header, color, text, from)); 
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method a
	 * @param {String} text The text.
	 * @param {String} from The source of the text.  
	 **/
	a: function (text, from) {
		var header = "Alarm";
		var color = "black";
		
		$("#goormStatusbarMessage").prepend(this.makeMessage(header, color, text, from)); 
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method makeMessage
	 * @param {String} header The header.
	 * @param {String} color The color.
	 * @param {String} text The text.
	 * @param {String} from The source of the text. 
	 **/
	makeMessage: function (header, color, text, from) {	
		var message = "<font color=" + color + ">";
		message += header + ": ";
		message += text;
		message += "</font>";
		message += "<font color='gray'>";
		message += " (from " + from + ")";
		message += "</font>";
		message += "<br>";
		
		return message;
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method clean 
	 **/
	clean: function () {
		$("#goormStatusbarMessage").html("");
	}
};