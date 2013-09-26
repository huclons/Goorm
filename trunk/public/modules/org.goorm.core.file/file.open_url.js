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



org.goorm.core.file.open_url = {
	dialog: null,
	tabview: null,
	buttons: null,
	treeview: null,

	init: function () {
		var self = this;
		var handle_ok = function (panel) {
			core.module.layout.workspace.window_manager.add($("#open_url_address").val(), $("#open_url_address").val(), "url", "Editor");

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
			id: "g_file_open_url_btn_ok",
			text: "<span localization_key='ok'>OK</span>",
			handler: handle_ok,
			isDefault: true
		}, {
			id: "g_file_open_url_btn_cancel",
			text: "<span localization_key='cancel'>Cancel</span>",
			handler: handle_cancel
		}];

		this.dialog = org.goorm.core.file.open_url.dialog;
		this.dialog.init({
			localization_key: "title_open_url",
			title: "Open URL",
			path: "configs/dialogs/org.goorm.core.file/file.open_url.html",
			width: 420,
			height: 150,
			modal: true,
			opacity: true,
			buttons: this.buttons,
			success: function () {
				if (core.is_optimization) {
					self.dialog.dialog.panel.subscribe('show', function () {
						$(self.dialog.panel.element).find('input[readonly!=readonly][type=text]').focus();
					});
					$(self.dialog.dialog.panel.element).find('input[readonly!=readonly][type=text]').unbind();
					$(self.dialog.dialog.panel.element).find('input[readonly!=readonly][type=text]').keydown(function(e){
						if(e.keyCode===13)	$("#g_file_open_url_btn_ok").click();
					});
				} else {
					self.dialog.panel.subscribe('show', function () {
						$(self.dialog.panel.element).find('input[readonly!=readonly][type=text]').focus();
					});
					$(self.dialog.panel.element).find('input[readonly!=readonly][type=text]').unbind();
					$(self.dialog.panel.element).find('input[readonly!=readonly][type=text]').keydown(function(e){
						if(e.keyCode===13)	$("#g_file_open_url_btn_ok").click();
					});
				}
				
			}
		});
		this.dialog = this.dialog.dialog;

		//this.dialog.panel.setBody("AA");
	},

	show: function () {
		this.dialog.panel.show();
	}
};
