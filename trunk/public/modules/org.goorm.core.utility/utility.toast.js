/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jshint newcap:false, debug:true, unused: true, evil: true, devel: true, plusplus: false, browser: true, jquery: true, undef:false */
/*clientside jslint comment for global */
/*global org: false, YAHOO: false */
/*jshint unused: false */



org.goorm.core.utility.toast = {
	panel: null,
	default_duration: 0.5,

	init: function () {
		var self = this;

		this.panel = new YAHOO.widget.Panel("toast", {
			width: "240px",
			fixedcenter: true,
			close: false,
			draggable: false,
			zIndex: 9999,
			modal: true,
			visible: false,
			underlay: "none",
			effect: {
				effect: YAHOO.widget.ContainerEffect.FADE,
				duration: self.default_duration
			}
		});

		this.panel.setBody("");
		this.panel.render("goorm_dialog_container");
	},

	show: function (str, duration, callback) {
		var self = this;

		if(!str) str = "";

		this.panel.setBody(str);
		this.panel.show();

		if (duration !== undefined && typeof (duration) == "number") {
			window.setTimeout(function () {
				self.panel.hide();

				if (callback) {
					window.setTimeout(function () {
						callback();
					}, self.default_duration*1000 + 100);
				}

			}, duration);

		} else {
			//default
			window.setTimeout(function () {
				self.panel.hide();

				if (callback) {
					window.setTimeout(function (){
						callback();
					}, self.default_duration*1000 + 100);
				}
			}, 1000);
		}
	}
};
