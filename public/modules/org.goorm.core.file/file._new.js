/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jshint newcap:false, debug:true, unused: true, evil: true, devel: true, plusplus: false, browser: true, jquery: true, undef:false */
/*clientside jslint comment for global */
/*global org: false, core: false, YAHOO: false, confirmation: false */
/*jshint unused: false */



org.goorm.core.file._new = {
	dialog: null,
	buttons: null,
	is_new_anyway: false,
	dialog_explorer: null,

	init: function () {
		var self = this;

		var handle_ok = function () {

			var data = self.dialog_explorer.get_data();

			if (data.path === "" || data.name === "") {
				alert.show(core.module.localization.msg.alert_filename_empty);
				return false;
			}

			if (data.path == "/") {
				alert.show(core.module.localization.msg.alert_deny_make_file_in_workspace_root);
				return;
			}
			var postdata = {
				new_anyway: self.is_new_anyway,
				path: data.path + "/" + data.name,
				type: data.type
			};

			$.get("file/new", postdata, function (data) {
				if (data.err_code == 99) {
					confirmation.init({
						message: core.module.localization.msg.confirmation_new_message,
						yes_text: core.module.localization.msg.confirmation_yes,
						no_text: core.module.localization.msg.confirmation_no,
						title: "Confirmation",


						yes: function () {
							self.is_new_anyway = true;
							handle_ok();
						},
						no: function () {}
					});

					confirmation.panel.show();
				} else if (data.err_code === 0) {
					self.dialog.panel.hide();
					core.module.layout.project_explorer.refresh();
				} else if (data.err_code == 20) {
					alert.show(core.module.localization.msg[data.message]);

				} else {
					alert.show(data.message);
				}
			});
		};

		var handle_cancel = function () {

			this.hide();
		};

		this.buttons = [{
			id: "g_file_new_btn_ok",
			text: "<span localization_key='ok'>OK</span>",
			handler: handle_ok,
			isDefault: true
		}, {
			id: "g_file_new_btn_cancel",
			text: "<span localization_key='cancel'>Cancel</span>",
			handler: handle_cancel
		}];

		this.dialog = org.goorm.core.file._new.dialog;
		this.dialog.init({
			localization_key: "title_new_file",
			title: "New File",
			path: "configs/dialogs/org.goorm.core.file/file._new.html",
			width: 800,
			height: 500,
			modal: true,
			buttons: this.buttons,
			success: function () {
				var resize = new YAHOO.util.Resize("file_new_dialog_left", {
					handles: ['r'],
					minWidth: 200,
					maxWidth: 400
				});

				resize.on('resize', function (ev) {
					var width = $("#file_new_dialog_middle").width();
					var w = ev.width;
					$("#file_new_dialog_center").css('width', (width - w - 9) + 'px');
					$("#file_new_files").css('width', (width - w - 9) + 'px');
				});
				if (core.is_optimization) {
					self.dialog.dialog.panel.subscribe('show', function () {
						$(self.dialog.panel.element).find('input[readonly!=readonly][type!=hidden]').focus();
					});
					$(self.dialog.dialog.panel.element).find('input[readonly!=readonly][type!=hidden]').unbind();
					$(self.dialog.dialog.panel.element).find('input[readonly!=readonly][type!=hidden]').keydown(function(e){
						if(e.keyCode===13){
							$("#g_file_new_btn_ok").click();

						}
					});
				} else {
					self.dialog.panel.subscribe('show', function () {
						$(self.dialog.panel.element).find('input[readonly!=readonly][type!=hidden]').focus();
					});
					$(self.dialog.panel.element).find('input[readonly!=readonly][type!=hidden]').unbind();
					$(self.dialog.panel.element).find('input[readonly!=readonly][type!=hidden]').keydown(function(e){
						if(e.keyCode===13){
							$("#g_file_new_btn_ok").click();

						}
					});
				}
				
			}
		});
		this.dialog = this.dialog.dialog;

		this.dialog_explorer = new org.goorm.core.dialog.explorer();
	},

	show: function () {
		var self = this;

		this.is_new_anyway = false;

		self.dialog_explorer.init("#file_new", false);

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
	},

	add_items: function (item_div, src) {
		this.dialog_explorer.add_file_items(src);
	}
};
