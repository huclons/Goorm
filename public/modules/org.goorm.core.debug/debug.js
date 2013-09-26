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



org.goorm.core.debug = function () {
	this.target = "";
	this.layout = null;
	this.table_thread = null;
	this.table_variable = null;
};

org.goorm.core.debug.prototype = {

	init: function () {
		var self = this;

		var textbox_cell_editor = new YAHOO.widget.TextboxCellEditor({
			disableBtns: true
		});

		var highlight_editable_cell = function (object) {
			var cell = object.target;
			if (YAHOO.util.Dom.hasClass(cell, "yui-dt-editable")) {
				this.highlightCell(cell);
			}
		};

		$(core).on("layout_loaded", function () {
			var debug_layout = $("#debug_tab");

			var el = core.module.layout.inner_layout.getUnitByPosition('bottom').get('wrap');

			debug_layout.append("<div id='debug_left'></div>");
			debug_layout.append("<div id='debug_tab_center'></div>");

			var layout_bottom_height = $("div.yui-layout-unit-bottom div.yui-layout-wrap").height() - 26;
			var layout_bottom_width = $("div.yui-layout-unit-bottom div.yui-layout-wrap").width();

			debug_layout.height(layout_bottom_height);

			self.layout = new YAHOO.widget.Layout("debug_tab", {
				parent: core.module.layout.inner_layout,
				units: [{
					position: 'left',
					width: 250,
					height: layout_bottom_height,
					body: "debug_left",
					resize: true,
					gutter: '0px 0px 0px 0px',
					collapse: false,
					minWidth: 200,
					scroll: true
				}, {
					position: 'center',
					height: layout_bottom_height,
					body: "debug_tab_center",
					resize: true
				}]
			});

			self.layout.on('resize', function () {
				self.resize();
			});

			self.layout.on("render", function () {
				var debug_layout = $('#debug_tab');
				var debug_layout_left = $("#debug_left");
				var debug_layout_center = $("#debug_tab_center");

				$("#goorm_inner_layout_bottom").find(".yui-content").height(layout_bottom_height);

				debug_layout_left.css("height", layout_bottom_height);
				debug_layout_left.parent().css('overflow', 'auto');

				debug_layout_center.css("height", layout_bottom_height);
				debug_layout_center.css("background-color", "#ebebeb");
				debug_layout_center.parent().css('overflow', 'auto');

				debug_layout_left.css("background-color", "#ebebeb");
				layout_bottom_width = $("#goorm_inner_layout_bottom").width();

				debug_layout_center.parent().css("width", layout_bottom_width - 250);
				debug_layout_center.parent().parent().css("width", layout_bottom_width - 250);

				debug_layout.parent().css("overflow", "hidden");
				debug_layout.find(".yui-layout-doc").width("100%");

				self.table_thread = null;
				self.table_variable = null;

				var table_thread_column_definition = [{
					key: "no",
					label: "No",
					sortable: false
				}, {
					key: "thread",
					label: "Thread",
					sortable: false
				}];

				var table_thread_data_properties = new YAHOO.util.DataSource();
				table_thread_data_properties.responseSchema = {
					resultNode: "property",
					fields: ["no", "thread"]
				};

				self.table_thread = new YAHOO.widget.DataTable("debug_left", table_thread_column_definition, table_thread_data_properties);
				self.table_thread.set("MSG_EMPTY", "N/A");
				self.table_thread.render();

				var table_variable_column_definition = [{
					key: "variable",
					label: "Variable",
					sortable: false
				}, {
					key: "value",
					label: "Value",
					sortable: false,
					editor: textbox_cell_editor
				}, {
					key: "summary",
					label: "Summary",
					sortable: false
				}];

				var table_variable_data_properties = new YAHOO.util.DataSource();
				table_variable_data_properties.responseSchema = {
					resultNode: "property",
					fields: ["variable", "value", "summary"]
				};

				self.table_variable = new YAHOO.widget.DataTable("debug_tab_center", table_variable_column_definition, table_variable_data_properties);
				self.table_variable.set("MSG_EMPTY", "N/A");
				self.table_variable.render();

				self.table_variable.subscribe("cellClickEvent", function (e) {
					$(core.module.debug.table_variable).trigger('click_row', {
						'target': $(e.target),
						'index': self.table_variable.getRecordIndex(self.table_variable.getRecord(e.target))
					});
					self.table_variable.onEventShowCellEditor(e);
				});
				self.table_variable.subscribe("cellMouseoutEvent", self.table_variable.onEventUnhighlightCell);
				self.table_variable.subscribe("cellMouseoverEvent", highlight_editable_cell);
				self.table_variable.subscribe("editorSaveEvent", self.variable_edit_complete);

				self.table_variable.subscribe('rowAddEvent', function () {
					self.resize();
				});

				$('#debug_tab .t_fixed_header_main_wrapper').css('border', 0);
			});

			window.setTimeout(function () {
				self.layout.render();

				$('#debug_tab_center').parent().css('overflow', 'hidden');
				$('#debug_tab_center table').fixheadertable({
					'height': layout_bottom_height,
					'width': layout_bottom_width - 250 + 1
				});

				$('#debug_tab_center div.t_fixed_header_main_wrapper').parent().css('padding', '0px');
				$('#debug_tab_center .body').css('background-color', 'rgb(235, 235, 235)');
				$('#debug_tab_center .t_fixed_header').attr('style', 'border:none !important; font-weight:normal');
				$('#debug_tab .t_fixed_header_main_wrapper').css('border', 0);

			}, 300);

			$(core).on("layout_resized", function () {
				var layout_bottom_height = $(".yui-layout-unit-bottom").find(".yui-layout-wrap").height() - 26;
				$("#debug_left").css("height", layout_bottom_height);
				$("#debug_tab_center").css("height", layout_bottom_height);
				$("#" + self.target).height(layout_bottom_height);
				$("#debug_tab").css('height', layout_bottom_height);

				var table_height = layout_bottom_height - 22;
				if (table_height < 23) table_height = 23;
				$('#debug_tab_center .body').height(table_height);
			});
		});
	},

	resize: function () {
		window.setTimeout(function () {
			var debug_left_width = $('#debug_tab').width() - $('#debug_tab_center').width();
			$('#debug_left').width(debug_left_width - 1); // because of border px

			var variable_header_width = $('#debug_tab_center .head th:eq(0)').width();
			$('#debug_tab_center .yui-dt-data tr:eq(0) td:eq(0) .expand_row').width(variable_header_width - 32);

			var value_header_width = $('#debug_tab_center .head th:eq(1)').width();
			$('#debug_tab_center .yui-dt-data tr:eq(0) td:eq(1) div').width(value_header_width - 12);
		}, 100);
	},

	editor_show: function () {
		$(".yui-dt-editor input").width($(".yui-dt-editor input").width() - 13);
	},

	variable_edit_complete: function (object) {
		var variable = $($(object.editor.getTdEl()).parent().find(".yui-dt-col-variable").find(".yui-dt-liner").html()).text() || $(object.editor.getTdEl()).parent().find(".yui-dt-col-variable").find(".yui-dt-liner").html();
		var value = object.newData;

		$(core.module.debug).trigger("value_changed", {
			"variable": variable,
			"value": value
		});
		//TODO

		this.variable_refresh();
	},

	variable_refresh: function () {
		var self = this;
		var index = 0;
	}
};