/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jshint newcap:false, debug:true, unused: true, evil: true, devel: true, plusplus: false, browser: true, jquery: true, undef:false */
/*clientside jslint comment for global */
/*global org: false, core: false, YAHOO: false, CodeMirror: false, localStorage: false */
/*jshint unused: false */



org.goorm.core.edit.dictionary = function () {
	this.target = null;
	this.editor = null;
	this.dictionary_list = null;
	this.contents = [];
	this.result = [];
	this.index = 0;
	this.max_item_count = 5;
};

org.goorm.core.edit.dictionary.prototype = {

	init: function (target, editor, filetype) {
		this.dictionary_list = [];
		var self = this;

		this.target = target;
		this.editor = editor;

		this.contents = [];
		this.result = [];

		var __target = $(this.target);
		this.box_index = __target.parent().parent().attr('id').split('filewindow')[1];

		var dict_box_html = '';
		dict_box_html += "<div id='dictionary_box" + this.box_index + "' class='dictionary_box'>";
		dict_box_html += "<div class='dictionary_list'>";
		dict_box_html += "<table class='dictionary_list_table' style='width:100%;'></table>";
		dict_box_html += "</div>";
		dict_box_html += "<div class='dictionary_desc'></div>";
		dict_box_html += "</div>";

		__target.append(dict_box_html);
		__target.find("div.dictionary_box").hide();

		//load by active
		var active_filename = core.module.layout.workspace.window_manager.active_filename;
		var t_arr = active_filename.split('.');
		var active_filename_type = t_arr[t_arr.length - 1];

		if (t_arr.length > 1) {
			this.load(active_filename_type);
		} else {
			//console.log('odd',filetype);
			this.load(filetype);
		}

		var stored_data = localStorage.getItem('edit.dictionary');
		if (stored_data && stored_data != 'null' && stored_data != 'undefined') {
			stored_data = JSON.parse(stored_data);

			self.list_height = stored_data.list_height;
			self.box_height = stored_data.box_height;

			self.list_width = stored_data.list_width;
			self.box_width = stored_data.box_width;
		}

		CodeMirror.on(__target.find("div.dictionary_box").get(0), "keydown", function (e) {
			var code = e.keyCode;

			if (__target.find("div.dictionary_box").css("display") == "block") {
				if (code == 27) {
					CodeMirror.e_stop(e);

					self.hide();

					self.editor.focus();
				} else if (code == 38) {
					self.select(-1);
				} else if (code == 40) {
					self.select(1);
				} else if (code == 13) {
					CodeMirror.e_stop(e);

					self.complete();

					self.editor.focus();
				} else if (code == 37 || code == 39) {
					self.hide();
					self.editor.focus();
				} else {
					self.editor.focus();
				}
			}
		});

		self.resize = new YAHOO.util.Resize("dictionary_box" + self.box_index, {
			handles: ['b', 'r', 'br']
		});

		self.resize.on('startResize', function () {
			var table = $(self.target).find("table.dictionary_list_table");
			var table_tr = table.find('tr');
			var dictionary_desc = $('div.dictionary_desc', __target);

			var current_item_count = table_tr.length;

			var max_box_height = 0;
			var min_box_height = 0;

			// height
			var item_height = (table_tr.height()) ? table_tr.height() : 21;
			var guide_html_height = (dictionary_desc.height() < 5) ? 40 : dictionary_desc.height();

			if (current_item_count <= self.max_item_count) {
				max_list_height = (current_item_count * item_height);
				min_list_height = (current_item_count * item_height);
			} else {
				max_list_height = (current_item_count * item_height);
				min_list_height = (self.max_item_count * item_height);
			}

			max_box_height = max_list_height + guide_html_height;
			min_box_height = min_list_height + guide_html_height;

			// width
			max_box_width = 500;
			min_box_width = 300;

			self.resize.set("maxHeight", max_box_height);
			self.resize.set("minHeight", min_box_height);
			self.resize.set("maxWidth", max_box_width);
			self.resize.set("minWidth", min_box_width);
		});

		self.resize.on('resize', function (args) {
			var dictionary_box = $('div.dictionary_box', __target);
			var dictionary_list = $('div.dictionary_list', dictionary_box);
			var dictionary_desc = $('div.dictionary_desc', __target);

			var panel_width = args.width;
			var panel_height = args.height;

			if (panel_width === 0) {
				panel_width = dictionary_box.width();
			}

			if (panel_height === 0) {
				panel_height = dictionary_box.height();
			}

			var guide_html_height = (dictionary_desc.height() < 5) ? 40 : dictionary_desc.height();
			var list_height = panel_height - guide_html_height;

			dictionary_list.css('height', list_height + 'px');
			dictionary_box.css('height', panel_height + 'px');

			dictionary_list.css('width', panel_width + 'px');
			dictionary_box.css('width', panel_width + 'px');
			dictionary_desc.css('width', panel_width + 'px');
		});

		self.resize.on('endResize', function () {
			self.list_height = $('#dictionary_box' + self.box_index + ' div.dictionary_list').css('height');
			self.box_height = $('#dictionary_box' + self.box_index).css('height');

			self.list_width = $('#dictionary_box' + self.box_index + ' div.dictionary_list').css('width');
			self.box_width = $('#dictionary_box' + self.box_index).css('width');

			var cfg = {
				'list_height': self.list_height,
				'box_height': self.box_height,
				'list_width': self.list_width,
				'box_width': self.box_width
			};

			localStorage.setItem('edit.dictionary', JSON.stringify(cfg));
		});
	},

	complete: function () {

		var cursor = this.editor.getCursor();
		var token = this.editor.getTokenAt(cursor);

		if (this.result[0].is_not_data) this.result.pop();
		if (this.result.length > 0) {
			var string = this.result[this.index].keyword;

			var from = {
				line: cursor.line,
				ch: token.start
			};
			var to = {
				line: cursor.line,
				ch: token.end
			};
			if (token.string == ".") {
				from.ch += 1;
				to.ch += 1;
			}
			//console.log('token.string',token.string,'string',string,'from',from,'to',to);
			this.editor.replaceRange(string, from, to);
		}

		this.hide();
	},

	load: function (filetype) {
		var self = this;

		$(this.target).find(".dictionary_list_table").empty();

		if (core.is_optimization) {
			var list_data = JSON.parse(external_json['public']['configs']['dictionary']['dictionary_list.json']);
			if (filetype && list_data[filetype] ) {
				var type = filetype + '.json';
				var data = JSON.parse(external_json['public']['configs']['dictionary'][type]);

				self.contents = eval(data);
			} else {
				var type = 'etc.json';
				var data = JSON.parse(external_json['public']['configs']['dictionary'][type]);

				self.contents = eval(data);
			}
		} else {
			$.getJSON("configs/dictionary/dictionary_list.json", function (list_data) {
				if (filetype && list_data[filetype] ) {
					$.getJSON(list_data[filetype].path, function (data) {
						self.contents = eval(data);
					});
				} else {
					$.getJSON(list_data.etc.path, function (data) {
						self.contents = eval(data);
					});
				}
			});
		}
	},

	set: function (keyword) {
		var self = this;

		var __target = $(this.target);
		var dictionary_box = $('div.dictionary_box', __target);
		var dictionary_list = $('div.dictionary_list', dictionary_box);
		var dictionary_desc = $('div.dictionary_desc', __target);
		var dictionary_list_table = $('div.dictionary_box table.dictionary_list_table', __target);

		dictionary_list_table.empty();
		dictionary_desc.empty().css("display", "none");


		if (this.result.length === 0) {
			var not_data = {
				'is_not_data': true,
				'keyword': core.module.localization.msg.alert_no_have_data
			};
			this.result.push(not_data);
		}


		$(this.result).each(function (i) {
			var ele_id = "dict_" + i;

			//1.empty data
			if (this.is_not_data) {
				this.type = '';
				this.description = '';
			}

			//2.too long keyword
			var print_key = '';
			print_key += this.keyword;

			if (print_key.length > dictionary_list.width() / 8) {
				print_key = print_key.substring(0, print_key.length - dictionary_list.width() / 8);
				print_key += "...";
			}

			print_key = print_key.replace('<', '&lt').replace('>', '&gt');
			if (keyword != '.')
				print_key = print_key.replace(new RegExp(keyword, 'g'), '<b>' + keyword + '</b>');

			var get_element_image = function (type) {
				var __class;

				switch (type) {
				case 'func':
				case 'local':
				case 'global':
					__class = 'outline-toolbar-local';
					break;
				case 'class':
					__class = 'outline-toolbar-class';
					break;
				case 'method':
					__class = 'outline-toolbar-method';
					break;
				case 'package':
					__class = 'outline-toolbar-package';
					break;
				default:
					__class = 'outline-toolbar-local';
					break;
				}

				return "<div class=" + __class + " style='width:16px;margin: 3px 6px 0px 4px;'></div>";
			};

			var ele_html = "";
			ele_html += "<tr class='dictionary_element' id='" + ele_id + "'>";
			ele_html += "<td width='20px' style='font-size:11px;' height='21px' >" + get_element_image(this.type) + "</td><td style='font-size:11px; font-family: monospace;' height='21px'>" + print_key + "</td>";
			ele_html += "</tr>";



			var dictionary_element = $("tr.dictionary_element", dictionary_list_table);
			
			var current_item_count = dictionary_element.length + 1;
			if (current_item_count <= self.max_item_count) {
				var item_height = dictionary_element.height() ? dictionary_element.height() : 21;
				var desc_height = dictionary_desc.height();
				var list_height = current_item_count * item_height;
				// if (self.list_height) {
				// 	list_height = parseInt(self.list_height.split('px')[0], 10);
				// }
				var box_height = list_height + desc_height;

				dictionary_box.css('height', box_height + 'px');
				dictionary_list.css('height', list_height + 'px');
				dictionary_list_table.css('height', list_height + 'px');
			}

			dictionary_list_table.append(ele_html);

			dictionary_element.css('style', '');
			__target.find("tr.dictionary_element:last").css('border', 'none');

			var desc_id = ele_id + "_desc";
			var desc_html = "";
			if (this.is_not_data) {
				desc_html += "<div class='dictionary_desc_list' id='" + desc_id + "' is_not_data='true'>";
				desc_html += "</div>";
			} else {
				desc_html += "<div class='dictionary_desc_list' id='" + desc_id + "'>";
				desc_html += "<div style='margin:2px;'>" + this.description + "</div>";
				desc_html += "</div>";
			}

			dictionary_desc.append(desc_html);
			$('div.dictionary_desc_list', __target).css("display", "none");

		});

		__target.find("div.dictionary_list tr.dictionary_element").hover(
			function () {
				//hover
				__target.find("div.dictionary_list tr.hovered").removeClass("hovered");
				__target.find('div.dictionary_desc_list').css("display", "none");
				$(this).addClass("hovered");

				var g_ele_target = $(this).attr('id');
				display_desc = function (ele_target) {
					if ($('#' + ele_target).hasClass('hovered')) {
						//still hovered
						__target.find('.dictionary_desc').css("display", "");
						var desc_target = ele_target + "_desc";
						if (__target.find('#' + desc_target).attr('is_not_data') != 'true')
							__target.find('#' + desc_target).css("display", "");
					}

				};

				display_desc(g_ele_target);

				var guide_html = dictionary_desc.height();
				var list_height = dictionary_list.height();
				var box_height = list_height + guide_html;

				dictionary_box.css('height', box_height + 'px');
				dictionary_list.css('height', list_height + 'px');
				dictionary_list_table.css('height', list_height + 'px');
			}
		);

		var dictionary_element = __target.find("div.dictionary_list tr.dictionary_element");

		if (this.result[0].is_not_data === true) {
			dictionary_element.off();
		}

		dictionary_element.each(function (i) {
			if ($(this).attr('filter') != 'not_data') {
				$(this).click(function () {
					self.index = i;
					self.complete();
				});
			}
		});
	},

	select: function (direction) {
		var self = this;
		var __target = $(this.target);

		var current_selected_item = this.index; // 0 ~ item.length-1
		var next_item = current_selected_item + direction;

		var item = $('tr.dictionary_element');
		var item_count = this.result.length;
		var item_height = item.height();

		var dictionary_list = $('div.dictionary_list', __target);
		var scroll_top = dictionary_list.scrollTop();
		var client_height = dictionary_list.prop('clientHeight');

		var current_location = (next_item + 1) * item_height;

		// next : -1
		var up = function () {
			if (next_item < 0) {
				next_item = item_count - 1;
			}

			if (!(scroll_top < current_location && current_location <= scroll_top + client_height)) {
				dictionary_list.scrollTop(dictionary_list.scrollTop() - item_height);
			}
		};

		// next : 1
		var down = function () {
			if (next_item + 1 > item_count) {
				next_item = 0;
			}

			if (!(scroll_top <= current_location && current_location <= scroll_top + client_height)) {
				dictionary_list.scrollTop(dictionary_list.scrollTop() + item_height);
			}
		};

		switch (direction) {
		case 1:
			down();
			break;

		case -1:
			up();
			break;

		default:
			self.hide();
			self.editor.focus();
			break;
		}

		if (next_item === 0) {
			dictionary_list.scrollTop(0);
		}

		if (next_item == item_count - 1) {
			dictionary_list.scrollTop((next_item + 1) * item_height);
		}

		this.index = next_item;

		var dictionary_element = $('tr.dictionary_element', dictionary_list);
		var dictionary_list = $('div.dictionary_list', __target);
		var dictionary_desc = $('div.dictionary_desc', __target);

		dictionary_element.removeClass("hovered");
		$('div.dictionary_desc_list', __target).css("display", "none");
		dictionary_element.each(function (i) {
			if (self.index == i) {
				$(this).addClass("hovered");

				var g_ele_target = $(this).attr('id');
				display_desc = function (ele_target) {
					if ($('#' + ele_target).hasClass('hovered')) {
						//still hovered
						dictionary_desc.css("display", "");
						var desc_target = ele_target + "_desc";
						$(self.target).find('#' + desc_target).css("display", "");

						var guide_html = dictionary_desc.height();
						var list_height = dictionary_list.height();
						var box_height = list_height + guide_html;

						$('div.dictionary_box', __target).css('height', box_height + 'px');
						dictionary_list.css('height', list_height + 'px');
						$('div.dictionary_box table.dictionary_list_table', __target).css('height', list_height + 'px');
					}
				};

				display_desc(g_ele_target);
			}
		});
	},

	show: function (cm) {
		var __target = $(this.target);

		var cursor = cm.getCursor();
		var cursor_pos = cm.charCoords({
			line: cursor.line,
			ch: cursor.ch
		}, "local");
		var scroll = cm.getScrollInfo();
		var gutter = cm.getGutterElement();
		var gutter_width = $(gutter).width() + 12;

		var left = cursor_pos.left + gutter_width;
		var top = cursor_pos.top - scroll.top + 12;

		var wrapper = $(cm.getWrapperElement());
		var wrapper_height = wrapper.height();
		var wrapper_width = wrapper.width();
		var dictionary_box = $("div.dictionary_box", __target);
		var workspace = $("#workspace");

		//top recoordinate
		if (top > wrapper_height) {
			top = wrapper_height - dictionary_box.height();
		}

		if (workspace.offset().top + workspace.height() - 1 < wrapper.offset().top + top + dictionary_box.height()) {
			if (top < wrapper_height) {
				top = top - dictionary_box.height() - 21;
			} else {
				top = wrapper_height - dictionary_box.height();
			}
		}
		//left recoordinate	
		if (left > wrapper_width) {
			left = wrapper_width - dictionary_box.width();
		}

		if (workspace.offset().left + workspace.width() - 1 < wrapper.offset().left + left + dictionary_box.width()) {
			if (left < wrapper_width) {
				left = left - dictionary_box.width() - 21;
			} else {
				left = wrapper_width - dictionary_box.width();
			}
		}

		dictionary_box.css('left', left);
		dictionary_box.css('top', top);

		if (this.list_height && this.box_height) {
		}

		if (this.list_width && this.box_width) {
			//list
			dictionary_box.css('width', this.box_width);
			dictionary_box.find('div.dictionary_list').css('width', this.list_width);

			//desc
			dictionary_box.find('div.dictionary_desc').css('width', this.list_width);
			dictionary_box.find('div.dictionary_desc_list').css('width', this.list_width);
		}

		dictionary_box.show();

		__target.find("div.dictionary_list tr.hovered").removeClass("hovered");
		__target.find("div.dictionary_list tr.dictionary_element:first").addClass("hovered");

		dictionary_box.attr("tabindex", -1).focus();

		this.index = 0;
	},

	hide: function () {
		var __target = $(this.target);
		__target.find(".dictionary_box").hide();
		__target.find(".dictionary_desc").hide();
	},

	search: function (keyword, type, line_content) {

		var self = this;
		self.result = [];

		var reg_exp = new RegExp('^' + keyword, '');
		var keyword_object = {};
		keyword_object.keyword = keyword + "";
		keyword_object.line_content = line_content + "";

		self.get_dictionary(keyword_object, function () {
			$(self.contents).each(function (i) {
				if (reg_exp.test(this.keyword)) {
					self.result.push(this);
				}
			});

			self.set(keyword);
		});

	},
	get_dictionary: function (keyword_object, callback) {
		var self = this;
		var reg_exp = new RegExp('^' + keyword_object.keyword, '');

		var get_description = function (type, item) {
			var description_html = "";
			description_html += "<div>";
			description_html += "<div style='padding:2px;'><b>Type</b> : " + type + "</div>";
			description_html += "</div>";

			return description_html;
		};

		$.get('/edit/get_dictionary', {
			workspace: core.module.layout.workspace.window_manager.active_filename.split('/')[0],
			selected_file_path: core.module.layout.workspace.window_manager.active_filename,
			line_content: keyword_object.line_content

		}, function (data) {
			if (data.v !== undefined) {
				data.v = data.v.unique();

				for (var i = 0; i < data.v.length; i++) {
					if (reg_exp.test(data.v[i])) {
						self.result.push({
							'description': get_description('Global Variable', data.v[i]),
							'keyword': data.v[i],
							'type': 'global'
						});
					}
				}
			} //global var end
			if (data.l !== undefined) {
				data.l = data.l.unique();

				for (var i = 0; i < data.l.length; i++) {
					if (reg_exp.test(data.l[i])) {
						self.result.push({
							'description': get_description('Local Variable', data.l[i]),
							'keyword': data.l[i],
							'type': 'local'
						});
					}
				}
			} //local var end				
			if (data.f !== undefined) {
				data.f = data.f.unique();

				for (var i = 0; i < data.f.length; i++) {
					if (reg_exp.test(data.f[i])) {
						self.result.push({
							'description': get_description("Function", data.f[i]),
							'keyword': data.f[i],
							'type': 'func'
						});
					}
				}
			} //function end
			if (data.m !== undefined) {
				data.m = data.m.unique();

				for (var i = 0; i < data.m.length; i++) {
					if (reg_exp.test(data.m[i])) {
						self.result.push({
							'description': get_description("Method", data.m[i]),
							'keyword': data.m[i],
							'type': 'method'
						});
					}
				}
			} //method end
			if (data.c !== undefined) {
				data.c = data.c.unique();

				for (var i = 0; i < data.c.length; i++) {
					if (reg_exp.test(data.c[i])) {
						self.result.push({
							'description': get_description("Class", data.c[i]),
							'keyword': data.c[i],
							'type': 'class'
						});
					}
				}
			} //class
			if (data.p !== undefined) {
				data.p = data.p.unique();

				for (var i = 0; i < data.p.length; i++) {
					if (reg_exp.test(data.p[i])) {
						self.result.push({
							'description': get_description("package", data.p[i]),
							'keyword': data.p[i],
							'type': 'package'
						});
					}
				}
			} //package
			if (typeof callback === "function") {
				callback();
			}
		});
	},

		get_dictionary_java: function (query, callback) {
		var self = this;
		self.result = [];
		$.get('/edit/get_proposal_java', {
			selected_file_path: core.module.layout.workspace.window_manager.active_filename,
			line: query
		}, function (data) {
			console.log(query, ' proposal data ', data);

			self.result = data;
			self.set(query);
			if (typeof callback === "function") {
				callback();
			}
		});
	}

};
