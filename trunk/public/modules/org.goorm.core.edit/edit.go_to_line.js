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



org.goorm.core.edit.go_to_line = {
	dialog: null,
	buttons: null,
	editor: null,

	init: function () {
		var self = this;
		this.buttons = [{
			id : "gGoToLineB_Go",
			text: "<span localization_key='go'>Go</span>",
			handler: function () {
				self.move();
			}
		}];
		this.dialog = org.goorm.core.edit.find_and_replace.dialog;
		this.dialog.init({
			localization_key: "title_go_to_line",
			title: "Go_to_Line",
			path: "configs/dialogs/org.goorm.core.edit/edit.go_to_line.html",
			width: 160,
			height: 116,
			modal: false,
			buttons: this.buttons,
			draggable: true,
			success: function () {

				$("#go_line_inputbox").keydown(function (e) {
					var ev = e || event;

					if (ev.keyCode == 27) {
						// esc key
						self.hide();
					}

					if (ev.keyCode == 13) {
						self.move();

						e.stopPropagation();
						e.preventDefault();
						return false;
					}
				});

				if (core.is_optimization) {
					self.dialog.dialog.panel.subscribe('show', function () {
						$("#go_line_inputbox").focus();
					});
				} else {
					self.dialog.panel.subscribe('show', function () {
						$("#go_line_inputbox").focus();
					});
				}
			}
		});

		this.dialog = this.dialog.dialog;
	},

	move: function () {
		var window_manager = core.module.layout.workspace.window_manager;

		// Get current active_window's editor
		if (window_manager.window[window_manager.active_window].editor) {
			// Get current active_window's CodeMirror editor
			this.editor = window_manager.window[window_manager.active_window].editor.editor;
			// Get input query of this dialog
			var keyword = $("#go_line_inputbox").val();
			// Call search function of org.goorm.core.file.findReplace with keyword and editor			
			
			this.editor.setCursor(parseInt(keyword, 10) - 1, 0);
			
			core.sim=this.editor;

			//scroll location calculate
			var container_id=core.module.layout.workspace.window_manager.window[window_manager.active_window].container;
			var to_mean =  ($('#'+container_id+' .bd').height()/ (window_manager.window[window_manager.active_window].editor.font_size+3) ) /2;
			this.editor.scrollIntoView(   parseInt(parseInt(keyword, 10) - 1 - to_mean, 10 )  );
			this.editor.scrollIntoView(   parseInt(parseInt(keyword, 10) - 1 + to_mean, 10 )  );
			this.editor.scrollIntoView(  parseInt(keyword, 10) - 1   );
			



			this.hide();
		}
	},

	show: function () {

		var window_manager = core.module.layout.workspace.window_manager;

		// Get current active_window's editor
		if (window_manager.window[window_manager.active_window] !== undefined) {
			$("#go_line_inputbox").val("");
			this.dialog.panel.show();
			// Get current active_window's CodeMirror editor
			var editor = window_manager.window[window_manager.active_window].editor.editor;
			this.editor = editor;
		} else {
			alert.show(core.module.localization.msg.alert_cannot_exist_editor);
		}
		//$("#find_query_inputbox").select();
	},

	hide: function () {
		this.dialog.panel.hide();
	}
};
