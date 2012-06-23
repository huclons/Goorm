/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module project
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class open
 * @extends project
 **/
org.goorm.core.project.open = function () {
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
	 * @property Object
	 * @type Object
	 * @default null
	 **/
	this.chat = null;
};

org.goorm.core.project.open.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor
	 **/
	init: function () {
		
		var self = this;
				
		var handleOpen = function() { 
		this.hide(); 
			// project open
			if ($("#divProjectPath").attr("value")=="Not selected") {
				alert.show(core.localization.msg["alertProjectNotSelected"]);
				return false;
			}
			
			self.open($("#divProjectPath").attr("value"), $("#divProjectName").attr("value"), $("#divProjectType").attr("value"));
			this.hide(); 
		};

		var handleCancel = function() { 
			
			this.hide(); 
		};
		
		this.buttons = [ {text:"Open", handler:handleOpen, isDefault:true},
						 {text:"Cancel",  handler:handleCancel}]; 
						 
		this.dialog = new org.goorm.core.project.open.dialog();
		this.dialog.init({
			title:"Open Project", 
			path:"configs/dialogs/org.goorm.core.project/project.open.html",
			width:800,
			height:500,
			modal:true,
			buttons:this.buttons,
			success: function () {
				var resize = new YAHOO.util.Resize("projectOpenDialogLeft", {
		            handles: ['r'],
		            minWidth: 200,
		            maxWidth: 400
		        });
				
		        resize.on('resize', function(ev) {
					var width = $("#projectOpenDialogMiddle").width();
		            var w = ev.width;
		            $("#projectOpenDialogCenter").css('width', (width - w - 9) + 'px');
		        });

				self.addProjectItem();
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
		this.addProjectList();
		$("#projectOpenType").val("All");
		$("#projectOpenLocation").val("");
		$("#divProjectInformation").empty();
		$("div[id='project.open']").find("#projectOpenDialogLeft").scrollTop(0);
		this.dialog.panel.show();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method open 
	 **/
	open: function (currentProjectPath, currentProjectName, currentProjectType) {
		console.log("project open");
		core.currentProjectPath = currentProjectPath;
		core.currentProjectName = currentProjectName;
		core.currentProjectType = currentProjectType;
		
		if(core.isChatOn){
			core.mainLayout.chat.setChatOff();
		}
		
		core.dialogProjectProperty.setProjectInformation();
		core.dialogProjectProperty.refreshToolBox();
		
		$("a[action=showProperties]").removeClass('yuimenuitemlabel-disabled');
		$("a[action=showProperties]").parent().removeClass('yuimenuitem-disabled');
		var str = core.currentProjectPath;
		str.replace(".","");
		str.replace("#","");
		
		core.mainLayout.showChat(str);
		
		if(core.isChatOn){
			core.mainLayout.chat.setChatOn();
		}
		core.mainLayout.projectExplorer.refresh();
		core.mainLayout.refreshConsole();
		
		$("#goormMainMenu #Project .yuimenuitemlabel").removeClass('yuimenuitemlabel-disabled');
		$("#goormMainMenu #Project .yuimenuitemlabel").parent().removeClass('yuimenuitem-disabled');
		
		if(core.pluginManager.plugins["org.goorm.plugin."+currentProjectType]){
			
			if($.isFunction(core.pluginManager.plugins["org.goorm.plugin."+currentProjectType].run)){
				$("a[action=run]").removeClass("yuimenuitemlabel-disabled");
				$("a[action=run]").parent().removeClass("yuimenuitem-disabled");
			} else {
				$("a[action=run]").addClass("yuimenuitemlabel-disabled");
				$("a[action=run]").parent().addClass("yuimenuitem-disabled");
			}
			
			if($.isFunction(core.pluginManager.plugins["org.goorm.plugin."+currentProjectType].debug)){
				$("a[action=debug]").removeClass("yuimenuitemlabel-disabled");
				$("a[action=debug]").parent().removeClass("yuimenuitem-disabled");
			} else {
				$("a[action=debug]").addClass("yuimenuitemlabel-disabled");
				$("a[action=debug]").parent().addClass("yuimenuitem-disabled");
			}
			
			if($.isFunction(core.pluginManager.plugins["org.goorm.plugin."+currentProjectType].remoteRun)){
				$("a[action=remoteRun]").removeClass("yuimenuitemlabel-disabled");
				$("a[action=remoteRun]").parent().removeClass("yuimenuitem-disabled");
			} else {
				$("a[action=remoteRun]").addClass("yuimenuitemlabel-disabled");
				$("a[action=remoteRun]").parent().addClass("yuimenuitem-disabled");
			}
			
			if($.isFunction(core.pluginManager.plugins["org.goorm.plugin."+currentProjectType].build)){
				$("a[action=buildProject]").removeClass("yuimenuitemlabel-disabled");
				$("a[action=buildProject]").parent().removeClass("yuimenuitem-disabled");
				$("a[action=buildAll]").removeClass("yuimenuitemlabel-disabled");
				$("a[action=buildAll]").parent().removeClass("yuimenuitem-disabled");
			} else {
				$("a[action=buildProject]").addClass("yuimenuitemlabel-disabled");
				$("a[action=buildProject]").parent().addClass("yuimenuitem-disabled");
				$("a[action=buildAll]").addClass("yuimenuitemlabel-disabled");
				$("a[action=buildAll]").parent().addClass("yuimenuitem-disabled");		
			}
			
			if($.isFunction(core.pluginManager.plugins["org.goorm.plugin."+currentProjectType].generate)){
				$("a[action=generate]").removeClass("yuimenuitemlabel-disabled");
				$("a[action=generate]").parent().removeClass("yuimenuitem-disabled");
				$("a[action=generateAll]").removeClass("yuimenuitemlabel-disabled");
				$("a[action=generateAll]").parent().removeClass("yuimenuitem-disabled");
			} else {
				$("a[action=generate]").addClass("yuimenuitemlabel-disabled");
				$("a[action=generate]").parent().addClass("yuimenuitem-disabled");
				$("a[action=generateAll]").addClass("yuimenuitemlabel-disabled");
				$("a[action=generateAll]").parent().addClass("yuimenuitem-disabled");
			}
			
			if($.isFunction(core.pluginManager.plugins["org.goorm.plugin."+currentProjectType].clean)){
				$("a[action=clean]").removeClass("yuimenuitemlabel-disabled");
				$("a[action=clean]").parent().removeClass("yuimenuitem-disabled");
			} else {
				$("a[action=clean]").addClass("yuimenuitemlabel-disabled");
				$("a[action=clean]").parent().addClass("yuimenuitem-disabled");
			}
		}
		$(document).trigger('onOpenProject');		
	},

	/**
	 * This function is an goorm core initializating function.  
	 * @method addProjectList 
	 **/	
	addProjectList: function () {
		$("#projectOpenProjectList").empty();
			
		$.post("project/get_list", "", function (data) {
						
			var sortingData = eval(data);
						
			for(var name in sortingData) {
				var iconStr = "";
				iconStr += "<div id='selector_" + sortingData[name].filename + "' value='" + sortingData[name].filename + "' class='selector_project' type='"+sortingData[name].type+"'>";
				iconStr += "<div style='padding-left:65px; padding-top:20px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis'>";
				iconStr += sortingData[name].filename;
				iconStr += "</div>";
				iconStr += "</div>";

				$("#projectOpenProjectList").append(iconStr);
			}
			
			$(".selector_project").click(function() {
				$(".selector_project").removeClass("selectedButton");
				$(this).addClass("selectedButton");
				
				$("#divProjectPath").attr("value", $(this).attr("value"));
				$("#projectOpenLocation").attr("value", "/" + $(this).attr("value") + "/");

				$.ajax({
					type: "GET",
					dataType: "xml",
					async :false,
					url: "project/" +  $(this).attr("value") + "/project.xml",
					success: function(xml) {
						$("#divProjectInformation").empty();
						$("#divProjectInformation").append("<b>Project Type : </b>");
						$("#divProjectInformation").append($(xml).find("TYPE").text()+"<br/>");
						$("#divProjectInformation").append("<b>Project detailed Type : </b>");
						$("#divProjectInformation").append($(xml).find("DETAILEDTYPE").text()+"<br/>");
						$("#divProjectInformation").append("<b>Project Author : </b>");
						$("#divProjectInformation").append($(xml).find("AUTHOR").text()+"<br/>");
						$("#divProjectInformation").append("<b>Project Name : </b>");
						$("#divProjectInformation").append($(xml).find("NAME").text()+"<br/>");
						$("#divProjectInformation").append("<b>Project About : </b>");
						$("#divProjectInformation").append($(xml).find("ABOUT").text()+"<br/>");
						$("#divProjectInformation").append("<b>Project Date : </b>");
						$("#divProjectInformation").append($(xml).find("DATE").text()+"<br/>");
						
						$("#divProjectName").attr("value", $(xml).find("NAME").text());
						$("#divProjectType").attr("value", $(xml).find("TYPE").text());
					}
					, error: function(xhr, status, error) {alert.show(core.localization.msg["alertError"] + error);}
				});
			});
		});
	},
	
	addProjectItem: function() {
		$("div[id='project.open']").find("#projectOpenType").append("<option value='All'>All Project</option>");
		$("div[id='project.open']").find("#projectOpenType").append("<option value='goorm'>goorm Project</option>");
		
		$("#projectOpenType").change(function() {
			var type = $("#projectOpenType option:selected").val();
			if(type=="All") {
				$("div[id='project.open']").find(".selector_project").each(function() {
					$(this).css("display", "block");
				});
			}
			else {
				$("div[id='project.open']").find(".selector_project").each(function() {
					if($(this).attr("type")==type) {
						$(this).css("display", "block");
					}
					else {
						$(this).css("display", "none");
					}
				});
			}
		});
	}
};