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
org.goorm.core.project.build.buildProject = function () {
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
	 * The array object that contains the information about buttons on the bottom of a dialog 
	 * @property buttonSelectAll
	 * @type Object
	 * @default null
	 **/
	this.buttonSelectAll = null;	

	/**
	 * The array object that contains the information about buttons on the bottom of a dialog 
	 * @property buttonDeselectAll
	 * @type Object
	 * @default null
	 **/
	this.buttonDeselectAll = null;
	
	this.isRepeat = null
};

org.goorm.core.project.build.buildProject.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor
	 **/
	init: function () {
		
		var self = this;
		
		self.isRepeat = false;
				
		var handleOpen = function() {
			$("#buildProjectList input[type=checkbox]").each(function(){
				var list = this;
				if($(list).is(":checked")){
				
					var windowManager = core.mainLayout.workSpace.windowManager;
					var doSave = false;
					var targetWindow = -1;
					var tempFileName = "";

					if ( !self.isRepeat ) {
						$(windowManager.window).each(function (i) {
							if( ("../../project/"+$(list).attr("projectPath")) ==  this.filepath && !this.isSaved ) {
								tempFileName = this.filename;
								doSave = true;
								targetWindow = i;
							}
						});
					}

					if ( doSave && !self.isRepeat ) {

						confirmationSave.init({
							title: core.localization.msg["confirmationSaveTitle2"],
							message: "\""+tempFileName+"\" "+core.localization.msg["confirmationSaveMessage2"],
							yesText: core.localization.msg["confirmationYes"],
							cancelText: core.localization.msg["confirmationCancel"],
							noText: core.localization.msg["confirmationNo"],
							yes: function () {
								self.isRepeat = true;							
								windowManager.window[targetWindow].editor.save();
								handleOpen();
								self.dialog.panel.hide();
							}, cancel: function () {
								self.isRepeat = false;							
								return false;
								self.dialog.panel.hide();
							}, no: function () {
								self.isRepeat = true;
								handleOpen();
								self.dialog.panel.hide();
							}
						});
						
						confirmationSave.panel.show();
					}
					else {
						if (self.isRepeat) {
							confirmationSave.panel.hide();
						}
						
						self.isRepeat = false;
											
						if(!$.isEmptyObject(core.pluginManager.plugins["org.goorm.plugin."+$(list).attr("projectType")])) {
							core.pluginManager.plugins["org.goorm.plugin."+$(list).attr("projectType")].build($(list).attr("projectName"),$(list).attr("projectPath"));
						}
						else {
							alert.show("Cannot find plugin to build project!");
						}
					}
				}
			});
			this.hide(); 
		};

		var handleCancel = function() { 
			this.hide(); 
		};
		
		this.buttons = [ {text:"Build", handler:handleOpen, isDefault:true},
						 {text:"Cancel",  handler:handleCancel}]; 
						 
		this.dialog = new org.goorm.core.project.build.buildProject.dialog();
		this.dialog.init({
			title:"Build Project", 
			path:"configs/dialogs/org.goorm.core.project/project.build.buildProject.html",
			width:400,
			height:400,
			modal:true,
			buttons:this.buttons,
			success: function () {
				self.buttonSelectAll = new YAHOO.widget.Button("buildProjectSelectAll");
				self.buttonDeselectAll = new YAHOO.widget.Button("buildProjectDeselectAll");
				
				$("#buildProjectSelectAll").click(function(){
					self.selectAll();
				});
				$("#buildProjectDeselectAll").click(function(){
					self.deselectAll();
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
		$("#buildProjectList input[type=checkbox]").attr("checked",true);
	},
	
	deselectAll: function(){
		$("#buildProjectList input[type=checkbox]").attr("checked",false);
	},
	/**
	 * This function is an goorm core initializating function.  
	 * @method addbuild\.projectList 
	 **/	
	projectList: function () {
		$("#buildProjectList").empty();
	
		$.post("project/get_list", "", function (data) {
			
			var sortingData = eval(data);
			
			for(var name in sortingData) {
				if(!$.isEmptyObject(core.pluginManager.plugins["org.goorm.plugin."+sortingData[name].type])) {
					if(core.pluginManager.plugins["org.goorm.plugin."+sortingData[name].type].build){
						
						var temp = "";
						temp += "<div id='selector_" + sortingData[name].filename + "' value='" + sortingData[name].filename + "' class='selectDiv' style='height:14px;'>";
						temp += "<div style='float:left;'>";
						temp += "<input type='checkbox' name='"+sortingData[name].filename+"' projectPath='"+sortingData[name].author+"_"+sortingData[name].name+"' projectName='"+sortingData[name].name+"' projectType='"+sortingData[name].type+"'";
						
						if (sortingData[name].filename == core.currentProjectPath) {
							temp += "checked";
						}
						
						temp += "></div> ";
						temp += "<div style='float:left; padding-top:1px; padding-left:5px;'>" + sortingData[name].filename + "</div>";
						temp += "</div>";
		
						$("#buildProjectList").append(temp);
						
						$("#selector_" + sortingData[name].filename).click(function () {
							$(this).find("input").attr("checked", !$(this).find("input").attr("checked"));
						});
					}
				}
			}		
		});
	}
};