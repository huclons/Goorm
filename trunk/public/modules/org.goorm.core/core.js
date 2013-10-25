/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jshint newcap:false, debug:true, unused: true, evil: true, devel: true, plusplus: false, browser: true, jquery: true, undef:false */
/*clientside jslint comment for global */
/*global org: false, core: false, localStorage: false, YAHOO: false, notice: false */
/*jshint unused: false */



var org = function () {
};

org.goorm = function () {
};

org.goorm.core = function () {

	this.user = {
		first_name: null,
		last_name: null,
		email: null,
		img: null
	};

	this.env = {
		version: null,
		browser: null,
		browser_version: 0,
		os: null,
		device: null,
		touchable: null,
		websocket_support: null,
		html5_support: null
	};

	this.module = {
		plugin_manager: null,
		collaboration: null,
		debug: null,
		dialog: null,
		editor: null,
		file: null,
		key_listener: null,
		preference: null,
		project: null,
		layout: null,
		localization: null,
		action: null,
		toolbar: null,
		shortcut_manager: null,
		search: null,
		browser: null,
		device: null,
		fn: null,
		loading_bar: null,
		toast: null,
		theme: null,
		theme_details: null,
		auth: null,
		scm: null,
		clipboard: null
	};

	this.container = "";
	this.skin_name = "";

	this.xml = null;
	this.loading_panel = null;

	this.dialog = {
		new_project: null,
		open_project: null,
		new_file: null,
		new_other_file: null,
		new_folder: null,
		new_untitled_textfile: null,
		open_file: null,
		upload_file: null,
		go_to_line: null,
		folder_upload : null,
		open_url: null,
		save_as_file: null,
		rename_file: null,
		move_file: null,
		file_select: null,
		switch_workspace: null,
		import_file: null,
		export_file: null,
		export_project: null,
		import_project: null,
		delete_project: null,
		build_all: null,
		build_project: null,
		build_clean: null,
		build_configuration: null,
		property: null,
		find_and_replace: null,
		search: null,
		preference: null,
		project_property: null,
		help_contents: null,
		help_about: null,
		
		loaded_count: 0
	};

	this.flag = {
		chat_on: false,
		collaboration_on: false,
		collaboration_draw_on: false
	};

	this.status = {
		is_login: false,
		login_complete: false,
		keydown: false,
		focus_on_editor: false,
		focus_on_inputbox: false,
		foucs_on_dialog: false,
		selected_file: "",
		selected_dialog: "",
		selected_dialog_container: "",
		current_project_path: "",
		current_project_name: "",
		current_project_type: ""
	};

	this.dialog_loading_count = 0;

	this.loading_count = 0;
	this.filetypes = null;

	this.server_theme = null;
	this.server_language = 'client'; // language preference priority

	this.plugins = [];

	this.preference = null;
	this.property = null;
	this.workspace = null;

	
};

