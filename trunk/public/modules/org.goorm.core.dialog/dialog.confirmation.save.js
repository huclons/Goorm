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



org.goorm.core.dialog.confirmation.save = function () {
	this.panel = null;
	this.context_menu = null;
	this.path = null;
	this.title = null;
	this.type = null;
	this.left = null;
	this.top = null;
	this.width = null;
	this.height = null;
	this.yes_text = null;
	this.no_text = null;
	this.yes = null;
	this.no = null;

	this.handler_flag = true;
	this.handler_time = 2500;
};

org.goorm.core.dialog.confirmation.save.prototype = {
	init: function (option) {
		var self = this;

		this.title = option.title;
		this.message = option.message;

		this.yes_text = option.yes_text;
		this.cancel_text = option.cancel_text;
		this.no_text = option.no_text;

		this.yes = option.yes;
		this.cancel = option.cancel;
		this.no = option.no;

		this.title = this.title.split(" ").join("_");
		this.title_id = this.title.replace('?', "");
		this.timestamp = new Date().getTime();

		var goorm_dialog_container = $("#goorm_dialog_container");

		var handle_yes = function () {
			if (self.handler_flag) {
				self.handler_flag = false;

				if (typeof self.yes == "function")
					self.yes();
				this.hide();

				setTimeout(function() {
					self.handler_flag = true;
				}, self.handler_time)
			}
		};

		var handle_cancel = function () {
			if (self.handler_flag) {
				self.handler_flag = false;

				if (typeof self.cancel == "function")
					self.cancel();
				this.hide();

				setTimeout(function() {
					self.handler_flag = true;
				}, self.handler_time)
			}
		};

		var handle_no = function () {
			if (typeof self.no == "function")
				self.no();
			this.hide();
		};

		if (goorm_dialog_container.find('[id="panelContainer_' + this.title_id + '"]')) {
			goorm_dialog_container.find('[id="panelContainer_' + this.title_id + '"]').remove();
		}

		goorm_dialog_container.append("<div id='panelContainer_" + this.title_id + "'></div>");

		this.panel = new YAHOO.widget.SimpleDialog(
			"panelContainer_" + this.title_id, {
				width: '400px',
				visible: false,
				underlay: "none",
				close: true,
				draggable: true,
				text: this.message,
				constraintoviewport: true,
				fixedcenter: true,
				effect: {
					effect: YAHOO.widget.ContainerEffect.FADE,
					duration: 0.2
				},
				buttons: [{
					text: self.yes_text,
					handler: handle_yes,
					isDefault: true
				}, {
					text: self.cancel_text,
					handler: handle_cancel
				}, {
					text: self.no_text,
					handler: handle_no
				}]
			}
		);

		this.panel.setHeader(this.title.split("_").join(" "));
		this.panel.setBody("Loading Data...");
		this.panel.render();

		$('[id="panelContainer_' + this.title_id + '"]').css('font-size', '11px');

		$(document).keydown(function (e) {
			if (e.which == 27) {
				if (self.panel.cfg.config.visible.value && !core.status.keydown) {
					self.panel.hide();
				}
			}
			else if (e.which == 13) {
				if (self.panel.cfg.config.visible.value && !core.status.keydown && !alert.panel.cfg.config.visible.value && !notice.panel.cfg.config.visible.value) {
					handle_yes();

					core.status.keydown = true;
				}
			}
		});

		var __buttons = $('[id="panelContainer_' + this.title_id + '"]').find('.yui-button button');
		$(__buttons[0]).attr('id', 'g_c_s_btn_yes');
		$(__buttons[1]).attr('id', 'g_c_s_btn_cancel');
		$(__buttons[2]).attr('id', 'g_c_s_btn_no');
	}

};
