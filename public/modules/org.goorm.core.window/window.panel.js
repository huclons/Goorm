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
 * @class panel
 * @extends window
 **/
org.goorm.core.window.panel = function () {
	/**
	 * This presents the current browser version
	 * @property panel
	 * @type Object
	 * @default null
	 **/
	this.panel = null;
	
	/**
	 * This presents the current browser version
	 * @property resize
	 * @type Object
	 * @default null
	 **/
	this.resize = null;
	
	/**
	 * This presents the current browser version
	 * @property contextMenu
	 * @type Object
	 * @default null
	 **/
	this.contextMenu = null;
	
	/**
	 * This presents the current browser version
	 * @property container
	 * @type Object
	 * @default null
	 **/	
	this.container = null;
	
	/**
	 * This presents the current browser version
	 * @property workspaceContainer
	 * @type Object
	 * @default null
	 **/
	this.workspaceContainer = null;
	
	/**
	 * This presents the current browser version
	 * @property tab
	 * @type Object
	 * @default null
	 **/
	this.tab = null;
	
	/**
	 * This presents the current browser version
	 * @property editor
	 * @type Object
	 * @default null
	 **/
	this.editor = null;
	
	/**
	 * This presents the current browser version
	 * @property designer
	 * @type Object
	 * @default null
	 **/
	this.designer = null;
	
	/**
	 * This presents the current browser version
	 * @property ruleEditor
	 * @type Object
	 * @default null
	 **/
	this.ruleEditor = null;
		
	/**
	 * This presents the current browser version
	 * @property title
	 * @type Object
	 * @default null
	 **/	
	this.title = null;
	
	/**
	 * This presents the current browser version
	 * @property type
	 * @type Object
	 * @default null
	 **/
	this.type = null;
	
	/**
	 * This presents the current browser version
	 * @property status
	 * @type Object
	 * @default null
	 **/
	this.status = null;
	
	/**
	 * This presents the current browser version
	 * @property filepath
	 * @type String
	 * @default null
	 **/
	this.filepath = null;
	
	/**
	 * This presents the current browser version
	 * @property filename
	 * @type String
	 * @default null
	 **/
	this.filename = null;
	
	/**
	 * This presents the current browser version
	 * @property filetype
	 * @type String
	 * @default null
	 **/
	this.filetype = null;
	
	/**
	 * This presents the current browser version
	 * @property left
	 * @type Object
	 * @default null
	 **/	
	this.left = null;
	
	/**
	 * This presents the current browser version
	 * @property top
	 * @type Object
	 * @default null
	 **/
	this.top = null;
	
	/**
	 * This presents the current browser version
	 * @property width
	 * @type Object
	 * @default null
	 **/
	this.width = null;
	
	/**
	 * This presents the current browser version
	 * @property height
	 * @type Object
	 * @default null
	 **/
	this.height = null;
	
	/**
	 * This presents the current browser version
	 * @property alive
	 * @type Object
	 * @default null
	 **/	
	this.alive = null;
	
	/**
	 * This presents the current browser version
	 * @property isFirstMaximize
	 * @type Object
	 * @default null
	 **/	
	this.isFirstMaximize = null;
	
	this.isSaved = null;
};

