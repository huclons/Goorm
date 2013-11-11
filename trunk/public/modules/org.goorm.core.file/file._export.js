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



org.goorm.core.file._export = {
	dialog: null,
	buttons: null,
	tabview: null,
	dialog_explorer: null,

	init: function () {
		var self = this;

		var handle_ok = function () {
			var data = self.dialog_explorer.get_data();

			if (data.path === "" || data.name === "") {
				alert.show(core.module.localization.msg.alert_filename_empty);
				// alert.show("Not Selected.");
				return false;
			}

			// var name = core.user.id;

			var postdata = {
				// user: name,
				path: data.path,
				file: data.name
			};

			core.module.loading_bar.start("Export processing...");
			$.get("file/export", postdata, function (data) {
				core.module.loading_bar.stop();

				if (data.err_code === 0) {
					self.dialog.panel.hide();

					//location.href = "download/?file=" + data.path;
					//var _iframe_download=$('<iframe id="download_frame"/>').attr('src',"download/?file=" + data.path).hide().appendTo
					$("#download_frame").css('display','none');
					$("#download_frame").attr('src', "download/?file=" + data.path);

				} else {
					alert.show(data.message);
				}
			});
		};

		var handle_cancel = function () {

			this.hide();
		};

		this.buttons = [{
			id: "g_file_export_btn_ok",
			text: "<span localization_key='ok'>OK</span>",
			handler: handle_ok,
			isDefault: true
		}, {
			id: "g_file_export_btn_cancel",
			text: "<span localization_key='cancel'>Cancel</span>",
			handler: handle_cancel
		}];

		this.dialog = org.goorm.core.file._export.dialog;
		this.dialog.init({
			localization_key: "title_export_file",
			title: "Export File",
			path: "configs/dialogs/org.goorm.core.file/file._export.html",
			width: 800,
			height: 500,
			modal: true,
			opacity: true,
			yes_text: "<span localization_key='open'>Open</span>",
			no_text: "<span localization_key='cancel'>Cancel</span>",
			buttons: this.buttons,
			success: function () {
				var resize = new YAHOO.util.Resize("file_export_dialog_left", {
					handles: ['r'],
					minWidth: 200,
					maxWidth: 400
				});

				resize.on('resize', function (ev) {
					var width = $("#file_export_dialog_middle").width();
					var w = ev.width;
					// $("#file_export_dialog_center").css('width', (width - w - 9) + 'px');
					$('#file_export_files').css('width', (width - w - 9) + 'px');
				});

			}
		});
		this.dialog = this.dialog.dialog;

		this.dialog_explorer = new org.goorm.core.dialog.explorer();

		//this.dialog.panel.setBody("AA");
	},

	show: function () {
		var self = this;

		self.dialog_explorer.init("#file_export", false);

		this.dialog.panel.show();
	}
};
