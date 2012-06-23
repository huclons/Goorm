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
 * @class tab
 * @extends window
 **/
org.goorm.core.window.tab = function () {
	/**
	 * This presents the current browser version
	 * @property tabView
	 * @type Object
	 * @default null
	 **/
	this.tabView = null;
	
	/**
	 * This presents the current browser version
	 * @property listmenu
	 * @type Object
	 * @default null
	 **/
	this.listmenu = null;
	
	/**
	 * This presents the current browser version
	 * @property tab
	 * @type Object
	 * @default null
	 **/
	this.tab = null;
	
	/**
	 * This presents the current browser version
	 * @property menuitem
	 * @type Object
	 * @default null
	 **/
	this.menuitem = null;
	
	/**
	 * This presents the current browser version
	 * @property window
	 * @type Object
	 * @default null
	 **/
	this.window = null;
	
	/**
	 * This presents the current browser version
	 * @property contextMenu
	 * @type Object
	 * @default null
	 **/
	this.contextMenu = null;
	
	/**
	 * This presents the current browser version
	 * @property title
	 * @type Object
	 * @default null
	 **/
	this.title = null;
	
	this.isSaved = null;
};

org.goorm.core.window.tab.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 * @param {Object} container The container.
	 * @param {Object} title The title.
	 * @param {Object} tabView The tabView.
	 * @param {Object} listmenu The listmenu.
	 **/
	init: function(container, title, tabView, listmenu) {
		var self = this;
		
		this.isSaved = true;
		
		this.tabView = tabView;
		this.listmenu = listmenu;
		
		this.title = title;
		
		this.tab = new YAHOO.widget.Tab({ label: "<span class='tabtitle' style='float:left'>" + this.title + "</span> <div class='close tabCloseButton'></div>", content: "" });
		
		this.tabView.addTab(this.tab);
		this.tabView.selectTab(this.tabView.getTabIndex(this.tab));
				
		//For window list menu
		var activateDummy = function () {
			self.activate();
		};
		
		this.menuitem = new YAHOO.widget.MenuItem("windowListMenu", {text: this.title, onclick: {fn: activateDummy}});
		
		this.listmenu.addItem(this.menuitem);
		this.listmenu.render();
		
		this.contextMenu = new org.goorm.core.menu.context();
		this.contextMenu.init("configs/menu/org.goorm.core.window/window.tab.html", "window.tab", this.tab.get("labelEl"), this.title, null, function () { self.setEvent(); });
		
	},
	/**
	 * This function is an goorm core initializating function.  
	 * @method setEvent 
	 * @param {Object} window The window.
	 **/
	setEvent: function(){
		var self = this;
		//////////////////////////////////////////////////////////////////////////////////////////
		// Window tab events
		//////////////////////////////////////////////////////////////////////////////////////////
		var str = self.contextMenu.name.replace(/[/.]/g,"\\.");
		
		//tab right click event assign
		$(this.tab.get("labelEl")).mousedown(function(e) {
		    if (e.which === 3) {
		    	console.log(self.window.container);
		    	console.log($("#"+self.window.container+"_c").css("display"));
		    	
		    	if($("#"+self.window.container+"_c").css("display") == "none"){
		    		console.log("minimize must be disabled!");
		    		$("#"+str).find(".unminimize").removeClass('yuimenuitemlabel-disabled');
		    		$("#"+str).find(".unminimize").parent().removeClass('yuimenuitem-disabled');
		    		$("#"+str).find(".minimize").addClass('yuimenuitemlabel-disabled');
		    		$("#"+str).find(".minimize").parent().addClass('yuimenuitem-disabled');
		    	}
		    	else {
		    		console.log("minimize must be abled!");
		    		$("#"+str).find(".unminimize").addClass('yuimenuitemlabel-disabled');
		    		$("#"+str).find(".unminimize").parent().addClass('yuimenuitem-disabled');
		    		$("#"+str).find(".minimize").removeClass('yuimenuitemlabel-disabled');
		    		$("#"+str).find(".minimize").parent().removeClass('yuimenuitem-disabled');
		    	}

				return false;
		    }
		});

		//tab click event assign
		$(this.tab.get("labelEl")).click(function(e) {
			if (e.which == 1) {
				self.activate();
				
				e.stopPropagation();
				e.preventDefault();
				return false;
			}
		});	
		
		//close button click event assign
		$(this.tab.get("labelEl")).find(".close").click(function(e) {
			if (e.which == 1) {
				self.close();
				return false;
			}
		});
		
		$("#"+str).find(".close").click(function(e){
			if (e.which == 1) {
				self.contextMenu.hide();
				self.close();
				return false;
			}
		});
		
		$("#"+str).find(".minimize").click(function(e){
			if (e.which == 1) {
				self.contextMenu.hide();
				self.window.minimize();
				return false;
			}
		});
		
		$("#"+str).find(".unminimize").click(function(e){
			if (e.which == 1) {
				if(!$(this).hasClass('yuimenuitemlabel-disabled')){
					self.contextMenu.hide();
					self.activate();
				}
				return false;
			}
		});
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method setModified
	 **/
	setModified: function() {
	 	var tabtitle = $(this.tab.get("labelEl")).find(".tabtitle").text();
	  	tabtitle = tabtitle.replace(" *", "");
		$(this.tab.get("labelEl")).find(".tabtitle").html(tabtitle + " *");
		
		this.isSaved = false;
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method setSaved
	 **/
	setSaved: function() {
	  	var tabtitle = $(this.tab.get("labelEl")).find(".tabtitle").text();
		$(this.tab.get("labelEl")).find(".tabtitle").html(tabtitle.replace(" *", ""));
		
		this.isSaved = true;
	},
  
	/**
	 * This function is an goorm core initializating function.  
	 * @method connect 
	 * @param {Object} window The window.
	 **/
	connect: function(window) {
		this.window = window;
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method close 
	 **/
	close: function () {
	
		var self = this;

		if(this.isSaved) {		
			
			this.tabView.removeTab(this.tab);
			
			//core.mainLayout.workSpace.windowManager.window.splice(core.mainLayout.workSpace.windowManager.window.indexOf(this.tabView.getTabIndex(this.tab)), 1);
					
			
			this.listmenu.removeItem(this.menuitem);
			
			this.contextMenu.remove();
			
			if(this.window) {
				this.window.tab = null;
				this.window.close();
			}
			
			delete this;
		}
		else {
			console.log(this);
			confirmationSave.init({
				title: core.localization.msg["confirmationSaveTitle"], 
				message: "\""+this.window.filename+"\" "+core.localization.msg["confirmationSaveMessage"],
				yesText: core.localization.msg["confirmationYes"],
				cancelText: core.localization.msg["confirmationCancel"],
				noText: core.localization.msg["confirmationNo"],
				yes: function () {
					self.window.editor.save("close");
				}, cancel: function () {
				}, no: function () {
					self.isSaved = true;
					self.window.isSaved = true;
					self.close();
				}
			});
			
			confirmationSave.panel.show();
		}
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method activate 
	 **/
	activate: function() {
		this.tabView.selectTab(this.tabView.getTabIndex(this.tab));
		
		
		$("#windowListMenu").find(".yuimenuitem-checked").each(function(i) {
			$(this).removeClass("yuimenuitem-checked");
		});
		
		$(this.menuitem.element).addClass("yuimenuitem-checked");	
		core.toolbar.switchState(this.window.type);
		this.window.show();
		if (!$("#" + this.window.container).find(".hd").hasClass("activated")) {
			for (var i = 0; i < core.mainLayout.workSpace.windowManager.index; i++) {
				if(core.mainLayout.workSpace.windowManager.window[i].alive && core.mainLayout.workSpace.windowManager.window[i]==this.window ) {
					core.mainLayout.workSpace.windowManager.activeWindow = i;
					break;
				}
			}

			this.window.activate();
		}
	}
	
};