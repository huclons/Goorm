/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.edit = function () {
	this.target = null;
	this.editor = null;
	this.find_and_replace = null;
	this.filepath = null;
	this.filename = null;
	this.filetype = null;
	this.string_props = null;
	this.array_props = null;
	this.func_props = null;
	this.keywords = null;
	this.collaboration = null;
	this.theme = "elegant"; //"default", "neat", "elegant", "night", "cobalt"
	this.mode = "htmlmixed";
	this.indent_unit = 2;
	this.indent_with_tabs = true;
	this.tab_mode = "classic";
	this.enter_mode = "indent";
	this.show_line_numbers = true;
	this.first_line_number = 1;
	this.undo_depth = 40;
	this.highlight_current_cursor_line = true;
	this.highlighted_line = null;
	this.preference = null;
	this.context_menu = null;
	this.timestamp = null;	
	this.fromCh = null;
	this.toCh = null;	
};

org.goorm.core.edit.prototype = {
	init: function (target, title) {
		var self = this;
		var dont_update_first = 0;
		
		var enter_key = false; // onChange can't get enter_key
		
		this.collaboration = new org.goorm.core.collaboration.editing();

		
		this.target = target;
		this.title = title;
		
		this.timestamp = new Date().getTime();
				
		$(target).append("<textarea class='code_editor'>Loading Data...</textarea>");
		//$(target).append("<textarea class='clipboardBuffer'></textarea>");
		
		this.editor = CodeMirror.fromTextArea($(target).find(".code_editor")[0], {
			lineNumbers: true,
			matchBrackets: true,
			onKeyEvent: function(i, e) {			
				
				// Hook into ctrl-space
				if (e.keyCode == 32 && (e.ctrlKey || e.metaKey) && !e.altKey) {
					e.stopPropagation();
					e.preventDefault();
					return core.module.dictionary.start_complete(self.editor, self.target, self.filetype);
				}
				
				if(e.type == "keydown" && e.keyIdentifier == "Enter"){
					enter_key = true;
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
				if(dont_update_first){
					if(self.collaboration.updating_process_running == false){
						var ev = e;
						
						if(enter_key == true) {
							var line = self.editor.getLine(ev.to.line);

							ev.text[0]="\n";
							ev.from.line = self.fromCh.line;
							ev.to.line = self.toCh.line;
							ev.from.ch = self.fromCh.ch;
							ev.to.ch = self.toCh.ch;
							self.collaboration.update_change(ev);
							
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
							
							enter_key = false;
						}
						else {
							self.collaboration.update_change(ev);
						}
						//self.editor.getCursor();
					}
				}
				else{
					dont_update_first=1;
				}
			  
			  	var window_manager = core.module.layout.workspace.window_manager;
			  
			  	window_manager.window[window_manager.active_window].set_modified();
			  
			  	window_manager.tab[window_manager.active_window].set_modified();
			},
			onCursorActivity: function () {
				if (self.highlight_current_cursor_line) {
					self.editor.setLineClass(self.highlighted_line, null);
					self.highlighted_line = self.editor.setLineClass(self.editor.getCursor().line, "active_line");
				}
				
				$(self.target).parent().parent().find(".ft").find(".editor_message").html("Line: " + (parseInt(self.editor.getCursor().line) + 1) + " | Col: " + self.editor.getCursor().ch);
			},
			onFocus: function () {
				core.status.focus_on_editor = true;
			},
			onBlur: function () {
				core.status.focus_on_editor = false;				
			}
		});
		
		
		if (this.highlight_current_cursor_line) {
			this.highlighted_line = this.editor.setLineClass(0, "active_line");
		}
		
		
		//this.collaboration.set_editor(this.editor);
		this.set_dictionary();
		
		this.collaboration.init(this);
		this.collaboration.set_editor(this.editor);
		
		
		//this.set_option();
		
		
		
		//this.mode = "htmlmixed";
		//this.editor.set_option("mode", this.mode);

		//this.toggle_fullscreen_editing();
		
		//var findReplace = new org.goorm.core.edit.find_and_replace(this.editor, $(target).find(".code_editor")[0]);
		//this.find_and_replace = new org.goorm.core.edit.find_and_replace();
		//this.find_and_replace.init(this.editor);
		//this.find_and_replace.init(this.editor, $(target));
		
		$(target).keypress(function (e) {
			if (!(e.which == 115 && e.ctrlKey)) return true;

			self.save();
			
			e.preventDefault();
			return false;
		});
		
		
		$(document).bind("onPreferenceConfirm", function () {
			self.set_option();
		});
		
		
		this.context_menu = new org.goorm.core.menu.context();
		this.context_menu.init("configs/menu/org.goorm.core.edit/edit.context.html", "edit.context", this.target, this.timestamp, null, function () {
			core.module.action.init();
		});
	},
	
	resize_all: function () {

	},	

	set_option:function(){
		this.indent_unit = parseInt(this.preference["preference.editor.indent_unit"]);
		this.indent_with_tabs = this.preference["preference.editor.indent_with_tabs"];
		this.tab_mode = this.preference["preference.editor.tab_mode"];
		this.enter_mode = this.preference["preference.editor.enter_mode"];
		this.show_line_numbers = this.preference["preference.editor.show_line_numbers"];
		this.first_line_number = parseInt(this.preference["preference.editor.first_line_number"]);
		this.undo_depth = parseInt(this.preference["preference.editor.undo_depth"]);
		this.highlight_current_cursor_line = this.preference["preference.editor.highlight_current_cursor_line"];
		this.theme = this.preference["preference.editor.theme"];
		
		//////////////////////////////////////////////////////////////
		//Edit Settings
		//////////////////////////////////////////////////////////////
		this.editor.setOption("indent_unit", this.indent_unit);
		this.editor.setOption("indent_with_tabs", this.indent_with_tabs);
		this.editor.setOption("tabMode", this.tab_mode);		
		this.editor.setOption("enterMode", this.enter_mode);
		this.editor.setOption("show_line_numbers", this.show_line_numbers);
		this.editor.setOption("firstLineNumber", this.first_line_number);
		this.editor.setOption("undoDepth", this.undo_depth);
		this.editor.setOption("theme", this.theme);
	},
	
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
		
		statusbar.start();

		var temp_path = "";
		
		if (filetype == "url") {
			temp_path = filepath;
		}
		else {
			temp_path = "workspace/"+filepath+"/"+filename;
		}

		var postdata = {
			path: temp_path
		};

		$.get(url, postdata, function (data) {
			self.editor.setValue(data);
			
			//self.collaboration.init(self.target,self);
			
			/*
			if(core.flag.collaboration_on == true){
				self.collaboration.set_edit_on();
			}
			*/
			
			self.collaboration.set_filepath();
			
			statusbar.progressbar.set('value', 100);
			
			if(self.interval) {
				window.clearInterval(self.interval);
			}
			
			self.editor.clearHistory();
			
			statusbar.stop();
			
		  	var window_manager = core.module.layout.workspace.window_manager;
			
		  	window_manager.window[window_manager.active_window].set_saved();
		  
			window_manager.tab[window_manager.active_window].set_saved();
		});
	},
	
	save: function (option) {
		
		var self = this;
		
		var url = "file/put_contents";
		var path = this.filepath + "/" + this.filename;
		
		var data = this.editor.getValue();
		
		
		var send_data = {
			path: path,
			data: data
		};

		$.get(url, send_data, function (data) {
			if(core.flag.collaboration_on == true){
				self.collaboration.socket.send('{"channel": "edit","action":"autoSaved", "identifier":"'+self.collaboration.identifier+'", "message":""}');
			}
		  
		  	var date = new Date();
		  	var time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
			
			m.s("Save Complete! (" + time + ")", "editor");
		  
		  	var window_manager = core.module.layout.workspace.window_manager;

		  	window_manager.window[window_manager.active_window].set_saved();
		  
			window_manager.tab[window_manager.active_window].set_saved();
			
			if (option=="close") {
				window_manager.window[window_manager.active_window].close();
			}
		});

	},

	save_as: function (filepath, filename, filetype) {
	},
	
	set_dictionary: function () {
		this.string_props = ("charAt charCodeAt indexOf lastIndexOf substring substr slice trim trimLeft trimRight " +
                     "toUpperCase toLowerCase split concat match replace search").split(" ");
		this.array_props = ("length concat join splice push pop shift unshift slice reverse sort indexOf " +
							"lastIndexOf every some filter for_each map reduce reduceRight ").split(" ");
		this.func_props = "prototype apply call bind".split(" ");
		this.keywords = ("break case catch continue debugger default delete do else false finally for function " +
						  "if in instanceof new null return switch throw true try typeof var void while with").split(" ");
	},
	
	stop_event: function () {
		if (this.preventDefault) {this.preventDefault(); this.stopPropagation();}
		else {this.return_value = false; this.cancel_bubble = true;}
	},
	
	add_stop: function (event) {
		if (!event.stop) event.stop = this.stop_event;
		return event;
	},

	for_each: function (arr, f) {
		for (var i = 0, e = arr.length; i < e; ++i) f(arr[i]);
	},
	
	set_mode: function (mode) {
		this.editor.setOption("mode", mode);
	},
	
	toggle_fullscreen_editing: function () {
        var editor_div = $(this.target).find('.CodeMirror-scroll');
        if (!editor_div.hasClass('fullscreen')) {
            this.toggle_fullscreen_editing.beforeFullscreen = { height: editor_div.height(), width: editor_div.width() }
            editor_div.addClass('fullscreen');
            editor_div.height('100%');
            editor_div.width('100%');
            this.editor.refresh();
        }
        else {
            editor_div.removeClass('fullscreen');
            editor_div.height(this.toggle_fullscreen_editing.beforeFullscreen.height);
            editor_div.width(this.toggle_fullscreen_editing.beforeFullscreen.width);
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
		//$(this.target).find(".CodeMirror").find("div:first").find("textarea:first").trigger(evt);
		$(this.target).find(".clipboardBuffer").trigger(evt);
		//$(this.editor.getWrapperElement()).trigger(evt);
		
		*/
	},
		
	copy: function () {
		var selection = this.editor.getSelection();
		localStorage["clipboard"] = selection;
	},
	
	paste: function () {
		this.editor.replaceSelection(localStorage["clipboard"]);
	},
	
	do_delete: function () {
		this.editor.replaceSelection("");
	},
	
	select_all: function () {
		this.editor.setSelection({"line":0,"ch":0},{"line":this.editor.lineCount(),"ch":0});
	}	
};