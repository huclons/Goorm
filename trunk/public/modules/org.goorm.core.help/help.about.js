/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jshint newcap:false, debug:true, unused: true, evil: true, devel: true, plusplus: false, browser: true, jquery: true, undef:false */
/*clientside jslint comment for global */
/*global org: false */
/*jshint unused: false */



org.goorm.core.help.about = {
	dialog: null,
	buttons: null,
	tabview: null,
	treeview: null,

	init: function () {
		var self = this;

		var handle_ok = function (panel) {

			if (typeof(this.hide) !== 'function' && panel) {
				panel.hide();
			}
			else{
				this.hide();
			}
		};

		this.buttons = [{
			id: "g_help_about_btn_ok",
			text: "<span id = 'help_ok' localization_key='ok'>OK</span>",
			handler: handle_ok,
			isDefault: true
		}];

		this.dialog = new org.goorm.core.help.about.dialog();
		this.dialog.init({
			localization_key: "title_about_goorm",
			title: "About goorm",
			path: "configs/dialogs/org.goorm.core.help/help.about.html",
			width: 660,
			height: 570,
			modal: true,
			opacity: true,
			buttons: this.buttons,
			success: function () {
				//$('#help_about_container').parent().css('margin-bottom', '-10px');
				$("#help_ok").parent().keydown(function (e) {
					var ev = e || event;
					if (ev.keyCode == 27) {
						// esc key
						self.hide();
					}
				});
				$("#help_ok").parent().focus();
			}
		});
		this.dialog = this.dialog.dialog;
	},

	show: function () {
		this.dialog.panel.show();
	},

	hide: function () {
		this.dialog.panel.hide();
	}
};
