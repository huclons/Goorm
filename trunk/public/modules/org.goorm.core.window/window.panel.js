/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.window.panel = function () {
	this.panel = null;
	this.resize = null;
	this.context_menu = null;
	this.container = null;
	this.workspace_container = null;
	this.tab = null;
	this.editor = null;
	this.designer = null;
	this.rule_editor = null;
	this.title = null;
	this.type = null;
	this.status = null;
	this.filepath = null;
	this.filename = null;
	this.filetype = null;
	this.left = null;
	this.top = null;
	this.width = null;
	this.height = null;
	this.alive = null;
	this.is_first_maximize = null;
	this.is_saved = null;
	this.project = null;
};

org.goorm.core.window.panel.prototype = {
	init: function(container, title, workspace_container, filepath, filename, filetype, editor) {
		
		var self = this;
		
		this.is_saved = true;
		
		this.container = container;
		this.workspace_container = workspace_container;
		
		this.filepath = filepath;
		this.filename = filename;
		this.filetype = filetype;
		
		this.project = core.status.current_project_path;
		
		this.alive = true;
		this.is_first_maximize = true;

		if(filetype == "url"){
			this.type = "codemirror_editor";
			this.filename = filepath;
		}
				
		this.panel = new YAHOO.widget.Panel(
			container, { 
				x: $(".yui-layout-unit-center").position().left + 5, 
				y: $(".yui-layout-unit-center").position().top + 30, 
				width: parseInt($("#" + self.workspace_container).width()/2),
				height: parseInt($("#" + self.workspace_container).height()/2), 
				visible: true, 
				underlay: "shadow",
				close: false,
				autofillheight: "body",
				draggable: true,
				constraintoviewport: true,
				context: ["showbtn", "tl", "bl"]
			} 
		);	

		
		//////////////////////////////////////////////////////////////////////////////////////////
		// window setting
		//////////////////////////////////////////////////////////////////////////////////////////	
		
		this.title = title;
		this.panel.setHeader("<div style='overflow:auto' class='titlebar'><div class='windowTitle' style='float:left'>"+this.title+"</div><div class='window_buttons'><div class='minimize window_button'></div> <div class='maximize window_button'></div> <div class='close window_button'></div></div></div>");
		this.panel.setBody("<div class='window_container'></div>");
		this.panel.setFooter("<div class='.footer'>footer</div>");
		this.panel.render();
		this.status = "unmaximized";
		//this.filename = filename;
		this.left = $("#"+container).css("left");
		this.top = $("#"+container).css("top");
		this.width = parseInt($("#" + self.workspace_container).width()/2);
		this.height = parseInt($("#" + self.workspace_container).height()/2);
		$("#" + this.container).width(this.width);
		$("#" + this.container).height(this.height);
		
		// Due to file type, create proper tool.
		if (editor == "Editor") {
			this.type = "Editor";
			
			var mode = core.filetypes[this.inArray(this.filetype)].mode;
			
			//for Test
			mode = "javascript";
			
			this.editor = new org.goorm.core.edit();
			this.editor.init($("#"+container).find(".window_container"));
			this.editor.load(this.filepath, this.filename, this.filetype);
			this.editor.set_mode(mode);
		}
		else if (editor == "Designer") {
			this.type = "Designer";
			
			this.designer = new org.goorm.core.design();
			this.designer.init($("#"+container).find(".window_container")[0], this.title);
			this.designer.load(this.filepath, this.filename, this.filetype);
		}
		else if (editor == "Rule_Editor") {
			this.type = "Rule_Editor";
			
			this.rule_editor = new org.goorm.core.rule.edit();
			this.rule_editor.init($("#"+container).find(".window_container")[0], this.title);
			this.rule_editor.load(this.filepath, this.filename, this.filetype);
		}	
		else if (this.inArray(this.filetype) > -1) {
			this.type = core.filetypes[this.inArray(this.filetype)].editor;
			 	
			if (this.type == "Editor") {
				var mode = core.filetypes[this.inArray(this.filetype)].mode;
				
				this.editor = new org.goorm.core.edit();
				this.editor.init($("#"+container).find(".window_container"));
				this.editor.load(this.filepath, this.filename, this.filetype);
				this.editor.set_mode(mode);
			}
			else if (this.type == "Designer") {
				this.designer = new org.goorm.core.design();
				this.designer.init($("#"+container).find(".window_container")[0], this.title);
				this.designer.load(this.filepath, this.filename, this.filetype);
			}
			else if (this.type == "Rule_Editor") {
				this.rule_editor = new org.goorm.core.rule.edit();
				this.rule_editor.init($("#"+container).find(".window_container")[0], this.title);
				this.rule_editor.load(this.filepath, this.filename, this.filetype);
			}
		}
		else {
			this.type = "Editor";
			
			this.editor = new org.goorm.core.edit();
			
			this.editor.init($("#"+container).find(".window_container"));
						
			this.editor.load(this.filepath, this.filename, this.filetype);
			
			var mode = "javascript";
			this.editor.set_mode(mode);
		}
		
		this.set_footer(); //native function to call the this.panel.setFooter()		
		
		this.resize_all();
		
		
		
		this.context_menu = new org.goorm.core.menu.context();
		this.context_menu.init("configs/menu/org.goorm.core.window/window.panel.titlebar.html", "window.panel.titlebar", $("#"+container).find(".titlebar"), this.title);
		
		this.resize = new YAHOO.util.Resize(container+"_c", {
			handles: 'all',
			minWidth: 100,
            minHeight: 100,
			status: false,
			proxy: false, 
		});
		
		
		
		this.resize.on("startResize", function(args) {
			if (this.cfg.get_property("constraintoviewport")) { 
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
			
			self.on_start_resize();
		}, this.panel, true);
		
		this.resize.on("resize", function(args) {
			var panel_width = args.width;
			var panel_height = args.height;
	
			if(panel_width != 0) {
            	this.cfg.setProperty("width", panel_width + "px");
			}
			if(panel_height != 0) {
            	this.cfg.setProperty("height", panel_height + "px");
			}
			
			self.resize_all()
			
			self.on_resize();	
		}, this.panel, true);
		
		this.resize.on("endResize", function(args) {
			self.resize_all();

		}, this.panel, true);
		
		
		
		
		//////////////////////////////////////////////////////////////////////////////////////////
		// window events
		//////////////////////////////////////////////////////////////////////////////////////////
		
		//window body click event assign
		$("#"+container).click(function() {
			self.window_body_click();
			
			return false;
		});
		
		//title bar click event assign
		$("#"+container).find("#"+container+"_h").find(".titlebar").click(function() {
			
			return false;
		});
		
		//title bar mousedown event assign
		$("#"+container).find("#"+container+"_h").find(".titlebar").mousedown(function() {
			self.titlebar_click();
		});
		
		//title bar dbl click event assign
		$("#"+container).find("#"+container+"_h").find(".titlebar").dblclick(function() {
			self.titlebar_dblclick();
			
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
		
		core.dialog.project_property.refresh_toolbox();
		
	},
	
	connect: function(tab) {
		this.tab = tab;
	},
	
	window_body_click: function() {
		this.activate();
	},
	
	titlebar_click: function() {
		this.activate();
	},
	
	titlebar_dblclick: function() {
		this.maximize();
	},
	
	set_modified: function() {
	 	var titlebar = $("#" + this.container).find(".titlebar").find("div:first").html();
	  	titlebar = titlebar.replace(" *", "");
		$("#" + this.container).find(".titlebar").find("div:first").html(titlebar + " *");
		
		this.is_saved = false;
	},
	
	set_saved: function() {
		var titlebar = $("#" + this.container).find(".titlebar").find("div:first").html();
	  	$("#" + this.container).find(".titlebar").find("div:first").html(titlebar.replace(" *", ""));
	  	
	  	this.is_saved = true;
	},
	
	maximize: function (force, inactivate) {
		var self = this;
		
		if(this.status != "maximized" || force) {
			this.left = $("#" + this.container + "_c").offset().left;
			this.top = $("#" + this.container + "_c").offset().top;
			
			if(this.is_first_maximize == true) {
				this.is_first_maximize = false;
			}
			//else {
			//	this.width = $("#" + this.container + "_c").width();
			//	this.height = $("#" + this.container + "_c").height();
			//}
			
			//$("#" + this.container + "_c").offset({left:$("#" + this.workspace_container).offset().left - 1, top:$("#" + this.workspace_container).offset().top + 24});
			$("#" + this.container + "_c").offset({left:$("#" + this.workspace_container).offset().left - 1, top:$("#" + this.workspace_container).offset().top});
			$("#" + this.container + "_c").width($("#" + this.workspace_container).width());
			$("#" + this.container + "_c").height($("#" + this.workspace_container).height());
			
            this.panel.cfg.setProperty("width", $("#" + this.workspace_container).width() + "px");
            this.panel.cfg.setProperty("height", $("#" + this.workspace_container).height()+ "px");
			
			this.status = "maximized";
			core.module.layout.workspace.window_manager.is_maximized = true;
			$(".tab_max_buttons").css("display", "block");
			
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
			core.module.layout.workspace.window_manager.is_maximized = false;
			$(".tab_max_buttons").css("display", "none");
			
			this.resize.unlock();
			
			$("#" + this.container + "_c").find(".yui-resize-handle").show();
		}
		
		this.resize_all();
		
		if (!inactivate || inactivate == undefined) {
			this.activate();
		}
	},	

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
		
		this.resize_all();
				
		this.activate();				
	},
	
	close: function() {
		var self = this;
		
		if(this.is_saved) {
			this.alive = false;
			delete core.module.layout.workspace.window_manager.window_list.windows[this.filepath+this.filename];

			this.filename = null;
			this.filetype = null;
	
			$("#" + this.container).parent().remove();
			
			this.context_menu.remove();
	
			if(this.tab) {
				this.tab.window = null;
				this.tab.close();
			}
			
			if (this.type == "Editor") {
				if(core.flag.collaboration_on)
				this.editor.collaboration.set_edit_off();
			}
			else if (this.type == "Designer") {
				if(core.flag.collaboration_draw_on)
				this.designer.designer.canvas.set_collaboration_off();
			}
			
		
			for (var i = core.module.layout.workspace.window_manager.index-1; i > -1; i--) {
				var cnt = 0;
				if(core.module.layout.workspace.window_manager.window[i].alive) {
					cnt++;
					core.module.layout.workspace.window_manager.active_window = i;
					
					core.module.layout.workspace.window_manager.window[i].activate();
					
					break;
				}
				if(cnt==0) {
					core.module.layout.workspace.window_manager.active_window = -1;
					$(".tab_max_buttons").css("display", "none");
				}
			}
			localStorage["window_list"] = JSON.stringify(core.module.layout.workspace.window_manager.window_list);
			
			/*
			if (core.module.layout.workspace.window_manager.window.length > 0) {
				core.module.layout.workspace.window_manager.active_window = core.module.layout.workspace.window_manager.window.length - 1;
				core.module.layout.workspace.window_manager.window[core.module.layout.workspace.window_manager.window.length - 1].activate();
			}
			else {
				$(".tab_max_buttons").css("display", "none");
			}
			*/
			
			delete this;
		}
		else {
			confirmation_save.init({
				title: core.module.localization.msg["confirmation_save_title"], 
				message: "\""+this.filename+"\" "+core.module.localization.msg["confirmation_save_message"],
				yes_text: core.module.localization.msg["confirmation_yes"],
				cancel_text: core.module.localization.msg["confirmation_cancel"],
				no_text: core.module.localization.msg["confirmation_no"],
				yes: function () {
					self.editor.save("close");
				}, cancel: function () {
				}, no: function () {
					self.is_saved = true;
					self.tab.is_saved = true;
					self.close();
				}
			});
			
			confirmation_save.panel.show();
		}
	},
	
	show: function() {
		$("#" + this.container + "_c").show();
	},
	
	hide: function() {
		$("#" + this.container + "_c").hide();
	},	
	
	activate: function() {
	

		if(core.module.layout.workspace.window_manager.is_maximized) {
			this.status = "";
			this.maximize(false, true);
		}
	

	
		$("#"+this.workspace_container).find(".activated").each(function(i) {
			$(this).removeClass("activated");
		});
		
		$("#"+this.workspace_container).find(".yui-panel-container").each(function(i) {
			$(this).css("z-index", "2");
		});
		
		
		$("#" + this.container).find(".hd").addClass("activated");	
		$("#" + this.container).parent().css("z-index", "3");	

		//core.dialog.project_property.refresh_toolbox();
		
		core.module.layout.workspace.window_manager.window_list.active_window = this.filepath + this.filename;
		localStorage["window_list"] = JSON.stringify(core.module.layout.workspace.window_manager.window_list);
		
		this.tab.activate();
		core.dialog.project_property.refresh_toolbox();
	},
	
	set_header: function(contents) {

	},
	
	set_body: function(contents) {

	},
	
	set_footer: function(contents) {
		if(this.type == "Editor") {
			this.panel.setFooter("<div class='editor_message'>Line: 0 | Col: 0</div>");
		}
		else if(this.type == "Designer") {
			this.panel.setFooter("<div class='designer_message'></div><div class='mouse_position_view'>(0, 0)</div>");
		}
		else if(this.filetype == "url") {
			this.panel.setFooter("<div class='editor_message'>Line: 0 | Col: 0</div>");
		}
	},
	
	on_start_resize: function () {
		this.activate();
	},
	
	on_drag: function () {

	},
	
	on_resize: function () {
		this.active_window = i;
					
		if(this.panel.status != "maximized") {		
			this.width = this.panel.cfg.get_property("width");
			this.height = this.panel.cfg.get_property("height");
		}
		var window_content_height = $("#filewindow"+i+"_c").height() - 47;
		$("#filewindow"+i+"_c").find(".yui-content").height(window_content_height);
		
		/*
		if($("#code_editor_filewindow"+i+"Container").get(0)) {
			code_editor_load_callback("code_editor_filewindow"+i+"Container");
		}
		
		if($("#codeViewer_filewindow"+i+"Container").get(0)) {
			codeViewer_load_callback("codeViewer_filewindow"+i+"Container");
		}
		
		if($("#generatedCode_filewindow"+i+"Container").get(0)) {
			generatedCode_load_callback("generatedCode_filewindow"+i+"Container");
		}
		*/
	},
	
	resize_all: function() {
		var height = $("#"+this.container).find(".bd").height();
		$("#"+this.container).find(".window_container").height(height);
			
		if(this.type == "Editor") {
			//$('#filewindow'+i+'_c').find(".window_container").find(".CodeMirror").height(this.window[i].panel.height - 50);
			//$("#"+this.container).find(".window_container").height($("#"+this.container).height() - 53);
			$("#"+this.container).find(".window_container").find(".CodeMirror").height(height);
			$("#"+this.container).find(".window_container").find(".CodeMirror").find(".CodeMirror-scroll").css("height","100%");//height($("#"+this.container).height()-53);
			$("#"+this.container).find(".window_container").find(".CodeMirror").find(".CodeMirror-scroll").children("div").height("100%");
			$("#"+this.container).find(".window_container").find(".CodeMirror-gutter").height(height);
			
		}
		else if(this.type == "Rule_Editor") {
			$("#"+this.container).find(".window_container").find(".CodeMirror").height(height);
			$("#"+this.container).find(".window_container").find(".CodeMirror").find(".CodeMirror-scroll").css("height","100%");//height($("#"+this.container).height()-53);
			$("#"+this.container).find(".window_container").find(".CodeMirror").find(".CodeMirror-scroll").children("div").height("100%");
			$("#"+this.container).find(".window_container").find(".CodeMirror-gutter").height(height);
			
			this.rule_editor.resize_all();
		}
		else if(this.type == "Designer") {
			this.designer.resize_all();
		}
	},
	
	inArray: function(keyword) {
		for (var i = 0; i < core.filetypes.length; i++) {
			if (core.filetypes[i].file_extension == keyword){
				return i;
			}
		}
		return -1;
	},
	
	plug: function() {
		$(core).trigger("window_panel_plug");
	}
};