/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module console
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class message
 **/
org.goorm.core.console.message = function () {

};

org.goorm.core.console.message.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * This operates the initialization tasks for layout, actions, plugins...
	 * First written: Sung-tae Ryu 
	 * Latest modified: Sung-tae Ryu 
	 * @method m() 
	 * @return void
	 **/
	m: function (text, from) {
		var header = "[MSG] ";
		var color = "black";
	
		$("#console").prepend(this.makeMessage(header, color, text, from)); 
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * This operates the initialization tasks for layout, actions, plugins...
	 * First written: Sung-tae Ryu 
	 * Latest modified: Sung-tae Ryu 
	 * @method makeMessage() 
	 * @return void
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
	 * This operates the initialization tasks for layout, actions, plugins...
	 * First written: Sung-tae Ryu 
	 * Latest modified: Sung-tae Ryu 
	 * @method clean() 
	 * @return void
	 **/
	clean: function () {
		$("#console").html("");
	}
};