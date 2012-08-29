/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.theme.manager = function () {
	this.treeview = null;
	this.parent = null;
	this.table_variable_arrays = [];
};

org.goorm.core.theme.manager.prototype = {
	init: function (parent) {
		this.parent = parent;
		this.table_variable_arrays = [];
	},
	
	// add treeview node revursively
	add_treeview: function (parent, json){
		var self = this;
		var label = json.label;
		var tmpnode = new YAHOO.widget.TextNode(label, parent, json.expanded);
		if ($.isArray(json.child)) {
			$.each(json.child, function(index, object){
				self.add_treeview(tmpnode, object);
			});
		}
	},

	// create treeview structure
	create_treeview: function (json) {
		var self = this;
		var treeview = new YAHOO.widget.TreeView("theme_details_treeview");
		
		var general = new YAHOO.widget.TextNode(json.general.label, treeview.getRoot(), json.general.expanded);
/* 		var dialog = new YAHOO.widget.TextNode(json.dialog.label, treeview.getRoot(), json.dialog.expanded); */

		// add subtrees
		$.each(json.general.child, function(index, object){
			self.add_treeview(general, object);
		});

		// add subtrees
/*
		$.each(json.dialog.child, function(index, object){
			self.add_treeview(dialog, object);
		});
*/

		treeview.render();
		this.treeview = treeview;
	},
	
	// add tabview node reculsively
	add_tabview: function(json){
		var self = this;
		var label = json.label;
		label = label.replace(/[/#. ]/g,"");

		$("#theme_details_tabview").append("<div id='" + label + "' style='display:none'></div>");
		var tabview = new YAHOO.widget.TabView(label);

		if ($.isArray(json.tab)) {
			// 각각의 탭을 추가한다.
			$.each(json.tab, function(index, object){
				if(!$.isEmptyObject(object.html)){
					var url = object.html;
					var label = object.label;
					var element = object.element;
					var style = object.style;


					$.ajax({
						type: "GET",
						dataType: "html",
						async: false,
						url: url,
						success: function(data) {
							var tab = new YAHOO.widget.Tab({ 
								label: label, 
								content: data
							});
							tabview.addTab(tab);
/* 							self.create_datatable(object); */
						}
					});
				}
			});
			tabview.set('activeIndex', 0);
		}
	},
	
	// create treeview structure
	create_tabview: function (json) {
		var self = this;
		var tabview = null;

		$.each(json.general.child, function(index, object) {
			self.add_tabview(object);
		});
/*
		$.each(json.dialog.child, function(index, object) {
			self.add_tabview(object);
		});
*/
	},
	subscribe_datatable: function() {
		var self = this;
		for(var i = 0; i < self.table_variable_arrays.length; i++){
		}
	},
	
	create_datatable: function(json) {
		var self = this;
		console.log(json);
		
		var table_variable_column_definition = [
			{key:"property", label:"Property", width:100},
			{key:"value", label:"Value", width:351, editor: new YAHOO.widget.TextboxCellEditor({disableBtns:true})},
			{key:"description", label:"Description", width:180}
		];
		var table_variable_data_properties = new YAHOO.util.DataSource();
		table_variable_data_properties.responseSchema = {
			fields: ["property","value","description"]
		};
		var highlightEditableCell = function(oArgs) {
			var elCell = oArgs.target;
			if(YAHOO.util.Dom.hasClass(elCell, "yui-dt-editable")) {
				this.highlightCell(elCell);
			}
		};

		self.table_variable_arrays.push(new YAHOO.widget.ScrollingDataTable(json.element, table_variable_column_definition, table_variable_data_properties, {width:"694px", height:"310px"}));

		style_cnt = 0;
		for(var i = 0; i < json.style.length; i++){
			var delimiter = json.element+"-"+json.style[i];
			var delimiter_arrays = delimiter.split("_");

			for(var property in self.parent.current_theme_data[delimiter_arrays[0]].style){
				if($.isArray(self.parent.current_theme_data[delimiter_arrays[0]].style[property])){
					for(var style_cnt=0; style_cnt<self.parent.current_theme_data[delimiter_arrays[0]].style[property].length; style_cnt++){
						self.table_variable_arrays[self.table_variable_arrays.length-1].addRow({property:property, value:self.parent.current_theme_data[delimiter_arrays[0]].style[property][style_cnt], description:json.description}, style_cnt++);
					}
				}
				else{
					self.table_variable_arrays[self.table_variable_arrays.length-1].addRow({property:property, value:self.parent.current_theme_data[delimiter_arrays[0]].style[property], description:json.description}, style_cnt++);
				}
			}
		}
		self.table_variable_arrays[self.table_variable_arrays.length-1].subscribe("cellMouseoverEvent", highlightEditableCell);
		self.table_variable_arrays[self.table_variable_arrays.length-1].subscribe("cellMouseoutEvent", self.table_variable_arrays[self.table_variable_arrays.length-1].onEventUnhighlightCell);
		self.table_variable_arrays[self.table_variable_arrays.length-1].subscribe("cellClickEvent", self.table_variable_arrays[self.table_variable_arrays.length-1].onEventShowCellEditor);
	},
	delete_datatable: function() {
		var self = this;
		console.log("123");
/* 		self.table_variable_arrays[i].destroy(); */
	}
};


