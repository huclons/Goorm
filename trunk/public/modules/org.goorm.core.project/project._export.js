/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module file
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class _export
 * @extends file
 **/
org.goorm.core.project._export = function () {
	/**
	 * This presents the current browser version
	 * @property dialog
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
	 **/
	this.tabView = null;
	
	/**
	 * This presents the current browser version
	 * @property treeView
	 **/
	this.treeView = null;	
};

org.goorm.core.project._export.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor
	 **/
	init: function () { 
	
		var self = this;
		
		var handleOk = function() { 

			if ($("#projectExportProjectPath").attr("value")=="Not selected") {
				alert.show(core.localization.msg["alertProjectNotSelected"]);
				return false;
			}

			var postdata = {
				selectProjectName: $("#projectExportProjectName").attr("value"),
				selectProjectPath: $("#projectExportProjectPath").attr("value"),
				projectExportType: $("#projectExportDataType").attr("value")
			};
			
			console.log(postdata);
						
			$.post("project/export", postdata, function (data) {
				var receivedData = eval("("+data+")");

				if(receivedData.errCode==0) {
					location.href=receivedData.downloadPath;
					setTimeout(function() {
						core.mainLayout.projectExplorer.refresh();
					}, 50);
				}

			});
		
			//
			this.hide(); 
		};

		var handleCancel = function() { 
			
			this.hide(); 
		};
		
		this.buttons = [ {text:"OK", handler:handleOk, isDefault:true},
						 {text:"Cancel",  handler:handleCancel}]; 
						 
		this.dialog = new org.goorm.core.project._export.dialog();
		this.dialog.init({
			title:"Export", 
			path:"configs/dialogs/org.goorm.core.project/project._export.html",
			width:800,
			height:500,
			modal:true,
			yesText:"Open",
			noText:"Cancel",
			buttons:this.buttons,
			success: function () {
				var resize = new YAHOO.util.Resize("projectExportDialogLeft", {
		            handles: ['r'],
		            minWidth: 250,
		            maxWidth: 400
		        });
				
		        resize.on('resize', function(ev) {
					var width = $("#projectExportDialogMiddle").width();
		            var w = ev.width;
		            $("#projectExportDialogCenter").css('width', (width - w - 9) + 'px');
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
		console.log("project export");
		this.addProjectList();
		$("#projectExportType").val("All");
		$("#projectExportLocation").val("");
		$("#projectExportProjectInformation").empty();
		$("div[id='projectExport']").find("#projectExportDialogLeft").scrollTop(0);
		this.dialog.panel.show();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method addProjectList 
	 **/	
	addProjectList: function () {
		$("#projectExportProjectList").empty();
	
		$.post("project/get_list", "", function (data) {
			
			var sortingData = eval(data);
			
			for(var name in sortingData) {
				var iconStr = "";
				iconStr += "<div id='selector_" + sortingData[name].filename + "' value='" + sortingData[name].filename + "' class='selector_project'>";
				iconStr += "<div style='white-space:nowrap; overflow:hidden; text-overflow:ellipsis; padding-left:65px; padding-top:20px;'>";
				iconStr += sortingData[name].filename;
				iconStr += "</div>";
				iconStr += "</div>";
	
				$("#projectExportProjectList").append(iconStr);
			}
			
			
			$(".selector_project").click(function() {
				$("#projectExportProjectName").attr("value", "");
				$("#projectExportProjectPath").attr("value", "");
			
				$(".selector_project").removeClass("selectedButton");
				$(this).addClass("selectedButton");
				
				$("#projectExportProjectPath").attr("value", $(this).attr("value"));
				$("#projectExportLocation").attr("value", "/" + $(this).attr("value") + "/");

				$.ajax({
					type: "GET",
					dataType: "xml",
					async :false,
					url: "project/"+$(this).attr("value")+"/project.xml",
					success: function(xml) {
						$("#projectExportProjectInformation").empty();
						$("#projectExportProjectInformation").append("<b>project Type : </b>");
						$("#projectExportProjectInformation").append($(xml).find("TYPE").text()+"<br/>");
						$("#projectExportProjectInformation").append("<b>project Author : </b>");
						$("#projectExportProjectInformation").append($(xml).find("AUTHOR").text()+"<br/>");
						$("#projectExportProjectInformation").append("<b>project Name : </b>");
						$("#projectExportProjectInformation").append($(xml).find("NAME").text()+"<br/>");
						$("#projectExportProjectInformation").append("<b>project About : </b>");
						$("#projectExportProjectInformation").append($(xml).find("ABOUT").text()+"<br/>");
						$("#projectExportProjectInformation").append("<b>project Date : </b>");
						$("#projectExportProjectInformation").append($(xml).find("DATE").text()+"<br/>");
						
						$("#projectExportProjectName").attr("value", $(xml).find("NAME").text());
					}
					, error: function(xhr, status, error) {alert.show(core.localization.msg["alertError"] + error);}
				});
			});
		});
	},
	
	addProjectItem: function() {
		$("div[id='projectExport']").find("#projectExportType").append("<option value='All'>All Project</option>");
		$("div[id='projectExport']").find("#projectExportType").append("<option value='goorm'>goorm Project</option>");
		
		$("#projectExportType").change(function() {
			var type = $("#projectExportType option:selected").val();
			if(type=="All") {
				$("div[id='projectExport']").find(".selector_project").each(function() {
					$(this).css("display", "block");
				});
			}
			else {
				$("div[id='projectExport']").find(".selector_project").each(function() {
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