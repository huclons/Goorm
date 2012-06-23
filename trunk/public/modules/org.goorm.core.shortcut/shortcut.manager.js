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
 * @class open.dialog
 * @extends project
 * 
 **/
org.goorm.core.shortcut.manager = function () {

};

org.goorm.core.shortcut.manager.prototype = {
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 * @param {Object} option The option for dialog.
	 **/
	init: function () {

		//Prevent Backspace Key
		$(document).bind('keydown', 'Backspace', function (e) {
			
			if (core.focusOnEditor) {
				
			}
			else if (core.focusOnInputBox) {
				
			}
			else {
				e.stopPropagation();
				e.preventDefault();
				return false;
			}
			
		});
			 
		$(document).bind('keyup', function (e) {
			core.keydown = false;
		  	
		  	if (e.keyCode != 27 && e.keyCode != 13) {
				e.stopPropagation();
				e.preventDefault();
				return false;
			}
		});
		
		$("input").keyup(function (e) {
			var ev = e || event;
			
			console.log("keyup");
			
		  	if (e.keyCode == 27 && e.keyCode == 13) {
		  		console.log("keyup");
				$(document).trigger(e);
				
				e.stopPropagation();
				e.preventDefault();
				return false;				
			}
		});
		
		$("input").keydown(function (e) {
			var ev = e || event;
			
			console.log("keydown");
			
		  	if (e.keyCode == 27 && e.keyCode == 13) {
		  		console.log("keydown");
				$(document).trigger(e);
				
				e.stopPropagation();
				e.preventDefault();
				return false;
			}
		});
			

		//////////////////////////////////////////////////
		//Main Menu Selection
		//////////////////////////////////////////////////
					
		//Main Menu Selection
		$(document).bind('keydown', "Alt", function (e) {
			//core.mainLayout.mainMenu.setInitialSelection();
			core.mainLayout.mainMenu.focus();
		  
			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		
	
		//////////////////////////////////////////////////
		//Main Menu : File
		//////////////////////////////////////////////////
			
		//New Project
		$(document).bind('keydown', 'Alt+N', function (e) {

			core.dialogNewProject.show();
			
			core.mainLayout.mainMenu.blur();

			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		
		
		
		//Open Project
		$(document).bind('keydown', 'Ctrl+O', function (e) {
			
			core.dialogOpenProject.show();
			
			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		
		//Open File
		$(document).bind('keydown', 'Ctrl+Shift+O', function (e) {
			
			core.dialogOpenFile.show();
			
			e.stopPropagation();
			e.preventDefault();
			return false;
		});

		//Close
		$(document).bind('keydown', 'Alt+X', function (e) {
			core.mainLayout.mainMenu.blur();
		
			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		
		//Close All
		$(document).bind('keydown', 'Alt+Shift+X', function (e) {
			var windowManager = core.mainLayout.workSpace.windowManager;
			windowManager.closeAll();

			core.mainLayout.mainMenu.blur();
			
			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		
		//Save
		$(document).bind('keydown', 'Ctrl+S', function (e) {
			var windowManager = core.mainLayout.workSpace.windowManager;

			if (windowManager.window[windowManager.activeWindow].designer) {
				windowManager.window[windowManager.activeWindow].designer.save();
			}
			else if (windowManager.window[windowManager.activeWindow].editor) {
				windowManager.window[windowManager.activeWindow].editor.save();
			}

			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		
		//Save as File
		$(document).bind('keydown', 'Ctrl+Shift+S', function (e) {

			core.dialogSaveAsFile.show();
			
			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		
		//Save All
		$(document).bind('keydown', 'Alt+Ctrl+S', function (e) {
		
			core.mainLayout.workSpace.windowManager.saveAll();

			core.mainLayout.mainMenu.blur();

			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		
		//Move
		$(document).bind('keydown', 'Ctrl+Shift+M', function (e) {

			e.stopPropagation();
			e.preventDefault();
			return false;
		});
	
		//Rename
		$(document).bind('keydown', 'Ctrl+Shift+R', function (e) {

			core.dialogRenameFile.show("");
			
			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		
		//Refresh
		$(document).bind('keydown', 'Ctrl+R', function (e) {

			core.mainLayout.projectExplorer.refresh();
			
			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		
		//Print
		$(document).bind('keydown', 'Ctrl+P', function (e) {

			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		
				
		//////////////////////////////////////////////////
		//Main Menu : Edit
		//////////////////////////////////////////////////
		
		//Undo
		$(document).bind('keydown', 'Ctrl+Z', function (e) {

			var windowManager = core.mainLayout.workSpace.windowManager;
			
			if (windowManager.window[windowManager.activeWindow].designer) {
				windowManager.window[windowManager.activeWindow].designer.canvas.undo();
			}

			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		
		//Redo
		$(document).bind('keydown', 'Ctrl+Y', function (e) {

			var windowManager = core.mainLayout.workSpace.windowManager;
			
			if (windowManager.window[windowManager.activeWindow].designer) {
				windowManager.window[windowManager.activeWindow].designer.canvas.redo();
			}

			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		
		
		//Cut
		$(document).bind('keydown', 'Ctrl+X', function (e) {

			var windowManager = core.mainLayout.workSpace.windowManager;
			
			if (windowManager.window[windowManager.activeWindow].designer) {
				windowManager.window[windowManager.activeWindow].designer.canvas.cut();
				
				e.stopPropagation();
				e.preventDefault();
				return false;	
			}
			else {
				if(core.dialogPreference.preference['preference.editor.useClipboard']=="false"){
					$("a[action=doCut]").trigger("click");
					e.stopPropagation();
					e.preventDefault();
					return false;				
				}
			}
			
		});
		//Copy
		$(document).bind('keydown', 'Ctrl+C', function (e) {

			var windowManager = core.mainLayout.workSpace.windowManager;
			
			if (windowManager.window[windowManager.activeWindow].designer) {
				windowManager.window[windowManager.activeWindow].designer.canvas.copy();
				
				e.stopPropagation();
				e.preventDefault();
				return false;	
			}
			else {
				if(core.dialogPreference.preference['preference.editor.useClipboard']=="false"){
					$("a[action=doCopy]").trigger("click");
					e.stopPropagation();
					e.preventDefault();
					return false;		
				}
			}


		});
		//Paste
		$(document).bind('keydown', 'Ctrl+V', function (e) {

			var windowManager = core.mainLayout.workSpace.windowManager;
			
			if (windowManager.window[windowManager.activeWindow].designer) {
				windowManager.window[windowManager.activeWindow].designer.canvas.paste();
				
				e.stopPropagation();
				e.preventDefault();
				return false;	
			}
			else {
				if(core.dialogPreference.preference['preference.editor.useClipboard']=="false"){
					$("a[action=doPaste]").trigger("click");
					e.stopPropagation();
					e.preventDefault();
					return false;
				}		
			}
			
		});
		//Delete
		$(document).bind('keydown', 'Del', function (e) {

			var windowManager = core.mainLayout.workSpace.windowManager;
			
			if (windowManager.window[windowManager.activeWindow].designer) {
				windowManager.window[windowManager.activeWindow].designer.canvas._delete();
				
				e.stopPropagation();
				e.preventDefault();
				return false;	
			}
			else {
				$("a[action=doDelete]").trigger("click");
				e.stopPropagation();
				e.preventDefault();
				return false;		
			}
		});
		

		//Select All
		$(document).bind('keydown', 'Ctrl+A', function (e) {

			$("a[action=selectAll]").trigger("click");
			e.stopPropagation();
			e.preventDefault();
			return false;
		});
				
		//Find and Replace
		$(document).bind('keydown', 'Ctrl+F', function (e) {

			var windowManager = core.mainLayout.workSpace.windowManager;
			
			if (windowManager.window[windowManager.activeWindow].editor) {
				core.dialogFindReplace.show();
			}
			
			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		
		//Find Next
		$(document).bind('keydown', 'Ctrl+G', function (e) {
			var windowManager = core.mainLayout.workSpace.windowManager;
			
			if (windowManager.window[windowManager.activeWindow].editor&&!core.keydown) {
				core.dialogFindReplace.find("next");
				core.keydown=true;

			}
			
			
			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		
		//Find Previous
		$(document).bind('keydown', 'Ctrl+Shift+G', function (e) {

			var windowManager = core.mainLayout.workSpace.windowManager;
			
			if (windowManager.window[windowManager.activeWindow].editor&&!core.keydown) {
				core.dialogFindReplace.find("previous");
				core.keydown=true;
			}
			
			e.stopPropagation();
			e.preventDefault();
			return false;
		});
	
		//Open Preference
		$(document).bind('keydown', 'Alt+P', function (e) {

			core.dialogPreference.show();
			
			core.mainLayout.mainMenu.blur();
			
			e.stopPropagation();
			e.preventDefault();
			return false;
		});

		//////////////////////////////////////////////////
		//Main Menu : Edit
		//////////////////////////////////////////////////
		
		//Run
		$(document).bind('keydown', 'Ctrl+F5', function (e) {

			if(core.pluginManager.plugins["org.goorm.plugin."+core.currentProjectType]!=undefined) {
				core.pluginManager.plugins["org.goorm.plugin."+core.currentProjectType].run(core.currentProjectPath);
			}

			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		
		//Debug
		$(document).bind('keydown', 'F7', function (e) {

			if(core.pluginManager.plugins["org.goorm.plugin."+core.currentProjectType]!=undefined) {
				core.mainLayout.innerBottomTabView.selectTab(1);
				core.pluginManager.plugins["org.goorm.plugin."+core.currentProjectType].debug(core.currentProjectPath);
			}

			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		
		/*
		//Build Project
		$(document).bind('keydown', 'F5', function (e) {

			core.dialogBuildProject.show();

			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		*/
		
		//Clean
		$(document).bind('keydown', 'Ctrl+Del', function (e) {

			core.dialogBuildClean.show();

			e.stopPropagation();
			e.preventDefault();
			return false;
		});		
				
				
		//////////////////////////////////////////////////
		//Main Menu : Collaboration
		//////////////////////////////////////////////////
		
		//Open Join the Project
		$(document).bind('keydown', 'Ctrl+J', function (e) {

			core.dialogJoinProject.show();
			
			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		
				
		//////////////////////////////////////////////////
		//Main Menu : Window
		//////////////////////////////////////////////////
			
		//Previous Window
		$(document).bind('keydown', 'Alt+Shift+left', function (e) {
			if (!core.keydown) {
			      core.mainLayout.workSpace.windowManager.previousWindow();
			      core.keydown = true;
			}
			
			core.mainLayout.mainMenu.blur();
		  
			e.stopPropagation();
			e.preventDefault();
			return false;
		});
	 
		//Next Window
		$(document).bind('keydown', 'Alt+Shift+right', function (e) {
		 	if (!core.keydown) {
				core.mainLayout.workSpace.windowManager.nextWindow();
				core.keydown = true;
			}
			
			core.mainLayout.mainMenu.blur();
		  
			e.stopPropagation();
			e.preventDefault();
			return false;
		});
	  
		//Left Layout Show/Hide
		$(document).bind('keydown', 'Alt+Shift+L', function (e) {
			if (!core.keydown) {
				if (core.mainLayout.layout.getUnitByPosition("left")._collapsed) {
					core.mainLayout.layout.getUnitByPosition("left").expand();
				}
				else {
					core.mainLayout.layout.getUnitByPosition("left").collapse();
				}
			}
			
			core.mainLayout.mainMenu.blur();
			
			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		
		//Left Layout Show/Hide
		$(document).bind('keydown', 'Alt+Shift+1', function (e) {
			if (!core.keydown) {
				core.mainLayout.leftTabView.selectTab(0);
			}
			
			core.mainLayout.mainMenu.blur();
			
			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		
		//Left Layout Toggle Project Explorer
		$(document).bind('keydown', 'Alt+Shift+2', function (e) {
			if (!core.keydown) {
				core.mainLayout.leftTabView.selectTab(1);
			}
			
			core.mainLayout.mainMenu.blur();

			e.stopPropagation();
			e.preventDefault();
			return false;
		});

		//Left Layout Show/Hide
		$(document).bind('keydown', 'Alt+Shift+R', function (e) {
			if (!core.keydown) {
				if (core.mainLayout.innerLayout.getUnitByPosition("right")._collapsed) {
					core.mainLayout.innerLayout.getUnitByPosition("right").expand();
				}
				else {
					core.mainLayout.innerLayout.getUnitByPosition("right").collapse();
				}
			}
			
			core.mainLayout.mainMenu.blur();
			
			e.stopPropagation();
			e.preventDefault();
			return false;
		});	
		
		//Left Layout Toggle Toolbox
		$(document).bind('keydown', 'Alt+Shift+3', function (e) {
			if (!core.keydown) {
				core.mainLayout.innerRightTabView.selectTab(0);
			}
			
			core.mainLayout.mainMenu.blur();
			
			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		
		//Right Layout Show/Hide
		$(document).bind('keydown', 'Alt+Shift+4', function (e) {
			if (!core.keydown) {
				core.mainLayout.innerRightTabView.selectTab(1);
			}
			
			core.mainLayout.mainMenu.blur();
			
			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		
		//Right Layout Toggle Properties
		$(document).bind('keydown', 'Alt+Shift+5', function (e) {
			if (!core.keydown) {
				core.mainLayout.innerRightTabView.selectTab(2);
			}
			
			core.mainLayout.mainMenu.blur();
			
			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		
		//Left Layout Show/Hide
		$(document).bind('keydown', 'Alt+Shift+B', function (e) {
			if (!core.keydown) {
				if (core.mainLayout.innerLayout.getUnitByPosition("bottom")._collapsed) {
					core.mainLayout.innerLayout.getUnitByPosition("bottom").expand();
				}
				else {
					core.mainLayout.innerLayout.getUnitByPosition("bottom").collapse();
				}
			}
			
			core.mainLayout.mainMenu.blur();
			
			e.stopPropagation();
			e.preventDefault();
			return false;
		});			
		
		//Right Layout Toggle Object Explorer
		$(document).bind('keydown', 'Alt+Shift+6', function (e) {
			if (!core.keydown) {
				core.mainLayout.innerBottomTabView.selectTab(0);
			}
			
			core.mainLayout.mainMenu.blur();
			
			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		
		//Bottom Layout Show/Hide
		$(document).bind('keydown', 'Alt+Shift+7', function (e) {
			if (!core.keydown) {
				core.mainLayout.innerBottomTabView.selectTab(1);
			}
			
			core.mainLayout.mainMenu.blur();
			
			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		
		//Bottom Layout Toggle Messages
		$(document).bind('keydown', 'Alt+Shift+8', function (e) {
			if (!core.keydown) {
				core.mainLayout.innerBottomTabView.selectTab(2);
			}
			
			core.mainLayout.mainMenu.blur();

			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		
		//Bottom Layout Toggle Generator
		$(document).bind('keydown', 'Alt+Shift+9', function (e) {
			if (!core.keydown) {
				core.mainLayout.innerBottomTabView.selectTab(3);
			}

			core.mainLayout.mainMenu.blur();
	
			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		
		$(document).bind('keydown', 'Alt+Shift+W', function (e) {
			console.log("!!!!!!!");
			
			if (!core.keydown) {
				$($("a[action=toggleFullWorkspace]").get(0)).trigger("click");
				core.keydown = true;
			}
			
			core.mainLayout.mainMenu.blur();
			
			e.stopPropagation();
			e.preventDefault();
			return false;
		});
				
		//Hide All Window
		$(document).bind('keydown', 'Alt+Shift+H', function (e) {
			if (!core.keydown) {
				console.log("!");
				core.mainLayout.workSpace.windowManager.hideAllWindows();
			}
			
			core.mainLayout.mainMenu.blur();
			
			e.stopPropagation();
			e.preventDefault();
			return false;
		});
				
		//Show All Window
		$(document).bind('keydown', 'Alt+Shift+S', function (e) {
			if (!core.keydown) {
				console.log("!!");
				core.mainLayout.workSpace.windowManager.showAllWindows();
			}
			
			core.mainLayout.mainMenu.blur();
			
			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		
		
		
	}
};