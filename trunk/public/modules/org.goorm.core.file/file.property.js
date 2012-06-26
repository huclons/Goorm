/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.file.property = function () {
	this.dialog = null;
	this.buttons = null;
	this.tabview = null;
	this.treeview = null;
};

org.goorm.core.file.property.prototype = {
	init: function () { 
		
		var handle_ok = function() { 
			
			this.hide(); 
		};

		var handle_cancel = function() { 
			
			this.hide(); 
		};
		
		this.buttons = [ {text:"OK", handler:handle_ok, isDefault:true},
						 {text:"Cancel",  handler:handle_cancel}]; 
		
		
		this.dialog = new org.goorm.core.file.property.dialog();
		this.dialog.init({
			title:"Property", 
			path:"configs/dialogs/org.goorm.core.file/file.property.html",
			width:480,
			height:500,
			modal:true,
			buttons:this.buttons,
			success: function () {
				//TabView Init
				self.tabview = new YAHOO.widget.TabView('property_file_contents');
			}
		});
		this.dialog = this.dialog.dialog;
		
		//this.dialog.panel.setBody("AA");
	},

	show: function () {
		if(core.status.selected_file != null){
			this.dialog.panel.show();
			var filename = (core.status.selected_file.split("/")).pop();
			var fileType = (filename.split(".")).pop();
			var fileLocation = core.status.selected_file.split("../../project/").pop();
			var url = "file/get_property";
			
			$.ajax({
				url: url,		
				type: "POST",
				data: "path="+core.status.selected_file,
				async:false,
				success: function(data) {
					var stat = YAHOO.lang.JSON.parse(data);
					if(stat['dir']) fileType="dir";
					if(stat['size']==null) stat['size']=0;
					$("#property_file_contents #filename").html(filename);
					$("#property_file_contents #fileType").html(fileType);
					$("#property_file_contents #fileLocation").html(fileLocation);
					$("#property_file_contents #fileSize").html(stat['size']+" byte");
					$("#property_file_contents #aTime").html(stat['atime']);
					$("#property_file_contents #mTime").html(stat['mtime']);
				}
				, error: function(xhr, status, error) {alert.show(core.module.localization.msg["alertError"] + error);}
			});
		}
		else {
			alert.show(core.module.localization.msg["alertFileNotSelect"]);
		}
	}	
};