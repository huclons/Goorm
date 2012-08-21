/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.theme.details = function () {
	this.dialog = null;
	this.buttons = null;
};

org.goorm.core.theme.details.prototype = {
	init: function () {
		var self = this;
				
		var handle_delete = function() { 
			this.hide(); 
		};

		var handle_cancel = function() { 
			this.hide(); 
		};
		
		this.buttons = [ {text:"Delete", handler:handle_delete, isDefault:true},
						 {text:"Cancel",  handler:handle_cancel}]; 
						 
		this.dialog = new org.goorm.core.theme.details.dialog();
		this.dialog.init({
			title:"Theme Details", 
			path:"configs/dialogs/org.goorm.core.theme/theme.details.html",
			width:1000,
			height:700,
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
		
		this.project_list = new org.goorm.core.project.list;		
	},
	
	show: function () {
		console.log("show!!!");
		/* 		this.project_list.init("#project_delete"); */
		this.dialog.panel.show();
	}
};