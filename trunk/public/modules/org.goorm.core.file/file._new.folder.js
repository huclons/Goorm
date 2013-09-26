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



org.goorm.core.file._new.folder = {
	dialog: null,
	buttons: null,
	dialog_explorer: null,

	init: function () {
		var self = this;

		var handle_ok = function (panel) {

			var data = self.dialog_explorer.get_data();

			if (data.path == "/") {
				alert.show(core.module.localization.msg.alert_deny_make_folder_in_workspace_root);
				return;
			}
			if (data.path === "" || data.name === "") {
				alert.show(core.module.localization.msg.alert_filename_empty);

				return false;
			} else {
				var postdata = {
					current_path: data.path,
					folder_name: data.name
				};

				$.get("file/new_folder", postdata, function (data) {
					if (data.err_code === 0) {
						core.module.layout.project_explorer.refresh();
					} else if (data.err_code == 20) {
						alert.show(core.module.localization.msg[data.message]);

					} else {
						alert.show(data.message);
					}
				});
			}

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
			id: "g_file_new_folder_btn_ok",
			text: "<span localization_key='ok'>OK</span>",
			handler: handle_ok,
			isDefault: true
		}, {
			id: "g_file_new_folder_btn_cancel",
			text: "<span localization_key='cancel'>Cancel</span>",
			handler: handle_cancel
		}];

		this.dialog = org.goorm.core.file._new.folder.dialog;
		this.dialog.init({
			localization_key: "title_new_folder",
			title: "New folder",
			path: "configs/dialogs/org.goorm.core.file/file._new.folder.html",
			width: 400,
			height: 500,
			modal: true,
			opacity: true,
			buttons: this.buttons,
			success: function () {
				if (core.is_optimization) {
					self.dialog.dialog.panel.subscribe('show', function () {
						$(self.dialog.panel.element).find('input[readonly!=readonly][type=text]').focus();
					});

					$(self.dialog.dialog.panel.element).find('input[readonly!=readonly][type=text]').unbind();
					$(self.dialog.dialog.panel.element).find('input[readonly!=readonly][type=text]').keydown(function(e){
						if(e.keyCode===13)	$("#g_file_new_folder_btn_ok").click();
					});
				} else {
					self.dialog.panel.subscribe('show', function () {
						$(self.dialog.panel.element).find('input[readonly!=readonly][type=text]').focus();
					});
					$(self.dialog.panel.element).find('input[readonly!=readonly][type=text]').unbind();
					$(self.dialog.panel.element).find('input[readonly!=readonly][type=text]').keydown(function(e){
						if(e.keyCode===13)	$("#g_file_new_folder_btn_ok").click();
					});
				}

				

			}
		});
		this.dialog = this.dialog.dialog;

		this.dialog_explorer = new org.goorm.core.dialog.explorer();
	},

	show: function () {
		var self = this;

		self.dialog_explorer.init("#folder_new", true);

		this.dialog.panel.show();
	},

	expand: function (tree_div, src) {
		var self = this;
		var nodes = src.split('/');

		var target_parent = "";
		var target_name = "";

		function get_node_by_path(node) {
			if (node.data.parent_label == target_parent && node.data.name == target_name) return true;
			else return false;
		}

		for (var i = 0; i < nodes.length; i++) {
			target_name = nodes[i];

			var target_node = self.dialog_explorer.treeview.getNodesBy(get_node_by_path);
			if (target_node) {
				target_node = target_node.pop();
				target_node.expand();
			}

			target_parent += nodes[i] + '/';
		}
	}
};
