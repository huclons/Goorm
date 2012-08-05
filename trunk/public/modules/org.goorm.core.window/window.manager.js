/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.window.manager = function () {
	this.window = null;
	this.tab = null;
	this.context_menu = null;
	this.list_menu = null;
	this.window_list_menu = null;
	this.workspace_container = null;
	this.window_list_container = null;
	this.index = 0;
	this.tab_scroll_index = 0;
	this.window_tabview = null;
	this.active_window = -1;
	this.is_maxmizedd = true;
	this.window_list = null;
};

org.goorm.core.window.manager.prototype = {
	init: function(container) {
		var self = this;
		
		this.window = $.makeArray();
		this.tab = $.makeArray();
		this.context_menu = $.makeArray();
		this.window_list_menu = $.makeArray();
		this.workspace_container = container;
		
		this.window_list = new Object();
		this.window_list.active_window=0;
		this.window_list.windows = new Object();
		
		/*
		this.panel.setHeader("<div style='overflow:auto' class='titlebar'><div style='float:left'>"+this.title+"</div><div style='width:40px; text-align:right; float:right'><img src='images/icons/context/minimizebutton.png' class='minimize button' /> <img src='images/icons/context/maximizebutton.png' class='maximize button' /> <img src='images/icons/context/closebutton.png' class='close button' /></div></div>");
*/

		//$("#" + container).append("");

		$("#" + container).append("<div id='" + container + "_window_list'><div class='tab_max_buttons' style='float:right;'><div class='max_maximize window_button'></div> <div class='max_close window_button'></div></div><div class='tab_scroll' style='float:right;'><div class='tab_list_left window_button'></div><div class='window_list window_button'></div><div class='tab_list_right window_button'></div></div></div>");
		
		$(".max_maximize").click(function (e) {
			self.cascade();
			e.preventDefault();
			e.stopPropagation();
			return false;
		});
		$(".tab_max_buttons").css("display", "none");
		$(".max_close").click(function () {
			self.window[self.active_window].close();
		});
		
		$(".tab_list_left").click(function () {
			if(self.tab_scroll_index>0) {
				self.tab_scroll_index--;
				$("#workspace_window_list").find("li").eq(self.tab_scroll_index).css("display", "inline-block");
			}
		});
		$(".tab_list_right").click(function () {
			if(self.tab_scroll_index<self.index-1) {
				$("#workspace_window_list").find("li").eq(self.tab_scroll_index).css("display", "none");
				self.tab_scroll_index++;
			}
		});
		
		this.window_list_container = container + "_window_list";
		
		this.window_tabview = new YAHOO.widget.TabView(this.window_list_container);

		this.list_menu = new YAHOO.widget.Menu("window_list_menu");
		this.list_menu.render(document.body);
		
		this.context_menu[0] = new org.goorm.core.menu.context();
		this.context_menu[0].init("configs/menu/org.goorm.core.window/window.manager.html", "window.manager", container);
		
		this.context_menu[1] = new org.goorm.core.menu.context();
		this.context_menu[1].init("configs/menu/org.goorm.core.window/window.manager.tabview.html", "window.manager.tabview", container + "_window_list");
				
		//testCode
		/*
		$("#" + container + "window_list").dblclick(function() {
			self.add("designer"); //type : designer or editor
		});
		*/
		
		/*
		$("#workspace").append("<button id='addwindow_button'>add a window</button>");
		
		var self = this;
		$("#addwindow_button").click(function() {
			self.add();
			m.s("added a window", "window manager");
		});
		*/
		
		//////////////////////////////////////////////////////////////////////////////////////////
		// window events
		//////////////////////////////////////////////////////////////////////////////////////////

		$("#" + container).click(function () {
			self.context_menu[0].cancel();
			self.context_menu[1].cancel();
			
			for(i=0; i<self.index; i++) {
				if (self.window[i].context_menu) {
					self.window[i].context_menu.cancel();
				}
				
				if (self.tab[i].context_menu) {
					self.tab[i].context_menu.cancel();					
				}
			}
			
		});
				
		$("#" + container + "_window_list").find(".window_list").click(function () {
			self.list_menu.show();
			
			$("#window_list_menu").css("z-index", 5);
			$("#window_list_menu").css("left", $("#" + container + "_window_list").find(".window_list").offset().left - $("#window_list_menu").width() + 10);
			$("#window_list_menu").css("top", $("#" + container + "_window_list").find(".window_list").offset().top + 10);	
		
			return false;
		});
		
		$(core).bind("goorm_load_complete", function () {
			if(!$.isEmptyObject(localStorage["window_list"])){
				var temp_window_list = $.parseJSON(localStorage["window_list"]);
				var count = 0;
				var active = 0;
				
				for(var id in temp_window_list.windows){
					var file_id = temp_window_list.windows[id];
					self.open(file_id.filepath, file_id.filename, file_id.filetype, file_id.editor);
					if(temp_window_list.active_window == id) 
						active = count;
					else count++;
				}
				
				//self.window[active].activate();
				//ajax호출때문에 먼저 activate가 되버림.
			}
		});
	},

	open: function(filepath, filename, filetype, editor) {
		var i = this.is_opened(filepath, filename);
		
		if(i >= 0) {
			this.active_window = i;
			this.window[i].activate();
		}
		else {
			this.add(filepath, filename, filetype, editor);
			var file_id = filepath+filename;
			this.window_list.windows[file_id] = new Object();
			this.window_list.windows[file_id].filepath = filepath;
			this.window_list.windows[file_id].filename = filename;
			this.window_list.windows[file_id].filetype = filetype;
			this.window_list.windows[file_id].editor = editor;
			localStorage["window_list"] = JSON.stringify(this.window_list);
		}
		
	},
	
	is_opened: function (filepath, filename) {
		var self = this;
		var window_index = -1;
		var empty_windows = $.makeArray();
		
		$(this.window).each(function (i) {
			if (this.filepath == null && this.filename == null) {
				empty_windows.push(i);
			}
		});
		
		$(empty_windows).each(function (i) {
			self.window.pop(this);
		});
		
		$(this.window).each(function (i) {
			if (this.filepath == filepath && this.filename == filename) {
				window_index = i;
			}
		});
		
		return window_index;
	},	

	add: function(filepath, filename, filetype, editor) {
		if(this.check_already_opened()) {
			m.s("warning", "This file is already opened!!", "window_manager");
		}
		else {
			var self = this;
			this.active_window = this.index;
			
			
			var title = filename;

			$("#"+this.workspace_container).append("<div id='filewindow"+this.index+"'></div>");
			
			this.window[this.index] = new org.goorm.core.window.panel();
			this.window[this.index].init("filewindow"+this.index, title, this.workspace_container, filepath, filename, filetype, editor);	
			
			this.tab[this.index] = new org.goorm.core.window.tab();
			this.tab[this.index].init("filewindow"+this.index, title, this.window_tabview, this.list_menu);			
			
			this.window[this.index].connect(this.tab[this.index]);
			this.tab[this.index].connect(this.window[this.index]);
			
			this.active_window = this.index;
			this.window[this.index].activate();				
			this.tab[this.index].activate();
			
			//For Test			
			//this.window[this.index].maximize();
			
			
			this.index++;
			
			/*
			if(!this.is_maxmizedd){
				this.cascade();
			}
			*/
		}
		
		$(document).bind("maximize_resize", function() {
			if(self.active_window!=-1) {
				self.window[self.active_window].maximize(true);
			}
		});
	},
	
	check_already_opened: function(fullpath, filename) {
	},
		
	previous_window: function () {	
		if (this.window[this.active_window-1]) {
			this.window[this.active_window-1].activate();
			this.active_window--;
		  
		 	if (this.window[this.active_window].type == "Editor") {
				this.window[this.active_window].editor.editor.focus();
			}
		}
	},

	next_window: function () {
		if (this.window[this.active_window+1]) {
			this.window[this.active_window+1].activate();
			this.active_window++;
		  
		  	if (this.window[this.active_window].type == "Editor") {
				this.window[this.active_window].editor.editor.focus();
			}			  
		}
	},
	
	hide_all_windows: function () {
		$(this.window).each(function (i) {
			$("#" + this.container + "_c").hide("fast");
			this.status = "minimized";	
		});
	},

	show_all_windows: function () {
		$(this.window).each(function (i) {
			$("#" + this.container + "_c").show("fast");
			this.status = null;	
			this.resize_all();
		});
	},
	
	save_all: function() {

		for (var i = 0; i < this.index; i++) {
			if(this.window[i].alive) {
				if (this.window[i].designer) {
					this.window[i].designer.save();
				}
				else if (this.window[i].editor) {
					this.window[i].editor.save();
				}
				
				var window_manager = core.module.layout.workspace.window_manager;
				window_manager.window[i].set_saved();
				window_manager.tab[i].set_saved();
			}
		}
	},
	
	cascade: function () {
		var count = 0;
		var width_ratio = 0.6;
		var height_ratio = 0.7;
		
		for (var i = 0; i < this.index; i++) {
			if(this.window[i].alive) {
				if(this.window[i].status=="maximized") {
					this.window[i].maximize();
					this.is_maxmizedd = true;
				}

				this.window[i].panel.left	= 4+(24*count);
				this.window[i].panel.top	= 29+(24*count);
				this.window[i].panel.width = $('#workspace').width() * width_ratio;
				this.window[i].panel.height = $('#workspace').height() * height_ratio;
				
				//m.s(this.window[i].designer.toSource());
				//if($('#filewindow'+i+'_c').find(".code_editor") != null) {
				if(this.window[i].designer){
					m.s(this.window[i].type);
					$('#filewindow'+i+'_c').find(".canvas_container").css('width', this.window[i].panel.width - 14 + 'px');
			  	 	$('#filewindow'+i+'_c').find(".canvas_container").css('height', this.window[i].panel.height - 68 + 'px');
			  	 	$('#filewindow'+i+'_c').find(".ruler_x").css('width', this.window[i].panel.width - 15 + 'px');
			  	 	$('#filewindow'+i+'_c').find(".ruler_y").css('height', this.window[i].panel.height - 65 + 'px');
				}
								
				$('#filewindow'+i+'_c').css('left', this.window[i].panel.left + 'px');
				$('#filewindow'+i+'_c').css('top', this.window[i].panel.top + 'px');
				$('#filewindow'+i+'_c').css('z-index', i);

				this.window[i].panel.cfg.setProperty('left', this.window[i].panel.left + 'px');
				this.window[i].panel.cfg.setProperty('top', this.window[i].panel.top + 'px');

//				$('#filewindow'+i+'_c').find('.yui-panel').css('width', this.window[i].panel.width + 'px');
//				$('#filewindow'+i+'_c').find('.yui-panel').css('height', this.window[i].panel.height-22 + 'px');
				$('#filewindow'+i+'_c').css('width', this.window[i].panel.width + 'px');
				$('#filewindow'+i+'_c').css('height', this.window[i].panel.height + 'px');
				$('#filewindow'+i).children(".bd").height(this.window[i].panel.height - 50);
				$('#filewindow'+i).css('width', this.window[i].panel.width + 'px');
				$('#filewindow'+i+'_c').children(".window_container").height(this.window[i].panel.height - 50);
				this.window[i].resize_all();
				count++;
			}
		}
		
		this.is_maxmizedd = false;
		$(".tab_max_buttons").css("display", "none");
		
		//this.window[this.active_window].activate();
	},
	
	tile_vertically: function () {
		var count = 0;
		var each_width = Math.floor(($('#workspace').width()-9) / this.count_alive_windows());
		var each_height = $('#workspace').height()-33;
			
		for (var i = 0; i < this.index; i++) {
			if(this.window[i].alive) {
				if(this.window[i].status=="maximized") {
					this.window[i].maximize();
					this.is_maxmizedd = true;
				}
				this.window[i].panel.left	= 4+(each_width*count);
				this.window[i].panel.top	= 29;
				this.window[i].panel.width	= each_width;
				this.window[i].panel.height	= each_height;
				
				if(this.window[i].designer){
					$('#filewindow'+i+'_c').find(".canvas_container").css('width', this.window[i].panel.width - 14 + 'px');
			  	 	$('#filewindow'+i+'_c').find(".canvas_container").css('height', this.window[i].panel.height - 68 + 'px');
			  	 	$('#filewindow'+i+'_c').find(".ruler_x").css('width', this.window[i].panel.width - 15 + 'px');
			  	 	$('#filewindow'+i+'_c').find(".ruler_y").css('height', this.window[i].panel.height - 65 + 'px');
				}
				
				$('#filewindow'+i+'_c').css('left', this.window[i].panel.left + 'px');
				$('#filewindow'+i+'_c').css('top', this.window[i].panel.top + 'px');
				$('#filewindow'+i+'_c').css('width', this.window[i].panel.width + 'px');
				$('#filewindow'+i+'_c').css('height', this.window[i].panel.height + 'px');
				$('#filewindow'+i+'_c').css('z-index', i);

				this.window[i].panel.cfg.setProperty('left', this.window[i].panel.left + 'px');
				this.window[i].panel.cfg.setProperty('top', this.window[i].panel.top + 'px');

				$('#filewindow'+i+'_c').find('.yui-panel').css('width', this.window[i].panel.width + 'px');
				$('#filewindow'+i+'_c').find('.yui-panel').css('height', this.window[i].panel.height + 'px');
				$('#filewindow'+i+'_c').children('.yui-panel').children(".bd").height(this.window[i].panel.height - 50);
				$('#filewindow'+i+'_c').find(".window_container").find(".CodeMirror").height(this.window[i].panel.height - 50);
				this.window[i].resize_all();
				count++;
			}
		}
		
				
		this.is_maxmizedd = false;
		$(".tab_max_buttons").css("display", "none");
	},
	
	tile_horizontally: function() {
		var count = 0;
		var each_width = $('#workspace').width()-9;
		var each_height = Math.floor(($('#workspace').height()-33) / this.count_alive_windows());
			
		for (var i = 0; i < this.index; i++) {
			if(this.window[i].alive) {
				if(this.window[i].status=="maximized") {
					this.window[i].maximize();
					this.is_maxmizedd = true;
				}
				this.window[i].panel.left	= 4;
				this.window[i].panel.top	= 29+(each_height*count);
				this.window[i].panel.width	= each_width;
				this.window[i].panel.height	= each_height;
				
				if(this.window[i].designer){
					m.s(this.window[i].type);
					$('#filewindow'+i+'_c').find(".canvas_container").css('width', this.window[i].panel.width - 14 + 'px');
			  	 	$('#filewindow'+i+'_c').find(".canvas_container").css('height', this.window[i].panel.height - 68 + 'px');
			  	 	$('#filewindow'+i+'_c').find(".ruler_x").css('width', this.window[i].panel.width - 15 + 'px');
			  	 	$('#filewindow'+i+'_c').find(".ruler_y").css('height', this.window[i].panel.height - 65 + 'px');
				}
				
				$('#filewindow'+i+'_c').css('left', this.window[i].panel.left + 'px');
				$('#filewindow'+i+'_c').css('top', this.window[i].panel.top + 'px');
				$('#filewindow'+i+'_c').css('width', this.window[i].panel.width + 'px');
				$('#filewindow'+i+'_c').css('height', this.window[i].panel.height + 'px');
				$('#filewindow'+i+'_c').css('z-index', i);

				this.window[i].panel.cfg.setProperty('left', this.window[i].panel.left + 'px');
				this.window[i].panel.cfg.setProperty('top', this.window[i].panel.top + 'px');

				$('#filewindow'+i+'_c').find('.yui-panel').css('width', this.window[i].panel.width + 'px');
				$('#filewindow'+i+'_c').find('.yui-panel').css('height', this.window[i].panel.height + 'px');
				$('#filewindow'+i+'_c').children('.yui-panel').children(".bd").height(this.window[i].panel.height - 50);
				$('#filewindow'+i+'_c').find(".window_container").find(".CodeMirror").height(this.window[i].panel.height - 50);
				this.window[i].resize_all();
				count++;
			}
		}
			
		this.is_maxmizedd = false;
		$(".tab_max_buttons").css("display", "none");
	},
	
	count_alive_windows: function() {
		var count = 0;
		
		for (var i = 0; i < this.index; i++) {
			if(this.window[i].alive) {
				count++;
			}
		}
		
		return count;
	},
	
	close_all: function() {
		var self = this;
		
		$(this.window).each(function (i) {
			if (this == undefined) {
				self.window.splice(self.window.indexOf(i), 1);
			}
		});
		
		$(this.window).each(function (i) {
			this.isSaved = true;
			this.tab.isSaved = true;
			this.close();
		});
				
		this.index = 0;
		this.active_window = -1;
		
		this.window = null;
		delete this.window;
		this.window = $.makeArray();		
	}
};