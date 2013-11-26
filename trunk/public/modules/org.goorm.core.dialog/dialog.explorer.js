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



org.goorm.core.dialog.explorer = function () {
	this.location_path = null;
	this.dir_tree = null;
	this.files = null;
	this.file_type = null;

	this.treeview = null;

	this.current_path = null;

	this.target_name = null;

	this.is_dir_only = false;
};

org.goorm.core.dialog.explorer.prototype = {
	init: function (context, is_dir_only) {
		var self = this;
		self.context = context;
		self.location_path = context + "_location_path";
		self.dir_tree_ori = context + "_dir_tree";
		self.dir_tree_ori = self.dir_tree_ori.replace("#", "");

		self.dir_tree = context + "_dir_tree";
		self.files = context + "_files";

		self.current_path = core.status.selected_file || core.status.current_project_path;
		if(core.status.current_project_path===''){
			self.current_path='';
		}
		if (self.current_path === core.status.selected_file && core.status.selected_file_type === "file") {
			var tmp = self.current_path.split("/");
			tmp.pop();
			self.current_path = tmp.join("/");
		}
		self.current_path+='/';

		$(self.location_path).val(self.current_path);

		self.target_name = context + "_target_name";
		$(self.target_name).val("");
		$(self.target_name).attr("maxlength", 250);

		self.is_dir_only = is_dir_only;

		self.file_type = context + "_file_type";
		if (self.is_dir_only) {
			self.add_directories();
		} else {
			self.add_directories();
			self.add_file_items();
			self.add_file_type_selector();
		}

		self.bind();
	},

	get_data: function () {
		var self = this;

		var data = {};

		if (self.files == "#file_open_files") {
			data.name = self.filename;
			data.type = self.filetype;
			data.path = self.filepath;
		} else {
			data.path = $(self.location_path).val();
			data.name = $(self.target_name).val();
			data.type = $(self.file_type).val();
		}

		if (typeof data.path == "undefined") {
			data.path = "";
		}
		if (typeof data.name == "undefined") {
			data.name = "";
		}
		if (typeof data.type == "undefined") {
			data.type = "";
		}

		if (data.path === "") {
			data.path = "/";
		}

		if (data.path.indexOf(" ") == -1 && data.name.indexOf(" ") == -1 && data.type.indexOf(" ") == -1) {
			return data;
		} else {
			return false;
		}
	},
	loadNodeData: function (node, fnLoadComplete) {

		var self = this;
		var postdata = {
			'path': node.data.parent_label + '/' + node.data.filename
		};

		$.get('file/get_result_ls', postdata, function (data) {
			if (data !== null && data !== undefined) {
				for (var i = 0; i < data.length; i++) {
					if (data[i].cls != 'dir') continue;
					var newNode = new YAHOO.widget.HTMLNode(data[i], node, false);
					if (data[i].cls == 'dir') {
						newNode.setDynamicLoad(self.dataLoader);

						if (core.status.selected_file && core.status.selected_file.search(data[i].parent_label + '/' + data[i].filename) === 0) {
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
			} else {
			}
		}
	},



	add_directories: function () {
		var self = this;

		$(self.dir_tree).empty();

		var postdata = {
			'path': core.status.current_project_path,
			'project_path': core.status.current_project_path
		};
		//tree init 

		$.get('file/get_result_ls', postdata, function (data) {
			self.treeview = new YAHOO.widget.TreeView(self.dir_tree_ori);
			var project_root_path=core.status.current_project_path+'';
			if(project_root_path===''){
				project_root_path='workspace';
			}

			var project_root = {
				cls: "dir",
				expanded: true,
				html: "<div class='node root_folder'><img src=images/icons/filetype/folderOpened.filetype.png class='directory_icon folder' />" + project_root_path + "<div class='fullpath' style='display:none;'>" + core.status.current_project_path + "</div></div>",
				name: core.status.current_project_path,
				filename: core.status.current_project_path,
				parent_label: "",
				root: "/",
				sortkey: "0",
				type: "html",
				children: []
			};



			var root = self.treeview.getRoot();

			var project_root_node = new YAHOO.widget.HTMLNode(project_root, root, false);
			project_root_node.root_object = self;

			if (!core.status.selected_file) {
				core.status.selected_file = $('#project_treeview div.root_folder div.fullpath').html();
			}
			for (var i = 0; i < data.length; i++) {
				//only dir	
				if (data[i].cls != 'dir') continue;

				var tmpNode = new YAHOO.widget.HTMLNode(data[i], root.children[0], false);
				if (data[i].cls == 'dir') {
					tmpNode.setDynamicLoad(self.loadNodeData);
					if (core.status.selected_file && core.status.selected_file.search(data[i].parent_label + '/' + data[i].filename) === 0) {
						tmpNode.expand();
					}
				}
				tmpNode.root_object = self;
			}

			self.treeview.draw();
			project_root_node.expand();



			//event bind start
			self.treeview.subscribe("clickEvent", function (nodedata) {
				if (nodedata.node.data.cls == "dir") {
					$(self.dir_tree + " td").removeClass("ygtvfocus");

					$("#" + nodedata.node.contentElId.replace("contentel", "t")).addClass("ygtvfocus");
					$("#" + nodedata.node.contentElId).addClass("ygtvfocus");

					
					self.current_path = (nodedata.node.data.parent_label + '/' + nodedata.node.data.filename).replace("//", "/");
					if(self.current_path[0]==='/'){
						self.current_path=self.current_path.substring(1).replace('//','/');
					}
					self.current_path+='/';

					$(self.location_path).val(self.current_path);

					if (!self.is_dir_only) {
						self.add_file_items();
					}

					return false;
				}
			});

			self.treeview.subscribe("dblClickEvent", function (nodedata) {
				core.sim=nodedata;
				if (nodedata.node.data.cls === 'dir' &&  !$("#"+nodedata.node.contentElId).children().hasClass("no_children") ) {
					if (nodedata.node.expanded) {
						nodedata.node.collapse();
					} else {
						nodedata.node.expand();
					}
				}
			});

			self.treeview.subscribe("expandComplete", function (node) {
				$('#' + node.contentElId).find('span').removeClass('filetype-folder').addClass('filetype-folder-opened');

				$(self.dir_tree + " td").removeClass("ygtvfocus");
				$("#" + node.contentElId.replace("contentel", "t")).addClass("ygtvfocus");
				$("#" + node.contentElId).addClass("ygtvfocus");

				if (core.status.selected_file == node.data.parent_label + '/' + node.data.filename) {

				}
				//no children handle
				self.no_children_handle();
			});
			self.treeview.subscribe("collapseComplete", function (node) {
				$('#' + node.contentElId).find('span').removeClass('filetype-folder-opened').addClass('filetype-folder');

				$(self.dir_tree + " td").removeClass("ygtvfocus");
				$("#" + node.contentElId.replace("contentel", "t")).addClass("ygtvfocus");
				$("#" + node.contentElId).addClass("ygtvfocus");
			});
			project_root_node.expand();
			$(self.treeview.getEl()).focus();
			//no children handle
			self.no_children_handle();
		});
	},

	expand_directory: function (directory) {
		var self = this;

		var nodes = directory.split('/');

		var target_parent = "";
		var target_name = "";

		function get_node_by_path(node) {
			var parent_label = node.data.parent_label;
			if (parent_label === "") parent_label = node[0];

			if ('/' + parent_label + '/' == target_parent && node.data.filename == target_name) return true;
			else if ('/' + parent_label == target_parent && node.data.filename == target_name) return true;
			else if (parent_label + '/' == target_parent && node.data.filename == target_name) return true;
			else return false;
		}

		for (var i = 0; i < nodes.length; i++) {
			target_name = nodes[i];

			var target_node = self.treeview.getNodesBy(get_node_by_path);
			if (target_node) {
				target_node = target_node.pop();
				target_node.expand();
			}

			target_parent += nodes[i] + '/';
		}
	},

	tree_expand_complete: function () {
		var self = this;

		var dir_tree = $(self.dir_tree);

		dir_tree.find("td.ygtvcell").off("mousedown");
		dir_tree.find("td.ygtvcell").mousedown(function (e) {
			if ($(this).hasClass("ygtvfocus") === false) {
				dir_tree.find(".ygtvfocus").removeClass("ygtvfocus");

				if ($(this).hasClass("ygtvcontent")) {
					$(this).prev().addClass("ygtvfocus");
					$(this).addClass("ygtvfocus");
				}
			}
		});
	},

	add_file_items: function (directory_path) {
		var self = this;
		var path = directory_path || this.current_path;

		var files = $(self.files);
		
		var file_item = files.find("div.file_item");
		var folder_item = files.find("div.folder_item");

		var target_name = $(self.target_name);

		var postdata = {
			path: path,
			type: 'add_file_items'
		};	

		$.get("file/get_result_ls", postdata, function (data) {

			files.empty();

			if (data) {
				for (var idx = 0; idx < data.length; idx++) {
					var icon_str = "";
					if (data[idx].cls == "dir") {
						icon_str += "<div class='folder_item'";
						icon_str += " filename='" + data[idx].filename + "' filepath='" + data[idx].parent_label + "'>";
						icon_str += "<img src='images/org.goorm.core.file/folder.png'>";
					} else {
						icon_str += "<div class='file_item'";
						icon_str += " filename='" + data[idx].filename + "' filetype='" + data[idx].filetype + "' filepath='" + data[idx].parent_label + "'>";
						icon_str += "<img src='images/org.goorm.core.file/file.png'>";
					}

					icon_str += "<div style='word-break:break-all; width:60px; line-height:12px; margin-left:5px; margin-right:5px; margin-bottom:5px;'>";

					if (data[idx].cls == "dir") {
						icon_str += data[idx].filename;
					} else {
						icon_str += data[idx].filename;
					}

					icon_str += "</div>";

					files.append(icon_str);
				}
			}

			folder_item = files.find("div.folder_item");
			file_item = files.find("div.file_item");
			folder_item.dblclick(function () {
				
				self.current_path = self.current_path  + $(this).attr("filename");
				if(self.current_path[0]==='/'){
					self.current_path=self.current_path.substring(1).replace('//','/');
				}	
				self.current_path+='/';


				$(self.location_path).val(self.current_path);

				self.add_file_items();
				self.expand_directory(self.current_path);
			});

			folder_item.click(function () {
				var node;

				file_item.removeClass("selected_item");
				folder_item.removeClass("selected_item");

				$(self.dir_tree + " td").removeClass("ygtvfocus");

				$(this).addClass("selected_item");

				var list = $(self.dir_tree + ' div.ygtvitem td.ygtvcontent div.fullpath');
				var path = $(this).attr('filepath') + '/' + $(this).attr('filename');
				

				for (var i = 0; i < list.length; i++) {
					var item = list[i];

					var dir_path = $(item).html();
					if ('/' + dir_path === path || dir_path === path) {
						node = $(item).parent().parent().parent();

						node.find('td').addClass('ygtvfocus');
						node.find('.ygtvblankdepthcell').removeClass('ygtvfocus');
						node.find('.ygtvdepthcell').removeClass('ygtvfocus');
						break;
					}
				}

				if(node){
					var dir_top = $(self.dir_tree).offset().top;
					var current_location = node.offset().top;
					var scroll_top = $(self.dir_tree).scrollTop();

					$(self.dir_tree).scrollTop(current_location + scroll_top - dir_top);
				}
			});

			if (self.files == "#file_open_files") {
				file_item.dblclick(function () {
					core.module.layout.workspace.window_manager.open($(this).attr("filepath"), $(this).attr("filename"), $(this).attr("filetype"));
					core.dialog.open_file.dialog.panel.hide();
				});

				file_item.click(function () {

					file_item.removeClass("selected_item");
					folder_item.removeClass("selected_item");
					$(this).addClass("selected_item");

					target_name.val($(this).attr("filename"));

					self.filename = $(this).attr("filename");
					self.filetype = $(this).attr("filetype");
					self.filepath = $(this).attr("filepath");
				});
			} else if (self.files == "#file_export_files") {
				file_item.click(function () {

					file_item.removeClass("selected_item");
					folder_item.removeClass("selected_item");
					$(this).addClass("selected_item");

					target_name.val($(this).attr("filename"));

					self.filename = $(this).attr("filename");
					self.filetype = $(this).attr("filetype");
					self.filepath = $(this).attr("filepath");
				});

				var target = core.status.selected_file.split('/').pop();
				for (var i = 0; i < file_item.length; i++) {
					if ($(file_item[i]).text() == target) {
						$(file_item[i]).click();
						break;
					}
				}
			} else if (self.files == "#file_select_files") {
				file_item.dblclick(function () {
					core.dialog.file_select.target.target_file = $(this).attr("filepath") + $(this).attr("filename");
					core.dialog.file_select.target.file_list_process();
					core.dialog.file_select.dialog.panel.hide();
				});

				file_item.click(function () {

					file_item.removeClass("selected_item");
					folder_item.removeClass("selected_item");
					$(this).addClass("selected_item");

					target_name.val($(this).attr("filename"));

					self.filename = $(this).attr("filename");
					self.filetype = $(this).attr("filetype");
					self.filepath = $(this).attr("filepath");
				});
			} else if (self.files == "#file_move_files") {
				file_item.dblclick(function () {
					core.dialog.file_select.target.target_file = $(this).attr("filepath") + $(this).attr("filename");
					core.dialog.file_select.target.file_list_process();
					core.dialog.file_select.dialog.panel.hide();
				});

				file_item.click(function () {

					file_item.removeClass("selected_item");
					folder_item.removeClass("selected_item");
					$(this).addClass("selected_item");

					target_name.val($(this).attr("filename"));

					self.filename = $(this).attr("filename");
					self.filetype = $(this).attr("filetype");
					self.filepath = $(this).attr("filepath");
				});
			}
			//by sim
			else if (self.files == "#file_cloud_upload_files") {
				file_item.click(function () {

					file_item.removeClass("selected_item");
					folder_item.removeClass("selected_item");
					$(this).addClass("selected_item");

					target_name.val($(this).attr("filename"));

					self.filename = $(this).attr("filename");
					self.filetype = $(this).attr("filetype");
					self.filepath = $(this).attr("filepath");
				});
			}
			//by sim
			else {
				file_item.click(function () {
					file_item.removeClass("selected_item");
					folder_item.removeClass("selected_item");
					$(this).addClass("selected_item");
				});
			}
		});
	},

	add_file_type_selector: function () {
		var self = this;

		var option_html = '<option value="" selected="selected">All Files (*.*)</option>';

		for (var i = 0; i < core.filetypes.length; i++) {
			option_html += '<option value="' + core.filetypes[i].file_extension + '">' + core.filetypes[i].description + ' (*.' + core.filetypes[i].file_extension + ')</option>';
		}

		$(self.file_type).html(option_html);

		$(self.file_type + " option:eq(0)").attr("selected", "selected");

		$(self.file_type).change(function () {
			$(self.files + " .file_item").show();

			if ($(this).val() === "") {
				$(self.files + " .file_item").show();
			} else {
				$(self.files + " .file_item").each(function () {
					if ($(this).attr("filetype") != $(self.file_type).val()) {
						$(this).hide();
					}
				});
			}
		});
	},

	bind: function () {
		var self = this;

		var files_container = self.files;
		var treeview_container = self.dir_tree;

		$(files_container).click(function () {
			$(this).focus();

			core.status.selected_dialog = self;
			core.status.selected_dialog_container = $(files_container);
			core.status.foucs_on_dialog = true;
		});

		$(treeview_container).click(function () {
			$(this).focus();

			core.status.selected_dialog = self;
			core.status.selected_dialog_container = $(treeview_container);
			core.status.foucs_on_dialog = true;
		});

		$(treeview_container).click();
	},

	select_manager: function (container, key) {
		var self = this;

		var files_container = {
			'__up': function () {
				var container_width = container.prop('clientWidth');
				var item_width = container.find('div:first').outerWidth(true);
				var selected_item = container.find('.selected_item');

				if (item_width) {
					var items_number = parseInt(container_width / item_width, 10);

					if (typeof (items_number) == 'number') {
						var next_item = selected_item;

						for (var i = 0; i < items_number; i++) {
							next_item = next_item.prev();

							if (!next_item) {
								next_item = [];
								break;
							}
						}

						if (next_item.length === 0) {
							next_item = selected_item;
							for (var i = 0; i < items_number; i++) {
								next_item = next_item.next();

								if (!next_item) {
									next_item = [];
									break;
								}
							}
						}

						if (next_item.length === 0) {
							next_item = selected_item;
						}

						next_item.click();
					}
				}
			},

			'__down': function () {
				var container_width = container.prop('clientWidth');
				var item_width = container.find('div:first').outerWidth(true);
				var selected_item = container.find('.selected_item');

				if (item_width) {
					var items_number = parseInt(container_width / item_width, 10);

					if (typeof (items_number) == 'number') {
						var next_item = selected_item;

						for (var i = 0; i < items_number; i++) {
							next_item = next_item.next();

							if (!next_item) {
								next_item = [];
								break;
							}
						}

						if (next_item.length === 0) {
							next_item = selected_item;
							for (var i = 0; i < items_number; i++) {
								next_item = next_item.prev();

								if (!next_item) {
									next_item = [];
									break;
								}
							}
						}

						if (next_item.length === 0) {
							next_item = selected_item;
						}

						next_item.click();
					}
				}
			},

			'__left': function () {
				var selected_item = container.find('.selected_item');
				var next_item = selected_item.prev();

				if (next_item.length === 0) {
					next_item = container.find('div:last');
				}

				next_item.click();
			},

			'__right': function () {
				var selected_item = container.find('.selected_item');
				var next_item = selected_item.next();

				if (next_item.length === 0) {
					next_item = container.find('div:first');
				}

				next_item.click();
			},

			'__enter': function () {
				var selected_item = container.find('.selected_item');
				selected_item.dblclick();
			},

			'__backspace': function () {
				treeview_container.__backspace();
			}
		};

		var treeview_container = {
			'__up': function () {
				var selected_item_el_id = $($(self.dir_tree).find('.ygtvfocus')[1]).parent().find('td:last').attr('id');
				var selected_item = self.treeview.getNodesByProperty('contentElId', selected_item_el_id)[0];

				var next_item = selected_item.previousSibling;

				if (!next_item) {
					var parent = selected_item.parent;
					if (parent && parent.parent) {
						next_item = selected_item.parent;
					}
				}

				if (next_item) {
					if (next_item.data.cls == "dir") {
						$(self.dir_tree + " td").removeClass("ygtvfocus");

						$("#" + next_item.contentElId.replace("contentel", "t")).addClass("ygtvfocus");
						$("#" + next_item.contentElId).addClass("ygtvfocus");

						self.current_path = (nodedata.node.data.parent_label + '/' + nodedata.node.data.filename).replace("//", "/");
						if(self.current_path[0]==='/'){
							self.current_path=self.current_path.substring(1).replace('//','/');
						}
						self.current_path+='/';

						$(self.location_path).val(self.current_path);

						if (!self.is_dir_only) {
							self.add_file_items();
						}

						var dir_height = $(self.dir_tree).prop('clientHeight');
						var dir_top = $(self.dir_tree).offset().top;
						var current_location = $("#" + next_item.contentElId).offset().top;
						var scroll_top = $(self.dir_tree).scrollTop();

						if (!(dir_top < current_location && current_location < dir_top + dir_height))
							$(self.dir_tree).scrollTop(current_location + scroll_top - dir_top);
						$(self.dir_tree).focus();
					}
				}
			},

			'__down': function () {
				var selected_item_el_id = $($(self.dir_tree).find('.ygtvfocus')[1]).parent().find('td:last').attr('id');
				var selected_item = self.treeview.getNodesByProperty('contentElId', selected_item_el_id)[0];

				var next_item = selected_item.nextSibling;

				if (selected_item.expanded && selected_item.children.length > 0) {
					next_item = selected_item.children[0];
				}

				if (!next_item) {
					var parent = selected_item.parent;
					if (parent && parent.parent) {
						next_item = selected_item.parent.nextSibling;
					}
				}

				if (next_item) {
					if (next_item.data.cls == "dir") {
						$(self.dir_tree + " td").removeClass("ygtvfocus");

						$("#" + next_item.contentElId.replace("contentel", "t")).addClass("ygtvfocus");
						$("#" + next_item.contentElId).addClass("ygtvfocus");

						self.current_path = (nodedata.node.data.parent_label + '/' + nodedata.node.data.filename).replace("//", "/");
						if(self.current_path[0]==='/'){
							self.current_path=self.current_path.substring(1).replace('//','/');
						}
						self.current_path+='/';

						$(self.location_path).val(self.current_path);

						if (!self.is_dir_only) {
							self.add_file_items();
						}

						var dir_height = $(self.dir_tree).prop('clientHeight');
						var dir_top = $(self.dir_tree).offset().top;
						var current_location = $("#" + next_item.contentElId).offset().top;
						var scroll_top = $(self.dir_tree).scrollTop();

						if (!(dir_top < current_location && current_location < dir_top + dir_height))
							$(self.dir_tree).scrollTop(current_location + scroll_top - dir_top);
						$(self.dir_tree).focus();
					}
				}
			},

			'__left': function () {
				var selected_item_el_id = $($(self.dir_tree).find('.ygtvfocus')[1]).parent().find('td:last').attr('id');
				var selected_item = self.treeview.getNodesByProperty('contentElId', selected_item_el_id)[0];

				selected_item.collapse();
			},

			'__right': function () {
				var selected_item_el_id = $($(self.dir_tree).find('.ygtvfocus')[1]).parent().find('td:last').attr('id');
				var selected_item = self.treeview.getNodesByProperty('contentElId', selected_item_el_id)[0];

				selected_item.expand();
			},

			'__enter': function () {
				var selected_item_el_id = $($(self.dir_tree).find('.ygtvfocus')[1]).parent().find('td:last').attr('id');
				var selected_item = self.treeview.getNodesByProperty('contentElId', selected_item_el_id)[0];

				if (selected_item.expanded) {
					selected_item.collapse();
				} else {
					selected_item.expand();
				}
			},

			'__backspace': function () {
				var selected_item_el_id = $($(self.dir_tree).find('.ygtvfocus')[1]).parent().find('td:last').attr('id');
				var selected_item = self.treeview.getNodesByProperty('contentElId', selected_item_el_id)[0];

				var parent = selected_item.parent;

				if (parent && parent.parent) { // ROOT parent has no parent
					if (parent.data.cls == "dir") {
						$(self.dir_tree + " td").removeClass("ygtvfocus");

						$("#" + parent.contentElId.replace("contentel", "t")).addClass("ygtvfocus");
						$("#" + parent.contentElId).addClass("ygtvfocus");




						self.current_path = (next_item.data.parent_label + '/' + next_item.data.filename).replace("//", "/");
						if(self.current_path[0]==='/'){
							self.current_path=self.current_path.substring(1).replace('//','/');
						}
						self.current_path+='/';

						$(self.location_path).val(self.current_path);

						if (!self.is_dir_only) {
							self.add_file_items();
						}

						return false;
					}
				}
			}
		};

		var handler = {};
		var container_id = container.attr('id');
		if (/_dir_tree/.test(container_id)) {
			handler = treeview_container;
		} else if (/_files/.test(container_id)) {
			handler = files_container;
		}

		switch (key) {
		case 'up':
			handler.__up();
			break;
		case 'down':
			handler.__down();
			break;
		case 'left':
			handler.__left();
			break;
		case 'right':
			handler.__right();
			break;
		case 'enter':
			handler.__enter();
			break;
		case 'backspace':
			handler.__backspace();
			break;
		default:
			break;
		}

	}
};
