/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * @module preference
 **/

/**
 * This is file type manager in preference dialog  
 * @class preference.filetype
 * @extends preference
 **/
org.goorm.core.preference.filetype = function () {
	/**
	 * This is "add" button on file type manager in preference dialog
	 * @property addButton
	 * @type Obejct
	 * @default null
	 **/
	this.addButton = null;
	/**
	 * This is "del" button on file type manager in preference dialog
	 * @property delButton
	 * @type Obejct
	 * @default null
	 **/
	this.delButton = null;
	/**
	 * This is "save" button on file type manager in preference dialog
	 * @property saveButton
	 * @type Obejct
	 * @default null
	 **/
	this.saveButton = null;
	/**
	 * This is a reference for this class.
	 * @property self
	 * @type Obejct
	 * @default null
	 **/
	this.self = null;
};

org.goorm.core.preference.filetype.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 **/
	init: function () {
		self = this;
		
		// Initializing
		self.initFileTypeTab();
		
		// Buttons on dialog
		this.addButton =  new YAHOO.widget.Button("filetypeAdd", { onclick: { fn: this.add } });
		this.delButton =  new YAHOO.widget.Button("filetypeDelete", { onclick: { fn: this.del } });
		this.saveButton =  new YAHOO.widget.Button("filetypeSave", { onclick: { fn: this.save } });
		
	},
	
	/**
	 * This function is adding new file type into file type tab.  
	 * @method add
	 **/
	add: function () {
		
		// Temporary type element is added to file type list.
		$(".fileTypeContents").find(".fileTypeList").append("<div style='padding:3px;' class='newExt'>New Extention</div>");
		$(".fileTypeContents").find(".fileTypeList").scrollTop(9999999);
		
		// Event handler for creating filetype detail view is registered
		$(".fileTypeContents").find(".fileTypeList").find(".newExt").click(function () {
			
			// highlighting in filetype list
			$(".fileTypeContents").find(".fileTypeList").children().each(function () {
				$(this).css('background-color', '#fff');
			});
			$(this).css('background-color', '#b3d4ff');
			
			// removing old filetype detail view
			$(".fileTypeContents").find(".fileTypeDetail").children().each(function() { 
				$(this).remove(); 
			});
			
			// creating new filetype detail view
			self.createFileTypeDetail("", null, "", null, null);
		});
	},
	/**
	 * This function is deleting file type from file type tab.  
	 * @method del
	 **/
	del: function () {
		
		// This part find file type is viewing in filetype detail view from filetype list and remove it.
		$(".fileTypeContents").find(".fileTypeList").children().each(function() {
			if ($(this).attr("class") == $(".fileTypeContents").find(".fileExtention").val()){
				var temp = $.makeArray();
				for (var i = 0; i < core.fileTypes.length; i++) {
					if (core.fileTypes[i].fileExtention != $(this).attr("class")) {
						
						// Keep filetype element except one user want to delete.
						temp.push(core.fileTypes[i]);
					}
				}
				
				// Update filetype information.
				core.fileTypes = temp;
				
				// Remove this filetype from filetype list.
				$(this).remove();
			}
		});
		
		// Remove this filetype detail from filetype detail view.
		$(".fileTypeContents").find(".fileTypeDetail").children().each(function() {
			$(this).remove();
		});
	},
	/**
	 * This function is saving a file type.  
	 * @method save
	 **/
	save: function () {
		
		var finded = false;
		
		
		if ($(".fileTypeContents").find(".fileTypeDetail").find(".fileExtention").length != 0){
			
			// If the file type of current information is already exist, update the information
			for (var i = 0; i < core.fileTypes.length; i++) {
				if (core.fileTypes[i].fileExtention == $(".fileTypeContents").find(".fileTypeDetail").find(".fileExtention").val()) {
					finded = true;
					core.fileTypes[i].editor = $(".fileTypeContents").find(".fileTypeDetail").find(".editor").attr("value");
					core.fileTypes[i].type = $(".fileTypeContents").find(".fileTypeDetail").find(".type").attr("value");
					core.fileTypes[i].mode = $(".fileTypeContents").find(".fileTypeDetail").find(".mode").attr("value");
					core.fileTypes[i].description = $(".fileTypeContents").find(".fileTypeDetail").find(".description").val();
				}
			}
			// If the file type is new, add the information of the new file type
			if (finded == false && $(".fileTypeContents").find(".fileTypeDetail").find(".fileExtention").val() != "") {
				var temp = {
					"fileExtention":$(".fileTypeContents").find(".fileTypeDetail").find(".fileExtention").val(),
					"editor":$(".fileTypeContents").find(".fileTypeDetail").find(".editor").attr("value"),
					"description":$(".fileTypeContents").find(".fileTypeDetail").find(".description").val(),
					"type":$(".fileTypeContents").find(".fileTypeDetail").find(".type").attr("value"),
					"mode":$(".fileTypeContents").find(".fileTypeDetail").find(".mode").attr("value")
				}
				core.fileTypes.push(temp);
				
				// Temporary name in file type list have to be updated to right file type name
				var ext = $(".fileTypeContents").find(".fileTypeDetail").find(".fileExtention").val();
				$(".fileTypeContents").find(".fileTypeList").find(".newExt").html(ext);
				$(".fileTypeContents").find(".fileTypeList").find(".newExt").attr("class", ext);
				
				$(".fileTypeContents").find("."+ext).click(function () {
					
					self.save();
					// highlight refresh
					$(".fileTypeContents").find(".fileTypeList").children().each(function () {
						$(this).css('background-color', '#fff');
					});
					$(this).css('background-color', '#b3d4ff');
					
					// clearing type information area 
					$(".fileTypeContents").find(".fileTypeDetail").children().each(function() { 
						$(this).remove(); 
					});	
					var en = $(this).attr("class");
					var e = self.getFileTypeInfo(en, "editor");
					var d = self.getFileTypeInfo(en, "description");
					var t = self.getFileTypeInfo(en, "type");
					var m = self.getFileTypeInfo(en, "mode");
					self.createFileTypeDetail(en, e, d, t, m);
								
				});
			}
		}		
	},
	/**
	 * This function is getting information of filetype from core.filetype.  
	 * @method getFileTypeInfo
	 * @param {String} ext The filetype name. 
	 * @param {String} attr The attribute name of filetype.
	 **/
	getFileTypeInfo: function (ext, attr) {
		
		for (var i = 0; i < core.fileTypes.length; i++) {
			if (core.fileTypes[i].fileExtention == ext) {
				if (attr == "editor")
					return core.fileTypes[i].editor;
				else if (attr == "description")
					return core.fileTypes[i].description;
				else if (attr == "type")
					return core.fileTypes[i].type;
				else if (attr == "mode")
					return core.fileTypes[i].mode;					
			}
		}
	},
	/**
	 * This function is initializing filetype manager in preference dialog.  
	 * @method initFileTypeTab 
	 **/
	initFileTypeTab: function () {
		
		// Get filetype information from the file, filetype.json.
		$.getJSON("configs/filetype/filetype.json", function(data) {
			
			// Loading the information to core.fileTypes.
			core.fileTypes = eval(data);
			
			var fileTypes = core.fileTypes;
		
			// For all filetypes, 
			for (var i = 0; i<core.fileTypes.length; i++) {
				
				var extName = fileTypes[i].fileExtention;
				var editor = fileTypes[i].editor;
				var description = fileTypes[i].description;
				var type = fileTypes[i].type;
				var mode = fileTypes[i].mode;
				
				// Add filetype label to filetype list,
				$(".fileTypeContents").find(".fileTypeList").append("<div style='padding:3px;' class="+extName+">"+extName+"</div>");
				
				// And register event handler.
				$(".fileTypeContents").find("."+extName).click(function () {
					
					self.save();
					// highlight refresh
					$(".fileTypeContents").find(".fileTypeList").children().each(function () {
						$(this).css('background-color', '#fff');
					});
					$(this).css('background-color', '#b3d4ff');
					
					// clearing type information area 
					$(".fileTypeContents").find(".fileTypeDetail").children().each(function() { 
						$(this).remove(); 
					});	
					var en = $(this).attr("class");
					var e = self.getFileTypeInfo(en, "editor");
					var d = self.getFileTypeInfo(en, "description");
					var t = self.getFileTypeInfo(en, "type");
					var m = self.getFileTypeInfo(en, "mode");
					self.createFileTypeDetail(en, e, d, t, m);
								
				});
			}
		});
	},
	
	/**
	 * This function is creating filetype detail view.  
	 * @method add
	 * @param {String} extName The filetype name. 
	 * @param {String} editor The editor of the filetype.
	 * @param {String} description The description of the filetype.
	 * @param {String} type The type of the filetype.
	 * @param {String} mode The syntax highlighting mode of the filetype.
	 **/
	createFileTypeDetail: function (extName, editor, description, type, mode) {
		
		// Creating name field.
		$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%;'>Extention Name</div>");
		$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%; margin-top:4px;'><input class='fileExtention' style='width:280px;' value='"+ extName +"' /></div>");
		
		// Creating Editor field.
		$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%; margin-top:7px;'>Editor</div>");
		$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%; margin-top:4px;'>"+
															"<select class='editor' style='width:280px;'>"+
															"<option value='Editor'>Editor</option>"+
															"<option value='Designer'>Designer</option>"+
															"<option value='Rule_Editor'>Rule_Editor</option></select></div>");
		// "selected" decision.
		$(".fileTypeContents").find(".fileTypeDetail").find("option").each(function() {
			if ($(this).attr("value") == editor)
				$(this).attr("selected", "selected");
		});
		
		// Creating Type fieldl
		$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%; margin-top:7px;'>Type</div>");
		$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%; margin-top:4px;'>"+
															"<select class='type' style='width:280px;'>"+
															"<option value='Code'>Code</option>"+
															"<option value='uml'>uml</option>"+
															"<option value='ui'>ui</option>"+
															"<option value='xml'>xml</option></select></div>");
		// "selected" decision.												
		$(".fileTypeContents").find(".fileTypeDetail").find("option").each(function() {
			if ($(this).attr("value") == type)
				$(this).attr("selected", "selected");
		});
		
		// Creating syntax highlighting mode field.
		$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%; margin-top:7px;'>Syntax Highlighting Mode</div>");
		$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%; margin-top:4px;'><select class='mode' style='width:280px;'>"+
															"<option value='text/javascript'>text/javascript</option>"+
															"<option value='application/json'>application/json</option>"+
															"<option value='application/xml'>application/xml</option>"+
															"<option value='text/html'>text/html</option>"+
															"<option value='text/css'>text/css</option>"+
															"<option value='text/x-python'>text/x-python</option>"+
															"<option value='application/x-httpd-php'>application/x-httpd-php</option>"+
															"<option value='text/x-php'>text/x-php</option>"+
															"<option value='text/x-diff'>text/x-diff</option>"+
															"<option value='text/x-csrc'>text/x-csrc</option>"+
															"<option value='text/x-c++src'>text/x-c++src</option>"+
															"<option value='text/x-java'>text/x-java</option>"+
															"<option value='text/x-groovy'>text/x-groovy</option>"+
															"<option value='text/stex'>text/stex</option>"+
															"<option value='text/x-haskell'>text/x-haskell</option>"+
															"<option value='text/x-ruby'>text/x-ruby</option>"+
															"<option value='text/x-coffeescript'>text/x-coffeescript</option>"+
															"<option value='text/x-stsrc'>text/x-stsrc</option>"+
															"<option value='text/x-plsql'>text/x-plsql</option>"+
															"<option value='text/x-lua'>text/x-lua</option>"+
															"<option value='text/x-scheme'>text/x-scheme</option>"+
															"<option value='text/x-clojure'>text/x-clojure</option>"+
															"<option value='text/x-rst'>text/x-rst</option>"+
															"<option value='text/x-yaml'>text/x-yaml</option>"+
															"<option value='application/x-sparql-query'>application/x-sparql-query</option>"+
															"<option value='application/x-sparql-query'>application/x-sparql-query</option>"+
															"<option value='text/velocity'>text/velocity</option>"+
															"<option value='text/x-rsrc'>text/x-rsrc</option></select></div>");
		// "selected" decision.
		$(".fileTypeContents").find(".fileTypeDetail").find("option").each(function() {
			if ($(this).attr("value") == mode)
				$(this).attr("selected", "selected");
		});
		
		// Creating description field.
		$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%; margin-top:7px;'>Description</div>");
		$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%; margin-top:4px;'><textarea class='description' style='resize: none; width:280px; height:90px; overflow:auto;'>" + description + "</textarea></div>");
	}
};