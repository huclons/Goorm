/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module debug
 **/

/**
 * This is an goorm code generator.  
 * <br>goorm starts with this code generator.
 * @class message
 * @extends debug
 **/
org.goorm.core.debug.message = function () {

};

org.goorm.core.debug.message.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * <br>This operates the initialization tasks for layout, actions, plugins...
	 * @method m
	 * @param {String} text The text
	 * @param {String} from The source of the text 
	 **/
	m: function (color, text, from, lineNo, filename) {
		var self = this;
		
		var header = "[" + filename + ":" + lineNo +"] ";
	
		$("#debug").prepend(this.makeMessage(header, color, text, from, lineNo, filename)); 
		$("#debug").find("div:first").click(function() {
			var lineNo = $(this).attr("lineNo");
			var filename = $(this).attr("filename");
			
			if (lineNo != "" && filename != "") {
				self.highlight(lineNo, filename);			
			}
		});		
	},
	
	highlight: function (lineNo, filename) {
		var windowManager = core.mainLayout.workSpace.windowManager;

		for (var i=0; i<windowManager.index; i++) {
			if (windowManager.window[i].filename == filename) {
				windowManager.window[i].editor.editor.focus();
				windowManager.window[i].editor.editor.setCursor(parseInt(lineNo)-1, 0);
				break;
			}
		}
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * <br>This operates the initialization tasks for layout, actions, plugins...
	 * @method makeMessage 
	 * @param {String} header The header of a message.
	 * @param {String} color The color of font in the message.
	 * @param {String} text The contents of message.
	 * @param {String} from The source of the text.
	 **/
	makeMessage: function (header, color, text, from, lineNo, filename) {	
		var message = "<div class='debugTabLineSelection' lineNo='" + lineNo + "' filename='" + filename + "'><font color=" + color + ">";
		message += header + ": ";
		message += text;
		message += "</font>";
		message += "<font color='gray'>";
		message += " (from " + from + ")";
		message += "</font></div>";
		
		return message;
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * <br>This operates the initialization tasks for layout, actions, plugins...
	 * @method clean 
	 **/
	clean: function () {
		core.mainLayout.innerBottomTabView.selectTab(1);
		var message = "<pre>";
		message += "Project clean complete";
		message += "</pre>";
		
		$("#debug").prepend(message);
	}
};