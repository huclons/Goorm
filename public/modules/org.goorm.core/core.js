/**
 * @description <p>Copyright Sung-tae Ryu. All rights reserved.</p>
 * <p>Code licensed under the GPL v2 License:</p>
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module core
 **/

var org = function() {
	var goorm = null;
};

org.goorm = function() {
	var core = null;
};

/**
 * @description This is an goorm core.  
 * <p>goorm starts with this core.</p>
  * @class core
 **/
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
		loading_bar: null
	}
		
	this.container = "";
	this.skinName = "";
		
	this.selectedFile = null;
	this.xml = null;
	this.loadingPanel = null;
		
	this.dialog = {
		new_project: null,
		open_project: null,
		new_file: null,
		new_other_file: null,
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
		build_all: null,
		build_project: null,
		build_clean: null,
		build_configuration: null,
		build_property: null,
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
		help_bug_report: null
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
		current_project_path: "",
		current_project_name: "",
		current_project_type: ""
	};
	
	this.dialogLoadingCount = 0;	
	this.dialogCount = 27;	

	this.loadingCount = 0;	
	this.fileTypes = null;	
	
	this.dictionary = null;
	this.serverTheme = null;
	this.serverLanguage = null;
};

org.goorm.core.prototype = {
	init: function(container) {
		
		//this.startLoading();
		
		var self = this;
		this.fileTypes = $.makeArray();
		
		
		$(this).bind("layoutLoaded", function () {
			console.log("layout Loaded");

			this.module.plugin_manager.getAllPlugins();
			this.module.plugin_manager.loadAllPlugins(0);
		});	
		
		$(this).bind("preferenceLoadingComplete", function () {
			console.log("preference Loading Complete");
		});
		
		$(this).bind("pluginLoaded", function () {
			console.log("plugin Loaded");
			//Preference
			//this.dialogPreference = new org.goorm.core.preference();
			//this.dialogPreference.init();

			this.main();
		});
		
		this.loadingCompleteFlag = 0;
		//Loading Animation
		$(this).bind("goormLoading", function () {
			if(self.loadingCount < 37 + core.module.plugin_manager.pluginList.length) {
				self.loadingCount++;
				//console.log(self.loadingCount);
				$("#goormLoadingStatusBar").width($("#goormLoadingStatusBar").width()+450/(37+core.module.plugin_manager.pluginList.length));
			}
			else {
				if(!self.loadingCompleteFlag){
					$(self).trigger("goormLoadingComplete");
					self.loadingCompleteFlag = true;
				}
			}
		});

		//Loading Ending
		$(this).bind("goormLoadingComplete", function () {
			console.log("loading complete");
			
			$("input").bind("focus", function () {
				self.focusOnInputBox = true;
			});
			
			$("input").bind("blur", function () {
				self.focusOnInputBox = false;
			});

			self.module.layout.resizeAll();

			self.module.action.init();
			
			self.endLoading();
			
			var goormLoadingEndTime = new Date().getTime(); 
			
			m.s("------------------------------------------------------------", "org.goorm.core");
			m.s("Browser Name : " + self.browser_info.browser, "org.goorm.core");
			m.s("Browser Version : " + self.browser_info.browserVersion, "org.goorm.core");
			m.s("------------------------------------------------------------", "org.goorm.core");
			m.s("Device Type : " + self.deviceType, "org.goorm.core");
			m.s("Resolution : " + screen.width + " x " + screen.height, "org.goorm.core");	
			m.s("OS Type : " + self.device_info.osType, "org.goorm.core");	
			m.s("Touchable : " + self.isTouchable, "org.goorm.core");
			m.s("WebSocket : " + self.isSupportingWebSocket, "org.goorm.core");			
			m.s("------------------------------------------------------------", "org.goorm.core");
			m.s("Loading Time : " + (goormLoadingEndTime - goormLoadingStartTime) / 1000 + " sec.", "org.goorm.core");			
			m.s("------------------------------------------------------------", "org.goorm.core");
			
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

				self.serverTheme = $(xml).find("Theme").text();

				self.serverLanguage = $(xml).find("Language").text();
			}
		});
		*/					
		
		//Toolbar
		this.module.toolbar = new org.goorm.core.toolbar();
		this.module.toolbar.init();		
		
		//Search Tab
		this.module.search = new org.goorm.core.search.message();		
		
		//Plugin Loading Aspects
		this.module.plugin_manager = new org.goorm.plugin.manager();
		this.module.plugin_manager.init();

		//Shortcuts
		this.module.shortcut_manager = new org.goorm.core.shortcut.manager();
		this.module.shortcut_manager.init();		
		
		//Menu Actions
		this.module.action = new org.goorm.core.menu.action();

		this.module.browser = new org.goorm.core.browser();
		this.browser_info = this.module.browser.get();

		this.module.device = new org.goorm.core.device();
		this.device_info = this.module.device.get();		

		this.module.fn = new org.goorm.core.fn();
		this.module.fn.init();
		
		this.env.touchable = this.isTouchDevice();
		this.env.websocket_support = this.testWebSocket();
		
		$('.goormVersion').html("goorm IDE " + this.version);
		
		$(document).bind("contextmenu", function(e) {
			e.preventDefault();
		});
		
		
		this.module.layout = new org.goorm.core.layout();
		this.module.layout.init(container);

		console.log("!");
	},
	
	/**
	 * goorm main process.  
	 * @method main 
	 **/
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
		
		this.dialog.new_untitled_textfile = new org.goorm.core.file._new.untitledTextFile();
		this.dialog.new_untitled_textfile.init();
		
		this.dialog.open_file = new org.goorm.core.file.open();
		this.dialog.open_file.init();
		
		this.dialog.open_url = new org.goorm.core.file.openURL();
		this.dialog.open_url.init();
		
		this.dialog.save_as_file = new org.goorm.core.file.saveAs();
		this.dialog.save_as_file.init();
		
		this.dialog.rename_file = new org.goorm.core.file.rename();
		this.dialog.rename_file.init();
		
		this.dialog.move_file = new org.goorm.core.file.move();
		this.dialog.move_file.init();
				
		this.dialog.print = new org.goorm.core.printer();
		this.dialog.print.init();
		
		this.dialog.switch_workspace = new org.goorm.core.file.switchWorkspace();
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
		
		this.dialog.build_all = new org.goorm.core.project.build.buildAll();
		this.dialog.build_all.init();
		
		this.dialog.build_project = new org.goorm.core.project.build.buildProject();
		this.dialog.build_project.init();
		
		this.dialog.build_clean = new org.goorm.core.project.build.clean();
		this.dialog.build_clean.init();
		
		this.dialog.build_configuration = new org.goorm.core.project.build.configuration();
		this.dialog.build_configuration.init();
		
		this.dialog.property = new org.goorm.core.file.property();
		this.dialog.property.init();
		
		this.dialog.find_replace = new org.goorm.core.edit.findReplace();
		this.dialog.find_replace.init();
		
		this.dialog.project_property = new org.goorm.core.project.property();
		this.dialog.project_property.init();
		
		this.dialog.join_project = new org.goorm.core.collaboration.joinProject();
		this.dialog.join_project.init();
		
		this.dialog.collaboration_settings = new org.goorm.core.collaboration.settings();
		this.dialog.collaboration_settings.init();
		
		this.dialog.help_contents = new org.goorm.core.help.contents();
		this.dialog.help_contents.init();
		
		this.dialog.help_search = new org.goorm.core.help.search();
		this.dialog.help_search.init();
		
		this.dialog.help_tips_and_tricks = new org.goorm.core.help.tipsAndTricks();
		this.dialog.help_tips_and_tricks.init();
		
		this.dialog.help_check_for_updates = new org.goorm.core.help.checkForUpdates();
		this.dialog.help_check_for_updates.init();
		
		this.dialog.help_install_new_plugin = new org.goorm.core.help.installNewPlugin();
		this.dialog.help_install_new_plugin.init();
			
		this.dialog.help_about = new org.goorm.core.help.about();
		this.dialog.help_about.init();
		
		this.dialog.help_bug_report = new org.goorm.core.help.bugReport();
		this.dialog.help_bug_report.init();		
		
		this.module.code_generator = new org.goorm.core.codeGenerator();
		this.module.code_generator.init();
		
		this.module.localization = new org.goorm.core.localization();
		this.module.localization.init();
		//$(core).trigger("coreDialogLoaded");
		
		this.module.loading_bar = new org.goorm.core.utility.loadingbar();
		this.module.loading_bar.init();
		
		alert.init();
		notice.init();
	},

	load: function() {

	},

	skin: function(skinName) {
		this.getCSS(skinName);
	},

	getCSS: function(url) {
		$("head").append("<link>");
		css = $("head").children(":last");
		css.attr({
		  rel:  "stylesheet",
		  type: "text/css",
		  href: url
		});
	},

	startLoading: function() {
		$("#goormDialogContainer").append("<div id='loadingPanelContainer'></div>");
		$("#goormDialogContainer").append("<div id='loadingBackground'></div>");
		$("#loadingPanelContainer").append("<div id='mainLoadingImage' style='background-image:url(images/loading.png); width:660px; height:400px; position:relative;'><div id='goormLoadingStatusBar' style='left:170px; top:340px; position:absolute; width:0px; height:30px; background-color:#eee;'></div></div>");
		$("#loadingPanelContainer").append("<div style='top:10px; left:50px; width:530px; position:absolute; text-align:left;'><font style='font-size:11px; color:#FFF;'>Developer : Sung-tae Ryu, Chonghyun Lee, Shinwook Gahng, Cheolhyun Park, Noori Kim, Byuongwoong Ahn, Eungwi Jo.</font></div>");
		$("#loadingPanelContainer").append("<div id='loadingMessage' style='top:345px; left:215px; position:absolute; text-align:left; font-size:10px; color:#fff;'></div>");


		$("#loadingBackground").css('position', "absolute");
		$("#loadingBackground").width($(window).width());
		$("#loadingBackground").height($(window).height());
		$("#loadingBackground").css('left', 0);
		$("#loadingBackground").css('top', 0);
		$("#loadingBackground").css('z-index', 999);
		$("#loadingBackground").css('background-color', "#EEE");		
		
		
		$("#loadingPanelContainer").css('display', "none");
		$("#loadingPanelContainer").width(660);
		$("#loadingPanelContainer").height(400);
		$("#loadingPanelContainer").css('position', "absolute");
		$("#loadingPanelContainer").css('z-index', 1000);		
		$("#loadingPanelContainer").css('left', $(window).width()/2-300);
		$("#loadingPanelContainer").css('top', $(window).height()/2-200);
		$("#loadingPanelContainer").fadeIn(2000);
	},

	endLoading: function() {
		$("#goorm").show();
		$("#loadingBackground").delay(1000).fadeOut(1000);
		$("#loadingPanelContainer").delay(1000).fadeOut(1000);
						
		this.dialog.project_property.refreshToolBox();
	},

	adaptSmartPad: function () {
		
		function touchHandler(event) {
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
			
			var simulatedEvent = document.createEvent("MouseEvent");
			simulatedEvent.initMouseEvent(type, true, true, document, 1, 
									  first.screenX, first.screenY, 
									  first.clientX, first.clientY, false, 
									  false, false, false, 0, null);
			
			first.target.dispatchEvent(simulatedEvent);
			
			event.preventDefault();
		}
		
		document.addEventListener("touchstart", touchHandler, true);
		document.addEventListener("touchmove", touchHandler, true);
		document.addEventListener("touchend", touchHandler, true);
		document.addEventListener("touchcancel", touchHandler, true);
	},

	newMainWindow: function () {
		window.open("./");
	},

	isTouchDevice: function () {
		var el = document.createElement('div');
		el.setAttribute('ongesturestart', 'return;');
		
		if (typeof el.ongesturestart == "function"){
			return true;
		}
		else {
			return false
		}
	},

	testWebSocket: function () {
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