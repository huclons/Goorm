/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jshint newcap:false, debug:true, unused: true, evil: true, devel: true, plusplus: false, browser: true, jquery: true, undef:false */
/*clientside jslint comment for global */
/*global org: false, core: false, YAHOO: false, confirmation_save: false */
/*jshint unused: false */



org.goorm.core.project.build.project = {
	dialog: null,
	buttons: null,
	button_select_all: null,
	button_deselect_all: null,
	is_repeat: null,
	is_onclick: false,
	handle_build_for_run: null,
	flag: false,

	init: function () {

		var self = this;

		self.is_repeat = false;

		var handle_build = function (flag) {
			if (flag == 'run') {

				self.project_list();
				self.is_onclick = false;
				this.dialog.panel.show();
				this.dialog.panel.hide();
				var arr = $("#build_project_list").find('label');
				for (var i = 0; i < arr.length; i++) {
					if ($(arr[i]).text() == core.status.current_project_path) {

						$($(arr[i]).parent().find('input')[0]).attr("checked", "checked");
					}
				}

			}

			if ($("#build_project_list input[type=checkbox]:checked").length === 0) {
				var result = {
					result: false,
					code: 3
				};
				core.module.project.display_error_message(result, 'alert');
				return false;
			}

			$("#build_project_list input[type=checkbox]:checked").each(function () {
				var list = this;
				var window_manager = core.module.layout.workspace.window_manager;

				if (self.is_repeat) {
					confirmation_save.panel.hide();
				}
				//before build save all file open in window manager
				var window_manager = core.module.layout.workspace.window_manager;
				window_manager.save_all();
				if (window_manager.window[window_manager.active_window] && window_manager.window[window_manager.active_window].editor) {
					window_manager.window[window_manager.active_window].editor.save(true);
				}

				//and build start

				if (!self.is_onclick) {
					if (!$.isEmptyObject(core.module.plugin_manager.plugins["org.goorm.plugin." + $(list).attr("projectType")])) {
						core.module.layout.terminal.status = 'build';
						core.module.plugin_manager.plugins["org.goorm.plugin." + $(list).attr("projectType")].build($(list).val(), function (data) {
							self.flag = data;
							if (flag == 'run' && self.flag) {
								core.module.plugin_manager.plugins["org.goorm.plugin." + core.status.current_project_type].run(core.status.current_project_path);
							}
						});

						self.dialog.panel.hide();
					} else {
						self.flag = false;
						alert.show("Could not find a plugin to build this project");
					}
				} else {
					self.is_onclick = false;
				}

			});

			self.is_repeat = false; //by sim
			if (self.flag === true) {
				return true;
			} else if (self.flag === false) {
				return false;
			}
			this.hide();
		};

		var handle_cancel = function () {
			this.hide();
		};

		this.buttons = [{
			id: "g_project_build_project_btn_build",
			text: "<span localization_key='build'>Build</span>",
			handler: handle_build,
			isDefault: true
		}, {
			id: "g_project_build_project_btn_cancel",
			text: "<span localization_key='cancel'>Cancel</span>",
			handler: handle_cancel
		}];

		this.dialog = org.goorm.core.project.build.project.dialog;
		this.dialog.init({
			localization_key: "title_build_project",
			title: "Build Project",
			path: "configs/dialogs/org.goorm.core.project/project.build.project.html",
			width: 400,
			height: 400,
			modal: true,
			opacity: true,
			buttons: this.buttons,
			success: function () {
				self.button_select_all = new YAHOO.widget.Button("build_project_select_all");
				self.button_deselect_all = new YAHOO.widget.Button("build_project_deselect_all");

				$("#build_project_select_all").click(function () {
					self.select_all();
				});
				$("#build_project_deselect_all").click(function () {
					self.deselect_all();
				});
			}
		});
		this.dialog = this.dialog.dialog;

		self.handle_build_for_run = handle_build;
	},

	show: function () {
		var self = this;

		// if (core.property && core.status.is_running_end === false) {
		// 	alert.show(core.module.localization.msg.alert_plugin_not_while_running);
		// 	return false;
		// }

		//useonly(mode=basic)
		self.project_list();
		self.is_onclick = false;
		self.dialog.panel.show();
		//useonlyend

		
		
	},

	select_all: function () {
		var list=$("#build_project_list input[type=checkbox]");
		for(var i=0;i<list.length;i++){
			if(!list[i].checked)$(list[i]).click();
		}
	},

	deselect_all: function () {
		$("#build_project_list input[type=checkbox]").attr("checked", false);
	},

	project_list: function () {
		$("#build_project_list").empty();

		var data = core.workspace;
		for (var name in data) {
			if (!$.isEmptyObject(core.module.plugin_manager.plugins["org.goorm.plugin." + data[name].type])) {
				if (core.module.plugin_manager.plugins["org.goorm.plugin." + data[name].type].build) {
					var temp = "";
					temp += "<div style='height:18px;padding:2px;'>";
					temp += "<span class='checkbox'><input type='checkbox' name='" + name + "' value='" + name + "' projectType='" + data[name].type + "' ";

					if (name == core.status.current_project_path) {
						temp += "checked='checked'";
					}

					temp += "id='claean_selector_" + name + "' class='claean_selectors'><label data-on data-off></label></span>";
					temp += "<label for='claean_selector_" + name + "' style='margin-left:4px;'>" + name + "</label>";
					temp += "</div>";
					if (name == core.status.current_project_path) {
						$("#build_project_list").prepend(temp);
					} else {
						$("#build_project_list").append(temp);
					}

					$("#selector_" + name).click(function () {
						$(this).find("input").attr("checked", !$(this).find("input").attr("checked"));
					});
				}
			}
		}
	}
};
