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
 * @class buildAll
 * @extends project.build
 **/
org.goorm.core.project.build.buildAll = function () {
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

};

org.goorm.core.project.build.buildAll.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor
	 **/
	init: function () {
		
		var self = this;
				
		var handleOpen = function() {
			var obj = new Object(); 
			$("#buildAllList input[type=hidden]").each(function(){
				var status = $(this).parent().find(".buildStatus");
				obj[$(this).attr("name")] = status;
				status.html("<img src='./images/org.goorm.core.utility/loading.gif' width='16' height='16' align='top'>building");
				core.pluginManager.plugins["org.goorm.plugin."+$(this).attr("projectType")].build($(this).attr("name"),$(this).attr("projectPath"),function(){
					status.html("<img src='./images/org.goorm.core.dialog/dialog_notice.png' width='16' height='16' align='top'>complete");
				});
			});
		};

		var handleCancel = function() { 
			this.hide(); 
		};
		
		this.buttons = [ {text:"Build", handler:handleOpen, isDefault:true},
						 {text:"Cancel",  handler:handleCancel}]; 
						 
		this.dialog = new org.goorm.core.project.build.buildAll.dialog();
		this.dialog.init({
			title:"Build Project", 
			path:"configs/dialogs/org.goorm.core.project/project.build.buildAll.html",
			width:400,
			height:370,
			modal:true,
			buttons:this.buttons,
			success: function () {
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
		this.projectList();
		this.dialog.panel.show();
	},

	/**
	 * This function is an goorm core initializating function.  
	 * @method addbuild\.projectList 
	 **/	
	projectList: function () {
		$("#buildAllList").empty();
			
		$.post("project/get_list", "", function (data) {
			
			var sortingData = eval(data);
			
			for(var name in sortingData) {
				if(!$.isEmptyObject(core.pluginManager.plugins["org.goorm.plugin."+sortingData[name].type])) {
					if(core.pluginManager.plugins["org.goorm.plugin."+sortingData[name].type].build){
						var iconStr = "";
						iconStr += "<div id='selector_" + sortingData[name].filename + "' value='" + sortingData[name].filename + "'>";
						iconStr += "<input type='hidden' name='"+sortingData[name].filename+"' projectPath='"+sortingData[name].author+"_"+sortingData[name].name+"' projectName='"+sortingData[name].name+"' projectType='"+sortingData[name].type+"'>";
						iconStr += sortingData[name].filename;
						iconStr += "<div style='float:right' class='buildStatus'></div>";
						iconStr += "</div>";
			
						$("#buildAllList").append(iconStr);
					}
				}
			}
		});
	}
};