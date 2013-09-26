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



org.goorm.core.project.list = function () {
	this.location = null;
	this.types = null;
	this.list = null;
	this.information = null;

	this.path = null;
	this.name = null;
	this.type = null;
};

org.goorm.core.project.list.prototype = {

	init: function (context, list_callback) {
		var self = this;

		self.location = context + "_location";
		self.types = context + "_types";
		self.list = context + "_list";
		self.information = context + "_information";

		self.path = context + "_path";
		self.name = context + "_name";
		self.type = context + "_type";

		$(self.location).val("");
		$(self.list).empty();
		$(self.information).empty();

		self.add_project_list(list_callback);
		self.add_project_item();
	},

	get_data: function () {
		var self = this;

		var data = {};
		data.path = $(self.path).val();
		data.name = $(self.name).val();
		data.type = $(self.type).val();

		return data;
	},

	add_project_list: function (list_callback) {
		var self = this;

		var postdata = {
			'get_list_type': 'owner_list'
		};

		$.getJSON("project/get_list", postdata, function (data) {
			$(data).each(function (i) {
				var icon_str = "";
				icon_str += "<div id='selector_" + this.contents.name + "' value='" + i + "' class='selector_project' type='" + this.contents.type + "'>";
				icon_str += "<div style='padding-left:65px; padding-top:20px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis'>";
				icon_str += this.contents.name;
				icon_str += "</div>";

				$(self.list).append(icon_str);
			});

			$(self.list + " .selector_project").click(function () {
				$(self.list + " .selector_project").removeClass("selected_button");
				$(this).addClass("selected_button");

				var idx = $(this).attr("value");

				$(self.location).val("/" + data[idx].name);
				$(self.path).val(data[idx].name);
				$(self.name).val(data[idx].contents.name);
				$(self.type).val(data[idx].contents.type);

				var information = $(self.information);

				information.empty();
				information.append("<b>Project Type : </b>");
				information.append(data[idx].contents.type + "<br/>");
				information.append("<b>Project Detail : </b>");
				information.append(data[idx].contents.detailedtype + "<br/>");
				information.append("<b>Project Author : </b>");
				information.append(data[idx].contents.author + "<br/>");
				information.append("<b>Project Name : </b>");
				information.append(data[idx].contents.name + "<br/>");
				information.append("<b>Project Description : </b>");
				information.append(data[idx].contents.description + "<br/>");
				information.append("<b>Project Date : </b>");
				information.append(data[idx].contents.date + "<br/>");
			});

			var project_list_children = $(self.list).children();

			for (var i = 0; i < project_list_children.length; i++) {
				if ($(project_list_children[i]).text() == core.status.current_project_name) {
					$(project_list_children[i]).prependTo($(self.list));
					$(project_list_children[i]).click();
				}
			}

			if (typeof list_callback != 'undefined') {
				list_callback();
			}
		});
	},

	add_project_item: function () {
		var self = this;

		$(self.types + " option:eq(0)").attr("selected", "selected");

		$(self.types).change(function () {
			var type = $(self.types + " option:selected").val();

			$(self.information).empty();

			if (type == "All") {
				$(self.list + " .selector_project").each(function () {
					$(this).css("display", "block");
				});
			} else {
				$(self.list + " .selector_project").each(function () {
					if ($(this).attr("type") == type) {
						$(this).css("display", "block");
					} else {
						$(this).css("display", "none");
					}
				});
			}
		});
	}
};
