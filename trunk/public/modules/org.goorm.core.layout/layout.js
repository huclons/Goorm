/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module layout
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class layout
 **/
org.goorm.core.layout = function () {
	/**
	 * The layout object
	 * @property layout
	 * @type Object
	 * @default null
	 **/
	this.layout = null;
	
	/**
	 * This presents the current browser version
	 * @property innerLayout
	 * @type Object
	 * @default null
	 **/
	this.innerLayout = null;

	/**
	 * This presents the current browser version
	 * @property leftTabView
	 * @type Object
	 * @default null
	 **/
	this.leftTabView = null;
	
	/**
	 * This presents the current browser version
	 * @property innerRightTabView
	 * @type Object
	 * @default null
	 **/
	this.innerRightTabView = null;
	
	/**
	 * This presents the current browser version
	 * @property innerBottomTabView
	 * @type Object
	 * @default null
	 **/
	this.innerBottomTabView = null;
	
	/**
	 * This presents the current browser version
	 * @property innerCenterTabView
	 * @type Object
	 * @default null
	 **/
	this.innerCenterTabView = null;
	
	/**
	 * This presents the current browser version
	 * @property tableProperties
	 * @type Object
	 * @default null
	 **/
	this.tableProperties = null;
	
	/**
	 * This presents the current browser version
	 * @property treeviewProject
	 * @type Object
	 * @default null
	 **/
	this.treeviewProject = null;
	
	/**
	 * This presents the current browser version
	 * @property mainMenu
	 * @type Object
	 * @default null
	 **/
	this.mainMenu = null;
	
	/**
	 * This presents the current browser version
	 * @property toolbar
	 * @type Object
	 * @default null
	 **/
	this.toolbar = null;
	
	/**
	 * This presents the current browser version
	 * @property workspace
	 * @type Object
	 * @default null
	 **/
	this.workSpace = null;
	
	/**
	 * This presents the current browser version
	 * @property startpage
	 * @type Object
	 * @default null
	 **/
	this.startpage = null;
	
	/**
	 * This presents the current browser version
	 * @property windowManager
	 * @type Object
	 * @default null
	 **/
	this.windowManager = null;

	/**
	 * This presents the current browser version
	 * @property chat
	 * @type Object
	 * @default null
	 **/
	this.chat = null;
	
	this.tabProject = null;
	this.tabToolbox = null;
};

