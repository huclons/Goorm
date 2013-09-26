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



org.goorm.core.file.switch_workspace = {
	dialog: null,
	buttons: null,
	tabview: null,
	treeview: null,

	init: function () {

		var handle_ok = function (panel) {
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
			text: "<span localization_key='ok'>OK</span>",
			handler: handle_ok,
			isDefault: true
		}, {
			text: "<span localization_key='cancel'>Cancel</span>",
			handler: handle_cancel
		}];

		this.dialog = org.goorm.core.file.switch_workspace.dialog;
		this.dialog.init({
			localization_key: "title_switch_workspace",
			title: "Switch Workspace",
			path: "configs/dialogs/org.goorm.core.file/file.switch_workspace.html",
			width: 600,
			height: 250,
			modal: true,
			opacity: true,
			buttons: this.buttons
		});
		this.dialog = this.dialog.dialog;

		//this.dialog.panel.setBody("AA");
	},

	show: function () {
		this.dialog.panel.show();
	}
};
