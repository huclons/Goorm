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



org.goorm.core.project.build.configuration = {
	dialog: null,

	init: function () {
		$(core).trigger("goorm_loading");
	},

	show: function () {
		if (core.status.current_project_path !== "") {
			var dialog = core.dialog.project_property.dialog;

			$("#property_tabview > div").each(function () {
				if ($(this).attr("plugin") == "org.goorm.plugin." + core.property.type) {
					$("#property_tabview > div").hide();
					$(this).show();
				}
			});
			dialog.panel.show();
			$(".current_plugin_info_node").next().addClass("ygtvfocus")
			setTimeout(function(){
				//$(".current_plugin_info_node").click();
				$("#property_treeview .current_plugin_info_node").filter(function(){
					return ($(this).parent().css('display')!="none");
				}).next().click();
			},700);
		} else {
			var result = {
				result: false,
				code: 5
			};
			core.module.project.display_error_message(result, 'alert');
		}
	}
};
