/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module collaboration
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class design
 * @extends collaboration
 **/
org.goorm.core.collaboration.design = function () {
	/**
	 * This presents the current browser version
	 * @property target
	 * @type Object
	 * @default null
	 **/
	this.target = null;
	
	/**
	 * This presents the current browser version
	 * @property objects
	 * @type Object
	 * @default null
	 **/
	this.objects = null;
	
	/**
	 * This presents the current browser version
	 * @property userID
	 * @type Number
	 * @default 0
	 **/
	this.userID = 0;
	
	/**
	 * This presents the current browser version
	 * @property socket
	 * @type Object
	 * @default null
	 **/
	this.socket = null;
	
	/**
	 * This presents the current browser version
	 * @property predefinedColors
	 * @type Object
	 * @default null
	 **/
	this.predefinedColors = null;
	
	/**
	 * This presents the current browser version
	 * @property assignedColors
	 * @type Object
	 * @default null
	 **/
  	this.assignedColors = null;
  	
	/**
	 * This presents the current browser version
	 * @property updating_process_running
	 * @type Object
	 * @default null
	 **/
  	this.updating_process_running = false;
	
	/**
	 * This presents the current browser version
	 * @property updateQueue
	 * @type Object
	 * @default null
	 **/
  	this.updateQueue = [];
  	
	/**
	 * This presents the current browser version
	 * @property diffWorker
	 * @type Object
	 * @default null
	 **/
  	this.diffWorker = null;
	
	/**
	 * This presents the current browser version
	 * @property patchWorker
	 * @type Object
	 * @default null
	 **/
  	this.patchWorker = null;
  	
  	/**
	 * This presents the current browser version
	 * @property objectUUIDs
	 * @type Object
	 * @default null
	 **/
  	this.objectUUIDs = null;
  	
  	/**
	 * This presents the current browser version
	 * @property identifier
	 * @type Object
	 * @default null
	 **/
  	this.identifier = null;
  	
  	/**
	 * This presents the current browser version
	 * @property file_id
	 * @type Object
	 * @default null
	 **/
	 this.file_id = null;
	 
	 this.is_collaboration_on = null;
	 
	 this.panel = null;
	 this.left = null;
	 this.top = null;
	 this.autoSaveTimer = null;
	 this.status=0;
	 this.timer1 = null;
	 this.timer2 = null;
	 
};

