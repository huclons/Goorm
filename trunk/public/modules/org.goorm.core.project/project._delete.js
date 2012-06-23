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
 * @class delete
 * @extends project
 **/
org.goorm.core.project._delete = function () {
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

org.goorm.core.project._delete.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor
	 **/
	init: function () {
		
		var self = this;
				
		var handleDelete = function() { 
		this.hide(); 
			// project delete
			if ($("#projectDeleteProjectPath").attr("value")=="Not selected") {
				alert.show(core.localization.msg["alertProjectNotSelected"]);
				return false;
			}

			var postdata = {
				projectPath: $("#projectDeleteProjectPath").attr("value")
			};
			
			$.post("project/delete", postdata, function (data) {
				var receivedData = eval("("+data+")");
				
				if(receivedData.errCode==0) {
					if ( postdata.projectPath == core.currentProjectPath ) {
						core.currentProjectPath = "";
						core.currentProjectName = "";
						core.currentProjectType = "";
					}
				}
				else {
					alert.show(core.localization.msg["alertError"] + receivedData.message);
				}
				
				core.mainLayout.projectExplorer.refresh();
				core.dialogProjectProperty.refreshToolBox();
			});
			
			this.hide(); 
		};

		var handleCancel = function() { 
			
			this.hide(); 
		};
		
		this.buttons = [ {text:"Delete", handler:handleDelete, isDefault:true},
						 {text:"Cancel",  handler:handleCancel}]; 
						 
		this.dialog = new org.goorm.core.project._delete.dialog();
		this.dialog.init({
			title:"Delete Project", 
			path:"configs/dialogs/org.goorm.core.project/project._delete.html",
			width:800,
			height:500,
			modal:true,
			buttons:this.buttons,
			success: function () {
				var resize = new YAHOO.util.Resize("projectDeleteDialogLeft", {
		            handles: ['r'],
		            minWidth: 250,
		            maxWidth: 400
		        });
				
		        resize.on('resize', function(ev) {
					var width = $("#projectDeleteDialogMiddle").width();
		            var w = ev.width;
		            $("#projectDeleteDialogCenter").css('width', (width - w - 9) + 'px');
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
		$("#projectDeleteType").val("All");
		$("#projectDeleteLocation").val("");
		$("#projectDeleteProjectInformation").empty();
		this.dialog.panel.show();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method addProjectList 
	 **/	
	addProjectList: function () {
		$("#projectDeleteList").empty();
			
		$.post("project/get_list", "", function (data) {
						
			var sortingData = eval(data);
			
			for(var name in sortingData) {
				var iconStr = "";
				iconStr += "<div id='selector_" + sortingData[name].filename + "' value='" + sortingData[name].filename + "' class='selector_project' type='"+sortingData[name].type+"'>";
				iconStr += "<div style='white-space:nowrap; overflow:hidden; text-overflow:ellipsis; padding-left:65px; padding-top:20px;'>";
				iconStr += sortingData[name].filename;
				iconStr += "</div>";
				iconStr += "</div>";
	
				$("#projectDeleteList").append(iconStr);
			}
			
			$(".selector_project").click(function() {
				$(".selector_project").removeClass("selectedButton");
				$(this).addClass("selectedButton");
				
				$("#projectDeleteProjectPath").attr("value", $(this).attr("value"));
				$("#projectDeleteLocation").attr("value", "/" + $(this).attr("value") + "/");

				$.ajax({
					type: "GET",
					dataType: "xml",
					async :false,
					url: "project/" +  $(this).attr("value") + "/project.xml",
					success: function(xml) {
						$("#projectDeleteProjectInformation").empty();
						$("#projectDeleteProjectInformation").append("<b>Project Type : </b>");
						$("#projectDeleteProjectInformation").append($(xml).find("TYPE").text()+"<br/>");
						$("#projectDeleteProjectInformation").append("<b>Project detailed Type : </b>");
						$("#projectDeleteProjectInformation").append($(xml).find("DETAILEDTYPE").text()+"<br/>");
						$("#projectDeleteProjectInformation").append("<b>Project Author : </b>");
						$("#projectDeleteProjectInformation").append($(xml).find("AUTHOR").text()+"<br/>");
						$("#projectDeleteProjectInformation").append("<b>Project Name : </b>");
						$("#projectDeleteProjectInformation").append($(xml).find("NAME").text()+"<br/>");
						$("#projectDeleteProjectInformation").append("<b>Project About : </b>");
						$("#projectDeleteProjectInformation").append($(xml).find("ABOUT").text()+"<br/>");
						$("#projectDeleteProjectInformation").append("<b>Project Date : </b>");
						$("#projectDeleteProjectInformation").append($(xml).find("DATE").text()+"<br/>");
						
						$("#projectDeleteProjectName").attr("value", $(xml).find("NAME").text());
						$("#projectDeleteProjectType").attr("value", $(xml).find("TYPE").text());
					}
					, error: function(xhr, status, error) {alert.show(core.localization.msg["alertError"] + error);}
				});
			});
		});
	},
	
	addProjectItem: function() {
		$("div[id='project.delete']").find("#projectDeleteType").append("<option value='All'>All Project</option>");
		$("div[id='project.delete']").find("#projectDeleteType").append("<option value='goorm'>goorm Project</option>");
		
		$("#projectDeleteType").change(function() {
			var type = $("#projectDeleteType option:selected").val();
			if(type=="All") {
				$("div[id='project.delete']").find(".selector_project").each(function() {
					$(this).css("display", "block");
				});
			}
			else {
				$("div[id='project.delete']").find(".selector_project").each(function() {
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