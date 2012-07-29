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
 * @class edit
 * @extends collaboration
 **/
org.goorm.core.collaboration.edit = function () {
	/**
	 * This presents the current browser version
	 * @property target
	 * @type Object
	 * @default null
	 **/
	this.target = null;
	
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
	 * @property socket
	 * @type Object
	 * @default null
	 **/
	this.socket = null;
	
	/**
	 * This presents the current browser version
	 * @property previousText
	 * @type Object
	 * @default null
	 **/
	this.previousText = null;
	
	/**
	 * This presents the current browser version
	 * @property taskQueue
	 * @type Object
	 * @default null
	 **/
	this.taskQueue = [];	
	
	/**
	 * This presents the current browser version
	 * @property removedLinesUUIDs
	 * @type Object
	 * @default null
	 **/
	this.removedLinesUUIDs = [];
	
	/**
	 * This presents the current browser version
	 * @property userID
	 * @type Object
	 * @default null
	 **/	
	this.userID = null;
	
	/**
	 * This presents the current browser version
	 * @property updating_process_running
	 * @type Object
	 * @default null
	 **/
	this.updating_process_running = false;
	
	/**
	 * This presents the current browser version
	 * @property playbackMode
	 * @type Object
	 * @default null
	 **/
	this.playbackMode = false;
	
	/**
	 * This presents the current browser version
	 * @property takeDiffs
	 * @type Object
	 * @default null
	 **/
	this.takeDiffs = true;
	
	/**
	 * This presents the current browser version
	 * @property storedLines
	 * @type Object
	 * @default null
	 **/
	this.storedLines = {};
	
	/**
	 * This presents the current browser version
	 * @property contents
	 * @type Object
	 * @default null
	 **/
	this.contents = null;
	this.editor = null;
	this.caller = null;
	this.filename = null;
	this.filepath = null;
	this.identifier = null;
	this.autoSaveTimer=null;
	this.status = 0;
	this.timer = null;
};

