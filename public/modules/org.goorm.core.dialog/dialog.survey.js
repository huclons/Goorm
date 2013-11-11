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



org.goorm.core.dialog.survey = function () {
	this.panel = null;
	this.callback = null;
	this.title = null;
	this.message = null;
	this.msg_send = null;
	this.msg_no = null;
};

org.goorm.core.dialog.survey.prototype = {
	init: function (callback) {
		var self = this;
		self.title = core.module.localization.msg.survey_title.split(" ").join("_");
		self.message = core.module.localization.msg.survey_message;
		self.msg_send = core.module.localization.msg.survey_send;
		self.msg_no = core.module.localization.msg.survey_not_send;

		self.callback = callback;

		var goorm_dialog_container = $("#goorm_dialog_container");

		var handle_send = function () {
			var post_data = {
				title: "[Survey]" + core.user.name + "님의 사용자 의견입니다.",
				id: core.user.id,
				author: core.user.name,
				email: core.user.email,
				version: core.env.version,
				module: "사용자 의견",
				explanation: "<br/>" + ($("#survey_inputbox").val().split("<").join("").split(">").join("").split("\n").join("<br/>"))
			};
			
			$.ajax({
				url: "/help/send_to_bug_report",
				type: "GET",
				data: post_data,
				success: function (data) {
					self.callback();
					self.panel.hide();
				}
			});
		};

		var handle_cancel = function () {
			self.callback();
			this.hide();
		};

		if (goorm_dialog_container.find("#panelContainer_" + this.title + "_c")) {
			goorm_dialog_container.find("#panelContainer_" + this.title + "_c").remove();
		}

		goorm_dialog_container.append("<div id='panelContainer_" + this.title + "'></div>");

		this.panel = new YAHOO.widget.SimpleDialog(
			"panelContainer_" + this.title, {
				width: '430px',
				height: '250px',
				visible: false,
				underlay: "none",
				close: true,
				draggable: true,
				modal: true,
				text: "",
				constraintoviewport: true,
				fixedcenter: true,
				effect: {
					effect: YAHOO.widget.ContainerEffect.FADE,
					duration: 0.2
				},
				buttons: [{
					text: "<span localization_key='send'>" + self.msg_send + "</span>",
					handler: handle_send
				}, {
					text: "<span>" + self.msg_no + "</span>",
					handler: handle_cancel,
					isDefault: true
				}]
			}
		);

		this.panel.setHeader('<span>' + core.module.localization.msg.survey_title + '</span>');
		this.panel.setBody("Loading Data...");
		this.panel.render();

		$("#panelContainer_" + this.title).find(".button-group").css("text-align", "center");
		$("#panelContainer_" + this.title).css('font-size', '11px');

		$(document).on('keydown', 'esc', function () {
			if (self.panel.cfg.config.visible.value && !core.status.keydown) {
				self.panel.hide();
				self.callback();
			}
		});

		$(document).on('keydown', 'return', function (e) {
			if (self.buttons && self.panel.cfg.config.visible.value && !core.status.keydown) {
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
			var container = $('[id="head_survey"]');
			var data = $('[id="head_survey"]').clone(true).html();

			self.panel.setBody(data);
			$('[id="head_survey"]').remove();
			$("#survey_dialog_message").text(self.message);

			self.panel.subscribe('show', function () {
				var left = self.panel.cfg.config.x.value;
				var top = self.panel.cfg.config.y.value;

				var container = goorm_dialog_container.find("#panelContainer_" + self.title).parent();
				container.css('left', left + 'px').css('top', top + 'px');
			});

			self.panel.subscribe('hide', function () {
				var container = goorm_dialog_container.find("#panelContainer_" + self.title).parent();
				container.css('left', '-9999px').css('top', '-9999px');
			});

			var container = goorm_dialog_container.find("#panelContainer_" + this.title).parent();
			container.css('left', '-9999px').css('top', '-9999px');

			var __buttons = container.find('.yui-button button');
			$(__buttons[0]).attr('id', 'g_s_btn_send');
			$(__buttons[1]).attr('id', 'g_s_btn_cancel');
		} else {
			$.ajax({
				url: "file/get_contents",
				type: "GET",
				data: "path=public/configs/dialogs/org.goorm.core.survey/survey.html",
				success: function (data) {
					self.panel.setBody(data);
					$("#survey_dialog_message").text(self.message);

					self.panel.subscribe('show', function () {
						var left = self.panel.cfg.config.x.value;
						var top = self.panel.cfg.config.y.value;

						var container = goorm_dialog_container.find("#panelContainer_" + self.title).parent();
						container.css('left', left + 'px').css('top', top + 'px');
					});

					self.panel.subscribe('hide', function () {
						var container = goorm_dialog_container.find("#panelContainer_" + self.title).parent();
						container.css('left', '-9999px').css('top', '-9999px');
					});

					var container = goorm_dialog_container.find("#panelContainer_" + self.title).parent();
					container.css('left', '-9999px').css('top', '-9999px');

					var __buttons = container.find('.yui-button button');
					$(__buttons[0]).attr('id', 'g_s_btn_send');
					$(__buttons[1]).attr('id', 'g_s_btn_cancel');
				}
			});
		}
	}
};
