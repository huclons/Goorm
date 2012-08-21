/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.theme.manager = function () {
	this.treeview = null;
};

org.goorm.core.theme.manager.prototype = {
	init: function (option) {

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
		
		var core = new YAHOO.widget.TextNode(json.core.label, treeview.getRoot(), json.core.expanded);

		// add subtrees
		$.each(json.core.child, function(index, object){
			self.add_treeview(core, object);
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
		$.each(json.core.child, function(index, object) {
			self.add_tabview(object);
		});
	}
};


