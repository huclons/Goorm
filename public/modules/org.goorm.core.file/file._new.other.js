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
org.goorm.core.file._new.other = function () {
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
	
	this.isNewAnyway = null;
};

org.goorm.core.file._new.other.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor
	 **/
	init: function () {
		
		var self = this;
				
		var handleCreate = function() { 
			
			if($("#newOtherFileNewInput").val() == "") {
				alert.show(core.localization.msg["alertFileNameEmpty"]);
				return false;
			}
			
			var tempFilePath = $("#newOtherFileCurrentPath").text();
			var tempFileName = $("#newOtherFileNewInput").val();

			$.ajax({
				url: "file/get_contents",			
				type: "GET",
				data: { path: "../../project/"+tempFilePath+tempFileName},
				success: function(data) {
					if (data!=0 && !self.isNewAnyway) {
						confirmation.init({
							title: core.localization.msg["confirmationNewOtherTitle"], 
							message: core.localization.msg["confirmationNewOtherMessage"],
							yesText: core.localization.msg["confirmationYes"],
							noText: core.localization.msg["confirmationNo"],
							yes: function () {
								self.isNewAnyway = true;
								handleCreate();
							}, no: function () {
							}
						});
						
						confirmation.panel.show();
						return false;
					}
					
					var postdata = {
						url: $("#newOtherFileList").find(".selectedButton").attr("url"),
						newOtherFileNewInput: $("#newOtherFileCurrentPath").text()+$("#newOtherFileNewInput").val()
					};
													
					$.post("file/new", postdata, function (data) {

						var receivedData = eval("("+data+")");
		
						if(receivedData.errCode==0) {
						
							var windowManager = core.mainLayout.workSpace.windowManager;
							
							tempFilePath = "../../project/"+tempFilePath;
							tempFilePath = tempFilePath.replace("//", "/");
							
							for (var i = 0; i < windowManager.index; i++) {
								var windowFileName = windowManager.window[i].filename;
								var windowFilePath = windowManager.window[i].filepath;
								windowFilePath = windowFilePath + "/";
								windowFilePath = windowFilePath.replace("//", "/");
								
								if( windowManager.window[i].alive && windowFileName == tempFileName && windowFilePath == tempFilePath) {
									windowManager.window[i].close();
								}
							}
							
							var tempType = tempFileName;
							tempType = tempType.split(".");
							tempType = tempType[1];

							core.mainLayout.workSpace.windowManager.open(tempFilePath, tempFileName, tempType);
							core.mainLayout.projectExplorer.refresh();
						}
						else {
							alert.show(core.localization.msg["alertError"] + receivedData.message);
						}
						self.dialog.panel.hide(); 
					});
				}
			});
		};

		var handleCancel = function() { 
			this.hide(); 
		};
		
		this.buttons = [ {text:"Create", handler:handleCreate, isDefault:true},
						 {text:"Cancel",  handler:handleCancel}]; 
						 
		this.dialog = new org.goorm.core.file._new.other.dialog();
		this.dialog.init({
			title:"New Other File", 
			path:"configs/dialogs/org.goorm.core.file/file._new.other.html",
			width:400,
			height:400,
			modal:false,
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
	show: function (context) {
	
		var self = this;
	
		this.isNewAnyway = false;
	
		this.dialog.panel.show();

		$(".selectDiv").click(function() {
			$(".selectDiv").removeClass("selectedButton");
			$(this).addClass("selectedButton");
	
		});

		$("#newOtherFileCurrentPath").empty();
		
		var tempPath = "";

		if (context) {
			var filename = (core.selectedFile.split("/")).pop();
			var filepath = 	core.selectedFile.replace(filename, "");
			
			tempPath = filepath;
			
			this.dialog.panel.show();
		}
		else {
			if (core.currentProjectPath=="./") {
				tempPath = "/";
			}
			else {
				tempPath = core.currentProjectPath+"/";
			}
			
			this.dialog.panel.show();
		}
		
		$("#newOtherFileCurrentPath").width(tempPath.length*6);
		$("#newOtherFileNewInput").width(305-(tempPath.length*6));
		
		$("#newOtherFileCurrentPath").append(tempPath);
		
		//글자당 6px
		
		

	}
};