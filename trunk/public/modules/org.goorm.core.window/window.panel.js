/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jshint newcap:false, debug:true, unused: true, evil: true, devel: true, plusplus: false, browser: true, jquery: true, undef:false */
/*clientside jslint comment for global */
/*global org: false, core: false, YAHOO: false, confirmation_save: false */
/*jshint unused: false */



org.goorm.core.window.panel = function () {
	this.panel = null;
	this.resize = null;
	this.context_menu = null;
	this.container = null;
	this.workspace_container = null;
	this.tab = null;
	this.editor = null;
	this.designer = null;
	this.terminal = null;
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
	this.zindex = 2;
	this.alive = null;
	this.is_first_maximize = null;
	this.is_saved = null;
	this.project = null;
	this.history_window = {};
	this.index = 0;
};

org.goorm.core.window.panel.prototype = {
	init: function (container, title, workspace_container, filepath, filename, filetype, editor, options) {
		var self = this;
		var options = options || {};

		this.is_saved = true;

		this.container = container;
		this.workspace_container = workspace_container;

		if (filetype === "" || filetype == "etc") {
			filetype = "txt";
		} else if (filetype == "url") {
			this.type = "codemirror_editor";
			filename = filepath;
		}
		
		this.filepath = filepath;
		this.filename = filename;
		this.filetype = filetype;

		for (var i = 0; i < core.filetypes.length; i++) {
			if (filetype == core.filetypes[i].file_extension) {
				editor = core.filetypes[i].editor;
				break;
			}
		}

		if (!editor) editor = 'Editor';

		this.project = core.status.current_project_path;

		this.alive = true;
		this.is_first_maximize = true;

		var target_active_window = core.module.layout.workspace.window_manager.active_window - 1;

		var new_x;
		var new_y;

		var width = parseInt($("#" + self.workspace_container).width() / 2, 10);
		var height = parseInt($("#" + self.workspace_container).height() / 2, 10);

		if (target_active_window == -1) {
			new_x = $(".yui-layout-unit-center").position().left + 5;
			new_y = $(".yui-layout-unit-center").position().top + 30;
		} else {
			var target_container = core.module.layout.workspace.window_manager.window[target_active_window].container;
			new_x = $('#' + target_container).offset().left + 30;
			new_y = $('#' + target_container).offset().top + 30;
		}

		if (width <= 200 || height <= 300) {
			width = 450;
			height = 250;
		}

		if (new_x + width > $(".yui-layout-unit-center").position().left + $(".yui-layout-unit-center #workspace").width()) {
			new_x = $(".yui-layout-unit-center").position().left + 5;
			new_y = $(".yui-layout-unit-center").position().top + 30; 
		}

		this.panel = new YAHOO.widget.Panel(
			container, {
				x: new_x,
				y: new_y,
				width: width,
				height: height,
				visible: true,
				underlay: "none",
				close: false,
				autofillheight: "body",
				draggable: true,
				constraintoviewport: true,
				context: ["showbtn", "tl", "bl"]
			}
		);

		// window setting
		this.panel.setHeader("<div style='overflow:auto' class='titlebar'><div class='panel_image window_tab-toolbar-connect'></div><div class='window_title' style='float:left'>" + this.title + "</div><div class='window_buttons'><div class='minimize window_button'></div> <div class='maximize window_button'></div><div class='close window_button'></div></div></div>");
		this.panel.setBody("<div class='window_container'></div>");
		this.panel.setFooter("<div class='.footer'>footer</div>");
		this.panel.render();
		this.set_title();
		this.status = "unmaximized";
		this.left = $("#" + container).css("left");
		this.top = $("#" + container).css("top");
		this.width = parseInt($("#" + self.workspace_container).width() / 1.3, 10);
		this.height = parseInt($("#" + self.workspace_container).height() / 1.5, 10);
		this.zindex = this.zindex + core.module.layout.workspace.window_manager.window.length - 1;
		this.parent = $('#' + container).parent()[0];

		$('#workspace_window_list').css('z-index', this.zindex + 1);

		if (this.width <= 200 || this.height <= 300) {
			this.width = 450;
			this.height = 250;
		}

		$("#" + this.container).width(this.width);
		$("#" + this.container).height(this.height);
		$("#" + this.container).parent().height(this.height);
		$("#" + this.container).parent().css('z-index', this.zindex);

		if (editor == "Start_Page") {
			this.type = "Start_Page";
			console.log('hi start page');
		}
		// Due to file type, create proper tool.
		else if (editor == "Editor") {

			this.type = "Editor";

			var mode;

			if (this.filetype == "url") {
				mode = core.filetypes[this.inArray("html")].mode;
			} else {
				mode = core.filetypes[this.inArray(this.filetype)].mode;
			}

			this.editor = new org.goorm.core.edit();
			this.editor.init($("#" + container).find(".window_container"), null, this.filepath, options);
			this.editor.load(this.filepath, this.filename, this.filetype);
			this.editor.set_mode(mode);

		} else if (editor == "Designer") {
			this.type = "Designer";
			this.designer = new org.goorm.core.design();
			this.designer.init($("#" + container).find(".window_container")[0], this.title);
			this.designer.load(this.filepath, this.filename, this.filetype);
		} else if (editor == "Terminal") {
			this.type = "Terminal";

			this.title = "Terminal";

			this.terminal = new org.goorm.core.terminal();

			this.terminal.init($("#" + container).find(".window_container"), this.filename, true);

			$("#" + container).find(".window_container").css("overflow", "auto");

			this.panel.setFooter("");
		} else if (editor == "WebView") {
			this.type = "WebView";
			var title = (options.title) ? options.title : this.title;
			
			var iframe = $("<iframe src='"+this.filepath+"/"+this.filename+"' style='width:100%;height:100%;border:0;background:white'>");
			$(this.panel.element).find(".window_container").css("overflow", "hidden").html(iframe)
				.end().find(".window_title").text("[Web view] "+title);

			// iframe cannot bind onclick event
			iframe.on("load", function(){
				$(this).contents().find("body").on("click", function(){
					$(self.panel.element).find(".window_container").mousedown();
				}).on("keydown keypress keyup", function(e){
					$(document).trigger(e);
				});
			});

			this.panel.setFooter("Web view is running");
		} else if (this.inArray(this.filetype) > -1) {
			this.type = core.filetypes[this.inArray(this.filetype)].editor;

			if (this.type == "Editor") {
				var mode = core.filetypes[this.inArray(this.filetype)].mode;
				this.editor = new org.goorm.core.edit();
				this.editor.init($("#" + container).find(".window_container"), null, this.filepath);
				this.editor.load(this.filepath, this.filename, this.filetype);
				this.editor.set_mode(mode);
			} else if (this.type == "Designer") {
				this.designer = new org.goorm.core.design();
				this.designer.init($("#" + container).find(".window_container")[0], this.title);
				this.designer.load(this.filepath, this.filename, this.filetype);
			} else if (this.type == "Rule_Editor") {
				this.rule_editor = new org.goorm.core.rule.edit();
				this.rule_editor.init($("#" + container).find(".window_container")[0], this.title);
				this.rule_editor.load(this.filepath, this.filename, this.filetype);
			}
		} else { // default txt
			var mode = 'text/javascript';

			this.editor = new org.goorm.core.edit();
			this.editor.init($("#" + container).find(".window_container"));
			this.editor.load(this.filepath, this.filename, 'txt');
			this.editor.set_mode(mode);
		}

		this.set_footer(); //native function to call the this.panel.setFooter();

		this.resize_all();

		this.context_menu = new org.goorm.core.menu.context();
		this.context_menu.init("configs/menu/org.goorm.core.window/window.panel.titlebar.html", "window.panel.titlebar", $("#" + container).find(".titlebar"), this.title);

		this.resize = new YAHOO.util.Resize(container + "_c", {
			handles: 'all',
			minWidth: 300,
			minHeight: 200,
			status: false,
			proxy: false
		});

		this.resize.on("startResize", function (args) {
			if (this.cfg.getProperty("constraintoviewport")) {
				var D = YAHOO.util.Dom;

				var clientRegion = D.getClientRegion();
				var elRegion = D.getRegion(this.element);

				self.resize.set("maxWidth", clientRegion.right - elRegion.left - YAHOO.widget.Overlay.VIEWPORT_OFFSET);
				self.resize.set("maxHeight", clientRegion.bottom - elRegion.top - YAHOO.widget.Overlay.VIEWPORT_OFFSET);
			} else {
				self.resize.set("maxWidth", null);
				self.resize.set("maxHeight", null);
			}

			self.activate();
		}, this.panel, true);

		this.resize.on("resize", function (args) {
			var D = YAHOO.util.Dom;
			var elRegion = D.getRegion(this.element);

			var panel_left = elRegion.left;
			var panel_top = elRegion.top;
			var panel_right = elRegion.left + elRegion.width;
			var panel_bottom = elRegion.top + elRegion.height;
			var panel_width = args.width;
			var panel_height = args.height;

			if (panel_width !== 0 && panel_left >= ($("#" + self.workspace_container).offset().left - 1) && panel_right <= ($("#" + self.workspace_container).offset().left + $("#" + self.workspace_container).width() - 5)) {
				this.cfg.setProperty("width", panel_width + "px");
			} else if (panel_width !== 0 && panel_right > ($("#" + self.workspace_container).offset().left + $("#" + self.workspace_container).width() - 5)) {
				this.cfg.setProperty("width", (($("#" + self.workspace_container).offset().left - 5 + $("#" + self.workspace_container).width()) - panel_left) + "px");
			}

			if (panel_height !== 0 && panel_top >= $("#" + self.workspace_container).offset().top && panel_bottom <= ($("#" + self.workspace_container).offset().top + $("#" + self.workspace_container).height() - 15)) {
				this.cfg.setProperty("height", panel_height + "px");
			} else if (panel_height !== 0 && panel_bottom > ($("#" + self.workspace_container).offset().top + $("#" + self.workspace_container).height() - 15)) {
				this.cfg.setProperty("height", (($("#" + self.workspace_container).offset().top - 15 + $("#" + self.workspace_container).height()) - panel_top) + "px");
			} else if (panel_height === 0) {
				var height = $('#' + self.container).height();
				this.cfg.setProperty("height", height);
			}

			if (panel_width >= $("#" + self.workspace_container).width() - 5)
				this.cfg.setProperty("width", $("#" + self.workspace_container).width() - 5 + "px");
			if (panel_height >= $("#" + self.workspace_container).height() - 15)
				this.cfg.setProperty("height", $("#" + self.workspace_container).height() - 15 + "px");

			self.resize_all();
		}, this.panel, true);

		this.resize.on("endResize", function (args) {

			self.width = $("#" + self.container + "_c").width();
			self.height = $("#" + self.container + "_c").height();

			$("#" + self.container).width(self.width + 'px');
			$("#" + self.container).height(self.height + 'px');

			self.resize_end();
			self.resize_all();
			self.refresh();

			$(document).trigger(self.filename + "_resized");
		}, this.panel, true);

				// window events
		
		//window body click event assign
		$("#" + container + ' .window_container').mousedown(function () {
			if (self.editor !== null) {
				if (self.editor.jump_to_definition.is_show) {
					self.editor.jump_to_definition.hide();
				}
			}

			self.window_body_click();

			return false;
		});

		//title bar click event assign
		$("#" + container).find("#" + container + "_h").find(".titlebar").click(function () {
			core.module.layout.workspace.window_manager.hide_all_context_menu();
			return false;
		});

		//title bar mousedown event assign
		$("#" + container).find("#" + container + "_h").find(".titlebar").mousedown(function () {
			self.activate();
		});

		//title bar mouseup event assign
		$("#" + container).find("#" + container + "_h").find(".titlebar").mouseup(function () {
			self.left = $("#" + self.container + "_c").offset().left;
			self.top = $("#" + self.container + "_c").offset().top;
		});

		//title bar dbl click event assign
		$("#" + container).find("#" + container + "_h").find(".titlebar").dblclick(function () {
			core.module.layout.workspace.window_manager.maximize_all();

			return false;
		});

		//footer mousedown event assign
		$("#" + container).find(".ft").mousedown(function () {
			self.activate();
		});

		//minimize button click event assign
		$("#" + container).find(".minimize").click(function () {
			self.minimize();

			return false;
		});

		//maxmize button click event assign
		$("#" + container).find(".maximize").click(function () {
			core.module.layout.workspace.window_manager.maximize_all();

			return false;
		});

		//close button click event assign
		$("#" + container).find(".close").click(function () {
			self.close();

			return false;
		});

		this.plug();

		core.dialog.project_property.refresh_toolbox();

		// $(core).on("on_project_open.penel", function () {
		// 	self.set_title();
		// });

		window.setTimeout(function () {
			self.init_context_event();
		}, 500);

		this.panel.dd.on("endDragEvent", function (e) {
			var panel_x = $("#" + self.container).offset().left;
			var panel_y = $("#" + self.container).offset().top;
			var panel_width = parseInt($("#" + self.container).css("width"), 10);
			var panel_height = parseInt($("#" + self.container).css("height"), 10);

			var workspace_x = $("#" + self.workspace_container).offset().left;
			var workspace_y = $("#" + self.workspace_container).offset().top;
			var workspace_width = parseInt($("#" + self.workspace_container).css("width"), 10);
			var workspace_height = parseInt($("#" + self.workspace_container).css("height"), 10);

			if (panel_x < workspace_x) {
				panel_x = workspace_x - 1;
			} else if (panel_x + panel_width > workspace_x + workspace_width) {
				panel_x = (workspace_x + workspace_width) - panel_width;
			}

			if (panel_y + panel_height > workspace_y + workspace_height) {
				panel_y = (workspace_y + workspace_height) - panel_height;
			}

			if ( panel_y < workspace_y + 25 ) {
				panel_y = workspace_y + 25;
			}

			self.panel.moveTo(panel_x, panel_y);
		}, this.panel.dd, true);

		if (core.is_mobile) {
			self.maximize();
		}
	},

	connect: function (tab) {
		this.tab = tab;
	},

	window_body_click: function () {
		this.activate();
	},

	titlebar_click: function () {
		this.activate();
	},

	set_modified: function () {
		var titlebar = $("#" + this.container).find(".window_title").html();
		titlebar = titlebar.replace(" *", "");
		$("#" + this.container).find(".window_title").html(titlebar + " *");

		this.is_saved = false;
	},

	set_saved: function () {
		var titlebar = $("#" + this.container).find(".window_title").html();
		$("#" + this.container).find(".window_title").html(titlebar.replace(" *", ""));

		this.is_saved = true;
	},

	maximize: function () {
		if (this.left === 0 || this.left === null) {
			this.left = $("#" + this.container + "_c").offset().left;
		}
		if (this.top === 0 || this.top === null) {
			this.top = $("#" + this.container + "_c").offset().top;
		}
		if (this.width === 0 || this.width === null) {
			this.width = $("#" + this.container + "_c").width();
		}
		if (this.height === 0 || this.height === null) {
			this.height = $("#" + this.container + "_c").height();
		}

		$("#" + this.container + "_c").offset({
			left: $("#" + this.workspace_container).offset().left - 1,
			top: $("#" + this.workspace_container).offset().top
		});
		$("#" + this.container + "_c").width($("#" + this.workspace_container).width());
		$("#" + this.container + "_c").height($("#" + this.workspace_container).height());

		$("#" + this.container).width($("#" + this.workspace_container).width());
		$("#" + this.container).height($("#" + this.workspace_container).height());

		$("#" + this.container).find(".ft").addClass("maximized_ft");

		this.panel.cfg.setProperty("width", $("#" + this.workspace_container).width() + "px");
		this.panel.cfg.setProperty("height", $("#" + this.workspace_container).height() + "px");

		this.status = "maximized";

		$(".tab_max_buttons").show();
		if(this.resize)
			this.resize.lock();
		this.resize_all();
		this.refresh();

		$(document).trigger(this.filename + "_resized");
	},

	unmaximize: function () {
		if (typeof (this.left) == 'string' && this.left.indexOf('px')) {
			this.left = this.left.split('px')[0];
		}

		if (typeof (this.top) == 'string' && this.top.indexOf('px')) {
			this.top = this.top.split('px')[0];
		}

		var workspace = $('#workspace').offset();
		var tab_height = $('#workspace_window_list').height();

		if (this.top < workspace.top + tab_height + 5) {
			this.top = workspace.top + tab_height + 5;
		}

		if (this.left < workspace.left + 5) {
			this.left = workspace.left + 5;
		}

		$("#" + this.container + "_c").offset({
			left: this.left,
			top: this.top
		});
		$("#" + this.container + "_c").width(this.width);
		$("#" + this.container + "_c").height(this.height);

		$("#" + this.container).width(this.width);
		$("#" + this.container).height(this.height);

		$("#" + this.container).find(".ft").removeClass("maximized_ft");

		this.panel.cfg.setProperty("width", this.width + "px");
		this.panel.cfg.setProperty("height", this.height + "px");

		this.status = null;

		$(".tab_max_buttons").hide();
		if(this.resize)
			this.resize.unlock();
		this.resize_all();
		this.refresh();

		this.left = 0;
		this.top = 0;
		this.width = 0;
		this.height = 0;

		$(document).trigger(this.filename + "_resized");
	},

	minimize: function () {
		var self = this;
		
		$("#" + self.container + "_c").hide("fast");

		this.resize_all();
		this.refresh();
		this.activate();
	},

	close: function () {
		var self = this;

		var window_manager = core.module.layout.workspace.window_manager;

		core.module.layout.workspace.window_manager.history_window = {};
		core.module.layout.workspace.window_manager.history_window.filename = this.filename;
		core.module.layout.workspace.window_manager.history_window.filetype = this.filetype;
		core.module.layout.workspace.window_manager.history_window.filepath = this.filepath;

		// if (self.filename !== "debug")
		// 	$(core).off("on_project_open.penel");

		// clear highlight
		if (this.type === 'Terminal') {
			var project = this.project;
			for (var i = 0; i < window_manager.window.length; i++) {
				var target_window = window_manager.window[i];
				if (target_window.project == project && target_window.editor) target_window.editor.clear_highlight();
			}
		}
		if (this.filename === 'debug') {
			$("a[action=debug_terminate]").trigger('click', true);
		}

		if (this.is_saved) {
			$(document).trigger(this.filename + "_closed");

			//outline tree clear
			core.module.layout.object_explorer.clear();

			this.alive = false;

			this.filename = null;
			this.filetype = null;

			$(this.parent).remove();
			this.context_menu.remove();

			if (this.tab) {
				this.tab.window = null;
				this.tab.close();
			}

			window_manager.window.remove(this.index, this.index);
			window_manager.index--;
			window_manager.active_filename = "";

			if (core.module.layout.history)
				core.module.layout.history.deactivated();

			var new_window = window_manager.window.length - 1;
			if (new_window != -1) {
				window_manager.window[new_window].activate();
			} else {
				if (self.editor && self.editor.collaboration) {
					self.editor.collaboration.update_editor({
						filename: ""
					});
				}
				$(".tab_max_buttons").hide();
			}
			window_manager.active_window = new_window;

			// $.get("edit/get_object_explorer", {
			// 	selected_file_path: core.module.layout.workspace.window_manager.active_filename
			// }, function (data) {
			// 	core.module.layout.object_explorer.refresh('object_tree', data);
			// });

			delete this;
		} else {
			confirmation_save.init({
				message: "\"" + this.filename + "\" " + core.module.localization.msg.confirmation_save_message,
				yes_text: core.module.localization.msg.confirmation_yes,
				cancel_text: core.module.localization.msg.confirmation_cancel,
				no_text: core.module.localization.msg.confirmation_no,
				title: "Close...",

				yes: function () {
					self.editor.save("close");
				},
				cancel: function () {},
				no: function () {
					self.is_saved = true;
					self.tab.is_saved = true;
					self.close();
				}
			});

			confirmation_save.panel.show();
		}
	},

	show: function () {
		this.context_menu.hide();
		$("#" + this.container + "_c").show();
	},

	hide: function () {
		this.context_menu.hide();
		$("#" + this.container + "_c").hide();
	},
	activate: function () {
		var self = this;
		if (self.editor && self.editor.filename) {
			if (core.module.layout.workspace.window_manager.active_filename != (self.editor.filepath + self.editor.filename)) {
				self.editor.on_activated();
				core.module.layout.workspace.window_manager.active_filename = self.editor.filepath + self.editor.filename;
			}
		}
		core.module.layout.workspace.window_manager.active_window = this.index;

		$("#" + this.workspace_container).find(".activated").each(function (i) {
			$(this).removeClass("activated");
		});

		core.module.layout.workspace.window_manager.window.forEach(function (panel, index) {
			var zindex = panel.zindex;

			if (zindex > self.zindex) {
				--zindex;

				$('#' + panel.container).parent().css('z-index', zindex);
				panel.zindex = zindex;
			}

			panel.activated = false;
		});

		this.zindex = 2 + core.module.layout.workspace.window_manager.window.length - 1;
		$("#" + this.container).find(".hd").addClass("activated");
		$("#" + this.container).find(".bd").addClass("activated");
		$("#" + this.container).find(".ft").addClass("activated");
		$("#" + this.container).parent().css("z-index", this.zindex);

		this.activated = true;
		if (this.tab !== null) this.tab.activate();
		if (this.context_menu !== null) this.context_menu.hide();

		// hide all context menu in project.explorer
		//
		core.module.layout.project_explorer.hide_all_context_menu();
	},

	set_title: function () {
		var project = this.filepath.split("/").shift();
		var prefix = "";

		if (core.status.current_project_path != project && this.filename != "debug") {
			$($("#" + this.container + "_c").find(".panel_image")).removeClass('window_tab-toolbar-connect');
			$($("#" + this.container + "_c").find(".panel_image")).addClass('window_tab-toolbar-disconnect');
		} else {
			$($("#" + this.container + "_c").find(".panel_image")).removeClass('window_tab-toolbar-disconnect');
			$($("#" + this.container + "_c").find(".panel_image")).addClass('window_tab-toolbar-connect');
		}

		if( this.filetype == 'url' ) {
			this.title = this.filename;
		}
		else {
			this.title = this.filepath + this.filename;
		}

		if (this.filename == "debug") this.title = this.filename;
		$("#" + this.container + "_c").find(".window_title").html(prefix + this.title);
	},

	set_footer: function () {
		if (this.type == "Editor") {
			this.panel.setFooter("<span class='editor_message' style='width:80%;'>Line: 0 | Col: 0</span> <span class='zoom_percent' style='float:right;'>100%</span>");

		} else if (this.type == "Designer") {
			this.panel.setFooter("<div class='designer_message'></div><div class='mouse_position_view'>(0, 0)</div>");
		} else if (this.filetype == "url") {
			this.panel.setFooter("<div class='editor_message'>Line: 0 | Col: 0</div>");
		}
	},

	resize_end: function () {
		var panel = $("#" + this.container);
		
		var hd = panel.find('.hd');
		var bd = panel.find('.bd');
		var ft = panel.find('.ft');

		var height = hd.outerHeight() + bd.outerHeight() + ft.outerHeight();

		panel.height(height);
		panel.parent().height(height);
	},

	resize_all: function () {
		var height = $("#" + this.container).find(".bd").height();

		$("#" + this.container).find(".window_container").height(height);

		if (this.type == "Editor") {
			$("#" + this.container).find(".window_container").find(".CodeMirror").height(height);
			$("#" + this.container).find(".window_container").find(".CodeMirror").find(".CodeMirror").css("height", "100%"); //height($("#"+this.container).height()-53);
			$("#" + this.container).find(".window_container").find(".CodeMirror").find(".CodeMirror").children("div").height("100%");
		} else if (this.type == "Terminal") {
			$("#" + this.container).find(".window_container").height(height - 10);
			this.terminal.resize_all('panel');
		} else if (this.type == "Designer") {
			this.designer.resize_all();
		}
	},

	refresh: function () {
		if(this.context_menu) this.context_menu.hide();
		if (this.editor) this.editor.line_refresh();
	},

	init_context_event: function () {
		var self = this;

		$('[id="' + self.context_menu.name + '"]').find(".minimize").click(function () {
			self.minimize();
			self.context_menu.hide();

			return false;
		});

		$('[id="' + self.context_menu.name + '"]').find(".maximize").click(function () {
			core.module.layout.workspace.window_manager.maximize_all();
			self.context_menu.hide();

			return false;
		});

		$('[id="' + self.context_menu.name + '"]').find(".close").click(function () {
			self.close();
			self.context_menu.hide();

			return false;
		});
	},

	inArray: function (keyword) {
		for (var i = 0; i < core.filetypes.length; i++) {
			if (core.filetypes[i].file_extension == keyword) {
				return i;
			}
		}

		for (var i = 0; i < core.filetypes.length; i++) {
			if (core.filetypes[i].file_extension == "txt") {
				return i;
			}
		}

		return 12;
	},

	plug: function () {
		$(core).trigger("window_panel_plug");
	}
};
