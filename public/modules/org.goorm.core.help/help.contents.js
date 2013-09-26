/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jshint newcap:false, debug:true, unused: true, evil: true, devel: true, plusplus: false, browser: true, jquery: true, undef:false */
/*clientside jslint comment for global */
/*global org: false, YAHOO: false, localStorage: false */
/*jshint unused: false */



org.goorm.core.help.contents = {
	dialog: null,
	buttons: null,
	tabview: null,
	treeview: null,
	top: null,
	title: null,

	init: function () {
		var self = this;

		var handle_close = function () {

			this.hide();
		};

		this.buttons = [{
			id: "g_help_contents_btn_close",
			text: "<span localization_key='close'>Close</span>",
			handler: handle_close,
			isDefault: true
		}];

		this.top = [];
		this.title = [];

		this.dialog = new org.goorm.core.help.contents.dialog();
		this.dialog.init({
			localization_key: "title_help_contents",
			title: "Help Contents",
			path: "configs/dialogs/org.goorm.core.help/help.contents.html",
			width: 900,
			height: 600,
			modal: true,
			opacity: true,
			yes_text: "<span localization_key='close'>Close</span>",
			buttons: this.buttons,
			success: function () {

				var resize = new YAHOO.util.Resize("help_contents_left", {
					handles: ['r'],
					minWidth: 150,
					maxWidth: 350
				});

				resize.on('resize', function (ev) {
					var w = ev.width;
					$("#help_contents_middle").css('width', (900 - w - 50) + 'px');
				});

				self.treeview = new YAHOO.widget.TreeView("help_contents_treeview");
				self.treeview.render();

				for (var i = 0; i < self.treeview.root.children.length; i++) {
					var target = self.treeview.root.children[i];
					$('#' + target.labelElId).attr('localization_key', target.label);
				}

			}

		});

		this.dialog = this.dialog.dialog;

	},

	load: function () {
		var self = this;

		$.getJSON("help/get_readme_markdown?language=" + localStorage.getItem("language"), function (data) {
			$("#help_contents_middle").html(data.html);

			$('#help_contents_middle').find('h2').each(function (i) {
				self.top.push($(this).position().top);
				self.title.push($(this).text());
			});

			$('#help_contents_treeview').find('a').each(function (i) {
				if (i % 2 == 1) {
					var top = self.top.shift();
					var title = self.title.shift();

					$(this).html(title);
					$(this).parent().off("click");
					$(this).parent().click(function () {
						console.log(top);
						$('#help_contents_middle').scrollTop(top);
					});
				}
			});
		});
	},

	show: function () {
		this.dialog.panel.show();
	}

};
