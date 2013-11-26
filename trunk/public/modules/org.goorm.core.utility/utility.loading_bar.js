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



org.goorm.core.utility.loading_bar = {
	loading_bar: null,
	counter: 0,

	init: function () {
		var self = this;
		this.loading_bar = new YAHOO.widget.Panel("wait", {
			width: "240px",
			fixedcenter: true,
			close: false,
			draggable: false,
			zIndex: 9999,
			modal: true,
			visible: false
		});

		this.loading_bar.setHeader("");
		this.loading_bar.setBody('<img src="images/org.goorm.core.utility/loading_bar.gif" />');
		this.loading_bar.render("goorm_dialog_container");

		$('#wait .bd').css('border-bottom-left-radius', '5px').css('border-bottom-right-radius', '5px');
	},

	start: function (str) {
		this.loading_bar.setHeader(str);
		this.loading_bar.show();
		//this.counter++;
	},

	stop: function () {
		// this.counter--;
		// if (this.counter === 0) {
		// }
		this.loading_bar.hide();
		
	}
};
