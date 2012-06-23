/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module toolbar
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class toolbar
 **/
org.goorm.core.toolbar = function () {
	/**
	 * This presents the current browser version
	 * @property contextMenu
	 * @type Object
	 * @default null
	 **/
	this.contextMenu = null;
	
	this.order = null;
	
	this.index = 0;
	this.index_check = 0;
	
};

org.goorm.core.toolbar.prototype = {
	init: function (){
		var self = this;
		this.order = localStorage['toolbar.order'];
		
		
		this.index = 0;
		this.index_check = 0;

		
				
		// initialize toolbar
		/*
		if(this.order) {
			this.order = this.order.split("|");
			
			for(var i=0; i < this.order.length; i++){
				this.add("configs/toolbars/"+this.order[i] + "/" + (this.order[i].split(".")).pop() + ".toolbar.html", this.order[i], "goormMainToolbar");
			}
		} 
		else {
		*/
			this.order = new Array("org.goorm.core.file", "org.goorm.core.edit", "org.goorm.core.project", "org.goorm.core.window", "org.goorm.core.design", "org.goorm.core.collaboration");
			
			var str="";
			for(var i=0; i < this.order.length; i++){
				if(i != 0) str+="|";
				str += this.order[i];
			}
			localStorage['toolbar.order'] = str;
			
			this.add("configs/toolbars/org.goorm.core.file/file.toolbar.html","org.goorm.core.file","goormMainToolbar");
			this.add("configs/toolbars/org.goorm.core.edit/edit.toolbar.html","org.goorm.core.edit","goormMainToolbar");
			this.add("configs/toolbars/org.goorm.core.project/project.toolbar.html","org.goorm.core.project","goormMainToolbar");			
			this.add("configs/toolbars/org.goorm.core.window/window.toolbar.html","org.goorm.core.window","goormMainToolbar");
			this.add("configs/toolbars/org.goorm.core.design/design.toolbar.html","org.goorm.core.design","goormMainToolbar");
			this.add("configs/toolbars/org.goorm.core.collaboration/collaboration.toolbar.html","org.goorm.core.collaboration","goormMainToolbar");
		//}
		
		$(this).bind("toolbarLoaded", function () {
			var ddList = new Array();
			var handleTarget = new Array();
			var Dom = YAHOO.util.Dom; 
			var Event = YAHOO.util.Event; 
			var DDM = YAHOO.util.DragDropMgr; 

			// init menu.action
			//core.action.init();
			
			for(var i=0; i < self.order.length; i++){
				ddList[i] = new YAHOO.util.DD((self.order[i].split(".")).pop()+".toolbar");
				ddList[i].setHandleElId("toolbarHandle_"+self.order[i]);
				
				var here = this;
				var destEl = null;
				
				ddList[i].on('startDragEvent',function(ev){
					$(".toolbarMovingHandle").css("background","#eee");
					here.dragEl = this.getDragEl();
				}, ddList[i], true);
				
				ddList[i].on('dragEnterEvent',function(ev,id){
					destEl = Dom.get(ev.info);
				}, ddList[i], true);
				
				ddList[i].on('dragOverEvent',function(ev,id){
					if(Math.abs(Dom.getX(destEl)-Dom.getX(here.dragEl)) < 14){
			        	Dom.setStyle(Dom.getFirstChild(destEl),"background","#fcc");
					}
					else {
						Dom.setStyle(Dom.getFirstChild(destEl),"background","#eee");
					}
				}, ddList[i], true);
				
				ddList[i].on('dragDropEvent',function(ev,id){
			        if(Math.abs(Dom.getX(destEl)-Dom.getX(here.dragEl)) < 14){
			        	destEl.parentNode.insertBefore(here.dragEl, destEl);
			        	
			        	var str="";
			        	var j=0;
						$("#goormMainToolbar").children("div .toolbarPart").each(function(i){
							if(i != 0) str+="|";
							str += ($(this).children("div").attr("id").split("_")).pop();
						});
						
						localStorage['toolbar.order'] = str;
			        }
				}, ddList[i], true);
				
				ddList[i].on('endDragEvent',function(ev){
					$(".toolbarMovingHandle").css("background","none");
					
			        var srcEl = here.dragEl; 
			        
			        Dom.setStyle(srcEl.id, "left", "0");
			        Dom.setStyle(srcEl.id, "top", "0");

				}, ddList[i], true);
				
				ddList[i].on('mouseUpEvent',function(ev){
					$(".toolbarMovingHandle").css("background","none");
				}, ddList[i], true);
			}
			
			// default Button Setting.
			if(localStorage['preference.editor.useClipboard'] == "true") {
				$("a[action=useClipboard]").find("img").addClass("toolbarButtonPressed");
			}
			$(document).bind("onPreferenceConfirm",function(){
				if(localStorage['preference.editor.useClipboard'] == "true") {
					$("a[action=useClipboard]").find("img").addClass("toolbarButtonPressed");
				}else {
					$("a[action=useClipboard]").find("img").removeClass("toolbarButtonPressed");
				}
			});
		});
	},
		
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 * @param {String} path The path.
	 * @param {String} name The name.
	 * @param {String} container The container.
	 **/
	add: function (path, name, container) {
		var self = this;
		var url = "file/get_contents";
		var index = this.index++;
		
		$.ajax({
			url: url,			
			type: "GET",
			data: "path="+path,
			success: function(data) {
				$("#toolbar_"+index).replaceWith(data);
				
				var div_name = name.split(".").pop(); 
				$("#"+div_name+".toolbar").prepend("<div id='toolbarHandle_"+name+"' class='toolbarMovingHandle'><div class='toolbarHandle'></div></div>");
				console.log($("#"+div_name+".toolbar").html());
				
				self.index_check++;
				if(self.index_check == self.order.length){
					$(self).trigger("toolbarLoaded");
				}
				
				$("#"+container).append(data);
				//self.contextMenu = 
				//self.contextMenu = new org.goorm.core.menu.context();
				//self.contextMenu.init("../../config/menu/org.goorm.core.window/window.panel.titlebar.html", "window.panel.titlebar", $("#"+container).find(".titlebar"), this.title);
			}
		});
	},
	/**
	 * This function is an goorm core initializating function.  
	 * @method switchState 
	 **/
	switchState: function(type){
		switch(type){
			case "Rule_Editor":
			case "Editor" :
				$("#design\\.toolbar").css("opacity","0.3").css("filter","alpha(opacity=30)").children().addClass('disabled');
				$("#edit\\.toolbar").css("opacity","1.0").css("filter","alpha(opacity=100)").children().removeClass('disabled');
				$("#goormMainMenu #Design").find("li").each(function(){
					$(this).addClass("yuimenuitem-disabled");
					$(this).children("a").addClass("yuimenuitemlabel-disabled");
				});
				break;
			case "Designer" :
				$("#design\\.toolbar").css("opacity","1.0").css("filter","alpha(opacity=100)").children().removeClass('disabled');
				$("#goormMainMenu #Design").find("li").each(function(){
					$(this).removeClass("yuimenuitem-disabled");
					$(this).children("a").removeClass("yuimenuitemlabel-disabled");
				});
				break;
			default:
		}
	},
	/**
	 * This function is an goorm core initializating function.  
	 * @method remove 
	 **/
	remove: function () {
		//this.contextMenu.remove();
	
		delete this;
	}
};