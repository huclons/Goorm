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



org.goorm.core.menu.context = function () {
	this.menu = null;
	this.target = null;
	this.name = null;
};

org.goorm.core.menu.context.prototype = {
	init: function (path, name, trigger, fingerprint, target, fn) {
		var self = this;

		this.target = target;

		if (name == "none") {
			$(trigger).on("contextMenu", function (e) {
				return false;
			});
		} else {
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

				if (trigger === "") {
					trigger = null;
				}

				if (fingerprint !== undefined && fingerprint !== "") {
					while (data.indexOf("[{@FINGERPRINT}]") != -1) {
						data = data.replace("[{@FINGERPRINT}]", fingerprint);
					}

					name = name + "_" + fingerprint;
				}
				self.name = name;
				$("#goorm_menu_container").find("div[id='" + name + "']").remove();
				$("#goorm_menu_container").append(data);

				$(trigger).bind("contextmenu", function (e) {
					e.preventDefault();
					return false;
				});

				self.menu = new YAHOO.widget.ContextMenu(
					name, {
						trigger: trigger,
						lazyload: true,
						effect: {
							effect: YAHOO.widget.ContainerEffect.FADE,
							duration: 0.15
						}
					}
				);

				self.menu.render();
				self.menu.subscribe("show", function () {
					$(document).one("click", function () {
						self.menu.hide();
					});
				});

				if (fn) {
					fn.call(self);
				}

				core.module.action.init();
			} else {
				var url = "file/get_contents";

				if (trigger === "") {
					trigger = null;
				}

				$.ajax({
					url: url,
					type: "GET",
					data: "path=public/" + path,
					success: function (data) {
						if (fingerprint !== undefined && fingerprint !== "") {
							while (data.indexOf("[{@FINGERPRINT}]") != -1) {
								data = data.replace("[{@FINGERPRINT}]", fingerprint);
							}

							name = name + "_" + fingerprint;
						}
						self.name = name;
						$("#goorm_menu_container").find("div[id='" + name + "']").remove();
						$("#goorm_menu_container").append(data);

						$(trigger).on("contextmenu", function (e) {
							e.preventDefault();
							return false;
						});

						self.menu = new YAHOO.widget.ContextMenu(
							name, {
								trigger: trigger,
								lazyload: true,
								effect: {
									effect: YAHOO.widget.ContainerEffect.FADE,
									duration: 0.15
								}
							}
						);

						self.menu.render();
						self.menu.subscribe("show", function () {
							$(document).one("click", function () {
								self.menu.hide();
							});
						});

						if (fn) {
							fn.call(self);
						}

						core.module.action.init();
					}
				});
			}
		}
	},

	show: function () {
		if (this.menu) {
			this.menu.show();
		}
	},

	cancel: function () {
		if (this.menu) {
			this.menu.cancel();
		}
	},

	blur: function () {
		if (this.menu) {
			this.menu.blur();
		}
	},

	hide: function () {
		if (this.menu) {
			this.menu.hide();
		}
	},

	remove: function () {
		$("#" + this.target).remove();

		delete this;
	}
};
