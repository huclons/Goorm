/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jshint newcap:false, debug:true, unused: true, evil: true, devel: true, plusplus: false, browser: true, jquery: true, undef:false */
/*clientside jslint comment for global */
/*global org: false, core: false, YAHOO: false, notice: false, confirmation: false */
/*jshint unused: false */



org.goorm.core.file._import = {
	dialog: null,
	buttons: null,
	dialog_explorer: null,

	init: function () {
		var self = this;

		var handle_ok = function () {
			if ($('#file_import_location_path').val() === "") {
				alert.show(core.module.localization.msg.alert_deny_make_file_in_workspace_root);
				return;
			}
			core.module.loading_bar.start("Import processing...");
			$('#myForm').submit();
		};

		var handle_cancel = function () {

			this.hide();
		};

		this.buttons = [{
			id: "g_file_import_btn_ok",
			text: "<span localization_key='ok'>OK</span>",
			handler: handle_ok,
			isDefault: true
		}, {
			id: "g_file_import_btn_cancel",
			text: "<span localization_key='cancel'>Cancel</span>",
			handler: handle_cancel
		}];

		this.dialog = org.goorm.core.file._import.dialog;
		this.dialog.init({
			localization_key: "title_import_file",
			title: "Import File",
			path: "configs/dialogs/org.goorm.core.file/file._import.html",
			width: 800,
			height: 500,
			modal: true,
			opacity: true,
			buttons: this.buttons,
			kind: "import",
			success: function () {

				var resize = new YAHOO.util.Resize("import_dialog_left", {
					handles: ['r'],
					minWidth: 200,
					maxWidth: 400
				});

				resize.on('resize', function (ev) {
					var width = $("#import_dialog_middle").width();
					var w = ev.width;

					$("#file_import_files").css('width', (width - w - 9) + 'px');
				});

				var form_options = {
					target: "#upload_output",
					success: function (data) {
						core.module.loading_bar.stop();

						if (data.err_code === 0) {
							self.dialog.panel.hide();

							notice.show(core.module.localization.msg.notice_file_import_done);
							core.module.layout.project_explorer.refresh();
						} else {
							switch (data.err_code) {
							case 21:
								confirmation.init({
									message: data.message,
									yes_text: "Yes",
									no_text: "No",
									title: "Confirmation",
									zIndex: 1001,

									yes: function () {
										$('#myForm').attr('action', 'file/import?is_overwrite=true');
										core.module.loading_bar.start("Import processing...");
										$('#myForm').submit();
										self.dialog.panel.hide();
										$('#myForm').attr('action', 'file/import');
									},
									no: function () {

									}
								});

								confirmation.panel.show();
								break;
							default:
								self.dialog.panel.hide();
								alert.show(data.message);
								break;
							}
						}
					}
				};

				$('#myForm').ajaxForm(form_options);

				$('#myForm').submit(function () {
					return false;
				});
			}
		});
		this.dialog = this.dialog.dialog;

		this.dialog_explorer = new org.goorm.core.dialog.explorer();
	},

	show: function () {
		var self = this;
		$("#upload_output").empty();
		$("#file_import_file").val("");
		self.dialog_explorer.init("#file_import", false);
		this.dialog.panel.show();
	}
};
