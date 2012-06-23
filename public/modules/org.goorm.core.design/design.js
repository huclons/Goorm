/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module design
 **/

/**
 * This is an goorm code generator.  
 * <br>goorm starts with this code generator.
 * @class design
 **/
org.goorm.core.design = function () {
	/**
	 * This presents the current browser version
	 * @property title
	 **/
	this.title = null;
	
	/**
	 * This presents the current browser version
	 * @property container
	 **/
	this.container = null;
	
	/**
	 * This presents the current browser version
	 * @property filepath
	 **/
	this.filepath = null;
	
	/**
	 * This presents the current browser version
	 * @property filename
	 **/
	this.filename = null;
	
	/**
	 * This presents the current browser version
	 * @property filetype
	 **/
	this.filetype = null;
	
	/**
	 * This presents the current browser version
	 * @property ruler
	 **/
	this.ruler = null;
	
	/**
	 * This presents the current browser version
	 * @property canvas
	 **/
	this.canvas = null;
	
	/**
	 * This presents the current browser version
	 * @property target
	 **/
	this.target = null;
	

};

org.goorm.core.design.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * <br>This operates the initialization tasks for layout, actions, plugins...
	 * @constructor
	 * @param {String} target The target.
	 * @param {STring} title The title. 
	 **/
	init: function (target, title) {
		var self = this;
		
		this.container = target;
		this.title = title;
		this.target = target;
		
		this.marginTop = 200;
				
		$(target).append("<div class='canvasContainer'></div>");
		
		
		$(target).find(".canvasContainer").css("left", 14);
		$(target).find(".canvasContainer").css("top", 14);
		
		//Ruler Initialization		
		this.ruler = new org.goorm.core.design.ruler();
		this.ruler.init($(target), "10", "px", this.title);
		
				
		//Canvas Initialization		
		this.canvas = new org.goorm.core.design.canvas();
		this.canvas.init($(target).find(".canvasContainer"), 800, 1000, this.title, this);



		//Blocking Context Menus for Empty Space		
		var emptyContextMenu = new org.goorm.core.menu.context();
		emptyContextMenu.init("", "none", $(target).find(".canvasContainer"), "");
		
		
		
		
		
		
		
		
		
				
		//for Test
		//this.setCollaborationOn();		
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * <br>This operates the initialization tasks for layout, actions, plugins...
	 * @method load 
	 * @param {String} filepath The filepath of target contents.
	 * @param {String} filename The name of target file.
	 * @param {String} filetype The type of target file. 
	 **/
	load: function (filepath, filename, filetype) {
		var self = this;
		
		var url = "file/get_contents";
		var path = filepath + "/" + filename;
		
		this.filepath = filepath;
		this.filename = filename;
		this.filetype = filetype;
		
		var i = 0;
		this.interval = window.setInterval(function () { if(i<100) { statusbar.progressbar.set('value', i+=10); } else { window.clearInterval(self.interval); } }, 100);
		
		statusbar.startLoading();
		
		$.ajax({
			url: url,			
			type: "GET",
			data: "path="+path,
			success: function(data) {
				//self.editor.setValue(data);
				//self.canvas.objects = $.makeArray();
				//self.canvas.objects = eval(data);
				var objects;
				
				if (data) {

					filedata = eval("(" + data + ")");
					self.canvas.load(filedata.objects);
					
/* why?
					console.log(filedata);
					self.canvas.setSize(parseInt(filedata.canvas_width), parseInt(filedata.canvas_height));
					console.log("1");
					self.resizeAll();
					
					self.canvas.preview.realWidth = filedata.canvas_width;
					self.canvas.preview.realHeight = filedata.canvas_height;
					self.canvas.preview.setSize();
*/
				}
				
				self.canvas.collaboration.init(self.canvas);
				
				if(core.isCollaborationDrawON == true){
					self.canvas.collaboration.startListening();
				}

				statusbar.progressbar.set('value', 100);
				
				if(self.interval) {
					window.clearInterval(self.interval);
				}
				
				statusbar.stopLoading();
			}
		});
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * <br>This operates the initialization tasks for layout, actions, plugins...
	 * @method save 
	 **/
	save: function () {
		var self = this;
		
		var url = "put_file_contents";
		var path = this.filepath + "/" + this.filename;
		
		var objectdata = this.getSource(this.canvas.objects);
		
		var filedata = "{"
			+ '"filename":' + '"' + this.filename + '",'
			+ '"file_type":' + '"' + this.filetype + '",'
			+ '"project_type":' + '"' + core.currentProjectType + '",'
			+ '"canvas_width":'  + '"' + this.canvas.width + '",'
			+ '"canvas_height":' + '"' + this.canvas.height + '",'
			+ '"last_modified_timestamp":' + '"' + new Date().getTime() + '",'
			+ '"objects":' +  objectdata
		+ "}";
		
		$.ajax({
			url: url,			
			type: "GET",
			data: { path: path, data: filedata },
			success: function(data) {
				//self.canvas.objects = $.makeArray();
				//self.canvas.objects = eval(data);
				//self.canvas.draw();

				if (self.canvas.collaboration.socket != null) {
					self.canvas.collaboration.socket.send('{"channel": "design","action":"autoSaved", "identifier":"'+self.canvas.collaboration.identifier+'", "message":""}');
				}
				
				m.s("Save complete! (" + self.filename + ")", "org.goorm.core.design");
			}
		});
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * <br>This operates the initialization tasks for layout, actions, plugins...
	 * @method saveAs 
	 * @param {String} filepath The filepath of target contents.
	 * @param {String} filename The name of target file.
	 * @param {String} filetype The type of target file. 
	 **/
	saveAs: function (filepath, filename, filetype) {
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * <br>This operates the initialization tasks for layout, actions, plugins...
	 * @method resizeAll
	 **/
	resizeAll: function () {		
		if(this.canvas.toolbar.isRulerOn) {
			$(this.container).find(".canvasContainer").width($(this.container).parent().width() - 14);
			$(this.container).find(".canvasContainer").height($(this.container).parent().height() - 14 - 36);
		}
		else {
			$(this.container).find(".canvasContainer").width($(this.container).parent().width());
			$(this.container).find(".canvasContainer").height($(this.container).parent().height() - 36);
		}

		$(this.container).find(".ruler_x").width($(this.container).find(".canvasContainer").width());
		$(this.container).find(".ruler_y").height($(this.container).find(".canvasContainer").height()-1);
		
		
		
		
		if(this.canvas.height + 95 > $(this.container).find(".canvasContainer").height()) {
			$(this.container).find(".canvasContainer").find(".canvas").css("top", 50);	
			$(this.container).find(".canvasContainer").find(".canvas").css("margin-top", 0);
			
			$(this.container).find(".ruler_y").css("background-position", "0px 50px");			
		}
		else {
			$(this.container).find(".canvasContainer").find(".canvas").css("top", "50%");
			$(this.container).find(".canvasContainer").find(".canvas").css("margin-top", 0 - (this.canvas.height/2) + 10);
			
			$(this.container).find(".ruler_y").css("background-position", "0px " +  2 + ($(this.container).height() - this.canvas.height)/2 + "px");
		}		
		
		if(this.canvas.width + 95 > $(this.container).find(".canvasContainer").width()) {
			$(this.container).find(".canvasContainer").find(".canvas").css("left", 50);	
			$(this.container).find(".canvasContainer").find(".canvas").css("margin-left", 0);
			
			$(this.container).find(".ruler_x").css("background-position", "50px 0px");
		}
		else {
			$(this.container).find(".canvasContainer").find(".canvas").css("left", "50%");		
			$(this.container).find(".canvasContainer").find(".canvas").css("margin-left", 0 - (this.canvas.width/2) + 10);	
			
			$(this.container).find(".ruler_x").css("background-position", ($(this.container).width() - this.canvas.width)/2 + 2 + "px 0px");
		}

		
		if (this.canvas.skinWidth != null) {
			
			if(this.canvas.skinHeight + 95 > $(this.container).find(".canvasContainer").height()) {
				$(this.container).find(".canvasContainer").find(".skin").css("top", 50);	
				$(this.container).find(".canvasContainer").find(".skin").css("margin-top", 0);
			}
			else {
				$(this.container).find(".canvasContainer").find(".skin").css("top", "50%");		
				$(this.container).find(".canvasContainer").find(".skin").css("margin-top", 0 - (this.canvas.skinHeight/2) + 10);	
			}		
			
			if(this.canvas.skinWidth + 95 > $(this.container).find(".canvasContainer").width()) {
				$(this.container).find(".canvasContainer").find(".skin").css("left", 50);	
				$(this.container).find(".canvasContainer").find(".skin").css("margin-left", 0);
				$(this.container).find(".canvasContainer").find(".canvas").css("left", ($(this.container).find(".canvasContainer").find(".space").width()-this.canvas.width)/2+1);
				$(this.container).find(".canvasContainer").find(".canvas").css("margin-left", 0);	
			}
			else {
				$(this.container).find(".canvasContainer").find(".skin").css("left", "50%");		
				$(this.container).find(".canvasContainer").find(".skin").css("margin-left", 0 - (this.canvas.skinWidth/2) + 10);	
				$(this.container).find(".canvasContainer").find(".canvas").css("left", "50%");
				$(this.container).find(".canvasContainer").find(".canvas").css("margin-left", 0 - (this.canvas.width/2) + 7);	
			}
			
			$(this.container).find(".canvasContainer").find(".canvas").css("margin-top", this.marginTop);	
		}
		
		this.canvas.preview.setSize();
	},
	
	
	/**
	 * This function is an goorm core initializating function.  
	 * <br>This operates the initialization tasks for layout, actions, plugins...
	 * @method getSource 
	 **/
	getSource: function (objects) {
		
		var objectsString = "[";
		
		var objectsLength = objects.length;
		
		$(objects).each(function (i) {
			objectsString += "{";
			
			var j = 0;
			
			objectsString += '"type": "' + this.type + '", ';
			objectsString += '"shapeName": "' + this.shapeName + '", ';
			objectsString += '"data_uuid": "' + this.data_uuid + '", ';
			
			objectsString += "\"properties\": {";

				objectsString += '"kind": "' + this.properties.kind + '",';					
				objectsString += '"focus": "' + this.properties.focus + '", ';
				objectsString += '"isDrag": "' + this.properties.isDrag + '", ';
				objectsString += '"isDrawFinished": "' + this.properties.isDrawFinished + '", ';
				objectsString += '"sx": ' + this.properties.sx + ', ';
				objectsString += '"sy": ' + this.properties.sy + ', ';
				objectsString += '"ex": ' + this.properties.ex + ', ';
				objectsString += '"ey": ' + this.properties.ey + ', ';
				objectsString += '"prevX": ' + this.properties.prevX + ', ';
				objectsString += '"prevY": ' + this.properties.prevY + ', ';
				objectsString += '"id": "' + this.properties.id + '", ';
				objectsString += '"name": "' + this.properties.name + '", ';
				objectsString += '"x": ' + this.properties.x + ', ';
				objectsString += '"y": ' + this.properties.y + ', ';
				objectsString += '"width": ' + this.properties.width + ', ';
				objectsString += '"height": ' + this.properties.height + ', ';
				
				if (this.type == "line") {
					objectsString += '"thickness": "' + this.properties.thickness + '",';
					objectsString += '"color": "' + this.properties.color + '",';
					objectsString += '"innerNode": [';
					
					var length = this.properties.innerNode;
					$(this.properties.innerNode).each(function (i) {
						objectsString += '{"x": ' + this.x + ', "y": ' + this.y + '}';
						
						if (i != length - 1) {
							objectsString += ",";
						}	
					});
					objectsString += '],';
				}
				
				objectsString += '"connector": "' + this.properties.connector + '"';
				//objectsString += 'attrList: [' + this.properties.attrList + ']';
			
			objectsString += "}";
			
			if (this.type == "square") {
				//Stencil 占쏙옙占�占썬�占썲�占쏙옙占쏙옙�⑨옙
				objectsString += ", \"shape\": {";
				objectsString += "\"properties\": {";									
				
				var j = 0;
				var length = 0;
				
				$.each(this.shape.properties, function (key, value) {
					length++;
				});
				
				
				$.each(this.shape.properties, function (key, value) {
					try {
						objectsString += '"' + key + '": "' + value + '"';
						
						if (j != length - 1) {
							 objectsString += ',';
						}
						
						j++;
					}
					catch (e) {
						console.log(e);
					}	
				});
				
				
				objectsString += "}";
				objectsString += "}";
			}			

			objectsString += "}";
			
			if (i != objectsLength - 1) {
				objectsString += ", ";
			}
		});
		
		objectsString += "]";
		
		/*
		objectsString = objectsString.split(" ,").join("");
		objectsString = objectsString.split(", }").join("}");
		*/
		
		return objectsString;		
	}
};