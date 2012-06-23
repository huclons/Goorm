/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module menu
 **/

/**
 * This is an goorm code generator.
 * goorm starts with this code generator.
 * @class action
 * @extends menu
 **/
org.goorm.core.menu.action = function() {

};

org.goorm.core.menu.action.prototype = {

	/**
	 * This function is an goorm core initializating function.
	 * @constructor
	 **/
	init : function() {

		//////////////////////////////////////////////////
		//Main Menu : File
		//////////////////////////////////////////////////
		$("a[action=newProject]").unbind("click");
		$("a[action=newProject]").click(function() {
			core.dialogNewProject.show();
			$(".projectWizardFirstButton[project-type=all]").trigger("click");
		});

		$("a[action=newFile_goormProject]").unbind("click");
		$("a[action=newFile_goormProject]").click(function() {
			core.dialogNewProject.show();
			$(".projectWizardFirstButton[project-type=goormp]").trigger("click");
		});

		$("a[action=newFile_file]").unbind("click");
		$("a[action=newFile_file]").click(function() {
			core.dialogNewFile.show("");
		});

		$("a[action=newFile_folder]").unbind("click");
		$("a[action=newFile_folder]").click(function() {
			core.dialogNewFolder.show("");
		});

		$("a[action=newFile_textFile]").unbind("click");
		$("a[action=newFile_textFile]").click(function() {
			core.dialogNewUntitledTextFile.show("");
		});

		$("a[action=newFile_other]").unbind("click");
		$("a[action=newFile_other]").click(function() {
			core.dialogNewOtherFile.show("");
		});

		$("a[action=openProject]").unbind("click");
		$("a[action=openProject]").click(function() {
			core.dialogOpenProject.show();
		});

		$("a[action=openFile]").unbind("click");
		$("a[action=openFile]").click(function() {
			core.dialogOpenFile.show();
		});

		$("a[action=exit]").unbind("click");
		$("a[action=exit]").click(function() {

			confirmation.init({
				title : "Do you want exit?",
				message : "Do you want exit?",
				yesText : "Yes",
				noText : "No",
				yes : function() {

				},
				no : function() {

				}
			});

			confirmation.panel.show();
		});

		$("a[action=openURL]").unbind("click");
		$("a[action=openURL]").click(function() {
			core.dialogOpenURL.show();
		});

		$("a[action=closeFile]").unbind("click");
		$("a[action=closeFile]").click(function() {
			var windowManager = core.module.layout.workSpace.windowManager;

			if(windowManager.window[windowManager.activeWindow]) {
				windowManager.window[windowManager.activeWindow].close();
			}
		});

		$("a[action=closeAll]").unbind("click");
		$("a[action=closeAll]").click(function() {
			core.module.layout.workSpace.windowManager.closeAll();
		});

		$("a[action=saveFile]").unbind("click");
		$("a[action=saveFile]").click(function() {
			var windowManager = core.module.layout.workSpace.windowManager;

			if (windowManager.activeWindow<0) {
				alert.show(core.localization.msg.alertFileNotOpened);
			}
			else {
				if(windowManager.window[windowManager.activeWindow].designer != undefined) {
					windowManager.window[windowManager.activeWindow].designer.save();
				} else if(windowManager.window[windowManager.activeWindow].editor != undefined) {
					windowManager.window[windowManager.activeWindow].editor.save();
				}
			}
		});

		$("a[action=saveAllFile]").unbind("click");
		$("a[action=saveAllFile]").click(function() {
			core.module.layout.workSpace.windowManager.saveAll();
		});

		$("a[action=saveAsFile]").unbind("click");
		$("a[action=saveAsFile]").click(function() {
			core.dialogSaveAsFile.show();
		});

		$("a[action=moveFile]").unbind("click");
		$("a[action=moveFile]").click(function() {
			core.dialogMoveFile.show("");
		});

		$("a[action=renameFile]").unbind("click");
		$("a[action=renameFile]").click(function() {
			core.dialogRenameFile.show();
		});

		$("a[action=deleteFile]").unbind("click");
		$("a[action=deleteFile]").click(function() {
			if(core.seletedFile) {
				confirmation.init({
					title : "Delete",
					message : "Do you want to delete this file?",
					yesText : "Yes",
					noText : "No",
					yes : function() {
						var postdata = {
							fileName : core.selectedFile
						};
	
						$.get("file/do_delete", postdata, function(data) {
							c.m("delete: " + core.selectedFile);
							core.module.layout.projectExplorer.refresh();
						});
					},
					no : function() {
						confirmation.panel.hide();
					}
				});
	
				confirmation.panel.show();
			}

		});

		$("a[action=refreshProjectDirectory]").unbind("click");
		$("a[action=refreshProjectDirectory]").click(function() {
			core.module.layout.projectExplorer.refresh();
		});

		$("a[action=print]").unbind("click");
		$("a[action=print]").click(function() {

			core.dialogPrint.show();

			//window.open("./module/org.goorm.core.printer/print.html", "", "width=500, height=300, scrollbars=yes");
		});

		$("a[action=switchWorkspace]").unbind("click");
		$("a[action=switchWorkspace]").click(function() {
			core.dialogSwitchWorkspace.show();
		});

		$("a[action=importFile]").unbind("click");
		$("a[action=importFile]").click(function() {
			core.dialogImportFile.show();
		});

		$("a[action=exportFile]").unbind("click");
		$("a[action=exportFile]").click(function() {
			core.dialogExportFile.show();
		});

		$("a[action=property]").unbind("click");
		$("a[action=property]").click(function() {
			core.dialogProperty.show();
		});
		//////////////////////////////////////////////////
		//Main Menu : Edit
		//////////////////////////////////////////////////
		$("a[action=doUndo]").unbind("click");
		$("a[action=doUndo]").click(function() {
			var windowManager = core.module.layout.workSpace.windowManager;

			if(windowManager.window[windowManager.activeWindow].designer) {
				windowManager.window[windowManager.activeWindow].designer.canvas.undo();
			} else if(windowManager.window[windowManager.activeWindow].editor) {
				windowManager.window[windowManager.activeWindow].editor.undo();
			}
		});

		$("a[action=doRedo]").unbind("click");
		$("a[action=doRedo]").click(function() {
			var windowManager = core.module.layout.workSpace.windowManager;

			if(windowManager.window[windowManager.activeWindow].designer) {
				windowManager.window[windowManager.activeWindow].designer.canvas.redo();
			} else if(windowManager.window[windowManager.activeWindow].editor) {
				windowManager.window[windowManager.activeWindow].editor.redo();
			}
		});

		$("a[action=doCut]").unbind("click");
		$("a[action=doCut]").click(function() {
			//core.dialogPreference.preference['preference.editor.useClipboard'];
			var windowManager = core.module.layout.workSpace.windowManager;

			if(windowManager.window[windowManager.activeWindow].designer) {
				windowManager.window[windowManager.activeWindow].designer.canvas.cut();
			} else if(windowManager.window[windowManager.activeWindow].editor) {
				windowManager.window[windowManager.activeWindow].editor.cut();
			}
		});

		$("a[action=doCopy]").unbind("click");
		$("a[action=doCopy]").click(function() {

			var windowManager = core.module.layout.workSpace.windowManager;

			if(windowManager.window[windowManager.activeWindow].designer) {
				windowManager.window[windowManager.activeWindow].designer.canvas.copy();
			} else if(windowManager.window[windowManager.activeWindow].editor) {
				windowManager.window[windowManager.activeWindow].editor.copy();
			}
		});

		$("a[action=doPaste]").unbind("click");
		$("a[action=doPaste]").click(function() {

			var windowManager = core.module.layout.workSpace.windowManager;

			if(windowManager.window[windowManager.activeWindow].designer) {
				windowManager.window[windowManager.activeWindow].designer.canvas.paste();
			} else if(windowManager.window[windowManager.activeWindow].editor) {
				windowManager.window[windowManager.activeWindow].editor.paste();
			}
		});

		$("a[action=doDelete]").unbind("click");
		$("a[action=doDelete]").click(function() {
			console.log("doDelete");

			var windowManager = core.module.layout.workSpace.windowManager;

			if(windowManager.window[windowManager.activeWindow].designer) {
				windowManager.window[windowManager.activeWindow].designer.canvas._delete();
			} else if(windowManager.window[windowManager.activeWindow].editor) {
				windowManager.window[windowManager.activeWindow].editor.doDelete();
			}
		});

		$("a[action=preference]").unbind("click");
		$("a[action=preference]").click(function() {
			core.dialogPreference.show();
		});

		$("a[action=doFind]").unbind("click");
		$("a[action=doFind]").click(function() {
			core.dialogFindReplace.show();
		});

		$("a[action=doFindNext]").unbind("click");
		$("a[action=doFindNext]").click(function() {

			var windowManager = core.module.layout.workSpace.windowManager;

			if(windowManager.window[windowManager.activeWindow].designer) {
				windowManager.window[windowManager.activeWindow].designer.canvas.doDelete();
			} else if(windowManager.window[windowManager.activeWindow].editor) {
				core.dialogFindReplace.find("next");
			}
		});

		$("a[action=doFindPrevious]").unbind("click");
		$("a[action=doFindPrevious]").click(function() {
			var windowManager = core.module.layout.workSpace.windowManager;

			if(windowManager.window[windowManager.activeWindow].designer) {
				//windowManager.window[windowManager.activeWindow].designer.canvas.doDelete();
			} else if(windowManager.window[windowManager.activeWindow].editor) {
				core.dialogFindReplace.find("previous");
			}
		});

		$("a[action=selectAll]").unbind("click");
		$("a[action=selectAll]").click(function() {
			var windowManager = core.module.layout.workSpace.windowManager;

			if(windowManager.window[windowManager.activeWindow].designer) {
				windowManager.window[windowManager.activeWindow].designer.canvas.selectAll();
			} else if(windowManager.window[windowManager.activeWindow].editor) {
				windowManager.window[windowManager.activeWindow].editor.selectAll();
			}
		});
		
		$("a[action=useClipboard]").unbind("click");
		$("a[action=useClipboard]").click(function() {
			
			if(core.dialogPreference.preference['preference.editor.useClipboard'] == "true") {
				$(this).find("img").removeClass("toolbarButtonPressed");
				core.dialogPreference.preference['preference.editor.useClipboard'] = "false";
				localStorage['preference.editor.useClipboard'] = "false";
				console.log("1");
			} else {
				$(this).find("img").addClass("toolbarButtonPressed");
				core.dialogPreference.preference['preference.editor.useClipboard'] = "true";
				localStorage['preference.editor.useClipboard'] = "true";
				console.log("2");
			}

		});
		//////////////////////////////////////////////////
		//Main Menu : Design
		//////////////////////////////////////////////////
		$("a[action=alignLeft]").unbind("click");
		$("a[action=alignLeft]").click(function() {
			if(!$(this).hasClass('disabled')) {
				if(core.module.layout.workSpace.windowManager.window[core.module.layout.workSpace.windowManager.activeWindow].designer) {
					core.module.layout.workSpace.windowManager.window[core.module.layout.workSpace.windowManager.activeWindow].designer.canvas.alignLeft();
				}
			}
		});

		$("a[action=alignRight]").unbind("click");
		$("a[action=alignRight]").click(function() {
			if(!$(this).hasClass('disabled')) {
				if(core.module.layout.workSpace.windowManager.window[core.module.layout.workSpace.windowManager.activeWindow].designer) {
					core.module.layout.workSpace.windowManager.window[core.module.layout.workSpace.windowManager.activeWindow].designer.canvas.alignRight();
				}
			}
		});

		$("a[action=alignTop]").unbind("click");
		$("a[action=alignTop]").click(function() {
			if(!$(this).hasClass('disabled')) {
				if(core.module.layout.workSpace.windowManager.window[core.module.layout.workSpace.windowManager.activeWindow].designer) {
					core.module.layout.workSpace.windowManager.window[core.module.layout.workSpace.windowManager.activeWindow].designer.canvas.alignTop();
				}
			}
		});

		$("a[action=alignBottom]").unbind("click");
		$("a[action=alignBottom]").click(function() {
			if(!$(this).hasClass('disabled')) {
				if(core.module.layout.workSpace.windowManager.window[core.module.layout.workSpace.windowManager.activeWindow].designer) {
					core.module.layout.workSpace.windowManager.window[core.module.layout.workSpace.windowManager.activeWindow].designer.canvas.alignBottom();
				}
			}
		});

		$("a[action=alignHorizontallyCenter]").unbind("click");
		$("a[action=alignHorizontallyCenter]").click(function() {
			if(!$(this).hasClass('disabled')) {
				if(core.module.layout.workSpace.windowManager.window[core.module.layout.workSpace.windowManager.activeWindow].designer) {
					core.module.layout.workSpace.windowManager.window[core.module.layout.workSpace.windowManager.activeWindow].designer.canvas.alignHorizontallyCenter();
				}
			}
		});

		$("a[action=alignVerticallyCenter]").unbind("click");
		$("a[action=alignVerticallyCenter]").click(function() {
			if(!$(this).hasClass('disabled')) {
				if(core.module.layout.workSpace.windowManager.window[core.module.layout.workSpace.windowManager.activeWindow].designer) {
					core.module.layout.workSpace.windowManager.window[core.module.layout.workSpace.windowManager.activeWindow].designer.canvas.alignVerticallyCenter();
				}
			}
		});

		$("a[action=bringToFront]").unbind("click");
		$("a[action=bringToFront]").click(function() {
			if(!$(this).hasClass('disabled')) {
				if(core.module.layout.workSpace.windowManager.window[core.module.layout.workSpace.windowManager.activeWindow].designer) {
					core.module.layout.workSpace.windowManager.window[core.module.layout.workSpace.windowManager.activeWindow].designer.canvas.bringToFront();
				}
			}
		});

		$("a[action=sendToBack]").unbind("click");
		$("a[action=sendToBack]").click(function() {
			if(!$(this).hasClass('disabled')) {
				if(core.module.layout.workSpace.windowManager.window[core.module.layout.workSpace.windowManager.activeWindow].designer) {
					core.module.layout.workSpace.windowManager.window[core.module.layout.workSpace.windowManager.activeWindow].designer.canvas.sendToBack();
				}
			}
		});

		$("a[action=bringForward]").unbind("click");
		$("a[action=bringForward]").click(function() {
			if(!$(this).hasClass('disabled')) {
				if(core.module.layout.workSpace.windowManager.window[core.module.layout.workSpace.windowManager.activeWindow].designer) {
					core.module.layout.workSpace.windowManager.window[core.module.layout.workSpace.windowManager.activeWindow].designer.canvas.bringForward();
				}
			}
		});

		$("a[action=sendBackward]").unbind("click");
		$("a[action=sendBackward]").click(function() {
			if(!$(this).hasClass('disabled')) {
				if(core.module.layout.workSpace.windowManager.window[core.module.layout.workSpace.windowManager.activeWindow].designer) {
					core.module.layout.workSpace.windowManager.window[core.module.layout.workSpace.windowManager.activeWindow].designer.canvas.sendBackward();
				}
			}
		});

		$("a[action=canvasSetting]").unbind("click");
		$("a[action=canvasSetting]").click(function() {
			var windowManager = core.module.layout.workSpace.windowManager;
			if(windowManager.window[windowManager.activeWindow].designer) {
				windowManager.window[windowManager.activeWindow].designer.canvas.dialog.panel.show();
			}
		});
		//////////////////////////////////////////////////
		//Main Menu : Project
		//////////////////////////////////////////////////
		$("a[action=run]").unbind("click");
		$("a[action=run]").click(function() {
			if(core.module.plugin_manager.plugins["org.goorm.plugin." + core.currentProjectType] != undefined
			&& !$(this).hasClass('yuimenuitemlabel-disabled')) {
				console.log(core.currentProjectType);
				core.module.plugin_manager.plugins["org.goorm.plugin." + core.currentProjectType].run(core.currentProjectPath);
			}
		});

		$("a[action=debug]").unbind("click");
		$("a[action=debug]").click(function() {
			if(core.module.plugin_manager.plugins["org.goorm.plugin." + core.currentProjectType] != undefined
			&& !$(this).hasClass('yuimenuitemlabel-disabled')) {
				core.module.layout.innerBottomTabView.selectTab(1);
				console.log(core.module.plugin_manager.plugins["org.goorm.plugin." + core.currentProjectType]);
				core.module.plugin_manager.plugins["org.goorm.plugin." + core.currentProjectType].debug(core.currentProjectPath);
			}
		});

		$("a[action=remoteRun]").unbind("click");
		$("a[action=remoteRun]").click(function() {

			if(core.module.plugin_manager.plugins["org.goorm.plugin." + core.currentProjectType] != undefined
			&& !$(this).hasClass('yuimenuitemlabel-disabled')) {
				// Android
				core.module.plugin_manager.plugins["org.goorm.plugin." + core.currentProjectType].remoteRun(core.currentProjectPath);
			}
		});

		$("a[action=generate]").unbind("click");
		$("a[action=generate]").click(function() {
			console.log(core.currentProjectType);
			if(core.module.plugin_manager.plugins["org.goorm.plugin." + core.currentProjectType] != undefined
			&& !$(this).hasClass('yuimenuitemlabel-disabled')) {

				core.module.plugin_manager.plugins["org.goorm.plugin." + core.currentProjectType].generate();
			}
		});

		$("a[action=generateAll]").unbind("click");
		$("a[action=generateAll]").click(function() {

		});

		$("a[action=buildProject]").unbind("click");
		$("a[action=buildProject]").click(function() {
			if(!$(this).hasClass('yuimenuitemlabel-disabled')) {
				core.dialogBuildProject.show();
			}
			// if(core.module.plugin_manager.plugins["org.goorm.plugin."+core.currentProjectType]!=undefined) {
			//
			// // C, Web
			//
			// core.module.plugin_manager.plugins["org.goorm.plugin."+core.currentProjectType].build(core.currentProjectPath);
			// }
		});

		$("a[action=buildAll]").unbind("click");
		$("a[action=buildAll]").click(function() {
			if(!$(this).hasClass('yuimenuitemlabel-disabled')) {
				core.dialogBuildAll.show();
			}
		});

		$("a[action=buildClean]").unbind("click");
		$("a[action=buildClean]").click(function() {
			if(!$(this).hasClass('yuimenuitemlabel-disabled')) {
				core.dialogBuildClean.show();
			}
		});

		$("a[action=buildConfiguration]").unbind("click");
		$("a[action=buildConfiguration]").click(function() {
			core.dialogBuildConfiguration.show();
		});

		$("a[action=importProject]").unbind("click");
		$("a[action=importProject]").click(function() {
			core.dialogImportProject.show();
		});

		$("a[action=exportProject]").unbind("click");
		$("a[action=exportProject]").click(function() {
			core.dialogExportProject.show();
		});

		$("a[action=deleteProject]").unbind("click");
		$("a[action=deleteProject]").click(function() {
			core.dialogDeleteProject.show();
		});

		$("a[action=showProperties]").unbind("click");
		$("a[action=showProperties]").click(function() {
			core.dialogProjectProperty.show();
		});
		//////////////////////////////////////////////////
		//Main Menu : Collaboration
		//////////////////////////////////////////////////
		$("a[action=joinProject]").unbind("click");
		$("a[action=joinProject]").click(function() {
			core.dialogJoinProject.show();
		});

		$("a[action=collaboration_settings]").unbind("click");
		$("a[action=collaboration_settings]").click(function() {
			core.dialogCollaborationSettings.show();
		});

		$("a[action=chatOnOff]").unbind("click");
		$("a[action=chatOnOff]").click(function() {
			
			if(core.isChatOn==true) {
				
				core.isChatOn = false;
				core.module.layout.chat.setChatOff();
				$(".isChatOn").html("Chat Off");
				$("a[action=chatOnOff]").find("img").removeClass("toolbarButtonPressed");

				$("a[action=chatOnOff]").each(function(i) {
					if($(this).attr("status") == "enable") {
						$(this).parent().hide();
					} else if($(this).attr("status") == "disable") {
						$(this).parent().show();
					}
				});
			} else {
				
				core.isChatOn = true;
				//core.module.layout.chat.init();
				core.module.layout.chat.setChatOn();
				$(".isChatOn").html("Chat On");
				$("a[action=chatOnOff]").find("img").addClass("toolbarButtonPressed");

				$("a[action=chatOnOff]").each(function(i) {
					if($(this).attr("status") == "enable") {
						$(this).parent().show();
					} else if($(this).attr("status") == "disable") {
						$(this).parent().hide();
					}
				});

				core.module.layout.innerRightTabView.selectTab(2);
			}

		});

		$("a[action=collaborationEditOnOff]").unbind("click");
		$("a[action=collaborationEditOnOff]").click(function() {
			
			if(core.isCollaborationON) {
				core.isCollaborationON = false;
				$(".isCollaborationOn").html("Collaboration Off");

				$("a[action=collaborationEditOnOff]").find("img").removeClass("toolbarButtonPressed");

				$("a[action=collaborationEditOnOff]").each(function(i) {
					if($(this).attr("status") == "enable") {
						$(this).parent().hide();
					} else if($(this).attr("status") == "disable") {
						$(this).parent().show();
					}
				});
				for(var i = 0; i < core.module.layout.workSpace.windowManager.index; i++) {
					if(core.module.layout.workSpace.windowManager.window[i].alive) {
						var editor = core.module.layout.workSpace.windowManager.window[i].editor;
						if(editor != null) {
							editor.collaboration.setEditOff();
						}
					}
				}
			} else {
				core.isCollaborationON = true;
				$(".isCollaborationOn").html("Collaboration On");

				$("a[action=collaborationEditOnOff]").find("img").addClass("toolbarButtonPressed");

				$("a[action=collaborationEditOnOff]").each(function(i) {
					if($(this).attr("status") == "enable") {
						$(this).parent().show();
					} else if($(this).attr("status") == "disable") {
						$(this).parent().hide();
					}
				});
				for(var i = 0; i < core.module.layout.workSpace.windowManager.index; i++) {
					if(core.module.layout.workSpace.windowManager.window[i].alive) {
						var editor = core.module.layout.workSpace.windowManager.window[i].editor;
						if(editor != null) {
							editor.load(editor.filepath, editor.filename, editor.filetype);
						}
					}
				}
			}
		});

		$("a[action=collaborationDrawOnOff]").unbind("click");
		$("a[action=collaborationDrawOnOff]").click(function() {
			if(core.isCollaborationDrawON) {
				core.isCollaborationDrawON = false;
				$("a[action=collaborationDrawOnOff]").find("img").removeClass("toolbarButtonPressed");

				$("a[action=collaborationDrawOnOff]").each(function(i) {
					if($(this).attr("status") == "enable") {
						$(this).parent().hide();
					} else if($(this).attr("status") == "disable") {
						$(this).parent().show();
					}
				});
				for(var i = 0; i < core.module.layout.workSpace.windowManager.index; i++) {
					if(core.module.layout.workSpace.windowManager.window[i].alive) {
						var designer = core.module.layout.workSpace.windowManager.window[i].designer;
						if(designer != null) {
							designer.canvas.setCollaborationOff();
						}
					}
				}
			} else {
				core.isCollaborationDrawON = true;
				$("a[action=collaborationDrawOnOff]").find("img").addClass("toolbarButtonPressed");

				$("a[action=collaborationDrawOnOff]").each(function(i) {
					if($(this).attr("status") == "enable") {
						$(this).parent().show();
					} else if($(this).attr("status") == "disable") {
						$(this).parent().hide();
					}
				});
				for(var i = 0; i < core.module.layout.workSpace.windowManager.index; i++) {
					if(core.module.layout.workSpace.windowManager.window[i].alive) {
						var designer = core.module.layout.workSpace.windowManager.window[i].designer;
						if(designer != null) {
							designer.load(designer.filepath, designer.filename, designer.filetype);
						}
					}
				}

			}
		});

		$("a[action=collaborationSettings]").unbind("click");
		$("a[action=collaborationSettings]").click(function() {
			core.dialogCollaborationSettings.show();
		});
		//////////////////////////////////////////////////
		//Main Menu : Window
		//////////////////////////////////////////////////
		$("a[action=newMainWindow]").unbind("click");
		$("a[action=newMainWindow]").click(function() {
			core.newMainWindow();
		});

		$("a[action=previousWindow]").unbind("click");
		$("a[action=previousWindow]").click(function() {
			core.module.layout.workSpace.windowManager.previousWindow();
		});

		$("a[action=nextWindow]").unbind("click");
		$("a[action=nextWindow]").click(function() {
			core.module.layout.workSpace.windowManager.nextWindow();
		});

		$("a[action=leftLayoutToggle]").unbind("click");
		$("a[action=leftLayoutToggle]").click(function() {
			if(core.module.layout.layout.getUnitByPosition("left")._collapsed) {
				core.module.layout.layout.getUnitByPosition("left").expand();
			} else {
				core.module.layout.layout.getUnitByPosition("left").collapse();
			}
		});

		$("a[action=leftProjectExplorerShow]").unbind("click");
		$("a[action=leftProjectExplorerShow]").click(function() {
			core.module.layout.leftTabView.selectTab(0);
		});

		$("a[action=leftToolBoxShow]").unbind("click");
		$("a[action=leftToolBoxShow]").click(function() {
			core.module.layout.leftTabView.selectTab(1);
		});

		$("a[action=rightLayoutToggle]").unbind("click");
		$("a[action=rightLayoutToggle]").click(function() {
			if(core.module.layout.innerLayout.getUnitByPosition("right")._collapsed) {
				core.module.layout.innerLayout.getUnitByPosition("right").expand();
			} else {
				core.module.layout.innerLayout.getUnitByPosition("right").collapse();
			}
		});

		$("a[action=rightPropertiesShow]").unbind("click");
		$("a[action=rightPropertiesShow]").click(function() {
			core.module.layout.innerRightTabView.selectTab(0);
		});

		$("a[action=rightObjectExplorerShow]").unbind("click");
		$("a[action=rightObjectExplorerShow]").click(function() {
			core.module.layout.innerRightTabView.selectTab(1);
		});

		$("a[action=rightChatShow]").unbind("click");
		$("a[action=rightChatShow]").click(function() {
			core.module.layout.innerRightTabView.selectTab(2);
		});

		$("a[action=bottomLayoutToggle]").unbind("click");
		$("a[action=bottomLayoutToggle]").click(function() {
			if(core.module.layout.innerLayout.getUnitByPosition("bottom")._collapsed) {
				core.module.layout.innerLayout.getUnitByPosition("bottom").expand();
			} else {
				core.module.layout.innerLayout.getUnitByPosition("bottom").collapse();
			}
		});

		$("a[action=bottomMessageShow]").unbind("click");
		$("a[action=bottomMessageShow]").click(function() {
			core.module.layout.innerBottomTabView.selectTab(0);
		});

		$("a[action=bottomDebugShow]").unbind("click");
		$("a[action=bottomDebugShow]").click(function() {
			core.module.layout.innerBottomTabView.selectTab(1);
		});

		$("a[action=bottomConsoleShow]").unbind("click");
		$("a[action=bottomConsoleShow]").click(function() {
			core.module.layout.innerBottomTabView.selectTab(2);
		});

		$("a[action=bottomSearchShow]").unbind("click");
		$("a[action=bottomSearchShow]").click(function() {
			core.module.layout.innerBottomTabView.selectTab(3);
		});

		$("a[action=toggleFullWorkspace]").unbind("click");
		$("a[action=toggleFullWorkspace]").click(function() {
			if(core.module.layout.layout.getUnitByPosition("left")._collapsed) {
				core.module.layout.layout.getUnitByPosition("left").expand();
				core.module.layout.innerLayout.getUnitByPosition("right").expand();
				core.module.layout.innerLayout.getUnitByPosition("bottom").expand();
			} else {
				core.module.layout.layout.getUnitByPosition("left").collapse();
				core.module.layout.innerLayout.getUnitByPosition("right").collapse();
				core.module.layout.innerLayout.getUnitByPosition("bottom").collapse();
			}
		});

		$("a[action=hideAllWindows]").unbind("click");
		$("a[action=hideAllWindows]").click(function() {
			core.module.layout.workSpace.windowManager.hideAllWindows();
		});

		$("a[action=showAllWindows]").unbind("click");
		$("a[action=showAllWindows]").click(function() {
			core.module.layout.workSpace.windowManager.showAllWindows();
		});

		$("a[action=cascade]").unbind("click");
		$("a[action=cascade]").click(function() {
			core.module.layout.workSpace.windowManager.cascade();
		});

		$("a[action=tileVertically]").unbind("click");
		$("a[action=tileVertically]").click(function() {
			core.module.layout.workSpace.windowManager.tileVertically();
		});

		$("a[action=tileHorizontally]").unbind("click");
		$("a[action=tileHorizontally]").click(function() {
			core.module.layout.workSpace.windowManager.tileHorizontally();
		});
		//////////////////////////////////////////////////
		//Main Menu : Help
		//////////////////////////////////////////////////
		$("a[action=helpContents]").unbind("click");
		$("a[action=helpContents]").click(function() {
			core.dialogHelpContents.show();
		});

		$("a[action=helpSearch]").unbind("click");
		$("a[action=helpSearch]").click(function() {
			core.dialogHelpSearch.show();
		});

		$("a[action=helpTipsAndTricks]").unbind("click");
		$("a[action=helpTipsAndTricks]").click(function() {
			core.dialogHelpTipsAndTricks.show();
		});

		$("a[action=helpCheckForUpdates]").unbind("click");
		$("a[action=helpCheckForUpdates]").click(function() {
			core.dialogHelpCheckForUpdates.show();
		});

		$("a[action=helpInstallNewPlugin]").unbind("click");
		$("a[action=helpInstallNewPlugin]").click(function() {
			core.dialogHelpInstallNewPlugin.show();
		});

		$("a[action=helpAbout]").unbind("click");
		$("a[action=helpAbout]").click(function() {
			core.dialogHelpAbout.show();
		});

		$("a[action=helpBugReport]").unbind("click");
		$("a[action=helpBugReport]").click(function() {
			core.dialogHelpBugReport.show();
		});
		//////////////////////////////////////////////////
		//Context Menu : File
		//////////////////////////////////////////////////
		$("a[action=newFile_file_context]").unbind("click");
		$("a[action=newFile_file_context]").click(function() {
			core.dialogNewFile.show("context");
		});

		$("a[action=open_context]").unbind("click");
		$("a[action=open_context]").click(function() {
			var filename = (core.selectedFile.split("/")).pop();
			var filetype = (filename.split(".")).pop();
			var filepath = core.selectedFile.replace(filename, "");

			core.module.layout.workSpace.windowManager.open(filepath, filename, filetype);
		});

		$("a[action=open_defaultEditor]").unbind("click");
		$("a[action=open_defaultEditor]").click(function() {
			var filename = (core.selectedFile.split("/")).pop();
			var filetype = (filename.split(".")).pop();
			var filepath = core.selectedFile.replace(filename, "");

			core.module.layout.workSpace.windowManager.open(filepath, filename, filetype);
		});

		$("a[action=open_textEditor]").unbind("click");
		$("a[action=open_textEditor]").click(function() {
			var filename = (core.selectedFile.split("/")).pop();
			var filetype = (filename.split(".")).pop();
			var filepath = core.selectedFile.replace(filename, "");

			core.module.layout.workSpace.windowManager.open(filepath, filename, filetype, "Editor");
		});

		$("a[action=open_codeEditor]").unbind("click");
		$("a[action=open_codeEditor]").click(function() {
			var filename = (core.selectedFile.split("/")).pop();
			var filetype = (filename.split(".")).pop();
			var filepath = core.selectedFile.replace(filename, "");

			core.module.layout.workSpace.windowManager.open(filepath, filename, filetype, "Editor");
		});

		$("a[action=open_uiDesigner]").unbind("click");
		$("a[action=open_uiDesigner]").click(function() {
			var filename = (core.selectedFile.split("/")).pop();
			var filetype = (filename.split(".")).pop();
			var filepath = core.selectedFile.replace(filename, "");

			core.module.layout.workSpace.windowManager.open(filepath, filename, filetype, "Designer");
		});

		$("a[action=open_umlDesigner]").unbind("click");
		$("a[action=open_umlDesigner]").click(function() {
			var filename = (core.selectedFile.split("/")).pop();
			var filetype = (filename.split(".")).pop();
			var filepath = core.selectedFile.replace(filename, "");

			core.module.layout.workSpace.windowManager.open(filepath, filename, filetype, "Designer");
		});

		$("a[action=move_context]").unbind("click");
		$("a[action=move_context]").click(function() {
			core.dialogMoveFile.show("context");
		});

		$("a[action=rename_context]").unbind("click");
		$("a[action=rename_context]").click(function() {
			core.dialogRenameFile.show("context");
		});

		$("a[action=delete_context]").unbind("click");
		$("a[action=delete_context]").click(function() {
			confirmation.init({
				title : "Delete",
				message : "Do you want to delete this file?",
				yesText : "Yes",
				noText : "No",
				yes : function() {
					var postdata = {
						fileName : core.selectedFile
					};
					$.post("file/delete", postdata, function(data) {
						c.m("delete: " + core.selectedFile);
						core.module.layout.projectExplorer.refresh();
					});
				},
				no : function() {
					confirmation.panel.hide();
				}
			});

			confirmation.panel.show();
		});
		//////////////////////////////////////////////////
		//Context Menu : Folder
		//////////////////////////////////////////////////
		$("a[action=newFile_folder_context]").unbind("click");
		$("a[action=newFile_folder_context]").click(function(e) {
			core.dialogNewFolder.show("context");
		});

		$("a[action=newFile_textFile_context]").unbind("click");
		$("a[action=newFile_textFile_context]").click(function(e) {
			core.dialogNewUntitledTextFile.show("context");
		});

		$("a[action=folder_open_context]").unbind("click");
		$("a[action=folder_open_context]").click(function(e) {
			var target = $("#projectTreeview").find(".ygtvfocus")[0];

			core.module.layout.projectExplorer.treeview.getNodeByElement(target).expand();
		});
		
		//////////////////////////////////////////////////
		//Plugin Menu Action
		//////////////////////////////////////////////////

		for(var i = 0; i < core.module.plugin_manager.pluginList.length; i++) {
			
			var pluginName = core.module.plugin_manager.pluginList[i].pluginName;

			//console.log(core.module.plugin_manager.plugins[pluginName]);
			// if(core.module.plugin_manager.plugins[pluginName] != undefined) {
				if(core.module.plugin_manager.plugins[pluginName].addMenuAction()){
					core.module.plugin_manager.plugins[pluginName].addMenuAction();
				}
			// }
			// if(core.module.plugin_manager.plugins[core.module.plugin_manager.pluginList[i].pluginName].addMenuAction())
				// core.module.plugin_manager.plugins[core.module.plugin_manager.pluginList[i].pluginName].addMenuAction();
		}
	}
}