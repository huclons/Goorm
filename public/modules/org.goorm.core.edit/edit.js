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
 * @class edit
 **/
org.goorm.core.edit = function () {
	/**
	 * This presents the current browser version
	 * @property target
	 **/
	this.target = null;
	
	/**
	 * This presents the current browser version
	 * @property editor
	 **/
	this.editor = null;
	
	/**
	 * This presents the current browser version
	 * @property findReplace
	 **/
	this.findReplace = null;
		
	/**
	 * This presents the current browser version
	 * @property filepath
	 * @type String
	 **/
	this.filepath = null;
	
	/**
	 * This presents the current browser version
	 * @property filename
	 * @type String
	 **/
	this.filename = null;
	
	/**
	 * This presents the current browser version
	 * @property filetype
 	 * @type String
	 **/
	this.filetype = null;
	
	/**
	 * This presents the current browser version
	 * @property stringProps
	 * @type String
	 **/
	this.stringProps = null;
	
	/**
	 * This presents the current browser version
	 * @property arrayProps
	 **/
	this.arrayProps = null;
	
	/**
	 * This presents the current browser version
	 * @property funcProps
	 **/
	this.funcProps = null;
	
	/**
	 * This presents the current browser version
	 * @property keywords
	 * @type String
	 **/
	this.keywords = null;
	
	/**
	 * This presents the current browser version
	 * @property collaboration
	 **/
	this.collaboration = null;
	
	
	/**
	 * This presents the current browser version
	 * @property theme
	 **/
	this.theme = "elegant"; //"default", "neat", "elegant", "night", "cobalt"
	

	/**
	 * This presents the current browser version
	 * @property mode
	 **/
	this.mode = "htmlmixed";
	
	/**
	 * This presents the current browser version
	 * @property indentUnit
	 **/
	this.indentUnit = 2;
	
	/**
	 * This presents the current browser version
	 * @property indentWithTabs
	 **/
	this.indentWithTabs = true;
	
	/**
	 * This presents the current browser version
	 * @property tabMode
	 **/
	this.tabMode = "classic";
	
	/**
	 * This presents the current browser version
	 * @property enterMode
	 **/
	this.enterMode = "indent";
				
	/**
	 * This presents the current browser version
	 * @property showLineNumbers
	 **/
	this.showLineNumbers = true;
	
	/**
	 * This presents the current browser version
	 * @property firstLineNumber
	 **/
	this.firstLineNumber = 1;

	/**
	 * This presents the current browser version
	 * @property undoDepth
	 **/
	this.undoDepth = 40;
	
	/**
	 * This presents the current browser version
	 * @property highlightCurrentCursorLine
	 **/
	this.highlightCurrentCursorLine = true;

	/**
	 * This presents the current browser version
	 * @property highlightedLine
	 **/
	this.highlightedLine = null;
	
	/**
	 * This presents the current browser version
	 * @property preference
	 **/
	this.preference = null;
	
	/**
	 * This presents the current browser version
	 * @property preference
	 **/
	this.contextMenu = null;
	
	/**
	 * This presents the current browser version
	 * @property timestamp
	 **/
	this.timestamp = null;	
	
	/**
	 * This presents the current browser version
	 * @property fromCh
	 **/
	this.fromCh = null;
	
	/**
	 * This presents the current browser version
	 * @property fromCh
	 **/
	this.toCh = null;	
};

