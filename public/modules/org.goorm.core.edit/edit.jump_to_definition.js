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



org.goorm.core.edit.jump_to_definition = function () {
	this.is_show = false;
	this.max_item_count = 5;
	this.current_data = null;
	this.cfg = {};
};

org.goorm.core.edit.jump_to_definition.prototype = {

	init: function (target, editor) {
		var self = this;

		this.target = target;
		this.editor = editor;

		this.cfg.index = $(this.target).parent().parent().attr('id').split('filewindow')[1];

		if (core.is_optimization) {
			var data = $('[id="head_edit.function_box"]').clone(true).html();
			var __target = $(self.target);

			__target.append(data);
			$('#function_box', __target).attr('id', 'function_box' + self.cfg.index).hide();
			self.bind();

			var stored_data = localStorage.getItem('edit.functions');
			if (stored_data && stored_data != 'null' && stored_data != 'undefined') {
				stored_data = JSON.parse(stored_data);

				self.cfg.list_height = stored_data.list_height;
				self.cfg.box_height = stored_data.box_height;

				self.cfg.list_width = stored_data.list_width;
				self.cfg.box_width = stored_data.box_width;
			}
		} else {
			var postdata = {
				'path': 'public/configs/dialogs/org.goorm.core.edit/edit.function_box.html'
			};

			$.get('/file/get_contents', postdata, function (data) {
				var __target = $(self.target);

				__target.append(data);
				$('#function_box', __target).attr('id', 'function_box' + self.cfg.index).hide();
				self.bind();

				var stored_data = localStorage.getItem('edit.functions');
				if (stored_data && stored_data != 'null' && stored_data != 'undefined') {
					stored_data = JSON.parse(stored_data);

					self.cfg.list_height = stored_data.list_height;
					self.cfg.box_height = stored_data.box_height;

					self.cfg.list_width = stored_data.list_width;
					self.cfg.box_width = stored_data.box_width;
				}
			});
		}
	},

	bind: function () {
		var self = this;
		var __target = $(self.target);

		self.resize = new YAHOO.util.Resize("function_box" + self.cfg.index, {
			handles: ['b', 'r', 'br']
		});

		self.resize.on('startResize', function () {
			var table = $("div.function_box_list table.function_box_table", __target);
			var table_tr = $('tr', table);
			var current_item_count = table_tr.length;

			var max_list_height = 0;
			var min_list_height = 0;

			// height
			var item_height = (!isNaN(table_tr.outerHeight(true))) ? table_tr.outerHeight(true) : 23;
			var guide_html_height = $('div.function_box_guide').outerHeight(true);

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
			var function_box = $('div.function_box', __target);
			var function_box_list = $('div.function_box_list', function_box);

			var panel_width = args.width;
			var panel_height = args.height;

			if (panel_width === 0) {
				panel_width = function_box.width();
			}

			if (panel_height === 0) {
				panel_height = function_box.height();
			}

			var list_height = panel_height - $('div.function_box_guide', __target).height();

			function_box_list.css('height', list_height + 'px');
			function_box.css('height', panel_height + 'px');

			function_box_list.css('width', panel_width + 'px');
			function_box.css('width', panel_width + 'px');
		});

		self.resize.on('endResize', function (args) {
			var function_box = $('div.function_box', __target);
			var function_box_list = $('div.function_box_list', function_box);

			self.cfg.list_height = function_box_list.css('height');
			self.cfg.box_height = function_box.css('height');

			self.cfg.list_width = function_box_list.css('width');
			self.cfg.box_width = function_box.css('width');

			localStorage.setItem('edit.functions', JSON.stringify(self.cfg));
		});

		CodeMirror.on(__target.find("#function_box" + self.cfg.index).get(0), "keydown", function (e) {
			var code = e.keyCode;

			if (code == 38) { // up
				self.select_manager(-1);
			} else if (code == 40) { // down
				self.select_manager(1);
			} else if (code == 13) { // Enter
				self.select_manager(0);
			} else {
				self.hide();
			}
		});
	},

	set: function (data) {
		var self = this;
		var __target = $(self.target);

		var validate_string = function (type, str) {
			var guide_html_height = $('div.function_box_guide').width();

			if (type == 'class' && str.length > 20) {
				str = str.substring(0, 16) + ' ...';
			}

			if (type == 'function' && str.length > 70) {
				str = str.substring(0, 66) + ' ...';
			}

			if (type == 'filepath' && str.length > guide_html_height / 8) {
				str = '... ' + str.substring(str.length - guide_html_height / 8, str.length);
				str = str.substring(str.indexOf('/'), str.length);
				str = '... ' + str;
			}

			str = str.replace(/\\/g, "");
			return str;
		};

		var bind_syntax_highlighting = function (str) {
			var highlight_keyword = ['class', 'abstract', 'boolean', 'byte', 'char', 'String', 'const', 'double', 'final', 'finally', 'float', 'implements', 'import', 'instanceof', 'int', 'interface', 'long', 'package', 'private', 'protected', 'short', 'static', 'synchronized', 'void', 'public', 'extends'];

			for (var i = 0; i < highlight_keyword.length; i++) {
				var keyword = highlight_keyword[i];

				if (str.indexOf(keyword) >= 0) {
					var reg_keyword = eval('/\\b' + keyword + '\\b/g');
					str = str.replace(reg_keyword, '<span class="cm-keyword">' + keyword + '</span>');
				}
			}

			return str;
		};

		var get_element = function (item, item_index) {
			var print_key = item.query.substring(2, item.query.length - 4);
			print_key = print_key.replace(/\\/g, "");

			if (!item.__class) item.__class = "class:" + item.name;

			var get_element_image = function (type) {
				var __class;

				switch (type) {
				case 'f':
				case 'l':
				case 'v':
					// url = '/images/org.goorm.core.outline/local_type.png'
					__class = 'outline-toolbar-local';
					break;
				case 'c':
					// url = '/images/org.goorm.core.outline/class_type.png'
					__class = 'outline-toolbar-class';
					break;
				case 'm':
					// url = '/images/org.goorm.core.outline/method_type.png'
					__class = 'outline-toolbar-method';
					break;
				case 'p':
					// url = '/images/org.goorm.core.outline/package_type.png'
					__class = 'outline-toolbar-package';
					break;
				}

				return "<div class=" + __class + " style='width:16px;margin: 3px 6px 0px 2px;'></div>";
			};

			var function_key = validate_string('function', print_key);
			function_key = bind_syntax_highlighting(function_key);

			var ele_html = "";
			ele_html += "<tr class='function_box_tr function_item' filepath='" + item.filepath + "' _class='" + item.__class + "' query='" + print_key + "' item_index='" + item_index + "' line='"+item.line+"'>";
			ele_html += "<td class='function_box_td column_type'>" + get_element_image(item.type) + "</td>";
			ele_html += "<td class='function_box_td column_function'>" + function_key + "</td>";
			ele_html += "</tr>";

			return ele_html;
		};

		self.get_guide = function (item) {
			var _class = $(item).attr('_class').split(":")[1];

			var workspace = core.status.current_project_path;
			var full_filepath = $(item).attr('filepath').split('/');
			var filename = full_filepath[full_filepath.length - 1];
			var filepath = "";
			var workspace_filepath = "";

			var is_add_time = false;
			for (var i = 0; i < full_filepath.length - 1; i++) {
				if (workspace == full_filepath[i]) {
					is_add_time = true;
				}

				if (is_add_time) {
					filepath += full_filepath[i] + '/';
				}
			}
			workspace_filepath = filepath + filename;
			workspace_filepath = workspace_filepath.slice(workspace_filepath.indexOf('/'));

			var window_manager = core.module.layout.workspace.window_manager;
			var active_window = window_manager.window[window_manager.active_window];
			var guide_html = "";

			if (active_window.filename == filename && active_window.filepath == filepath) {
				var line = parseInt($(item).attr("line"), 10);

				guide_html += "<div class='function_box_guide_content'>";
				guide_html += "<div class='guide_content column_class'><b>Class</b>:" + _class + "</div>";
				guide_html += "<div class='guide_content column_filepath'><b>Line</b>:" + parseInt(line - 1, 10) + "</div>";
				guide_html += "</div>";
			} else {
				guide_html += "<div class='function_box_guide_content'>";
				guide_html += "<div class='guide_content column_class'><b>Class</b>:" + _class + "</div>";
				guide_html += "<div class='guide_content column_filepath'>" + validate_string('filepath', workspace_filepath) + "</div>";
				guide_html += "</div>";
			}

			return guide_html;
		};

		__target.find('tr.function_item').remove();
		__target.find('div.function_box_guide_content').remove();

		if (data) {
			self.current_data = data;

			for (var i = 0; i < data.length; i++) {
				var item = data[i];
				var ele_html = get_element(item, i);

				self.table_manager('push', ele_html);
			}

			$('tr.function_item', __target).off('hover');
			$('tr.function_item', __target).hover(function (e) {
				$('tr.hovered', __target).removeClass('hovered');
				$(this).addClass('hovered');

				self.cfg.current_selected_item = parseInt($(this).attr('item_index'), 10);

				var guide_html = self.get_guide(this);

				$('div.function_box_guide', __target).empty();
				$('div.function_box_guide', __target).append(guide_html);

				self.focus();
			});

			__target.off('mousedown', 'tr.function_item');
			__target.on('mousedown', 'tr.function_item', function (e) {
				var selected_item = this;

				var workspace = core.status.current_project_path;
				var full_filepath = $(this).attr('filepath').split('/');
				var filename = full_filepath[full_filepath.length - 1];
				var filepath = "";
				var filetype = filename.substring(filename.indexOf('.') + 1);

				var is_add_time = false;
				for (var i = 0; i < full_filepath.length - 1; i++) {
					if (workspace == full_filepath[i]) {
						is_add_time = true;
					}

					if (is_add_time) {
						filepath += full_filepath[i] + '/';
					}
				}

				var is_loaded = false;

				$(core).off('is_loaded');
				$(core).on('is_loaded', function () {
					is_loaded = true;
				});

				var window_manager = core.module.layout.workspace.window_manager;
				var target_window = window_manager.open(filepath, filename, filetype);

				$(core).off(filepath + '/' + filename + 'window_loaded');
				$(core).on(filepath + '/' + filename + 'window_loaded', function () {
					is_loaded = false;

					var activated_window_editor = target_window.editor.editor;
					var query = $(selected_item).attr('query');
					var line = parseInt($(selected_item).attr('line'), 10) - 2;

					if (line < 0) {
						line = 0;
					}

					var linedata = activated_window_editor.getLine(line);
					if (linedata.indexOf(query) == -1) {
						line = parseInt($(selected_item).attr('line'), 10) - 1;
					}

					activated_window_editor.setCursor(line);
					// var query = $(selected_item).attr('query');

					// for (var l = 0; l <= activated_window_editor.lastLine(); l++) {
					// 	if (activated_window_editor.getLine(l).indexOf(query) >= 0) {
					// 		activated_window_editor.setCursor(l);
					// 	}
					// }

					target_window.activate();
				});

				if (is_loaded) {
					var activated_window_editor = target_window.editor.editor;
					var query = $(selected_item).attr('query');
					var line = parseInt($(selected_item).attr('line'), 10) - 2;

					if (line < 0) {
						line = 0;
					}

					var linedata = activated_window_editor.getLine(line);
					if (linedata.indexOf(query) == -1) {
						line = parseInt($(selected_item).attr('line'), 10) - 1;
					}

					activated_window_editor.setCursor(line);

					// var query = $(selected_item).attr('query');

					// var line_index = 0;
					// for (var l = 0; l <= activated_window_editor.lastLine(); l++) {
					// 	if (activated_window_editor.getLine(l).indexOf(query) >= 0) {
					// 		line_index = l;
							// window.setTimeout(function () {
							// 	activated_window_editor.setCursor(line_index);
							// }, 200);
					// 	}
					// }

					window.setTimeout(function () {
						target_window.activate();
					}, 500);
				}

				self.hide();
			});
		} else {
			var emtpy_msg = "<tr class='function_item'><td style='text-align: left; padding: 3px 0px 3px 10px;'>No data to display</td></tr>";
			self.table_manager('push', emtpy_msg);

			$('tr.function_item').off('click');
			$('tr.function_item').click(function (e) {
				self.hide();
			});
		}
	},

	table_manager: function (action, item) {
		var self = this;

		var __target = $(self.target);
		var table = $("div.function_box_list table.function_box_table", __target);

		var push = function (item) {
			var table_tr = $('tr.function_box_tr', table);
			var current_item_count = table_tr.length + 1;

			// var item_height = (!isNaN(table_tr.outerHeight(true))) ? table_tr.outerHeight(true) : 23;
			var item_height = 23;
			var guide_html_height = $('div.function_box_guide').outerHeight(true);

			if (current_item_count <= self.max_item_count) {
				var list_height = (current_item_count * item_height) + 1;
				var box_height = list_height + guide_html_height;

				$('div.function_box_list').css('height', list_height + 'px');
				$('div.function_box').css('height', box_height + 'px');
			}

			table.append(item);

			$('tr.function_item').attr('style', '');
			$('tr.function_item:last').css('border', 'none');
		};

		switch (action) {
		case 'push':
			push(item);
			break;

		case 'pull':
			break;

		default:
			break;
		}
	},

	select_manager: function (next) {
		var self = this;
		var __target = $(self.target);

		var current_selected_item = parseInt(self.cfg.current_selected_item, 10); // 0 ~ item.length-1
		var next_item = current_selected_item + next;

		var item = $('tr.function_item', __target);
		var item_count = item.length;
		var item_height = item.outerHeight(true);

		var function_box_list = $('div.function_box_list', __target);
		var scroll_top = function_box_list.scrollTop();
		var client_height = function_box_list.prop('clientHeight');

		var current_location = (next_item + 1) * item_height;

		// next : -1
		var up = function () {
			if (next_item < 0) {
				next_item = item_count - 1;
			}

			if (!(scroll_top < current_location && current_location <= scroll_top + client_height)) {
				function_box_list.scrollTop(function_box_list.scrollTop() - item_height);
			}
		};

		// next : 1
		var down = function () {
			if (next_item + 1 > item_count) {
				next_item = 0;
			}

			if (!(scroll_top <= current_location && current_location <= scroll_top + client_height)) {
				function_box_list.scrollTop(function_box_list.scrollTop() + item_height);
			}
		};

		var select = function () {
			$(self.target).find('div.function_box tr.hovered').mousedown();
			self.editor.focus();
		};

		switch (next) {
		case 1:
			down();
			break;

		case -1:
			up();
			break;

		case 0:
			select();
			break;

		default:
			self.hide();
			self.editor.focus();
			break;
		}

		if (next_item === 0) {
			function_box_list.scrollTop(0);
		}

		if (next_item == item_count - 1) {
			function_box_list.scrollTop((next_item + 1) * item_height);
		}

		$('div.function_box tr.hovered', __target).removeClass('hovered');
		$('tr.function_item:eq(' + next_item + ')', __target).addClass('hovered');

		self.cfg.current_selected_item = next_item;
		var guide_html = self.get_guide(__target.find('tr.function_item:eq(' + next_item + ')')[0]);

		__target.find('div.function_box_guide').empty();
		__target.find('div.function_box_guide').append(guide_html);
	},

	jump: function (data) {
		var workspace = core.status.current_project_path;
		var full_filepath = data.filepath.split('/');
		var filename = full_filepath[full_filepath.length - 1];
		var filepath = "";
		var filetype = filename.substring(filename.indexOf('.') + 1);

		var is_add_time = false;
		for (var i = 0; i < full_filepath.length - 1; i++) {
			if (workspace == full_filepath[i]) {
				is_add_time = true;
			}

			if (is_add_time) {
				filepath += full_filepath[i] + '/';
			}
		}

		var is_loaded = false;

		$(core).off('is_loaded');
		$(core).on('is_loaded', function () {
			is_loaded = true;
		});

		var window_manager = core.module.layout.workspace.window_manager;
		var target_window = window_manager.open(filepath, filename, filetype);

		$(core).off(filepath + '/' + filename + 'window_loaded');
		$(core).on(filepath + '/' + filename + 'window_loaded', function () {
			is_loaded = false;

			var activated_window_editor = target_window.editor.editor;
			var query = data.query.substring(2, data.query.length - 4);
			var line = parseInt(data.line, 10) - 2;

			if (line < 0) {
				line = 0;
			}

			var linedata = activated_window_editor.getLine(line);
			if (linedata.indexOf(query) == -1) {
				line = parseInt(data.line, 10) - 1;
			}

			activated_window_editor.setCursor(line);
			// var query = data.query.substring(2, data.query.length - 4);

			// for (var l = 0; l <= activated_window_editor.lastLine(); l++) {
			// 	if (activated_window_editor.getLine(l).indexOf(query) >= 0) {
			// 		activated_window_editor.setCursor(l);
			// 	}
			// }

			target_window.activate();
		});

		if (is_loaded) {
			var activated_window_editor = target_window.editor.editor;
			var query = data.query.substring(2, data.query.length - 4);
			var line = parseInt(data.line, 10) - 2;

			if (line < 0) {
				line = 0;
			}

			var linedata = activated_window_editor.getLine(line);
			if (linedata.indexOf(query) == -1) {
				line = parseInt(data.line, 10) - 1;
			}

			activated_window_editor.setCursor(line);

			// var line_index = 0;
			// for (var l = 0; l <= activated_window_editor.lastLine(); l++) {
			// 	if (activated_window_editor.getLine(l).indexOf(query) >= 0) {
			// 		line_index = l;

					// window.setTimeout(function () {
					// 	activated_window_editor.setCursor(line_index);
					// }, 200);
			// 	}
			// }

			target_window.activate();
		}
	},

	load: function (token) {
		var self = this;

		var workspace = core.status.current_project_path;
		var project_type = core.status.current_project_type;

		var postdata = {
			'token': token,
			'workspace': workspace
		};

		$.get('/edit/jump_to_definition', postdata, function (response) {
			if (response.result) {
				var data = response.data;

				if (data.length == 1) {
					self.jump(data[0]);
				} else {
					self.set(data);
					self.show(self.editor);
				}
			} else {
				console.log(response);

				switch (response.code) {
				case 0:
				case 1:
					self.set(null);
					self.show(self.editor);

					break;
				}
			}
		});
	},

	focus: function () {
		$(this.target).find('div.function_box').focus();
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
		var dictionary_box = __target.find("div.function_box");
		var workspace = $("#workspace");

		//if(top < 0) top = 5;

		if (top > wrapper_height) {
			top = wrapper_height - dictionary_box.height();
		}
		// 딕셔너리박스가 아래라인을 넘어가면 밀림현상 발생.
		if (workspace.offset().top + workspace.height() - 1 < wrapper.offset().top + top + dictionary_box.height()) {
			if (top < wrapper_height) {
				top = top - dictionary_box.height() - 21;
			} else {
				top = wrapper_height - dictionary_box.height();
			}
		}

		dictionary_box.css('left', left);
		dictionary_box.css('top', top);

		if (this.cfg) {
			var function_box_list = dictionary_box.find('div.function_box_list');

			if (this.cfg.list_height && this.cfg.box_height) {
				dictionary_box.css('height', this.cfg.box_height);
				function_box_list.css('height', this.cfg.list_height);
			}

			if (this.cfg.list_width && this.cfg.box_width) {
				dictionary_box.css('width', this.cfg.box_width);
				function_box_list.css('width', this.cfg.list_width);
			}
		}

		dictionary_box.show();

		__target.find("div.function_box_list tr.hovered").removeClass("hovered");
		__target.find("div.function_box_list tr.function_item:first").addClass("hovered");
		this.cfg.current_selected_item = 0;

		dictionary_box.attr("tabindex", -1).focus();
		this.is_show = true;
	},

	hide: function () {
		$(this.target).find(".function_box").hide();
		this.is_show = false;
	}
};