org.goorm.core.layout.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor
	 * @param {Object} container The container object. 
	 **/
	init: function(container) {
		
		var self = this;
		
		//Set layout
		this.layout = new YAHOO.widget.Layout({
			units:
			[
				{ position: 'top', height: 59,maxHeight:150, body: container+'Top', scroll: null, zIndex: 2, gutter: '0px 0px 3px 0px' },
				{ position: 'left', width: 250, body: container+'Left', animate: false, proxy:false, scroll: false, zIndex: 1, resize: true, gutter: '0px 3px 0px 0px', collapse: true, minWidth: 200 },
				{ position: 'center', body: container+'CenterInnerLayout', scroll: false },
				{ position: 'bottom', height:30, body: container+'Bottom', scroll: false, gutter: '0px 0px 0px 0px' }
			]
		});

				

		this.layout.on('render', function() {
			
			console.log(container);
			
			//Set main menu
			self.attachMainMenu(container + "MainMenu"); 
			
			self.attachToolbar(container + "MainToolbar"); 
			
						
			//Set nested inner layout
			var el = self.layout.getUnitByPosition('center').get('wrap');
			self.innerLayout = new YAHOO.widget.Layout(el, {
				parent: self.layout,
				units:
				[
					{ position: 'right', width: 350, resize: true, scroll: false, body: container+'InnerLayoutRight', animate: false, proxy:false, gutter: '0px 0px 0px 3px', collapse: !ENV_COLLAPSE_RIGHT },
					{ position: 'bottom', height: 200, body: container+'InnerLayoutBottom', animate: false, proxy:false, scroll: false, resize: true, gutter: '3px 0px 0px 0px', collapse: !ENV_COLLAPSE_BOTTOM },
					{ position: 'center', body: container+'InnerLayoutCenter', scroll: false }
				]
			});
			
			self.innerLayout.render();

			
			if (ENV_COLLAPSE_BOTTOM) {
				self.innerLayout.getUnitByPosition("bottom").collapse();
			}
			
			if (ENV_COLLAPSE_RIGHT) {
				self.innerLayout.getUnitByPosition("right").collapse();
			}			
		});
		
		//////////////////////////////////////////////////////////////////////////////////////////
		// Left
		//////////////////////////////////////////////////////////////////////////////////////////
		
		//Left TabView
		this.leftTabView = new YAHOO.widget.TabView(container+'Left');
		
		//Project Explorer Tab
		this.attachProjectExplorer(this.leftTabView);
		
		this.attachToolBox(this.leftTabView);
		
		//Select first tab
		this.leftTabView.selectTab(0);
		
		//////////////////////////////////////////////////////////////////////////////////////////
		// Right
		//////////////////////////////////////////////////////////////////////////////////////////
				
		//Right TabView
		this.innerRightTabView = new YAHOO.widget.TabView(container+'InnerLayoutRight');
		
		//Properties Tab
		this.attachProperties(this.innerRightTabView);
		
		//Object Explorer Tab
		this.attachObjectExplorer(this.innerRightTabView);
		
		//Chat Tab
		this.attachChat(this.innerRightTabView);
		
		//Select first tab
		this.innerRightTabView.selectTab(0);		
		
		//////////////////////////////////////////////////////////////////////////////////////////
		// Bottom
		//////////////////////////////////////////////////////////////////////////////////////////
				
		//Bottom TabView
		this.innerBottomTabView = new YAHOO.widget.TabView(container+'InnerLayoutBottom');
		
		//Message Tab
		this.attachMessage(this.innerBottomTabView);
		
		//Debug Tab
		this.attachDebug(this.innerBottomTabView);
		
		//Console Tab
		this.attachConsole(this.innerBottomTabView);
		
		//Search Tab
		this.attachSearch(this.innerBottomTabView);
		
		//Select first tab
		this.innerBottomTabView.selectTab(0);		
		
		//////////////////////////////////////////////////////////////////////////////////////////
		// Center
		//////////////////////////////////////////////////////////////////////////////////////////
		
		this.workSpace = new org.goorm.core.layout.workspace();
		this.workSpace.init(container+'InnerLayoutCenter');
		
		//this.startpage = new org.goorm.core.layout.startpage();
		//this.startpage.init(container+'InnerLayoutCenter');
		
		//////////////////////////////////////////////////////////////////////////////////////////
		// Final
		//////////////////////////////////////////////////////////////////////////////////////////
		
		this.layout.render();		
		
		$(window).resize(function(){
			self.resizeAll();
			self.layout.getUnitByPosition("top").set("height",$("#goormMainMenu").height()+$("#goormMainToolbar").height()+7);
		});

		this.innerLayout.on("startResize", function() {
			$(".dummyspace").css("z-index", 999);
		});

		this.innerLayout.getUnitByPosition('center').on("resize", this.resizeAll);
		
		
		this.resizeAll();
		//$(window).resize();
		//this.layout.getUnitByPosition("top").set("height",$("#goormMainMenu").height()+$("#goormMainToolbar").height()+5);
		
		//$(core).trigger("layoutLoaded");
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method attachMainMenu
	 * @param {Object} container The container object.
	 **/
	attachMainMenu: function(container) {
		this.mainMenu = new YAHOO.widget.MenuBar(container, { 
			autosubmenudisplay: false, 
			hidedelay: 750, 
			lazyload: true ,
			effect: {  
				effect: YAHOO.widget.ContainerEffect.FADE, 
				duration: 0.15 
			}
		});

		this.mainMenu.render();
	
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method detachMainMenu
	 **/
	detachMainMenu: function() {
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method showMainMenu 
	 **/
	showMainMenu: function() {
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method hideMainMenu 
	 **/
	hideMainMenu: function() {
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method attachProjectExplorer 
	 * @param {Object} target The target object to be attached
	 **/	
	attachProjectExplorer: function(target) {
		var self = this;
		
		//this.tabProject = new YAHOO.widget.Tab({ label: "Project" +"&nbsp;"+ " <img src='images/icons/context/closebutton.png' class='close button' />", content: "<div id='projectExplorer' class='directoryTreeview'></div>" });
		this.tabProject = new YAHOO.widget.Tab({ label: "Project", content: "<div id='projectExplorer' class='directoryTreeview'></div>" });

		//attaching tab element
		target.addTab(this.tabProject);
		
		//close button click event assign
		/*
		$(this.tabProject.get("labelEl")).find(".close").click(function() {
			self.detachProjectExplorer();
			
			return false;
		});
		*/
		
		this.projectExplorer = new org.goorm.core.project.explorer();
		this.projectExplorer.init();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method detachProjectExplorer 
	 **/	
	detachProjectExplorer: function() {
		 this.leftTabView.removeTab(this.tabProject);

		 delete this;
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method attachToolBox 
	 * @param {Object} target The target object
	 **/
	attachToolBox: function(target) {
		var self = this;
		
		//this.tabToolbox = new YAHOO.widget.Tab({ label: "Tool Box" +"&nbsp;"+ " <img src='images/icons/context/closebutton.png' class='close button' />", content: "<div id='toolBox'></div>" });
		this.tabToolbox = new YAHOO.widget.Tab({ label: "Tool Box", content: "<div id='toolBox'></div>" });

		//attaching tab element
		target.addTab(this.tabToolbox);		
		
		//close button click event assign
		/*
		$(this.tabToolbox.get("labelEl")).find(".close").click(function() {
			self.detachToolBox();
			
			return false;
		});
		*/

		//For Test Codes
		/*
		$("#toolBox").append("<div id='toolLine' style='cursor:pointer; width:100%; height:20px; border-bottom:1px solid #ccc;'>Line Tool</div>");
		$("#toolBox").append("<div id='toolSquare' style='cursor:pointer; width:100%; height:20px; border-bottom:1px solid #ccc;'>Square Tool</div>");
		
		$("#toolLine").click(function () {
			self.windowManager.window[self.windowManager.activeWindow].designer.canvas.add("line");
			self.windowManager.window[self.windowManager.activeWindow].designer.canvas.setDrawingMode("line");
		});
		$("#toolSquare").click(function () {
			self.windowManager.window[self.windowManager.activeWindow].designer.canvas.add("square");	
			self.windowManager.window[self.windowManager.activeWindow].designer.canvas.setDrawingMode("square");		
		});
		*/		
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method detachToolBox 
	 **/	
	detachToolBox: function() {
		 this.leftTabView.removeTab(this.tabToolbox);
		
		delete this;
	},
	
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method showProjectExplorer 
	 **/
	showProjectExplorer: function() {
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method hideProjectExplorer
	 **/
	hideProjectExplorer: function() {
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method attachObjectExplorer 
	 * @param {Object} target The target object to be attached
	 **/	
	attachObjectExplorer: function(target) {
		//attaching tab element
		target.addTab(new YAHOO.widget.Tab({ label: "Object", content: "<div id='objectExplorer'><div id='objectTree'></div></div>" }));
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method detachObjectExplorer 
	 **/		
	detachObjectExplorer: function() {
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method showObjectExplorer 
	 **/
	showObjectExplorer: function() {
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method hideObjectExplorer 
	 **/
	hideObjectExplorer: function() {
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method attachProperties 
	 * @param {Object} target The target object
	 **/	
	attachProperties: function(target) {
		//attaching tab element
		target.addTab(new YAHOO.widget.Tab({ label: "Properties", content: "<div id='properties'></div>" }));
		
		var properties = new org.goorm.core.object.properties();
		
		this.tableProperties = properties.init("properties");
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method detachProperties 
	 **/		
	detachProperties: function() {
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method showProperties 
	 **/
	showProperties: function() {
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method hideProperties 
	 **/
	hideProperties: function() {
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method attachMessage 
	 * @param {Object} target The target object.
	 **/
	attachMessage: function(target) {
		//attaching tab element
		target.addTab(new YAHOO.widget.Tab({ label: "Message", content: "<div id='message'></div>" }));
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method detachMessage 
	 **/	
	detachMessage: function() {
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method showMessage 
	 **/
	showMessage: function() {
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method hideMessage 
	 **/
	hideMessage: function() {
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method attachToolbar 
	 * @param {Object} target The target object.
	 **/
	attachToolbar: function(target) {
		/*
		this.toolbar = new org.goorm.core.toolbar();
		this.toolbar.add("../../configs/toolbars/org.goorm.core.file/file.toolbar.html", "file.toolbar", target);
		this.toolbar.add("../../configs/toolbars/org.goorm.core.edit/edit.toolbar.html", "edit.toolbar", target);
		this.toolbar.add("../../configs/toolbars/org.goorm.core.window/window.toolbar.html", "window.toolbar", target);
		this.toolbar.add("../../configs/toolbars/org.goorm.core.design/design.toolbar.html", "design.toolbar", target);
		*/
		
		var contextMenu = new org.goorm.core.menu.context();
		contextMenu.init("configs/menu/org.goorm.core.toolbar/toolbar.html", "menu.context.toolbar", target);
		
		$(core).trigger("contextMenuCompleate");
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method detachToolbar 
	 **/		
	detachToolbar: function() {
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method showToolbar 
	 **/
	showToolbar: function() {
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method hideToolbar 
	 **/
	hideToolbar: function() {
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method attachDebu 
	 * @param {Obejct} target The target object.
	 **/	
	attachDebug: function(target) {
		//attaching tab element
		target.addTab(new YAHOO.widget.Tab({ label: "Debug", content: "<div id='debug'></div>" }));
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method detachDebug 
	 **/		
	detachDebug: function() {
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method showDebug 
	 **/	
	showDebug: function() {
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method hideDebug
	 **/
	hideDebug: function() {
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method attachChat
	 * @param {Object} target The target object. 
	 **/	
	attachChat: function(target) {
		//attaching tab element
		target.addTab(new YAHOO.widget.Tab({ label: "Chat", content: "<div id='chat' class='layoutRightChatTab'></div>" }));

/*
		$("#chat").append("<div class='chatUserContainer' style='height:100px; border-bottom:1px #CCC solid; padding:5px;'></div>");		
		$("#chat").append("<div class='chatMessageContainer' style='height:200px; border-bottom:1px #CCC solid; padding:5px;'></div>");
		$("#chat").append("<div class='chatMessageInputContainer' style='height:50px; border-bottom:1px #CCC solid; padding:5px; background-color:#EFEFEF; text-align:center;'><input value='Chatting Message' style='width:90%;' /></div>");
*/
		//$("#chat").append("<iframe src='http://localhost:8001/?room=11' width=99% height=300>");
		this.chat = new org.goorm.core.collaboration.chat();
		
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method detachChat 
	 **/	
	detachChat: function() {
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method showChat 
	 **/
	showChat: function(project_id) {
		$(".layoutRightChatTab").parent("div").attr("id",project_id);
		this.chat.init(project_id);
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method hideChat 
	 **/
	hideChat: function() {
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method attachConsole 
	 * @param {Object} target The target object.
	 **/	
	attachConsole: function(target) {
		//attaching tab element
		$(core).bind("preferenceLoadingComplete", function () {
			
			target.addTab(new YAHOO.widget.Tab({ label: "Console", content: "<div id='console' width='100%'><iframe id='iframeConsole' src='lib/com.googlecode.xwiterm/?serverID="+core.dialogPreference.ini['goorm.serverID']+"&serverPassword="+core.dialogPreference.ini['goorm.serverPassword']+"&default_path="+core.dialogPreference.ini['goorm.path']+"/project/' style='border:none;width:100%;height:100%-1px;'></div>" }));
		});

	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method attachSearch 
	 * @param {Object} target The target object.
	 **/	
	attachSearch: function(target) {
		//attaching tab element
		target.addTab(new YAHOO.widget.Tab({ label: "Search", content: "<div id='search' width='100%'></div>" }));
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method attachConsole 
	 * @param {Object} target The target object.
	 **/	
	refreshConsole: function() {
/*
		this.innerBottomTabView.removeTab(this.innerBottomTabView.getTab(2));
		//attaching tab element
*/
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method detachConsole 
	 **/		
	detachConsole: function() {
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method showConsole 
	 **/
	showConsole: function() {
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method hideConsole 
	 **/
	hideConsole: function() {
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method showWorkspace 
	 **/
	showWorkspace: function() {
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method hideWorkspace 
	 **/
	hideWorkspace: function() {
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method showWindowManager 
	 **/
	showWindowManager: function() {
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method hideWindowManager 
	 **/
	hideWindowManager: function() {
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method resizeAll 
	 **/
	resizeAll: function() {
		var layoutLeftHeight = $(".yui-layout-unit-left").find(".yui-layout-wrap").height() - 26;		
		$("#goormLeft").find(".yui-content").height(layoutLeftHeight);
		$("#goormLeft").find("#projectExplorer").height(layoutLeftHeight-6);
		$("#goormLeft").find("#projectTreeview").height(layoutLeftHeight-35);
		
		var projectSelectorWidth = $(".yui-layout-unit-left").find(".yui-layout-wrap").find("#projectSelector").width();
		$("#goormLeft").find("#projectSelectBox").width(projectSelectorWidth-19);
		$("#goormLeft").find("#projectSelectBox").next().width(projectSelectorWidth-10);
		$("#goormLeft").find("#projectSelectBox").find("button").width(projectSelectorWidth-18);
		
		var layoutRightHeight = $(".yui-layout-unit-right").find(".yui-layout-wrap").height() - 29;
		$("#goormInnerLayoutRight").find(".yui-content").height(layoutRightHeight);
		$("#goormInnerLayoutRight").find(".chatMessageContainer").height(layoutRightHeight - 182);
		
		var layoutBottomHeight = $(".yui-layout-unit-bottom").find(".yui-layout-wrap").height() - 26;
		$("#goormInnerLayoutBottom").find(".yui-content").height(layoutBottomHeight);
		$("#iframeConsole").height(layoutBottomHeight-6);
		
		var layoutCenterHeight = $(".yui-layout-unit-center").find(".yui-layout-unit-center").find(".yui-layout-wrap").height() - 2;
		$("#goormInnerLayoutCenter").find("#workspace").height(layoutCenterHeight);

		if (core.module.layout.workSpace.windowManager.isMaximize) {
			$(document).trigger("maximizeResize");
		}

		$(".dummyspace").css("z-index", 0);
		/*
		var divChatContentsHeight = $(".yui-layout-unit-bottom").find(".yui-layout-wrap").height() - 90;
		$("#goormInnerLayoutBottom").find("#divChatContents").height(divChatContentsHeight);
		
			
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


}
