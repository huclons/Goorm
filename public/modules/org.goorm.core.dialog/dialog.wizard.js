/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jshint newcap:false, debug:true, unused: true, evil: true, devel: true, plusplus: false, browser: true, jquery: true, undef:false */
/*clientside jslint comment for global */
/*global org: false, core: false, YAHOO: false, confirmation: false, notice: false */
/*jshint unused: false */



org.goorm.core.dialog.wizard = function () {
	this.total_step = null;
	this.step = null;
	this.panel = null;
	this.context_menu = null;
	this.path = null;
	this.title = null;
	this.type = null;
	this.left = null;
	this.top = null;
	this.width = null;
	this.height = null;
	this.yes = null;
	this.no = null;
	this.buttons = null;
	this.success = null;
	this.kind = null;
	this.next = null;
};

org.goorm.core.dialog.wizard.prototype = {
	init: function (option) {
		var self = this;

		this.step = 1;

		this.localization_key = option.localization_key;
		this.title = option.title;
		this.path = option.path;
		this.width = option.width;
		this.height = option.height;
		this.modal = option.modal;

		this.buttons = option.buttons;


		this.success = option.success;

		this.title = this.title.split(" ").join("_");
		this.kind = option.kind;

		this.next = option.next;
		this.container_id = 'panelContainer_' + this.title;

		var goorm_dialog_container = $("#goorm_dialog_container");

		if (goorm_dialog_container.find("#panelContainer_" + this.title)) {
			goorm_dialog_container.find("#panelContainer_" + this.title).remove();
		}

		goorm_dialog_container.append("<div id='panelContainer_" + this.title + "'></div>");

		var handle_next = function () {
			if (!self.next()) {
				return false;
			}

			var goorm_dialog_container_bd = goorm_dialog_container.find("#panelContainer_" + self.title).find(".bd");

			if (self.step < self.total_step) {
				self.show_previous_button(true);

				goorm_dialog_container_bd.find(".wizard_step[step='" + self.step + "']").hide();
				if (goorm_dialog_container_bd.find(".wizard_step[step='" + self.step + "']")) {
					self.step++;
					goorm_dialog_container_bd.find(".wizard_step[step='" + self.step + "']").show();
					if (self.step == self.total_step) {
						self.show_next_button(false);
					}
				}
			}
		};

		var handle_prev = function () {
			var goorm_dialog_container_bd = goorm_dialog_container.find("#panelContainer_" + self.title).find(".bd");

			if (1 < self.step) {
				self.show_next_button(true);
				goorm_dialog_container_bd.find(".wizard_step[step='" + self.step + "']").hide();
				self.step--;

				if (self.step == 1) {
					self.show_previous_button(false);
				}

				goorm_dialog_container_bd.find(".wizard_step[step='" + self.step + "']").show();
			}
		};

		this.buttons.unshift({
			text: "<span localization_key='next'>Next</span>",
			handler: handle_next
		});
		this.buttons.unshift({
			text: "<span localization_key='previous'>Previous</span>",
			handler: handle_prev
		});

		this.panel = new YAHOO.widget.Dialog(
			"panelContainer_" + this.title, {
				width: self.width + 'px',
				height: self.height + 'px',
				visible: false,
				underlay: "none",
				close: true,
				autofillheight: "body",
				draggable: true,
				constraintoviewport: true,
				modal: self.modal,
				fixedcenter: true,
				effect: {
					effect: YAHOO.widget.ContainerEffect.FADE,
					duration: 0.2
				},
				buttons: this.buttons
			}
		);

		this.panel.setHeader('<span localization_key="' + this.localization_key + '">' + this.title.split("_").join(" ") + '</span>');
		this.panel.setBody("Loading Data...");
		this.panel.render();

		//$(document).off('keydown', 'esc');
		// $(document).on('keydown', 'esc', function () {
		$(document).keydown(function (e) {
			if (e.which == 27) {
				if (confirmation.panel === null || confirmation.panel === undefined) {
					confirmation.panel = {};
					confirmation.panel.cfg = {};
					confirmation.panel.cfg.config = {};
					confirmation.panel.cfg.config.visible = {};
					confirmation.panel.cfg.config.visible.value = false;
				}

				if (self.buttons && self.panel.cfg.config.visible.value && !core.status.keydown && !alert.panel.cfg.config.visible.value && !notice.panel.cfg.config.visible.value && !confirmation.panel.cfg.config.visible.value) {
					$(self.buttons).each(function (i) {
						if (/cancel/.test(this.text) || /close/.test(this.text)) {
							this.hide = function () {};
							this.handler();

							core.status.keydown = true;

							self.panel.hide();
						}
					});
				}
			}
		});

		//$(document).off('keydown', 'return');
		$(document).on('keydown', 'return', function (e) {
			if (confirmation.panel === null || confirmation.panel === undefined) {
				confirmation.panel = {};
				confirmation.panel.cfg = {};
				confirmation.panel.cfg.config = {};
				confirmation.panel.cfg.config.visible = {};
				confirmation.panel.cfg.config.visible.value = false;
			}

			if (self.buttons && self.panel.cfg.config.visible.value && !core.status.keydown && !alert.panel.cfg.config.visible.value && !notice.panel.cfg.config.visible.value && !confirmation.panel.cfg.config.visible.value) {
				$(self.buttons).each(function (i) {
					if (this.isDefault) {
						this.hide = function () {};
						this.handler();

						core.status.keydown = true;
					}
				});
			}
		});

		if (core.is_optimization) {
			var get_name = function (path) {
				var full_name = path.split('/');
				full_name = full_name[full_name.length - 1].split('.');
				full_name.pop();
				full_name = full_name.join('.');
				full_name = full_name.trim();

				return full_name;
			};

			var full_name = get_name(self.path);
			var data = $('[id="head_' + full_name + '"]').clone(true).html();

			self.panel.setBody(data);
			$('[id="head_' + full_name + '"]').remove();

			if (typeof self.success == "function")
				self.success();

			self.panel.subscribe('show', function () {
				var left = self.panel.cfg.config.x.value;
				var top = self.panel.cfg.config.y.value;

				var container = goorm_dialog_container.find('[id="' + self.container_id + '"]').parent();
				container.css('left', left + 'px').css('top', top + 'px');
			});

			self.panel.subscribe('hide', function () {
				var container = goorm_dialog_container.find('[id="' + self.container_id + '"]').parent();
				container.css('left', '-9999px').css('top', '-9999px');
			});

			var container = goorm_dialog_container.find('[id="' + self.container_id + '"]').parent();
			container.css('left', '-9999px').css('top', '-9999px');

			var __buttons = container.find('.yui-button button');
			$(__buttons[0]).attr('id', 'g_w_btn_previous');
			$(__buttons[1]).attr('id', 'g_w_btn_next');
			$(__buttons[2]).attr('id', 'g_w_btn_ok');
			$(__buttons[3]).attr('id', 'g_w_btn_cancel');

			core.dialog.loaded_count++;
		} else {
			var url = "file/get_contents";

			$.ajax({
				url: url,
				type: "GET",
				data: "path=public/" + self.path,
				success: function (data) {

					self.panel.setBody(data);

					if (typeof self.success == "function")
						self.success();

					self.panel.subscribe('show', function () {
						var left = self.panel.cfg.config.x.value;
						var top = self.panel.cfg.config.y.value;

						var container = goorm_dialog_container.find('[id="' + self.container_id + '"]').parent();
						container.css('left', left + 'px').css('top', top + 'px');
					});

					self.panel.subscribe('hide', function () {
						var container = goorm_dialog_container.find('[id="' + self.container_id + '"]').parent();
						container.css('left', '-9999px').css('top', '-9999px');
					});

					var container = goorm_dialog_container.find('[id="' + self.container_id + '"]').parent();
					container.css('left', '-9999px').css('top', '-9999px');

					var __buttons = container.find('.yui-button button');
					$(__buttons[0]).attr('id', 'g_w_btn_previous');
					$(__buttons[1]).attr('id', 'g_w_btn_next');
					$(__buttons[2]).attr('id', 'g_w_btn_ok');
					$(__buttons[3]).attr('id', 'g_w_btn_cancel');

					core.dialog.loaded_count++;

					if (core.dialog.loaded_count == (Object.keys(core.dialog).length - 1)) {

					}

					$(core).trigger("goorm_loading");
				}
			});
		}

		self.show_previous_button(false);
		return this;
	},

	show_previous_button: function (show) {
		var self = this;
		if (show) {
			self.panel._aButtons[0].set("disabled", false);
			self.panel._aButtons[2].set("disabled", false);
		} else {
			self.panel._aButtons[0].set("disabled", true);
			self.panel._aButtons[2].set("disabled", true);
		}
	},

	show_next_button: function (show) {
		var self = this;
		if (show) {
			self.panel._aButtons[1].set("disabled", false);
		} else {
			self.panel._aButtons[1].set("disabled", true);
		}
	},

	showFirstPage: function () {
		var self = this;
		self.step = 1;
		$("#goorm_dialog_container").find("#panelContainer_" + self.title).find(".bd .wizard_step").each(function (i) {
			$(this).hide();
			if (i === 0) {
				$(this).show();
			}
		});
		self.show_previous_button(false);
		self.show_next_button(true);
	}

};
