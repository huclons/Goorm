/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jshint newcap:false, debug:true, unused: true, evil: true, devel: true, plusplus: false, browser: true, jquery: true, undef:false */
/*clientside jslint comment for global */
/*global org: false, core: false, YAHOO: false, notice: false */
/*jshint unused: false */



org.goorm.core.project._delete = {
	dialog: null,
	buttons: null,
	chat: null,
	project_list: null,

	init: function () {

		var self = this;

		var handle_delete = function (panel) {

			var data = self.project_list.get_data();

			// project delete
			if (data.path === "") {
				alert.show(core.module.localization.msg.project_not_selected);
				return false;
			}

			var postdata = {
				project_path: data.path
			};

			$.get("project/delete", postdata, function (data) {
				var received_data = data;

				if (received_data.err_code === 0) {

					$(core.module.layout.workspace.window_manager.window).each(function (i) {
						if (postdata.project_path == this.project) {
							this.close();
						}
					});

					$("#goorm_main_toolbar .debug_continue, #goorm_main_toolbar .debug_terminate, #goorm_main_toolbar .debug_step_over, #goorm_main_toolbar .debug_step_in, #goorm_main_toolbar .debug_step_out").addClass('debug_not_active');
					$("#goorm_main_toolbar .debug").removeClass("debug_not_active");
					$("#Debug .menu-debug-continue, #Debug .menu-debug-terminate, #Debug .menu-debug-step-over, #Debug .menu-debug-step-in, #Debug .menu-debug-step-out").addClass('debug_not_active');
					$("#Debug .menu-debug-start").removeClass('debug_not_active');

					notice.show(core.module.localization.msg.notice_project_delete_done);
					if (postdata.project_path == core.status.current_project_path) {

						

						core.status.current_project_path = "";
						core.status.current_project_name = "";
						core.status.current_project_type = "";
						core.dialog.open_project.open("", "", "");

					}
				} else {
					alert.show(core.module.localization.alert_cannot_project_delete);
				}

				if (core.status.current_project_path === "" || core.status.current_project_path == data.path) {
					core.module.layout.project_explorer.refresh();
					core.dialog.project_property.refresh_toolbox();
				} else {
					core.module.layout.project_explorer.refresh_project_selectbox();
				}

				core.module.layout.terminal.resize_terminal();
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
			id: "g_project_delete_btn_delete",
			text: "<span localization_key='delete'>Delete</span>",
			handler: handle_delete,
			isDefault: true
		}, {
			id: "g_project_delete_btn_cancel",
			text: "<span localization_key='cancel'>Cancel</span>",
			handler: handle_cancel
		}];

		this.dialog = org.goorm.core.project._delete.dialog;
		this.dialog.init({
			localization_key: "title_delete_project",
			title: "Delete Project",
			path: "configs/dialogs/org.goorm.core.project/project._delete.html",
			width: 800,
			height: 500,
			modal: true,
			opacity: true,
			buttons: this.buttons,
			success: function () {
				var resize = new YAHOO.util.Resize("project_delete_dialog_left", {
					handles: ['r'],
					minWidth: 250,
					maxWidth: 400
				});

				resize.on('resize', function (ev) {
					var width = $("#project_delete_dialog_middle").width();
					var w = ev.width;
					$("#project_delete_dialog_center").css('width', (width - w - 9) + 'px');
				});
			}
		});
		this.dialog = this.dialog.dialog;

		this.project_list = new org.goorm.core.project.list();
	},

	show: function (list_callback) {
		this.project_list.init("#project_delete", list_callback);
		this.dialog.panel.show();
	},


	all_delete : function(){

		//every window close
		$(core.module.layout.workspace.window_manager.window).each(function (i) {
			this.close();
		});		

		//etc
		$("#goorm_main_toolbar .debug_continue, #goorm_main_toolbar .debug_terminate, #goorm_main_toolbar .debug_step_over, #goorm_main_toolbar .debug_step_in, #goorm_main_toolbar .debug_step_out").addClass('debug_not_active');
		$("#goorm_main_toolbar .debug").removeClass("debug_not_active");
		$("#Debug .menu-debug-continue, #Debug .menu-debug-terminate, #Debug .menu-debug-step-over, #Debug .menu-debug-step-in, #Debug .menu-debug-step-out").addClass('debug_not_active');
		$("#Debug .menu-debug-start").removeClass('debug_not_active');

		//go to project list state
		if (core.status.current_project_path !== "") {
			

			core.status.current_project_path = "";
			core.status.current_project_name = "";
			core.status.current_project_type = "";
			core.dialog.open_project.open("", "", "");
		}


		//real delete start

		for( o in core.workspace){
			if(!o)continue;

			$.get("project/delete", {
				project_path: o+''
			}, function (data) {
				core.module.layout.project_explorer.refresh();
			});
		}
	}
};
