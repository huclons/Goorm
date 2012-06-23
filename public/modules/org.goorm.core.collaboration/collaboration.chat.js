
/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * @module collaboration
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class chat
 * @extends collaboration
 **/
org.goorm.core.collaboration.chat = function () {
	/**
	 * This presents the current browser version
	 * @property userID
	 * @type Number
	 * @default 0
	 **/
	this.userID = 0;
	this.userName = null;
	/**
	 * This presents the current browser version
	 * @property socket
	 * @type Object
	 * @default null
	 **/
	this.socket = null;
	
	/**
	 * This presents the current browser version
	 * @property predefined_colors
	 * @type String
	 * @default null
	 **/
	this.predefined_colors = null;
	
	/**
	 * This presents the current browser version
	 * @property assigned_colors
	 * @type String
	 * @default null
	 **/
  	this.assigned_colors = null;
  	
	/**
	 * This presents the current browser version
	 * @property updating_process_running
	 * @type Boolean
	 * @default false
	 **/
  	this.updating_process_running = false;
	
	/**
	 * This presents the current browser version
	 * @property update_queue
	 * @type Array
	 * @default null
	 **/
  	this.update_queue = [];
  	
  	/**
	 * This presents the current browser version
	 * @property project_id
	 * @type Array
	 * @default null
	 **/
  	this.project_id = null;
  	
  	this.isChatOn = null;
  	this.timer = null;
  	
};

