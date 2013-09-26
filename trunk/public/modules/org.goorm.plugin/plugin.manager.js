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



org.goorm.plugin.manager = {
	plugins: null,
	list: 0,
	interval: null,
	preference: null,
	toolbox_selector: null,

	init: function () {
		this.plugins = {};
		this.list = [];
	},

	get: function () {
		var self = this;

		//useonly(mode=basic)
		var url = "plugin/get_list";

		$.ajax({
			url: url,
			type: "GET",
			async: false,
			success: function (data) {
				self.list = eval(data);

				$(core).trigger("plugin_loaded");
			}
		});
		//useonlyend

		
	},

	load: function (index) {
		var self = this;

		if (index == this.list.length && this.list.length !== 0) {

			$("#toolbox_selectbox").prepend("<option value='all'>ALL</option>");

			return false;
		} else if (this.list.length !== 0) {
			if (index === 0) {
				$("#toolbox").html("<div id='toolbox_selector'></div>");
				$("#toolbox_selector").append("<select id='toolbox_selectbox' name='toolbox_selectbox' style='width:100%;'></select>");

				$("#toolbox_selectbox").change(function () {
					if ($(this).val() == "all") {
						$("#toolbox div").show();
					}
					$("#" + $("#toolbox_selector option:selected").val() + "_toolset").show();
				});
			}

			var get_plugin_data = function (plugin_name) {
				if (core.is_optimization) {
					if (plugin_name !== undefined) {
						var plug_type = plugin_name.split('.');
						plug_type = plug_type[plug_type.length - 1];

						if (org.goorm.plugin[plug_type]) {
							self.plugins[plugin_name] = new org.goorm.plugin[plug_type]();
							index++;
							self.load(index);
							core.module.preference.manager.get_default_file('/' + plugin_name + '/preference.json', function (json) {
								core.preference.plugins[plugin_name] || (core.preference.plugins[plugin_name] = {});
								core.preference.plugins[plugin_name] = $.extend(true, json, core.preference.plugins[plugin_name]);

								core.module.preference.preference_default.plugins[plugin_name] = {};
								core.module.preference.preference_default.plugins[plugin_name] = $.extend(true, core.module.preference.preference_default.plugins[plugin_name], json);

								self.plugins[plugin_name].init();
							});
						}
					}
				} else {
					if (plugin_name !== undefined) {
						$.getScript('/' + plugin_name + '/plug.js', function () {
							//Plugin initialization
							eval("self.plugins['" + plugin_name + "'] = new " + plugin_name + "();");
							self.plugins[plugin_name].init();

							index++;
							self.load(index);
							core.module.preference.manager.get_default_file('/' + plugin_name + '/preference.json', function (json) {
								core.preference.plugins[plugin_name] || (core.preference.plugins[plugin_name] = {});
								core.preference.plugins[plugin_name] = $.extend(true, json, core.preference.plugins[plugin_name]);

								core.module.preference.preference_default.plugins[plugin_name] = {};
								core.module.preference.preference_default.plugins[plugin_name] = $.extend(true, core.module.preference.preference_default.plugins[plugin_name], json);
							});

							$(core).trigger("goorm_loading");
						});
					}
				}
			};

			var plugin_name = this.list[index].name;
			get_plugin_data(plugin_name);
		}
	},

	new_project: function (data) {

		if (data.project_type == "goorm") {

		} else {
			if ($.isFunction(this.plugins["org.goorm.plugin." + data.project_type].new_project)) {
				this.plugins["org.goorm.plugin." + data.project_type].new_project(data);
			}
		}
	}
};
