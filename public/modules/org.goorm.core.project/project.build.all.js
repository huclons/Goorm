/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.project.build.all = function () {
	this.dialog = null;
	this.buttons = null;

};

org.goorm.core.project.build.all.prototype = {
	init: function () {
		
		var self = this;
				
		var handle_open = function() {
			var obj = {}; 
			$("#build_all_list input[type=hidden]").each(function(){
				var status = $(this).parent().find(".buildStatus");
				obj[$(this).attr("name")] = status;
				status.html("<img src='./images/org.goorm.core.utility/loading.gif' width='16' height='16' align='top'>building");
				core.module.plugin_manager.plugins["org.goorm.plugin."+$(this).attr("projectType")].build($(this).attr("name"),$(this).attr("project_path"),function(){
					status.html("<img src='./images/org.goorm.core.dialog/dialog_notice.png' width='16' height='16' align='top'>complete");
				});
			});
		};

		var handle_cancel = function() { 
			this.hide(); 
		};
		
		this.buttons = [ {text:"Build", handler:handle_open, isDefault:true},
						 {text:"Cancel",  handler:handle_cancel}]; 
						 
		this.dialog = new org.goorm.core.project.build.all.dialog();
		this.dialog.init({
			title:"Build Project", 
			path:"configs/dialogs/org.goorm.core.project/project.build.all.html",
			width:400,
			height:370,
			modal:true,
			buttons:this.buttons,
			success: function () {
			}
		});
		this.dialog = this.dialog.dialog;
		
		//this.dialog.panel.setBody("AA");
	},
	
	show: function () {
		this.project_list();
		this.dialog.panel.show();
	},

	project_list: function () {
		$("#build_all_list").empty();
			
		$.post("project/get_list", "", function (data) {
			
			var sorting_data = eval(data);
			
			for(var name in sorting_data) {
				if(!$.isEmptyObject(core.module.plugin_manager.plugins["org.goorm.plugin."+sorting_data[name].type])) {
					if(core.module.plugin_manager.plugins["org.goorm.plugin."+sorting_data[name].type].build){
						var icon_str = "";
						icon_str += "<div id='selector_" + sorting_data[name].filename + "' value='" + sorting_data[name].filename + "'>";
						icon_str += "<input type='hidden' name='"+sorting_data[name].filename+"' project_path='"+sorting_data[name].author+"_"+sorting_data[name].name+"' project_name='"+sorting_data[name].name+"' projectType='"+sorting_data[name].type+"'>";
						icon_str += sorting_data[name].filename;
						icon_str += "<div style='float:right' class='buildStatus'></div>";
						icon_str += "</div>";
			
						$("#build_all_list").append(icon_str);
					}
				}
			}
		});
	}
};