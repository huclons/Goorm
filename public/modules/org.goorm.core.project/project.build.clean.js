/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.project.build.clean = function () {
	this.dialog = null;
	this.buttons = null;
	this.chat = null;
};

org.goorm.core.project.build.clean.prototype = {
	init: function () {
		
		var self = this;
				
		var handle_clean = function() { 
			$("#build_clean_list input[type=checkbox]").each(function(){
				if($(this).is(":checked")){

					if(core.module.plugin_manager.plugins["org.goorm.plugin."+$(this).attr("projectType")]!=undefined) {
						core.module.plugin_manager.plugins["org.goorm.plugin."+$(this).attr("projectType")].clean($(this).attr("name"));
					}
				}
			});
			this.hide(); 
		};

		var handle_cancel = function() { 
			this.hide(); 
		};
		
		this.buttons = [ {text:"Clean", handler:handle_clean, isDefault:true},
						 {text:"Cancel",  handler:handle_cancel}]; 
						 
		this.dialog = new org.goorm.core.project.build.clean.dialog();
		this.dialog.init({
			title:"Build Clean", 
			path:"configs/dialogs/org.goorm.core.project/project.build.clean.html",
			width:400,
			height:400,
			modal:true,
			buttons:this.buttons,
			success: function () {
				self.button_select_all = new YAHOO.widget.Button("build_clean_select_all");
				self.button_deselect_all = new YAHOO.widget.Button("build_clean_unselect_all");
				
				$("#build_clean_select_all").click(function(){
					self.select_all();
				});
				$("#build_clean_unselect_all").click(function(){
					self.unselect_all();
				});
			}
		});
		this.dialog = this.dialog.dialog;
		
		//this.dialog.panel.setBody("AA");
	},
	
	show: function () {
		this.project_list();
		this.dialog.panel.show();
	},

	select_all: function(){
		$("#build_clean_list input[type=checkbox]").attr("checked",true);
	},
	
	unselect_all: function(){
		$("#build_clean_list input[type=checkbox]").attr("checked",false);
	},

	project_list: function () {
		$("#build_clean_list").empty();
	
		$.post("project/get_list", "", function (data) {
			
			var sorting_data = eval(data);
			
			for(var name in sorting_data) {
				if(!$.isEmptyObject(core.module.plugin_manager.plugins["org.goorm.plugin."+sorting_data[name].type])) {
					if(core.module.plugin_manager.plugins["org.goorm.plugin."+sorting_data[name].type].clean){
						var icon_str = "";
						icon_str += "<div id='claeanSelector_" + sorting_data[name].filename + "' value='" + sorting_data[name].filename + "' class='select_div' style='height:14px;'>";
						icon_str += "<div style='float:left;'>";
						icon_str += "<input type='checkbox' name='"+sorting_data[name].filename+"' project_path='"+sorting_data[name].author+"_"+sorting_data[name].name+"' project_name='"+sorting_data[name].name+"' projectType='"+sorting_data[name].type+"'";
		
						if (sorting_data[name].filename == core.status.current_project_path) {
							icon_str += "checked";
						}
						
						icon_str += ">";
						
						icon_str += "</div>";
						icon_str += "<div style='float:left; padding-top:1px; padding-left:5px;'>" + sorting_data[name].filename + "</div>";
						icon_str += "</div>";
			
						$("#build_clean_list").append(icon_str);
						
						$("#claeanSelector_" + sorting_data[name].filename).click(function () {
							$(this).find("input").attr("checked", !$(this).find("input").attr("checked"));
						});
					}
				}
			}
		});
	}
};