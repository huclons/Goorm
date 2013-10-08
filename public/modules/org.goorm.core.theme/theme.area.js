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



org.goorm.core.theme.area = {
	dialog: null,
	buttons: null,
	parent: null,
	target: null,

	init: function (parent) {
		var self = this;

		this.parent = parent;

		var handle_ok = function (panel) {
			var errCode = 0;

			var newArea = $("#newArea");

			$("div.area_cell").each(function () {
				if ($(this).text() == newArea.attr("value")) {
					errCode = 1;
				}
			});

			if (newArea.attr("value").indexOf(" ") > -1) {
				errCode = 2;
			}

			if (errCode === 0) {
				parent.part_array.push(newArea.attr("value"));
				var string = "<div class='area_cell newAreaCell " + newArea.attr("value") + "'>" + newArea.attr("value") + "</div>";
				$(self.target).before(string);

				string = "";
				string += "<div id='css_box" + newArea.attr("value") + "' class='css_box newCssBox'>";
				string += "<div id='" + newArea.attr("value") + "Cell" + i + "' class='css_cell add_new_css newCssCell'><div style='float:left; margin-left:5px;  margin-top:7px; font-size:11px'>Add New CSS</div></div>";
				string += "</div>";
				$(".themeContents").append(string);

				$(".newAreaCell").on('click', self.parent.area_box_click_function, this);
				$(".newCssCell").on("click", self.parent.css_box_click_function, this);
				$(".newCssBox").hide();

				$(".newAreaCell").removeClass("newCssCell");
				$(".newCssCell").removeClass("newCssCell");
				$(".newCssBox").removeClass("newCssCell");
			} else {
				if (errCode == 1)
					alert.show(core.module.localization.msg.alert_naming);
				else
					alert.show(core.module.localization.msg.alert_value);
			}

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

		this.dialog = org.goorm.core.theme._css.dialog;
		this.dialog.init({
			localization_key: "title_add_new_area",
			title: "Add New Area",
			path: "configs/preferences/org.goorm.core.theme/theme.area.html",
			width: 220,
			height: 150,
			modal: true,
			opacity: true,
			buttons: this.buttons,
			success: function () {}
		});

		this.dialog = this.dialog.dialog;

	},

	show: function (target) {
		var self = this;
		this.target = target;

		this.dialog.panel.show();
	},

};
