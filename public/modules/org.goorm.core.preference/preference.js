/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jshint newcap:false, debug:true, unused: true, evil: true, devel: true, plusplus: false, browser: true, jquery: true, undef:false */
/*clientside jslint comment for global */
/*global org: false, core: false, YAHOO: false, localStorage: false */
/*jshint unused: false */



org.goorm.core.preference = {
	dialog: null,
	tabview: null,
	treeview: null,
	buttons: null,
	manager: null,
	ini: null,
	plugin: null,
	preference: null,
	firstShow: true,
	grid_opacity_slider: null,
	preference_default: null,

	init: function () {

		var self = this;
		this.manager = org.goorm.core.preference.manager;
		this.manager.init();

		this.dialog = org.goorm.core.preference.dialog;

		this.load_default();
		
		

		// Contect Menu - prevent super-menu click (==has submenu) 
		//
		$(document).on('click', '.yuimenuitemlabel-hassubmenu', function (){
			return false;
		});	
	},

	load_default: function () {
		var self = this;
		// read default preference file
		if (core.is_optimization) {
			var json = JSON.parse(external_json['public']['configs']['preferences']['default.json']);

			self.preference = json;
			core.preference = json;
			self.preference_default = $.extend(true, {}, json);
			self.load();

			$.get('/preference/workspace_path', function (data) {
				self.preference.workspace_path = data.path;
			});
		} else {
			this.manager.get_default_file("configs/preferences/default.json", function (json) {
				self.preference = json;
				core.preference = json;
				self.preference_default = $.extend(true, {}, json);
				self.load();

				$.get('/preference/workspace_path', function (data) {
					self.preference.workspace_path = data.path;
				});
			});
		}
	},

	load_preference: function (path) {
		this.manager.get_default_file(path, function (json) {
			$.extend(true, core.preference, json);
		});
	},

	// load from localStorage
	load: function () {
		$.each(core.preference, function (key, value) {
			if (!$.isEmptyObject(localStorage[key])) {
				if (key != "plugins") {
					core.preference[key] = localStorage[key];
				} else {
					// load plugin information
										var plugins = JSON.parse(localStorage[key]);
					$.each(plugins, function (name, plugin) {
						core.preference[key][name] = plugin;
					});
				}
			}
		});
		localStorage.workspace && (core.preference.workspace = JSON.parse(localStorage.workspace));
	},

	// save current preferences(core.preference) to localStorage or share.json
	save: function () {
		$.each(core.preference, function (key, value) {
			if (key == "share") {

			} else {
				if (typeof value == "object") {
					localStorage[key] = JSON.stringify(value);
				} else {
					localStorage[key] = value;
				}
			}
		});
	},

	save_to_database: function () {
		var user_theme = localStorage.getItem('preference.theme.current_theme');
		var current_project = localStorage.getItem('current_project');
		var language = localStorage.getItem('language');

		if (user_theme == "null") {
			user_theme = null;
		}

		var postdata = {
			'preference': {}
		};

		user_theme && (postdata.preference['preference.theme.current_theme'] = user_theme);
		current_project && (current_project != "null") && (postdata.preference.current_project = current_project);
		language && (postdata.preference.language = language);
		postdata.preference = JSON.stringify(postdata.preference);

		$.ajax({
			'type': 'POST',
			'url': '/user/preference/save',
			'data': postdata,
			'async': false,
			'success': function (result) {
				if (result) {
					console.log('user preference saved');
				}
			}
		});

	},

	apply: function (id) {
		var self = this;
		var target = "#preference_tabview";
		if (id) {
			target += " #" + id;
		}
		core.module.theme.load_css();
		this.read_dialog(core.preference);

		$(core).trigger("on_preference_confirmed");

		$(core.module.layout.workspace.window_manager.window).each(function (i) {
			if (this.alive && this.designer) {
				if (self.preference["preference.designer.show_preview"] == "true") {
					this.designer.canvas.toolbar.is_preview_on = false;
				} else {
					this.designer.canvas.toolbar.is_preview_on = true;
				}
				this.designer.canvas.toolbar.toggle_preview();

				if (self.preference["preference.designer.show_grid"] == "true") {
					this.designer.canvas.toolbar.is_grid_on = false;
				} else {
					this.designer.canvas.toolbar.is_grid_on = true;
				}
				this.designer.canvas.toolbar.toggle_grid();

				if (self.preference["preference.designer.show_ruler"] == "true") {
					this.designer.canvas.toolbar.is_ruler_on = false;
				} else {
					this.designer.canvas.toolbar.is_ruler_on = true;
				}
				this.designer.canvas.toolbar.toggle_ruler();

				if (self.preference["preference.designer.snap_to_grid"] == "true") {
					this.designer.canvas.snap_to_grid = false;
				} else {
					this.designer.canvas.snap_to_grid = true;
				}
				this.designer.canvas.toolbar.toggle_snap_to_grid();

				this.designer.canvas.toolbar.change_grid_unit(self.preference["preference.designer.grid_unit"]);

				this.designer.canvas.toolbar.change_grid_opacity(self.preference["preference.designer.grid_opacity"]);

				this.designer.canvas.toolbar.change_ruler_unit(self.preference["preference.designer.ruler_unit"]);

			}
		});
	},

	restore_default: function (id) {
		var self = this;
		if (id == "Theme") { 
			$('#theme_selectbox option').each(function (i, item) {
				if (/Default/.test($(item).html())) {
					core.module.theme.current_theme = core.module.theme.theme_data[i];
					$('#theme_selectbox').val(i);
					self.preference_default['preference.theme.current_theme'] = i;
					core.module.theme.on_theme_selectbox_change(i);
					return;
				}
			});
		} else {
			var target = "#preference_tabview";
			var restore_object = {};
			var flag = 0;
		}

		this.fill_dialog(self.preference_default);
	},

	read_dialog: function (preference) {
		var target = "#preference_tabview";

		var targets = $(target).children('div');

		var key = null;
		$.each(targets, function (index, div) {
			if ($(targets[index]).attr('plugin') == 'null') {
				key = preference;
			} else {
				key = preference.plugins[$(targets[index]).attr('plugin')];
			}

			$(targets[index]).find("input").each(function () {
				var value;
				
				if ($(this).attr("type") == "checkbox") {
					value = $(this).prop("checked");
				} else {
					value = $(this).val();
				}
				if($(this).attr("name")) {
					key[$(this).attr("name")] = value;
				}
			});

			$(targets[index]).find("textarea").each(function () {
				key[$(this).attr("name")] = $(this).val();
			});

			$(targets[index]).find("select").each(function () {
				key[$(this).attr("name")] = $(this).children("option:selected").val();
			});
		});
	},

	fill_dialog: function (preference) {
		var target = "#preference_tabview";

		var targets = $(target).children('div');

		var key = null;
		$.each(targets, function (index, div) {
			if ($(targets[index]).attr('plugin') == 'null') {
				key = preference;
			} else {
				key = preference.plugins[$(targets[index]).attr('plugin')];
			}

			$(targets[index]).find("input").each(function () {
				if (key[$(this).attr("name")]) {
					if ($(this).attr("type") == "checkbox") {

						if (key[$(this).attr("name")] == "true" || key[$(this).attr("name")] === true) {
							$(this).prop("checked", true);
						}
						//						else $(this).attr("checked",);
					} else {
						$(this).val(key[$(this).attr("name")]);
					}
				}
			});
			$(targets[index]).find("textarea").each(function () {
				if (key[$(this).attr("name")]) {
					$(this).val(key[$(this).attr("name")]);
				}
			});
			$(targets[index]).find("select").each(function () {
				if ($(this).attr("name") && $(this).attr("name") !== 'undefined' && key[$(this).attr("name")]) {
					$(this).children("option[value = " + key[$(this).attr("name")] + "]").attr("selected", "true");
					$(this).val(key[$(this).attr("name")]);
				}
			});
		});
	},

	show: function () {
		var self = this;
		this.dialog.panel.show();
		this.set_before();
		if (this.firstShow) {
			$("#preference_tabview #System").show();
			this.firstShow = false;
		}
		core.module.theme.set_modifiable();
		core.module.localization.before_language = localStorage.getItem("language");
	},

	set_before: function () {
		this.load();
		this.fill_dialog(core.preference);
	},

	init_dialog: function () {
		var self = this;
		var handle_ok = function (panel) {
			self.apply();
			self.save();

			if (typeof(this.hide) !== 'function' && panel) {
				panel.hide();
			}
			else{
				this.hide();
			}
		};

		var handle_cancel = function () {

			if (!core.is_mobile) {
				if (core.module.localization.before_language != localStorage.getItem("language")) {
					core.module.localization.change_language(core.module.localization.before_language, true);
				}
			}

			self.set_before();
			this.hide();
		};

		var set_dialog_button = function () {
			// set Apply, restore_default Button
			$("#preference_tabview").find(".apply").each(function (i) {
				$(this).attr("id", "applyBt_" + i);
				new YAHOO.widget.Button("applyBt_" + i, {
					onclick: {
						fn: function () {
							self.apply($("#preference_tabview #applyBt_" + i).parents(".yui-navset").attr("id"));
						}
					},
					label: '<span localization_key="apply">Apply</span>'
				});
			});

			$("#preference_tabview").find(".restore_default").each(function (i) {
				$(this).attr("id", "restore_defaultBt_" + i);
				new YAHOO.widget.Button("restore_defaultBt_" + i, {
					onclick: {
						fn: function () {
							self.restore_default($("#preference_tabview #restore_defaultBt_" + i).parents(".yui-navset").attr("id"));
						}
					},
					label: '<span localization_key="restore_default">Restore Default</span>'
				});
			});
		};

		var load_plugin_tree = function () {
			var plugin_node = null,
				plugin_list = core.module.plugin_manager.list,
				plugin_count = plugin_list.length;

			var get_plugin_data = function (plugin_name) {
				if (core.is_optimization) {
					var json = JSON.parse(external_json.plugins[plugin_name]['tree.json']);

					if (plugin_node === null) {
						plugin_node = self.manager.treeview.getNodeByProperty("html", "<span localization_key='plugin'>Plugin</span>");
					}
					if (json && json.preference) {
						// construct basic tree structure
						self.manager.add_treeview(plugin_node, json.preference);
						self.manager.add_tabview(json.preference, plugin_name);
						self.manager.treeview.render();
						self.manager.treeview.expandAll();
					}

					if (--plugin_count === 0) {
						// when all plugin tree loaded, render dialog buttons.
						set_dialog_button();
					}
				} else {
					$.getJSON("/" + plugin_name + "/tree.json", function (json) {
						if (plugin_node === null) {
							plugin_node = self.manager.treeview.getNodeByProperty("html", "<span localization_key='plugin'>Plugin</span>");
						}
						if (json && json.preference) {
							// construct basic tree structure
							self.manager.add_treeview(plugin_node, json.preference);
							self.manager.add_tabview(json.preference, plugin_name);
							self.manager.treeview.render();
							self.manager.treeview.expandAll();
						}
					}).complete(function () {
						if (--plugin_count === 0) {
							// when all plugin tree loaded, render dialog buttons.
							set_dialog_button();
						}
					});
				}
			};

			// load plugin tree.json
			$.each(core.module.plugin_manager.list, function (index, plugin) {
				var plugin_name = plugin.name;

				if (core.is_mobile) {
					var mobile_plugin_list = core.mobile.plugin_list;
					if (mobile_plugin_list.indexOf(plugin_name) < 0) {
						--plugin_count;
					} else {
						get_plugin_data(plugin_name);
					}
				} else {
					get_plugin_data(plugin_name);
				}
			});
		};

		this.buttons = [{
			id: "g_preference_btn_ok",
			text: "<span localization_key='ok'>OK</span>",
			handler: handle_ok,
			isDefault: true
		}, {
			id: "g_preference_btn_cancel",
			text: "<span localization_key='cancel'>Cancel</span>",
			handler: handle_cancel
		}];

		this.dialog.init({
			localization_key: "title_preference",
			title: "Preference",
			path: "configs/dialogs/org.goorm.core.preference/preference.html",
			width: 700,
			height: 500,
			modal: true,
			opacity: true,
			buttons: this.buttons,
			success: function () {
				// create default dialog tree and tabview
				if (core.is_optimization) {
					var json = JSON.parse(external_json['public']['configs']['dialogs']['org.goorm.core.preference']['tree.json']);

					// construct basic tree structure
					self.manager.create_treeview(json);
					self.manager.create_tabview(json);

					// load plugin tree
					load_plugin_tree();

					// TreeView labelClick function
					self.manager.treeview.subscribe("clickEvent", function (nodedata) {
						var label = nodedata.node.html;
						label = label.replace(/[/#. ]/, "");
						label = label.replace(/\s/g, '');
						if (/localization_key/.test(label)) label = $('#' + nodedata.node.contentElId).children().attr('tab_action');

						$("#preference_tabview > *").hide();
						$("#preference_tabview #" + label).show();

						if (/FileType/.test(label)) {
							$(".filetype_list").find("div").first().trigger('click');
						}

						if (/Designer/.test(label)) {
							self.grid_opacity_slider.setValue(parseInt($("#grid_opacity_slider_value").val() * 200, 10));
							$("#grid_opacity_slider_value_text").text(($("#grid_opacity_slider_value").val() * 100) + "%");
						}
						window.setTimeout(function () {
							$($("#preference_tabview #" + label).find('input[readonly!=readonly][type=text]')[0]).focus();
						}, 200);
					});

					self.grid_opacity_slider = YAHOO.widget.Slider.getHorizSlider("grid_opacity_sliderBg", "grid_opacity_slider_thumb", 0, 200, 20);
					self.grid_opacity_slider.animate = true;
					self.grid_opacity_slider.getRealValue = function () {
						return ((this.getValue() / 200).toFixed(1));
					};
					self.grid_opacity_slider.subscribe("change", function (offsetFromStart) {
						$("#grid_opacity_slider_value").val(self.grid_opacity_slider.getRealValue());
						$("#grid_opacity_slider_value_text").text((self.grid_opacity_slider.getRealValue() * 100) + "%");
					});

					var info = org.goorm.core.preference.info;
					info.init();

					var filetype = org.goorm.core.preference.filetype;
					filetype.init();

					var language = org.goorm.core.preference.language;
					language.init();

					$(core).trigger("preference_load_complete");
				} else {
					$.getJSON("configs/dialogs/org.goorm.core.preference/tree.json", function (json) {
						// construct basic tree structure
						self.manager.create_treeview(json);
						self.manager.create_tabview(json);

						// load plugin tree
						load_plugin_tree();

						// TreeView labelClick function
						self.manager.treeview.subscribe("clickEvent", function (nodedata) {
							var label = nodedata.node.html;
							label = label.replace(/[/#. ]/, "");
							label = label.replace(/\s/g, '');
							if (/localization_key/.test(label)) label = $('#' + nodedata.node.contentElId).children().attr('tab_action');

							$("#preference_tabview > *").hide();
							$("#preference_tabview #" + label).show();

							if (/FileType/.test(label)) {
								$(".filetype_list").find("div").first().trigger('click');
							}

							if (/Designer/.test(label)) {
								self.grid_opacity_slider.setValue(parseInt($("#grid_opacity_slider_value").val() * 200, 10));
								$("#grid_opacity_slider_value_text").text(($("#grid_opacity_slider_value").val() * 100) + "%");
							}
							window.setTimeout(function () {
								$($("#preference_tabview #" + label).find('input[readonly!=readonly][type=text]')[0]).focus();
							}, 200);
						});

						self.grid_opacity_slider = YAHOO.widget.Slider.getHorizSlider("grid_opacity_sliderBg", "grid_opacity_slider_thumb", 0, 200, 20);
						self.grid_opacity_slider.animate = true;
						self.grid_opacity_slider.getRealValue = function () {
							return ((this.getValue() / 200).toFixed(1));
						};
						self.grid_opacity_slider.subscribe("change", function (offsetFromStart) {
							$("#grid_opacity_slider_value").val(self.grid_opacity_slider.getRealValue());
							$("#grid_opacity_slider_value_text").text((self.grid_opacity_slider.getRealValue() * 100) + "%");
						});

						var info = org.goorm.core.preference.info;
						info.init();

						var filetype = org.goorm.core.preference.filetype;
						filetype.init();

						var language = org.goorm.core.preference.language;
						language.init();

						$(core).trigger("preference_load_complete");
					});
				}
			}
		});

		this.dialog = this.dialog.dialog;
	}

};
