/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module window
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class manager
 * @extends window
 **/
org.goorm.core.window.manager = function () {
	/**
	 * This presents the current browser version
	 * @property window
	 * @type Object
	 * @default null
	 **/
	this.window = null;
	
	/**
	 * This presents the current browser version
	 * @property tab
	 * @type Object
	 * @default null
	 **/
	this.tab = null;
	
	/**
	 * This presents the current browser version
	 * @property contextMenu
	 * @type Object
	 * @default null
	 **/
	this.contextMenu = null;
	
	/**
	 * This presents the current browser version
	 * @property listmenu
	 * @type Object
	 * @default null
	 **/
	this.listmenu = null;
	
	/**
	 * This presents the current browser version
	 * @property windowListMenu
	 * @type Object
	 * @default null
	 **/
	this.windowListMenu = null;
	
	/**
	 * This presents the current browser version
	 * @property workspaceContainer
	 * @type Object
	 * @default null
	 **/	
	this.workspaceContainer = null;
	
	/**
	 * This presents the current browser version
	 * @property windowListContainer
	 * @type Object
	 * @default null
	 **/
	this.windowListContainer = null;
	
	/**
	 * This presents the current browser version
	 * @property index
	 * @type Number
	 * @default 0
	 **/		
	this.index = 0;
	
	/**
	 * This presents the current browser version
	 * @property tabScrollIndex
	 * @type Number
	 * @default 0
	 **/		
	this.tabScrollIndex = 0;
	
	/**
	 * This presents the current browser version
	 * @property windowTabView
	 * @type Object
	 * @default null
	 **/
	this.windowTabView = null;
	
	/**
	 * This presents the current browser version
	 * @property activeWindow
	 * @type Number
	 * @default -1
	 **/
	this.activeWindow = -1;
	
	/**
	 * This presents the current browser version
	 * @property isMaximize
	 * @type Number
	 * @default true
	 **/
	this.isMaximize = true;
	
	/**
	 * This presents the current browser version
	 * @property windowList
	 * @type Object
	 **/
	this.windowList = null;
};

