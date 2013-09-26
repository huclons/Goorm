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



org.goorm.core.file.move = {
	dialog: null,
	buttons: null,
	dialog_explorer: null,

	init: function () {

		var self = this;

		var handle_ok = function (panel) {

			var data = self.dialog_explorer.get_data();

			if (data.path === "" || data.name === "") {
				alert.show(core.module.localization.msg.alert_filename_empty);

				return false;
			}

			var postdata = {
				ori_path: $("#file_move_ori_path").val(),
				ori_file: $("#file_move_ori_file").val(),
				dst_path: data.path,
				dst_file: data.name
			};
			$.get("file/move", postdata, function (data) {
				if (data.err_code === 0) {
					postdata.change = 'dialog_mv';
					postdata.file_type = core.status.selected_file_type == 'folder' ? 'folder' : 'file';
					if (postdata.ori_path + postdata.ori_file != postdata.dst_path + postdata.dst_file)
						core.module.layout.workspace.window_manager.synch_with_fs(postdata);
					//2.open file .....
					core.module.layout.project_explorer.refresh();
				} else if (data.err_code == 20) {
					alert.show(data.message);

				} else {
					alert.show(data.message);
				}
			});

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
			id: "g_file_move_btn_ok",
			text: "<span localization_key='ok'>OK</span>",
			handler: handle_ok,
			isDefault: true
		}, {
			id: "g_file_move_btn_cancel",
			text: "<span localization_key='cancel'>Cancel</span>",
			handler: handle_cancel
		}];

		this.dialog = org.goorm.core.file.move.dialog;
		this.dialog.init({
			localization_key: "title_move",
			title: "Move",
			path: "configs/dialogs/org.goorm.core.file/file.move.html",
			width: 800,
			height: 500,
			modal: true,
			opacity: true,
			buttons: this.buttons,
			success: function () {
				var resize = new YAHOO.util.Resize("move_dialog_left", {
					handles: ['r'],
					minWidth: 200,
					maxWidth: 400
				});

				resize.on('resize', function (ev) {
					var width = $("#move_dialog_middle").width();
					var w = ev.width;

					$("#file_move_files").css('width', (width - w - 9) + 'px');
				});

				$("#file_move_project_type").change(function () {
					var type = $(this).val();
					$("#move_dialog_center").find(".file_item").each(function () {
						if (type === 0) {
							$(this).css("display", "block");
						} else if ($(this).attr('filetype') == type) {
							$(this).css("display", "block");
						} else {
							$(this).css("display", "none");
						}
					});
				});
				if (core.is_optimization) {

					self.dialog.dialog.panel.subscribe('show', function () {
						$(self.dialog.panel.element).find('input[readonly!=readonly][type=text]').focus();
					});
					$(self.dialog.dialog.panel.element).find('input[readonly!=readonly][type=text]').unbind();
					$(self.dialog.dialog.panel.element).find('input[readonly!=readonly][type=text]').keydown(function(e){
						if(e.keyCode===13)	$("#g_file_move_btn_ok").click();
					});
				} else {
					self.dialog.panel.subscribe('show', function () {
						$(self.dialog.panel.element).find('input[readonly!=readonly][type=text]').focus();
					});
					$(self.dialog.panel.element).find('input[readonly!=readonly][type=text]').unbind();
					$(self.dialog.panel.element).find('input[readonly!=readonly][type=text]').keydown(function(e){
						if(e.keyCode===13)	$("#g_file_move_btn_ok").click();
					});
				}
				
			}
		});
		this.dialog = this.dialog.dialog;
		this.dialog_explorer = new org.goorm.core.dialog.explorer();
	},

	show: function (context) {

		var self = this;
		self.dialog_explorer.init("#file_move", false);
		self.is_alive_window = false;
		if (context) {
			if ( core.status.current_project_path === core.status.selected_file) {
				alert.show("Cannot move!");
				return;
			}
			var filename = (core.status.selected_file.split("/")).pop();
			var filepath = core.status.selected_file.replace(filename, "");
			filepath = filepath.replace("//", "/");

			$("#file_move_ori_file").attr("value", filename);
			$("#file_move_ori_path").attr("value", filepath);
			$("#file_move_target_name").attr("value", filename);

			var window_manager = core.module.layout.workspace.window_manager;

			for (var i = 0; i < window_manager.index; i++) {
				var window_filename = window_manager.window[i].filename;
				var window_filepath = window_manager.window[i].filepath;
				window_filepath = window_filepath + "/";
				window_filepath = window_filepath.replace("//", "/");

				if (window_manager.window[i].alive && window_filename == filename && window_filepath == filepath) {
					self.is_alive_window = true;
				}
			}
		} else {
			var window_manager = core.module.layout.workspace.window_manager;

			for (var i = 0; i < window_manager.index; i++) {
				if (window_manager.window[i].alive) {
					self.is_alive_window = true;
				}
			}

			if (self.is_alive_window) {
				$("#file_move_ori_file").attr("value", window_manager.window[window_manager.active_window].filename);
				$("#file_move_ori_path").attr("value", window_manager.window[window_manager.active_window].filepath);
				$("#file_move_target_name").attr("value", window_manager.window[window_manager.active_window].filename);
			} else {
				var temp_path = core.status.selected_file;
				var temp_name = temp_path.split("/").pop();
				temp_path = temp_path.replace(temp_name, "");

				$("#file_move_ori_file").attr("value", temp_name);
				$("#file_move_ori_path").attr("value", temp_path);
				$("#file_move_target_name").attr("value", temp_name);
			}

		}
		$("#file_move_target_name").val(core.status.selected_file.split('/').pop());

		this.dialog.panel.show();

	}
};
