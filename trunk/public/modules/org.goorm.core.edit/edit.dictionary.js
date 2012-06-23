/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module edit
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class findReplace
 * @extends edit
 **/
org.goorm.core.edit.dictionary = function () {
	/**
	 * This presents the current browser version
	 * @property dictionary
	 **/
	this.dictionaryList = null;	

};

org.goorm.core.edit.dictionary.prototype = {
		
	init: function(){

		this.dictionaryList = new Array();
		var self = this;

	},
	
	showDescription: function(keyword, fileType, divDescText){
		for(var v=0;v<this.dictionaryList.length;v++){
			//keyword check
			if(this.dictionaryList[v][0]!=keyword)
				continue;
			var saveFileType = this.dictionaryList[v][2].split(';');
			for(var i=0;i<saveFileType.length;i++){
				//filetype check
				if(saveFileType[i]==fileType) {
					divDescText.html(this.dictionaryList[v][1]);				
				}
/*
				if(saveFileType[i]!=fileType)
					continue;
				divDescText.html(this.dictionaryList[v][1]);
				break;
*/
			}							
		}
	},
	
	showDictionary: function(fileType, projectType){
		var found = [];				
		for(var v=0;v<this.dictionaryList.length;v++){
			var saveFileType = this.dictionaryList[v][2].split(';');
			for(var i=0;i<saveFileType.length;i++){
				//filetype check
				if(saveFileType[i]==fileType) {
					found.push(this.dictionaryList[v][0]);				
/*
					console.log(this.dictionaryList[v][0]);
*/
				}
/*
				if(saveFileType[i]!=fileType)
					continue;
				found.push(this.dictionaryList[v][0]);
				break;
*/
			}
		}		
		return found;
	},
	
	pushDictionary:function(word, desc, type, projectType) {
		var top=this.dictionaryList.length;		
		this.dictionaryList[top]=new Array();
		this.dictionaryList[top][0]=word;
		this.dictionaryList[top][1]=desc;
		this.dictionaryList[top][2]=type;
		this.dictionaryList[top][3]=projectType;
	},
	
	loadDictionary:function(url) {
		var self = this;
			
		$.getJSON(url, function(data) {
			// file type
			var fileType="";
			var projectType=data.project[0].projectType;
			for(var i=0;i<data.option.length;i++){
				fileType += data.option[i].fileType+";";
			}			
			// keyword, description
			for(var i=0;i<data.keyword.length;i++){
				var word = "";
				word = data.keyword[i].word.replace(/\</g, "&#60;");
				word = word.replace(/\>/g, "&#62;");
				word = word.replace(/\//g, "&#47;");

				self.pushDictionary(word,data.keyword[i].desc,fileType,projectType);
			}
		});	
	},
	
	getHints: function (editor, fileType) {
		var self = this;
		
		// Find the token at the cursor
		var cur = editor.getCursor(), token = editor.getTokenAt(cur), tprop = token;

		// If it's not a 'word-style' token, ignore the token.
		if (!/^[\w$_<>@/]*$/.test(token.string)) {
		  token = prop = {start: cur.ch, end: cur.ch, string: "", state: token.state,
		                   className: token.string == "." ? "property" : null};
		}

		// If it is a property, find out what it is a property of.
		while (tprop.className == "property") {
		  prop = editor.getTokenAt({line: cur.line, ch: tprop.start});
		  if (tprop.string != ".") return;
		  prop = editor.getTokenAt({line: cur.line, ch: tprop.start});
		  if (!context) var context = [];
		  context.push(tprop);
		}

		return {list: self.getCompletions(token, context, fileType),
		        from: {line: cur.line, ch: token.start},
		        to: {line: cur.line, ch: token.end}};
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method startComplete 
	 **/
	startComplete: function (editor, target, fileType) {
		var self = this;

		// We want a single cursor position.
		if (editor.somethingSelected()) return;

	    var result = self.getHints(editor, fileType);
	    console.log(result);
	    if (!result || !result.list.length) return;
	    var completions = result.list;

		function insert(str) {
			editor.replaceRange(str, result.from, result.to);
		}

	    if (completions.length == 1) {
	    	var tempWord = completions[0];
	    	
			tempWord = tempWord.replace(/\&\#60;/g, "<");
			tempWord = tempWord.replace(/\&\#62;/g, ">");
			tempWord = tempWord.replace(/\&\#47;/g, "/");
	    	
	    	insert(tempWord);
	    	return true;
	    }
		$(target).append("<div class='completions'><select></select></div>")
				
		var divCompletion = $(target).find(".completions");				
		var selCompletion = divCompletion.find("select");		
		selCompletion.attr("multiple", true);
			
		for (var i = 0; i < completions.length; ++i) {
			if(i==0) {
				selCompletion.append("<option selected='selected'>" + completions[i] + "</option>");
			}
			else {
				selCompletion.append("<option>" + completions[i] + "</option>");
			}			
		}		

		selCompletion.attr("size", Math.min(10, completions.length));	
		var pos = editor.cursorCoords();					
		divCompletion.css("left", pos.x - $(target).offset().left);
		divCompletion.css("top", pos.yBot - $(target).offset().top);				
				
		// description text 
		$(target).append("<div style='width:200px; border:1px solid #000; background-color:#fff;'  class='descText'></div>")
		var divDescText = $(target).find(".descText");
		
		var kw = divCompletion.find("select option:selected").attr("value");
		core.dictionary.showDescription(kw,self.filetype,divDescText,core.currentProjectType);
		
		divDescText.css("left", pos.x - $(target).offset().left +divCompletion.width());		
		divDescText.css("top", pos.yBot - $(target).offset().top );
		
		var done = false;
		
		function close() {
			if (done) return;

			done = true;

			divCompletion.remove();
			divDescText.remove();
		}
		
		function pick() {
			insert(divCompletion.find("select option:selected").attr("value"));
			close();
			setTimeout(function() {
				editor.focus();
			}, 50);
		}
		
		selCompletion.bind("blur", close);
		
		selCompletion.bind("change",function(event){
			var kw = divCompletion.find("select option:selected").attr("value");
			core.dictionary.showDescription(kw, self.filetype, divDescText);
		});
		
		selCompletion.bind("keydown", function(event) {
			
			var code = event.keyCode;
			if (code == 16) {
			
			}
			// Enter and space
			else if (code == 13 || code == 32) {
				//event.stop();
				pick();
			}
			// Escape
			else if (code == 27) {
				//event.stop(); 
				close(); 
				editor.focus();
			}
			else if (code != 38 && code != 40) {
				close(); 
				editor.focus();
				
				console.log(code);

				setTimeout(function() {
					self.startComplete(editor, target, fileType);
					}, 50
				);

			}
		});
		selCompletion.dblclick(pick);
	
		selCompletion.focus();
		
		// Opera sometimes ignores focusing a freshly created node
		if (window.opera) {
			setTimeout(function() {
				if (!done) selCompletion.focus();
			}, 100);
		}
		
		return true;
	},

	
	/**
	 * This function is an goorm core initializating function.  
	 * @method getCompletions 
	 * @param {String} token The token.
	 * @param {String} context The context.
	 **/
	getCompletions: function (token, context, fileType) {
		var self = this;
		
		var found = [];
		var start = token.string;
		
		console.log(start);
				
		start = start.replace(/\</g, "&#60;");
		start = start.replace(/\>/g, "&#62;");
		start = start.replace(/\//g, "&#47;");
		
		console.log(start);
		
		function arrayContains(arr, item) {
			if (!Array.prototype.indexOf) {
				var i = arr.length;
				while (i--) {
					if (arr[i] === item) {
						return true;
					}
				}
				return false;
			}
			return arr.indexOf(item) != -1;
		}
		
		function maybeAdd(str) {
			if (str.indexOf(start) == 0 && !arrayContains(found, str)) {
				found.push(str);
			}
		}
		
		function gatherCompletions(obj) {
			if (typeof obj == "string") 
		  		this.forEach(self.stringProps, maybeAdd);
			else if (obj instanceof Array)
				this.forEach(self.arrayProps, maybeAdd);
			else if (obj instanceof Function)
				this.forEach(self.funcProps, maybeAdd);
			for (var name in obj)
				maybeAdd(name);
		}
		
	
		if (context) {
			// If this is a property, see if it belongs to some object we can
			// find in the current environment.
			var obj = context.pop(), base;
			
			if (obj.className == "js-variable")
				base = window[obj.string];
			else if (obj.className == "js-string")
				base = "";
			else if (obj.className == "js-atom")
				base = 1;
				
			while (base != null && context.length)
				base = base[context.pop().string];
				
			if (base != null) 
				gatherCompletions(base);
		}
		else {
			// If not, just look in the window object and any local scope
			// (reading into JS mode internals to get at the local variables)
			for (var v = token.state.localVars; v; v = v.next) {
				maybeAdd(v.name);
			}
			
			var selectedKeywordList=core.dictionary.showDictionary(fileType, core.currentProjectType);
						
			for(var v=0;v<selectedKeywordList.length;v++){				
				maybeAdd(selectedKeywordList[v]);				
			}
			
			// delete by pch
			//gatherCompletions(window);
			//this.forEach(self.keywords, maybeAdd);

		}

		return found;
	}

};