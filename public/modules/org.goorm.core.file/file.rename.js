/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.file.rename = function () {
	this.dialog = null;
	this.buttons = null;
	this.tabview = null;
	this.treeview = null;
	this.is_alive_window = null;
};

org.goorm.core.file.rename.prototype = {
	init: function () { 
		
		var self = this;
		
		var handle_ok = function() { 
		
			if ($("#input_rename_new_filename").attr("value")=="") {
				alert.show(core.module.localization.msg["alertFileNameEmpty"]);
				return false;
			}
		
			var postdata = {
				selected_filepath: $("#input_rename_old_filepath").attr("value"),
				selected_filename: $("#input_rename_old_filename").attr("value"),
				input_filename: $("#input_rename_new_filename").attr("value")
			};
									
			$.post("module/org.goorm.core.file/file.rename.php", postdata, function (data) {
				var received_data = eval("("+data+")");
								
				if(received_data.errCode==0) {
					if(self.is_alive_window) {
						var window_manager = core.module.layout.workspace.window_manager;
						var filetype = window_manager.window[window_manager.active_window].filetype;
						
						window_manager.window[window_manager.active_window].close();
						window_manager.open(postdata.selected_filepath, postdata.input_filename, filetype);						
					}
					
					core.module.layout.project_explorer.refresh();
				}
				else {
					alert.show(core.module.localization.msg["alertError"] + received_data.message);
				}
			});
			this.hide(); 
		};

		var handle_cancel = function() { 
			this.hide(); 
		};
		
		this.buttons = [ {text:"OK", handler:handle_ok, isDefault:true},
						 {text:"Cancel",  handler:handle_cancel}]; 
		
		this.dialog = new org.goorm.core.file.rename.dialog();
		this.dialog.init({
			title:"Rename", 
			path:"configs/dialogs/org.goorm.core.file/file.rename.html",
			width:450,
			height:120,
			modal:true,
			buttons:this.buttons,
			success: function () {
			}
		});
		this.dialog = this.dialog.dialog;
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method show 
	 **/
	show: function (context) {
		var self = this;
		
		self.is_alive_window = false;	

		if (context) {
			var filename = (core.status.selected_file.split("/")).pop();
			var filepath = 	core.status.selected_file.replace(filename, "");
			filepath = filepath.replace("//", "/");
			
			$("#input_rename_new_filename").attr("value", filename);
			$("#input_rename_old_filepath").attr("value", filepath);
			$("#input_rename_old_filename").attr("value", filename);
			
			var window_manager = core.module.layout.workspace.window_manager;
			
			for (var i = 0; i < window_manager.index; i++) {
				var window_filename = window_manager.window[i].filename;
				var window_filepath = window_manager.window[i].filepath;
				window_filepath = window_filepath + "/";
				window_filepath = window_filepath.replace("//", "/");				
			
				if( window_manager.window[i].alive && window_filename == filename && window_filepath == filepath) {
					self.is_alive_window = true;
				}
			}
			
			this.dialog.panel.show();
		}
		else {	
			for (var i = 0; i < core.module.layout.workspace.window_manager.index; i++) {
				if(core.module.layout.workspace.window_manager.window[i].alive) {
					self.is_alive_window = true;
				}
			}
		
			if(self.is_alive_window) {
				$("#input_rename_new_filename").attr("value", core.module.layout.workspace.window_manager.window[core.module.layout.workspace.window_manager.active_window].filename);
				$("#input_rename_old_filepath").attr("value", core.module.layout.workspace.window_manager.window[core.module.layout.workspace.window_manager.active_window].filepath);
				$("#input_rename_old_filename").attr("value", core.module.layout.workspace.window_manager.window[core.module.layout.workspace.window_manager.active_window].filename);
				
				this.dialog.panel.show();
			}
		}
	}	
};