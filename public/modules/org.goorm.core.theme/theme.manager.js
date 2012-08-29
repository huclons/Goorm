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
		var dialog = new YAHOO.widget.TextNode(json.dialog.label, treeview.getRoot(), json.dialog.expanded);

		// add subtrees
		$.each(json.general.child, function(index, object){
			self.add_treeview(general, object);
		});

		// add subtrees
		$.each(json.dialog.child, function(index, object){
			self.add_treeview(dialog, object);
		});

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
					var classname = object.classname;

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
		$.each(json.dialog.child, function(index, object) {
			self.add_tabview(object);
		});
	},
	test: function() { 
		
	 },
	create_datatable: function() {
		var self = this;
		self.table_variable_arrays = [];
		var table_variable_column_definition = [
			{key:"element", label:"Element", width:140}, 
			{key:"anchor", label:"Anchor", width:40}, 
			{key:"property", label:"Property", width:100},
			{key:"value", label:"Value", width:351, editor: new YAHOO.widget.TextboxCellEditor({disableBtns:true})}
		];
		var table_variable_data_properties = new YAHOO.util.DataSource();
		table_variable_data_properties.responseSchema = {
			fields: ["element","anchor","property","value"]
		};
		var highlightEditableCell = function(oArgs) {
			var elCell = oArgs.target;
			if(YAHOO.util.Dom.hasClass(elCell, "yui-dt-editable")) {
				this.highlightCell(elCell);
			}
		};

		for(var position in self.parent.current_theme_data){
			for(var element_name in self.parent.current_theme_data[position]){
				self.table_variable_arrays.push(new YAHOO.widget.DataTable(position+"-"+element_name, table_variable_column_definition, table_variable_data_properties));
			}
		}

		for(var i=0; i<self.table_variable_arrays.length;i++){
			self.table_variable_arrays[i].subscribe("cellMouseoverEvent", highlightEditableCell);
			self.table_variable_arrays[i].subscribe("cellMouseoutEvent", self.table_variable_arrays[i].onEventUnhighlightCell);
			self.table_variable_arrays[i].subscribe("cellClickEvent", self.table_variable_arrays[i].onEventShowCellEditor);
		}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var element_cnt = 0;

for (var position in self.parent.current_theme_data){
	for(var element_name in self.parent.current_theme_data[position]){
		var style_cnt = 0;
		if($.isArray(self.parent.current_theme_data[position][element_name])){
			for(var object in self.parent.current_theme_data[position][element_name]){
				for(var anchor in self.parent.current_theme_data[position][element_name][object]){
					for(var property in self.parent.current_theme_data[position][element_name][object][anchor].style){
						// selector : self.parent.current_theme_data[position][element_name][anchor][object].selector;
						// style : self.parent.current_theme_data[position][element_name][anchor][object].style;
						// value : self.parent.current_theme_data[position][element_name][anchor][object].style[property];
						if($.isArray(self.parent.current_theme_data[position][element_name][object][anchor].style[property])){
							for(var style_array=0; style_array< self.parent.current_theme_data[position][element_name][object][anchor].style[property].length; style_array++){
								self.table_variable_arrays[element_cnt].addRow({element:position+" "+element_name, anchor:anchor, property:property, value:self.parent.current_theme_data[position][element_name][object][anchor].style[property][style_array]}, style_cnt++);
							}
						}
						else{
							self.table_variable_arrays[element_cnt].addRow({element:position+" "+element_name, anchor:anchor, property:property, value:self.parent.current_theme_data[position][element_name][object][anchor].style[property]}, style_cnt++);
						}
					}
				}
			}
		}

		else{
			for(var property in self.parent.current_theme_data[position][element_name].style){
				if($.isArray(self.parent.current_theme_data[position][element_name].style[property])){
					for(var style_array=0; style_array<self.parent.current_theme_data[position][element_name].style[property].length; style_array++){
						self.table_variable_arrays[element_cnt].addRow({element:position+" "+element_name, property:property, value:self.parent.current_theme_data[position][element_name].style[property][style_array]}, style_cnt++);
					}
				}
				else{
					self.table_variable_arrays[element_cnt].addRow({element:position+" "+element_name, property:property, value:self.parent.current_theme_data[position][element_name].style[property]}, style_cnt++);
				}
			}
		}
		element_cnt++;
	}
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	}
};


