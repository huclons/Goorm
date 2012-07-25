/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.collaboration.communication = function () {
	this.userID = 0;
	this.userName = null;
	this.socket = null;
	this.predefined_colors = null;
  	this.assigned_colors = null;
  	this.updating_process_running = false;
  	this.update_queue = [];
  	this.project_id = null;
  	this.is_chat_on = null;
  	this.timer = null;
  	
};

org.goorm.core.collaboration.communication.prototype = {

	init: function (target) {
		var self = this;
		
		/*
		this.project_id = project_id;
		
		this.is_chat_on = 0;
		//project_id = "chat_join_online_project";
		$("#chat_join_online_project .chat_user_container").css("height","30px");
		$("#chat_join_online_project .chat_message_container").css("height","217px");
		$("#chat_join_online_project .chat_message_input_container").css("height","25px");
		$("#chat_join_online_project").css("height","")
			.css("border-left","none")
			.css("border-right","none")
			.css("border-bottom","none");
		this.update_queue = [];
		
		this.predefined_colors = ["#FFCFEA", "#E8FF9C", "#FFCC91", "#42C0FF", "#A7FF9E", "#7DEFFF", "#BABDFF", "#FFD4EB", "#AAFF75", "#FF9EAB", "#DCFF91", "#8088FF"];
  		this.assigned_colors = {};
  		
 		$("#"+this.project_id+" #input_chat_message").unbind("keypress");
		$("#"+this.project_id+" #input_chat_message").keypress(function(ev){
			if((ev.keyCode || ev.which) == 13){
				ev.preventDefault();
				
				//message encoding to UTF-8
				var encodedMsg = encodeURIComponent($(this).val());
				if(self.is_chat_on==1 && self.socket.readyState == 1){
					self.socket.send('{"channel": "chat", "action":"sendchat", "identifier": "'+ self.project_id +'", "message":"' + encodedMsg + '"}');
				} else {
					alert.show("Collaboration server is not opened!");

					$(".is_chat_on").html("Chat Off");
					$("a[action=chat_on_off]").find("img").removeClass("toolbar_buttonPressed");
	
					$("a[action=chat_on_off]").each(function(i) {
						if($(this).attr("status") == "enable") {
							$(this).parent().hide();
						} else if($(this).attr("status") == "disable") {
							$(this).parent().show();
						}
					});
				}
				$(this).val("");
			}
		});
		
		*/
		
		$("#" + target).append("<div class='chatting_user_container'>User </div>");		
		$("#" + target).append("<div class='chatting_message_container'></div>");
		$("#" + target).append("<div class='chatting_message_input_container'><input id='input_chat_message' value='Chatting Message' style='width:90%;' /></div>");		
		
		$("#" + target + " #input_chat_message").keypress(function(ev){
			if((ev.keyCode || ev.which) == 13){
				ev.preventDefault();
				
				//message encoding to UTF-8
				var encodedMsg = encodeURIComponent($(this).val());
				if(self.is_chat_on==1 && self.socket.readyState == 1){
					self.socket.send('{"channel": "chat", "action":"sendchat", "identifier": "'+ self.project_id +'", "message":"' + encodedMsg + '"}');
				} else {
					alert.show("Collaboration server is not opened!");

					$(".is_chat_on").html("Chat Off");
					$("a[action=chat_on_off]").find("img").removeClass("toolbar_buttonPressed");
	
					$("a[action=chat_on_off]").each(function(i) {
						if($(this).attr("status") == "enable") {
							$(this).parent().hide();
						} else if($(this).attr("status") == "disable") {
							$(this).parent().show();
						}
					});
				}
				$(this).val("");
			}
		});
		
		
		$(core).bind("layout_resized", function () {
			var layout_right_height = $(".yui-layout-unit-right").find(".yui-layout-wrap").height() - 25;
			$("#goorm_inner_layout_right").find(".communication_message_container").height(layout_right_height - 182);
		});
		
		
		//core.module.layout.resize_all();
	},
	
	resize: function () {
		
	},
	
	set_chat_on: function () {
		/*
		var self = this;
		//this.socket = new WebSocket('ws://goorm.org:8090');
 		this.socket = new WebSocket(core.dialog.preference.ini['collaboration_server_url']+":"+core.dialog.preference.ini['collaboration_server_port']);

 		if(core.user.last_name != null && core.user.first_name != null){
			this.userName = encodeURIComponent(core.user.last_name+" "+core.user.first_name);
		}
		else{
			this.userName = encodeURIComponent(localStorage['collaboration_nickname']);
		}
		
 		this.start_listening();
 		this.socket.onopen = function(){
 			self.is_chat_on = 1;
 		 	this.send('{"channel": "chat","action":"init", "identifier": "'+ self.project_id +'",'+ '"message":"init","user":"'+self.userName+'"}');
 		};
 		this.socket.onclose = function(){
 			if(self.is_chat_on!=1){
 		 		core.chat_on = false;
 		 		self.is_chat_on = 0;
 		 		
	 			$(".is_chat_on").html("Chat Off");
				$("a[action=chat_on_off]").find("img").removeClass("toolbar_buttonPressed");

				$("a[action=chat_on_off]").each(function(i) {
					if($(this).attr("status") == "enable") {
						$(this).parent().hide();
					} else if($(this).attr("status") == "disable") {
						$(this).parent().show();
					}
				});
	 			alert.show("Collaboration server is not opened!");
 		 	}
 		};
 		*/
	},
	
	set_chat_off: function () {
		
		var self = this;
		
 		this.stop_listening();
 		this.is_chat_on = 0;
 		
 		return false;
	},
	
	start_listening: function () {
		
		var self = this;
		
		var checkForUpdates = function () {
			
			if(self.update_queue.length > 0 && self.updating_process_running == false) {
				var current_update = self.update_queue.shift(); 
				self.updating_process_running = true;
				self.apply_update(current_update["payload"]["action"], current_update["payload"]);
			}
		}
		$(window).unload(function() {
 			self.stop_listening();
 		});

		//Set Callback Function for Listening from Collaboration Server 
		this.socket.onmessage = function(ev){
			if(!ev.data) return false;
			//console.log(decodeURIComponent(ev.data));
			var received_msg = JSON.parse(decodeURIComponent(ev.data));
			//console.log(ev.data);
			//var received_msg = eval("[" + ev.data + "]");
			
			if(received_msg["channel"] == "initial"){
				self.userID = received_msg["id"].split("|@|")[0];

		        for(var user_index in received_msg["users"]){
		        	self.add_user(received_msg["users"][user_index]);
		        }
		
		        // periodically check for available updates and apply them
		        self.timer = window.setInterval(checkForUpdates, 500);
			}
			else if(received_msg["channel"] == "chat_"+self.project_id){
				switch(received_msg["payload"]["action"]){
					case "join":
						if(received_msg["payload"]["user"].split("|@|")[0] != self.userID)
	           				self.add_user(received_msg["payload"]["user"]);
						break;
					case "leave":
						self.remove_user(received_msg["payload"]["user"]);
						break;
					case "sendchat":
						self.update_queue.push(received_msg);
						break;
					default:
						console.log(received_msg);
				}
			}

		};
	},
	
	stop_listening: function () {
		var self=this;
		
		//Unset Callback Function for Listening from Collaboration Server
		if(this.socket != null){
			if(this.socket.readyState == 1){
				this.socket.send('{"channel":"chat","action": "leave", "identifier": "'+ self.project_id +'"}');
				this.socket.onmessage = null;
				this.socket.close();
			}
		}
		window.setInterval(this.timer);
		$("#"+this.project_id+" .chat_user_container").html("");
		$("#"+this.project_id+" .chat_message_container").html("");
	},
	
	apply_update: function (action, update) {
		switch(action){
			case "sendchat":
				this.new_chat_message(update["user"], update["message"]);
				break;
			default:
				console.log("invalid update");
		};
	},
	
	add_user: function (id) {
		var userID = id.split("|@|")[0];
		var userName = id.split("|@|")[1];

		var new_user_li = $("<div id='user-" + userID + "'></div>");
	    this.assigned_colors[userID] = this.predefined_colors.pop();
	
	    new_user_li.append("<span class='user_color' style='background-color:" + this.assigned_colors[userID] + "; color: " + this.assigned_colors[userID] + "'>.</span>");
	    new_user_li.append("<span class='user_name'>" + userName + "</span>");
	    $("#"+this.project_id+" .chat_user_container").append(new_user_li);
	},
	
	remove_user: function (id) {
		var userID = id.split("|@|")[0];
		$("#"+this.project_id+" .chat_user_container").find("#user-" + userID).remove();
	},
	
	new_chat_message: function (uid, msg) {
		var userID = uid.split("|@|")[0];
		var userName = uid.split("|@|")[1];
		
		var chat_user = $("<span class='user' style='color:" + this.assigned_colors[userID] + "'>" + userName+ "</span>")
		msg = decodeURIComponent(msg);
	   	var chat_message = $("<span class='message'>" + msg + "</span>");
	   	var chat_timestamp = $("<span class='timestamp'>(" + this.get_clock_time() + ")</span>");
	
	   	var chat_line = $("<div class='chat_message unread'></div>");
	   	chat_line.append(chat_user);
	   	chat_line.append(chat_message);
	   	chat_line.append(chat_timestamp);
	
	    $("#"+this.project_id+" .chat_message_container").append(chat_line)
	    //TODO: set focus on last line added
	    $("#"+this.project_id+" .chat_message_container").attr({ scrollTop: $("#"+this.project_id+" .chat_message_container").attr("scrollHeight") });
		
	    this.updating_process_running = false;
	},
	
	get_clock_time: function () {
		var now    = new Date();
		var hour   = now.getHours();
		var minute = now.getMinutes();
		var second = now.getSeconds();
		var ap = "AM";
		
		if (hour   > 11) { ap = "PM";             }
		if (hour   > 12) { hour = hour - 12;      }
		if (hour   == 0) { hour = 12;             }
		if (hour   < 10) { hour   = "0" + hour;   }
		if (minute < 10) { minute = "0" + minute; }
		if (second < 10) { second = "0" + second; }
		
		var timeString = hour + ':' + minute + ':' + second + " " + ap;
	   	
		return timeString;
	}
};