/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.layout = function () {
	this.layout = null;
	this.inner_layout = null;
	this.left_tabview = null;
	this.inner_right_tabview = null;
	this.inner_bottom_tabview = null;
	this.inner_center_tabview = null;
	this.table_properties = null;
	this.treeview_project = null;
	this.mainmenu = null;
	this.toolbar = null;
	this.workspace = null;
	this.startpage = null;
	this.window_manager = null;
	this.chat = null;
	this.tab_project = null;
	this.tab_toolbox = null;
};

org.goorm.core.layout.prototype = {

	init: function(container) {
		
		var self = this;
		
		//Set layout
		this.layout = new YAHOO.widget.Layout({
			units:
			[
				{ position: 'top', height: 59,maxHeight:150, body: container+'_top', scroll: null, zIndex: 2, gutter: '0px 0px 3px 0px' },
				{ position: 'left', width: 250, body: container+'_left', animate: false, proxy:false, scroll: false, zIndex: 1, resize: true, gutter: '0px 3px 0px 0px', collapse: true, minWidth: 200 },
				{ position: 'center', body: container+'_center_inner_layout', scroll: false },
				{ position: 'bottom', height:30, body: container+'_bottom', scroll: false, gutter: '0px 0px 0px 0px' }
			]
		});

				

		this.layout.on('render', function() {
			//Set main menu
			self.attach_mainmenu(container + "_mainmenu"); 
			
			self.attach_toolbar(container + "_main_toolbar"); 
			
						
			//Set nested inner layout
			var el = self.layout.getUnitByPosition('center').get('wrap');
			
			self.inner_layout = new YAHOO.widget.Layout(el, {
				parent: self.layout,
				units:
				[
					{ position: 'right', width: 350, resize: true, scroll: false, body: container+'_inner_layout_right', animate: false, proxy:false, gutter: '0px 0px 0px 3px', collapse: !ENV_COLLAPSE_RIGHT },
					{ position: 'bottom', height: 200, body: container+'_inner_layout_bottom', animate: false, proxy:false, scroll: false, resize: true, gutter: '3px 0px 0px 0px', collapse: !ENV_COLLAPSE_BOTTOM },
					{ position: 'center', body: container+'_inner_layout_center', scroll: false }
				]
			});
			
			self.inner_layout.render();

			
			if (ENV_COLLAPSE_BOTTOM) {
				self.inner_layout.getUnitByPosition("bottom").collapse();
			}
			
			if (ENV_COLLAPSE_RIGHT) {
				self.inner_layout.getUnitByPosition("right").collapse();
			}			
		});
		
		//////////////////////////////////////////////////////////////////////////////////////////
		// Left
		//////////////////////////////////////////////////////////////////////////////////////////
		
		//Left TabView
		this.left_tabview = new YAHOO.widget.TabView(container+'_left');
		
		//Project Explorer Tab
		this.attach_project_explorer(this.left_tabview);
		
		this.attach_toolbox(this.left_tabview);
		
		//Select first tab
		this.left_tabview.selectTab(0);
		
		//////////////////////////////////////////////////////////////////////////////////////////
		// Right
		//////////////////////////////////////////////////////////////////////////////////////////
				
		//Right TabView
		this.inner_right_tabview = new YAHOO.widget.TabView(container+'_inner_layout_right');
		
		//Properties Tab
		this.attach_properties(this.inner_right_tabview);
		
		//Object Explorer Tab
		this.attach_object_explorer(this.inner_right_tabview);
		
		//Chat Tab
		this.attach_chat(this.inner_right_tabview);
		
		//Select first tab
		this.inner_right_tabview.selectTab(0);		
		
		//////////////////////////////////////////////////////////////////////////////////////////
		// Bottom
		//////////////////////////////////////////////////////////////////////////////////////////
				
		//Bottom TabView
		this.inner_bottom_tabview = new YAHOO.widget.TabView(container+'_inner_layout_bottom');
		
		//Message Tab
		this.attach_message(this.inner_bottom_tabview);
		
		//Debug Tab
		this.attach_debug(this.inner_bottom_tabview);
		
		//Console Tab
		this.attach_console(this.inner_bottom_tabview);
		
		//Search Tab
		this.attach_search(this.inner_bottom_tabview);
		
		//Select first tab
		this.inner_bottom_tabview.selectTab(0);		
		
		//////////////////////////////////////////////////////////////////////////////////////////
		// Center
		//////////////////////////////////////////////////////////////////////////////////////////
		
		this.workspace = new org.goorm.core.layout.workspace();
		this.workspace.init(container+'_inner_layout_center');
		
		//this.startpage = new org.goorm.core.layout.startpage();
		//this.startpage.init(container+'inner_layoutCenter');
		
		//////////////////////////////////////////////////////////////////////////////////////////
		// Final
		//////////////////////////////////////////////////////////////////////////////////////////
		
		this.layout.render();		
		
		$(window).resize(function(){
			self.resize_all();
			self.layout.getUnitByPosition("top").set("height",$("#goorm_mainmenu").height()+$("#goorm_main_toolbar").height()+7);
		});

		this.inner_layout.on("start_resize", function() {
			$(".dummyspace").css("z-index", 999);
		});

		this.inner_layout.getUnitByPosition('center').on("resize", this.resize_all);
		
		
		//this.resize_all();
		//$(window).resize();
		//this.layout.getUnitByPosition("top").set("height",$("#goorm_mainmenu").height()+$("#goorm_main_toolbar").height()+5);
		
		$(core).trigger("layout_loaded");
	},

	attach_mainmenu: function(container) {
		this.mainmenu = new YAHOO.widget.MenuBar(container, { 
			autosubmenudisplay: false, 
			hidedelay: 750, 
			lazyload: true ,
			effect: {  
				effect: YAHOO.widget.ContainerEffect.FADE, 
				duration: 0.15 
			}
		});

		this.mainmenu.render();
	
	},

	detach_mainmenu: function() {
	},

	show_mainmenu: function() {
	},

	hide_mainmenu: function() {
	},
	
	attach_project_explorer: function(target) {
		var self = this;
		
		//this.tab_project = new YAHOO.widget.Tab({ label: "Project" +"&nbsp;"+ " <img src='images/icons/context/closebutton.png' class='close button' />", content: "<div id='project_explorer' class='directory_treeview'></div>" });
		this.tab_project = new YAHOO.widget.Tab({ label: "Project", content: "<div id='project_explorer' class='directory_treeview'></div>" });

		//attaching tab element
		target.addTab(this.tab_project);
		
		//close button click event assign
		/*
		$(this.tab_project.get("labelEl")).find(".close").click(function() {
			self.detach_project_explorer();
			
			return false;
		});
		*/
		
		this.project_explorer = new org.goorm.core.project.explorer();
		this.project_explorer.init();
	},
	
	detach_project_explorer: function() {
		 this.left_tabview.removeTab(this.tab_project);

		 delete this;
	},
	
	attach_toolbox: function(target) {
		var self = this;
		
		//this.tab_toolbox = new YAHOO.widget.Tab({ label: "Tool Box" +"&nbsp;"+ " <img src='images/icons/context/closebutton.png' class='close button' />", content: "<div id='toolbox'></div>" });
		this.tab_toolbox = new YAHOO.widget.Tab({ label: "Tool Box", content: "<div id='toolbox'></div>" });

		//attaching tab element
		target.addTab(this.tab_toolbox);		
		
		//close button click event assign
		/*
		$(this.tab_toolbox.get("labelEl")).find(".close").click(function() {
			self.detach_toolbox();
			
			return false;
		});
		*/

		//For Test Codes
		/*
		$("#toolbox").append("<div id='toolLine' style='cursor:pointer; width:100%; height:20px; border-bottom:1px solid #ccc;'>Line Tool</div>");
		$("#toolbox").append("<div id='toolSquare' style='cursor:pointer; width:100%; height:20px; border-bottom:1px solid #ccc;'>Square Tool</div>");
		
		$("#toolLine").click(function () {
			self.window_manager.window[self.window_manager.active_window].designer.canvas.add("line");
			self.window_manager.window[self.window_manager.active_window].designer.canvas.set_drawing_mode("line");
		});
		$("#toolSquare").click(function () {
			self.window_manager.window[self.window_manager.active_window].designer.canvas.add("square");	
			self.window_manager.window[self.window_manager.active_window].designer.canvas.set_drawing_mode("square");		
		});
		*/		
	},
	
	detach_toolbox: function() {
		this.left_tabview.removeTab(this.tab_toolbox);
		
		delete this;
	},
	
	show_project_explorer: function() {
	},
	
	hide_project_explorer: function() {
	},
	
	attach_object_explorer: function(target) {
		//attaching tab element
		target.addTab(new YAHOO.widget.Tab({ label: "Object", content: "<div id='object_explorer'><div id='object_tree'></div></div>" }));
	},
	
	detach_object_explorer: function() {
	},
	
	show_object_explorer: function() {
	},
	
	hide_object_explorer: function() {
	},
	
	attach_properties: function(target) {
		//attaching tab element
		target.addTab(new YAHOO.widget.Tab({ label: "Properties", content: "<div id='properties'></div>" }));
		
		var properties = new org.goorm.core.object.properties();
		
		this.table_properties = properties.init("properties");
	},
	
	detach_properties: function() {
	},
	
	show_properties: function() {
	},
	
	hide_properties: function() {
	},
	
	attach_message: function(target) {
		//attaching tab element
		target.addTab(new YAHOO.widget.Tab({ label: "Message", content: "<div id='message'></div>" }));
	},
	
	detach_message: function() {
	},
	
	show_message: function() {
	},
	
	hide_message: function() {
	},
	
	attach_toolbar: function(target) {
		/*
		this.toolbar = new org.goorm.core.toolbar();
		this.toolbar.add("../../configs/toolbars/org.goorm.core.file/file.toolbar.html", "file.toolbar", target);
		this.toolbar.add("../../configs/toolbars/org.goorm.core.edit/edit.toolbar.html", "edit.toolbar", target);
		this.toolbar.add("../../configs/toolbars/org.goorm.core.window/window.toolbar.html", "window.toolbar", target);
		this.toolbar.add("../../configs/toolbars/org.goorm.core.design/design.toolbar.html", "design.toolbar", target);
		*/
		
		var context_menu = new org.goorm.core.menu.context();
		context_menu.init("configs/menu/org.goorm.core.toolbar/toolbar.html", "menu.context.toolbar", target);
		
		$(core).trigger("context_menu_complete");
	},
	
	detach_toolbar: function() {
	},
	
	show_toolbar: function() {
	},
	
	hideToolbar: function() {
	},
	
	attach_debug: function(target) {
		//attaching tab element
		target.addTab(new YAHOO.widget.Tab({ label: "Debug", content: "<div id='debug'></div>" }));
	},
	
	detach_debug: function() {
	},
	
	show_debug: function() {
	},
	
	hide_debug: function() {
	},
	
	attach_chat: function(target) {
		//attaching tab element
		target.addTab(new YAHOO.widget.Tab({ label: "Chat", content: "<div id='chat' class='layout_right_chat_tab'></div>" }));

/*
		$("#chat").append("<div class='chat_user_container' style='height:100px; border-bottom:1px #CCC solid; padding:5px;'></div>");		
		$("#chat").append("<div class='chat_message_container' style='height:200px; border-bottom:1px #CCC solid; padding:5px;'></div>");
		$("#chat").append("<div class='chat_message_input_container' style='height:50px; border-bottom:1px #CCC solid; padding:5px; background-color:#EFEFEF; text-align:center;'><input value='Chatting Message' style='width:90%;' /></div>");
*/
		//$("#chat").append("<iframe src='http://localhost:8001/?room=11' width=99% height=300>");
		this.chat = new org.goorm.core.collaboration.chat();
		
	},
	
	detach_chat: function() {
	},
	
	show_chat: function(project_id) {
		$(".layout_right_chat_tab").parent("div").attr("id",project_id);
		this.chat.init(project_id);
	},
	
	hide_chat: function() {
	},
	
	attach_console: function(target) {
		//attaching tab element
		$(core).bind("preference_loading_complete", function () {
			
			target.addTab(new YAHOO.widget.Tab({ label: "Console", content: "<div id='console' width='100%'><iframe id='iframe_console' src='lib/com.googlecode.xwiterm/?serverID="+core.dialog.preference.ini['goorm.server_id']+"&serverPassword="+core.dialog.preference.ini['goorm.server_password']+"&default_path="+core.dialog.preference.ini['goorm.path']+"/project/' style='border:none;width:100%;height:100%-1px;'></div>" }));
		});

	},
	
	attach_search: function(target) {
		//attaching tab element
		target.addTab(new YAHOO.widget.Tab({ label: "Search", content: "<div id='search' width='100%'></div>" }));
	},
	
	refresh_console: function() {
/*
		this.inner_bottom_tabview.removeTab(this.inner_bottom_tabview.getTab(2));
		//attaching tab element
*/
	},
	
	detach_console: function() {
	},
	
	show_console: function() {
	},
	
	hide_console: function() {
	},
	
	show_workspace: function() {
	},
	
	hide_workspace: function() {
	},
	
	show_window_manager: function() {
	},
	
	hide_window_manager: function() {
	},
	
	resize_all: function() {
		var layout_left_height = $(".yui-layout-unit-left").find(".yui-layout-wrap").height() - 26;		
		$("#goorm_left").find(".yui-content").height(layout_left_height);
		$("#goorm_left").find("#project_explorer").height(layout_left_height-6);
		$("#goorm_left").find("#project_treeview").height(layout_left_height-35);
		
		var project_selector_width = $(".yui-layout-unit-left").find(".yui-layout-wrap").find("#project_selector").width();
		$("#goorm_left").find("#project_select_box").width(project_selector_width-19);
		$("#goorm_left").find("#project_select_box").next().width(project_selector_width-10);
		$("#goorm_left").find("#project_select_box").find("button").width(project_selector_width-18);
		
		
		var layout_right_height = $(".yui-layout-unit-right").find(".yui-layout-wrap").height() - 29;
		$("#goorm_inner_layout_right").find(".yui-content").height(layout_right_height);
		$("#goorm_inner_layout_right").find(".chat_message_container").height(layout_right_height - 182);
		
		var layout_bottom_height = $(".yui-layout-unit-bottom").find(".yui-layout-wrap").height() - 26;
		$("#goorm_inner_layout_bottom").find(".yui-content").height(layout_bottom_height);
		$("#iframe_console").height(layout_bottom_height-6);
		
		var layout_center_height = $(".yui-layout-unit-center").find(".yui-layout-unit-center").find(".yui-layout-wrap").height() - 2;
		$("#goorm_inner_layout_center").find("#workspace").height(layout_center_height);
		
		if (core.module.layout.workspace.window_manager.is_maxmizedd) {
			$(document).trigger("maximize_resize");
		}

		$(".dummyspace").css("z-index", 0);

		/*
		var divChatContentsHeight = $(".yui-layout-unit-bottom").find(".yui-layout-wrap").height() - 90;
		$("#goorm_inner_layout_bottom").find("#divChatContents").height(divChatContentsHeight);
		
			
		var divPropertiesValueColumnWidth = $("#divProperties").width() - 113;
		
		$("#divProperties").find("table").find("div").each(function(i) {
			if(i == 1) {
				if($(this).hasClass("yui-dt-liner")) {
					$(this).width(divPropertiesValueColumnWidth);
				}
			}
		});
		*/
			
		//$("#properties").find("table").width($("#properties").width());
		/*
		$("#properties").find("table").find("th").each(function(i) {
			if($(this).parent().hasClass("yui-dt-first")) {
				$(this).width("20%");
			}
			else {
				$(this).width("80%");
			}
		});
		*/
	}
};
