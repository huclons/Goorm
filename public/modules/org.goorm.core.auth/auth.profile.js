
org.goorm.core.auth.profile = function () {
	this.dialog = null;
	this.buttons = null;
	
	this.target_id = null;
}

org.goorm.core.auth.profile.prototype = {
	init: function () {
		
		var self = this;
				
		var handle_settings = function() { 
			$('#goorm_profile_container').find('[name="profile_id_input"]').attr('disabled', 'disabled');
			$('#goorm_profile_container').find('[name="profile_name_input"]').removeAttr('readonly');
			$('#goorm_profile_container').find('[name="profile_nickname_input"]').removeAttr('readonly');
			$('#goorm_profile_container').find('[name="profile_email_input"]').removeAttr('readonly');
			$('#goorm_profile_container').find('[name="profile_type_input"]').attr('disabled', 'disabled');
			$('#goorm_profile_container').find('[name="profile_level_input"]').attr('disabled', 'disabled');
			
			$(self.dialog.buttons[0].htmlButton).hide();
			$(self.dialog.buttons[1].htmlButton).show();
		};

		var handle_modify = function() {
			confirmation.init({
				message: core.module.localization.msg["confirmation_modify_profile"],
				yes_text: core.module.localization.msg["confirmation_yes"],
				no_text: core.module.localization.msg["confirmation_no"],
				title: "Confirmation", 

				yes: function () {
					var type = $('#goorm_profile_container').find('[name="profile_type_input"]').val();
					if($('#goorm_profile_container').find('[name="profile_type_input"]').val() == 'Generic') type = 'password';
					
					var postdata = {
						'id' : $('#goorm_profile_container').find('[name="profile_id_input"]').val(),
						'name' : $('#goorm_profile_container').find('[name="profile_name_input"]').val(),
						'nick' : $('#goorm_profile_container').find('[name="profile_nickname_input"]').val(),
						'email' : $('#goorm_profile_container').find('[name="profile_email_input"]').val(),
						'type' : type
					}
					
					$.post('/user/set', postdata, function(result){
						if(result.type == 'set'){
							if(result.data) location.href = '/';
							else{
								
							}
						}
						else if(result.type == 'check'){
							if(!result.data.result) core.module.auth.signup.toast_error_message(result.data);
						}
					})
				}, no: function () {
				}
			});
			
			confirmation.panel.show();
		};

		var handle_cancel = function() { 
			var __self = this;
			$('#goorm_profile_container input').attr('readonly', 'readonly');
			$('#goorm_profile_container input').removeAttr('disabled');

			core.module.auth.get_info(function(result){
				if(!result) $(self.buttons[0].htmlButton).hide();
				else if(self.target_id == core.user.id) $(self.dialog.buttons[0].htmlButton).show();
				
				$(self.buttons[1].htmlButton).hide();
				__self.hide(); 
			});
		};
		
		this.buttons = [ {text:"<span localization_key='account_modify'>Settings</span>", handler:handle_settings, isDefault:true},
							{text:"<span localization_key='modify'>Modify</span>",  handler:handle_modify},
							{text:"<span localization_key='close'>Close</span>",  handler:handle_cancel}]; 
						 
		this.dialog = new org.goorm.core.auth.profile.dialog();
		this.dialog.init({
			localization_key:"title_profile",
			title:"Profile", 
			path:"configs/dialogs/org.goorm.core.auth/auth.profile.html",
			width:300,
			height:300,
			modal:true,
			buttons:this.buttons,
			success: function () {

			}
		});
		this.dialog = this.dialog.dialog;
	},
	
	set_content : function(target_id, target_type){
		var self = this;
		
		this.get_content(target_id, target_type, function(data){
			if (data && data.id != "" && data.id != undefined) {	
				var nickname = data.nick || data.nickname || "";
				
				$('[name="profile_id_input"]').val(data.id);
				$('[name="profile_name_input"]').val(data.name);
				$('[name="profile_nickname_input"]').val(nickname);
				$('[name="profile_email_input"]').val(data.email);
				if(data.type == 'password') data.type = 'Generic';
				$('[name="profile_type_input"]').val(data.type);
				$('[name="profile_level_input"]').val(data.level);
			}
			else if(localStorage['user'] && localStorage['user'] != ""){
				var user = JSON.parse(localStorage['user']);

				$('[name="profile_id_input"]').val(user.id);
				$('[name="profile_name_input"]').val(user.name);
				$('[name="profile_nickname_input"]').val(user.nick);
				$('[name="profile_email_input"]').val(user.email);
				if(user.type == 'password') user.type = 'Generic';
				$('[name="profile_type_input"]').val(user.type);
				$('[name="profile_level_input"]').val(user.level);
			}
			else{
				$('[name="profile_id_input"]').val("");
				$('[name="profile_name_input"]').val("");
				$('[name="profile_nickname_input"]').val("");
				$('[name="profile_email_input"]').val("");
				$('[name="profile_type_input"]').val("");
				$('[name="profile_level_input"]').val("");
			}
		});
	},
	
	get_content : function(target_id, target_type, callback){
		$.getJSON("auth/get_info", function (data){
			if(!$.isEmptyObject(data) && target_id != data.id){
				var postdata = {
					'id' : target_id,
					'type' : target_type
				}
				
				$.post('/user/get', postdata, function(other_user_data){
					callback(other_user_data);
				});
			}
			else{
				callback(data);
			}
		});
	},
	
	show : function(target_id, target_type){
		var self = this;
		this.target_id = target_id;
		
		core.module.auth.get_info(function(result){
			$(self.buttons[0].htmlButton).show();
			if(!result || core.user.id != target_id) $(self.buttons[0].htmlButton).hide();
			$(self.buttons[1].htmlButton).hide();
	
			self.set_content(target_id, target_type);
			self.dialog.panel.show();
		});
	}
}