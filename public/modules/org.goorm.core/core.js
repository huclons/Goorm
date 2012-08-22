/**
 * @description <p>Copyright Sung-tae Ryu. All rights reserved.</p>
 * <p>Code licensed under the GPL v2 License:</p>
 * http://www.goorm.org/License
 **/

var org = function() {
	var goorm = null;
};

org.goorm = function() {
	var core = null;
};

org.goorm.core = function() {

	this.user = {
		first_name: null,
		last_name: null,
		email: null
	};
	
	this.env = {
		version: "1.0.0.alpha",
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
		authorization: null,
		code_generator: null, // has it been used?
		collaboration: null,
		debug: null,
		dialog: null,
		editor: null,
		file: null,
		dialog: null,
		key_listener: null,
		preference: null,
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
		dictionary: null,
		theme: null,
		theme_details: null
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
		open_url: null,
		save_as_file: null,
		rename_file: null,
		move_file: null,
		print: null,
		switch_workspace: null,
		import_file: null,
		export_file: null,
		export_project: null,
		import_project: null,
		delete_project:null,
		build_all: null,
		build_project: null,
		build_clean: null,
		build_configuration: null,
		property: null,
		find_and_replace: null,
		preference: null,
		project_property: null,
		join_project: null,
		collaboration_settings: null,
		help_contents: null,
		help_search: null,
		help_tips_and_tricks: null,
		help_check_for_updates: null,
		help_install_new_plugin: null,
		help_about: null,
		help_bug_report: null,
		loaded_count:0		
	};
	
	this.flag = {
		chat_on: false,
		collaboration_on: false,
		collaboration_draw_on: false
	};
	
	this.status = {
		keydown: false,
		focus_on_editor: false,
		focus_on_inputbox: false,
		selected_file: "",
		current_project_path: "",
		current_project_name: "",
		current_project_type: ""
	};
	
	this.dialog_loading_count = 0;
	//this.dialog_count = 27;

	this.loading_count = 0;
	this.filetypes = null;

	this.server_theme = null;
	this.server_language = null;
	
	this.plugins = [];
	
	this.preference = null;
};

