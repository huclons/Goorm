/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

org.goorm.core.project._delete = {
	dialog: null,
	buttons: null,
	chat: null,
	project_list: null,	

	init: function () {
		
		var self = this;
				
		var handle_delete = function() { 

			var data = self.project_list.get_data();

			// project delete
			if (data.path=="") {
				// alert.show("Project is not selected");
				alert.show(core.module.localization.msg['project_not_selected']);
				return false;
			}

			var postdata = {
				project_path: data.path
			};

			$.get("project/delete", postdata, function (data) {
				var received_data = data;
				
				if(received_data.err_code==0) {
					// notice.show("Project is deleted.");
					notice.show(core.module.localization.msg['notice_project_delete_done']);
					if ( postdata.project_path == core.status.current_project_path ) {

						core.module.layout.communication.leave();

						core.status.current_project_path = "";
						core.status.current_project_name = "";
						core.status.current_project_type = "";
						core.dialog.open_project.open("","","");
						
						
					}
					
					$(core.module.layout.workspace.window_manager.window).each(function (i) {
						if (postdata.project_path == this.project) {
							this.close();
						}
					});
				}
				else {
					//alert.show(core.module.localization.msg["alert_error"] + received_data.message);
					alert.show(core.module.localization['alert_cannot_project_delete']);
				}
				
				if(core.status.current_project_path == "" || core.status.current_project_path == data.path){
					core.module.layout.project_explorer.refresh();
					core.dialog.project_property.refresh_toolbox();
				}
				else{
					core.module.layout.project_explorer.refresh_project_selectbox();
				}
			});
			
			this.hide(); 
		};

		var handle_cancel = function() { 
			
			this.hide(); 
		};
		
		this.buttons = [ {text:"<span localization_key='delete'>Delete</span>", handler:handle_delete, isDefault:true},
						 {text:"<span localization_key='cancel'>Cancel</span>",  handler:handle_cancel}]; 
						 
		this.dialog = org.goorm.core.project._delete.dialog;
		this.dialog.init({
			localization_key:"title_delete_project",
			title:"Delete Project", 
			path:"configs/dialogs/org.goorm.core.project/project._delete.html",
			width:800,
			height:500,
			modal:true,
			buttons:this.buttons,
			success: function () {
				var resize = new YAHOO.util.Resize("project_delete_dialog_left", {
		            handles: ['r'],
		            minWidth: 250,
		            maxWidth: 400
		        });
				
		        resize.on('resize', function(ev) {
					var width = $("#project_delete_dialog_middle").width();
		            var w = ev.width;
		            $("#project_delete_dialog_center").css('width', (width - w - 9) + 'px');
		        });
			}
		});
		this.dialog = this.dialog.dialog;
		
		this.project_list = new org.goorm.core.project.list();		
	},
	
	show: function (list_callback) {
		this.project_list.init("#project_delete", list_callback);
		this.dialog.panel.show();
	}
};