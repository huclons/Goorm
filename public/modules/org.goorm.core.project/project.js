/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module project
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class project
 **/
org.goorm.core.project = function () {
	/**
	 * This presents the current browser version
	 * @property treeview
	 * @type Object
	 * @default null
	 **/
	this.treeview = null;
	
};

org.goorm.core.project.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor
	 * @param {Object} target The target object.
	 **/
	makeTreeview: function(target) {
		
		this.treeview = new YAHOO.widget.TreeView(target, this.getDirectoriesAndFiles("type", "url"));
	
				//projectProperties.files = sortingData;
				
				/*
				self.treeview.subscribe("dblClickEvent", function(nodedata) {	
					if(nodedata.node.data.cls == "file") {
						var filename = nodedata.node.data.filename;
						var filetype = nodedata.node.data.filetype;
						var fullpath = nodedata.node.data.parentLabel;
						
						windowManager.add(filename, filetype, fullpath);
						//windowManager.show();
						//messageManager.write("alarm", directory, "adsf");
					}
				});
				*/
					
		this.treeview.render();
		this.treeview.expandAll();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * This operates the initialization tasks for layout, actions, plugins...
	 * First written: Sung-tae Ryu 
	 * Latest modified: Sung-tae Ryu 
	 * @method refreshTreeview() 
	 * @return void
	 **/
	refreshTreeview: function() {
		this.treeview.refresh();
		
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method getDirectoriesAndFiles 
	 * @param {String} type The type.
	 * @param {String} url The URL.
	 * @return {Object} The result.
	 **/
	getDirectoriesAndFiles: function(type, url) {
		
		var postdata = {
			type: type,
			url: url,
			kind: "directoriesAndFiles"
		};
		
		var result = null;
		
		$.get("file/get_contents", postdata, function (data) {
			
				var sortJsonData = function (x,y) {
					return ((x.cls > y.cls) ? -1 : ((x.cls < y.cls) ? 1 : 0 ));
				};
				
				var quickSort = function (data) { 				
					data.sort(sortJsonData);
					
					for(i=0; i<data.length; i++) {
						if(data[i].children) {
							quickSort(data[i].children);
						}
					}
				};
				
				result = eval(data);
				quickSort(result);
		});
		
		return result;		
	}
};