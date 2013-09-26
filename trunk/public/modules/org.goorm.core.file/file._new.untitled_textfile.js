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



org.goorm.core.file._new.untitled_textfile = {
	dialog: null,
	buttons: null,
	dialog_explorer: null,

	init: function () {
		var self = this;

		var handle_ok = function (panel) {

			var data = self.dialog_explorer.get_data();

			if (data.path === "") {
				alert.show(core.module.localization.msg.alert_filename_empty);
				return false;
			}

			if (data.path == "/") {
				alert.show(core.module.localization.msg.alert_deny_make_file_in_workspace_root);
				return;
			}

			var postdata = {
				current_path: data.path
			};

			$.get("file/new_untitled_text_file", postdata, function (data) {
				if (data.err_code === 0) {
					core.module.layout.project_explorer.refresh();
				} else if (data.err_code == 20) {
					alert.show(core.module.localization.msg[data.message]);

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
			id: "g_file_new_untitled_textfile_btn_ok",
			text: "<span localization_key='ok'>OK</span>",
			handler: handle_ok,
			isDefault: true
		}, {
			id: "g_file_new_untitled_textfile_btn_cancel",
			text: "<span localization_key='cancel'>Cancel</span>",
			handler: handle_cancel
		}];

		this.dialog = org.goorm.core.file._new.untitled_textfile.dialog;
		this.dialog.init({
			localization_key: "title_new_untitled_text_file",
			title: "New Untitled Text File",
			path: "configs/dialogs/org.goorm.core.file/file._new.untitled_textfile.html",
			width: 400,
			height: 460,
			modal: true,
			opacity: true,
			buttons: this.buttons,
			success: function () {

			}
		});
		this.dialog = this.dialog.dialog;

		this.dialog_explorer = new org.goorm.core.dialog.explorer();
	},

	show: function (context) {
		this.dialog_explorer.init("#text_new", true);
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