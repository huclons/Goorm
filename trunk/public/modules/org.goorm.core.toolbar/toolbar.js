/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jshint newcap:false, debug:true, unused: true, evil: true, devel: true, plusplus: false, browser: true, jquery: true, undef:false */
/*clientside jslint comment for global */
/*global org: false, core: false, YAHOO: false, localStorage: false */
/*jshint unused: false */



org.goorm.core.toolbar = {
	context_menu: null,
	order: null,
	index: 0,
	index_check: 0,

	init: function () {
		var self = this;
		this.order = localStorage['toolbar.order'];
		this.index = 0;
		this.index_check = 0;

		$(this).one("toolbarLoaded", self.set_draggable);

		// initialize toolbar
		if (this.order) {
			this.order = this.order.split("|");

			for (var i = 0; i < this.order.length; i++) {
				this.add("public/configs/toolbars/" + this.order[i] + "/" + (this.order[i].split(".")).pop() + ".toolbar.html", this.order[i], "goorm_main_toolbar");
			}
		} else {
			if (core.is_mobile) {
				this.order = new Array("org.goorm.core.file", "org.goorm.core.edit", "org.goorm.core.project", "org.goorm.core.debug");

				localStorage['toolbar.order'] = this.order.join("|");

				this.add("public/configs/toolbars/org.goorm.core.file/file.toolbar.html", "org.goorm.core.file", "goorm_main_toolbar");
				this.add("public/configs/toolbars/org.goorm.core.edit/edit.toolbar.html", "org.goorm.core.edit", "goorm_main_toolbar");
				this.add("public/configs/toolbars/org.goorm.core.project/project.toolbar.html", "org.goorm.core.project", "goorm_main_toolbar");
				this.add("public/configs/toolbars/org.goorm.core.debug/debug.toolbar.html", "org.goorm.core.debug", "goorm_main_toolbar");
			} else {
				this.order = new Array("org.goorm.core.file", "org.goorm.core.edit", "org.goorm.core.project", "org.goorm.core.debug", "org.goorm.core.window");

				localStorage['toolbar.order'] = this.order.join("|");

				this.add("public/configs/toolbars/org.goorm.core.file/file.toolbar.html", "org.goorm.core.file", "goorm_main_toolbar");
				this.add("public/configs/toolbars/org.goorm.core.edit/edit.toolbar.html", "org.goorm.core.edit", "goorm_main_toolbar");
				this.add("public/configs/toolbars/org.goorm.core.project/project.toolbar.html", "org.goorm.core.project", "goorm_main_toolbar");
				this.add("public/configs/toolbars/org.goorm.core.debug/debug.toolbar.html", "org.goorm.core.debug", "goorm_main_toolbar");
				this.add("public/configs/toolbars/org.goorm.core.window/window.toolbar.html", "org.goorm.core.window", "goorm_main_toolbar");
			}
		}
	},
	set_draggable: function () {
		var self = this;
		var ddList = [];
		var Dom = YAHOO.util.Dom;

		// init menu.action
		for (var i = 0; i < self.order.length; i++) {
			ddList[i] = new YAHOO.util.DD((self.order[i].split(".")).pop() + ".toolbar");
			ddList[i].setHandleElId("toolbar_handle_" + self.order[i]);

			var here = this;
			var destEl = null;

			ddList[i].on('startDragEvent', function (ev) {
				$("div.toolbar_moving_handle").css("background", "#eee");
				here.dragEl = this.getDragEl();
			}, ddList[i], true);

			ddList[i].on('dragEnterEvent', function (ev, id) {
				destEl = Dom.get(ev.info);
			}, ddList[i], true);

			ddList[i].on('dragOverEvent', function (ev, id) {
				if (Math.abs(Dom.getX(destEl) - Dom.getX(here.dragEl)) < 14) {
					Dom.setStyle(Dom.getFirstChild(destEl), "background", "#fcc");
				} else {
					Dom.setStyle(Dom.getFirstChild(destEl), "background", "#eee");
				}
			}, ddList[i], true);

			ddList[i].on('dragDropEvent', function (ev, id) {
				if (Math.abs(Dom.getX(destEl) - Dom.getX(here.dragEl)) < 14) {
					destEl.parentNode.insertBefore(here.dragEl, destEl);

					var str = "";

					$("#goorm_main_toolbar").children("div div.toolbar_part").each(function (i) {
						if (i !== 0) str += "|";
						str += ($(this).children("div").attr("id").split("_")).pop();
					});

					localStorage['toolbar.order'] = str;
				}
			}, ddList[i], true);

			ddList[i].on('endDragEvent', function (ev) {
				$("div.toolbar_moving_handle").css("background", "none");

				var srcEl = here.dragEl;

				Dom.setStyle(srcEl.id, "left", "0");
				Dom.setStyle(srcEl.id, "top", "0");

			}, ddList[i], true);

			ddList[i].on('mouseUpEvent', function (ev) {
				$("div.toolbar_moving_handle").css("background", "none");
			}, ddList[i], true);
		}

		// default Button Setting.
		if (localStorage['preference.editor.use_clipboard'] == "true") {
			$("a[action=use_clipboard]").find("img").addClass("toolbar_button_pressed");
		}

		$(core).on("on_preference_confirmed", function () {
			if (localStorage['preference.editor.use_clipboard'] == "true") {
				$("a[action=use_clipboard]").find("img").addClass("toolbar_button_pressed");
			} else {
				$("a[action=use_clipboard]").find("img").removeClass("toolbar_button_pressed");
			}
		});
	},

	add: function (path, name, container) {
		var self = this;

		if (core.is_optimization) {
			var get_name = function (path) {
				var full_name = path.split('/');
				full_name = full_name[full_name.length - 1].split('.');
				full_name.pop();
				full_name = full_name.join('.');
				full_name = full_name.trim();

				return full_name;
			};

			var full_name = get_name(path);
			var data = $('[id="head_' + full_name + '"]').clone(true).html();

			var index = this.index++;

			$("#" + container).append(data);

			var div_name = name.split(".").pop();
			$("div[id='" + div_name + ".toolbar']").prepend("<div id='toolbar_handle_" + name + "' class='toolbar_moving_handle'><div class='toolbar_handle'></div></div>");

			self.index_check++;
			if (self.index_check == self.order.length) {
				$(self).trigger("toolbarLoaded");
			}
		} else {
			var url = "file/get_contents";
			var index = this.index++;

			$.ajax({
				url: url,
				type: "GET",
				data: "path=" + path,
				async: false,
				success: function (data) {
					$("#" + container).append(data);

					var div_name = name.split(".").pop();
					$("div[id='" + div_name + ".toolbar']").prepend("<div id='toolbar_handle_" + name + "' class='toolbar_moving_handle'><div class='toolbar_handle'></div></div>");

					self.index_check++;
					if (self.index_check == self.order.length) {
						$(self).trigger("toolbarLoaded");
					}
				}
			});
		}
	},

	add_to_slideshare: function (path, name, container) {
		var self = this;
		var url = "file/get_contents";
		var index = this.index++;

		$.ajax({
			url: url,
			type: "GET",
			data: "path=" + path,
			async: false,
			success: function (data) {
				container.append(data);

				self.index_check++;
				if (self.index_check == self.order.length) {
					$(self).trigger("toolbarLoaded");
				}

			}
		});
	},

	switch_state: function (type) {
		switch (type) {
		case "Rule_Editor":
		case "Editor":
			$("#design\\.toolbar").css("opacity", "0.3").css("filter", "alpha(opacity=30)").children().addClass('disabled');
			$("#edit\\.toolbar").css("opacity", "1.0").css("filter", "alpha(opacity=100)").children().removeClass('disabled');
			$("#goorm_mainmenu #Design").find("li").each(function () {
				$(this).addClass("yuimenuitem-disabled");
				$(this).children("a").addClass("yuimenuitemlabel-disabled");
			});
			break;
		case "Designer":
			$("#design\\.toolbar").css("opacity", "1.0").css("filter", "alpha(opacity=100)").children().removeClass('disabled');
			$("#goorm_mainmenu #Design").find("li").each(function () {
				$(this).removeClass("yuimenuitem-disabled");
				$(this).children("a").removeClass("yuimenuitemlabel-disabled");
			});
			break;
		default:
		}
	},

	remove: function () {
		delete this;
	}
};