org.goorm.core.collaboration.chat.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 **/
	init: function (project_id) {
		var self = this;
		
		this.project_id = project_id;
		
		this.isChatOn = 0;
		//project_id = "ChatJoinOnlineProject";
		$("#"+this.project_id+" #chat").append("<div class='chatUserContainer'>User </div>");		
		$("#"+this.project_id+" #chat").append("<div class='chatMessageContainer'></div>");
		$("#"+this.project_id+" #chat").append("<div class='chatMessageInputContainer'><input id='inputChatMessage' value='Chatting Message' style='width:90%;' /></div>");
		$("#ChatJoinOnlineProject .chatUserContainer").css("height","30px");
		$("#ChatJoinOnlineProject .chatMessageContainer").css("height","217px");
		$("#ChatJoinOnlineProject .chatMessageInputContainer").css("height","25px");
		$("#ChatJoinOnlineProject").css("height","")
			.css("border-left","none")
			.css("border-right","none")
			.css("border-bottom","none");
		this.update_queue = [];
		
		this.predefined_colors = ["#FFCFEA", "#E8FF9C", "#FFCC91", "#42C0FF", "#A7FF9E", "#7DEFFF", "#BABDFF", "#FFD4EB", "#AAFF75", "#FF9EAB", "#DCFF91", "#8088FF"];
  		this.assigned_colors = {};
 		$("#"+this.project_id+" #inputChatMessage").unbind("keypress");
		$("#"+this.project_id+" #inputChatMessage").keypress(function(ev){
			if((ev.keyCode || ev.which) == 13){
				ev.preventDefault();
				
				//message encoding to UTF-8
				var encodedMsg = encodeURIComponent($(this).val());
				if(self.isChatOn==1 && self.socket.readyState == 1){
					self.socket.send('{"channel": "chat", "action":"sendchat", "identifier": "'+ self.project_id +'", "message":"' + encodedMsg + '"}');
				} else {
					alert.show("Collaboration server is not opened!");

					$(".isChatOn").html("Chat Off");
					$("a[action=chatOnOff]").find("img").removeClass("toolbarButtonPressed");
	
					$("a[action=chatOnOff]").each(function(i) {
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
		core.mainLayout.resizeAll();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method startListening 
	 **/
	setChatOn: function () {
	
		var self = this;
		//this.socket = new WebSocket('ws://goorm.org:8090');
 		this.socket = new WebSocket(core.dialogPreference.ini['CollaborationServerURL']+":"+core.dialogPreference.ini['CollaborationServerPort']);

 		if(core.lastName != null && core.firstName != null){
			this.userName = encodeURIComponent(core.lastName+" "+core.firstName);
		}
		else{
			this.userName = encodeURIComponent(localStorage['CollaborationNickname']);
		}
		
 		this.startListening();
 		this.socket.onopen = function(){
 			self.isChatOn = 1;
 		 	this.send('{"channel": "chat","action":"init", "identifier": "'+ self.project_id +'",'+ '"message":"init","user":"'+self.userName+'"}');
 		};
 		this.socket.onclose = function(){
 			if(self.isChatOn!=1){
 		 		core.isChatOn = false;
 		 		self.isChatOn = 0;
 		 		
	 			$(".isChatOn").html("Chat Off");
				$("a[action=chatOnOff]").find("img").removeClass("toolbarButtonPressed");

				$("a[action=chatOnOff]").each(function(i) {
					if($(this).attr("status") == "enable") {
						$(this).parent().hide();
					} else if($(this).attr("status") == "disable") {
						$(this).parent().show();
					}
				});
	 			alert.show("Collaboration server is not opened!");
 		 	}
 		};
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method startListening 
	 **/
	setChatOff: function () {
		
		var self = this;
		
 		this.stopListening();
 		this.isChatOn = 0;
 		
 		return false;
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method startListening 
	 **/
	startListening: function () {
		
		var self = this;
		
		var checkForUpdates = function () {
			
			if(self.update_queue.length > 0 && self.updating_process_running == false) {
				var current_update = self.update_queue.shift(); 
				self.updating_process_running = true;
				self.applyUpdate(current_update["payload"]["action"], current_update["payload"]);
			}
		}
		$(window).unload(function() {
 			self.stopListening();
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
		        	self.addUser(received_msg["users"][user_index]);
		        }
		
		        // periodically check for available updates and apply them
		        self.timer = window.setInterval(checkForUpdates, 500);
			}
			else if(received_msg["channel"] == "chat_"+self.project_id){
				switch(received_msg["payload"]["action"]){
					case "join":
						if(received_msg["payload"]["user"].split("|@|")[0] != self.userID)
	           				self.addUser(received_msg["payload"]["user"]);
						break;
					case "leave":
						self.removeUser(received_msg["payload"]["user"]);
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
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method stopListening 
	 **/
	stopListening: function () {
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
		$("#"+this.project_id+" .chatUserContainer").html("");
		$("#"+this.project_id+" .chatMessageContainer").html("");
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method applyUpdate 
	 * @param {Object} action The action.
	 * @param {Object} update The update. 
	 **/	
	applyUpdate: function (action, update) {
		switch(action){
			case "sendchat":
				this.newChatMessage(update["user"], update["message"]);
				break;
			default:
				console.log("invalid update");
		};
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method addUser 
	 * @param {Number} id The identifier.
	 **/
	addUser: function (id) {
		var userID = id.split("|@|")[0];
		var userName = id.split("|@|")[1];

		var new_user_li = $("<div id='user-" + userID + "'></div>");
	    this.assigned_colors[userID] = this.predefined_colors.pop();
	
	    new_user_li.append("<span class='user_color' style='background-color:" + this.assigned_colors[userID] + "; color: " + this.assigned_colors[userID] + "'>.</span>");
	    new_user_li.append("<span class='user_name'>" + userName + "</span>");
	    $("#"+this.project_id+" .chatUserContainer").append(new_user_li);
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method removeUser 
	 * @param {Number} id The identifier.
	 **/
	removeUser: function (id) {
		var userID = id.split("|@|")[0];
		$("#"+this.project_id+" .chatUserContainer").find("#user-" + userID).remove();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method newChatMessage 
	 * @param {Number} uid The id of a user.
	 * @param {String} msg The message.
	 **/
	newChatMessage: function (uid, msg) {
		var userID = uid.split("|@|")[0];
		var userName = uid.split("|@|")[1];
		
		var chat_user = $("<span class='user' style='color:" + this.assigned_colors[userID] + "'>" + userName+ "</span>")
		msg = decodeURIComponent(msg);
	   	var chat_message = $("<span class='message'>" + msg + "</span>");
	   	var chat_timestamp = $("<span class='timestamp'>(" + this.getClockTime() + ")</span>");
	
	   	var chat_line = $("<div class='chat_message unread'></div>");
	   	chat_line.append(chat_user);
	   	chat_line.append(chat_message);
	   	chat_line.append(chat_timestamp);
	
	    $("#"+this.project_id+" .chatMessageContainer").append(chat_line)
	    //TODO: set focus on last line added
	    $("#"+this.project_id+" .chatMessageContainer").attr({ scrollTop: $("#"+this.project_id+" .chatMessageContainer").attr("scrollHeight") });
		
	    this.updating_process_running = false;
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method getClockTime 
	 **/
	getClockTime: function () {
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