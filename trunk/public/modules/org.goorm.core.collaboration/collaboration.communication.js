/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

org.goorm.core.collaboration.communication = {
	userID: 0,
	userName: null,
	socket: null,
	predefined_colors: null,
  	assigned_colors: null,
  	updating_process_running: false,
  	update_queue: [],
  	project_id: null,
  	is_chat_on: null,
  	timer: null,
  	whisper_saved :null,
  	whisper_up :false,
  	socket: null,
  	context_menu: [],
  	notification: null,
  	
  	selected_user: null,
  	user_list: [],
  	message_state: null,
  	message_interface_data: {},

	init: function (target) {
		var self = this;
		this.target = target;
		self.user_num = 0;

		$(core).bind('goorm_login_complete', function(){
			self.socket =    (org.goorm.core.collaboration.communication.socket == null) ? 
							(org.goorm.core.collaboration.communication.socket = io.connect()) :
			 				org.goorm.core.collaboration.communication.socket;

	 		self.socket.on("communication_message", function (message_data) {
	 			var data = message_data.message;
	 			var msg_workspace = message_data.workspace;

	 			if(msg_workspace != core.status.current_project_path) return;

	 			data = decodeURIComponent(data);
				
				data = ((data.replace(/&/g, '&amp;')).replace(/\"/g, '&quot;')).replace(/\'/g, '&#39;'); 
				data = data.replace(/</g, '&lt;').replace(/>/g, '&gt;');
				
				self.notification.notify(data);
				
	 			$("#" + self.target).find(".communication_message_container").append("<div class='communication_message_content'>" + data + "</div>");
	 			var room = $("#" + self.target).find(".communication_message_container");
	 			//$(room).scrollTop(room.height());
	 			if ( typeof(max_scroll) == "undefined" ) {
	 				max_scroll = $(".communication_message_container").scrollTop();
	 			} else {
		 			max_scroll = ($(".communication_message_container").scrollTop() > max_scroll) ? $(".communication_message_container").scrollTop() : max_scroll;
	 			}

	 			$(".communication_message_container").scrollTop(max_scroll+300);
	 			if(core.module.layout.inner_layout.getUnitByPosition("right")._collapsed){
	 				self.notification.show();
	 			}
	 			else if($('#goorm_inner_layout_right .selected span').attr('localization_key') != 'communication'){
	 				//$('#goorm_inner_layout_right').find('[localization_key="communication"]').addClass("glowing");
	 			}
	 		});

	 		self.socket.on("communication_whisper_message", function(message_data) {
	 			var data = message_data.message;
	 			data = decodeURIComponent(data);
	 			
				data = ((data.replace(/&/g, '&amp;')).replace(/\"/g, '&quot;')).replace(/\'/g, '&#39;'); 
				data = data.replace(/</g, '&lt;').replace(/>/g, '&gt;');
				
				self.notification.notify(data);
				
	 			$("#" + self.target).find(".communication_message_container").append("<div class='communication_message_content'>" + data + "</div>");
	 			var room = $("#" + self.target).find(".communication_message_container");
	 			//$(room).scrollTop(room.height());
	 			if ( typeof(max_scroll) == "undefined" ) {
	 				max_scroll = $(".communication_message_container").scrollTop();
	 			} else {
		 			max_scroll = ($(".communication_message_container").scrollTop() > max_scroll) ? $(".communication_message_container").scrollTop() : max_scroll;
	 			}

	 			$(".communication_message_container").scrollTop(max_scroll+300);
	 			if(core.module.layout.inner_layout.getUnitByPosition("right")._collapsed){
	 				self.notification.show();
	 			}
	 			else if($('#goorm_inner_layout_right .selected span').attr('localization_key') != 'communication'){
	 				//$('#goorm_inner_layout_right').find('[localization_key="communication"]').addClass("glowing");
	 			}
	 		});

	 		//save user colors
			self.boxcolors = {};
			
			var remove_context_menu = function(data,callback){
				for(var i = (self.context_menu.length-1) ; i>= 0 ; i--){
					
					if(self.context_menu[i] && self.context_menu[i].remove){
						self.context_menu[i].remove();
						//delete self.context_menu[i];
						self.context_menu.pop();
					}
				}
				callback(data);
			};

			var check_duplication =  function(userid,callback){
				if(self.user_list.length>0 && userid != core.user.id)
					for(var i=0;i<self.user_list.length;i++){
						var data = JSON.parse(self.user_list[i]);
						if(data.user == userid){
							callback(false);
							return;
						}else if(i == (self.user_list.length-1)){
							callback(true);
							return;
						}
					}
				else{
					callback(true);
				}
				
			};

	 		self.socket.on("communication_someone_joined", function (data) {
	 			
				data = JSON.parse(data);
	 			if(data.workspace != core.status.current_project_path) return;
	 			check_duplication(data.user,function(result){
	 				if(!result)	return;
	 				self.user_list = data.list;
		 			var user_data = {'user':data.user,'nick':data.nick, 'type': data.type};
		 			var item_id = "communication_user_item"+self.user_num;
		 			
			 		var user_item = self.get_user_item(user_data, item_id);
			 		$("#" + self.target).find(".communication_user_container").append(user_item);
			 		
			 		if(user_data.user == core.user.id){
			 			remove_context_menu(data, function(data){
			 				self.user_num = 0;
	 						$("#" + self.target).find(".communication_user_container").empty();
				 			//self.user_num++;
		 					$('.communication_user_container [user_id="'+core.user.id+'"]').find('.context_menu_button').hide()
				 			
				 			for(var i=0; i<data.list.length; i++){
				 				(function(it,user_num){
					 				var inner_user_data = JSON.parse(data.list[it]);
					 				var item_id = "communication_user_item"+user_num;
					 				var user_item = self.get_user_item(inner_user_data, item_id); 				
					 				$("#" + self.target).find(".communication_user_container").append(user_item);
					 				self.set_box_color(inner_user_data);

					 				if(inner_user_data.user == core.user.id){
					 					$('.communication_user_container [user_id="'+core.user.id+'"]').find('.context_menu_button').hide();
					 				}
					 				else{
						 				// var user_item = $("#communication .communication_user_item[user_nick='" + data.nick +  "']");
										self.attach_context_menu(user_num, '#'+item_id);
					 				}

					 				
				 				})(i,self.user_num++)
				 			}
			 			});
	 				}
	 				else{
		 				self.attach_context_menu(self.user_num, '#'+item_id);
		 				self.set_box_color(user_data);
		 				self.user_num++;
	 				}
			 		self.set_box_color(user_data);
		 			
		 			$("#" + self.target).find(".communication_message_container").append("<div>" + data.nick + " "+core.module.localization.msg['alert_collaboration_communication_join']+"</div>");
		 			var room = $("#" + self.target).find(".communication_message_container");
		 			//$(room).scrollTop(room.height());
		 			if ( typeof(max_scroll) == "undefined" ) {
		 				max_scroll = $(".communication_message_container").scrollTop();
		 			} else {
			 			max_scroll = ($(".communication_message_container").scrollTop() > max_scroll) ? $(".communication_message_container").scrollTop() : max_scroll;
		 			}

		 			$(".communication_message_container").scrollTop(max_scroll+300);
	 			});
	 			
	 		});
	 		
	 		self.socket.on("communication_someone_leaved", function (data) {
	 			data = JSON.parse(data);
	 			if(data.workspace != core.status.current_project_path) return;
	 			if(data.user != core.user.id){
	 				(function(){
		 				var user = $('.communication_user_container [user_id="'+data.user+'"]');
		 				var user_id = data.user;
		 				var index = user.attr('index');
		 				var user_list;
		 				self.context_menu[index].remove();
						delete self.context_menu[index];
						//self.context_menu[index] = undefined;
						user.remove();
						for(var i = 0 ; i < self.user_list.length; i++){
							user_list = JSON.parse(self.user_list[i]);
							if(user_list&&user_list.user == user_id){

								self.user_list.splice(i,1);
							}
						}
						$("#" + self.target).find(".communication_message_container").append("<div>" + data.nick + " "+core.module.localization.msg['alert_collaboration_communication_leave']+"</div>");
						var room = $("#" + self.target).find(".communication_message_container");
			 			//$(room).scrollTop(room.height());
			 			if ( typeof(max_scroll) == "undefined" ) {
			 				max_scroll = $(".communication_message_container").scrollTop();
			 			} else {
				 			max_scroll = ($(".communication_message_container").scrollTop() > max_scroll) ? $(".communication_message_container").scrollTop() : max_scroll;
			 			}

			 			$(".communication_message_container").scrollTop(max_scroll+300);
						
					})();
	 			}
	 			else{
	 				remove_context_menu(data, function(data){
	 					self.user_num = 0;
	 					$("#" + self.target).find(".communication_user_container").empty();
	 				});
	 			}
	 			delete self.boxcolors[data.nick];	 			
	 		});

	 		self.socket.on('disconnect', function() {
	 			self.leave();
	 		});

	 		///////////////////////////////////////////////////////////////////
	 		//for firefox
	 		///////////////////////////////////////////////////////////////////
	 		self.socket.on('logout_disconnect',function(){
	 			self.leave();
	 		});
	 		
	 		$(window).unload(function() {
	 			self.leave();
	 			self.socket.disconnect();
	 		});
		})
 		
 		$("#" + target).append("<div class='communication_toolbar'></div>")
		$("#" + target).append("<div class='communication_user_container'>User </div>");
		$("#" + target).append("<div class='communication_message_container'></div>");
		$("#" + target).append("<div class='communication_message_input_container'><input id='input_chat_message' placeholder='Type your message...' style='width:90%;' /></div>");
		$("#" + target +' .communication_message_input_container').append("<div class='communication_message_social_area'></div>");
		
		$("#" + target + " #input_chat_message").keyup(function(evt){
			self.message_interface($(this).val(), evt);
		});
		
		$("#" + target + " #input_chat_message").keypress(function(evt){
			if((evt.keyCode || evt.which) == 13){
				evt.preventDefault();
				if(self.whisper_saved!=null&& ($(this).val().substr(0,JSON.parse(self.whisper_saved).nick.length+3) == '[@'+JSON.parse(self.whisper_saved).nick+']')&& self.whisper_up!=false){
				self.message_process($(this).val());
				$(this).val('[@'+JSON.parse(self.whisper_saved).nick+']');

				}else{
						self.message_process($(this).val());
						$(this).val("");
						self.whisper_up=false;
					}
		}
		});
		$("#" + target + " #input_chat_message").keydown(function(evt){
			
			if(evt.which==38){

				function set_cursor(id, position){
					var element = $(id)[0];

					if(element){
						setTimeout(function(){
							element.setSelectionRange(position, position);
						}, 10)
					}
				}

				if(self.whisper_saved!=null){
					var target_user = self.whisper_saved;
					self.message_state = 'whisper';
					self.whisper_up=true;
					
					self.message_interface_data['whisper'] = {
						'target_user' : target_user
					}
			
					$("#" + self.target + " #input_chat_message").val('[@'+JSON.parse(self.whisper_saved).nick+'] ')
					set_cursor("#" + self.target + " #input_chat_message", $("#" + self.target + " #input_chat_message").val().length);

					$("#" + self.target + " #input_chat_message").focus();
				}
			}else if(evt.which==40){
				self.whisper_up=false;

				$(this).val("");

			}
		});
		
		$(core).bind("layout_resized", function () {
			var layout_right_height = $(".yui-layout-unit-right").find(".yui-layout-wrap").height() - 25;
			$("#goorm_inner_layout_right").find(".communication_message_container").height(layout_right_height - 195);
		});
 		 		 		
 		$(document).on({
 			mouseenter : function(){
 				$(this).addClass('communication_user_select')
 			},
 			mouseleave : function(){
 				$(this).removeClass('communication_user_select')
 			}
 		}, ".communication_user_item")
 		
 		this.notification = org.goorm.core.collaboration.notification;
 		this.notification.init();
	},
	
	clear: function () {
		$("#" + this.target).find(".communication_user_container").empty();
		$("#" + this.target).find(".communication_message_container").empty();
	},
	
	join: function () {
		if(core.user.id != null)
			this.socket.emit("join", '{"channel": "workspace", "group":"'+ core.user.group +'", "action":"join_workspace", "user":"' + core.user.id + '", "nick":"'+core.user.nick+'", "type":"'+core.user.type+'", "workspace":"'+ core.status.current_project_path +'", "message":"hello"}');
	},
	
	leave: function () {
		this.socket.emit("leave", '{"channel": "workspace", "action":"leave_workspace", "user":"' + core.user.id + '", "nick":"'+core.user.nick+'", "type":"'+core.user.type+'", "workspace":"'+ core.status.current_project_path +'", "message":"goodbye"}');
		this.clear();
	},
	
	resize: function () {
		
	},
	
	set_box_color : function(user_data){
		var self = this;

		if(self.boxcolors[user_data.user]){	// box color cached?
			$("#communication .communication_user_item[user_id='" + user_data.user +  "'] .communication_user_item_color_box").css("background-color", self.boxcolors[user_data.user].light_color);
			$("#communication .communication_user_item[user_id='" + user_data.user +  "'] .communication_user_item_color_box").css("border-color", self.boxcolors[user_data.user].color);
		}else{
			// moved from public/modules/org.goorm.core.collaboration/collaboration.editing.js > set_cursor()
			// these color will be reused to make collaborator's cursor color.
			// @author : roland87
			var red = Math.floor(Math.random()*206) - Math.floor(Math.random()*30);
			var green = Math.floor(Math.random()*206) - Math.floor(Math.random()*30);
			var blue = Math.floor(Math.random()*206) - Math.floor(Math.random()*30);
			
			var light_red = (red + 90 >= 255)? 255 : red + 90;
			var light_green = (red + 90 >= 255)? 255 : green + 90;
			var light_blue = (red + 90 >= 255)? 255 : blue + 90;
			
			var color = '#' + red.toString(16) + green.toString(16) + blue.toString(16);
			var light_color = '#' + light_red.toString(16) + light_green.toString(16) + light_blue.toString(16);
			$("#communication .communication_user_item[user_id='" + user_data.user +  "'] .communication_user_item_color_box").css("background-color", light_color);
			$("#communication .communication_user_item[user_id='" + user_data.user +  "'] .communication_user_item_color_box").css("border-color", color);

			self.boxcolors[user_data.user] = {light_color: light_color, color: color};
		}
	},

	set_chat_on: function () {
		
	},
	
	set_chat_off: function () {
		
		var self = this;
		
 		this.stop_listening();
 		this.is_chat_on = 0;
 		
 		return false;
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
	},
	
	get_user_item : function(user_data, item_id){
		var index = item_id.replace("communication_user_item", "")
		var user_class = (index == '0') ? 'communication_user_item_context_button communication_user_item_context_button_first' : 'communication_user_item_context_button';
		var user_item = "";
		user_item	+=	'<div id="'+item_id+'" class="communication_user_item" user_id="'+user_data.user+'" user_type="'+user_data.type+'" user_nick="'+user_data.nick+'" index="'+index+'">';
		user_item	+=		'<div class="communication_user_item_color_box"/>';
		user_item	+=		'<div class="'+user_class+'">';
		user_item 	+=			'<img src="/images/icons/context/bottomarr.png" class="context_menu_button">'
		user_item 	+=		'</div>';
		user_item	+=		'<span class="communication_user_item_user_data">'+user_data.nick+'</span>';
		user_item	+=	'</div>';
		return user_item;
	},
	
	attach_context_menu : function(i, trigger){
		var self = this;

		var 	timestamp = (new Date()).getTime();
		this.context_menu[i] = new org.goorm.core.menu.context();
		this.context_menu[i].init("configs/menu/org.goorm.core.collaboration/collaboration.communication.user.html", "user.context", $(trigger), timestamp, null, function(){
			$("a[action=account_profile_context]").unbind("click");
			$("a[action=account_profile_context]").click(function(e) {
				var user = core.module.layout.communication.selected_user;
				if(user){
					var index = user.index;

					core.module.auth.show_profile(user.id, user.type);
					self.context_menu[index].hide();
				}
			});
			
			$("a[action=account_user_whisper]").unbind("click");
			$("a[action=account_user_whisper]").click(function(e) {
				var communication = core.module.layout.communication;
				var user = communication.selected_user;
				
				if(user){
					var index = user.index;
					var target_user = '{"user":"'+user.id+'", "nick":"'+user.nick+'", "type":"'+user.type+'"}';
					
					communication.message_state = 'whisper';
					communication.whisper_saved=target_user;
					communication.message_interface_data['whisper'] = {
						'target_user' : target_user
					}
					$("#" + communication.target + " #input_chat_message").val('[@'+user.nick+'] ')
					$("#" + communication.target + " #input_chat_message").focus();
	
					self.context_menu[i].hide();
				}
			});/*
			$("a[action=account_user_whisper]").click(function(e) {
				var communication = core.module.layout.communication;
				var user = communication.selected_user;
				if(user){
					var target_user = '{"user":"'+user.id+'", "nick":"'+user.nick+'", "type":"'+user.type+'"}';
					
					communication.message_state = 'whisper';
					whisper_saved=target_user;
					communication.message_interface_data['whisper'] = {
						'target_user' : target_user
					}
					$("#" + communication.target + " #input_chat_message").val('[@'+user.nick+'] ')
					$("#" + communication.target + " #input_chat_message").focus();
				}
				self.context_menu[i].hide();
			});*/

			if(self.context_menu[i].menu){
				self.context_menu[i].menu.subscribe('beforeShow', function(){
					var user_id = $('.communication_user_select').attr('user_id');
					var user_nick = $('.communication_user_select').attr('user_nick')
					var user_type = $('.communication_user_select').attr('user_type')
					var context_index = $('.communication_user_select').attr('index');

					self.selected_user = {
						'id' : user_id,
						'nick' : user_nick,
						'type' : user_type,
						'index' : context_index
					};
				}, null, null)
				
				self.context_menu[i].menu.subscribe('hide', function(){
					self.selected_user = null;
				}, null, null);
			}
			
			$('.communication_user_item_context_button').unbind('click')
			$('.communication_user_item_context_button').click(function(e){
				var parent = $(this).parent();
				var offset = $(this).offset();
				var index = $(parent).attr('index');
				parent.addClass('communication_user_select');
				self.context_menu[index].menu.cfg.setProperty('x', offset.left)
				self.context_menu[index].menu.cfg.setProperty('y', offset.top)
				
				self.context_menu[index].menu.show();
			});
			
			core.module.localization.refresh()
		});
	},
	
	message_interface : function(message, evt){
		var self = this;
		
		function get_user_index(target, type){
			var user_list = self.user_list;
			self.user_number = user_list.length;
			for(var i=0; i<user_list.length; i++){
				var data = JSON.parse(user_list[i]);
				if(data[type] == target){
					return i;
				}
			}
			
			return -1;
		}
		
		if(message == ""){
			this.message_state = null;
			this.message_interface_data = {};
		}
		else if(message[0] == '/'){
			switch(message[1]){
				case 'w':
					self.message_state = 'whisper';
					break;
				
				default:
					self.message_state = null;
					break;
			}
		}
		
		if(self.message_state){
			if(self.message_state == 'whisper'){
				if((evt.keyCode || evt.which) == 32){ // space key
					var messages = message.split(' ');
					var user_index = get_user_index(messages[1], 'user')
					
					if(messages.length == 3 && ( user_index != -1)){
						self.message_interface_data['whisper'] = {
							'target_user' : self.user_list[user_index]
						}
						
						self.whisper_saved = self.user_list[user_index];
						$("#" + self.target + " #input_chat_message").val('[@'+messages[1]+'] ');
					}
				}
			}
		}
	},
	
	message_process : function(message){
		var self = this;
		
		if (self.socket.socket.connected) {
			if(self.message_state){
				if(self.message_state == 'whisper' && message.indexOf(']') != -1){
					var sessionid = self.socket.socket.sessionid;
					var message = message.substring(message.indexOf(']')+1)
					var encodedMsg = encodeURIComponent(message);
					if(message&&message.trim()!=""){
					self.socket.emit("message", '{"channel": "communication", "action":"send_whisper_message", "user":"' + core.user.id + '", "nick":"'+core.user.nick+'", "workspace": "'+ core.status.current_project_path +'", "message":"' + encodedMsg + '", "sessionid":"'+sessionid+'", "target_user":'+JSON.stringify(self.message_interface_data['whisper'].target_user)+'}');
					}
				}
				else{
					self.message_state = null;
					self.message_process(message);
				}
			}
			else{
				//message encoding to UTF-8
				var encodedMsg = encodeURIComponent(message);
				if(encodedMsg&&message.trim()!=""&&encodedMsg.trim()!=""){
				self.socket.emit("message", '{"channel": "communication", "action":"send_message", "user":"' + core.user.id + '", "nick":"'+core.user.nick+'", "workspace": "'+ core.status.current_project_path +'", "message":"' + encodedMsg + '"}');
			}
			}
		}
		else {
			alert.show(core.module.localization.msg['alert_collaboration_server_notconnected']);
		}
	}
};