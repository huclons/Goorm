/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jshint newcap:false, debug:true, unused: true, evil: true, devel: true, plusplus: false, browser: true, jquery: true, undef:false */
/*clientside jslint comment for global */
/*global org: false, YAHOO: false, core: false, confirmation: false */
/*jshint unused: false */



org.goorm.core.theme = {
	theme_data: null,
	previous_theme: null,
	current_theme: null,
	current_theme_data: null,
	details_dialog: null,
	apply_theme_button: null,
	details_button: null,

	init: function () {
		var self = this;

		self.apply_theme_button = new YAHOO.widget.Button({
			label: '<span localization_key="preview">Preview</span>',
			id: "theme_apply_button",
			container: "buttons_for_theme"
		});

		self.details_button = new YAHOO.widget.Button({
			label: '<span localization_key="details">Details</span>',
			id: "details_button",
			container: "wrap_selectbox"
		});

		function on_theme_apply_button_click(p_oEvent) {
			self.apply_theme();
		}

		function on_details_button_click(p_oEvent) {
			if (!core.is_optimization) {
				self.details_dialog.show();
			}
		}

		self.apply_theme_button.on("click", on_theme_apply_button_click);
		self.details_button.on("click", on_details_button_click);

		$.get("theme/get_list", "", function (data) {
			self.theme_data = data;
			self.make_theme_selectbox(true);
		});

		$(core).on('goorm_login_complete', function () {
			var theme_selectbox = $("#theme_selectbox");

			self.make_theme_selectbox(true);

			theme_selectbox.off("change");
			theme_selectbox.change(function () {
				if ($(this).val() == -1) {
					self.create_new_theme();
				} else {
					self.on_theme_selectbox_change($(this).val());
				}
			});
		});
	},

	//load theme select box 
	make_theme_selectbox: function (is_default) {
		var self = this;
		var theme_selectbox = $("#theme_selectbox");

		theme_selectbox.empty();

		var max_num = parseInt(theme_selectbox.width() / 8, 10);

		for (var theme_idx = 0; theme_idx < self.theme_data.length; theme_idx++) {
			var temp_name = self.theme_data[theme_idx].contents.title;

			if (temp_name.length > max_num) {
				temp_name = temp_name.substring(0, max_num - 1);
				temp_name += " …";
			}

			if (is_default && /Default/.test(self.theme_data[theme_idx].contents.title)) {
				core.preference["preference.theme.current_theme"] = theme_idx;
			}

			if (theme_idx == core.preference["preference.theme.current_theme"]) {
				// need to edit 
				theme_selectbox.append("<option value='" + theme_idx + "' selected>" + temp_name + "</option>");
				self.current_theme = self.theme_data[theme_idx];
				self.on_theme_selectbox_change(theme_idx);

				var css_node = $("link[kind='theme']");
				if (css_node.length === 0) {
					$("head").append("<link>");
					css_node = $("head").children(":last");
					css_node.attr({
						rel: "stylesheet",
						type: "text/css",
						href: "/configs/themes/" + self.current_theme.name + "/" + self.current_theme.name + ".css",
						kind: "theme"
					});
				} else {
					css_node.attr({
						href: "/configs/themes/" + self.current_theme.name + "/" + self.current_theme.name + ".css",
						kind: "theme"
					});
				}
			} else {
				theme_selectbox.append("<option value='" + theme_idx + "'>" + temp_name + "</option>");
			}
		}

		if (is_default) {
			$(core).trigger('theme_selectbox_complete');
		}

		if (!core.is_optimization) {
			//self.details_dialog = org.goorm.core.theme.details;
			//self.details_dialog.init(self);
		}
	},

	//select box change
	on_theme_selectbox_change: function (theme_idx) {
		var self = this;
		self.previous_theme = self.current_theme;
		self.current_theme = self.theme_data[theme_idx];

		var temp_description = self.current_theme.contents.description;
		var temp_date = self.current_theme.contents.date;
		var temp_author = self.current_theme.contents.author;

		var max_num = parseInt(($(".theme_info").width() - 80) / 8, 10);

		if (temp_description.length > max_num) {
			temp_description = temp_description.substring(0, max_num - 1);
			temp_description += " …";
		}

		if (temp_author.length > max_num) {
			temp_author = temp_author.substring(0, max_num - 1);
			temp_author += " …";
		}

		var theme_info = $(".theme_info");
		var theme_info_child = "";
		theme_info_child += "<div>Description : " + temp_description + "</div>";
		theme_info_child += "<div>Version : " + temp_date + "</div>";
		theme_info_child += "<div>Author : " + temp_author + "</div>";

		theme_info.empty();
		theme_info.append(theme_info_child);

		self.set_modifiable();
		self.get_theme_contents(theme_idx);
	},

	set_modifiable: function () {
		var self = this;

		if (self.current_theme && self.current_theme.contents && self.current_theme.contents.modifiable == "true") {
			$("#" + self.details_button._configs.id.value).show();
		} else {

			$("#" + self.details_button._configs.id.value).hide();
		}
	},

	get_theme_contents: function (theme_idx) {

		var self = this;
		var path = "/public/configs/themes/" + self.current_theme.name + "/" + self.current_theme.name + ".json";
		$.ajax({
			url: "theme/get_contents",
			type: "POST",
			data: {
				path: path
			},
			success: function (data) {

				self.current_theme_data = JSON.parse(data);
			}
		});
	},
	apply_theme: function () {
		var self = this;
		var url = "theme/put_contents";
		var path = self.current_theme.name + "/" + self.current_theme.name + ".css";
		var filedata = "";

		for (var element in self.current_theme_data) {
			filedata += self.current_theme_data[element].selector + " {\n";
			for (var property in self.current_theme_data[element].style) {
				if ($.isArray(self.current_theme_data[element].style[property])) {
					for (var style_cnt = 0; style_cnt < self.current_theme_data[element].style[property].length; style_cnt++) {
						filedata += "\t" + property + ":" + self.current_theme_data[element].style[property][style_cnt] + ";\n";
					}
				} else {
					filedata += "\t" + property + ":" + self.current_theme_data[element].style[property] + ";\n";
				}
			}
			filedata += "}\n";
		}

		$.ajax({
			url: url,
			type: "POST",
			data: {
				path: path,
				data: filedata
			},
			success: function (data) {
				//apply theme
				self.load_css();
			}
		});

		path = self.current_theme.name + "/" + self.current_theme.name + ".json";
		filedata = JSON.stringify(self.current_theme_data, null, '\t');

		$.ajax({
			url: url,
			type: "POST",
			data: {
				path: path,
				data: filedata
			},
			success: function (data) {
				//apply theme
				//m.s("Save complete! (" + self.filename + ")", "org.goorm.core.theme");
			}
		});

		confirmation.init({
			title: core.module.localization.msg.confirmation_theme,
			message: core.module.localization.msg.confirmation_theme,
			yes_text: core.module.localization.msg.confirmation_yes,
			no_text: core.module.localization.msg.confirmation_no,
			yes: function () {
				core.module.preference.apply();
			},
			no: function () {
				self.current_theme = self.previous_theme;
				$("#theme_selectbox [value=" + self.theme_data.indexOf(self.current_theme) + "]").attr("selected", true);
				self.on_theme_selectbox_change(self.theme_data.indexOf(self.current_theme));
				self.load_css();

			}
		});

		confirmation.panel.show();

	},
	load_css: function () {
		var self = this;

		//apply theme
		var css_node = $("link[kind='theme']");
		if (css_node.length === 0) {
			$("head").append("<link>");
			css_node = $("head").children(":last");
			css_node.attr({
				rel: "stylesheet",
				type: "text/css",
				href: "/configs/themes/" + self.current_theme.name + "/" + self.current_theme.name + ".css",
				kind: "theme"
			});
		} else {
			css_node.attr({
				href: "/configs/themes/" + self.current_theme.name + "/" + self.current_theme.name + ".css",
				kind: "theme"
			});
		}
	},
	//create new theme
	create_new_theme: function () {
		$(".theme_info").empty();
	}
};