org.goorm.core.window.panel.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 * @param {Object} container The container.
	 * @param {String} title The title.
	 * @param {Object} workspaceContainer The workspaceContainer.
	 * @param {String} filepath The path of the file.
	 * @param {String} filename The name of the file.
	 * @param {String} filetype The type of the file.
	 **/
	init: function(container, title, workspaceContainer, filepath, filename, filetype, editor) {
		
		var self = this;
		
		this.isSaved = true;
		
		this.container = container;
		this.workspaceContainer = workspaceContainer;
		
		this.filepath = filepath;
		this.filename = filename;
		this.filetype = filetype;
		
		this.alive = true;
		this.isFirstMaximize = true;

		if(filetype == "url"){
			this.type = "codeMirrorEditor";
			this.filename = filepath;
		}
				
		this.panel = new YAHOO.widget.Panel(
			container, { 
				x: $(".yui-layout-unit-center").position().left + 5, 
				y: $(".yui-layout-unit-center").position().top + 30, 
				width: parseInt($("#" + self.workspaceContainer).width()/2),
				height: parseInt($("#" + self.workspaceContainer).height()/2), 
				visible: true, 
				underlay: "none",
				close: false,
				autofillheight: "body",
				draggable: true,
				constraintoviewport: true,
				context: ["showbtn", "tl", "bl"]
			} 
		);	
		
		//!
		
		
		//////////////////////////////////////////////////////////////////////////////////////////
		// Window setting
		//////////////////////////////////////////////////////////////////////////////////////////	
		
		this.title = title;
		this.panel.setHeader("<div style='overflow:auto' class='titlebar'><div class='windowTitle' style='float:left'>"+this.title+"</div><div class='windowButtons'><div class='minimize windowButton'></div> <div class='maximize windowButton'></div> <div class='close windowButton'></div></div></div>");
		this.panel.setBody("<div class='windowContainer'></div>");
		this.panel.setFooter("<div class='.footer'>footer</div>");
		this.panel.render();
		this.status = "unmaximized";
		//this.filename = filename;
		this.left = $("#"+container).css("left");
		this.top = $("#"+container).css("top");
		this.width = parseInt($("#" + self.workspaceContainer).width()/2);
		this.height = parseInt($("#" + self.workspaceContainer).height()/2);
		$("#" + this.container).width(this.width);
		$("#" + this.container).height(this.height);
		
		// Due to file type, create proper tool.
		if (editor == "Editor") {
			this.type = "Editor";
			
			var mode = core.fileTypes[this.inArray(this.filetype)].mode;
			
			this.editor = new org.goorm.core.edit();
			this.editor.init($("#"+container).find(".windowContainer"));
			this.editor.load(this.filepath, this.filename, this.filetype);
			this.editor.setMode(mode);
		}
		else if (editor == "Designer") {
			this.type = "Designer";
			
			this.designer = new org.goorm.core.design();
			this.designer.init($("#"+container).find(".windowContainer")[0], this.title);
			this.designer.load(this.filepath, this.filename, this.filetype);
		}
		else if (editor == "Rule_Editor") {
			this.type = "Rule_Editor";
			
			this.ruleEditor = new org.goorm.core.rule.edit();
			this.ruleEditor.init($("#"+container).find(".windowContainer")[0], this.title);
			this.ruleEditor.load(this.filepath, this.filename, this.filetype);
		}	
		else if (this.inArray(this.filetype) > -1) {
			this.type = core.fileTypes[this.inArray(this.filetype)].editor;
			 	
			if (this.type == "Editor") {
				var mode = core.fileTypes[this.inArray(this.filetype)].mode;
				
				this.editor = new org.goorm.core.edit();
				this.editor.init($("#"+container).find(".windowContainer"));
				this.editor.load(this.filepath, this.filename, this.filetype);
				this.editor.setMode(mode);
			}
			else if (this.type == "Designer") {
				this.designer = new org.goorm.core.design();
				this.designer.init($("#"+container).find(".windowContainer")[0], this.title);
				this.designer.load(this.filepath, this.filename, this.filetype);
			}
			else if (this.type == "Rule_Editor") {
				this.ruleEditor = new org.goorm.core.rule.edit();
				this.ruleEditor.init($("#"+container).find(".windowContainer")[0], this.title);
				this.ruleEditor.load(this.filepath, this.filename, this.filetype);
			}
		}
		else {
			this.type = "Editor";
			
			this.editor = new org.goorm.core.edit();
			this.editor.init($("#"+container).find(".windowContainer"));
			this.editor.load(this.filepath, this.filename, this.filetype);
			this.editor.setMode("text\/html");
		}
		
				
		

		this.setFooter(); //native function to call the this.panel.setFooter()		
		
		this.resizeAll();
		
		
		this.contextMenu = new org.goorm.core.menu.context();
		this.contextMenu.init("configs/menu/org.goorm.core.window/window.panel.titlebar.html", "window.panel.titlebar", $("#"+container).find(".titlebar"), this.title);
		
		this.resize = new YAHOO.util.Resize(container+"_c", {
			handles: 'all',
			minWidth: 100,
            minHeight: 100,
			status: false,
			proxy: false, 
		});
		
		this.resize.on("startResize", function(args) {
			if (this.cfg.getProperty("constraintoviewport")) { 
				var D = YAHOO.util.Dom; 
				
				var clientRegion = D.getClientRegion(); 
				var elRegion = D.getRegion(this.element); 
				
				self.resize.set("maxWidth", clientRegion.right - elRegion.left - YAHOO.widget.Overlay.VIEWPORT_OFFSET); 
				self.resize.set("maxHeight", clientRegion.bottom - elRegion.top - YAHOO.widget.Overlay.VIEWPORT_OFFSET); 
			} 
			else { 
				self.resize.set("maxWidth", null); 
				self.resize.set("maxHeight", null); 
			} 
			
			self.onStartResize();
		}, this.panel, true);
		
		this.resize.on("resize", function(args) {
			var panelWidth = args.width;
			var panelHeight = args.height;
	
			if(panelWidth != 0) {
            	this.cfg.setProperty("width", panelWidth + "px");
			}
			if(panelHeight != 0) {
            	this.cfg.setProperty("height", panelHeight + "px");
			}
			
			self.resizeAll()
			
			self.onResize();	
		}, this.panel, true);
		
		this.resize.on("endResize", function(args) {
			
			self.resizeAll();

		}, this.panel, true);
		

		//////////////////////////////////////////////////////////////////////////////////////////
		// Window events
		//////////////////////////////////////////////////////////////////////////////////////////
		
		//window body click event assign
		$("#"+container).click(function() {
			self.windowBodyClick();
			
			return false;
		});
		
		//title bar click event assign
		$("#"+container).find("#"+container+"_h").find(".titlebar").click(function() {
			
			return false;
		});
		
		//title bar mousedown event assign
		$("#"+container).find("#"+container+"_h").find(".titlebar").mousedown(function() {
			self.titlebarClick();
		});
		
		//title bar dbl click event assign
		$("#"+container).find("#"+container+"_h").find(".titlebar").dblclick(function() {
			self.titlebarDblclick();
			
			return false;
		});
		
		//minimize button click event assign
		$("#"+container).find(".minimize").click(function() {
			self.minimize();
			
			return false;
		});

		//maxmize button click event assign
		$("#"+container).find(".maximize").click(function() {
			self.maximize();
			
			return false;
		});
				
		//cloase button click event assign
		$("#"+container).find(".close").click(function() {
			self.close();
			
			return false;
		});
		
		
		
		this.plug();
		
		core.dialogProjectProperty.refreshToolBox();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method connect 
	 * @param {Object} tab The tab
	 **/
	connect: function(tab) {
		this.tab = tab;
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method windowBodyClick 
	 **/
	windowBodyClick: function() {
		this.activate();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method titlebarClick 
	 **/
	titlebarClick: function() {
		this.activate();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method titlebarDblclick 
	 **/
	titlebarDblclick: function() {
		this.maximize();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method setModified
	 **/
	setModified: function() {
	 	var titlebar = $("#" + this.container).find(".titlebar").find("div:first").html();
	  	titlebar = titlebar.replace(" *", "");
		$("#" + this.container).find(".titlebar").find("div:first").html(titlebar + " *");
		
		this.isSaved = false;
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method setSaved
	 **/
	setSaved: function() {
		var titlebar = $("#" + this.container).find(".titlebar").find("div:first").html();
	  	$("#" + this.container).find(".titlebar").find("div:first").html(titlebar.replace(" *", ""));
	  	
	  	this.isSaved = true;
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method maximize 
	 **/
	maximize: function (force, inactivate) {
		var self = this;
		
		if(this.status != "maximized" || force) {
			this.left = $("#" + this.container + "_c").offset().left;
			this.top = $("#" + this.container + "_c").offset().top;
			
			if(this.isFirstMaximize == true) {
				this.isFirstMaximize = false;
			}
			//else {
			//	this.width = $("#" + this.container + "_c").width();
			//	this.height = $("#" + this.container + "_c").height();
			//}
			
			//$("#" + this.container + "_c").offset({left:$("#" + this.workspaceContainer).offset().left - 1, top:$("#" + this.workspaceContainer).offset().top + 24});
			$("#" + this.container + "_c").offset({left:$("#" + this.workspaceContainer).offset().left - 1, top:$("#" + this.workspaceContainer).offset().top});
			$("#" + this.container + "_c").width($("#" + this.workspaceContainer).width());
			$("#" + this.container + "_c").height($("#" + this.workspaceContainer).height());
			
            this.panel.cfg.setProperty("width", $("#" + this.workspaceContainer).width() + "px");
            this.panel.cfg.setProperty("height", $("#" + this.workspaceContainer).height()+ "px");
			
			this.status = "maximized";
			core.mainLayout.workSpace.windowManager.isMaximize = true;
			$(".tapMaxButtons").css("display", "block");
			
			this.resize.lock();
			
			$("#" + this.container + "_c").find(".yui-resize-handle").each(function (i) {
				if ($(this).parent().attr("id") == self.container + "_c") {
									
					$(this).hide();
				}
			});
		}
		else {
			$("#" + this.container + "_c").offset({left:self.left, top:self.top});
			$("#" + this.container + "_c").width(this.width);
			$("#" + this.container + "_c").height(this.height);
			
			$("#" + this.container).width(this.width);
			$("#" + this.container).height(this.height);
			
			this.panel.cfg.setProperty("width", this.width + "px");
            this.panel.cfg.setProperty("height", this.height - 3 + "px");
			
			this.status = null;
			core.mainLayout.workSpace.windowManager.isMaximize = false;
			$(".tapMaxButtons").css("display", "none");
			
			this.resize.unlock();
			
			$("#" + this.container + "_c").find(".yui-resize-handle").show();
		}
		
		this.resizeAll();
		
		if (!inactivate || inactivate == undefined) {
			this.activate();
		}
	},	

	/**
	 * This function is an goorm core initializating function.  
	 * @method minimize 
	 **/
	minimize: function () {
		var self = this;
		
		if(this.status != "minimized") {			
			$("#" + self.container + "_c").hide("fast");
			
			this.status = "minimized";	
		}
		else {
			$("#" + self.container + "_c").show("slow");
			
			this.status = null;
		}
		
		this.resizeAll();
				
		this.activate();				
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method close 
	 **/
	close: function() {
		var self = this;
		
		if(this.isSaved) {
			this.alive = false;
			delete core.mainLayout.workSpace.windowManager.windowList.windows[this.filepath+this.filename];

			this.filename = null;
			this.filetype = null;
	
			$("#" + this.container).parent().remove();
			
			this.contextMenu.remove();
	
			if(this.tab) {
				this.tab.window = null;
				this.tab.close();
			}
			
			if (this.type == "Editor") {
				if(core.isCollaborationEditON)
				this.editor.collaboration.setEditOff();
			}
			else if (this.type == "Designer") {
				if(core.isCollaborationDrawON)
				this.designer.designer.canvas.setCollaborationOff();
			}
			
		
			for (var i = core.mainLayout.workSpace.windowManager.index-1; i > -1; i--) {
				var cnt = 0;
				if(core.mainLayout.workSpace.windowManager.window[i].alive) {
					cnt++;
					core.mainLayout.workSpace.windowManager.activeWindow = i;
					
					core.mainLayout.workSpace.windowManager.window[i].activate();
					
					break;
				}
				if(cnt==0) {
					core.mainLayout.workSpace.windowManager.activeWindow = -1;
					$(".tapMaxButtons").css("display", "none");
				}
			}
			localStorage["windowList"] = JSON.stringify(core.mainLayout.workSpace.windowManager.windowList);
			
			/*
			if (core.mainLayout.workSpace.windowManager.window.length > 0) {
				core.mainLayout.workSpace.windowManager.activeWindow = core.mainLayout.workSpace.windowManager.window.length - 1;
				core.mainLayout.workSpace.windowManager.window[core.mainLayout.workSpace.windowManager.window.length - 1].activate();
			}
			else {
				$(".tapMaxButtons").css("display", "none");
			}
			*/
			
			delete this;
		}
		else {
			confirmationSave.init({
				title: core.localization.msg["confirmationSaveTitle"], 
				message: "\""+this.filename+"\" "+core.localization.msg["confirmationSaveMessage"],
				yesText: core.localization.msg["confirmationYes"],
				cancelText: core.localization.msg["confirmationCancel"],
				noText: core.localization.msg["confirmationNo"],
				yes: function () {
					self.editor.save("close");
				}, cancel: function () {
				}, no: function () {
					self.isSaved = true;
					self.tab.isSaved = true;
					self.close();
				}
			});
			
			confirmationSave.panel.show();
		}
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method show 
	 **/
	show: function() {
		$("#" + this.container + "_c").show();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method hide 
	 **/
	hide: function() {
		$("#" + this.container + "_c").hide();
	},	
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method activate 
	 **/
	activate: function() {
	

		if(core.mainLayout.workSpace.windowManager.isMaximize) {
			this.status = "";
			this.maximize(false, true);
		}
	

	
		$("#"+this.workspaceContainer).find(".activated").each(function(i) {
			$(this).removeClass("activated");
		});
		
		$("#"+this.workspaceContainer).find(".yui-panel-container").each(function(i) {
			$(this).css("z-index", "2");
		});
		
		
		$("#" + this.container).find(".hd").addClass("activated");	
		$("#" + this.container).parent().css("z-index", "3");	

		//core.dialogProjectProperty.refreshToolBox();
		
		core.mainLayout.workSpace.windowManager.windowList.activeWindow = this.filepath+this.filename;
		//console.log(core.mainLayout.workSpace.windowManager.windowList.activeWindow);
		localStorage["windowList"] = JSON.stringify(core.mainLayout.workSpace.windowManager.windowList);
		this.tab.activate();
		core.dialogProjectProperty.refreshToolBox();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method setHeader
	 * @param {Object} contents The contents. 
	 **/
	setHeader: function(contents) {

	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method setBody
	 * @param {Object} contents The contents. 
	 **/
	setBody: function(contents) {

	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method setFooter 
	 * @param {Object} contents The contents.
	 **/
	setFooter: function(contents) {
		if(this.type == "Editor") {
			this.panel.setFooter("<div class='editorMessage'>Line: 0 | Col: 0</div>");
		}
		else if(this.type == "Designer") {
			this.panel.setFooter("<div class='designerMessage'></div><div class='mousePositionView'>(0, 0)</div>");
		}
		else if(this.filetype == "url") {
			this.panel.setFooter("<div class='editorMessage'>Line: 0 | Col: 0</div>");
		}
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method onStartResize 
	 **/
	onStartResize: function () {
		this.activate();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method onDrag 
	 **/
	onDrag: function () {

	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method onResize 
	 **/
	onResize: function () {
		this.activeWindow = i;
					
		if(this.panel.status != "maximized") {		
			this.width = this.panel.cfg.getProperty("width");
			this.height = this.panel.cfg.getProperty("height");
		}
		var windowContentHeight = $("#fileWindow"+i+"_c").height() - 47;
		$("#fileWindow"+i+"_c").find(".yui-content").height(windowContentHeight);
		
		/*
		if($("#codeEditor_fileWindow"+i+"Container").get(0)) {
			codeEditor_load_callback("codeEditor_fileWindow"+i+"Container");
		}
		
		if($("#codeViewer_fileWindow"+i+"Container").get(0)) {
			codeViewer_load_callback("codeViewer_fileWindow"+i+"Container");
		}
		
		if($("#generatedCode_fileWindow"+i+"Container").get(0)) {
			generatedCode_load_callback("generatedCode_fileWindow"+i+"Container");
		}
		*/
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method resizeAll 
	 **/
	resizeAll: function() {
		var height = $("#"+this.container).find(".bd").height();
		$("#"+this.container).find(".windowContainer").height(height);
			
		if(this.type == "Editor") {
			//$('#fileWindow'+i+'_c').find(".windowContainer").find(".CodeMirror").height(this.window[i].panel.height - 50);
			//$("#"+this.container).find(".windowContainer").height($("#"+this.container).height() - 53);
			$("#"+this.container).find(".windowContainer").find(".CodeMirror").height(height);
			$("#"+this.container).find(".windowContainer").find(".CodeMirror").find(".CodeMirror-scroll").css("height","100%");//height($("#"+this.container).height()-53);
			$("#"+this.container).find(".windowContainer").find(".CodeMirror").find(".CodeMirror-scroll").children("div").height("100%");
			$("#"+this.container).find(".windowContainer").find(".CodeMirror-gutter").height(height);
			
		}
		else if(this.type == "Rule_Editor") {
			$("#"+this.container).find(".windowContainer").find(".CodeMirror").height(height);
			$("#"+this.container).find(".windowContainer").find(".CodeMirror").find(".CodeMirror-scroll").css("height","100%");//height($("#"+this.container).height()-53);
			$("#"+this.container).find(".windowContainer").find(".CodeMirror").find(".CodeMirror-scroll").children("div").height("100%");
			$("#"+this.container).find(".windowContainer").find(".CodeMirror-gutter").height(height);
			
			this.ruleEditor.resizeAll();
		}
		else if(this.type == "Designer") {
			this.designer.resizeAll();
		}
	},
	
	/**
	 * This function get the index of pre-defined file type.   
	 * @method inArray
	 * @param {String} file type (Extension). 
	 **/
	inArray: function(keyword) {
		for (var i = 0; i < core.fileTypes.length; i++) {
			if (core.fileTypes[i].fileExtention == keyword){
				return i;
			}
		}
		return -1;
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method plug 
	 **/
	plug: function() {
		$(core).trigger("windowPanelPlug");
	}
};