/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module search
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class message
 **/
org.goorm.core.search.message = function () {

};

org.goorm.core.search.message.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * This operates the initialization tasks for layout, actions, plugins...
	 * First written: Shinwook Gahng 
	 * Latest modified: Shinwook Gahng 
	 * @method m() 
	 * @return void
	 **/
	m: function (fromLine, fromCh, toLine, toCh, text) {
		var color = "#333";
		
		$("#search").prepend(this.makeMessage(fromLine, fromCh, toLine, toCh, text, color));
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * This operates the initialization tasks for layout, actions, plugins...
	 * First written: Shinwook Gahng 
	 * Latest modified: Shinwook Gahng 
	 * @method makeMessage() 
	 * @return void
	 **/	
	makeMessage: function (fromLine, fromCh, toLine, toCh, text, color) {
		var message = "<div class='searchMessage' fline='" + fromLine + "' fch='" + fromCh + "' tline='" + toLine + "' tch='" + toCh + "'><font color=" + color + ">";
		message += "[" + (core.selectedFile.split("/")).pop();
		message += ":" + fromLine+1 + "]: ";
		// var encodedText = this.htmlEncode(text);
		// var tempMsg = encodedText.slice(0, fromCh) + "<u>" + encodedText.slice(fromCh, toCh) + "</u>" + encodedText.slice(toCh);
		var encodedText = this.htmlEncode(text.slice(0, fromCh) + "[underLineInsert]" + text.slice(fromCh, toCh) + "[/underLineInsert]" + text.slice(toCh));
		var tempMsg = encodedText.replace(this.htmlEncode("[underLineInsert]"), "<span style='text-decoration:none; border-bottom:1px solid red;'>");
		var tempMsg = tempMsg.replace(this.htmlEncode("[/underLineInsert]"), "</span>");
		message += tempMsg;
		message += "  (from " + core.currentProjectName + ")";
		message += "</font>";
		message += "<br>";
		return message;
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * This operates the initialization tasks for layout, actions, plugins...
	 * First written: Shinwook Gahng 
	 * Latest modified: Shinwook Gahng 
	 * @method m() 
	 * @return void
	 **/
	mReplaceAll: function (fromLine, fromCh, toLine, toCh, fromText, toText) {
		var color = "#333";
		
		$("#search").prepend(this.makeReplaceAllMessage(fromLine, fromCh, toLine, toCh, fromText, toText, color)); 
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * This operates the initialization tasks for layout, actions, plugins...
	 * First written: Shinwook Gahng 
	 * Latest modified: Shinwook Gahng 
	 * @method makeMessage() 
	 * @return void
	 **/	
	makeReplaceAllMessage: function (fromLine, fromCh, toLine, toCh, fromText, toText, color) {
		var message = "<div class='searchMessage' fline='" + fromLine + "' fch='" + fromCh + "' tline='" + toLine + "' tch='" + toCh + "'><font color=" + color + ">";
		message += "[" + (core.selectedFile.split("/")).pop();
		message += ":" + fromLine + " (" + fromCh + "~" + toCh + ")]: ";
		message += this.htmlEncode(fromText) + " -> " + this.htmlEncode(toText);
		message += "  (from " + core.currentProjectName + ")";
		message += "</font>";
		message += "<br>";
		return message;
	},
	/**
	 * This function is an goorm core initializating function.  
	 * This operates the initialization tasks for layout, actions, plugins...
	 * First written: Shinwook Gahng 
	 * Latest modified: Shinwook Gahng  
	 * @method clean() 
	 * @return void
	 **/
	clean: function () {
		$("#search").html("");
	},
	
	/**
	 * This function replace special characters to printable one.  
	 * First written: Shinwook Gahng 
	 * Latest modified: Shinwook Gahng  
	 * @method htmlEncode() 
	 * @return String
	 **/
	htmlEncode: function (s)	{
	  var el = document.createElement("div");
	  el.innerText = el.textContent = s;
	  s = el.innerHTML;
	  delete el;
	  return s;
	}
	
	
};