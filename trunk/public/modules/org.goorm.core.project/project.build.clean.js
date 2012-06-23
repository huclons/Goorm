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
org.goorm.core.project.build.clean = function () {
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

org.goorm.core.project.build.clean.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor
	 **/
	init: function () {
		
		var self = this;
				
		var handleClean = function() { 
			$("#buildCleanList input[type=checkbox]").each(function(){
				if($(this).is(":checked")){

					if(core.pluginManager.plugins["org.goorm.plugin."+$(this).attr("projectType")]!=undefined) {
						console.log("why?");
						console.log("org.goorm.plugin."+$(this).attr("projectType"));
						core.pluginManager.plugins["org.goorm.plugin."+$(this).attr("projectType")].clean($(this).attr("name"));
					}
				}
			});
			this.hide(); 
		};

		var handleCancel = function() { 
			this.hide(); 
		};
		
		this.buttons = [ {text:"Clean", handler:handleClean, isDefault:true},
						 {text:"Cancel",  handler:handleCancel}]; 
						 
		this.dialog = new org.goorm.core.project.build.clean.dialog();
		this.dialog.init({
			title:"Build Clean", 
			path:"configs/dialogs/org.goorm.core.project/project.build.clean.html",
			width:400,
			height:400,
			modal:true,
			buttons:this.buttons,
			success: function () {
				self.buttonSelectAll = new YAHOO.widget.Button("buildCleanSelectAll");
				self.buttonDeselectAll = new YAHOO.widget.Button("buildCleanUnSelectAll");
				
				$("#buildCleanSelectAll").click(function(){
					self.selectAll();
				});
				$("#buildCleanUnSelectAll").click(function(){
					self.unselectAll();
				});
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

	selectAll: function(){
		$("#buildCleanList input[type=checkbox]").attr("checked",true);
	},
	
	unselectAll: function(){
		$("#buildCleanList input[type=checkbox]").attr("checked",false);
	},
	/**
	 * This function is an goorm core initializating function.  
	 * @method addbuild\.projectList 
	 **/	
	projectList: function () {
		$("#buildCleanList").empty();
	
		$.post("project/get_list", "", function (data) {
			
			var sortingData = eval(data);
			
			for(var name in sortingData) {
				if(!$.isEmptyObject(core.pluginManager.plugins["org.goorm.plugin."+sortingData[name].type])) {
					if(core.pluginManager.plugins["org.goorm.plugin."+sortingData[name].type].clean){
						var iconStr = "";
						iconStr += "<div id='claeanSelector_" + sortingData[name].filename + "' value='" + sortingData[name].filename + "' class='selectDiv' style='height:14px;'>";
						iconStr += "<div style='float:left;'>";
						iconStr += "<input type='checkbox' name='"+sortingData[name].filename+"' projectPath='"+sortingData[name].author+"_"+sortingData[name].name+"' projectName='"+sortingData[name].name+"' projectType='"+sortingData[name].type+"'";
		
						if (sortingData[name].filename == core.currentProjectPath) {
							iconStr += "checked";
						}
						
						iconStr += ">";
						
						iconStr += "</div>";
						iconStr += "<div style='float:left; padding-top:1px; padding-left:5px;'>" + sortingData[name].filename + "</div>";
						iconStr += "</div>";
			
						$("#buildCleanList").append(iconStr);
						
						$("#claeanSelector_" + sortingData[name].filename).click(function () {
							console.log("AAA");
							$(this).find("input").attr("checked", !$(this).find("input").attr("checked"));
						});
					}
				}
			}
		});
	}
};