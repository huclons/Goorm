/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jshint newcap:false, debug:true, unused: true, evil: true, devel: true, plusplus: false, browser: true, jquery: true, undef:false */
/*clientside jslint comment for global */
/*global org: false, core: false, YAHOO: false, localStorage: false */
/*jshint unused: false */



org.goorm.core.window.manager = {
	window: null,
	tab: null,
	context_menu: null,
	list_menu: null,
	window_list_menu: null,
	workspace_container: null,
	window_list_container: null,
	index: 0,
	tab_window_index: 0,
	terminal_count: 0,
	window_tabview: null,
	active_window: -1,
	active_filename: "",
	maximized: false,
	window_list: null,
	transition_manager: null,
	recent_window: [],

	init: function (container) {
		var self = this;
		this.transition_manager = new org.goorm.core.window.manager.transition();
		this.transition_manager.init();

		this.window = [];
		this.tab = [];
		this.context_menu = [];
		this.window_list_menu = [];
		this.workspace_container = container;

		this.window_list = [];

		$("#" + container).append("<div id='" + container + "_window_list'><div class='tab_max_buttons' style='float:right;'><div class='unmaximize_all window_button'></div> <div class='maximized_close window_button'></div></div><div class='tab_scroll' style='float:right;'><div class='tab_list_left window_button'></div><div class='window_list window_button'></div><div class='tab_list_right window_button'></div></div></div>");

		$("div.unmaximize_all").click(function (e) {
			self.unmaximize_all();

			e.preventDefault();
			e.stopPropagation();
			return false;
		});

		$("div.tab_max_buttons").hide();

		$("div.maximized_close").click(function () {
			self.window[self.active_window].close();
		});

		$("div.tab_list_left").click(function () {
			if (self.active_window > 0) {
				self.window[self.active_window - 1].activate();
			}
		});
		$("div.tab_list_right").click(function () {
			if (self.active_window < self.index - 1) {
				self.window[self.active_window + 1].activate();
			}
		});

		this.window_list_container = container + "_window_list";

		this.window_tabview = new YAHOO.widget.TabView(this.window_list_container);

		this.list_menu = new YAHOO.widget.Menu("window_list_menu");
		this.list_menu.render(document.body);

		this.context_menu[0] = new org.goorm.core.menu.context();
		this.context_menu[0].init("configs/menu/org.goorm.core.window/window.manager.html", "window.manager", $('#'+container)[0], 'context');

		this.context_menu[1] = new org.goorm.core.menu.context();
		this.context_menu[1].init("configs/menu/org.goorm.core.window/window.manager.tabview.html", "window.manager.tabview", $("#"+container + "_window_list")[0], 'context');

				// window events
		
		$("#" + container).click(function () {
			self.context_menu[0].cancel();
			self.context_menu[1].cancel();

			for (i = 0; i < self.index; i++) {
				if (self.window[i].context_menu) {
					self.window[i].context_menu.cancel();
				}

				if (self.tab[i].context_menu) {
					self.tab[i].context_menu.cancel();
				}
			}
		});

		$("#" + container + "_window_list").find("div.window_list").click(function () {
			self.list_menu.show();
			var window_list = $("#" + container + "_window_list");

			$("#window_list_menu").css("z-index", 5).css("left", window_list.offset().left + window_list.width() - 40).css("top", window_list.find("div.window_list").offset().top + 10);

			return false;
		});

		//untitled editor sim
		$("#workspace_window_list .yui-nav").dblclick(function (e) {
			if (core.status.current_project_path === "") {
				//alert
				return;
			}
			//core.dialog.new_file.show("");
			var window_arr = core.module.layout.workspace.window_manager.window;
			var child_arr = core.status.project_root_chilren_arr;
			var untitled_name = "untitled";
			var cur_untitled_num = 0;
			while (1) {
				var flag = false;
				for (var i = 0; i < child_arr.length; i++) {
					if (child_arr[i] == untitled_name) {
						cur_untitled_num++;
						untitled_name = "untitled" + cur_untitled_num;
						flag = true;
						break;
					}
				}
				for (var i = 0; i < window_arr.length; i++) {
					if (window_arr[i].project == core.status.current_project_path && window_arr[i].filename == untitled_name) {
						cur_untitled_num++;
						untitled_name = "untitled" + cur_untitled_num;
						flag = true;
						break;
					}
				}
				if (!flag) break;

			}

			//here untitled_name is decided

			var editor_ = self.open(core.status.current_project_path + "/", untitled_name);
			editor_.editor.editor.setLine(0, "");

		});

		$(core).on("edit_file_open", function (evt, data) {
			var postdata = {
				workspace: data.workspace
			};

			$.post("/file/update_data", postdata, function (logs) {
				var index = -1;
				if (logs.length > 0) {
					for (var i = 0; i < self.window.length; i++) {
						var filepath = self.window[i].filepath + self.window[i].filename;
						if (filepath == logs[0].filepath) {
							index = i;
							break;
						}
					}

					if (index != -1) {
						for (var i = 0; i < logs.length; i++) {
							self.window[index].editor.collaboration.set_cursor(logs[i].message);
						}
					}
				}
			});
		});

		$(core).on("goorm_login_complete", function () {
			if (!$.isEmptyObject(localStorage.workspace_window)) {
				var temp_window_list = $.parseJSON(localStorage.workspace_window);
				var active_window = null;

				self.check_file_list(temp_window_list, function (file_list) {
					$(file_list).each(function (i) {
						self.open(this.filepath, this.filename, this.filetype, this.editor, this);

						//TODO: sort by index

						//TODO: arrange windows with each position and size
						var current_window = self.window[self.index - 1];

						current_window.left = this.left;
						current_window.top = this.top;
						current_window.width = this.width;
						current_window.height = this.height;
						current_window.zindex = this.zindex;
						current_window.status = this.status;
						current_window.project = this.project;
						current_window.activated = this.activated || false;

						if (current_window.activated) {
							active_window = current_window;
						}

						if (this.status == "maximized") {
							var workspace_container = $("#" + self.workspace_container);
							var container = $("#" + current_window.container);
							var container_c = $("#" + current_window.container + "_c");

							container_c.offset({
								left: $("#" + current_window.workspace_container).offset().left - 1,
								top: workspace_container.offset().top
							});

							container_c.width(workspace_container.width()).height(workspace_container.height());
							container.width(workspace_container.width()).height(workspace_container.height());

							$("#" + current_window.container).find(".ft").addClass("maximized_ft");

							current_window.panel.cfg.setProperty("width", $("#" + self.workspace_container).width() + "px");
							current_window.panel.cfg.setProperty("height", $("#" + self.workspace_container).height() + "px");

							$(".tab_max_buttons").show();

							current_window.resize.lock();

							self.maximized = true;
						} else {
							var container = $("#" + current_window.container);
							var container_c = $("#" + current_window.container + "_c");

							if (this.width <= 200 || this.height <= 300) {
								this.width = 450;
								this.height = 250;
							}

							if (typeof (this.left) == 'string' && this.left.indexOf('px')) {
								this.left = this.left.split('px')[0];
							}

							if (typeof (this.top) == 'string' && this.top.indexOf('px')) {
								this.top = this.top.split('px')[0];
							}

							var workspace = $('#workspace').offset();
							var tab_height = $('#workspace_window_list').height();

							if (this.top < workspace.top + tab_height + 10) {
								this.top = workspace.top + tab_height + 10 * (2 * i + 1);
							}

							if (this.left < workspace.left + 10) {
								this.left = workspace.left + 10 * (2 * i + 1);
							}

							container_c.offset({
								left: this.left,
								top: this.top
							});
							container_c.width(this.width);
							container_c.height(this.height);
							container_c.css('z-index', this.zindex);

							container.width(this.width).height(this.height);

							current_window.panel.cfg.setProperty("width", this.width + "px");
							current_window.panel.cfg.setProperty("height", this.height + "px");

							current_window.status = null;

							$("div.tab_max_buttons").hide();

							current_window.resize.unlock();
						}
						current_window.resize_all();
						current_window.set_title();

						if (core.is_mobile) {
							current_window.maximize();
						}
					});

					if (active_window)
						active_window.activate();
				});

			}
			if (core.module.layout.history)
				core.module.layout.history.wait_for_loading = false;
		});

		$(core).on("layout_resized", function () {
			if (self.maximized) {
				self.maximize_all();
			}
		});

		$(window).unload(function () {
			self.save_workspace();
		});

		for (var i = 4; i >= 0; i--) {
			$("ul[id='open_recent_file_ul']").append('<li class="yuimenuitem" ><a href ="#"  class="yuimenuitemlabel" action="open_recent_window_' + i + '" ></a></li>');
		}
		$("ul[id='clear_recent_file_ul']").append('<li class="yuimenuitem" ><a href ="#"  class="yuimenuitemlabel" action="open_recent_window_clear"   localization_key="clear_recent_file" >Clear Recent Files</a></li>');
		for (var i = self.recent_window.length; i < 5; i++) {
			$("a[action=open_recent_window_" + i + "]").css('display', 'none');
		}

		this.tab_manager.init(this);
	},

	save_workspace: function () {
		var window_data = [];
		var self = this;
		$(this.window).each(function (i) {
			if (self.window[i].alive) {
				var cursor;
				if (this.editor.editor) {
					cursor = this.editor.editor.getCursor();
				}
				window_data.push({
					filepath: this.filepath,
					filename: this.filename,
					filetype: this.filetype,
					project: this.project,
					editor: this.type,
					left: this.left,
					top: this.top,
					width: this.width,
					height: this.height,
					zindex: this.zindex,
					index: this.index,
					status: this.status,
					cursor: cursor,
					activated: this.activated
				});
			}
		});

		localStorage.workspace_window = JSON.stringify(window_data);
	},

	open: function (filepath, filename, filetype, editor, options) {
		var self = this;
		var options = options || {};
		//recent file start
		recent_window_temp = {};
		recent_window_temp.filename = filename;
		recent_window_temp.filetype = filetype;
		recent_window_temp.filepath = filepath;

		//1. handle recent file data
		//already contained ->remove
		for (var i = 0; i < self.recent_window.length; i++) {
			if (self.recent_window[i].filepath + self.recent_window[i].filename == filepath + filename) {
				self.recent_window.remove(i);
				break;
			}
		}
		//push
		self.recent_window.push(recent_window_temp);
		//over 5 -> remove
		if (self.recent_window.length == 6) {
			self.recent_window.remove(0);
		}
		//2. reorganize menu
		//2,1 setting text, click
		for (var i = 0; i < self.recent_window.length; i++) {
			$("a[action=open_recent_window_" + i + "]").css('display', 'list-item');
			$("a[action=open_recent_window_" + i + "]").text(self.recent_window[i].filepath + self.recent_window[i].filename);
			$("a[action=open_recent_window_" + i + "]").unbind("click");
			$("a[action=open_recent_window_" + i + "]").click(function () {
				var target_total_filepath = $(this).text();

				for (var t = 0; t < self.recent_window.length; t++) {
					if (self.recent_window[t].filepath + self.recent_window[t].filename == target_total_filepath) {
						self.open(
							self.recent_window[t].filepath,
							self.recent_window[t].filename,
							self.recent_window[t].filetype
						);
						break;
					}
				}
			});
			$("a[action=open_recent_window_clear]").click(function () {
				for (var i = self.recent_window.length; i >= 0; i--) {
					$("a[action=open_recent_window_" + i + "]").css('display', 'none');
					$("a[action=open_recent_window_" + i + "]").text('');
				}
				self.recent_window.length=0;
				$($("#open_recent_file_ul").children()[0]).css('display', 'list-item');

			});
		}
		//2.2 hide
		for (var i = self.recent_window.length; i < 5; i++) {
			$("a[action=open_recent_window_" + i + "]").css('display', 'none');
		}
		$($("#open_recent_file_ul").children()[0]).css('display', 'none');
		//recent file end

		if (filetype == "pdf" || filetype == "jpg" || filetype == "jpeg" || filetype == "gif" || filetype == "png" || filetype == "doc" || filetype == "docx" || filetype == "ppt" || filetype == "pptx" || filetype == "xls" || filetype == "xlsx") {
			var query = {
				filepath: filepath,
				filename: filename
			};

			$.get("file/get_file", query, function () {
				window.open("files/" + filepath + filename);
			});
		} else {
			if (filepath != "/" && filepath !== "") {
				if (core.module.layout.history)
					core.module.layout.history.last_init_load = filepath + filename;
			}

			var i = this.is_opened(filepath, filename);
			var project_name = filepath.split('/')[1];
			if (filepath[0] != '/') project_name = filepath.split('/')[0];

			if (i >= 0) {
				this.window[i].activate();
				this.active_window = i;

				$(core).trigger('is_loaded');
				return this.window[i];
			} else {
				this.add(filepath, filename, filetype, editor, options);

				if (this.maximized) {
					this.window[this.window.length - 1].maximize();
				}

				return this.window[this.window.length - 1];
			}
		}
	},
	open_file_already_opened: function (filepath, filename, filetype, editor, options) {
		var self = this;

		var active_window_index = self.active_window;
		var active_window_target = core.module.layout.workspace.window_manager.window[active_window_index];
		filepath = active_window_target.filepath;
		filename = active_window_target.filename;
		filetype = active_window_target.filetype;

		var options = options || {};
		if (filetype == "pdf" || filetype == "jpg" || filetype == "jpeg" || filetype == "gif" || filetype == "png" || filetype == "doc" || filetype == "docx" || filetype == "ppt" || filetype == "pptx" || filetype == "xls" || filetype == "xlsx") {
			var query = {
				filepath: filepath,
				filename: filename
			};

			$.get("file/get_file", query, function () {
				window.open("files/" + filepath + filename);
			});
		} else {
			if (filepath != "/" && filepath !== "") {
				if (core.module.layout.history)
					core.module.layout.history.last_init_load = filepath + filename;
			}

			var i = this.is_opened(filepath, filename);
			var project_name = filepath.split('/')[1];
			if (filepath[0] != '/') project_name = filepath.split('/')[0];

			this.add(filepath, filename, filetype, editor, options);

			if (this.maximized) {
				this.window[this.window.length - 1].maximize();
			}

			return this.window[this.window.length - 1];
		}
	},
	find_by_filename: function (filepath, filename) {
		var result = null;

		$(this.window).each(function (i) {
			if (this.filepath == filepath && this.filename == filename) {
				result = this;
			}
		});

		return result;
	},

	is_opened: function (filepath, filename) {
		var self = this;
		var window_index = -1;
		var empty_windows = [];

		$(this.window).each(function (i) {
			if (this.filepath === null && this.filename === null) {
				empty_windows.push(i);
			}
		});

		$(empty_windows).each(function (i) {
			self.window.pop(this);
		});

		$(this.window).each(function (i) {
			var base_path = this.filepath;
			var base_name = this.filename;
			var target_path = filepath;
			var target_name = filename;

			if (base_path == target_path && base_name == target_name) {
				window_index = i;
			}

		});

		return window_index;
	},

	add: function (filepath, filename, filetype, editor, options) {
		var options = options || {};

		this.active_window = this.index;

		var title = filepath+filename;

		$("#" + this.workspace_container).append("<div id='filewindow" + this.index + "'></div>");

		this.window[this.index] = new org.goorm.core.window.panel();
		this.window[this.index].init("filewindow" + this.index, title, this.workspace_container, filepath, filename, filetype, editor, options);

		this.tab[this.index] = new org.goorm.core.window.tab();
		this.tab[this.index].init("filewindow" + this.index, title, this.window_tabview, this.list_menu, filepath, this);

		this.window[this.index].connect(this.tab[this.index]);
		this.window[this.index].index = this.index;
		this.tab[this.index].connect(this.window[this.index]);

		this.window[this.index].activate();
		this.tab[this.index].activate();

		this.index++;
	},

	make_start_page: function () {
		var options = options || {};
		this.active_window = this.index;
		var title = "Start Page";
		$("#" + this.workspace_container).append("<div class='startpage' id='filewindow" + this.index + "'></div>");
		this.window[this.index] = new org.goorm.core.window.panel();
		this.window[this.index].init("filewindow" + this.index, title, this.workspace_container, "filepath", "filename", "filetype", "Start_Page", {});

		this.tab[this.index] = new org.goorm.core.window.tab();
		this.tab[this.index].init("filewindow" + this.index, title, this.window_tabview, this.list_menu, "filepath", this);

		this.window[this.index].connect(this.tab[this.index]);
		this.tab[this.index].connect(this.window[this.index]);

		this.window[this.index].index = this.index;

		this.window[this.index].activate();
		this.tab[this.index].activate();

		var start_page_body = $($($(".startpage")[0]).children()[1]);

		start_page_body.css("background", "url(images/loading.png) no-repeat fixed center");

		this.index++;

	},

	maximize_all: function () {
		$(this.window).each(function (i) {
			this.maximize();
		});

		this.maximized = true;
	},

	unmaximize_all: function () {
		$(this.window).each(function (i) {
			this.unmaximize();
		});

		this.maximized = false;
	},

	previous_window: function () {
		if (this.active_window > 0) {
			this.window[this.active_window - 1].activate();
		}
	},

	next_window: function () {
		if (this.active_window < this.index - 1) {
			this.window[this.active_window + 1].activate();
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

	save_all: function () {
		for (var i = 0; i < this.window.length; i++) {
			if (this.window[i].alive) {
				if (this.window[i].designer) {
					this.window[i].designer.save();
				} else if (this.window[i].editor) {
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

		var workspace_width = ($('#workspace').width() < 700) ? 800 : $('#workspace').width();
		var workspace_height = ($('#workspace').height() < 500) ? 600 : $('#workspace').height();

		for (var i = 0; i < this.index; i++) {
			if (this.window[i].alive) {
				if (this.window[i].status == "maximized") {
					this.window[i].maximize();
					this.is_maxmizedd = true;
				}

				var width = workspace_width * width_ratio;
				var height = workspace_height * height_ratio;

				if (width < 300) {
					width = 300;
				}

				if (height < 200) {
					height = 200;
				}

				this.window[i].panel.left = 4 + (24 * count);
				this.window[i].panel.top = 29 + (24 * count);
				this.window[i].panel.width = width;
				this.window[i].panel.height = height;

				var filewindow_c = $('#filewindow' + i + '_c');
				var filewindow = $('#filewindow' + i);

				if (this.window[i].designer) {
					//m.s(this.window[i].type);
					filewindow_c.find(".canvas_container").css('width', this.window[i].panel.width - 14 + 'px');
					filewindow_c.find(".canvas_container").css('height', this.window[i].panel.height - 68 + 'px');
					filewindow_c.find(".ruler_x").css('width', this.window[i].panel.width - 15 + 'px');
					filewindow_c.find(".ruler_y").css('height', this.window[i].panel.height - 65 + 'px');
				}

				filewindow_c.css('left', this.window[i].panel.left + 'px');
				filewindow_c.css('top', this.window[i].panel.top + 'px');
				filewindow_c.css('z-index', i);

				this.window[i].panel.cfg.setProperty('left', this.window[i].panel.left + 'px');
				this.window[i].panel.cfg.setProperty('top', this.window[i].panel.top + 'px');

				filewindow_c.css('width', this.window[i].panel.width + 'px');
				filewindow_c.css('height', this.window[i].panel.height + 'px');
				filewindow.children(".bd").height(this.window[i].panel.height - 48);
				filewindow.css('width', this.window[i].panel.width + 'px').css('height', (this.window[i].panel.height) + 'px');
				filewindow_c.children(".window_container").height(this.window[i].panel.height - 48);
				filewindow_c.find(".window_container").find(".CodeMirror").height(this.window[i].panel.height - 48);
				this.window[i].resize_all();
				this.window[i].refresh();
				count++;

				$(document).trigger(this.window[i].filename + '_resized');
			}
		}

		this.is_maxmizedd = false;

		$(".tab_max_buttons").hide();
	},

	tile_vertically: function () {
		var count = 0;

		var workspace_width = ($('#workspace').width() < 700) ? 800 : $('#workspace').width();
		var workspace_height = ($('#workspace').height() < 500) ? 600 : $('#workspace').height();

		var each_width = Math.floor((workspace_width - 9) / this.count_alive_windows());
		var each_height = workspace_height - 33;

		if (each_width < 300) {
			each_width = 300;
		}

		if (each_height < 200) {
			each_height = 200;
		}

		for (var i = 0; i < this.index; i++) {
			if (this.window[i].alive) {
				if (this.window[i].status == "maximized") {
					this.window[i].maximize();
					this.is_maxmizedd = true;
				}
				this.window[i].panel.left = 4 + (each_width * count);
				this.window[i].panel.top = 29;
				this.window[i].panel.width = each_width;
				this.window[i].panel.height = each_height;

				if (this.window[i].designer) {
					$('#filewindow' + i + '_c').find(".canvas_container").css('width', this.window[i].panel.width - 14 + 'px');
					$('#filewindow' + i + '_c').find(".canvas_container").css('height', this.window[i].panel.height - 68 + 'px');
					$('#filewindow' + i + '_c').find(".ruler_x").css('width', this.window[i].panel.width - 15 + 'px');
					$('#filewindow' + i + '_c').find(".ruler_y").css('height', this.window[i].panel.height - 65 + 'px');
				}

				$('#filewindow' + i + '_c').css('left', this.window[i].panel.left + 'px');
				$('#filewindow' + i + '_c').css('top', this.window[i].panel.top + 'px');
				$('#filewindow' + i + '_c').css('width', this.window[i].panel.width + 'px');
				$('#filewindow' + i + '_c').css('height', this.window[i].panel.height + 'px');
				$('#filewindow' + i + '_c').css('z-index', i);

				this.window[i].panel.cfg.setProperty('left', this.window[i].panel.left + 'px');
				this.window[i].panel.cfg.setProperty('top', this.window[i].panel.top + 'px');

				$('#filewindow' + i + '_c').find('.yui-panel').css('width', this.window[i].panel.width + 'px');
				$('#filewindow' + i + '_c').find('.yui-panel').css('height', this.window[i].panel.height + 'px');
				$('#filewindow' + i + '_c').children('.yui-panel').children(".bd").height(this.window[i].panel.height - 48);
				$('#filewindow' + i + '_c').find(".window_container").find(".CodeMirror").height(this.window[i].panel.height - 48);
				this.window[i].resize_all();
				this.window[i].refresh();
				count++;

				$('#filewindow' + i).css('width', this.window[i].panel.width + 'px');
				$('#filewindow' + i).css('height', (this.window[i].panel.height) + 'px');

				$(document).trigger(this.window[i].filename + '_resized');
			}
		}

		this.is_maxmizedd = false;
		$(".tab_max_buttons").hide();
	},
	tile_left: function () {
		var count = 0;
		var each_width = Math.floor(($('#workspace').width() - 9) / 2);
		var each_height = $('#workspace').height() - 33;

		if (each_width <= 200) {
			each_width = 450;
		}

		if (each_height <= 250) {
			each_height = 300;
		}

		var i = core.module.layout.workspace.window_manager.active_window;
		if (this.window[i].alive) {
			if (this.window[i].status == "maximized") {
				this.window[i].maximize();
				this.is_maxmizedd = true;
			}
			this.window[i].panel.left = 4;
			this.window[i].panel.top = 29;
			this.window[i].panel.width = each_width;
			this.window[i].panel.height = each_height;

			if (this.window[i].designer) {
				$('#filewindow' + i + '_c').find(".canvas_container").css('width', this.window[i].panel.width - 14 + 'px');
				$('#filewindow' + i + '_c').find(".canvas_container").css('height', this.window[i].panel.height - 68 + 'px');
				$('#filewindow' + i + '_c').find(".ruler_x").css('width', this.window[i].panel.width - 15 + 'px');
				$('#filewindow' + i + '_c').find(".ruler_y").css('height', this.window[i].panel.height - 65 + 'px');
			}

			$('#filewindow' + i + '_c').css('left', this.window[i].panel.left + 'px');
			$('#filewindow' + i + '_c').css('top', this.window[i].panel.top + 'px');
			$('#filewindow' + i + '_c').css('width', this.window[i].panel.width + 'px');
			$('#filewindow' + i + '_c').css('height', this.window[i].panel.height + 'px');
			$('#filewindow' + i + '_c').css('z-index', i);

			this.window[i].panel.cfg.setProperty('left', this.window[i].panel.left + 'px');
			this.window[i].panel.cfg.setProperty('top', this.window[i].panel.top + 'px');

			$('#filewindow' + i + '_c').find('.yui-panel').css('width', this.window[i].panel.width + 'px');
			$('#filewindow' + i + '_c').find('.yui-panel').css('height', this.window[i].panel.height + 'px');
			$('#filewindow' + i + '_c').children('.yui-panel').children(".bd").height(this.window[i].panel.height - 48);
			$('#filewindow' + i + '_c').find(".window_container").find(".CodeMirror").height(this.window[i].panel.height - 48);
			this.window[i].resize_all();
			this.window[i].refresh();
			count++;

			$('#filewindow' + i).css('width', this.window[i].panel.width + 'px');
			$('#filewindow' + i).css('height', (this.window[i].panel.height) + 'px');

			$(document).trigger(this.window[i].filename + '_resized');

			this.window[i].activate();
		}

		this.is_maxmizedd = false;
		$(".tab_max_buttons").hide();
	},
	tile_right: function () {
		var count = 0;
		var each_width = Math.floor(($('#workspace').width() - 9) / 2);
		var each_height = $('#workspace').height() - 33;

		if (each_width <= 200) {
			each_width = 450;
		}

		if (each_height <= 250) {
			each_height = 300;
		}

		var i = core.module.layout.workspace.window_manager.active_window;
		if (this.window[i].alive) {
			if (this.window[i].status == "maximized") {
				this.window[i].maximize();
				this.is_maxmizedd = true;
			}
			this.window[i].panel.left = 4 + (each_width * 1);
			this.window[i].panel.top = 29;
			this.window[i].panel.width = each_width;
			this.window[i].panel.height = each_height;

			if (this.window[i].designer) {
				$('#filewindow' + i + '_c').find(".canvas_container").css('width', this.window[i].panel.width - 14 + 'px');
				$('#filewindow' + i + '_c').find(".canvas_container").css('height', this.window[i].panel.height - 68 + 'px');
				$('#filewindow' + i + '_c').find(".ruler_x").css('width', this.window[i].panel.width - 15 + 'px');
				$('#filewindow' + i + '_c').find(".ruler_y").css('height', this.window[i].panel.height - 65 + 'px');
			}

			$('#filewindow' + i + '_c').css('left', this.window[i].panel.left + 'px');
			$('#filewindow' + i + '_c').css('top', this.window[i].panel.top + 'px');
			$('#filewindow' + i + '_c').css('width', this.window[i].panel.width + 'px');
			$('#filewindow' + i + '_c').css('height', this.window[i].panel.height + 'px');
			$('#filewindow' + i + '_c').css('z-index', i);

			this.window[i].panel.cfg.setProperty('left', this.window[i].panel.left + 'px');
			this.window[i].panel.cfg.setProperty('top', this.window[i].panel.top + 'px');

			$('#filewindow' + i + '_c').find('.yui-panel').css('width', this.window[i].panel.width + 'px');
			$('#filewindow' + i + '_c').find('.yui-panel').css('height', this.window[i].panel.height + 'px');
			$('#filewindow' + i + '_c').children('.yui-panel').children(".bd").height(this.window[i].panel.height - 48);
			$('#filewindow' + i + '_c').find(".window_container").find(".CodeMirror").height(this.window[i].panel.height - 48);
			this.window[i].resize_all();
			this.window[i].refresh();
			count++;

			$('#filewindow' + i).css('width', this.window[i].panel.width + 'px');
			$('#filewindow' + i).css('height', (this.window[i].panel.height) + 'px');

			$(document).trigger(this.window[i].filename + '_resized');

			this.window[i].activate();
		}

		this.is_maxmizedd = false;
		$(".tab_max_buttons").hide();
	},

	tile_horizontally: function () {
		var count = 0;

		var workspace_width = ($('#workspace').width() < 700) ? 800 : $('#workspace').width();
		var workspace_height = ($('#workspace').height() < 500) ? 600 : $('#workspace').height();

		var each_width = workspace_width - 9;
		var each_height = Math.floor((workspace_height - 33) / this.count_alive_windows());

		if (each_width < 300) {
			each_width = 300;
		}

		if (each_height < 200) {
			each_height = 200;
		}

		for (var i = 0; i < this.index; i++) {
			if (this.window[i].alive) {
				if (this.window[i].status == "maximized") {
					this.window[i].maximize();
					this.is_maxmizedd = true;
				}
				this.window[i].panel.left = 4;
				this.window[i].panel.top = 29 + (each_height * count);
				this.window[i].panel.width = each_width;
				this.window[i].panel.height = each_height;

				if (this.window[i].designer) {
					//m.s(this.window[i].type);
					$('#filewindow' + i + '_c').find(".canvas_container").css('width', this.window[i].panel.width - 14 + 'px');
					$('#filewindow' + i + '_c').find(".canvas_container").css('height', this.window[i].panel.height - 68 + 'px');
					$('#filewindow' + i + '_c').find(".ruler_x").css('width', this.window[i].panel.width - 15 + 'px');
					$('#filewindow' + i + '_c').find(".ruler_y").css('height', this.window[i].panel.height - 65 + 'px');
				}

				$('#filewindow' + i + '_c').css('left', this.window[i].panel.left + 'px');
				$('#filewindow' + i + '_c').css('top', this.window[i].panel.top + 'px');
				$('#filewindow' + i + '_c').css('width', this.window[i].panel.width + 'px');
				$('#filewindow' + i + '_c').css('height', this.window[i].panel.height + 'px');
				$('#filewindow' + i + '_c').css('z-index', i);

				this.window[i].panel.cfg.setProperty('left', this.window[i].panel.left + 'px');
				this.window[i].panel.cfg.setProperty('top', this.window[i].panel.top + 'px');

				$('#filewindow' + i + '_c').find('.yui-panel').css('width', this.window[i].panel.width + 'px');
				$('#filewindow' + i + '_c').find('.yui-panel').css('height', this.window[i].panel.height + 'px');
				$('#filewindow' + i + '_c').children('.yui-panel').children(".bd").height(this.window[i].panel.height - 48);
				$('#filewindow' + i + '_c').find(".window_container").find(".CodeMirror").height(this.window[i].panel.height - 48);
				this.window[i].resize_all();
				this.window[i].refresh();
				count++;

				$('#filewindow' + i).css('width', this.window[i].panel.width + 'px');
				$('#filewindow' + i).css('height', (this.window[i].panel.height) + 'px');

				$(document).trigger(this.window[i].filename + '_resized');
			}
		}

		this.is_maxmizedd = false;
		$(".tab_max_buttons").hide();
	},

	hide_all_context_menu: function () {
		var self = this;

		for (var i = 0; i < self.window.length; i++) {
			self.window[i].context_menu.hide();
		}
	},

	count_alive_windows: function () {
		var count = 0;

		for (var i = 0; i < this.index; i++) {
			if (this.window[i].alive) {
				count++;
			}
		}

		return count;
	},

	delete_window_in_tab: function (target_index) {
		if (this.tab && this.tab[target_index]) {
			this.tab.splice(target_index, 1);
		}
	},

	decrement_index_in_window: function (close_index) {
		var length = this.window.length;
		var workspace_container = this.workspace_container;

		for (var i = close_index + 1; i < length; i++) {
			var new_index = parseInt(i, 10) - 1;

			var new_container = "filewindow" + new_index;
			var new_container_c = "filewindow" + new_index + "_c";
			var new_container_h = "filewindow" + new_index + "_h";

			this.window[i].panel.dd.id = new_container_c;
			this.window[i].panel.dd.dragElId = new_container_c;
			this.window[i].panel.dd.handleElId = new_container_h;

			$("#" + workspace_container).find("#filewindow" + i).parent().attr("id", new_container_c);
			$("#" + workspace_container).find("#filewindow" + i).find("#filewindow" + i + "_h").attr("id", new_container_h);
			$("#" + workspace_container).find("#filewindow" + i).attr("id", new_container);

			this.window[i].container = new_container;
			this.window[i].index--;
		}
	},

	close_all: function () {
		$(this.window).each(function (i) {
			this.is_saved = true;
			this.tab.is_saved = true;
			this.close();
		});

		this.index = 0;
		this.active_window = -1;

		this.window.remove(0, this.window.length - 1);
	},

	check_file_list: function (temp_window_list, callback) {
		var postdata = {
			'get_list_type': 'collaboration_list'
		};

		$.get("project/get_list", postdata, function (project_data) {

			var files = temp_window_list.filter(function (o) {
				for (var i = 0; i < project_data.length; i++) {
					if (project_data[i].name == o.project) {
						return true;
					}
				}

				return false;
			});

			localStorage.workspace_window = JSON.stringify(files);
			callback(files);
		});
	},

	tab_manager: {
		init: function (parent) {
			this.parent = parent;

			var container = parent.workspace_container + "_window_list";
			var ul = $('#' + container + ' ul');

			ul.attr('id', container + '_container');
		},

		get_by_tab_id: function (id) {
			var window_manager = core.module.layout.workspace.window_manager;
			var __tab = null;

			for (var i = 0; i < window_manager.tab.length; i++) {
				var tab = window_manager.tab[i];

				if (id == tab.tab_id) {
					__tab = tab;
					break;
				}
			}

			return __tab;
		},

		get_index_by_tab_id: function(id) {
			var window_manager = core.module.layout.workspace.window_manager;
			var index = -1;

			for (var i = 0; i < window_manager.tab.length; i++) {
				var tab = window_manager.tab[i];

				if (id == tab.tab_id) {
					index = i;
					break;
				}
			}

			return index;
		},

		sort: function (mode) {
			var self = this;

			var parent = this.parent;

			var window_sort = function () {
				var container = parent.workspace_container + "_window_list" + "_container";
				var window_tab_list = $('#' + container + ' li');
				var new_tab_list = [];
				var new_window_list = [];

				var sync_window_container = function(new_index, window){
					var old_index = window.index;
					var new_container = "filewindow" + new_index;
					var new_container_c = "filewindow" + new_index + "_c";
					var new_container_h = "filewindow" + new_index + "_h";

					window.index = new_index;
					window.container = new_container;
					window.panel.dd.id = new_container_c;
					window.panel.dd.dragElId = new_container_c;
					window.panel.dd.handleElId = new_container_h;

					$("#" + parent.workspace_container).find("#filewindow" + old_index).find("#filewindow" + old_index + "_h").attr("id", new_container_h);
					$('#' + parent.workspace_container).find('#filewindow' + old_index).parent().attr('id', new_container_c);

					return window;
				}

				for (var i = 0; i < window_tab_list.length; i++) {
					var window_tab = window_tab_list[i];
					var window_tab_id = $(window_tab).attr('id');

					var tab_object = self.get_by_tab_id(window_tab_id);
					if (tab_object) {
						tab_object.window = sync_window_container(i, tab_object.window);
						tab_object.tab_count = window_tab_list.length;
						tab_object.container = tab_object.window.container;

						new_tab_list.push(tab_object);
						new_window_list.push(tab_object.window);
					}
				}

				for(var i = 0; i<new_window_list.length; i++) {
					var target_window = new_window_list[i];
					var index = target_window.index;

					$("#" + parent.workspace_container).find("#filewindow" + index + '_h').parent().attr("id", 'filewindow' + index);
				}

				core.module.layout.workspace.window_manager.tab = new_tab_list;
				core.module.layout.workspace.window_manager.window = new_window_list;

				var active_window = self.get_index_by_tab_id($('#workspace_window_list_container .selected').attr('id'));
				core.module.layout.workspace.window_manager.active_window = active_window;

				if (new_tab_list.length > 1) {
					new_tab_list[new_tab_list.length - 1].resize();
				}
			};

			switch (mode) {
			case 'window':
				window_sort();
				break;

			default:
				break;
			}
		}
	},

	synch_with_fs: function (condition) {
		var self = this;
		if (condition) {
			//ancestor folder change
			if (condition.change == 'dialog_mv') {
				var window_list = self.window;
				for (var i = window_list.length - 1; i >= 0; i--) {
					if ((window_list[i].title).indexOf(condition.ori_path + condition.ori_file) === 0) {
						//close all files children of not existed folder
						window_list[i].is_saved = true;
						window_list[i].tab.is_saved = true;
						window_list[i].close();
					}

				}
			} else if (condition.change == 'drag_n_drop') {
				var window_list = self.window;
				var current_path_arr = condition.current_path;
				for (var k = 0; k < current_path_arr.length; k++) {
					for (var i = window_list.length - 1; i >= 0; i--) {

						if (window_list[i].title.indexOf(current_path_arr[k]) === 0) {
							//close all files children of not existed folder
							window_list[i].is_saved = true;
							window_list[i].tab.is_saved = true;
							window_list[i].close();
						}
					}

				}
			}

		} else {

		}

		return true;
	},

	refresh_all_title : function(){
		var self=this;
		var tabs=self.tab;
		var panels=self.window;
		for(var i=0;i<tabs.length;i++){
			tabs[i].set_title();
			panels[i].set_title();
		}
	}
};