org.goorm.core.collaboration.design.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 * @param {Object} target The target.
	 **/
	init: function (target) {
		
		var self = this;
		this.target = target;
		this.identifier = this.target.parent.filepath+"/"+this.target.parent.filename;
		this.file_id = this.target.parent.filename;
		
		this.objects = this.target.objects;
		
		this.updateQueue = [];
		
		this.predefinedColors = ["#FFCFEA", "#E8FF9C", "#FFCC91", "#42C0FF", "#A7FF9E", "#7DEFFF", "#BABDFF", "#FFD4EB", "#AAFF75", "#FF9EAB", "#DCFF91", "#8088FF"];
  		this.assignedColors = {};

	},	
	
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method start_listening 
	 **/
	start_listening: function () {
		
		var self = this;
		this.setUserPanel();
		//self.project_id = core.status.current_project_name;
		//self.file_id = this.target.parent.filename;
				
		//Client Socket Initializing
 		//this.socket = new WebSocket('ws://goorm.org:8090');
 		this.socket = new WebSocket(core.preference['collaboration_server_url']+":"+core.preference['collaboration_server_port']);
 		 		
 		this.diffWorker = new Worker('module/org.goorm.core.collaboration/collaboration.design.worker.diff.js');
 		this.patchWorker = new Worker('module/org.goorm.core.collaboration/collaboration.design.worker.patch.js');
 		
		delete this.objectUUIDs;
 		this.objectUUIDs = $.makeArray();
 		
 		$(window).unload(function() {
 			self.stop_listening();
 		});
 		
 		this.socket.onopen = function(){
 		 	this.send('{"channel": "design","action":"init", "identifier": "'+ self.identifier +'",'+ '"message":"init"}');
			self.status=1;
			$(self.objects).each(function () {
				self.objectUUIDs.push(this.data_uuid);
			});
 		};
 		
 		this.socket.onclose = function(){
 			// if server not open, socket.onopen is not called. so if status != 1, then server is not opened 
 			if(self.status != 1) {
				core.collaboration_draw_on = true;
	 			$("a[action=collaboration_draw_on_off]").click();
	 			alert.show("Collaboration server is not opened!");
			}
			self.status = 0;
 		}
 		
 		this.diffWorker.onmessage = function(ev){
			var uuid = ev.data.id;
		    var content = ev.data.changes;
		
		    // send the diff to server via the open socket
		    //if(ev.data != "send_snapshot")
		    var line_msg = {"uuid": uuid, "content": content };
		    socket.send('{ "channel":"design", "action": "modify_line", "identifier": "' + self.identifier +'", "message": ' + JSON.stringify(line_msg) + '}');
		    
		};
		
		this.patchWorker.onmessage = function(ev){
			var patching_uuid = ev.data[0];
			var patch_user_id = ev.data[1];
			var changed_content = ev.data[2];
			var modifying_line = $("[data-uuid=" + patching_uuid + "]");
		
			if(changed_content != ""){
				$(modifying_line).html(changed_content);
		      
				//update the stored line in hash
				stored_lines[patching_uuid] = {"content": changed_content}
			}
		}
		
		this.autoSaveTimer = null;  
		
		var checkForUpdates = function () {
			
			while(self.updateQueue.length > 0 && self.updating_process_running == false) {
				var current_update = self.updateQueue.shift(); 
				
				if(current_update["channel"] != "chat"){
					if(!self.playbackMode && (current_update["payload"]["user"] == self.userID)){
						clearTimeout(self.autoSaveTimer);
						self.autoSaveTimer = setTimeout(function(){
							//self.socket.send('{"channel": "design","action":"autoSaved", "identifier":"'+self.identifier+'", "message":""}');
							self.target.parent.save();
						},5000);
						return false;
					}
				}
				
				self.updating_process_running = true;
				
				self.applyUpdate(current_update["payload"]["action"], current_update["payload"]);
			}
		};
		
		var inspectObjectChanage = function (i) {
			
			if(self.socket != null){
				if(self.socket.readyState != 1) {
			 			core.collaboration_draw_on = true;
						$("a[action=collaboration_draw_on_off]").click();
			 			alert.show("Collaboration server is disconnected!");
						self.status = 0;
						//window.clearInterval(self.timer1);
						//window.clearInterval(self.timer2);
						return false;
				}
			}
			var current_objectUUIDs = $.makeArray();
			
			//psuedo code...
			$(self.objects).each(function (i) {
				//add				
				if (this.data_uuid == undefined || this.data_uuid == "null" || this.data_uuid == null) {
					if (this.properties.is_drawing_finished) {
						this.data_uuid = self.generateUUID();
						
						self.objectUUIDs.push(this.data_uuid);
						
						var objectData = {
							type: this.type,
							shape_name: this.shape_name,
							data_uuid: this.data_uuid,
							properties: {
								focus: this.properties.focus,
								is_dragging: this.properties.is_dragging,
								is_drawing_finished: this.properties.is_drawing_finished,
								selected_node: this.properties.selected_node,
								sx: this.properties.sx,
								sy: this.properties.sy,
								ex: this.properties.ex,
								ey: this.properties.ey,
								previous_x: this.properties.previous_x,
								previous_y: this.properties.previous_y,
								id: this.properties.id,
								name: this.properties.name,
								x: this.properties.x,
								y: this.properties.y,
								width: this.properties.width,
								height: this.properties.height,
								dashed: this.properties.dashed,
								connector: this.properties.connector,
								attribute_list: this.properties.attribute_list
							} 
						};
						
						objectData.shape = {};
						objectData.shape.properties = {};
						
						$.each(this.shape.properties, function (key, value) {
							eval("objectData.shape.properties." + key + " = '" + encodeURIComponent(value) + "';");
						});
																
						self.socket.send('{"channel":"design","action": "add_object", "identifier": "' + self.identifier +'", "message": { "uuid": "' + this.data_uuid + '", "object": ' + JSON.stringify(objectData) + ' }}');

					}
				}
				//modify
				else if (this.properties.status == "modified") {
					this.properties.status = "none";
					
					var inner_node = $.makeArray();
					
					$(this.properties.inner_node).each(function(){
						inner_node.push({x:this.x, y:this.y});
					});
					
					var objectData = {
						type: this.type,
						shape_name: this.shape_name,
						data_uuid: this.data_uuid,
						properties: {
							focus: this.properties.focus,
							is_dragging: this.properties.is_dragging,
							is_drawing_finished: this.properties.is_drawing_finished,
							selected_node: this.properties.selected_node,
							sx: this.properties.sx,
							sy: this.properties.sy,
							ex: this.properties.ex,
							ey: this.properties.ey,
							previous_x: this.properties.previous_x,
							previous_y: this.properties.previous_y,
							id: this.properties.id,
							name: this.properties.name,
							x: this.properties.x,
							y: this.properties.y,
							width: this.properties.width,
							height: this.properties.height,
							dashed: this.properties.dashed,
							inner_node: inner_node,
							connector: this.properties.connector,
							attribute_list: this.properties.attribute_list
						}
					};
					
					objectData.shape = {};
					objectData.shape.properties = {};
						
					$.each(this.shape.properties, function (key, value) {	
											
						eval("objectData.shape.properties." + key + " = '" + encodeURIComponent(value) + "';");
					});
					
					console.log(objectData);
								
		    		self.socket.send('{"channel":"design","action": "modify_object", "identifier": "'+ self.identifier +'", "message": { "uuid": "' + this.data_uuid + '", "object": ' + JSON.stringify(objectData) + ' }}');
				}
				
				current_objectUUIDs.push(this.data_uuid);
			});
		
			
			//remove
			$(self.objectUUIDs).each(function (i){
				if ($.inArray(this.toString(), current_objectUUIDs) == -1) {
					self.socket.send('{"channel":"design", "action": "remove_object", "identifier": "'+ self.identifier +'",  "message": { "uuid": "' + this.toString() + '" }}');
						
					self.objectUUIDs.pop(this.toString());
					
					return false;
				}
			});
			
		};
		
		//Set Callback Function for Listening from Collaboration Server 
		this.socket.onmessage = function(ev){
			if(!ev.data) return false;

			var received_msg = JSON.parse(ev.data);
			
			if (received_msg["channel"] == "initial") {

				self.userID = received_msg["id"];
				
	        	for(var user_index in received_msg["users"]){
	        		self.addUser(received_msg["users"][user_index]);
	        	}
	
	        	// periodically check for available updates and apply them
	        	self.timer1 = window.setInterval(checkForUpdates, 500);
	        
	        	self.timer2 = window.setInterval(inspectObjectChanage, 1000);
	        	
			}
			else if(received_msg["channel"] == "design" && received_msg.payload.identifier == self.identifier){
			
				var identifier = received_msg.payload.identifier;
				console.log(received_msg);
				
				switch(received_msg["payload"]["action"]){
					case "join":
						if(received_msg["payload"]["user"] != self.userID)
           					self.addUser(received_msg["payload"]["user"]);
						break;
					case "leave":
						self.removeUser(received_msg["payload"]["user"]);
						break;
					case "add_object":
						self.updateQueue.push(received_msg);
						break;
					case "modify_object":
						self.updateQueue.push(received_msg);
						break;
					case "remove_object":
						self.updateQueue.push(received_msg);
						break;			
					default:
						console.log("invalid update");
				 }
			}
			
		};
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * This operates the initialization tasks for layout, actions, plugins...
	 * First written: Sung-tae Ryu 
	 * Latest modified: Sung-tae Ryu 
	 * @method stop_listening() 
	 * @return void
	 **/
	stop_listening: function () {
		//Unset Callback Function for Listening from Collaboration Server
		$(this.target.target).find(".div_design_collaboration_user_container").remove();
		this.socket.send('{"channel":"design","action": "leave", "identifier": "'+ this.identifier +'"}');
		
		console.log("stop_listening");
		window.clearInterval(this.timer1);
		window.clearInterval(this.timer2);
		this.socket.onmessage = null;
		this.socket.close();
		this.socket.onmessage = null;
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method applyUpdate 
	 * @param {Object} action The action.
	 * @param {Object} update The update.
	 **/	
	applyUpdate: function (action, update) {
		switch(action){
			case "add_object":
				this.addObject(update);
				break;
			case "modify_object":
				this.modifyObject(update);
				break;
			case "remove_object":
				this.removeObject(update);
				break;
			default:
				console.log("invalid update");
				
		};
	},
	

	/**
	 * This function is an goorm core initializating function.  
	 * @method setUserPennel 
	 * @param void
	 **/
	setUserPanel: function(){
		var self = this;
		
		$(this.target.target).append("<div class='div_design_collaboration_user_container'></div>");
		
		this.panel = new YAHOO.widget.Panel(
				$(this.target.target).find(".div_design_collaboration_user_container")[0], { 
				width: 200,
				height: 90,
				visible: true, 
				underlay: "none",
				close: false,
				autofillheight: "body",
				draggable: true,
				constraintoviewport: true
			} 
		);	
		
		//////////////////////////////////////////////////////////////////////////////////////////
		// window setting
		//////////////////////////////////////////////////////////////////////////////////////////	
		
		this.panel.setHeader("<div style='overflow:auto' class='titlebar'><div style='float:left; font-size:9px;'>User</div><div class='window_buttons'><img src='images/icons/context/closebutton.png' class='close window_button' /></div></div>");
		this.panel.setBody("<div class='designCollaborationUserContainer' style='overflow-y:scroll;height:65px;padding-left:5px'></div>");
		this.panel.render();
		
		$(this.target.target).find(".div_design_collaboration_user_container").parent().css("left", 70);
		$(this.target.target).find(".div_design_collaboration_user_container").parent().css("top", 55);
		
		this.left = 70;
		this.top = 55;
		this.panel.dragEvent.subscribe(function(i,e){
			if(e[0] =="endDrag") {
				var movedLeft = $(self.target.target).scrollLeft();
				var movedTop = $(self.target.target).scrollTop();
				
				self.left = parseInt($(self.target.target).find(".div_design_collaboration_user_container").parent().css("left")) - movedLeft;
				self.top = parseInt($(self.target.target).find(".div_design_collaboration_user_container").parent().css("top")) - movedTop;
			}
		});
		
		$(this.target.target).scroll(function () {
			var movedLeft = $(this).scrollLeft();
			var movedTop = $(this).scrollTop();
			
			if(movedTop+$(this).height() > $(this).find(".space").height()+14) {
				$(this).scrollTop($(this).find(".space").height()-$(this).height()+14);
			}
			else {
				$(this).find(".div_design_collaboration_user_container").parent().css("left", movedLeft + self.left);
				$(this).find(".div_design_collaboration_user_container").parent().css("top", movedTop + self.top);
			}
		});
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method addUser 
	 * @param {Number} id The identifier.
	 **/
	addUser: function (id) {
		var new_user_li = $("<div id='user-" + id + "'></div>");
	    this.assignedColors[id] = this.predefinedColors.pop();
	
	    new_user_li.append("<span class='user_color' style='background-color:" + this.assignedColors[id] + "; color: " + this.assignedColors[id] + "'>.</span>");
	    new_user_li.append("<span class='user_name'>User-" + id + "</span>");
	    $(this.target.target).find(".designCollaborationUserContainer").append(new_user_li);
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method removeUser 
	 * @param {Number} id The identifier.
	 **/
	removeUser: function (id) {
		$("div").find(".designCollaborationUserContainer").find("#user-" + id).remove();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method addObject 
	 * @param {Object} payload The payload.
	 **/
	addObject: function (payload) {
		var self = this;
		
		var object = eval(payload["message"]["object"]);
		var addObjectAvailable = true;
		
		$(self.objects).each(function (i) {
			if (this.data_uuid)	{			
				if (this.data_uuid == object.data_uuid || this.properties.id == object.properties.id) {
					addObjectAvailable = false;
					
					return false;
				}
			}
		});
		
		if (addObjectAvailable) {
			this.target.add(object.type, object.shape_name);			
			this.set_properties(self.objects[self.objects.length-1], object);			
			this.target.draw();

			this.objectUUIDs.push(object.data_uuid);
		}
		
		
		this.updating_process_running = false;
	},

	/**
	 * This function is an goorm core initializating function.  
	 * @method set_properties 
	 * @param {Object} target The target.
	 * @param {Object} source The source.
	 **/
	set_properties: function (target, source) {
		target.type = source.type;
		target.shape_name = source.shape_name;
		target.data_uuid = source.data_uuid;
		
		target.properties.focus = source.properties.focus;
		target.properties.is_dragging = source.properties.is_dragging;
		target.properties.is_drawing_finished = source.properties.is_drawing_finished;
		target.properties.selected_node = source.properties.selected_node;
		target.properties.sx = source.properties.sx;
		target.properties.sy = source.properties.sy;
		target.properties.ex = source.properties.ex;
		target.properties.ey = source.properties.ey;
		target.properties.previous_x = source.properties.previous_x;
		target.properties.previous_y = source.properties.previous_y;
		target.properties.id = source.properties.id;
		target.properties.name = source.properties.name;
		target.properties.x = source.properties.x;
		target.properties.y = source.properties.y;
		target.properties.width = source.properties.width;
		target.properties.height = source.properties.height;
		target.properties.dashed = source.properties.dashed;
		
		//console.log(source.properties.inner_node);
		
		target.properties.inner_node = $.makeArray();
		
		$(source.properties.inner_node).each(function() {
			target.properties.inner_node.push({x:this.x, y:this.y});
		});
		
		target.properties.connector = source.properties.connector;
		target.properties.attribute_list = source.properties.attribute_list;
				
		if(source.shape.properties != null){
			$.each(source.shape.properties, function (key, value) {						
				eval("target.shape.properties." + key + " = '" + decodeURIComponent(value) + "';");
			});
		}
		
		target.shape.set_shape();
		target.shape.show();
	},

	/**
	 * This function is an goorm core initializating function.  
	 * @method modifyObject 
	 * @param {Object} payload The payload.
	 **/
	modifyObject: function (payload) {
		var self = this;
		
		var object = eval(payload["message"]["object"]);
		var modifyObjectAvailable = false;
		var index = null;
		
		$(self.objects).each(function (i) {
			if (this.data_uuid == object.data_uuid && this.properties.id == object.properties.id) {
				modifyObjectAvailable = true;
				index = i;
				
				return false;
			}
		});
		
		
		if (modifyObjectAvailable) {
			this.set_properties(self.objects[index], object);			
			this.target.draw();
		}
		
		this.updating_process_running = false;
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method removeObject 
	 * @param {Object} payload The payload.
	 **/
	removeObject: function (payload) {
		var self = this;
		
		var uuid = payload["message"]["uuid"];
		
		$(self.objects).each(function (i) {				
			if (this.data_uuid == uuid) {
				this.remove();
				self.objectUUIDs.pop(uuid);
		
				return false;
			}
		});
		
		this.updating_process_running = false;
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method generateUUID
	 * @return {String} The result string. 
	 **/
	generateUUID: function () {
    	//get the pad id
	    //var padid = "1";
	    var padid = "1";
    
	    //get the user id
	    //var userid = user_id;
	    var userid = "test";

	    //get the current timestamp (in UTC)
	    var d = new Date();
	    var timestamp = $.map([d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(),	d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds()], function(n, i){
			return (n < 10) ? "0"+n : n;
		}).join("");

	    //combine them and generate the UUID
	    //format: padid_userid_timestamp
	    return padid + "_" + userid + "_" + timestamp;
  	}
};