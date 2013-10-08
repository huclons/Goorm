/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jshint newcap:false, debug:true, unused: true, evil: true, devel: true, plusplus: false, browser: true, jquery: true, undef:false */
/*clientside jslint comment for global */
/*global org: false, core: false, io: false, YAHOO: false, CodeMirror: false, localStorage: false */
/*jshint unused: false */



org.goorm.core.layout = {
	layout: null,
	inner_layout: null,
	left_tabview: null,
	inner_right_tabview: null,
	inner_bottom_tabview: null,
	inner_center_tabview: null,
	table_properties: null,
	treeview_project: null,
	mainmenu: null,
	toolbar: null,
	workspace: null,
	startpage: null,
	window_manager: null,
	communication: null,
	history: null,
	console: null,
	tab_project: null,
	tab_toolbox: null,
	project_explorer: null,
	tab_cloud: null,
	cloud_explorer: null,
	object_explorer: null,

	init: function (container) {

		var self = this;

		var left_width = 250;
		var right_width = 350;
		var bottom_height = 200;

		if (parseInt(localStorage.layout_left_width, 10) > 0) {
			left_width = parseInt(localStorage.layout_left_width, 10);
		}

		if (parseInt(localStorage.layout_right_width, 10) > 0) {
			right_width = parseInt(localStorage.layout_right_width, 10);
		}

		if (parseInt(localStorage.layout_bottom_height, 10) > 0) {
			bottom_height = parseInt(localStorage.layout_bottom_height, 10);
		}

		//Set layout
		this.layout = new YAHOO.widget.Layout({
			units: [{
				position: 'top',
				height: 62,
				maxHeight: 150,
				body: container + '_top',
				scroll: null,
				zIndex: 2,
				gutter: '0px 0px 0px 0px'
			}, {
				position: 'left',
				width: left_width,
				body: container + '_left',
				animate: false,
				scroll: false,
				zIndex: 1,
				resize: true,
				gutter: '0px 0px 0px 0px',
				collapse: true,
				minWidth: 200
			}, {
				position: 'center',
				body: container + '_center_inner_layout',
				scroll: false
			}, {
				position: 'bottom',
				height: 30,
				body: container + '_bottom',
				scroll: false,
				gutter: '0px 0px 0px 0px'
			}]
		});

		this.layout.on('render', function () {
			self.attach_toolbar(container + "_main_toolbar");

			//Set nested inner layout
			var el = self.layout.getUnitByPosition('center').get('wrap');

			self.inner_layout = new YAHOO.widget.Layout(el, {
				parent: self.layout,
				units: [{
					position: 'right',
					width: right_width,
					resize: true,
					scroll: false,
					body: container + '_inner_layout_right',
					animate: false,
					gutter: '0px 0px 0px 0px',
					collapse: true,
					minWidth: 300
				}, {
					position: 'bottom',
					height: bottom_height,
					body: container + '_inner_layout_bottom',
					animate: false,
					scroll: false,
					resize: true,
					gutter: '0px 0px 0px 0px',
					collapse: true
				}, {
					position: 'center',
					body: container + '_inner_layout_center',
					scroll: false
				}]
			});

			self.inner_layout.on('render', function () {
				self.layout.getUnitByPosition("left").on("endResize", function () {
					localStorage.layout_left_width = core.module.layout.layout._units.left._configs.width.value;
				});

				self.layout.getUnitByPosition("left").on("beforeCollapse", function () {
					localStorage.layout_left_width = core.module.layout.layout._units.left._configs.width.value;
				});

				self.layout.getUnitByPosition("left").on("collapse", function () {
					localStorage.layout_left_collapse = true;
				});

				self.layout.getUnitByPosition("left").on("expand", function () {
					localStorage.layout_left_collapse = false;
					//core.module.layout.layout._units.left._configs.width.value = localStorage.layout_left_width;
				});

				self.inner_layout.getUnitByPosition("right").on("endResize", function () {
					localStorage.layout_right_width = core.module.layout.inner_layout._units.right._configs.width.value;
				});

				self.inner_layout.getUnitByPosition("right").on("beforeCollapse", function () {
					localStorage.layout_right_width = core.module.layout.inner_layout._units.right._configs.width.value;
				});

				self.inner_layout.getUnitByPosition("right").on("collapse", function () {
					localStorage.layout_right_collapse = true;
				});

				self.inner_layout.getUnitByPosition("right").on("expand", function () {
					localStorage.layout_right_collapse = false;
				});

				self.inner_layout.getUnitByPosition("bottom").on("endResize", function () {
					localStorage.layout_bottom_height = core.module.layout.inner_layout._units.bottom._configs.height.value;

					// terminal resize
					core.module.layout.terminal.resize_terminal();
				});

				self.inner_layout.getUnitByPosition("bottom").on("beforeCollapse", function () {
					localStorage.layout_bottom_height = core.module.layout.inner_layout._units.bottom._configs.height.value;
				});

				self.inner_layout.getUnitByPosition("bottom").on("collapse", function () {
					localStorage.layout_bottom_collapse = true;
				});

				self.inner_layout.getUnitByPosition("bottom").on("expand", function () {
					localStorage.layout_bottom_collapse = false;
					//core.module.layout.inner_layout._units.bottom._configs.height.value = localStorage.layout_bottom_height;

					// resize terminal
					$(core.module.layout.terminal).trigger('default_terminal_open_complete');
				});

				self.inner_layout.getUnitByPosition('center').on("resize", self.resize_all);

				//Set main menu
				self.attach_mainmenu(container + "_mainmenu");

				$(core).trigger("layout_loaded");
			});

			self.inner_layout.on("start_resize", function () {
				$(".dummyspace").css("z-index", 999);
			});

			self.inner_layout.render();

			if (localStorage.layout_left_collapse == "true") {
				self.layout.getUnitByPosition("left").collapse();
			}

			if (localStorage.layout_right_collapse == "true") {
				self.inner_layout.getUnitByPosition("right").collapse();
			}

			if (localStorage.layout_bottom_collapse == "true") {
				self.inner_layout.getUnitByPosition("bottom").collapse();
			}
		});

		// Left
		
		//Left TabView
		this.left_tabview = new YAHOO.widget.TabView(container + '_left');

		//Project Explorer Tab
		this.attach_project_explorer(this.left_tabview);

		//Tool Box
		//		this.attach_toolbox(this.left_tabview);

		

		// Right
		
		//Right TabView
		this.inner_right_tabview = new YAHOO.widget.TabView(container + '_inner_layout_right');
		this.inner_right_tabview.addListener("activeTabChange", function () {
			if ($('#' + container + '_inner_layout_right .selected span').attr('localization_key') == 'communication') {
				$('#' + container + '_inner_layout_right').find('[localization_key="communication"]').removeClass("glowing");
			}
		});

		

		//Object Explorer Tab
		this.attach_object_explorer(this.inner_right_tabview);

		

				// Bottom
		
		//Bottom TabView
		this.inner_bottom_tabview = new YAHOO.widget.TabView(container + '_inner_layout_bottom');
		this.inner_bottom_tabview.addListener("activeTabChange", function () {
			self.refresh();
		});

		//Debug Tab
		this.attach_debug(this.inner_bottom_tabview);

		//Terminal Tab
		this.attach_terminal(this.inner_bottom_tabview);
		//Outputtab
		//Search Tab
		this.attach_search(this.inner_bottom_tabview);

		

		// Center
		
		this.workspace = org.goorm.core.layout.workspace;
		this.workspace.init(container + '_inner_layout_center');

		// Final
		
		this.layout.render();

		self.refresh();

		$(window).resize(function () {
			self.refresh();
		});
	},

	attach_mainmenu: function (container) {
		this.mainmenu = new YAHOO.widget.MenuBar(container, {
			autosubmenudisplay: true,
			hidedelay: 500,
			lazyload: true,
			effect: {
				effect: YAHOO.widget.ContainerEffect.FADE,
				duration: 0.15
			}
		});

		this.mainmenu.render();

		// prevent click event
		$('.yuimenubaritemlabel').click(function () {
			return false;
		});
	},

	attach_project_explorer: function (target) {
		this.tab_project = new YAHOO.widget.Tab({
			label: "<span id='gLayoutTab_Project' localization_key='project'>Project</span>",
			content: "<div id='project_explorer' class='directory_treeview'></div>"
		});

		//attaching tab element
		target.addTab(this.tab_project);

		this.project_explorer = new org.goorm.core.project.explorer();
		this.project_explorer.init();
	},

	detach_project_explorer: function () {
		this.left_tabview.removeTab(this.tab_project);

		delete this;
	},

	attach_toolbox: function (target) {
		this.tab_toolbox = new YAHOO.widget.Tab({
			label: "<span id='gLayoutTab_ToolBox' localization_key='toolbox'>Tool Box</span>",
			content: "<div id='toolbox'></div>"
		});

		//attaching tab element
		target.addTab(this.tab_toolbox);
	},

	detach_toolbox: function () {
		this.left_tabview.removeTab(this.tab_toolbox);

		delete this;
	},

	

	attach_object_explorer: function (target) {
		var self = this;
		//attaching tab element
		target.addTab(
			new YAHOO.widget.Tab({
				label: "<span id='gLayoutTab_Outline' localization_key='outline'>Outline</span>",
				content: "<div id='object_explorer'><div id='current_object_explorer'></div><div id='object_tree'></div></div>"
			})
		);
		$("#current_object_explorer").css("text-align", "left").css("font-size", "11px");
		self.object_explorer = new org.goorm.core.object.explorer();
		self.object_explorer.init('object_tree');
	},

	

	attach_properties: function () {

	},

	attach_message: function () {

	},

	attach_toolbar: function (target) {
		$(core).trigger("context_menu_complete");
	},

	attach_debug: function (target) {
		//attaching tab element
		target.addTab(new YAHOO.widget.Tab({
			label: "<span id='gLayoutTab_Debug' localization_key='debug' class='layout_bottom_item_debug'>Debug</span>",
			content: "<div id='debug_tab'></div>"
		}));

		this.debug = new org.goorm.core.debug();
		this.debug.init();
		core.module.debug = this.debug;
	},

	

	attach_terminal: function (target) {
		var self = this;

		target.addTab(new YAHOO.widget.Tab({
			label: "<span id='gLayoutTab_Terminal' localization_key='terminal'>Terminal</span>",
			content: "<div id='terminal' width='100%'></div>"
		}));

		this.terminal = new org.goorm.core.terminal();

		$(core).one("goorm_login_complete", function () {
			self.terminal.init($("#goorm_inner_layout_bottom #terminal"), "default_terminal", false);
		});
	},

	attach_search: function (target) {
		//attaching tab element
		target.addTab(new YAHOO.widget.Tab({
			label: "<span id='gLayoutTab_Search' localization_key='search'>Search</span>",
			content: "<div id='search_treeview' width='100%'></div>"
		}));
	},

	refresh_terminal: function () {

	},

	resize_all: function () {

		if (core.module.layout.workspace.window_manager.tab[0] !== undefined)
			core.module.layout.workspace.window_manager.tab[0].resize();
		var goorm_left = $("#goorm_left");

		var layout_left_height = $("div.yui-layout-unit-left").find("div.yui-layout-wrap").height() - 22;
		goorm_left.find("div.yui-content").height(layout_left_height);
		goorm_left.find("#project_explorer").height(layout_left_height - 6);
		goorm_left.find("#project_treeview").height(layout_left_height - 35);

		goorm_left.find("#cloud_explorer").height(layout_left_height - 6);
		goorm_left.find("#cloud_treeview").height(layout_left_height - 35);

		var cloud_treeview_child = goorm_left.find("#cloud_treeview").children();
		for (var i = 0; i < cloud_treeview_child.length; i++) {
			$(cloud_treeview_child[i]).width(goorm_left.find("#cloud_treeview").width());
			$(cloud_treeview_child[i]).height(layout_left_height - 35);
		}

		var project_selector_width = $("div.yui-layout-unit-left div.yui-layout-wrap #project_selector").width();

		if (project_selector_width < 190) project_selector_width = 190;

		var project_selectbox = goorm_left.find("#project_selectbox");
		project_selectbox.css('width', (project_selector_width - 19 - 20)); // for margin & refresh tool
		project_selectbox.next().css('width', project_selector_width - 10);

		var project_selectbox = goorm_left.find("#toolbox_selectbox");
		project_selectbox.css('width', project_selector_width - 19);
		project_selectbox.next().css('width', project_selector_width - 10);

		var cloud_selectbox = goorm_left.find("#cloud_selectbox");
		cloud_selectbox.css('width', '60%');
		cloud_selectbox.next().css('width', '10%');
		cloud_selectbox.next().next().css('width', '10%');

		var layout_right_height = $("div.yui-layout-unit-right div.yui-layout-wrap").height();
		var goorm_inner_layout_right = $("#goorm_inner_layout_right");
		goorm_inner_layout_right.find("div.yui-content").height(layout_right_height);
		goorm_inner_layout_right.find("#iframe_slideshare").height(layout_right_height - 70);

		var layout_bottom_height = $("div.yui-layout-unit-bottom").find("div.yui-layout-wrap").height() - 26;
		$("#goorm_inner_layout_bottom").find("div.yui-content").height(layout_bottom_height);

		var layout_center_height = $("#workspace").parent().parent().height();
		$("#goorm_inner_layout_center").find("#workspace").height(layout_center_height);

		$(".dummyspace").css("z-index", 0);

		$(core).trigger("layout_resized");
	},

	refresh: function () {
		var self = this;

		self.resize_all();
		self.layout.getUnitByPosition("top").set("height", $("#goorm_mainmenu").height() + $("#goorm_main_toolbar").height() + 7);

		$(core).trigger("layout_resized");
	}
};