org.goorm.core.edit.prototype = {
	
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 * @param {Object} target The target.
	 **/
	init: function (target, title) {
		var self = this;
		var dontUpdateFirst = 0;
		
		var enterKey = false; // onChange can't get enterkey
		
		this.collaboration = new org.goorm.core.collaboration.edit();
		
		this.target = target;
		this.title = title;
		
		//this.preference = core.dialog.preference.preference;
				
		this.timestamp = new Date().getTime();
				
		$(target).append("<textarea class='codeEditor'>Loading Data...</textarea>");
		//$(target).append("<textarea class='clipboardBuffer'></textarea>");
		
		this.editor = CodeMirror.fromTextArea($(target).find(".codeEditor")[0], {
			lineNumbers: true,
			matchBrackets: true,
			onKeyEvent: function(i, e) {			
				
				// Hook into ctrl-space
				if (e.keyCode == 32 && (e.ctrlKey || e.metaKey) && !e.altKey) {
					e.stopPropagation();
					e.preventDefault();
					return core.dictionary.startComplete(self.editor, self.target, self.filetype);
				}
				
				if(e.type == "keydown" && e.keyIdentifier == "Enter"){
					enterKey = true;
					self.toCh = self.editor.getCursor(false);
					self.fromCh = self.editor.getCursor(true);
					return false;
				}
				
				if (e.ctrlKey || e.metaKey || e.altKey) {
					
					if ( e.keyCode != 67 && e.keyCode != 86 && e.keyCode != 88 ) {
											
						var evt = $.Event('keydown');
						evt.which = e.which;
						evt.keyCode = e.keyCode;
						evt.ctrlKey = e.ctrlKey;
						evt.metaKey = e.metaKey;
						evt.altKey = e.altKey;
						evt.shiftKey = e.shiftKey;
						
						$(document).trigger(evt);
						
						e.stopPropagation();
						e.preventDefault();
						return false;
					}
				}
			},
			onChange: function(i, e){
				if(dontUpdateFirst){
					if(self.collaboration.updatingProcessRunning == false){
						var ev = e;
						
						if(enterKey == true) {
							var line=self.editor.getLine(ev.to.line);
/*
							console.log(self.fromCh);
							console.log(self.toCh);
							console.log(line);
*/
							ev.text[0]="\n";
							ev.from.line = self.fromCh.line;
							ev.to.line = self.toCh.line;
							ev.from.ch = self.fromCh.ch;
							ev.to.ch = self.toCh.ch;
							self.collaboration.updateChange(ev);
							
							ev.text[0]=line;
							ev.from.line = ev.to.line+1;
							ev.to.line = ev.to.line+1;
							if(self.fromCh.line != self.toCh.line){
								ev.from.line = self.editor.getCursor().line;
								ev.to.line = self.editor.getCursor().line;
							}
							ev.to.ch = 99999;
							ev.from.ch = 0;
							
							
							
							// var indent = self.editor.getCursor().ch;
// 							
							// for(var i=0; i < indent; i++){
								// ev.text[0]+=" ";
							// }
							
/*
							console.log(ev);
*/
							enterKey = false;
						}
						
						
						//self.editor.getCursor();
						
						if(core.isCollaborationON == true){
							self.collaboration.updateChange(ev);
						}
					}
				}
				else{
					dontUpdateFirst=1;
				}
			  
			  	var windowManager = core.mainLayout.workSpace.windowManager;
			  
			  	windowManager.window[windowManager.activeWindow].setModified();
			  
			  	windowManager.tab[windowManager.activeWindow].setModified();
			},
			onCursorActivity: function () {
				if (self.highlightCurrentCursorLine) {
					self.editor.setLineClass(self.highlightedLine, null);
					self.highlightedLine = self.editor.setLineClass(self.editor.getCursor().line, "activeline");
				}
				
				$(self.target).parent().parent().find(".ft").find(".editorMessage").html("Line: " + (parseInt(self.editor.getCursor().line) + 1) + " | Col: " + self.editor.getCursor().ch);
			},
			onFocus: function () {
				core.focusOnEditor = true;
			},
			onBlur: function () {
				core.focusOnEditor = false;				
			}
		});
		
		if (this.highlightCurrentCursorLine) {
			this.highlightedLine = this.editor.setLineClass(0, "activeline");
		}
		
		this.collaboration.setEditor(this.editor);
		
		this.setDictionary();
		
		this.setOption();
		
		//this.mode = "htmlmixed";
		//this.editor.setOption("mode", this.mode);

		//this.toggleFullscreenEditing();
		
		//var findReplace = new org.goorm.core.edit.findReplace(this.editor, $(target).find(".codeEditor")[0]);
		//this.findReplace = new org.goorm.core.edit.findReplace();
		//this.findReplace.init(this.editor);
		//this.findReplace.init(this.editor, $(target));
		
		$(target).keypress(function (e) {
			if (!(e.which == 115 && e.ctrlKey)) return true;

			self.save();
			
			e.preventDefault();
			return false;
		});
		
		
		$(document).bind("onPreferenceConfirm", function () {
			self.setOption();
		});
		
		
		this.contextMenu = new org.goorm.core.menu.context();
		this.contextMenu.init("configs/menu/org.goorm.core.edit/edit.context.html", "edit.context", this.target, this.timestamp, null, function () {
			core.module.action.init();
		});
		
		
	},
	
	resizeAll: function () {

	},	

	setOption:function(){
		this.indentUnit = parseInt(this.preference["preference.editor.indentUnit"]);
		this.indentWithTabs = this.preference["preference.editor.indentWithTabs"];
		this.tabMode = this.preference["preference.editor.tabMode"];
		this.enterMode = this.preference["preference.editor.enterMode"];
		this.showLineNumbers = this.preference["preference.editor.showLineNumbers"];
		this.firstLineNumber = parseInt(this.preference["preference.editor.firstLineNumber"]);
		this.undoDepth = parseInt(this.preference["preference.editor.undoDepth"]);
		this.highlightCurrentCursorLine = this.preference["preference.editor.highlightCurrentCursorLine"];
		this.theme = this.preference["preference.editor.theme"];
		
		//////////////////////////////////////////////////////////////
		//Edit Settings
		//////////////////////////////////////////////////////////////
		this.editor.setOption("indentUnit", this.indentUnit);
		this.editor.setOption("indentWithTabs", this.indentWithTabs);
		this.editor.setOption("tabMode", this.tabMode);		
		this.editor.setOption("enterMode", this.enterMode);
		this.editor.setOption("showLineNumbers", this.showLineNumbers);
		this.editor.setOption("firstLineNumber", this.firstLineNumber);
		this.editor.setOption("undoDepth", this.undoDepth);
		this.editor.setOption("theme", this.theme);
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method load 
	 * @param {String} filepath The path where the file is.
	 * @param {String} filename The name of the file.
	 * @param {String} filetype The type of the file.
	 **/
	load: function (filepath, filename, filetype) {
		var self = this;
		
		var url = "file/get_contents";
		
		if (filetype == "url"){
			filename = "";
			url = "file/get_url_contents";
		}
		
		var path = filepath + "/" + filename;
		
		this.filepath = filepath;
		this.filename = filename;
		this.filetype = filetype;
		
		var i = 0;
		this.interval = window.setInterval(function () { if(i<100) { statusbar.progressbar.set('value', i+=10); } else { window.clearInterval(self.interval); } }, 100);
		
		statusbar.startLoading();
		
		$.ajax({
			url: url,			
			type: "POST",
			data: "path="+path,
			success: function(data) {
				self.editor.setValue(data);
				
				self.collaboration.init(self.target,self);
				if(core.isCollaborationON == true){
					self.collaboration.setEditOn();
				}
				statusbar.progressbar.set('value', 100);
				
				if(self.interval) {
					window.clearInterval(self.interval);
				}
				
				self.editor.clearHistory();
				
				statusbar.stopLoading();
				
			  	var windowManager = core.mainLayout.workSpace.windowManager;
				
			  	windowManager.window[windowManager.activeWindow].setSaved();
			  
				windowManager.tab[windowManager.activeWindow].setSaved();
			}
		});
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method save
	 **/
	save: function (option) {
		
		var self = this;
		
		var url = "put_file_contents";
		var path = this.filepath + "/" + this.filename;
		
		var data = this.editor.getValue();
				
		$.ajax({
			url: url,			
			type: "POST",
			data: { path: path, data: data },
			success: function(data) {

				if(core.isCollaborationON == true){
					self.collaboration.socket.send('{"channel": "edit","action":"autoSaved", "identifier":"'+self.collaboration.identifier+'", "message":""}');
				}
			  
			  	var date = new Date();
			  	var time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
				
				m.s("Save Complete! (" + time + ")", "editor");
			  
			  	var windowManager = core.mainLayout.workSpace.windowManager;
			  
			  	windowManager.window[windowManager.activeWindow].setSaved();
			  
				windowManager.tab[windowManager.activeWindow].setSaved();
				
				if (option=="close") {
					windowManager.window[windowManager.activeWindow].close();
				}
			}
		});
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method saveAs 
	 * @param {String} filepath The path where the file will be.
	 * @param {String} filename The name of the file to be saved.
	 * @param {String} filetype The type of the file to be saved.
	 **/
	saveAs: function (filepath, filename, filetype) {
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method setDictionary 
	 **/
	setDictionary: function () {
		this.stringProps = ("charAt charCodeAt indexOf lastIndexOf substring substr slice trim trimLeft trimRight " +
                     "toUpperCase toLowerCase split concat match replace search").split(" ");
		this.arrayProps = ("length concat join splice push pop shift unshift slice reverse sort indexOf " +
							"lastIndexOf every some filter forEach map reduce reduceRight ").split(" ");
		this.funcProps = "prototype apply call bind".split(" ");
		this.keywords = ("break case catch continue debugger default delete do else false finally for function " +
						  "if in instanceof new null return switch throw true try typeof var void while with").split(" ");
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method stopEvent 
	 **/
	stopEvent: function () {
		if (this.preventDefault) {this.preventDefault(); this.stopPropagation();}
		else {this.returnValue = false; this.cancelBubble = true;}
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method addStop
	 * @param {Event} event The event.
	 * @return {Event} 
	 **/
	addStop: function (event) {
		if (!event.stop) event.stop = this.stopEvent;
		return event;
	},

	/**
	 * This function is an goorm core initializating function.  
	 * @method forEach 
	 * @param {Object} arr Target array.
	 * @param {Object} f 
	 **/
	forEach: function (arr, f) {
		for (var i = 0, e = arr.length; i < e; ++i) f(arr[i]);
	},
	
	setMode: function (mode) {
		this.editor.setOption("mode", mode);
	},
	
	toggleFullscreenEditing: function () {
        var editorDiv = $(this.target).find('.CodeMirror-scroll');
        if (!editorDiv.hasClass('fullscreen')) {
            this.toggleFullscreenEditing.beforeFullscreen = { height: editorDiv.height(), width: editorDiv.width() }
            editorDiv.addClass('fullscreen');
            editorDiv.height('100%');
            editorDiv.width('100%');
            this.editor.refresh();
        }
        else {
            editorDiv.removeClass('fullscreen');
            editorDiv.height(this.toggleFullscreenEditing.beforeFullscreen.height);
            editorDiv.width(this.toggleFullscreenEditing.beforeFullscreen.width);
            this.editor.refresh();
        }
    },

	undo: function () {
		this.editor.undo();
	},
	
	
	redo: function () {
		this.editor.redo();
	},
	cut: function () {
		this.copy();
		this.editor.replaceSelection("");
		
		/*
		var selection = this.editor.getSelection();
		$(this.target).find(".clipboardBuffer").text(selection);
				
		
		var evt = $.Event('keydown');
		evt.which = 88;
		evt.keyCode = 88;
		evt.ctrlKey = true;
		//evt.altKey = true;
		
		//evt.keyIdentifier = "U+0043";
		//evt.currentTarget = null;
		//evt.srcElement = $(this.target).find(".CodeMirror").find("div:first").find("textarea:first")[0];
				
		$(this.target).find(".clipboardBuffer")[0].focus();
		$(this.target).find(".clipboardBuffer")[0].select();
		//console.log($(this.target).find(".CodeMirror").find("div:first").html());
		//$(this.target).find(".CodeMirror").find("div:first").find("textarea:first").trigger(evt);
		$(this.target).find(".clipboardBuffer").trigger(evt);
		//$(this.editor.getWrapperElement()).trigger(evt);
		
			
		
		//console.log(evt);
		*/
	},
		
	copy: function () {
		var selection = this.editor.getSelection();
		localStorage["clipboard"] = selection;
	},
	paste: function () {
		this.editor.replaceSelection(localStorage["clipboard"]);
	},
	doDelete: function () {
		this.editor.replaceSelection("");
	},
	selectAll: function () {
		this.editor.setSelection({"line":0,"ch":0},{"line":this.editor.lineCount(),"ch":0});
	}	
};