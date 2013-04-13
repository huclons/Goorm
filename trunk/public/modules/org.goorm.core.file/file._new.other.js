/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

org.goorm.core.file._new.other = {
	dialog: null,
	buttons: null,

	init: function () {
		var self = this;
		
		var handle_ok = function() {
			var file_type = $("#new_other_file_list .selected_div").attr("value");
			
			if(core.status.current_project_path==""){
				alert.show(core.module.localization.msg['alert_deny_make_file_in_workspace_root']);
				return;
			}

			var postdata = {
				current_path: core.status.current_project_path,
				file_name: $("#new_other_file_target").val()+"."+file_type
			};


			if(postdata.file_name=="") {
				alert.show(core.module.localization.msg["alert_filename_empty"]);
				// alert.show("File name is empty. Please fill it...");
				return false;
			}

			$.get("file/new_other", postdata, function (data) {
				if (data.err_code==0) {
					core.module.layout.project_explorer.refresh();
					self.dialog.panel.hide();
				}
				else if(data.err_code == 20) {
					alert.show(core.module.localization.msg[data.message]);

				}
				else {
					alert.show(data.message);
				}
			});
		};

		var handle_cancel = function() { 
			
			this.hide(); 
		};
		
		this.buttons = [ {text:"<span localization_key='ok'>OK</span>", handler:handle_ok, isDefault:true},
						 {text:"<span localization_key='cancel'>Cancel</span>",  handler:handle_cancel}]; 
						 
		this.dialog = org.goorm.core.file._new.other.dialog;
		this.dialog.init({
			localization_key:"title_new_other_file",
			title:"New Other File", 
			path:"configs/dialogs/org.goorm.core.file/file._new.other.html",
			width:400,
			height:400,
			modal:false,
			buttons:this.buttons,
			success: function () {
				$("#new_other_file_list .select_div").click(function() {
					$(".select_div").removeClass("selected_div");
					$(this).addClass("selected_div");
				});
			}
		});
		this.dialog = this.dialog.dialog;
		
	},
	
	show: function (context) {
		var self = this;
		$("#new_other_file_current_path").text(core.status.current_project_path+" /");
		$("#new_other_file_target").val("");
		
		this.dialog.panel.show();
	}	
};