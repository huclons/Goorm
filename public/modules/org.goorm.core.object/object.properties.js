/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module object
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class properties
 * @extends object
 **/
org.goorm.core.object.properties = function () {
	/**
	 * This presents the current browser version
	 * @property target
	 * @type Object
	 * @default null
	 **/
	this.target = null;
	
	/**
	 * This presents the current browser version
	 * @property manager
	 * @type Object
	 * @default null
	 **/
	this.manager = null;
	
	/**
	 * This presents the current browser version
	 * @property table
	 * @type Object
	 * @default null
	 **/
	this.table = null;
	
	/**
	 * This presents the current browser version
	 * @property object
	 * @type Object
	 * @default null
	 **/	
	this.object = null;
};

org.goorm.core.object.properties.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 * @param {Object} target The target object.
	 **/
	init: function (target) {
		var self = this;
		
		this.target = target;
		

		var textboxCellEditor = new YAHOO.widget.TextboxCellEditor({disableBtns:true});
				
		var tableColumnDefs = [
			{key:"attribute", label:"Attribute", sortable:false },
			{key:"value", label:"Value", sortable:false, editor: textboxCellEditor}
		];
		
		var dataProperties = new YAHOO.util.DataSource();
		dataProperties.responseSchema = { 
			resultNode: "property", 
			fields: ["id","value"] 
		};
		
		var highlightEditableCell = function(oArgs) { 
			var elCell = oArgs.target; 
			if(YAHOO.util.Dom.hasClass(elCell, "yui-dt-editable")) { 
				this.highlightCell(elCell); 
			} 
		};
		
		var editComplete = function (oArgs) {
			var attribute = $(oArgs.editor.getTdEl()).parent().find(".yui-dt-col-attribute").find(".yui-dt-liner").html();
			var value = oArgs.newData;
			
			if (eval("self.object.properties." + attribute)) {
				eval("self.object.properties." + attribute + "='" + value + "';");
			}
			
			if (self.object.shape != null) {
				//if (eval("typeof(self.object.shape.properties." + attribute + ")!=undefined")) {
					eval("self.object.shape.properties." + attribute + "='" + value + "';");
				//}	
				//eval("console.log(self.object.shape.properties." + attribute + ")");
				
				self.object.properties.status = "modified";
			}
			self.refresh();
		};
	

		this.table = new YAHOO.widget.DataTable(target, tableColumnDefs, dataProperties);
		
		this.table.set("MSG_EMPTY", "No object selected.");
		
		this.table.render();
		
		this.table.subscribe("cellClickEvent", this.table.onEventShowCellEditor);
		this.table.subscribe("cellMouseoutEvent", this.table.onEventUnhighlightCell);
		this.table.subscribe("cellMouseoverEvent", highlightEditableCell);
		this.table.subscribe("editorSaveEvent", editComplete);
		
		return this;
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method connectManager 
	 * @param {Object} manager The manager object.
	 **/
	connectManager: function (manager) {
		this.manager = manager;
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method set 
	 * @param {Object} object The object.
	 **/
	set: function (object) {
		this.object = object;
		
		this.refresh();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method unset 
	 **/
	unset: function () {
		this.object = null;
		
		this.refresh();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method refresh 
	 **/
	refresh: function () {
		var self = this;
		var index = 0;
		
		this.table.deleteRows(0, $("#"+this.target).find("table").find("tbody").find("tr").size());
		
		if (this.object) {
			$(this.object.properties.attrList).each(function (i) {
				var value = eval("self.object.properties." + this);
				self.table.addRow({attribute: this, value: value}, i);
				index = i;
			});
			
			if (this.object.shape != null && this.object.shape.properties != null) {
				
				$.each(this.object.shape.properties, function (key, state) {
					index++;
					//var value = eval("self.object.properties."+this);
					
					self.table.addRow({attribute: key, value: state}, index);
				});
			}
		}
		
		this.redraw();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method redraw 
	 **/
	redraw: function () {
		this.manager.canvas.draw();

		if (this.object) {
			if (this.object.shape != null) {
				this.object.shape.setShape();
			}
			
			if (this.object.type == "square") {
				//this.object.properties.apply();
			}
		}
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method apply 
	 **/
	apply: function () {
	}
};