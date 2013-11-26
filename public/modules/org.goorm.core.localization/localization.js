/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jshint newcap:false, debug:true, unused: true, evil: true, devel: true, plusplus: false, browser: true, jquery: true, undef:false */
/*clientside jslint comment for global */
/*global org: false, core: false, localStorage: false */
/*jshint unused: false */



org.goorm.core.localization = {
	language: null,
	before_language: null,
	msg: {},
	language_data: {},
	is_first: true,
	version: {},

	init: function () {

		this.get_version();
	},

	get_version: function () {
		var self = this;

		$.getJSON("configs/languages/version.json", function (data) {
			self.version = data;

			var broswer_language = navigator.language || navigator.userLanguage;
			broswer_language = (/ko/.test(broswer_language)) ? 'kor' : 'us';

			var local_version = self.parse_version(localStorage.getItem('language.version'));
			var language = (localStorage.getItem("language") && (localStorage.getItem("language") != 'null') && (localStorage.getItem("language") != 'undefined')) ? localStorage.getItem("language") : broswer_language;

			self.language = language;
			self.load_json();

			if (!$.isEmptyObject(local_version)) {
				if (!$.isEmptyObject(data)) {
					var local_version = self.parse_version(localStorage.getItem('language.version'));
					var current_language_version = (local_version[language]) ? local_version[language] : {};
					var server_version = data;

					// key : dialog, dict, menu, msg, title
					for (var key in server_version) {
						var local_key_version = (!current_language_version[key]) ? 0 : current_language_version[key];

						if (server_version[key] > local_key_version) {
							self.get_json(language, key);
						} else {
							if (!self.language_data[language]) self.language_data[language] = {};

							if (self.language_data[language][key]) {
								self.apply(self.language_data[language][key]);
								if (key == 'msg') {
									self.apply_message(self.language_data[language][key]);
								}
							} else {
								self.get_json(language, key);
							}
						}
					}

					localStorage.setItem('language.version', self.stringify_version(language, data));
				} else {
					var get_type_list = ['dialog', 'dict', 'menu', 'msg', 'title'];
					for (var i = 0; i < get_type_list.length; i++) {
						self.get_json(language, get_type_list[i]);
					}

					console.log('[Error] Fail to get server version');
				}
			} else {
				var server_version = data;

				if (!$.isEmptyObject(data)) {
					for (var key in server_version) {
						self.get_json(language, key);
					}

					localStorage.setItem('language.version', self.stringify_version(language, data));
				}
			}
		});
	},

	parse_version: function (data) {
		var version = {};

		if (data) {
			if (data != 'undefined' && data != 'null') {
				return JSON.parse(data);
			} else {
				return version;
			}
		} else {
			return version;
		}
	},

	stringify_version: function (language, data) {
		var current_language_version = this.parse_version(localStorage.getItem('language.version'));
		current_language_version[language] = data;

		return JSON.stringify(current_language_version);
	},

	get_json: function (language, type) {
		var self = this;

		$.getJSON("configs/languages/" + language + "." + type + ".json", function (data) {
			if (!self.language_data[language]) self.language_data[language] = {};

			self.language_data[language][type] = data;
			self.apply(data);

			if (type == 'msg') {
				self.apply_message(data);
			}

			self.store_json();
		});


		/*
		*	get language files in plugin
		*/
		var get_plugin_language = function(){
			for(var i=0; i < core.module.plugin_manager.list.length; i++) {
				var plugin = core.module.plugin_manager.list[i].name;
				
				if (/phonegap/.test(plugin)) {
					$.ajax({
						url: plugin+"/languages/"+language+".json",
						dataType: 'json',
						beforeSend: function(){
							this.pluginName = plugin;
						},
						success: function(res){
							if (!self.language_data[language]) self.language_data[language] = {};
						 	self.apply(res);
						 	self.language_data[language][this.pluginName] = res;
						 	self.store_json();
						}
					});
				}
			}
		};
		if(!core.module.plugin_manager.list.length) {
			$(core).one("plugin_loaded", function(){
				get_plugin_language();
			});
		}
		else {
			get_plugin_language();
		}
	},

	load_json: function () {
		var data = (localStorage.getItem('language.data') && localStorage.getItem('language.data') != 'null' && localStorage.getItem('language.data') != 'undefined') ? localStorage.getItem('language.data') : "{}";

		this.language_data = JSON.parse(data);
	},

	store_json: function () {
		var data = this.language_data;

		localStorage.setItem('language.data', JSON.stringify(data));
	},

	work_queue: function () {

	},

	change_language: function (language, flag) {
		var self = this;

		var broswer_language = navigator.language || navigator.userLanguage;
		broswer_language = (/ko/.test(broswer_language)) ? 'kor' : 'us';

		var __language = (language && language != 'null' && language != 'undefined') ? language : broswer_language;
		self.language = __language;
		localStorage.setItem('language', __language);

		var current = "";
		if (__language == "us") {
			current = "English";
		} else if (__language == "kor") {
			current = "한국어";
		}
		$("#language_button-button").text(current);

		if (self.language_data[__language]) {
			for (var key in self.language_data[__language]) {
				var data = self.language_data[__language][key];

				self.apply(data);

				if (key == 'msg') {
					self.apply_message(data);
				}
			}

			core.dialog.help_contents.load();
		} else {
			var get_type_list = ['dialog', 'dict', 'menu', 'msg', 'title'];
			for (var i = 0; i < get_type_list.length; i++) {
				self.get_json(__language, get_type_list[i]);
			}

			localStorage.setItem('language.version', self.stringify_version(__language, self.version));
			core.dialog.help_contents.load();
		}
	},

	apply: function (data) {
		var self = this;
		if (data) {
			$.each(data, function (key, value) {
				var localizations = $("[localization_key='" + key + "']");
				var helptext = localizations.find(".helptext").html();

				localizations.html(this.value);

				if (helptext) {
					localizations.append("<em class='helptext'>" + helptext + "</em>");
				}

				// attach tooltip
				$("[tooltip='" + key + "']").attr("title", this.value);

				if (this.children) {
					self.apply(this.children);
				}
			});
		}
	},

	local_apply: function (area, type) {
		var self = this;
		var language = this.language;

		var replace_value = function (area, data) {
			if (data) {
				$.each(data, function (key, value) {
					var localizations = $(area + " [localization_key='" + key + "']");
					var helptext = localizations.find(".helptext").html();

					localizations.html(this.value);

					if (helptext) {
						localizations.append("<em class='helptext'>" + helptext + "</em>");
					}

					// attach tooltip
					$(area + " [tooltip='" + key + "']").attr("title", this.value);

					if (this.children) {
						replace_value(area, this.children);
					}
				});
			}
		};

		switch (type) {
		case 'dialog':
		case 'dict':
		case 'menu':
		case 'msg':
		case 'title':
			replace_value(area, self.language_data[language][type]);
			break;

		default:
			replace_value(area, self.language_data[language]['dialog']);
			replace_value(area, self.language_data[language]['dict']);
			replace_value(area, self.language_data[language]['menu']);
			replace_value(area, self.language_data[language]['msg']);
			replace_value(area, self.language_data[language]['title']);
			break;
		}
	},

	apply_message: function (data) {
		var self = this;

		if (data !== null) {
			$.each(data, function (key, value) {
				eval("self.msg[\"" + key + "\"]" + "=\"" + this.value + "\";");
			});
		}

		if (self.is_first && self.language == "kor" && localStorage) {
			if (!localStorage.getItem('language.confirmation.automatic_change')) {
				confirmation.init({
					message: core.module.localization.msg.confirmation_language_message,
					yes_text: core.module.localization.msg.confirmation_language_message_yes,
					no_text: core.module.localization.msg.confirmation_language_message_no,

					title: "Language Automatic Change",

					yes: function () {
						self.language = 'kor';

						self.is_first = false;
						localStorage.setItem('language.confirmation.automatic_change', true);

						core.module.localization.change_language(self.language);
					},
					no: function () {
						self.is_first = false;
						localStorage.setItem('language.confirmation.automatic_change', true);

						core.module.localization.change_language("us");
					}
				});

				confirmation.panel.show();
			}
		} else {
			self.is_first = false;
		}
	},

	refresh: function (flag) {
		var self = this;
		var language = "";
		if (flag) {
			if (localStorage.getItem("language") === null) {
				if (core.server_language == "client") {
					if (navigator.language == "ko") {
						language = "kor";
					} else {
						language = "us";
					}
				} else {
					language = core.server_language;
				}

				self.change_language(language, true);
			} else {
				self.change_language(localStorage.getItem("language"), true);
			}

		} else {
			if (localStorage.getItem("language") === null) {
				if (core.server_language == "client") {
					if (navigator.language == "ko") {
						language = "kor";
					} else {
						language = "us";
					}
				} else {
					language = core.server_language;
				}

				self.change_language(language);
			} else {
				self.change_language(localStorage.getItem("language"));
			}
		}
	}
};
