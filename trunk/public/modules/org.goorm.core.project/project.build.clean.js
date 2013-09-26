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



org.goorm.core.project.build.clean = {
	dialog: null,
	buttons: null,
	chat: null,

	init: function () {
		var self = this;

		var handle_clean = function () {
			var project_array = [];

			$("#build_clean_list input[type=checkbox]:checked").each(function () {
				project_array.push($(this).val());
				var plugin = core.module.plugin_manager.plugins["org.goorm.plugin." + $(this).attr("projectType")];
				plugin && plugin.clean && plugin.clean($(this).attr("name"));
			});

			// not selected, send
			if (project_array.length === 0) {
				var result = {
					result: false,
					code: 4
				};
				core.module.project.display_error_message(result, 'alert');
				return false;
			} else {

				self.dialog.panel.hide();
			}
		};

		var handle_cancel = function () {
			this.hide();
		};

		this.buttons = [{
			id: "g_project_build_clean_btn_clean",
			text: "<span localization_key='clean'>Clean</span>",
			handler: handle_clean,
			isDefault: true
		}, {
			id: "g_project_build_clean_btn_cancel",
			text: "<span localization_key='cancel'>Cancel</span>",
			handler: handle_cancel
		}];

		this.dialog = org.goorm.core.project.build.clean.dialog;
		this.dialog.init({
			localization_key: "title_build_clean",
			title: "Build Clean",
			path: "configs/dialogs/org.goorm.core.project/project.build.clean.html",
			width: 400,
			height: 400,
			modal: true,
			opacity: true,
			buttons: this.buttons,
			success: function () {
				self.button_select_all = new YAHOO.widget.Button("build_clean_select_all");
				self.button_deselect_all = new YAHOO.widget.Button("build_clean_unselect_all");

				$("#build_clean_select_all").click(function () {
					self.select_all();
				});
				$("#build_clean_unselect_all").click(function () {
					self.unselect_all();
				});
			}
		});
		this.dialog = this.dialog.dialog;

	},

	show: function () {
		this.project_list();
		this.dialog.panel.show();
	},

	select_all: function () {
		$("#build_clean_list input[type=checkbox]").attr("checked", true);
	},

	unselect_all: function () {
		$("#build_clean_list input[type=checkbox]").attr("checked", false);
	},

	project_list: function () {
		$("#build_clean_list").empty();

		var data = core.workspace;
		for (var name in data) {
			if (core.module.plugin_manager.plugins["org.goorm.plugin." + data[name].type].build) {
				var icon_str = "";
				icon_str += "<div style='height:18px;padding:2px;'>";
				icon_str += "<span class='checkbox'><input type='checkbox' name='" + name + "' value='" + name + "' projectType='" + data[name].type + "' ";

				if (name == core.status.current_project_path) {
					icon_str += "checked='checked'";
				}

				icon_str += "id='claean_selector_" + name + "' class='claean_selectors'><label data-on data-off></label></span>";

				icon_str += "<label for='claean_selector_" + name + "' style='margin-left:4px;'>" + name + "</label>";
				icon_str += "</div>";
				if (name == core.status.current_project_path) {
					$("#build_clean_list").prepend(icon_str);
				} else {
					$("#build_clean_list").append(icon_str);
				}
				$("#claean_selector_" + name).click(function () {
					$(this).find("input").attr("checked", !$(this).find("input").attr("checked"));
				});
			}
		}
	}
};
