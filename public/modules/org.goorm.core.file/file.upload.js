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



org.goorm.core.file.upload = {
	dialog: null,
	buttons: null,
	tabview: null,
	dialog_explorer: null,

	init: function () {
		var self = this;

		var handle_ok = function () {
			var data = self.dialog_explorer.get_data();
			console.log(data);
			if (data.path === "" || data.name === "") {
				alert.show(core.module.localization.msg.alert_filename_empty);
				return false;
			}

			var name = core.user.id;

			var postdata = {
				user: name,
				path: data.path,
				file: data.name,
			};

			core.module.loading_bar.start("Export processing...");

			$.get("file/export", postdata, function (data) {

				console.log('data from server', data);
				if (data.err_code === 0) {
					self.dialog.panel.hide();

					$.get("send_file", {
							file: data.path
						},
						function (data) {
							if (data) {
								var please = data;
								var aFileParts = [];
								aFileParts.push(please);
								var oMyBlob = new Blob(aFileParts); // the blob
								core.module.layout.cloud_explorer.google.upload(oMyBlob, postdata.file, core.cloud.target_dir_id);
							}
							core.module.loading_bar.stop();
						});

				} else {
					core.module.loading_bar.stop();
					alert.show(data.message);
				}
			});

		};

		var handle_cancel = function () {

			this.hide();
		};

		this.buttons = [{
			id: "g_file_upload_btn_ok",
			text: "<span localization_key='ok'>OK</span>",
			handler: handle_ok,
			isDefault: true
		}, {
			id: "g_file_upload_btn_cancel",
			text: "<span localization_key='cancel'>Cancel</span>",
			handler: handle_cancel
		}];

		this.dialog = org.goorm.core.file._export.dialog;
		this.dialog.init({
			localization_key: "title_cloud_upload_file",
			title: "Upload File",
			path: "configs/dialogs/org.goorm.core.file/file.upload.html",
			width: 800,
			height: 500,
			modal: true,
			opacity: true,
			yes_text: "<span localization_key='open'>Open</span>",
			no_text: "<span localization_key='cancel'>Cancel</span>",
			buttons: this.buttons,
			success: function () {
				var resize = new YAHOO.util.Resize("file_cloud_upload_dialog_left", {
					handles: ['r'],
					minWidth: 200,
					maxWidth: 400
				});

				resize.on('resize', function (ev) {
					var width = $("#file_cloud_upload_dialog_middle").width();
					var w = ev.width;
					$("#file_cloud_upload_files").css('width', (width - w - 9) + 'px');
				});
			}
		});
		this.dialog = this.dialog.dialog;

		this.dialog_explorer = new org.goorm.core.dialog.explorer();
	},

	show: function (target_dir_id) {
		var self = this;
		core.cloud = {};
		core.cloud.target_dir_id = target_dir_id;
		self.dialog_explorer.init("#file_cloud_upload", false);

		this.dialog.panel.show();
	}
};