org.goorm.core.collaboration.edit.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor
	 * @param {Object} target 
	 **/
	init: function(target,caller) {
		var self = this;
		this.caller = caller;
		this.target = target;
		this.filename = this.caller.filename;
		this.filepath = this.caller.filepath;
		this.status=0;
  		this.previousText = this.getEditableContent();
  		
  		this.taskQueue = [];
  		this.removedLinesUUIDs = [];
 		this.identifier = this.filepath+"/"+this.filename;

		/*
      	$(this.target).append("<div style='padding:5px;'><div id='collaboration.edit' contenteditable='true' spellcheck='false' style='list-style-type:none; display:none;'></div></div>");
      	$(this.target).find("[id='collaboration.edit']").append("<div><p id='line1'>test</p></div>");
		*/
	},
	
	set_edit_on: function(){
		var self=this;

		var checkForUpdates = function() {
			
			while(self.taskQueue.length > 0 && self.updating_process_running == false) {
				var current_update = self.taskQueue.shift(); 
				
				self.updating_process_running = true;
				
				self.applyUpdate(current_update["payload"]["action"], current_update["payload"]);
			}
		};
		
		
		//Client Socket Methods
 		this.socket = new WebSocket(core.preference['collaboration_server_url']+":"+core.preference['collaboration_server_port']);
 		
 		this.socket.onopen = function(){
 			self.status=1;
 		 	this.send('{"channel": "edit","action":"init", "identifier": "'+ self.identifier +'",'+ '"message":"init"}');
 		};
 		
 		this.socket.onclose = function(){
 			// if server not open, socket.onopen is not called. so if status != 1, then server is not opened 
 			if(self.status != 1) {
				core.flag.collaboration_on = true;
	 			$("a[action=collaboration_edit_on_off]").click();
	 			alert.show("Collaboration server is not opened!");
			}
			self.status = 0;
 		}
 		
 		$(window).unload(function() {
 			self.set_edit_off();
 		});

 		this.socket.onmessage = function(ev){
 			if(!ev.data) return false;

			var received_msg = JSON.parse(ev.data);
			if(received_msg["channel"] == "initial"){
				self.userID = received_msg["id"];
				m.s("userID:" + self.userID);
				
				for(var user_index in received_msg["users"]){
					//self.addUser(received_msg["users"][user_index]);
				}
					
				self.setCollaborationData("!refresh");

				// periodically check for available updates and apply them
				self.timer = window.setInterval(checkForUpdates, 500);
			}
			else if(received_msg["channel"] == "edit" && received_msg["payload"]["identifier"] == self.identifier && received_msg["payload"]["user"] != self.userID){
				switch(received_msg["payload"]["action"]){
					case "add_line":
						//store the update in the queue
						self.taskQueue.push(received_msg);
						break;
					case "modify_line":
						//store the update in the queue
						self.taskQueue.push(received_msg);
						break;
					case "remove_line":
						//store the update in the queue
						self.taskQueue.push(received_msg);
						break;
					case "playback_done":
	         			//store the update in the queue
						self.taskQueue.push(received_msg);
						break;
					case "change":
						self.taskQueue.push(received_msg);
						break;
					default:
						
				}
			}
		}
		
		$(this.target).find("[id='collaboration.edit']").keydown(function(ev){
			//don't delete the beyond p
			if(ev.keyCode == 8 || ev.keyCode == 46){
				var editing_lines = $(self.target).find("[id='collaboration.edit']").find("div").find("p");
				if(editing_lines.length == 1 && $(editing_lines[0]).html() == ""){
					$(editing_lines[0]).html("&nbsp;");
					return false;
				}
			}
		});
	},
	set_edit_off:function(){
		var self=this;
		//Unset Callback Function for Listening from Collaboration Server
		if( this.socket != null && this.socket.readyState == 1){
			this.socket.send('{"channel":"edit","action": "leave", "identifier": "'+ self.identifier +'"}');
			this.socket.onmessage = null;
			this.socket.close();
			window.clearInterval(self.timer);
		} 
	},
	setEditor:function(editor){
		this.editor = editor;
	},

	/**
	 * This function is an goorm core initializating function.  
	 * @method getEditableContent 
	 **/
	getEditableContent: function() {
		var editable_content = this.getCollaborationData();

	    return editable_content;
	},
	
	update_change: function(data){
		var self = this;
		if(this.socket != null){
			if(this.socket.readyState != 1) {
				core.flag.collaboration_on = true;
	 			$("a[action=collaboration_edit_on_off]").click();
	 			alert.show("Collaboration server is disconnected!");
	 			return false;
			}
			
			this.socket.send('{"channel": "edit", "action": "change", "identifier":"'+this.identifier+'", "message":' + JSON.stringify(data) + '}');
			clearTimeout(this.autoSaveTimer);
			this.autoSaveTimer = setTimeout(function(){
				//self.socket.send('{"channel": "edit","action":"autoSaved", "identifier":"'+self.identifier+'", "message":""}');
				self.caller.save();
			},5000);
		}

	},
	/**
	 * This function is an goorm core initializating function.  
	 * @method applyUpdate 
	 * @param {Object} action The action.
	 * @param {Object} update The update.
	 **/
	applyUpdate: function(action, update){
			
		switch(action) {
			case "add_line":
				this.addLine(update);
				break;
			case "modify_line":
				this.modifyLine(update);
				break;
			case "remove_line":
				this.removeLine(update);
				break;
			case "playback_done":
				this.playback_mode = false;
				break;
			case "change":
				this.change(update);
				break;
			default:
				console.log("invalid update");
		};
	},
	change: function(payload){
		
		var content = payload["message"];

		var textStr = "";
		for(var i=0; i < content.text.length; i++){
			if(i != 0 ){
				textStr+="\n";
			}
			textStr += content.text[i];
		}
		this.editor.replaceRange(textStr, content.from, content.to);
		
		this.updating_process_running = false;
		
		////console.log("added a line : " + content); 
	},
	/**
	 * This function is an goorm core initializating function.  
	 * @method addLine 
	 * @param {Object} payload The payload.
	 **/  
	addLine: function(payload){
		
		var content = payload["message"]["content"];
		//new line html
		 var new_line = $("<p data-uuid='" + payload["message"]["uuid"] + "'>" + content + "</p>");
		//var new_line = content;
	
		//find the line with next uuid
		var next_line = $(this.target).find("[data-uuid =" + payload["message"]["next_uuid"] + "]");
		var previous_line = $(this.target).find("[data-uuid =" + payload["message"]["previous_uuid"] + "]");
	
		if(next_line.length > 0) {
			next_line.before(new_line);
		}
		// else find the line with previous uuid
		else if(previous_line.length > 0) {
			previous_line.after(new_line);
		}
		else {
			// insert as the first line
			$(this.target).find("[id='collaboration.edit']").find("div").append(new_line);
		}
	
		//highlight the line
		//this.highlightUserEdit(new_line, payload["user"]);
	
		//apply syntax highlighting
		//this.applySyntaxHighlighting(new_line);
	
		//update the stored line in hash
		this.storedLines[payload["message"]["uuid"]] = {
			"content": payload["message"]["content"]
		};
	
		this.updating_process_running = false;
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method modifyLine 
	 * @param {Object} payload The payload.
	 **/    
	modifyLine: function(payload){
		//find the line with uuid
		var uuid = payload["message"]["uuid"];
		var user_id = payload["user"];
		var patch = payload["message"]["content"];
	
		var current_text = $(this.target).find("[data-uuid=" + uuid + "]").text();
	
		// send the uuid, line content and diff to patch worker
		this.patchWorker.postMessage({
			"uuid": uuid,
			"patch": patch,
			"current_text": current_text,
			"user_id": this.userID
		});
		
		this.updating_process_running = false;
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method removeLine 
	 * @param {Object} payload The payload.
	 **/   
	removeLine: function(payload){
		var self = this;
		
		//find the line with uuid
		var uuid = payload["message"]["uuid"];
		var user_id = payload["user"];
		var line = $(this.target).find("[data-uuid=" + uuid + "]");

		line.remove();
		delete this.storedLines[uuid];
		
		this.updating_process_running = false;
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method generateUUID 
	 * @return {String} The result string.
	 **/   
	generateUUID: function(){
		//get the pad id
		var padid = "1";
	
		//get the user id
		var userid = this.userID;
	
		//get the current timestamp (in UTC)
		var d = new Date();
		var timestamp = $.map([d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(),
		d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds()], function(n, i) {
			return (n < 10) ? "0"+n : n;
		}).join("");
		//combine them and generate the UUID
		//format: padid_userid_timestamp
		return padid + "_" + userid + "_" + timestamp;
	}, 
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method doPlayback 
	 **/   
	doPlayback: function() {
		//send a request to get all the diffs available
		this.socket.send('{"type": "playback", "message":""}');
	
		//turn on the playback mode
		this.playbackMode = true;
	
		//clear everything (pad, chat, users)
		this.storedLines = {};
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method setCollaborationData 
	 * @param {Object} contents The contents.
	 **/ 
	setCollaborationData: function(contents) {
		var self = this;
	
		if(contents) {
			if(contents == "!refresh") {
      			this.setCollaborationData(this.contents);
      			return false;
      		}
      		
	      	var originalContents = contents.split("\n");
	      	var result = "";
	      	
	      	$(originalContents).each(function (i){
	      		result += "<p id='line" + (i+1) + "' data-uuid='" + self.generateUUID() + "'>" + this + "</p>";
	      	});
	      	
	      	$(this.target).find("[id='collaboration.edit']").find("div").html(result);
	      	
	      	this.contents = contents;
      	}
      	else {
    		$(this.target).find("[id='collaboration.edit']").find("div").html("<p id='line1' data-uuid='" + this.generateUUID() + "'>&nbsp;</p>");
		}

	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method getCollaborationData 
	 **/ 
	getCollaborationData: function() {
		
	}
  	
};
