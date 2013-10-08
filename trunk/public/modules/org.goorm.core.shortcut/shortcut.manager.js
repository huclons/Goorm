/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jshint newcap:false, debug:true, unused: true, evil: true, devel: true, plusplus: false, browser: true, jquery: true, undef:false */
/*clientside jslint comment for global */
/*global org: false, core: false */
/*jshint unused: false */



org.goorm.core.shortcut.manager = {
	on_transition: false,
	hotkeys: {},

	getOStype: function () {
		var os = "windows";
		if (navigator.platform.indexOf("Win") != -1) {
			// Windows
			os = "windows";
		} else if (navigator.platform.indexOf("Mac") != -1) {
			// Mac
			os = "mac";
		} else if (navigator.platform.indexOf("Linux") != -1) {
			// Linux
			os = "linux";
		} else {
			// Else
			os = "else";
		}
		return os;
	},

	setKeyType: function (os) {
		var keys = {
			"ctrl": "ctrl",
			"alt": "alt",
			"meta": "meta",
			"backspace": "backspace"
		};
		
		switch (os) {
		case "mac":
			keys.ctrl = "command";
			break;
		case "windows":
			break;
		case "linux":
			break;
		case "else":
			break;
		default:
		}
		return keys;
	},

	updateHotkey: function () {
		var self = this;
		for (var action in this.hotkeys) {
			var text = this.hotkeys[action];
			var os = this.getOStype();
			if (os == "mac") {
				text = text.replace("meta", "&#x2318;")
					.replace("Ctrl", "^")
					.replace("Alt", "&#x2325;")
					.replace("Shift", "&#x21E7;")
					.replace("Delete", "&#x232b")
					.replace("Del", "&#x232b")
					.replace("Left", "⇦")
					.replace("Right", "⇨");
			}
			$("[action=" + action + "] .helptext").html(text);
		}
	},

	init: function () {
		var self = this;
		var os = this.getOStype();
		var keys = this.setKeyType(os);
		var hotkey_list = $(".helptext");

		hotkey_list.each(function () {
			if ($(this).parent("[action]")) {
				var action = $(this).parent("[action]").attr("action");

				if (os == "mac")
					self.hotkeys[action] = $(this).text().replace(/Ctrl/g, "meta").replace(/	/g, "").split(" ").join("").trim();
				else
					self.hotkeys[action] = $(this).text().replace(/	/g, "").split(" ").join("").trim();
			}
		});

		this.updateHotkey();

		//Prevent Backspace Key
		$(document).bind('keydown', keys.backspace, function (e) {
			if (core.status.focus_on_editor) {

			} else if (core.status.focus_on_inputbox) {

			} else {
				e.stopPropagation();
				e.preventDefault();
				return false;
			}

		});

		$(document).bind('keyup', function (e) {
			core.status.keydown = false;

			if (e.keyCode != 27 && e.keyCode != 13) {
				e.stopPropagation();
				e.preventDefault();
				return false;
			}
		});

		$("input").keyup(function (e) {
			var ev = e || event;

			if (e.keyCode == 27 || e.keyCode == 13) {
				if ($(e.currentTarget).attr('id') == 'goorm_id' || $(e.currentTarget).attr('id') == 'goorm_pw') {
					core.module.auth.login();
				} else if ($(e.currentTarget).attr('id') == 'user_search_input') {
					core.dialog.share_project.user_add();
				}

				$(document).trigger(e);

				e.stopPropagation();
				e.preventDefault();
				return false;
			}
		});

				//Main Menu Selection
		
		//Main Menu Selection
		$(document).bind('keydown', keys.alt, function (e) {
			core.module.layout.mainmenu.focus();

			e.stopPropagation();
			e.preventDefault();
			return false;
		});

				//Main Menu : File
		
		//New Project (Alt+N)
		if (this.hotkeys.new_project) {
			$(document).bind('keydown', this.hotkeys.new_project, function (e) {
				core.dialog.new_project.show();

				core.module.layout.mainmenu.blur();

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Open File (Ctrl+O)
		if (this.hotkeys.open_file) {
			$(document).bind('keydown', this.hotkeys.open_file, function (e) {

				core.dialog.open_file.show();

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Close (Alt+X)
		if (this.hotkeys.close_file) {
			$(document).bind('keydown', this.hotkeys.close_file, function (e) {
				var active_window = core.module.layout.workspace.window_manager.active_window;
				core.module.layout.workspace.window_manager.window[active_window].close();

				core.module.layout.mainmenu.blur();

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		if (this.hotkeys.tile_left) {
			$(document).bind('keydown', this.hotkeys.tile_left, function (e) {
				core.module.layout.workspace.window_manager.tile_left();

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		if (this.hotkeys.tile_right) {
			$(document).bind('keydown', this.hotkeys.tile_right, function (e) {
				core.module.layout.workspace.window_manager.tile_right();
				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Close All (Alt+Shift+X)
		if (this.hotkeys.close_all) {
			$(document).bind('keydown', this.hotkeys.close_all, function (e) {
				var window_manager = core.module.layout.workspace.window_manager;
				window_manager.close_all();

				core.module.layout.mainmenu.blur();

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Save (Ctrl+S)
		if (this.hotkeys.save_file) {
			var ctrlsEventLock = false;
			$(document).bind('keydown', this.hotkeys.save_file, function (e) {
				//console.log("asdasdasd");
				if (ctrlsEventLock === false) {
					ctrlsEventLock = true;

					var window_manager = core.module.layout.workspace.window_manager;

					if (window_manager.window[window_manager.active_window].designer) {
						window_manager.window[window_manager.active_window].designer.save();
					} else if (window_manager.window[window_manager.active_window].editor) {
						window_manager.window[window_manager.active_window].editor.save(true, true);
					}
					window.setTimeout(function () {
						ctrlsEventLock = false;
					}, 500);
					e.stopPropagation();
					e.preventDefault();
				}
				return false;
			});
		}

		//Save as File (Ctrl+Shift+S)
		if (this.hotkeys.save_as_file) {
			$(document).bind('keydown', this.hotkeys.save_as_file, function (e) {

				core.dialog.save_as_file.show();

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Save All (Ctrl+Alt+S)
		if (this.hotkeys.save_all_file) {
			$(document).bind('keydown', this.hotkeys.save_all_file, function (e) {
				core.module.layout.workspace.window_manager.save_all();

				core.module.layout.mainmenu.blur();

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Move (Ctrl+Shift+M)
		if (this.hotkeys.move_file) {
			$(document).bind('keydown', this.hotkeys.move_file, function (e) {

				if (core.status.selected_file) {
					core.dialog.move_file.show("context");
				}

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Rename (Ctrl+Shift+R)
		if (this.hotkeys.move_file) {
			$(document).bind('keydown', this.hotkeys.move_file, function (e) {

				if (core.status.selected_file) {
					core.dialog.rename_file.show("context");
				}

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Refresh (Ctrl+R)
		if (this.hotkeys.refresh_project_directory) {
			$(document).bind('keydown', this.hotkeys.refresh_project_directory, function (e) {

				core.module.layout.project_explorer.refresh();

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Print (Ctrl+P)
		if (this.hotkeys.print) {
			$(document).bind('keydown', this.hotkeys.print, function (e) {

				core.dialog.print.show();

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

				//Main Menu : Edit
		
		//Undo (Ctrl+Z)
		if (this.hotkeys.do_undo) {
			$(document).bind('keydown', this.hotkeys.do_undo, function (e) {

				var window_manager = core.module.layout.workspace.window_manager;

				if (window_manager.window[window_manager.active_window].designer) {
					window_manager.window[window_manager.active_window].designer.canvas.undo();
				}

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Redo (CTRL+Y)
		if (this.hotkeys.do_redo) {
			$(document).bind('keydown', this.hotkeys.do_redo, function (e) {

				var window_manager = core.module.layout.workspace.window_manager;

				if (window_manager.window[window_manager.active_window].designer) {
					window_manager.window[window_manager.active_window].designer.canvas.redo();
				}

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Cut (CTRL+X)
		if (this.hotkeys.do_cut) {
			$(document).bind('keydown', this.hotkeys.do_cut, function (e) {

				var window_manager = core.module.layout.workspace.window_manager;

				if (window_manager.window[window_manager.active_window].designer) {
					window_manager.window[window_manager.active_window].designer.canvas.cut();

					e.stopPropagation();
					e.preventDefault();
					return false;
				} else {
					if (core.preference['preference.editor.use_clipboard'] == "false") {
						$("a[action=do_cut]").trigger("click");
						e.stopPropagation();
						e.preventDefault();
						return false;
					}
				}

			});
		}

		//Copy (Ctrl+C)
		if (this.hotkeys.do_copy) {
			$(document).bind('keydown', this.hotkeys.do_copy, function (e) {

				var window_manager = core.module.layout.workspace.window_manager;

				if (window_manager.window[window_manager.active_window].designer) {
					window_manager.window[window_manager.active_window].designer.canvas.copy();

					e.stopPropagation();
					e.preventDefault();
					return false;
				} else {
					if (core.preference['preference.editor.use_clipboard'] == "false") {
						$("a[action=do_copy]").trigger("click");
						e.stopPropagation();
						e.preventDefault();
						return false;
					}
				}
			});
		}

		//Paste (Ctrl+V)
		if (this.hotkeys.do_paste) {
			$(document).bind('keydown', this.hotkeys.do_paste, function (e) {

				var window_manager = core.module.layout.workspace.window_manager;

				if (window_manager.window[window_manager.active_window].designer) {
					window_manager.window[window_manager.active_window].designer.canvas.paste();

					e.stopPropagation();
					e.preventDefault();
					return false;
				} else {
					if (core.dialog.preference.preference['preference.editor.use_clipboard'] == "false") {
						$("a[action=do_paste]").trigger("click");
						e.stopPropagation();
						e.preventDefault();
						return false;
					}
				}

			});
		}

		//Delete (Del)
		if (this.hotkeys.do_delete) {
			$(document).bind('keydown', this.hotkeys.do_delete, function (e) {

				var window_manager = core.module.layout.workspace.window_manager;

				if (typeof window_manager.window[window_manager.active_window] != "undefined" && typeof window_manager.window[window_manager.active_window].designer != "undefined") {
					window_manager.window[window_manager.active_window].designer.canvas._delete();

					e.stopPropagation();
					e.preventDefault();
					return false;
				} else {
					$("a[action=delete_file]").trigger("click");
					e.stopPropagation();
					e.preventDefault();
					return false;
				}
			});
		}

		//Select All (Ctrl+A)
		if (this.hotkeys.select_all) {
			$(document).bind('keydown', this.hotkeys.select_all, function (e) {

				$("a[action=select_all]").trigger("click");
				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Find and Replace (Ctrl+F)
		if (this.hotkeys.do_find) {
			$(document).bind('keydown', this.hotkeys.do_find, function (e) {

				var window_manager = core.module.layout.workspace.window_manager;

				if (window_manager.window[window_manager.active_window].editor) {
					$("a[action=do_find]").click();
				}

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Go to Line (Ctrl+Shift+L)
		if (this.hotkeys.do_go_to_line) {
			$(document).bind('keydown', this.hotkeys.do_go_to_line, function (e) {

				var window_manager = core.module.layout.workspace.window_manager;

				if (window_manager.window[window_manager.active_window].editor) {
					$("a[action=do_go_to_line]").click();
				}

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Search (Alt+H)
		if (this.hotkeys.search) {
			$(document).bind('keydown', this.hotkeys.search, function (e) {

				var window_manager = core.module.layout.workspace.window_manager;

				core.dialog.search.show();

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Find Next (Ctrl+G)
		if (this.hotkeys.do_find_next) {
			$(document).bind('keydown', this.hotkeys.do_find_next, function (e) {
				var window_manager = core.module.layout.workspace.window_manager;

				if (window_manager.window[window_manager.active_window].editor && !core.status.keydown) {
					core.dialog.find_and_replace.find("next");
					core.status.keydown = true;
				}

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Find Previous (Ctrl+Shift+G)
		if (this.hotkeys.do_find_previous) {
			$(document).bind('keydown', this.hotkeys.do_find_previous, function (e) {

				var window_manager = core.module.layout.workspace.window_manager;

				if (window_manager.window[window_manager.active_window].editor && !core.status.keydown) {
					core.dialog.find_and_replace.find("previous");
					core.status.keydown = true;
				}

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Auto Formatting (Ctrl+K)
		if (this.hotkeys.auto_formatting) {
			$(document).bind('keydown', this.hotkeys.auto_formatting, function (e) {

				var window_manager = core.module.layout.workspace.window_manager;

				if (window_manager.window[window_manager.active_window].designer) {
				} else if (window_manager.window[window_manager.active_window].editor) {
					window_manager.window[window_manager.active_window].editor.auto_formatting();
					core.status.keydown = true;
				}

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Open Preference (Alt+P)
		if (this.hotkeys.preference) {
			$(document).bind('keydown', this.hotkeys.preference, function (e) {

				core.dialog.preference.show();

				core.module.layout.mainmenu.blur();

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

				//Main Menu : Edit
		
		//Debug (F7)
		if (this.hotkeys.debug) {
			$(document).bind('keydown', this.hotkeys.debug, function (e) {
				if (core.module.plugin_manager.plugins["org.goorm.plugin." + core.status.current_project_type] !== undefined) {
					core.module.layout.inner_bottom_tabview.selectTab(1);
					core.module.plugin_manager.plugins["org.goorm.plugin." + core.status.current_project_type].debug(core.status.current_project_path);
				}
				console.log('F7');
				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		var key_event_lock = false;
		document.onkeydown = function (e) {
			//Build Project - F5
			if (e.keyCode == 116 && (e.ctrlKey === false && e.metaKey === false) && e.shiftKey === false) {
				if (core.module.plugin_manager.plugins["org.goorm.plugin." + core.status.current_project_type] !== undefined) {

					
					core.module.plugin_manager.plugins["org.goorm.plugin." + core.status.current_project_type].build(core.status.current_project_path);
					

					
				}

				e.stopPropagation();
				e.preventDefault();
				return false;

			} //Run - Ctrl + F5
			else if (e.keyCode == 116 && (e.ctrlKey === true || e.metaKey === true) && e.shiftKey === false) {

				if (core.module.plugin_manager.plugins["org.goorm.plugin." + core.status.current_project_type] !== undefined && !$(this).hasClass('yuimenuitemlabel-disabled')) {
					core.status.current_project_absolute_path = core.preference.workspace_path + core.status.current_project_path + "/";
					core.module.layout.inner_bottom_tabview.selectTab(1);

					
					core.module.plugin_manager.plugins["org.goorm.plugin." + core.status.current_project_type].run(core.status.current_project_path);
					

					

				} else {
					var result = {
						result: false,
						code: 0
					};
					core.module.project.display_error_message(result, 'alert');

				}

				e.stopPropagation();
				e.preventDefault();
				return false;
			} else if (e.keyCode == 191 && (e.ctrlKey === true || e.metaKey === true) && e.shiftKey === false) {
				if (key_event_lock === false) {
					key_event_lock = true;
					var window_manager = core.module.layout.workspace.window_manager;

					if (window_manager.window[window_manager.active_window].designer) {
					} else if (window_manager.window[window_manager.active_window].editor) {
						window_manager.window[window_manager.active_window].editor.comment_selection();
						core.status.keydown = true;
					}
					e.stopPropagation();
					e.preventDefault();
					window.setTimeout(function () {
						key_event_lock = false;
					}, 500);
				}
				return false;
			} else if (e.keyCode == 191 && (e.ctrlKey === true || e.metaKey === true) && e.shiftKey === true) {
				var window_manager = core.module.layout.workspace.window_manager;

				if (window_manager.window[window_manager.active_window].designer) {
				} else if (window_manager.window[window_manager.active_window].editor) {
					window_manager.window[window_manager.active_window].editor.uncomment_selection();
					core.status.keydown = true;
				}
				e.stopPropagation();
				e.preventDefault();
				return false;
			} else if (!core.status.focus_on_inputbox && core.status.foucs_on_dialog) {
				var selected_dialog = core.status.selected_dialog;
				var selected_dialog_container = core.status.selected_dialog_container;

				var key = "";
				switch (e.keyCode) {
				case 8:
					key = 'backspace';
					break;
				case 13:
					key = 'enter';
					break;
				case 37:
					key = 'left';
					break;
				case 38:
					key = 'up';
					break;
				case 39:
					key = "right";
					break;
				case 40:
					key = 'down';
					break;
				default:
					key = "";
					break;
				}

				if (key !== "") {
					selected_dialog.select_manager(selected_dialog_container, key);

					e.stopPropagation();
					e.preventDefault();
					return false;
				}
			}
		};

		//Clean (Ctrl+Del)
		if (this.hotkeys.build_clean) {
			$(document).bind('keydown', this.hotkeys.build_clean, function (e) {

				core.dialog.build_clean.show();

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

				//Main Menu : window
		
		//Previous window (Alt+Shift+Left)
		if (this.hotkeys.previous_window) {
			$(document).bind('keydown', this.hotkeys.previous_window, function (e) {
				if (!core.status.keydown) {
					core.module.layout.workspace.window_manager.previous_window();
					core.status.keydown = true;
				}

				core.module.layout.mainmenu.blur();

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Next window (Alt+Shift+Right)
		if (this.hotkeys.next_window) {
			$(document).bind('keydown', this.hotkeys.next_window, function (e) {
				if (!core.status.keydown) {
					core.module.layout.workspace.window_manager.next_window();
					core.status.keydown = true;
				}

				core.module.layout.mainmenu.blur();

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Left Layout Show/Hide (Alt+Shift+L)
		if (this.hotkeys.left_layout_toggle) {
			$(document).bind('keydown', this.hotkeys.left_layout_toggle, function (e) {
				if (!core.status.keydown) {
					if (core.module.layout.layout.getUnitByPosition("left")._collapsed) {
						core.module.layout.layout.getUnitByPosition("left").expand();
					} else {
						core.module.layout.layout.getUnitByPosition("left").collapse();
					}
				}

				core.module.layout.mainmenu.blur();

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Show Project Explorer (Alt+Shift+1)
		if (this.hotkeys.left_project_explorer_show) {
			$(document).bind('keydown', this.hotkeys.left_project_explorer_show, function (e) {
				if (!core.status.keydown) {
					if (core.module.layout.layout.getUnitByPosition("left")._collapsed) {
						core.module.layout.layout.getUnitByPosition("left").expand();
					}
					core.module.layout.left_tabview.selectTab(0);
				}

				core.module.layout.mainmenu.blur();

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Show Toolbox (Alt+Shift+2)
		if (this.hotkeys.left_cloud_explorer_show) {
			$(document).bind('keydown', this.hotkeys.left_cloud_explorer_show, function (e) {
				if (!core.status.keydown) {
					if (core.module.layout.layout.getUnitByPosition("left")._collapsed) {
						core.module.layout.layout.getUnitByPosition("left").expand();
					}
					core.module.layout.left_tabview.selectTab(1);
				}

				core.module.layout.mainmenu.blur();

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Right Layout Show/Hide (Alt+Shift+R)
		if (this.hotkeys.right_layout_toggle) {
			$(document).bind('keydown', this.hotkeys.right_layout_toggle, function (e) {
				if (!core.status.keydown) {
					if (core.module.layout.inner_layout.getUnitByPosition("right")._collapsed) {
						core.module.layout.inner_layout.getUnitByPosition("right").expand();
					} else {
						core.module.layout.inner_layout.getUnitByPosition("right").collapse();
					}
				}

				core.module.layout.mainmenu.blur();

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Right Layout Toggle Communication (Alt+Shift+3)
		if (this.hotkeys.right_communication_show) {
			$(document).bind('keydown', this.hotkeys.right_communication_show, function (e) {
				if (!core.status.keydown) {
					if (core.module.layout.inner_layout.getUnitByPosition("right")._collapsed) {
						core.module.layout.inner_layout.getUnitByPosition("right").expand();
					}
					core.module.layout.inner_right_tabview.selectTab(0);
				}

				core.module.layout.mainmenu.blur();

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Right Layout Slide (Alt+Shift+4)
		if (this.hotkeys.right_slide_show) {
			$(document).bind('keydown', this.hotkeys.right_slide_show, function (e) {
				if (!core.status.keydown) {
					if (core.module.layout.inner_layout.getUnitByPosition("right")._collapsed) {
						core.module.layout.inner_layout.getUnitByPosition("right").expand();
					}
					core.module.layout.inner_right_tabview.selectTab(1);
				}

				core.module.layout.mainmenu.blur();

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Right Layout History (Alt+Shift+5)
		if (this.hotkeys.right_history_show) {
			$(document).bind('keydown', this.hotkeys.right_history_show, function (e) {
				if (!core.status.keydown) {
					if (core.module.layout.inner_layout.getUnitByPosition("right")._collapsed) {
						core.module.layout.inner_layout.getUnitByPosition("right").expand();
					}
					core.module.layout.inner_right_tabview.selectTab(2);
				}

				core.module.layout.mainmenu.blur();

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Right Layout Outline (Alt+Shift+6)
		if (this.hotkeys.right_outline_show) {
			$(document).bind('keydown', this.hotkeys.right_outline_show, function (e) {
				if (!core.status.keydown) {
					if (core.module.layout.inner_layout.getUnitByPosition("right")._collapsed) {
						core.module.layout.inner_layout.getUnitByPosition("right").expand();
					}
					core.module.layout.inner_right_tabview.selectTab(3);
				}

				core.module.layout.mainmenu.blur();

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Bottom Layout Show/Hide (Alt+Shift+B)
		if (this.hotkeys.bottom_layout_toggle) {
			$(document).bind('keydown', this.hotkeys.bottom_layout_toggle, function (e) {
				if (!core.status.keydown) {
					if (core.module.layout.inner_layout.getUnitByPosition("bottom")._collapsed) {
						core.module.layout.inner_layout.getUnitByPosition("bottom").expand();
					} else {
						core.module.layout.inner_layout.getUnitByPosition("bottom").collapse();
					}
				}

				core.module.layout.mainmenu.blur();

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Bottom Layout Toggle Debug (Alt+Shift+7)
		if (this.hotkeys.bottom_debug_show) {
			$(document).bind('keydown', this.hotkeys.bottom_debug_show, function (e) {
				if (!core.status.keydown) {
					if (core.module.layout.inner_layout.getUnitByPosition("bottom")._collapsed) {
						core.module.layout.inner_layout.getUnitByPosition("bottom").expand();
					}
					core.module.layout.inner_bottom_tabview.selectTab(0);
				}

				core.module.layout.mainmenu.blur();

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Bottom Layout console (Alt+Shift+8)
		if (this.hotkeys.bottom_console_show) {
			$(document).bind('keydown', this.hotkeys.bottom_console_show, function (e) {
				if (!core.status.keydown) {
					if (core.module.layout.inner_layout.getUnitByPosition("bottom")._collapsed) {
						core.module.layout.inner_layout.getUnitByPosition("bottom").expand();
					}
					core.module.layout.inner_bottom_tabview.selectTab(1);
				}

				core.module.layout.mainmenu.blur();

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Bottom Layout search (Alt+Shift+9)
		if (this.hotkeys.bottom_search_show) {
			$(document).bind('keydown', this.hotkeys.bottom_search_show, function (e) {
				if (!core.status.keydown) {
					if (core.module.layout.inner_layout.getUnitByPosition("bottom")._collapsed) {
						core.module.layout.inner_layout.getUnitByPosition("bottom").expand();
					}
					core.module.layout.inner_bottom_tabview.selectTab(2);
				}

				core.module.layout.mainmenu.blur();

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		// (Alt+Shift+W)
		if (this.hotkeys.toggle_full_workspace) {
			$(document).bind('keydown', this.hotkeys.toggle_full_workspace, function (e) {
				if (!core.status.keydown) {
					$($("a[action=toggle_full_workspace]").get(0)).trigger("click");
					core.status.keydown = true;
				}

				core.module.layout.mainmenu.blur();

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Hide All window (Alt+Shift+H)
		if (this.hotkeys.hide_all_windows) {
			$(document).bind('keydown', this.hotkeys.hide_all_windows, function (e) {
				if (!core.status.keydown) {
					core.module.layout.workspace.window_manager.hide_all_windows();
				}

				core.module.layout.mainmenu.blur();

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Show All window (Alt+Shift+S)
		if (this.hotkeys.show_all_windows) {
			$(document).bind('keydown', this.hotkeys.show_all_windows, function (e) {
				if (!core.status.keydown) {
					core.module.layout.workspace.window_manager.show_all_windows();
				}

				core.module.layout.mainmenu.blur();

				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}

		//Alt + Tab
		$(document).bind('keydown', 'Alt+Tab', function (e) {
			var window_manager = core.module.layout.workspace.window_manager;

			if (!self.bind_transition) {
				self.bind_transition = true;
				window_manager.transition_manager.load_windows();
				window_manager.transition_manager.load_css();
				window_manager.transition_manager.show();
			}

			var next_window = (window_manager.active_window + 1) % window_manager.window.length;

			window_manager.transition_manager.focus(next_window);
			window_manager.window[next_window].activate();
			window_manager.active_window = next_window;

			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		//Alt + Shift + Tab
		$(document).bind('keydown', 'Alt+Shift+Tab', function (e) {
			var window_manager = core.module.layout.workspace.window_manager;
			var next_window;
			if (!self.bind_transition) {
				self.bind_transition = true;
				window_manager.transition_manager.load_windows();
				window_manager.transition_manager.load_css();
				window_manager.transition_manager.show();
			}

			if (window_manager.active_window === 0) {
				next_window = window_manager.window.length - 1;
			} else {
				next_window = window_manager.active_window - 1;
			}

			window_manager.transition_manager.focus(next_window);
			window_manager.window[next_window].activate();
			window_manager.active_window = next_window;

			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		//Alt
		$(document).bind('keyup', 'Alt', function (e) {
			if (self.bind_transition === true) {
				var window_manager = core.module.layout.workspace.window_manager;

				window_manager.transition_manager.hide();
				self.bind_transition = false;
			}

			e.stopPropagation();
			e.preventDefault();
			return false;
		});

		$(document).bind('keyup', 'Shift', function (e) {
			if (self.bind_transition === true) {
				var window_manager = core.module.layout.workspace.window_manager;

				window_manager.transition_manager.hide();
				self.bind_transition = false;
			}

			e.stopPropagation();
			e.preventDefault();
			return false;
		});

	}
};
