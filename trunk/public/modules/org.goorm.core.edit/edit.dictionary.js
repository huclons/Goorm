/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.edit.dictionary = function () {
	this.dictionary_list = null;	

};

org.goorm.core.edit.dictionary.prototype = {
	
	init: function(){
		this.dictionary_list = new Array();
		var self = this;
	},
	
	show_description: function(keyword, filetype, div_desc_text){
		for(var v=0;v<this.dictionary_list.length;v++){
			//keyword check
			if(this.dictionary_list[v][0]!=keyword)
				continue;
			var save_filetype = this.dictionary_list[v][2].split(';');
			for(var i=0;i<save_filetype.length;i++){
				//filetype check
				if(save_filetype[i]==filetype) {
					div_desc_text.html(this.dictionary_list[v][1]);				
				}
/*
				if(save_filetype[i]!=filetype)
					continue;
				div_desc_text.html(this.dictionary_list[v][1]);
				break;
*/
			}							
		}
	},
	
	show_dictionary: function(filetype, project_type){
		var found = [];				
		for(var v=0;v<this.dictionary_list.length;v++){
			var save_filetype = this.dictionary_list[v][2].split(';');
			for(var i=0;i<save_filetype.length;i++){
				//filetype check
				if(save_filetype[i]==filetype) {
					found.push(this.dictionary_list[v][0]);				
/*
*/
				}
/*
				if(save_filetype[i]!=filetype)
					continue;
				found.push(this.dictionary_list[v][0]);
				break;
*/
			}
		}		
		return found;
	},
	
	push_dictionary: function(word, desc, type, project_type) {
		var top=this.dictionary_list.length;		
		this.dictionary_list[top]=new Array();
		this.dictionary_list[top][0]=word;
		this.dictionary_list[top][1]=desc;
		this.dictionary_list[top][2]=type;
		this.dictionary_list[top][3]=project_type;
	},
	
	load_dictionary:function(url) {
		var self = this;
			
		$.getJSON(url, function(data) {
			// file type
			var filetype="";
			var project_type=data.project[0].project_type;
			for(var i=0;i<data.option.length;i++){
				filetype += data.option[i].filetype+";";
			}			
			// keyword, description
			for(var i=0;i<data.keyword.length;i++){
				var word = "";
				word = data.keyword[i].word.replace(/\</g, "&#60;");
				word = word.replace(/\>/g, "&#62;");
				word = word.replace(/\//g, "&#47;");

				self.push_dictionary(word,data.keyword[i].desc,filetype,project_type);
			}
		});	
	},
	
	getHints: function (editor, filetype) {
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

		return {list: self.get_completions(token, context, filetype),
		        from: {line: cur.line, ch: token.start},
		        to: {line: cur.line, ch: token.end}};
	},
	
	startComplete: function (editor, target, filetype) {
		var self = this;

		// We want a single cursor position.
		if (editor.somethingSelected()) return;

	    var result = self.getHints(editor, filetype);

	    if (!result || !result.list.length) return;
	    var completions = result.list;

		function insert(str) {
			editor.replaceRange(str, result.from, result.to);
		}

	    if (completions.length == 1) {
	    	var temp_word = completions[0];
	    	
			temp_word = temp_word.replace(/\&\#60;/g, "<");
			temp_word = temp_word.replace(/\&\#62;/g, ">");
			temp_word = temp_word.replace(/\&\#47;/g, "/");
	    	
	    	insert(temp_word);
	    	return true;
	    }
		$(target).append("<div class='completions'><select></select></div>")
				
		var div_completion = $(target).find(".completions");				
		var sel_completion = div_completion.find("select");		
		sel_completion.attr("multiple", true);
			
		for (var i = 0; i < completions.length; ++i) {
			if(i==0) {
				sel_completion.append("<option selected='selected'>" + completions[i] + "</option>");
			}
			else {
				sel_completion.append("<option>" + completions[i] + "</option>");
			}			
		}		

		sel_completion.attr("size", Math.min(10, completions.length));	
		var pos = editor.cursorCoords();					
		div_completion.css("left", pos.x - $(target).offset().left);
		div_completion.css("top", pos.yBot - $(target).offset().top);				
				
		// description text 
		$(target).append("<div style='width:200px; border:1px solid #000; background-color:#fff;'  class='description_text'></div>")
		var div_desc_text = $(target).find(".description_text");
		
		var kw = div_completion.find("select option:selected").attr("value");
		core.module.dictionary.show_description(kw,self.filetype,div_desc_text,core.currentproject_type);
		
		div_desc_text.css("left", pos.x - $(target).offset().left +div_completion.width());		
		div_desc_text.css("top", pos.yBot - $(target).offset().top );
		
		var done = false;
		
		function close() {
			if (done) return;

			done = true;

			div_completion.remove();
			div_desc_text.remove();
		}
		
		function pick() {
			insert(div_completion.find("select option:selected").attr("value"));
			close();
			setTimeout(function() {
				editor.focus();
			}, 50);
		}
		
		sel_completion.bind("blur", close);
		
		sel_completion.bind("change",function(event){
			var kw = div_completion.find("select option:selected").attr("value");
			core.module.dictionary.show_description(kw, self.filetype, div_desc_text);
		});
		
		sel_completion.bind("keydown", function(event) {
			
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

				setTimeout(function() {
					self.startComplete(editor, target, filetype);
					}, 50
				);

			}
		});
		sel_completion.dblclick(pick);
	
		sel_completion.focus();
		
		// Opera sometimes ignores focusing a freshly created node
		if (window.opera) {
			setTimeout(function() {
				if (!done) sel_completion.focus();
			}, 100);
		}
		
		return true;
	},

	get_completions: function (token, context, filetype) {
		var self = this;
		
		var found = [];
		var start = token.string;
		

				
		start = start.replace(/\</g, "&#60;");
		start = start.replace(/\>/g, "&#62;");
		start = start.replace(/\//g, "&#47;");
		
		
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
			
			var selected_keyword_list=core.module.dictionary.show_dictionary(filetype, core.currentproject_type);
						
			for(var v=0;v<selected_keyword_list.length;v++){				
				maybeAdd(selected_keyword_list[v]);				
			}
			
			// delete by pch
			//gatherCompletions(window);
			//this.forEach(self.keywords, maybeAdd);

		}

		return found;
	}

};