org.goorm.core.prototype = {
	init: function(container) {
		
		this.start();
		
		var self = this;
		this.filetypes = [];
		
		
		$(this).bind("layout_loaded", function () {
			console.log("layout Loaded");

			this.module.plugin_manager.get();
		});	
		
		$(this).bind("preference_load_complete", function () {
			console.log("preference Loading Complete");

			
		});
		
		$(this).bind("plugin_loaded", function () {
			console.log("plugin Loaded");
			
			this.module.plugin_manager.load(0);
			
			this.main();
		});
		
		this.load_complete_flag = false;
		
		//Loading Animation
		$(this).bind("goorm_loading", function () {
			if(self.loading_count < Object.keys(core.dialog).length - 5 + parseInt(core.module.plugin_manager.list.length)) {
				self.loading_count++;
				$("#goorm_loading_status_bar").width($("#goorm_loading_status_bar").width() + 636 / (Object.keys(core.dialog).length - 5 + parseInt(core.module.plugin_manager.list.length)));
			}
			else {
				if(!self.load_complete_flag){
					console.log("complete: " + self.loading_count);
					$(self).trigger("goorm_load_complete");
					self.load_complete_flag = true;
				}
			}
		});
		
		$(core).bind("layout_loaded", function () {
			self.module.layout.resize_all();
		});

		//Loading Ending
		$(this).bind("goorm_load_complete", function () {
			$("input").bind("focus", function () {
				self.status.focus_on_inputbox = true;
			});
			
			$("input").bind("blur", function () {
				self.status.focus_on_inputbox = false;
			});
			
			$(document).bind("contextmenu", function(e) {
				e.preventDefault();
			});

			//console.log($(".yui-layout-unit-left").find(".yui-layout-wrap").html());
			
			self.module.action.init();
			
			self.end_loading();
			
			var goorm_loading_end_time = new Date().getTime(); 
			
			m.s("------------------------------------------------------------", "org.goorm.core");
			m.s("Browser Name : " + self.module.browser.name, "org.goorm.core");
			m.s("Browser Version : " + self.module.browser.version, "org.goorm.core");
			m.s("------------------------------------------------------------", "org.goorm.core");
			m.s("Device Type : " + self.module.device.type, "org.goorm.core");
			m.s("Resolution : " + screen.width + " x " + screen.height, "org.goorm.core");	
			m.s("OS Type : " + self.module.device.os, "org.goorm.core");	
			m.s("Touchable : " + self.env.touchable, "org.goorm.core");
			m.s("WebSocket : " + self.env.websocket_support, "org.goorm.core");			
			m.s("------------------------------------------------------------", "org.goorm.core");
			m.s("Loading Time : " + (goorm_loading_end_time - goorm_loading_start_time) / 1000 + " sec.", "org.goorm.core");			
			m.s("------------------------------------------------------------", "org.goorm.core");
			
			//theme
			self.module.theme = new org.goorm.core.theme();
			self.module.theme.init();
/*
			self.module.theme_details = new org.goorm.core.theme.details();
			self.modile.theme_details.init();
*/
		});	
		
		// init dictionary		
		//this.dictionary = new org.goorm.core.edit.dictionary();
		//this.dictionary.init();
		
		/*
		$.ajax({
			type: 'get', 
			dataType: "xml",
			url: "config/server.xml", 
			data: "arg=L", 
			success: function(xml) {

				self.server_theme = $(xml).find("Theme").text();

				self.server_language = $(xml).find("Language").text();
			}
		});
		*/					
		
		//Toolbar
		this.module.toolbar = new org.goorm.core.toolbar();
		this.module.toolbar.init();		
		
		//Search Tab
		this.module.search = new org.goorm.core.search.message();		
		
		//Preference
		this.module.preference = new org.goorm.core.preference();
		this.module.preference.init();
		
		//Plugin Loading Aspects
		this.module.plugin_manager = new org.goorm.plugin.manager();
		this.module.plugin_manager.init();

		//Shortcuts
		this.module.shortcut_manager = new org.goorm.core.shortcut.manager();
		this.module.shortcut_manager.init();		
		
		//Menu Actions
		this.module.action = new org.goorm.core.menu.action();

		this.module.browser = new org.goorm.core.browser();
		this.module.browser.init();

		this.module.device = new org.goorm.core.device();
		this.module.device.init();

		this.module.fn = new org.goorm.core.fn();
		this.module.fn.init();
		
		this.env.touchable = this.is_touchable_device();
		this.env.websocket_support = this.test_web_socket();
		
		$('.goorm_version').html("goorm IDE " + this.version);
		
		this.module.layout = new org.goorm.core.layout();
		this.module.layout.init(container);

	},
	
	main: function() {
		
		this.dialog.new_project = new org.goorm.core.project._new();
		this.dialog.new_project.init();
		
		this.dialog.open_project = new org.goorm.core.project.open();
		this.dialog.open_project.init();
		
		this.dialog.new_file = new org.goorm.core.file._new();
		this.dialog.new_file.init();
		
		this.dialog.new_other_file = new org.goorm.core.file._new.other();
		this.dialog.new_other_file.init();
		
		this.dialog.new_folder = new org.goorm.core.file._new.folder();
		this.dialog.new_folder.init();
		
		this.dialog.new_untitled_textfile = new org.goorm.core.file._new.untitled_textfile();
		this.dialog.new_untitled_textfile.init();
		
		this.dialog.open_file = new org.goorm.core.file.open();
		this.dialog.open_file.init();
		
		this.dialog.open_url = new org.goorm.core.file.open_url();
		this.dialog.open_url.init();
		
		this.dialog.save_as_file = new org.goorm.core.file.save_as();
		this.dialog.save_as_file.init();
		
		this.dialog.rename_file = new org.goorm.core.file.rename();
		this.dialog.rename_file.init();
		
		this.dialog.move_file = new org.goorm.core.file.move();
		this.dialog.move_file.init();
				
		this.dialog.print = new org.goorm.core.printer();
		this.dialog.print.init();
		
		this.dialog.switch_workspace = new org.goorm.core.file.switch_workspace();
		this.dialog.switch_workspace.init();

		this.dialog.import_file = new org.goorm.core.file._import();
		this.dialog.import_file.init();
		
		this.dialog.export_file = new org.goorm.core.file._export();
		this.dialog.export_file.init();
		
		this.dialog.export_project = new org.goorm.core.project._export();
		this.dialog.export_project.init();
		
		this.dialog.import_project = new org.goorm.core.project._import();
		this.dialog.import_project.init();
		
		this.dialog.delete_project = new org.goorm.core.project._delete();
		this.dialog.delete_project.init();
		
		this.dialog.build_all = new org.goorm.core.project.build.all();
		this.dialog.build_all.init();
		
		this.dialog.build_project = new org.goorm.core.project.build.project();
		this.dialog.build_project.init();
		
		this.dialog.build_clean = new org.goorm.core.project.build.clean();
		this.dialog.build_clean.init();
		
		this.dialog.build_configuration = new org.goorm.core.project.build.configuration();
		this.dialog.build_configuration.init();
		
		this.dialog.property = new org.goorm.core.file.property();
		this.dialog.property.init();
		
		this.dialog.find_and_replace = new org.goorm.core.edit.find_and_replace();
		this.dialog.find_and_replace.init();
		
		this.dialog.preference = this.module.preference;
		this.dialog.preference.init_dialog();
		
		this.dialog.project_property = new org.goorm.core.project.property();
		this.dialog.project_property.init();
		
		this.dialog.join_project = new org.goorm.core.collaboration.join();
		//this.dialog.join_project.init();
		
		this.dialog.collaboration_settings = new org.goorm.core.collaboration.settings();
		//this.dialog.collaboration_settings.init();
		
		this.dialog.help_contents = new org.goorm.core.help.contents();
		this.dialog.help_contents.init();
		
		this.dialog.help_search = new org.goorm.core.help.search();
		this.dialog.help_search.init();
		
		this.dialog.help_tips_and_tricks = new org.goorm.core.help.tips_and_tricks();
		this.dialog.help_tips_and_tricks.init();
		
		this.dialog.help_check_for_updates = new org.goorm.core.help.check_for_updates();
		this.dialog.help_check_for_updates.init();
		
		this.dialog.help_install_new_plugin = new org.goorm.core.help.install_new_plugin();
		this.dialog.help_install_new_plugin.init();
			
		this.dialog.help_about = new org.goorm.core.help.about();
		this.dialog.help_about.init();
		
		this.dialog.help_bug_report = new org.goorm.core.help.bug_report();
		this.dialog.help_bug_report.init();		
		
		
		////////////////////////////////////////////////////////////////////////////////////////
		//module
		////////////////////////////////////////////////////////////////////////////////////////
		
		this.module.code_generator = new org.goorm.core.code_generator();
		this.module.code_generator.init();
		
		this.module.localization = new org.goorm.core.localization();
		this.module.localization.init();
		//$(core).trigger("coreDialogLoaded");
		
		this.module.loading_bar = new org.goorm.core.utility.loading_bar();
		this.module.loading_bar.init();
		
		alert.init();
		notice.init();
	},

	load: function() {

	},

	skin: function(skin_name) {
		this.get_css(skin_name);
	},

	get_css: function(url) {
		$("head").append("<link>");
		css = $("head").children(":last");
		css.attr({
		  rel:  "stylesheet",
		  type: "text/css",
		  href: url
		});
	},

	start: function() {
		$("#goorm_dialog_container").append("<div id='loading_panel_container'></div>");
		$("#goorm_dialog_container").append("<div id='loading_background'></div>");
		$("#loading_panel_container").append("<div id='main_loading_image' style='background-image:url(images/loading.png); width:640px; height:480px; position:relative;'><div id='goorm_loading_status_bar' style='left:2px; top:414px; position:absolute; width:7px; height:10px; background-color:#000; filter:alpha(opacity=50); opacity:0.5;'></div></div>");
		$("#loading_panel_container").append("<div style='top:10px; left:10px; width:620px; position:absolute; text-align:left; filter:alpha(opacity=50); opacity:0.5;'><font style='font-size:11px; color:#000;'>Developer : Sung-tae Ryu, Chonghyun Lee, Shinwook Gahng, Cheolhyun Park, Noori Kim, Byuongwoong Ahn, Eungwi Jo.</font></div>");
		$("#loading_panel_container").append("<div id='loading_message' style='top:345px; left:215px; position:absolute; text-align:left; font-size:10px; color:#fff;'></div>");


		$("#loading_background").css('position', "absolute");
		$("#loading_background").width($(window).width());
		$("#loading_background").height($(window).height());
		$("#loading_background").css('left', 0);
		$("#loading_background").css('top', 0);
		$("#loading_background").css('z-index', 999);
		$("#loading_background").css('background-color', "#EEE");		
		
		
		$("#loading_panel_container").css('display', "none");
		$("#loading_panel_container").width(640);
		$("#loading_panel_container").height(480);
		$("#loading_panel_container").css('position', "absolute");
		$("#loading_panel_container").css('z-index', 1000);		
		$("#loading_panel_container").css('left', $(window).width()/2-320);
		$("#loading_panel_container").css('top', $(window).height()/2-240);
		$("#loading_panel_container").fadeIn(2000);
	},

	end_loading: function() {
		$("#goorm").show();
		$("#loading_background").delay(1000).fadeOut(1000);
		$("#loading_panel_container").delay(1000).fadeOut(1000);
						
		this.dialog.project_property.refresh_toolbox();
	},

	adapt_smart_pad: function () {
		
		function touch_handler(event) {
			var touches = event.changedTouches,
				first = touches[0],
				type = "";
				 switch(event.type)
			{
				case "touchstart": type = "mousedown"; break;
				case "touchmove":  type="mousemove"; break;        
				case "touchend":   type="mouseup"; break;
				default: return;
			}
			
			//initMouseEvent(type, canBubble, cancelable, view, clickCount, 
			//           screenX, screenY, clientX, clientY, ctrlKey, 
			//           altKey, shiftKey, metaKey, button, relatedTarget);
			
			var simulated_event = document.createEvent("MouseEvent");
			simulated_event.initMouseEvent(type, true, true, document, 1, 
									  first.screenX, first.screenY, 
									  first.clientX, first.clientY, false, 
									  false, false, false, 0, null);
			
			first.target.dispatchEvent(simulated_event);
			
			event.preventDefault();
		}
		
		document.addEventListener("touchstart", touch_handler, true);
		document.addEventListener("touchmove", touch_handler, true);
		document.addEventListener("touchend", touch_handler, true);
		document.addEventListener("touchcancel", touch_handler, true);
	},

	new_main_window: function () {
		window.open("./");
	},

	is_touchable_device: function () {
		var el = document.createElement('div');
		el.setAttribute('ongesturestart', 'return;');
		
		if (typeof el.ongesturestart == "function"){
			return true;
		}
		else {
			return false;
		}
	},

	test_web_socket: function () {
		if ("WebSocket" in window) {
			return true;
		}
		else {
			// the browser doesn't support WebSockets
			return false;
		}
	},

	pause: function (millis) {
		var date = new Date();
	  	var curDate = null;
	  	do { curDate = new Date(); }
	  	while(curDate - date < millis);
	}
};