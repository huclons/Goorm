/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.file._new.other = function () {
	this.dialog = null;
	this.buttons = null;
	this.is_new_anyway = null;
};

org.goorm.core.file._new.other.prototype = {
	init: function () {
		
		var self = this;
				
		var handle_create = function() { 
			
			if($("#new_other_file_new_input").val() == "") {
				alert.show(core.module.localization.msg["alertFileNameEmpty"]);
				return false;
			}
			
			var temp_filepath = $("#new_other_file_current_path").text();
			var temp_filename = $("#new_other_file_new_input").val();

			$.ajax({
				url: "file/get_contents",			
				type: "GET",
				data: { path: "../../project/"+temp_filepath+temp_filename},
				success: function(data) {
					if (data!=0 && !self.is_new_anyway) {
						confirmation.init({
							title: core.module.localization.msg["confirmationNewOtherTitle"], 
							message: core.module.localization.msg["confirmationNewOtherMessage"],
							yes_text: core.module.localization.msg["confirmation_yes"],
							no_text: core.module.localization.msg["confirmation_no"],
							yes: function () {
								self.is_new_anyway = true;
								handle_create();
							}, no: function () {
							}
						});
						
						confirmation.panel.show();
						return false;
					}
					
					var postdata = {
						url: $("#new_other_file_list").find(".selected_button").attr("url"),
						new_other_file_new_input: $("#new_other_file_current_path").text()+$("#new_other_file_new_input").val()
					};
													
					$.post("file/new", postdata, function (data) {

						var received_data = eval("("+data+")");
		
						if(received_data.errCode==0) {
						
							var window_manager = core.module.layout.workspace.window_manager;
							
							temp_filepath = "../../project/"+temp_filepath;
							temp_filepath = temp_filepath.replace("//", "/");
							
							for (var i = 0; i < window_manager.index; i++) {
								var window_filename = window_manager.window[i].filename;
								var window_filepath = window_manager.window[i].filepath;
								window_filepath = window_filepath + "/";
								window_filepath = window_filepath.replace("//", "/");
								
								if( window_manager.window[i].alive && window_filename == temp_filename && window_filepath == temp_filepath) {
									window_manager.window[i].close();
								}
							}
							
							var temp_type = temp_filename;
							temp_type = temp_type.split(".");
							temp_type = temp_type[1];

							core.module.layout.workspace.window_manager.open(temp_filepath, temp_filename, temp_type);
							core.module.layout.project_explorer.refresh();
						}
						else {
							alert.show(core.module.localization.msg["alertError"] + received_data.message);
						}
						self.dialog.panel.hide(); 
					});
				}
			});
		};

		var handle_cancel = function() { 
			this.hide(); 
		};
		
		this.buttons = [ {text:"Create", handler:handle_create, isDefault:true},
						 {text:"Cancel",  handler:handle_cancel}]; 
						 
		this.dialog = new org.goorm.core.file._new.other.dialog();
		this.dialog.init({
			title:"New Other File", 
			path:"configs/dialogs/org.goorm.core.file/file._new.other.html",
			width:400,
			height:400,
			modal:false,
			buttons:this.buttons,
			success: function () {

			}
		});
		this.dialog = this.dialog.dialog;
		
		//this.dialog.panel.setBody("AA");
		

	},
	
	show: function (context) {
		var self = this;
	
		this.is_new_anyway = false;
	
		this.dialog.panel.show();

		$(".select_div").click(function() {
			$(".select_div").removeClass("selected_button");
			$(this).addClass("selected_button");
	
		});

		$("#new_other_file_current_path").empty();
		
		var temp_path = "";

		if (context) {
			var filename = (core.status.selected_file.split("/")).pop();
			var filepath = 	core.status.selected_file.replace(filename, "");
			
			temp_path = filepath;
			
			this.dialog.panel.show();
		}
		else {
			if (core.status.current_project_path=="./") {
				temp_path = "/";
			}
			else {
				temp_path = core.status.current_project_path+"/";
			}
			
			this.dialog.panel.show();
		}
		
		$("#new_other_file_current_path").width(temp_path.length*6);
		$("#new_other_file_new_input").width(305-(temp_path.length*6));
		
		$("#new_other_file_current_path").append(temp_path);
	}
};