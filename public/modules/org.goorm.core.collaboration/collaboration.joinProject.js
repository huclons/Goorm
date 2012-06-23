/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module collaboration
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class joinProject
 * @extends collaboration
 **/
org.goorm.core.collaboration.joinProject = function () {
	/**
	 * This presents the current browser version
	 * @property dialog
	 * @type Object
	 * @default null
	 **/
	
	this.dialog = null;
	
	/**
	 * The array object that contains the information about buttons on the bottom of a dialog 
	 * @property buttons
	 * @type Object
	 * @default null
	 **/
	this.buttons = null;
	
	/**
	 * This presents the current browser version
	 * @property tabView
	 * @type Object
	 * @default null
	 **/
	
	this.tabView = null;
	
	/**
	 * This presents the current browser version
	 * @property treeView
	 * @type Object
	 * @default null
	 **/
	this.treeView = null;
	
	/**
	 * This presents the current browser version
	 * @property chat
	 * @type Object
	 * @default null
	 **/
	this.chat = null;
};

org.goorm.core.collaboration.joinProject.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 **/
	init: function () { 
		var self = this;
		var handleJoin = function() { 
			var self2=this;
			if($("#joinProjectContents #ProjectList .selector_project").hasClass('selectedButton')){
				$("#joinProjectContents #ProjectList .selectedButton").each(function(){
					self.chat.setChatOff();
					core.dialogOpenProject.open($(this).attr("projectPath"),$(this).attr("projectName"),$(this).attr("projectType"));
					if (!core.isCollaborationON) {
						$("a[action=collaborationEditOnOff]").click();
					}
					if (!core.isCollaborationDrawON) {
						$("a[action=collaborationDrawOnOff]").click();
					}
					self2.hide();
				});
			}else{
				alert.show(core.localization.msg["alertCollaborationSelect"]);
			}
		};

		var handleCancel = function() { 
			this.hide(); 
			if(self.chat) self.chat.setChatOff();
		};
		
		this.buttons = [ {text:"Join", handler:handleJoin, isDefault:true},
						 {text:"Cancel",  handler:handleCancel}]; 
						 
		this.dialog = new org.goorm.core.collaboration.joinProject.dialog();
		this.dialog.init({
			title:"Join Online Project", 
			path:"configs/dialogs/org.goorm.core.collaboration/collaboration.joinProject.html",
			width:700,
			height:500,
			modal:true,
			buttons:this.buttons,
			success: function () {
				//TabView Init
				self.tabView = new YAHOO.widget.TabView('joinProjectContents');
				
				//TreeView Init
				self.treeView = new YAHOO.widget.TreeView("joinProjectTreeview");
				self.treeView.render();
				
				$("#joinProjectContents").children("div").css("padding","0px");
			}
		});
		this.dialog = this.dialog.dialog;
		
		//this.dialog.panel.setBody("AA");
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method show 
	 **/
	show: function () {
		var self=this;
		this.dialog.panel.show();
		
		self.chat = new org.goorm.core.collaboration.chat();
		self.chat.init("ChatJoinOnlineProject");
		$("#joinProjectContents #ProjectList").html('');
		self.addProjectList();
		if(!this.chat.isChatOn){
			this.chat.setChatOn();
		}	
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method addProjectList 
	 **/	
	addProjectList: function () {
		var postdata = {
			kind: "project",
			projectName: "",
			folderOnly: "false"
		};
		
		$.post("file/get_nodes", postdata, function (data) {
			
			var sortJsonData = function (x,y) {
				return ((x.cls > y.cls) ? -1 : ((x.cls < y.cls) ? 1 : 0 ));
			};
			
			var sortProjectTreeview = function (sortingData) { 				
				sortingData.sort(sortJsonData);
				
				for(i=0; i<sortingData.length; i++) {
					if(sortingData[i].children) {
						sortProjectTreeview(sortingData[i].children);
					}
				}
			};
			
			var sortingData = eval(data);
			
			var counter = 0;
			for(var name in sortingData) {
				if(sortingData[name].cls=="folder") {
					var iconStr = "";
					var url = {path : "../../project/" +  sortingData[name].filename + "/project.xml"};
					counter++;
					$.get("file/get_contents", url , function (xml) {
						if(xml){
							if($(xml).find("COLLABORATION").text() == "true"){
								var projectName = $(xml).find("AUTHOR").text()+"_"+$(xml).find("NAME").text();
								iconStr = "<div id='selector_" + projectName + "' projectPath='" + projectName + "' projectName='" + $(xml).find("NAME").text() + "' projectType='"+ $(xml).find("TYPE").text() +"' class='selector_project'>";
								iconStr += "<div style='padding-left:65px; padding-top:20px;'>";
								iconStr += projectName;
								iconStr += "</div>";
								iconStr += "</div>";
								$("#joinProjectContents #ProjectList").append(iconStr);
							}
						}
						counter--;
						if(counter ==0){
							$("#joinProjectContents #ProjectList .selector_project").click(function() {
								$("#joinProjectContents #ProjectList .selector_project").removeClass("selectedButton");
								$(this).addClass("selectedButton");
							});
						}
					});
				}
			}
		});
	}
};