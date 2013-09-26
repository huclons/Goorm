/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jshint newcap:false, debug:true, unused: true, evil: true, devel: true, plusplus: false, browser: true, jquery: true, undef:false */
/*clientside jslint comment for global */
/*global org: false, core: false, YAHOO: false */
/*jshint unused: false */



org.goorm.core.file.open = {
	dialog: null,
	buttons: null,
	filename: null,
	filetype: null,
	filepath: null,
	dialog_explorer: null,

	init: function () {

		var self = this;

		var handle_ok = function (panel) {

			var data = self.dialog_explorer.get_data();

			if (data.path === "" || $("#file_open_target_name").val() === "") {
				alert.show(core.module.localization.msg.alert_filename_empty);
				return false;
			}

			if ($("#file_open_target_name").val().indexOf("..") != -1) {
				alert.show(core.module.localization.msg.alert_file_name_illegal);
				return false;
			}

			core.module.layout.workspace.window_manager.open(data.path, $("#file_open_target_name").val(), data.type);

			if (typeof(this.hide) !== 'function' && panel) {
				panel.hide();
			}
			else{
				this.hide();
			}
		};

		var handle_cancel = function () {

			this.hide();
		};

		this.buttons = [{
			id: "g_file_open_btn_ok",
			text: "<span localization_key='ok'>OK</span>",
			handler: handle_ok,
			isDefault: true
		}, {
			id: "g_file_open_btn_cancel",
			text: "<span localization_key='cancel'>Cancel</span>",
			handler: handle_cancel
		}];

		this.dialog = org.goorm.core.file.open.dialog;
		this.dialog.init({
			localization_key: "title_open_file",
			title: "Open file",
			path: "configs/dialogs/org.goorm.core.file/file.open.html",
			width: 800,
			height: 500,
			modal: true,
			opacity: true,
			buttons: this.buttons,
			success: function () {
				var resize = new YAHOO.util.Resize("open_dialog_left", {
					handles: ['r'],
					minWidth: 200,
					maxWidth: 400
				});

				resize.on('resize', function (ev) {
					var width = $("#open_dialog_middle").width();
					var w = ev.width;

					$("#file_open_files").css('width', (width - w - 9) + 'px');
				});

			}
		});
		this.dialog = this.dialog.dialog;

		this.dialog_explorer = new org.goorm.core.dialog.explorer();
	},

	show: function () {
		var self = this;

		this.dialog.panel.show();

		self.dialog_explorer.init("#file_open", false);

	}
};
