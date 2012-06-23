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
 * @class _new
 * @extends project
 **/
org.goorm.core.project._new = function () {
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
	 * @property dialog
	 * @type Object
	 * @default null
	 **/
	this.tabView = null;
};

org.goorm.core.project._new.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 **/
	init: function () { 
		var self = this;
		
		var handleOk = function() {
			// project create
			if ($("#inputProjectType").attr("value")=="") {
				alert.show(core.localization.msg["alertProjectType"]);
				return false;
			}
			else if ($("#inputProjectSource").attr("value")=="") {
				alert.show(core.localization.msg["alertProjectSource"]);
				return false;
			}
			else if ($("#inputProjectDetailedType").attr("value")=="") {
				alert.show(core.localization.msg["alertProjectDetailedType"]);
				return false;
			}
			else if ($("#inputProjectAuthor").attr("value")=="") {
				alert.show(core.localization.msg["alertProjectAuthor"]);
				return false;
			}
			else if ($("#inputProjectName").attr("value")=="") {
				alert.show(core.localization.msg["alertProjectName"]);
				return false;
			}
			else if ($("#inputProjectAbout").attr("value")=="") {
				alert.show(core.localization.msg["alertProjectAbout"]);
				return false;
			}
			else if ($("#checkProjectNewImport").is(":checked")) {
				if($("#projectNewImportFile").attr("value").substr($("#projectNewImportFile").attr("value").length-3,3).toLowerCase()!="zip") {
					alert.show(core.localization.msg["alertOnlyZipAllowed"]);
					return false;
				}
			}
			else if (!/^[\w-]*$/.test($("#inputProjectAuthor").attr("value"))) {
				alert.show(core.localization.msg["alertAllowCharacter"]);
				return false;
			}
			else if (!/^[\w-]*$/.test($("#inputProjectName").attr("value"))) {
				alert.show(core.localization.msg["alertAllowCharacter"]);
				return false;
			}


			if ($("#newProjectUsingPlugin").val() == "yes") {			
				var postdata = {
					projectNewSVNURL: $("#projectNewSVNURL").attr("value"),
					projectNewSVNID: $("#projectNewSVNID").attr("value"),
					projectNewSVNPW: $("#projectNewSVNPW").attr("value"),
					projectNewSVNSavePW: $("#projectNewSVNSavePW").is(":checked")									
				}
				
				var inputProjectType = $("#inputProjectType").attr("value");
				var inputProjectDetailedType = $("#inputProjectDetailedType").attr("value");
				var inputProjectAuthor = $("#inputProjectAuthor").attr("value");
				var inputProjectName = $("#inputProjectName").attr("value");
				
				core.currentProjectPath = inputProjectAuthor+"_"+inputProjectName;
				core.currentProjectName = inputProjectName;
				core.currentProjectType = inputProjectType;
				
				core.pluginManager.newProject(inputProjectName, inputProjectAuthor, inputProjectType, inputProjectDetailedType, inputProjectAuthor+"_"+inputProjectName, postdata);
			}
			else {
				var postdata = {
					inputProjectType: $("#inputProjectType").attr("value"),
					inputProjectDetailedType: $("#inputProjectDetailedType").attr("value"),
					inputProjectAuthor: $("#inputProjectAuthor").attr("value"),
					inputProjectName: $("#inputProjectName").attr("value"),
					inputProjectAbout: $("#inputProjectAbout").attr("value"),
					inputUseCollaboration: $("#checkUseCollaboration").attr("checked")
				};
				
				$.post("project/new", postdata, function (data) {
					var receivedData = eval("("+data+")");
					
					if(receivedData.errCode==0) {
					
						core.currentProjectPath = receivedData.author+"_"+receivedData.projectName;
						core.currentProjectName = receivedData.projectName;
						core.currentProjectType = receivedData.type;
	
	
						core.dialogOpenProject.open(core.currentProjectPath, core.currentProjectName, core.currentProjectType);
						
						if(!$("#checkProjectNewImport").is(":checked")) {
							
							var inputProjectType = $("#inputProjectType").attr("value");
							var inputProjectDetailedType = $("#inputProjectDetailedType").attr("value");
							var inputProjectAuthor = $("#inputProjectAuthor").attr("value");

							core.pluginManager.newProject(core.currentProjectName, postdata.inputProjectAuthor, postdata.inputProjectType, postdata.inputProjectDetailedType, core.currentProjectPath);
						}
						else {
							//여기서 전용 로딩중을 알림
							core.loadingBar.startLoading("Import processing...");
							$('#projectNewImportForm').submit();
						}

						
						// core.mainLayout.projectExplorer.refresh();
						// core.mainLayout.refreshConsole();
						// core.dialogProjectProperty.refreshToolBox();
						// $("a[action=showProperties]").removeClass('yuimenuitemlabel-disabled');
						// $("a[action=showProperties]").parent().removeClass('yuimenuitem-disabled');
						// var str = core.currentProjectPath;
						// str.replace(".","");
						// str.replace("#","");
// 						
						// core.mainLayout.showChat(str);
					}
					else {
						alert.show(core.localization.msg["alertError"] + receivedData.message);
						return false;
					}
				});				
			}
			
			this.hide(); 
		};

		var handleCancel = function() { 
			
			this.hide(); 
		};
		
		this.buttons = [ {text:"OK", handler:handleOk, isDefault:true},
						 {text:"Cancel",  handler:handleCancel}]; 
						 
		this.dialog = new org.goorm.core.project._new.dialog();
		this.dialog.init({
			title:"New Project", 
			path:"configs/dialogs/org.goorm.core.project/project._new.html",
			width:800,
			height:500,
			modal:true,
			buttons:this.buttons,
			success: function () {
				self.addProjectItem();
				
				var formOptions = {
					target: "#projectNewImportUploadOutput",
					success: function(data) {
						core.mainLayout.projectExplorer.refresh();
						core.mainLayout.refreshConsole();
						core.dialogProjectProperty.refreshToolBox();
						core.loadingBar.stopLoading();
						//여기서 전용 로딩중을 뺌
					}
				}
	            //$('#projectNewImportForm').ajaxForm(formOptions);
				
				$('#projectNewImportForm').submit(function() { 
				    // submit the form 
				    $(this).ajaxSubmit(); 
				    // return false to prevent normal browser submit and page navigation 
				    return false; 
				});
				
				$("#checkProjectNewImport").click(function() {
					if($(this).is(":checked")) {
						$("#projectNewImportDiv").css("display", "block");
					}
					else {
						$("#projectNewImportDiv").css("display", "none");
					}
				});
				
			},		
			kind:"newProject"
		});
				
		this.dialog = this.dialog.dialog;
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method show 
	 **/
	show: function () {
		//count the total step of wizard dialog 
		this.dialog.totalStep = $("div[id='projectNew']").find(".wizardStep").size();
		
		// Add click event on dialog select item
		$(".projectWizardFirstButton").click(function () {
			$(".projectWizardSecondButton").removeClass("selectedButton");
			
			$("#inputProjectType").attr("value", "");
			$("#inputProjectDetailedType").attr("value", "");
			
			$("#textProjectDescription").empty();
		
			$(".projectWizardFirstButton").removeClass("selectedButton");
			$(this).addClass("selectedButton");
						
			$(".all").css("display", "none");
			$("."+$(this).attr("project-type")).css("display", "block");
		});
		
		$(".projectWizardSecondButton").click(function () {
			$(".projectWizardSecondButton").removeClass("selectedButton");
			$(this).addClass("selectedButton");
			
			$("#inputProjectType").attr("value", "");
			$("#inputProjectDetailedType").attr("value", "");
			
			$("#inputProjectType").attr("value", $(this).attr("projecttype"));
			$("#inputProjectDetailedType").attr("value", $(this).text());
			
			$("#textProjectDescription").empty();
			$("#textProjectDescription").append($(this).attr('description'));
			
			
			var self = this;
			$("#newProjectExpansionContainer").children().each(function (i) {
				if ($(this).attr("expansion") == $(self).attr("expansion")) {
					$(this).css("display", "block");
				}
				else {
					$(this).css("display", "none");
				}
			});
		});
		
		//for init
		$(".projectWizardSecondButton").removeClass("selectedButton");
		$(".projectWizardSecondButton").removeClass("selectedButton");
		$("#inputProjectType").attr("value","");
		$("#inputProjectDetailedType").val("");
		$("#inputProjectAuthor").val(core.firstName+"_"+core.lastName);
		$("#inputProjectName").val("");
		$("#inputProjectAbout").val("");
		$("#projectNewImportUploadOutput").empty();
		$("#projectNewImportFile").val("");
		$("#checkProjectNewImport").attr('checked', "");
		$("#checkUseCollaboration").attr('checked', "");
		
		$("div[id='projectNew']").find(".projectTypes").scrollTop(0);
		$("div[id='projectNew']").find(".projectItems").scrollTop(0);
		
		this.dialog.showFirstPage();
		
		this.dialog.panel.show();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method addProjectItem
	 **/
	addProjectItem: function () {
		// for step 1
		$("div[id='projectNew']").find(".projectTypes").append("<div class='projectWizardFirstButton' project-type='all'><div class='projectTypeIcon'><img src='images/org.goorm.core.project/project.png' class='projectIcon' /></div><div class='projectTypeTitle'>All</div><div class='projectTypeDescription'>View all available project items (including plugins)</div></div>");

		$("div[id='projectNew']").find(".projectTypes").append("<div class='projectWizardFirstButton' project-type='goormp'><div class='projectTypeIcon'><img src='images/org.goorm.core.project/goormProject.png' class='projectIcon' /></div><div class='projectTypeTitle'>goorm Project</div><div class='projectTypeDescription'>goorm3 Project Customization/Plugin/Theme</div></div>");
		
		$("div[id='projectNew']").find(".projectItems").append("<div class='projectWizardSecondButton all goormp' description=' Create New goorm Customization Project' projecttype='goorm'><img src='images/org.goorm.core.project/customization.png' class='projectItemIcon' /><br /><a>goorm Customization</a></div>");
		$("div[id='projectNew']").find(".projectItems").append("<div class='projectWizardSecondButton all goormp' description=' Create New goorm Plugin' projecttype='goorm'><img src='images/org.goorm.core.project/plugin.png' class='projectItemIcon' /><br /><a>goorm Plugin</a></div>");
		$("div[id='projectNew']").find(".projectItems").append("<div class='projectWizardSecondButton all goormp' description=' Create New goorm Theme' projecttype='goorm'><img src='images/org.goorm.core.project/theme.png' class='projectItemIcon' /><br /><a>goorm Theme</a></div>");
	}	
};