org.goorm.core.window.manager.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 * @param {Object} container
	 **/
	init: function(container) {
		var self = this;
		
		this.window = $.makeArray();
		this.tab = $.makeArray();
		this.contextMenu = $.makeArray();
		this.windowListMenu = $.makeArray();
		this.workspaceContainer = container;
		
		this.windowList = new Object();
		this.windowList.activeWindow=0;
		this.windowList.windows = new Object();
		
		/*
		this.panel.setHeader("<div style='overflow:auto' class='titlebar'><div style='float:left'>"+this.title+"</div><div style='width:40px; text-align:right; float:right'><img src='images/icons/context/minimizebutton.png' class='minimize button' /> <img src='images/icons/context/maximizebutton.png' class='maximize button' /> <img src='images/icons/context/closebutton.png' class='close button' /></div></div>");
*/

		//$("#" + container).append("");

		$("#" + container).append("<div id='" + container + "WindowList'><div style='float:right'><div class='windowList windowButton'></div></div><div class='tapMaxButtons' style='float:right;'><div class='maxmaximize windowButton'></div> <div class='maxclose windowButton'></div></div><div class='tabScroll' style='float:right;'><div class='tabListLeft windowButton'></div> <div class='tabListRight windowButton'></div></div></div>");
		
		$(".maxmaximize").click(function (e) {
			self.cascade();
			e.preventDefault();
			e.stopPropagation();
			return false;
		});
		$(".tapMaxButtons").css("display", "none");
		$(".maxclose").click(function () {
			self.window[self.activeWindow].close();
		});
		
		$(".tabListLeft").click(function () {
			if(self.tabScrollIndex>0) {
				self.tabScrollIndex--;
				$("#workspaceWindowList").find("li").eq(self.tabScrollIndex).css("display", "inline-block");
			}
		});
		$(".tabListRight").click(function () {
			if(self.tabScrollIndex<self.index-1) {
				$("#workspaceWindowList").find("li").eq(self.tabScrollIndex).css("display", "none");
				self.tabScrollIndex++;
			}
		});
		
		this.windowListContainer = container + "WindowList";
		
		this.windowTabView = new YAHOO.widget.TabView(this.windowListContainer);

		this.listmenu = new YAHOO.widget.Menu("windowListMenu");
		this.listmenu.render(document.body);
		
		this.contextMenu[0] = new org.goorm.core.menu.context();
		this.contextMenu[0].init("configs/menu/org.goorm.core.window/window.manager.html", "window.manager", container);
		
		this.contextMenu[1] = new org.goorm.core.menu.context();
		this.contextMenu[1].init("configs/menu/org.goorm.core.window/window.manager.tabView.html", "window.manager.tabView", container + "WindowList");
				
		//testCode
		/*
		$("#" + container + "WindowList").dblclick(function() {
			self.add("designer"); //type : designer or editor
		});
		*/
		
		/*
		$("#workspace").append("<button id='addWindowButton'>add a window</button>");
		
		var self = this;
		$("#addWindowButton").click(function() {
			self.add();
			m.s("added a window", "window manager");
		});
		*/
		
		//////////////////////////////////////////////////////////////////////////////////////////
		// Window events
		//////////////////////////////////////////////////////////////////////////////////////////

		$("#" + container).click(function () {
			self.contextMenu[0].cancel();
			self.contextMenu[1].cancel();
			
			for(i=0; i<self.index; i++) {
				if (self.window[i].contextMenu) {
					self.window[i].contextMenu.cancel();
				}
				
				if (self.tab[i].contextMenu) {
					self.tab[i].contextMenu.cancel();					
				}
			}
			
		});
				
		$("#" + container + "WindowList").find(".windowList").click(function () {
			self.listmenu.show();
			
			$("#windowListMenu").css("z-index", 5);
			$("#windowListMenu").css("left", $("#" + container + "WindowList").find(".windowList").offset().left - $("#windowListMenu").width() + 10);
			$("#windowListMenu").css("top", $("#" + container + "WindowList").find(".windowList").offset().top + 10);	
		
			return false;
		});
		
		$(core).bind("goormLoadingComplete", function () {
			if(!$.isEmptyObject(localStorage["windowList"])){
				var tempWindowList = $.parseJSON(localStorage["windowList"]);
				var count = 0;
				var active = 0;
				
				for(var id in tempWindowList.windows){
					var fileID = tempWindowList.windows[id];
					self.open(fileID.filepath, fileID.filename, fileID.filetype, fileID.editor);
					if(tempWindowList.activeWindow == id) 
						active = count;
					else count++;
				}
				
				//self.window[active].activate();
				//ajax호출때문에 먼저 activate가 되버림.
			}
		});
	},

	/**
	 * This function is an goorm core initializating function.  
	 * @method open 
	 * @param {String} filepath The path of the file.
	 * @param {String} filename The name of the file.
	 * @param {String} filetype The type of the file.
	 **/
	open: function(filepath, filename, filetype, editor) {
		var i = this.isOpened(filepath, filename);
		
		if(i >= 0) {
			this.activeWindow = i;
			this.window[i].activate();
		}
		else {
			console.log(editor);
			
			this.add(filepath, filename, filetype, editor);
			var fileID = filepath+filename;
			this.windowList.windows[fileID] = new Object();
			this.windowList.windows[fileID].filepath = filepath;
			this.windowList.windows[fileID].filename = filename;
			this.windowList.windows[fileID].filetype = filetype;
			this.windowList.windows[fileID].editor = editor;
			localStorage["windowList"] = JSON.stringify(this.windowList);
		}
		
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method isOpened 
	 * @param {String} filepath The path of the file.
	 * @param {String} filename The name of the file.
	 * @return {Number} The index of the window.
	 **/
	isOpened: function (filepath, filename) {
		var self = this;
		var windowIndex = -1;
		var emptyWindows = $.makeArray();
		
		$(this.window).each(function (i) {
			if (this.filepath == null && this.filename == null) {
				emptyWindows.push(i);
			}
		});
		
		$(emptyWindows).each(function (i) {
			self.window.pop(this);
		});
		
		$(this.window).each(function (i) {
			if (this.filepath == filepath && this.filename == filename) {
				windowIndex = i;
			}
		});
		
		return windowIndex;
	},	

	/**
	 * This function is an goorm core initializating function.  
	 * @method add 
	 * @param {String} filepath The path of the file.
	 * @param {String} filename The name of the file.
	 * @param {String} filetype The type of the file.
	 **/
	add: function(filepath, filename, filetype, editor) {
		if(this.checkAlreadyOpened()) {
			m.s("warning", "This file is already opened!!", "windowManager");
		}
		else {
			var self = this;
			this.activeWindow = this.index;
			
			
			var title = filename;

			$("#"+this.workspaceContainer).append("<div id='fileWindow"+this.index+"'></div>");
			
			this.window[this.index] = new org.goorm.core.window.panel();
			this.window[this.index].init("fileWindow"+this.index, title, this.workspaceContainer, filepath, filename, filetype, editor);	
			
			
			this.tab[this.index] = new org.goorm.core.window.tab();
			this.tab[this.index].init("fileWindow"+this.index, title, this.windowTabView, this.listmenu);			
			
			
			this.window[this.index].connect(this.tab[this.index]);
			this.tab[this.index].connect(this.window[this.index]);
			
			this.activeWindow = this.index;
			this.window[this.index].activate();				
			this.tab[this.index].activate();
			
			//For Test			
			//this.window[this.index].maximize();
			
			
			this.index++;
			
			/*
			if(!this.isMaximize){
				this.cascade();
			}
			*/
		}
		
		$(document).bind("maximizeResize", function() {
			if(self.activeWindow!=-1) {
				self.window[self.activeWindow].maximize(true);
			}
		});
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method checkAlreadyOpened 
	 * @param {String} filepath The path of the file.
	 * @param {String} filename The name of the file.
	 **/
	checkAlreadyOpened: function(fullpath, filename) {
	},
		
	/**
	 * This function is an goorm core initializating function.  
	 * @method previousWindow 
	 * @param {Number} i The index.
	 **/
	previousWindow: function () {	
		if (this.window[this.activeWindow-1]) {
			this.window[this.activeWindow-1].activate();
			this.activeWindow--;
		  
		 	if (this.window[this.activeWindow].type == "Editor") {
				this.window[this.activeWindow].editor.editor.focus();
			}
		}
	},

	/**
	 * This function is an goorm core initializating function.  
	 * @method nextWindow 
	 * @param {Number} i The index.
	 **/
	nextWindow: function () {
		if (this.window[this.activeWindow+1]) {
			this.window[this.activeWindow+1].activate();
			this.activeWindow++;
		  
		  	if (this.window[this.activeWindow].type == "Editor") {
				this.window[this.activeWindow].editor.editor.focus();
			}			  
		}
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method hideAllWindows 
	 **/
	hideAllWindows: function () {
		$(this.window).each(function (i) {
			$("#" + this.container + "_c").hide("fast");
			this.status = "minimized";	
		});
	},

	/**
	 * This function is an goorm core initializating function.  
	 * @method showAllWindows 
	 **/
	showAllWindows: function () {
		$(this.window).each(function (i) {
			$("#" + this.container + "_c").show("fast");
			this.status = null;	
			this.resizeAll();
		});
	},
	
	saveAll: function() {
		for (var i = 0; i < this.index; i++) {
			if(this.window[i].alive) {
				if (this.window[i].designer) {
					this.window[i].designer.save();
				}
				else if (this.window[i].editor) {
					this.window[i].editor.save();
				}
			}
		}
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method cascade 
	 **/
	cascade: function () {
		var count = 0;
		var widthRatio = 0.6;
		var heightRatio = 0.7;
		
		for (var i = 0; i < this.index; i++) {
			if(this.window[i].alive) {
				if(this.window[i].status=="maximized") {
					this.window[i].maximize();
					this.isMaximize = true;
				}

				this.window[i].panel.left	= 4+(24*count);
				this.window[i].panel.top	= 29+(24*count);
				this.window[i].panel.width = $('#workspace').width() * widthRatio;
				this.window[i].panel.height = $('#workspace').height() * heightRatio;
				
				//m.s(this.window[i].designer.toSource());
				//if($('#fileWindow'+i+'_c').find(".codeEditor") != null) {
				if(this.window[i].designer){
					m.s(this.window[i].type);
					$('#fileWindow'+i+'_c').find(".canvasContainer").css('width', this.window[i].panel.width - 14 + 'px');
			  	 	$('#fileWindow'+i+'_c').find(".canvasContainer").css('height', this.window[i].panel.height - 68 + 'px');
			  	 	$('#fileWindow'+i+'_c').find(".ruler_x").css('width', this.window[i].panel.width - 15 + 'px');
			  	 	$('#fileWindow'+i+'_c').find(".ruler_y").css('height', this.window[i].panel.height - 65 + 'px');
				}
								
				$('#fileWindow'+i+'_c').css('left', this.window[i].panel.left + 'px');
				$('#fileWindow'+i+'_c').css('top', this.window[i].panel.top + 'px');
				$('#fileWindow'+i+'_c').css('z-index', i);

				this.window[i].panel.cfg.setProperty('left', this.window[i].panel.left + 'px');
				this.window[i].panel.cfg.setProperty('top', this.window[i].panel.top + 'px');

//				$('#fileWindow'+i+'_c').find('.yui-panel').css('width', this.window[i].panel.width + 'px');
//				$('#fileWindow'+i+'_c').find('.yui-panel').css('height', this.window[i].panel.height-22 + 'px');
				$('#fileWindow'+i+'_c').css('width', this.window[i].panel.width + 'px');
				$('#fileWindow'+i+'_c').css('height', this.window[i].panel.height + 'px');
				$('#fileWindow'+i).children(".bd").height(this.window[i].panel.height - 50);
				$('#fileWindow'+i).css('width', this.window[i].panel.width + 'px');
				$('#fileWindow'+i+'_c').children(".windowContainer").height(this.window[i].panel.height - 50);
				this.window[i].resizeAll();
				count++;
			}
		}
		
		this.isMaximize = false;
		$(".tapMaxButtons").css("display", "none");
		
		//this.window[this.activeWindow].activate();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method tileVertically 
	 **/
	tileVertically: function () {
		var count = 0;
		var eachWidth = Math.floor(($('#workspace').width()-9) / this.countTheAliveWindows());
		var eachHeight = $('#workspace').height()-33;
			
		for (var i = 0; i < this.index; i++) {
			if(this.window[i].alive) {
				if(this.window[i].status=="maximized") {
					this.window[i].maximize();
					this.isMaximize = true;
				}
				this.window[i].panel.left	= 4+(eachWidth*count);
				this.window[i].panel.top	= 29;
				this.window[i].panel.width	= eachWidth;
				this.window[i].panel.height	= eachHeight;
				
				if(this.window[i].designer){
					$('#fileWindow'+i+'_c').find(".canvasContainer").css('width', this.window[i].panel.width - 14 + 'px');
			  	 	$('#fileWindow'+i+'_c').find(".canvasContainer").css('height', this.window[i].panel.height - 68 + 'px');
			  	 	$('#fileWindow'+i+'_c').find(".ruler_x").css('width', this.window[i].panel.width - 15 + 'px');
			  	 	$('#fileWindow'+i+'_c').find(".ruler_y").css('height', this.window[i].panel.height - 65 + 'px');
				}
				
				$('#fileWindow'+i+'_c').css('left', this.window[i].panel.left + 'px');
				$('#fileWindow'+i+'_c').css('top', this.window[i].panel.top + 'px');
				$('#fileWindow'+i+'_c').css('width', this.window[i].panel.width + 'px');
				$('#fileWindow'+i+'_c').css('height', this.window[i].panel.height + 'px');
				$('#fileWindow'+i+'_c').css('z-index', i);

				this.window[i].panel.cfg.setProperty('left', this.window[i].panel.left + 'px');
				this.window[i].panel.cfg.setProperty('top', this.window[i].panel.top + 'px');

				$('#fileWindow'+i+'_c').find('.yui-panel').css('width', this.window[i].panel.width + 'px');
				$('#fileWindow'+i+'_c').find('.yui-panel').css('height', this.window[i].panel.height + 'px');
				$('#fileWindow'+i+'_c').children('.yui-panel').children(".bd").height(this.window[i].panel.height - 50);
				$('#fileWindow'+i+'_c').find(".windowContainer").find(".CodeMirror").height(this.window[i].panel.height - 50);
				this.window[i].resizeAll();
				count++;
			}
		}
		
				
		this.isMaximize = false;
		$(".tapMaxButtons").css("display", "none");
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method tileHorizontally 
	 **/
	tileHorizontally: function() {
		var count = 0;
		var eachWidth = $('#workspace').width()-9;
		var eachHeight = Math.floor(($('#workspace').height()-33) / this.countTheAliveWindows());
			
		for (var i = 0; i < this.index; i++) {
			if(this.window[i].alive) {
				if(this.window[i].status=="maximized") {
					this.window[i].maximize();
					this.isMaximize = true;
				}
				this.window[i].panel.left	= 4;
				this.window[i].panel.top	= 29+(eachHeight*count);
				this.window[i].panel.width	= eachWidth;
				this.window[i].panel.height	= eachHeight;
				
				if(this.window[i].designer){
					m.s(this.window[i].type);
					$('#fileWindow'+i+'_c').find(".canvasContainer").css('width', this.window[i].panel.width - 14 + 'px');
			  	 	$('#fileWindow'+i+'_c').find(".canvasContainer").css('height', this.window[i].panel.height - 68 + 'px');
			  	 	$('#fileWindow'+i+'_c').find(".ruler_x").css('width', this.window[i].panel.width - 15 + 'px');
			  	 	$('#fileWindow'+i+'_c').find(".ruler_y").css('height', this.window[i].panel.height - 65 + 'px');
				}
				
				$('#fileWindow'+i+'_c').css('left', this.window[i].panel.left + 'px');
				$('#fileWindow'+i+'_c').css('top', this.window[i].panel.top + 'px');
				$('#fileWindow'+i+'_c').css('width', this.window[i].panel.width + 'px');
				$('#fileWindow'+i+'_c').css('height', this.window[i].panel.height + 'px');
				$('#fileWindow'+i+'_c').css('z-index', i);

				this.window[i].panel.cfg.setProperty('left', this.window[i].panel.left + 'px');
				this.window[i].panel.cfg.setProperty('top', this.window[i].panel.top + 'px');

				$('#fileWindow'+i+'_c').find('.yui-panel').css('width', this.window[i].panel.width + 'px');
				$('#fileWindow'+i+'_c').find('.yui-panel').css('height', this.window[i].panel.height + 'px');
				$('#fileWindow'+i+'_c').children('.yui-panel').children(".bd").height(this.window[i].panel.height - 50);
				$('#fileWindow'+i+'_c').find(".windowContainer").find(".CodeMirror").height(this.window[i].panel.height - 50);
				this.window[i].resizeAll();
				count++;
			}
		}
			
		this.isMaximize = false;
		$(".tapMaxButtons").css("display", "none");
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method countTheAliveWindows
	 * @return {Number} The count. 
	 **/
	countTheAliveWindows: function() {
		var count = 0;
		
		for (var i = 0; i < this.index; i++) {
			if(this.window[i].alive) {
				count++;
			}
		}
		
		return count;
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method closeAll 
	 **/
	closeAll: function() {
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
		this.activeWindow = -1;
		
		this.window = null;
		delete this.window;
		this.window = $.makeArray();		
	}
};