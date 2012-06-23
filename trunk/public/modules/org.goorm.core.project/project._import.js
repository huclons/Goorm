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
 * @class _import
 * @extends file
 **/
org.goorm.core.project._import = function () {
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
	 * @property treeView
	 **/
	this.treeView = null;
	
	/**
	 * This presents the current browser version
	 * @property filepath
	 **/
	this.currentPath = null;
};

org.goorm.core.project._import.prototype = {
	
	/**
	 * This function is an goorm core initializating function.
	 * @constructor
	 **/
	init: function () { 
		
		var self = this;
		
		var handleOk = function() {
			if($("#projectImportFile").attr("value").substr($("#projectImportFile").attr("value").length-3,3).toLowerCase()!="zip") {
				alert.show(core.localization.msg["alertOnlyZipAllowed"]);
				return false;
			}
		
			$("#projectImportInputLocationPath").val(self.currentPath);
			$('#projectImportMyForm').submit();
			this.hide(); 
		};

		var handleCancel = function() { 
			
			this.hide(); 
		};
		
		this.buttons = [ {text:"OK", handler:handleOk, isDefault:true},
						 {text:"Cancel",  handler:handleCancel}]; 
						 
		this.dialog = new org.goorm.core.project._import.dialog();
		this.dialog.init({
			title:"Import Project", 
			path:"configs/dialogs/org.goorm.core.project/project._import.html",
			width:800,
			height:500,
			modal:true,
			buttons:this.buttons,
			kind:"import",
			success: function () {
				var resize = new YAHOO.util.Resize("projectImportDialogLeft", {
		            handles: ['r'],
		            minWidth: 200,
		            maxWidth: 400
		        });
				
		        resize.on('resize', function(ev) {
					var width = $("#projectImportDialogMiddle").width();
		            var w = ev.width;
		            $("#projectImportDialogCenter").css('width', (width - w - 9) + 'px');
		        });
		        			
				var formOptions = {
					target: "#projectImportUploadOutput",
					success: function(data) {
						notice.show(core.localization.msg["noticeProjectImportDone"]);
						core.mainLayout.projectExplorer.refresh();
					}
				}
	            $('#projectImportMyForm').ajaxForm(formOptions);
				
				$('#projectImportMyForm').submit(function() { 
				    // submit the form 
				    $(this).ajaxSubmit(); 
				    // return false to prevent normal browser submit and page navigation 
				    return false; 
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
		$("#projectImportUploadOutput").empty();
		$("#projectImportFile").val("");
	this.refreshAll();
		this.dialog.panel.show();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method addDirectories 
	 **/	
	addDirectories: function(postdata) {		
		var self = this;

		$.post("file/get_nodes", postdata, function (data) {
			var sortProjectTreeview = function (sortingData) { 				
				s.quickSort(sortingData);
				
				for(i=0; i<sortingData.length; i++) {
					if(sortingData[i].children) {
						s.quickSort(sortingData[i].children);
					}
				}
			};

			var sortingData = eval(data);
			
			sortProjectTreeview(sortingData);

			self.treeView = new YAHOO.widget.TreeView("projectImportTreeview", sortingData);
		    
			self.treeView.subscribe("clickEvent", function(nodedata) {	
				if(nodedata.node.data.cls == "folder") {
					var filename = nodedata.node.data.filename;
					var filetype = nodedata.node.data.filetype;
					var filepath = nodedata.node.data.parentLabel;

					var dir = filepath + "/" + filename;
					dir = dir.replace(/\.\.\/\.\.\/project\/\//, "");
					dir = dir.replace(/\.\.\/\.\.\/project\//, "");
					dir = "/" + dir;
					dir = dir.replace(/\/\/\//, "/");
					dir = dir.replace(/\/\//, "/");
						
					self.currentPath = dir;
					
					$("#projectImportInputLocationPath").attr("value", self.currentPath);

					var postdata = {
						kind: "project",
						projectName: self.currentPath,
						folderOnly: "false"
					};

					self.addFileItems(postdata);
				}
				
				return false;
			});

			self.treeView.subscribe("dblClickEvent", function(nodedata) {	
				if(nodedata.node.data.cls == "folder") {
					if (nodedata.node.expanded) {
						nodedata.node.collapse();
					}
					else { 
						nodedata.node.expand();
					}
				}
			});
						
			self.treeView.render();
			
			self.treeExpandComplete();
			
			self.treeView.subscribe("expandComplete", function () {
				self.treeExpandComplete();	
			});
			
			if (self.currentPath == "") {
				$("#projectImportTreeview").find(".ygtvdepth0").find(".ygtvcell").prev().addClass("ygtvfocus");
				$("#projectImportTreeview").find(".ygtvdepth0").find(".ygtvcell").addClass("ygtvfocus");
			}

			
		});
	},

	/**
	 * This function is an goorm core initializating function.  
	 * @method expandDirectory
	 **/	
	expandDirectory: function (directory) {
				
		$("#projectImportTreeview").find(".ygtvfocus").parent().parent().parent().parent().find(".ygtvcell").each(function () {
			if ($(this).find(".fullpath").text().split("/").pop() == directory) {
				$("#projectImportTreeview").find(".ygtvfocus").removeClass("ygtvfocus");
				
				$(this).prev().addClass("ygtvfocus");
				$(this).addClass("ygtvfocus");
			}
		});

		this.treeView.getNodeByElement($("#projectImportTreeview").find(".ygtvfocus")[0]).expand();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method treeExpandComplete
	 **/	
	treeExpandComplete: function () {
		$("#projectImportTreeview").find(".ygtvcell").unbind("mousedown");		
		$("#projectImportTreeview").find(".ygtvcell").mousedown(function (e) {
			if ($(this).hasClass("ygtvfocus") == false) {
				$("#projectImportTreeview").find(".ygtvfocus").removeClass("ygtvfocus");
				
				if ($(this).hasClass("ygtvcontent")) {
					$(this).prev().addClass("ygtvfocus");
					$(this).addClass("ygtvfocus");
				}		
	
			}
		});	
	},
	
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method addFileItems
	 **/	
	addFileItems: function (postdata) {
	
		$("#projectImportDialogCenter").empty();
	
		var self = this;
		
		$.post("file/get_nodes", postdata, function (data) {
			var sortProjectTreeview = function (sortingData) { 				
				s.quickSort(sortingData);
			};

			var sortingData = eval(data);
			
			sortProjectTreeview(sortingData);
			
			for(var name in sortingData) {
				var iconStr = "";
				if(sortingData[name].cls=="folder") {
					iconStr += "<div class='folderitem'";
				}
				else {
					iconStr += "<div class='fileitem'";
				}
				
				iconStr +=" filename='"+sortingData[name].filename+"' filetype='"+sortingData[name].filetype+"' filepath='"+sortingData[name].parentLabel+"'>";
				if(sortingData[name].cls=="folder") {
					iconStr += "<img src='images/org.goorm.core.file/folder.png'>";
				}
				else {
					iconStr += "<img src='images/org.goorm.core.file/file.png'>";
				}
				iconStr += "<div style='word-break:break-all; word-wrap: break-word; width:60px; line-height:12px; margin-left:5px; margin-right:5px; margin-bottom:5px;'>";
				iconStr += sortingData[name].filename;
				iconStr += "</div>";
				iconStr += "</div>";
				
				$("#projectImportDialogCenter").append(iconStr);
			}
			

			$("#projectImportDialogMiddle").find(".folderitem").dblclick(function() {

				if (self.currentPath == "/")	self.currentPath = "";
				self.currentPath = self.currentPath+"/"+$(this).attr("filename");
				$("#projectImportInputLocationPath").val(self.currentPath);

				var postdata = {
					kind: "project",
					projectName: self.currentPath,
					folderOnly: "false"
				};

				self.addFileItems(postdata);
				self.expandDirectory($(this).attr("filename"));
			});
			

			$("#projectImportDialogMiddle").find(".fileitem").click(function() {
				$("#projectImportDialogMiddle").find(".fileitem").removeClass("selectedItem");
				$("#projectImportDialogMiddle").find(".folderitem").removeClass("selectedItem");
				$(this).addClass("selectedItem");
			});
			
			$("#projectImportDialogMiddle").find(".folderitem").click(function() {
				$("#projectImportDialogMiddle").find(".fileitem").removeClass("selectedItem");
				$("#projectImportDialogMiddle").find(".folderitem").removeClass("selectedItem");
				$(this).addClass("selectedItem");
			});			
		});
	},
	
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method refreshAll
	 **/	
	refreshAll: function () {
		this.currentPath = "/"+core.currentProjectPath;
		
		$("#projectImportInputLocationPath").val(this.currentPath);
								
		var postdata = {
			kind: "project",
			projectName: this.currentPath,
			folderOnly: "true"
		};

		this.addDirectories(postdata);
		
		postdata = {
			kind: "project",
			projectName: this.currentPath,
			folderOnly: "false"
		};

		this.addFileItems(postdata);
	}
};