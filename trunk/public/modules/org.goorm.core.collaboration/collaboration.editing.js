/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.collaboration.editing = function () {
	this.target = null;
	this.diff_worker = null;
	this.patch_worker = null;
	this.socket = null;
	this.previous_text = null;
	this.task_queue = [];	
	this.removed_lines_uuids = [];
	this.user = null;
	this.updating_process_running = false;
	this.playback_mode = false;
	this.take_diffs = true;
	this.stored_lines = {};
	this.contents = null;
	this.editor = null;
	this.parent = null;
	this.filename = null;
	this.filepath = null;
	this.identifier = null;
	this.auto_save_timer=null;
	this.status = 0;
	this.timer = null;
};

org.goorm.core.collaboration.editing.prototype = {
	init: function(parent) {
		var self = this;
		this.parent = parent;
		this.target = parent.target;
		
		this.socket = io.connect();
		
  		this.task_queue = [];
  		this.removed_lines_uuids = [];
 		
 		this.user = core.user.first_name + "_" + core.user.last_name;

		var check_for_updates = function() {			
			while(self.task_queue.length > 0 && self.updating_process_running == false) {
				var current_update = self.task_queue.shift(); 
				
				self.updating_process_running = true;
				
				self.apply_update(current_update.action, current_update.message);
			}
		};
 		
 		this.timer = window.setInterval(check_for_updates, 500);
 		this.set_collaboration_data("!refresh");
 		
 		
		this.socket.on("editing_message", function (data) {
 			if(!data) {
 				return false;
 			}

			var received_msg = JSON.parse(data);
			
			if(received_msg.channel == "editing" && 
			   received_msg.user != core.user.first_name + "_" + core.user.last_name &&
			   received_msg.filepath == self.filepath) {
				switch(received_msg.action){
					case "change":
						self.task_queue.push(received_msg);
						break;
					default:
						
				}
			}
		});
		
		$(this.target).find("[id='collaboration.editing']").keydown(function(evt) {
			//don't delete the beyond p
			if(evt.keyCode == 8 || evt.keyCode == 46){
				var editing_lines = $(self.target).find("[id='collaboration.editing']").find("div").find("p");
				if(editing_lines.length == 1 && $(editing_lines[0]).html() == ""){
					$(editing_lines[0]).html("&nbsp;");
					return false; 
				}
			} 
		});
	},

	set_editor: function(editor){
		this.editor = editor;
	},
	
	set_filepath: function () {
		this.filepath = this.parent.filepath + this.parent.filename;
	},
	
	update_change: function(data){
		var self = this;
		if(this.socket != null){
			if (self.socket.socket.connected) {
				self.socket.emit("message", '{"channel": "editing", "action":"change", "user":"' + core.user.first_name + "_" + core.user.last_name + '", "workspace": "'+ core.status.current_project_name +'", "filepath":"' + self.filepath + '", "message":' + JSON.stringify(data) + '}');
				
				clearTimeout(this.auto_save_timer);
				this.auto_save_timer = setTimeout(function(){
					self.parent.save();
				},5000);
			}
			else {
				alert.show("Collaboration server is disconnected!");
				return false;
			}
		}

	},

	apply_update: function(action, update){
		switch(action) {
			case "change":
				this.change(update);
				break;
			default:
				console.log("invalid update");
		};
	},
	
	change: function(message){
		var textStr = "";
		
		for(var i=0; i < message.text.length; i++){
			if(i != 0 ){
				textStr+="\n";
			}
			textStr += message.text[i];
		}
		this.editor.replaceRange(textStr, message.from, message.to);
		
		this.updating_process_running = false;
	},

	generate_uuid: function(){
		//get the pad id
		var padid = "1";
	
		//get the user id
		var userid = this.user;
	
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
	
	set_collaboration_data: function(contents) {
		var self = this;
	
		if(contents) {
			if(contents == "!refresh") {
      			this.set_collaboration_data(this.contents);
      			return false;
      		}
      		
	      	var original_contents = contents.split("\n");
	      	var result = "";
	      	
	      	$(original_contents).each(function (i){
	      		result += "<p id='line" + (i+1) + "' data-uuid='" + self.generate_uuid() + "'>" + this + "</p>";
	      	});
	      	
	      	$(this.target).find("[id='collaboration.editing']").find("div").html(result);
	      	
	      	this.contents = contents;
      	}
      	else {
    		$(this.target).find("[id='collaboration.editing']").find("div").html("<p id='line1' data-uuid='" + this.generate_uuid() + "'>&nbsp;</p>");
		}

	}
	
};
