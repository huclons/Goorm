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



org.goorm.core.project.explorer = function () {
	this.target = null;
	this.treeview = null;
	this.context_menu_file = null;
	this.context_menu_folder = null;
	this.context_menu_project = null;
	this.current_tree_data = null;
	this.current_project = null;
	this.project_data = null;
	this.treeview_data = null;
	this.old_project_list_table_width = 0;
};

org.goorm.core.project.explorer.prototype = {
	init: function () {
		var self = this;

		// init explorer treeview from localStorage
		if (!localStorage.explorer_treeview) localStorage.explorer_treeview = JSON.stringify({});
		this.load_explorer_treeview();

		$("#project_explorer").prepend("<div id='project_selector'></div>");
		$("#project_selector").append("<label class='selectbox'><select id='project_selectbox'></select></label>").append("<div id='project_explorer_refresh_tool'><div class='project-toolbar-refresh'></div></div>");

		$("#project_selectbox").change(function () {
			$('#project_treeview').empty();
			core.status.selected_file='';
			self.on_project_selectbox_change($(this).val());
			$(core).trigger("goorm_project_selectbox_change");

		});
		$("#project_explorer").append("<div id='project_treeview' style='overflow-x:hidden;display:none'></div>");
		$("#project_explorer").append("<div id='project_list_table' height=100% style='overflow-x:hidden; display:none'></div>");
		$("#project_explorer").append("<div id='project_loading_div' height=100% style='overflow-x:hidden;'><img id='project_loading_gif' src='./images/org.goorm.core.project/loading.gif'></img></div>");
		$('#project_loading_gif').css('width', '100%');

		if (!core.status.current_project_path) core.status.current_project_path = "";
		core.status.selected_file='';
		self.current_project = {};

		$(core).on('project_get_list_complete', function () {
			if (!$.isEmptyObject(localStorage.current_project)) {
				self.current_project = $.parseJSON(localStorage.current_project);
				if (self.current_project.current_project_name !== "" && self.check_project_list(self.current_project.current_project_path)) {
					core.dialog.open_project.open(self.current_project.current_project_path, self.current_project.current_project_name, self.current_project.current_project_type);
				} else {
					self.current_project = {};

					core.status.current_project_name = "";
					core.status.current_project_path = "";
					core.status.current_project_type = "";

					localStorage.current_project = "";
					
				}
			} else {
				self.current_project = {};

				core.status.current_project_name = "";
				core.status.current_project_path = "";
				core.status.current_project_type = "";

				localStorage.current_project = "";
				
			}

		});

		$(core).on('goorm_login_complete', function () {
			var postdata = {
				'get_list_type': 'collaboration_list'
			};

			$.get("project/get_list", postdata, function (data) {
				self.project_data = data;
				self.make_project_selectbox();

				core.workspace = {};
				for (var i in data) {
					data[i].name && (core.workspace[data[i].name] = data[i].contents);
				}
				if (core.status.current_project_path === "") {
					self.make_project_list_table();

				} else {
				}

				$(core).trigger('project_get_list_complete');
			});

			var postdata = {
				kind: "project",
				path: "" + core.status.current_project_path
			};

			self.fill_tree_data(postdata.path);

			self.set_context_menu();

		});

		$(core).on("layout_resized", function () {
			var table = $("#project_list_table");

			if (table.width() != self.old_project_list_table_width && table.css('display') != 'none') {
				self.old_project_list_table_width = table.width();
				self.make_project_list_table();
			}
		});
	},

	refresh: function () {
		var self = this;

		$("#project_loading_div").css('display', '');
		$("#project_treeview").css('display', 'none');
		$("#project_list_table").css('display', 'none');

		$.get("project/get_list", {
			'get_list_type' : 'collaboration_list'
		}, function (data) {
			self.project_data = data;
			self.make_project_selectbox();

			core.workspace = {};
			for (var i in data) {
				data[i].name && (core.workspace[data[i].name] = data[i].contents);
			}

			if (!core.workspace[core.status.current_project_path]) {
				

				core.current_project_name = "";
				core.status.current_project_path = "";
				core.current_projectType = "";
				self.current_project.current_project_path = "";
				self.current_project.current_project_name = "";
				self.current_project.current_projectType = "";

				

				$("#project_treeview").css('display', 'none');
				self.make_project_list_table();
			}
			else if(core.status.current_project_path === "") {
				self.make_project_list_table();
			}
			else{
				var temp_project_path = core.status.current_project_path;
				$("#project_treeview").css("background-color", "#FFF");

				var postdata = {
					kind: "project",
					path: "" + temp_project_path
				};
				self.fill_tree_data(postdata.path);
			}

			var windows = core.module.layout.workspace.window_manager.window;
			var window_index = -1;

			for(window_index = core.module.layout.workspace.window_manager.window.length - 1; window_index>=0; window_index--) {
				var o = core.module.layout.workspace.window_manager.window[window_index];
				var project = o.project;

				if (o.type == 'Editor' && !core.workspace[project]) {
					o.is_saved = true;
					o.close();
				}
			}
		});
	},

	make_project_selectbox: function () {
		var self = this;

		$("#project_selectbox").empty();

		$("#project_selectbox").append("<option localization_key='dictionary_project_list' value='' selected>" + core.module.localization.msg.dictionary_project_list + "</option>");

		if (self.project_data) {
			for (var project_idx = 0; project_idx < self.project_data.length; project_idx++) {
				var temp_name = self.project_data[project_idx].name;

				if (self.project_data[project_idx].name == core.status.current_project_path) {
					$("#project_selectbox").append("<option value='" + project_idx + "' selected>" + temp_name + "</option>");
				} else {
					$("#project_selectbox").append("<option value='" + project_idx + "'>" + temp_name + "</option>");
				}
			}
		}
	},

	refresh_project_selectbox: function () {
		var self = this;
		var postdata = {
			'get_list_type': 'collaboration_list'
		};

		$.get("project/get_list", postdata, function (data) {
			self.project_data = data;
			self.make_project_selectbox();
		});
	},

	on_project_selectbox_change: function (project_idx) {
		var self = this;
		// need modify. NullA

		

		if (project_idx !== "") {

			self.current_project.current_project_path = self.project_data[project_idx].name;
			self.current_project.current_project_name = self.project_data[project_idx].contents.name;
			self.current_project.current_projectType = self.project_data[project_idx].contents.type;
			core.dialog.open_project.open(self.current_project.current_project_path, self.current_project.current_project_name, self.current_project.current_projectType);
		} else {

			core.current_project_name = "";
			core.status.current_project_path = "";
			core.current_projectType = "";
			self.current_project.current_project_path = "";
			self.current_project.current_project_name = "";
			self.current_project.current_projectType = "";
			core.dialog.open_project.open(self.current_project.current_project_path, self.current_project.current_project_name, self.current_project.current_projectType);
		}


	},

	expand_treeview: function (source, target) {
		var self = this;

		$(source).each(function (i) {
			if (this.expanded === true && this.cls == "dir") {
				var object = this;
				$(target).each(function (j) {
					if (object.name == this.name && this.cls == "dir") {
						this.expanded = true;

						self.expand_treeview(object.children, this.children);
					}
				});
			}
		});
	},

	load_explorer_treeview: function () {
		this.treeview_data = JSON.parse(localStorage.explorer_treeview);

		// sort treeview data to expand childs and avoid sync error during dynamic loading.
		if (!this.treeview_data[core.status.current_project_path]) return;
		this.treeview_data[core.status.current_project_path].sort();
	},

	save_explorer_treeview: function () {
		localStorage.explorer_treeview = JSON.stringify(this.treeview_data);
	},

	add_explorer_treeview: function (path) {
		if (!this.treeview_data[core.status.current_project_path]) this.treeview_data[core.status.current_project_path] = [];
		if (path == "//undefined") return; 
		this.remove_explorer_treeview(path); 
		this.treeview_data[core.status.current_project_path].push(path);
		this.save_explorer_treeview();
	},

	remove_explorer_treeview: function (path) {
		if (!this.treeview_data[core.status.current_project_path]) return;
		for (var i = 0; i < this.treeview_data[core.status.current_project_path].length; i++) {
			if (this.treeview_data[core.status.current_project_path][i] == path) {
				this.treeview_data[core.status.current_project_path].remove(i);
				break;
			}
		}
		this.save_explorer_treeview();
	},

	set_context_menu: function () {
		var self = this;

		self.context_menu_file = new org.goorm.core.menu.context();
		self.context_menu_file.init("configs/menu/org.goorm.core.project/project.explorer.file.html", "project.explorer.file", "", "context", null);

		self.context_menu_folder = new org.goorm.core.menu.context();
		self.context_menu_folder.init("configs/menu/org.goorm.core.project/project.explorer.folder.html", "project.explorer.folder", "", "context", null);

		self.context_menu_project = new org.goorm.core.menu.context();
		self.context_menu_project.init("configs/menu/org.goorm.core.project/project.explorer.html", "project.explorer", "", "context", function () {
			self.refresh_event();
		});

		self.refresh_context_menu();
	},

	refresh_context_menu: function () {
		var self = this;

		$("#project_treeview").off("mousedown");
		$("#project_treeview").mousedown(function (e) {

			self.context_menu_file.hide();
			self.context_menu_project.hide();
			self.context_menu_folder.hide();

			$("#project_treeview").find(".ygtvfocus").removeClass("ygtvfocus");

			if (e.which == 3) {
				var container = $("div[id='project.explorer_context']");
				var offset = 0;

				if (($(window).height() - 36) < (e.clientY + container.height())) {
					offset = e.clientY + container.height() - $(window).height() + 36;
				}

				if (!core.is_mobile) {
					core.module.localization.local_apply("div[id='project.explorer_context']", 'menu');
				}

				self.context_menu_project.show();

				container.css("left", e.clientX);
				container.css("top", e.clientY - offset);
			}

			core.status.selected_file = null;
			core.status.selected_file_type = "";
			e.stopPropagation();
			e.preventDefault();
			return false;
		});

		$("#project_treeview").find(".ygtvcell").off("click");
		$("#project_treeview").find(".ygtvcell").click(function (e) {

			self.context_menu_project.hide();
			self.context_menu_file.hide();
			self.context_menu_folder.hide();
			if ($(this).hasClass("ygtvfocus") === false) {
				if (!self.multi_select) {
					$("#project_treeview").find(".ygtvfocus").removeClass("ygtvfocus");
					if ($(this).hasClass("ygtvcontent")) {
						$(this).prev().addClass("ygtvfocus");
						$(this).addClass("ygtvfocus");
					}
				} else if ($(this).hasClass("ygtvcontent")) {
					if ($(this).hasClass("ygtvfocus")) {
						$(this).prev().removeClass("ygtvfocus");
						$(this).removeClass("ygtvfocus");
					} else {
						$(this).prev().addClass("ygtvfocus");
						$(this).addClass("ygtvfocus");
					}
				}

			} else if (self.multi_select) {
				$(this).prev().removeClass("ygtvfocus");
				$(this).removeClass("ygtvfocus");
			}
		});

		$("#project_treeview").find(".ygtvcell").off("mousedown");
		$("#project_treeview").find(".ygtvcell").mousedown(function (e) {

			self.context_menu_project.hide();
			self.context_menu_file.hide();
			self.context_menu_folder.hide();

			core.status.selected_file = $(this).find(".fullpath").html();
			if ($(this).find(".folder").length > 0) {
				core.status.selected_file_type = "folder";
			} else {
				core.status.selected_file_type = "file";
			}
			self.selected_type = $(this).find('span');

			if (e.which == 3) {
				if ($(this).find("span").hasClass("file")) {
					var offset = 0;
					var file_context_container = $("div[id='project.explorer.file_context']");

					if (($(window).height() - 36) < (e.clientY + file_context_container.height())) {
						offset = e.clientY + file_context_container.height() - $(window).height() + 36;
					}

					if (!core.is_mobile) {
						core.module.localization.local_apply("div[id='project.explorer.file_context']", 'menu');
					}

					self.context_menu_file.show();

					file_context_container.css("left", e.clientX);
					file_context_container.css("top", e.clientY - offset);
				}
				else if ($(this).find("span").hasClass("folder")) {
					var offset = 0;
					var folder_context_container = $("div[id='project.explorer.folder_context']");

					var target = $(this)[0];
					var node = self.treeview.getNodeByElement(target);

					if (($(window).height() - 36) < (e.clientY + folder_context_container.height())) {
						offset = e.clientY + folder_context_container.height() - $(window).height() + 36;
					}

					if(node.expanded) {
						folder_context_container.find('a[action="folder_open_context"]').parent().hide();
						folder_context_container.find('a[action="folder_close_context"]').parent().show();
					}
					else{
						folder_context_container.find('a[action="folder_open_context"]').parent().show();
						folder_context_container.find('a[action="folder_close_context"]').parent().hide();
					}

					if (!core.is_mobile) {
						core.module.localization.local_apply("div[id='project.explorer.folder_context']", 'menu');
					}

					self.context_menu_folder.show();

					folder_context_container.css("left", e.clientX);
					folder_context_container.css("top", e.clientY - offset);
				}

				var selected_items = $("#project_treeview .ygtvfocus .node");
				if (selected_items.length > 1) {
					$('a[action=delete_context]').hide();
					$('a[action=delete_all_context]').show();
				} else {
					$('a[action=delete_all_context]').hide();
					$('a[action=delete_context]').show();
				}

				if ($(this).hasClass("ygtvfocus") === false) {
					if (!self.multi_select) {
						$("#project_treeview").find(".ygtvfocus").removeClass("ygtvfocus");
						if ($(this).hasClass("ygtvcontent")) {
							$(this).prev().addClass("ygtvfocus");
							$(this).addClass("ygtvfocus");
						}
					} else if ($(this).hasClass("ygtvcontent")) {
						if ($(this).hasClass("ygtvfocus")) {
							$(this).prev().removeClass("ygtvfocus");
							$(this).removeClass("ygtvfocus");
						} else {
							$(this).prev().addClass("ygtvfocus");
							$(this).addClass("ygtvfocus");
						}
					}
				}

				
			}

			e.stopPropagation();
			e.preventDefault();
			return false;
		});
	},
	copy: function () {
		var self = this;
		self.clipboard = self.get_tree_selected_path();
	},
	paste: function () {
		var self = this;
		if (self.clipboard && self.selected_type.hasClass('folder')) {
			var postdata = {
				source: self.clipboard,
				target: core.status.selected_file
			};
			$.get("file/copy_file_paste", postdata, function (data) {
				if (data.result) {
					console.log(data.result);
				}
				//self.clipboard = false;
				self.refresh();
			});
		}
	},
	get_tree_selected_items: function () {
		//multi selecte get items API.
		var selected_items = $("#project_treeview .ygtvfocus .node");
		return selected_items;
	},

	get_tree_selected_path: function () {
		var selected_items = $("#project_treeview .ygtvfocus .node");
		var files = [];
		var directorys = [];
		$(selected_items).each(function (i, o) {
			if ($(o).find('span').hasClass("file")) {
				files.push($(o).find(".fullpath").html());
			} else {
				directorys.push($(o).find(".fullpath").html());
			}
		});
		return {
			files: files,
			directorys: directorys
		};
	},

	refresh_event: function () {
		core.module.localization.change_language(localStorage.getItem("language"), true);
		core.module.action.init();
	},

	check_project_list: function (project_path) {
		var self = this;

		if (self.project_data) {
			var project_data = self.project_data;

			for (var i = 0; i < project_data.length; i++) {
				if (project_data[i].name == project_path) {
					return true;
				}
			}

			return false;
		} else {
			return false;
		}
	},

	make_project_list_table: function () {
		var self = this;

		var project_list_table = $("#project_list_table");
		project_list_table.empty();

		//useonly(mode=basic)
		project_list_table.append("<div id='my_project_list'></div>");

		var my_project_list_title_html = "<div class='table_list_title' localization_key='dictionary_my_project'>" + core.module.localization.msg.dictionary_my_project + "</div>";
		$("#my_project_list").append(my_project_list_title_html);
		$("#my_project_list").append("<div id='my_project_list_table'></div>");
		//useonlyend

		

		var project_list_width = $("#project_explorer").width();
		if (project_list_width < 199) project_list_width = 199;

		var type_width = parseInt(project_list_width / 7, 10) + 1;
		var name_width = parseInt(project_list_width / 8 * 3, 10) + 1;
		var author_width = parseInt(project_list_width / 7, 10) + 1;

		var table_column_definition = [{
			key: "type",
			label: '<span localization_key="dictionary_type">' + core.module.localization.msg.dictionary_type + '</span>',
			width: type_width
		}, {
			key: "name",
			label: '<span localization_key="dictionary_name">' + core.module.localization.msg.dictionary_name + '</span>',
			width: name_width
		}, {
			key: "author",
			label: '<span localization_key="dictionary_author">' + core.module.localization.msg.dictionary_author + '</span>',
			width: author_width
		}];

		var data_properties = new YAHOO.util.DataSource();

		data_properties.responseSchema = {
			resultNode: "property",
			fields: ["type", "name", "author"]
		};

		
		var my_table = new YAHOO.widget.DataTable("my_project_list_table", table_column_definition, data_properties);
		my_table.render();

		for (var p in core.workspace) {
			var project = core.workspace[p];

			my_table.addRow({
				type: project.type,
				name: project.name,
				author: project.author
			});
		}

		var row_click_my = function (data) {
			var record = my_table.getRecord(data.target);

			var selected_project_name = record._oData.author + "_" + record._oData.name;
			$('#project_selectbox').find('option').each(function (i, item) {
				if ($(item).html() == selected_project_name) {
					$('#project_selectbox').val($(item).val());
					self.on_project_selectbox_change($(item).val());
				}
			});

		};

		my_table.subscribe("rowClickEvent", function (data) {
			row_click_my(data);
		});

		$("#my_project_list_table .yui-dt-rec").hover(function () {
			core.status.k = $(this);
			$(this).css('cursor', 'pointer');
			$(this).css('background-color', 'rgba(10,100,255,0.5)');
		}, function () {
			$(this).css('cursor', 'auto');
			$(this).css('background-color', '');
		});



		//show!!!!
		$("#project_loading_div").css('display', 'none');
		$("#project_list_table").css('display', '');

		

		self.set_style();

		$('#project_explorer_refresh_tool').off('click');
		$('#project_explorer_refresh_tool').click(function(e){
			self.refresh();
		});
	},

	set_style: function () {
		var self = this;
		$("#my_project_list_table").find("table").css("border", "0px");
		$("#my_project_list_table").find("table").css("font-size", "11px");
		$("#my_project_list_table").find("table").css("width", "100%");
		if (core.status.current_project_path === "")
			$("#my_project_list_table").find("table").css("border-bottom", "gray 1px solid");

		
	},

	drag_n_drop: function () {
		var colne;
		var self = this;
		var drag_mode = false;
		var hasColne = false;
		var target = $('#project_treeview').find('.node');
		var treeView_Y = $("#project_selector").offset().top - $("#project_selector").height() + 5;
		var multi_mode = false;
		target.off('mousedown');
		target.on('mousedown', function (e) {
			if (e.which != 3) {
				if (self.multi_select || $('#project_treeview').find('.ygtvfocus .node').length > 1) {
					multi_mode = true;
				} else {
					drag_mode = true;
					$('#project_treeview').find('.ygtvfocus').removeClass('ygtvfocus');

				}
				target = this;
			}
		});
		$('#project_treeview').off('mousemove');
		$('#project_treeview').on('mousemove', function (e) {
			if (drag_mode && !self.multi_select) {
				if (!hasColne) {
					colne = $(target).clone();
					$('#project_treeview').append(colne);
					$(colne).css('position', 'absolute');
					hasColne = true;

				}
				$(colne).css('left', e.clientX + 5);
				$(colne).css('top', e.clientY - treeView_Y);
			} else if (multi_mode && !self.multi_select) {
				if (!hasColne) {
					colne = $('#project_treeview').find('.ygtvfocus .node').clone();
					$('#project_treeview').append(colne);
					$(colne).css('position', 'absolute');
					hasColne = true;
					$('#project_treeview').find('.ygtvfocus').removeClass('ygtvfocus');
				}
				$(colne).css('left', e.clientX + 5);
				$(colne).css('top', e.clientY - treeView_Y);
			}
		});
		$('#project_treeview').off('mouseup');
		$('#project_treeview').on('mouseup', function (e) {
			if (drag_mode && !self.multi_select) {
				var drop_position_el = document.elementFromPoint(e.clientX, e.clientY);
				drop_position_el = $(drop_position_el);
				if (drop_position_el.attr('id') != 'project_treeview' && drop_position_el.find('.folder')[0]) {
					var after_path = drop_position_el.find('div').text();
					var current_path = [];
					current_path.push($(target).find('div').text());
					if (after_path != current_path) {
						var getdata = {
							after_path: after_path,
							current_path: current_path
						};
						$.get('project/move_file', getdata, function (data) {
							self.refresh(true);

							getdata.change = "drag_n_drop";
							core.module.layout.workspace.window_manager.synch_with_fs(getdata);

						});
					}
				}
				drag_mode = false;
				$(colne).remove();
				hasColne = false;
			} else if (multi_mode && !self.multi_select && colne) {

				var drop_position_el = document.elementFromPoint(e.clientX, e.clientY);
				drop_position_el = $(drop_position_el);

				if (drop_position_el.attr('id') != 'project_treeview' && drop_position_el.find('.folder')[0]) {
					var current_path = [];
					$(colne).each(function (i, o) {
						current_path.push($(o).find('div').text());
					});
					var after_path = drop_position_el.find('div').text();

					if ($(colne).find('div').text().indexOf(after_path) == -1) {
						var getdata = {
							after_path: after_path,
							current_path: current_path
						};
						$.get('project/move_file', getdata, function (data) {
							self.refresh(true);

							getdata.change = "drag_n_drop";
							core.module.layout.workspace.window_manager.synch_with_fs(getdata);

						});
					}
				}

				colne.remove();
				hasColne = false;
			}
			multi_mode = false;

		});
		target.on('mouseenter', function (e) {
			if (drag_mode && !self.multi_select) {
				$(this).parent().prev().addClass("ygtvfocus");
				$(this).parent().addClass("ygtvfocus");
			} else if (multi_mode && !self.multi_select) {
				$(this).parent().prev().addClass("ygtvfocus");
				$(this).parent().addClass("ygtvfocus");
			}
		});
		target.on('mouseleave', function (e) {
			if (drag_mode && !self.multi_select) {
				$(this).parent().prev().removeClass("ygtvfocus");
				$(this).parent().removeClass("ygtvfocus");
			} else if (multi_mode && !self.multi_select) {
				$(this).parent().prev().removeClass("ygtvfocus");
				$(this).parent().removeClass("ygtvfocus");
			}
		});




		///////////////////
		var doc = document.getElementById('project_treeview');
		doc.ondragover = function () { this.className = 'hover'; console.log('hi');return false; };
		doc.ondragend = function () { this.className = ''; console.log('bye');return false; };
		doc.ondrop = function (event) {
			event.preventDefault && event.preventDefault();
			this.className = '';

		  	var drop_position_el = document.elementFromPoint(event.clientX, event.clientY);
			drop_position_el = $(drop_position_el);
			console.log(drop_position_el);
			core.sim=drop_position_el;



			var upload_path='';
			if(drop_position_el.find('.fullpath').length === 1){
				upload_path=drop_position_el.find('.fullpath').text();
				if(drop_position_el.find('.folder').length==0){
					//file -> parent folder is upload path
					upload_path=upload_path.split('/');
					upload_path.pop();
					upload_path=upload_path.join('/');
				}	
			}else{
				upload_path=core.status.current_project_path;
			}
			

			console.log('');
			console.log(upload_path);
			console.log('');

			// now do something with:
			var files = event.dataTransfer.files;
			console.log(files);

			//size check
			//50MB
			var total_size=0;
			for(var i=0;i<files.length;i++){
				total_size+=parseInt(files[i].size, 10);
			}


			if(total_size>=10000000){
				alert.show('You can not upload files if total size is bigger than 10MB ');
				return false;
			}


			var formData = new FormData();
			for (var i = 0; i < files.length; i++) {
			  formData.append('file', files[i]);
			}
			formData.append('file_import_location_path', upload_path);




			// now post a new XHR request
			var xhr = new XMLHttpRequest();
			xhr.open('POST', '/upload');
			xhr.onload = function () {
				console.log(xhr);

				if (xhr.status === 200) {
					console.log('all done: ' + xhr.status);
			  	} else {
			  		alert.show('Upload Fail');
					console.log('Something went terribly wrong...');
			  	}
			  	setTimeout(function(){
				  	self.refresh();
			  	}, 500);

			};

			xhr.send(formData);
		  
		  
		  return false;
		};
		////////////////////



	},

	fill_tree_data: function (path) {
		if (path === "") {
			return false;
		}

		var self = this;
		var postdata = {
			'path': path,
			'project_path': core.status.current_project_path
		};
		//tree init 

		$.get('file/get_result_ls', postdata, function (data) {
			$('#project_treeview').empty();
			self.treeview = new YAHOO.widget.TreeView('project_treeview');

			var project_root = {
				cls: "dir",
				expanded: true,
				html: "<div class='node root_folder'><span class='directory_icon folder filetype-folder-opened' /></span>" + core.status.current_project_path + "<div class='fullpath' style='display:none;'>" + core.status.current_project_path + "</div></div>",
				name: core.status.current_project_path,
				parent_label: "/",
				root: "/",
				sortkey: "0",
				type: "html",
				children: []
			};

			var root = self.treeview.getRoot();

			var project_root_node = new YAHOO.widget.HTMLNode(project_root, root, false);
			project_root_node.setDynamicLoad(self.loadNodeData);
			project_root_node.root_object = self;

			core.status.project_root_chilren_arr = [];
			for (var i = 0; i < data.length; i++) {
				core.status.project_root_chilren_arr.push(data[i].filename + "");
			}

			for (var i = 0; i < data.length; i++) {

				var tmpNode = new YAHOO.widget.HTMLNode(data[i], root.children[0], false);
				if (data[i].cls == 'dir') {
					tmpNode.setDynamicLoad(self.loadNodeData);
					if (self.treeview_data && self.treeview_data[core.status.current_project_path] && self.treeview_data[core.status.current_project_path].hasObject(data[i].parent_label + '/' + data[i].filename)) {
						tmpNode.expand();
					}
				}
				tmpNode.root_object = self;
			}

			self.treeview.draw();

			//tree event start

			$("#project_explorer").off('keydown');
			$("#project_explorer").on('keydown', function (key) {

				// ctrl or command key
				//
				if ((key.which == 17 || key.which == 91) && !self.multi_select) {
					self.multi_select = true;
				}
			});
			$("#project_explorer").off('keyup');
			$("#project_explorer").on('keyup', function (key) {

				// ctrl or command key
				//
				if (key.which == 17 || key.which == 91) {
					self.multi_select = false;
				}
			});
			self.treeview.unsubscribe("clickEvent");
			self.treeview.subscribe("clickEvent", function (nodedata) {
				if (!self.multi_select) {

					$("#project_explorer").attr('tabindex', 0);
					$("#project_explorer").focus();
				}

				return false;
			});

			if (!core.is_mobile) {
				self.treeview.unsubscribe("dblClickEvent");
				self.treeview.subscribe("dblClickEvent", function (nodedata) {

					

					if (nodedata.node.data.cls == "file") {
						var filename = nodedata.node.data.filename;
						var filetype = nodedata.node.data.filetype;
						var filepath = nodedata.node.data.parent_label + '/';
						core.module.layout.workspace.window_manager.open(filepath, filename, filetype);
					} else if (nodedata.node.data.cls == "dir") {
						if (nodedata.node.data.root == '/') {
							$('#project_selectbox').find('option').each(function (i, item) {
								if ($(item).html() == nodedata.node.data.name) {
									$('#project_selectbox').val($(item).val());
									self.on_project_selectbox_change($(item).val());
								}
							});
						} else {
							if (nodedata.node.expanded) {
								nodedata.node.collapse();
							} else {
								nodedata.node.expand();
							}
						}
					}

				});
			} else {
				self.treeview.unsubscribe("clickEvent");
				self.treeview.subscribe("clickEvent", function (nodedata) {

					

					if (nodedata.node.data.cls == "file") {
						var filename = nodedata.node.data.filename;
						var filetype = nodedata.node.data.filetype;
						var filepath = nodedata.node.data.parent_label + '/';
						core.module.layout.workspace.window_manager.open(filepath, filename, filetype);
					} else if (nodedata.node.data.cls == "dir") {
						if (nodedata.node.data.root == '/') {
							$('#project_selectbox').find('option').each(function (i, item) {
								if ($(item).html() == nodedata.node.data.name) {
									$('#project_selectbox').val($(item).val());
									self.on_project_selectbox_change($(item).val());
								}
							});
						} else {
							if (nodedata.node.expanded) {
								nodedata.node.collapse();
							} else {
								nodedata.node.expand();
							}
						}
					}

				});
			}

			self.treeview.subscribe("expandComplete", function (node) {
				self.refresh_context_menu();
				self.drag_n_drop();

				var dir_id = node.contentElId;
				$('#' + dir_id + ' span').removeClass('filetype-folder').addClass('filetype-folder-opened');

				var path = node.data.parent_label + "/" + node.data.filename;
				self.add_explorer_treeview(path);

				//no children handle
				self.no_children_handle();
			});

			self.treeview.subscribe("collapseComplete", function (node) {
				var dir_id = node.contentElId;
				$('#' + dir_id + ' span').removeClass('filetype-folder-opened').addClass('filetype-folder');

				var path = node.data.parent_label + "/" + node.data.filename;
				self.remove_explorer_treeview(path);

				//no children handle
				self.no_children_handle();
			});
			self.refresh_context_menu();

			self.drag_n_drop();
			//tree event finish
			//show

			$('#project_loading_div').css('display', 'none');
			$('#project_treeview').css('display', '');
			project_root_node.expand();

		}); //end ajax

	},

	loadNodeData: function (node, fnLoadComplete) {
		var self = core.module.layout.project_explorer;
		var postdata = {
			'path': node.data.parent_label + '/' + node.data.filename
		};

		$.get('file/get_result_ls', postdata, function (data) {
			if (data !== null) {
				for (var i = 0; i < data.length; i++) {
					var newNode = new YAHOO.widget.HTMLNode(data[i], node, false);
					if (data[i].cls == 'dir') {
						newNode.setDynamicLoad(self.loadNodeData);
						if (self.treeview_data[core.status.current_project_path].hasObject(data[i].parent_label + '/' + data[i].filename)) {
							newNode.expand();
						}
					}
				}
			}
			fnLoadComplete();

		});

	},

	no_children_handle: function () {
		var no = $($(".no_children").parent().parent());
		if (!no) return;

		for (var i = 0; i < no.length; i++) {
			if (!$(no[i]).children()) return;
			var len = $(no[i]).children().length;
			var target = $($(no[i]).children()[len - 2]);
			if (!target) return;

			if (target.hasClass("ygtvtp") || target.hasClass("ygtvtm")) {
				target.removeClass("ygtvtp");
				target.removeClass("ygtvtm");
				target.addClass("ygtvtn");
			} else if (target.hasClass("ygtvlm") || target.hasClass("ygtvlp")) {
				target.removeClass("ygtvlm");
				target.removeClass("ygtvlp");
				target.addClass("ygtvln");
			}
		}
	}

};
