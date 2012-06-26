/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.console.message = function () {

};

org.goorm.core.console.message.prototype = {

	m: function (text, from) {
		var header = "[MSG] ";
		var color = "black";
	
		$("#console").prepend(this.make_message(header, color, text, from)); 
	},

	make_message: function (header, color, text, from) {	
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

	clean: function () {
		$("#console").html("");
	}
};