org.goorm.core.prototype = {
	init: function (container) {
		var self = this;

		if (!core.is_optimization) {
			$('#goorm_template_container').remove();
		}

		if(core.test_mode) {
			$(document).tooltip('disable');
		}

		

		this.start();

		this.filetypes = [];
		this.workspace = {};

		$(this).on("layout_loaded", function () {
			console.log("layout load complete");

			this.module.plugin_manager.get();
		});

		$(this).on("preference_load_complete", function () {
			console.log("preference load complete");
		});

		$(this).on("plugin_loaded", function () {
			console.log("plugin load complete");

			this.main();

			this.module.plugin_manager.load(0);
		});

		this.load_complete_flag = false;

		//Loading Animation
		$(this).on("goorm_loading", function () {
			if (self.loading_count < Object.keys(core.dialog).length - 4 + parseInt(core.module.plugin_manager.list.length, 10) && !self.is_optimization) {
				self.loading_count++;
			} else {
				if (!self.load_complete_flag) {
					$(self).trigger("goorm_load_complete");
					self.load_complete_flag = true;

					
					self.show_local_login_box();
					

					

					
				}
			}
		});

		$(this).on("layout_loaded", function () {
			self.module.layout.resize_all();
		});

		//Loading Ending
		$(this).on("goorm_load_complete", function () {
			var __input = $("input");

			__input.on("focus", function () {
				self.status.focus_on_inputbox = true;
			});

			__input.on("blur", function () {
				self.status.focus_on_inputbox = false;
			});

			$(document).on("contextmenu", function (e) {
				e.preventDefault();
			});

			self.module.action.init();

			var goorm_loading_end_time = new Date().getTime();

			//theme
			self.module.theme = org.goorm.core.theme;
			self.module.theme.init();
		});

		$(this).on('goorm_login_complete', function () {
			if (parseInt(localStorage.left_tabview_index, 10) >= 0 && $('#goorm_left ul li a').length - 1 >= parseInt(localStorage.left_tabview_index, 10))
				core.module.layout.left_tabview.selectTab(parseInt(localStorage.left_tabview_index, 10));
			else
				core.module.layout.left_tabview.selectTab(0);
			if (parseInt(localStorage.inner_bottom_tabview_index, 10) >= 0 && $('#goorm_inner_layout_bottom ul li a').length - 1 >= parseInt(localStorage.inner_bottom_tabview_index, 10))
				core.module.layout.inner_bottom_tabview.selectTab(parseInt(localStorage.inner_bottom_tabview_index, 10));
			else
				core.module.layout.inner_bottom_tabview.selectTab(0);

			if (parseInt(localStorage.inner_right_tabview_index, 10) >= 0 && $('#goorm_inner_layout_right ul li a').length - 1 >= parseInt(localStorage.inner_right_tabview_index, 10))
				core.module.layout.inner_right_tabview.selectTab(parseInt(localStorage.inner_right_tabview_index, 10));
			else
				core.module.layout.inner_right_tabview.selectTab(0);

			core.status.login_complete = true;
			core.module.toast.show(core.module.localization.msg.notice_welcome_goorm);

			
		});

		$(window).unload(function () {
			localStorage.left_tabview_index = core.module.layout.left_tabview._configs.activeIndex.value || 0;
			localStorage.inner_bottom_tabview_index = core.module.layout.inner_bottom_tabview._configs.activeIndex.value || 0;
			localStorage.inner_right_tabview_index = core.module.layout.inner_right_tabview._configs.activeIndex.value || 0;
		});

		//Plugin Loading Aspects
		if (org.goorm.plugin.manager) {
			this.module.plugin_manager = org.goorm.plugin.manager;
			this.module.plugin_manager.init();
		}

		//Toolbar
		if (org.goorm.core.toolbar) {
			this.module.toolbar = org.goorm.core.toolbar;
			this.module.toolbar.init();
		}

		//Search Tab
		this.module.search = org.goorm.core.search.message;

		//Preference
		if (org.goorm.core.preference) {
			this.module.preference = org.goorm.core.preference;
			this.module.preference.init();
		}

		//Project
		this.module.project = org.goorm.core.project;

		

		//Shortcuts
		if (org.goorm.core.shortcut.manager) {
			this.module.shortcut_manager = org.goorm.core.shortcut.manager;
			this.module.shortcut_manager.init();
		}

		//Menu Actions
		this.module.action = org.goorm.core.menu.action;

		if (org.goorm.core.browser) {
			this.module.browser = org.goorm.core.browser;
			this.module.browser.init();
		}

		if (org.goorm.core.device) {
			this.module.device = org.goorm.core.device;
			this.module.device.init();
		}

		if (org.goorm.core.fn) {
			this.module.fn = org.goorm.core.fn;
			this.module.fn.init();
		}

		this.env.touchable = this.is_touchable_device();
		this.env.websocket_support = this.test_web_socket();

		if (org.goorm.core.layout) {
			this.module.layout = org.goorm.core.layout;
			this.module.layout.init(container);
		}
	},

	main: function () {

		if (org.goorm.core.project._new) {
			this.dialog.new_project = org.goorm.core.project._new;
			this.dialog.new_project.init();
		}

		if (org.goorm.core.project.open) {
			this.dialog.open_project = org.goorm.core.project.open;
			this.dialog.open_project.init();
		}

		if (org.goorm.core.file._new) {
			this.dialog.new_file = org.goorm.core.file._new;
			this.dialog.new_file.init();
		}

		if (org.goorm.core.file._new.other) {
			this.dialog.new_other_file = org.goorm.core.file._new.other;
			this.dialog.new_other_file.init();
		}

		if (org.goorm.core.file._new.folder) {
			this.dialog.new_folder = org.goorm.core.file._new.folder;
			this.dialog.new_folder.init();
		}

		if (org.goorm.core.file._new.untitled_textfile) {
			this.dialog.new_untitled_textfile = org.goorm.core.file._new.untitled_textfile;
			this.dialog.new_untitled_textfile.init();
		}

		if (org.goorm.core.file.open) {
			this.dialog.open_file = org.goorm.core.file.open;
			this.dialog.open_file.init();
		}

		if (org.goorm.core.file.upload) {
			//by sim
			this.dialog.upload_file = org.goorm.core.file.upload;
			this.dialog.upload_file.init();
			//by sim
		}
		if (org.goorm.core.folder.upload) {
			this.dialog.folder_upload = org.goorm.core.folder.upload;
			this.dialog.folder_upload.init();
		}


		if (org.goorm.core.file.open_url) {
			this.dialog.open_url = org.goorm.core.file.open_url;
			this.dialog.open_url.init();
		}

		if (org.goorm.core.file.save_as) {
			this.dialog.save_as_file = org.goorm.core.file.save_as;
			this.dialog.save_as_file.init();
		}

		if (org.goorm.core.file.rename) {
			this.dialog.rename_file = org.goorm.core.file.rename;
			this.dialog.rename_file.init();
		}

		if (org.goorm.core.file.move) {
			this.dialog.move_file = org.goorm.core.file.move;
			this.dialog.move_file.init();
		}

		if (!core.is_mobile) {
			if (org.goorm.core.printer) {
				this.dialog.print = org.goorm.core.printer;
				this.dialog.print.init();
			}
		}

		

		if (org.goorm.core.file._import) {
			this.dialog.import_file = org.goorm.core.file._import;
			this.dialog.import_file.init();
		}

		if (org.goorm.core.file._export) {
			this.dialog.export_file = org.goorm.core.file._export;
			this.dialog.export_file.init();
		}

		if (org.goorm.core.project._export) {
			this.dialog.export_project = org.goorm.core.project._export;
			this.dialog.export_project.init();
		}

		if (org.goorm.core.project._import) {
			this.dialog.import_project = org.goorm.core.project._import;
			this.dialog.import_project.init();
		}

		if (org.goorm.core.project._delete) {
			this.dialog.delete_project = org.goorm.core.project._delete;
			this.dialog.delete_project.init();
		}

		

		if (org.goorm.core.project.build.all) {
			this.dialog.build_all = org.goorm.core.project.build.all;
			this.dialog.build_all.init();
		}

		if (org.goorm.core.project.build.project) {
			this.dialog.build_project = org.goorm.core.project.build.project;
			this.dialog.build_project.init();
		}

		if (org.goorm.core.project.build.clean) {
			this.dialog.build_clean = org.goorm.core.project.build.clean;
			this.dialog.build_clean.init();
		}

		if (org.goorm.core.project.build.configuration) {
			this.dialog.build_configuration = org.goorm.core.project.build.configuration;
			this.dialog.build_configuration.init();
		}

		if (org.goorm.core.file.property) {
			this.dialog.property = org.goorm.core.file.property;
			this.dialog.property.init();
		}

		if (org.goorm.core.edit.go_to_line) {
			// by pear
			this.dialog.go_to_line = org.goorm.core.edit.go_to_line;
			this.dialog.go_to_line.init();
			// by pear
		}

		if (org.goorm.core.edit.find_and_replace) {
			this.dialog.find_and_replace = org.goorm.core.edit.find_and_replace;
			this.dialog.find_and_replace.init();
		}

		if (org.goorm.core.search) {
			this.dialog.search = org.goorm.core.search;
			this.dialog.search.init();
		}

		if (org.goorm.core.project.property) {
			this.dialog.project_property = org.goorm.core.project.property;
			this.dialog.project_property.init();
		}

		if (org.goorm.core.help.contents) {
			this.dialog.help_contents = org.goorm.core.help.contents;
			this.dialog.help_contents.init();
		}

		

		if (org.goorm.core.help.about) {
			this.dialog.help_about = org.goorm.core.help.about;
			this.dialog.help_about.init();
		}

		

		if (org.goorm.core.localization) {
			this.module.localization = org.goorm.core.localization;
			this.module.localization.init();
		}

		if (org.goorm.core.utility.loading_bar) {
			this.module.loading_bar = org.goorm.core.utility.loading_bar;
			this.module.loading_bar.init();
		}

		if (org.goorm.core.utility.toast) {
			this.module.toast = org.goorm.core.utility.toast;
			this.module.toast.init();
		}

		

		if (this.module.preference) {
			this.dialog.preference = this.module.preference;
			this.dialog.preference.init_dialog();
		}

		// for Selenium IDE
		alert = __alert;
		alert.init();
		notice.init();
	},

	load: function () {

	},

	skin: function (skin_name) {
		this.get_css(skin_name);
	},

	get_css: function (url) {
		$("head").append("<link>");
		css = $("head").children(":last");
		css.attr({
			rel: "stylesheet",
			type: "text/css",
			href: url
		});
	},

	start: function () {
		var self = this;

		var goorm_dialog_container = $("#goorm_dialog_container");
		goorm_dialog_container_child = "";
		goorm_dialog_container_child += "<div id='loading_panel_container'></div>";
		goorm_dialog_container_child += "<div id='loading_background'></div>";
		goorm_dialog_container.append(goorm_dialog_container_child);

		var loading_panel_container = $("#loading_panel_container");
		loading_panel_container_child = "";
		loading_panel_container_child += "<div id='main_loading_image'></div>";
		loading_panel_container_child += "<div id='loading_message'></div>";
		loading_panel_container_child += "<div id='login_box_bg'></div>";
		loading_panel_container_child += "<div id='login_box'></div>";
		loading_panel_container_child += "<div id='local_login_box'></div>";
		loading_panel_container.append(loading_panel_container_child);

		

		$('#local_login_box').append("<input type='button' id='goorm_local_mode_button' localization_key='private_mode' value='Private Mode' />");

		

		this.local_mode_button = new YAHOO.widget.Button("goorm_local_mode_button", {
			onclick: {
				fn: function () {
					self.access_local_mode();
				}
			},
			label: '<span localization_key="private_mode">Private Mode</span>'
		});

		var loading_background = $("#loading_background");
		loading_background.css('position', "absolute").width($(window).width()).height($(window).height());
		loading_background.css('left', 0).css('top', 0).css('z-index', 999);

		$(window).resize(function () {
			loading_background.width($(window).width()).height($(window).height());
		});

		loading_panel_container.css('display', "none").width(640).height(480).css('position', "absolute").css('z-index', 1000).css('left', $(window).width() / 2 - 320).css('top', $(window).height() / 2 - 240).fadeIn(2000);
	},

	

	show_local_login_box: function () {
		$("#local_login_box").delay(1500).fadeIn(2000);
	},

	local_complete: function () {
		$("#goorm").show();
		$('.goorm_user_menu').show();
		$('div.goorm_layout').show();

		$("#loading_background").delay(1000).fadeOut(1000);
		$("#loading_panel_container").delay(1500).fadeOut(1000);

		this.dialog.project_property.refresh_toolbox();

		$('.admin_menu_item').addClass('yuimenuitem-disabled');
		$('.admin_menu_label').addClass('yuimenuitemlabel-disabled').hide();

		$(core).trigger('goorm_login_complete');
	},

	access_local_mode: function () {
		this.user.id = "";
		this.user.email = "";
		this.user.name = "";
		this.user.nick = "";
		this.user.level = "Member";
		this.user.type = "password";

		for (var i = 0; i < Math.random() * 4 + 2; i++) {
			this.user.id += String.fromCharCode(97 + Math.round(Math.random() * 25));
		}
		this.user.id = this.user.id + '_guest';

		for (var j = 0; j < Math.random() * 4 + 2; j++) {
			this.user.name += String.fromCharCode(97 + Math.round(Math.random() * 25));
		}
		this.user.name = this.user.name + '_guest';

		for (var j = 0; j < Math.random() * 4 + 2; j++) {
			this.user.nick += String.fromCharCode(97 + Math.round(Math.random() * 25));
		}
		this.user.nick = this.user.nick + '_guest';

		localStorage.user = JSON.stringify(this.user);
		this.local_complete();
	},

	new_main_window: function () {
		
		window.open("./");
		

		
	},

	is_touchable_device: function () {
		var el = document.createElement('div');
		el.setAttribute('ongesturestart', 'return;');

		if (typeof el.ongesturestart == "function") {
			return true;
		} else {
			return false;
		}
	},

	test_web_socket: function () {
		if ("WebSocket" in window) {
			return true;
		} else {
			// the browser doesn't support WebSockets
			return false;
		}
	},

	pause: function (millis) {
		var date = new Date();
		var curDate = null;
		do {
			curDate = new Date();
		}
		while (curDate - date < millis);
	},

	cookie_manager: {
		set: function (name, data, exdays) {
			var exdate = new Date();
			exdate.setDate(exdate.getDate() + exdays);

			var value = escape(data) + ((exdays === null) ? "" : "; expires=" + exdate.toGMTString() + ";domain=.goorm.io;path=/");

			document.cookie = name + "=" + value;
		},

		del: function (name) {
			var expire_date = new Date();

			expire_date.setDate(expire_date.getDate() - 10);
			document.cookie = name + "=path=/;domain=.goorm.io" + "; expires=" + expire_date.toGMTString();
		},

		get: function (c_name) {
			var c_value = document.cookie;
			var c_start = c_value.indexOf(" " + c_name + "=");

			if (c_start == -1) {
				c_start = c_value.indexOf(c_name + "=");
			}
			if (c_start == -1) {
				c_value = null;
			} else {
				c_start = c_value.indexOf("=", c_start) + 1;
				var c_end = c_value.indexOf(";", c_start);

				if (c_end == -1) {
					c_end = c_value.length;
				}

				c_value = unescape(c_value.substring(c_start, c_end));
			}

			return c_value;
		}
	}
};