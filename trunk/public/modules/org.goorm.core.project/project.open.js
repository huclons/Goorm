/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.project.open = function () {
	this.dialog = null;
	this.buttons = null;
	this.chat = null;
};

org.goorm.core.project.open.prototype = {
	init: function () {
		
		var self = this;
				
		var handle_open = function() { 
			if ($("#div_project_path").attr("value")=="") {
				//alert.show(core.module.localization.msg["alertProjectNotSelected"]);
				alert.show("not selected");
				return false;
			}
			else {
				self.open($("#div_project_path").attr("value"), $("#div_project_name").attr("value"), $("#div_project_type").attr("value"));
				this.hide(); 
			}
		};

		var handle_cancel = function() { 
			
			this.hide(); 
		};
		
		this.buttons = [ {text:"Open", handler:handle_open, isDefault:true},
						 {text:"Cancel",  handler:handle_cancel}]; 
						 
		this.dialog = new org.goorm.core.project.open.dialog();
		this.dialog.init({
			title:"Open Project", 
			path:"configs/dialogs/org.goorm.core.project/project.open.html",
			width:800,
			height:500,
			modal:true,
			buttons:this.buttons,
			success: function () {
				var resize = new YAHOO.util.Resize("project_open_dialog_left", {
		            handles: ['r'],
		            minWidth: 200,
		            maxWidth: 400
		        });
				
		        resize.on('resize', function(ev) {
					var width = $("#project_open_dialog_middle").width();
		            var w = ev.width;
		            $("#project_open_dialog_center").css('width', (width - w - 9) + 'px');
		        });

				self.add_project_item();
			}
		});
		this.dialog = this.dialog.dialog;
		
		//this.dialog.panel.setBody("AA");
	},
	
	show: function () {
		this.add_project_list();
		$("#project_open_type").val("All");
		$("#project_open_location").val("");
		$("#div_project_information").empty();
		$("div[id='project.open']").find("#project_open_dialog_left").scrollTop(0);
		this.dialog.panel.show();
	},
	
	open: function (current_project_path, current_project_name, current_project_type) {
		console.log("open");
		core.status.current_project_path = current_project_path;
		core.status.current_project_name = current_project_name;
		core.status.current_project_type = current_project_type;

		var current_project = {};
		current_project.current_project_path = current_project_path;
		current_project.current_project_name = current_project_name;
		current_project.current_project_type = current_project_type;

		localStorage["current_project"] = JSON.stringify(current_project);

		core.dialog.project_property.refresh_toolbox();
		core.module.layout.project_explorer.refresh();
/*
		if(core.chat_on){
			core.module.layout.chat.set_chat_off();
		}
		
		core.dialog.project_property.set_project_information();
		core.dialog.project_property.refresh_toolbox();
		
		$("a[action=show_properties]").removeClass('yuimenuitemlabel-disabled');
		$("a[action=show_properties]").parent().removeClass('yuimenuitem-disabled');
		var str = core.status.current_project_path;
		str.replace(".","");
		str.replace("#","");
		
		core.module.layout.show_chat(str);
		
		if(core.chat_on){
			core.module.layout.chat.set_chat_on();
		}
		core.module.layout.project_explorer.refresh();
		core.module.layout.refresh_console();
		
		$("#goorm_mainmenu #Project .yuimenuitemlabel").removeClass('yuimenuitemlabel-disabled');
		$("#goorm_mainmenu #Project .yuimenuitemlabel").parent().removeClass('yuimenuitem-disabled');
		
		if(core.module.plugin_manager.plugins["org.goorm.plugin."+current_project_type]){
			
			if($.isFunction(core.module.plugin_manager.plugins["org.goorm.plugin."+current_project_type].run)){
				$("a[action=run]").removeClass("yuimenuitemlabel-disabled");
				$("a[action=run]").parent().removeClass("yuimenuitem-disabled");
			} else {
				$("a[action=run]").addClass("yuimenuitemlabel-disabled");
				$("a[action=run]").parent().addClass("yuimenuitem-disabled");
			}
			
			if($.isFunction(core.module.plugin_manager.plugins["org.goorm.plugin."+current_project_type].debug)){
				$("a[action=debug]").removeClass("yuimenuitemlabel-disabled");
				$("a[action=debug]").parent().removeClass("yuimenuitem-disabled");
			} else {
				$("a[action=debug]").addClass("yuimenuitemlabel-disabled");
				$("a[action=debug]").parent().addClass("yuimenuitem-disabled");
			}
			
			if($.isFunction(core.module.plugin_manager.plugins["org.goorm.plugin."+current_project_type].remote_run)){
				$("a[action=remote_run]").removeClass("yuimenuitemlabel-disabled");
				$("a[action=remote_run]").parent().removeClass("yuimenuitem-disabled");
			} else {
				$("a[action=remote_run]").addClass("yuimenuitemlabel-disabled");
				$("a[action=remote_run]").parent().addClass("yuimenuitem-disabled");
			}
			
			if($.isFunction(core.module.plugin_manager.plugins["org.goorm.plugin."+current_project_type].build)){
				$("a[action=build_project]").removeClass("yuimenuitemlabel-disabled");
				$("a[action=build_project]").parent().removeClass("yuimenuitem-disabled");
				$("a[action=build_all]").removeClass("yuimenuitemlabel-disabled");
				$("a[action=build_all]").parent().removeClass("yuimenuitem-disabled");
			} else {
				$("a[action=build_project]").addClass("yuimenuitemlabel-disabled");
				$("a[action=build_project]").parent().addClass("yuimenuitem-disabled");
				$("a[action=build_all]").addClass("yuimenuitemlabel-disabled");
				$("a[action=build_all]").parent().addClass("yuimenuitem-disabled");		
			}
			
			if($.isFunction(core.module.plugin_manager.plugins["org.goorm.plugin."+current_project_type].generate)){
				$("a[action=generate]").removeClass("yuimenuitemlabel-disabled");
				$("a[action=generate]").parent().removeClass("yuimenuitem-disabled");
				$("a[action=generate_all]").removeClass("yuimenuitemlabel-disabled");
				$("a[action=generate_all]").parent().removeClass("yuimenuitem-disabled");
			} else {
				$("a[action=generate]").addClass("yuimenuitemlabel-disabled");
				$("a[action=generate]").parent().addClass("yuimenuitem-disabled");
				$("a[action=generate_all]").addClass("yuimenuitemlabel-disabled");
				$("a[action=generate_all]").parent().addClass("yuimenuitem-disabled");
			}
			
			if($.isFunction(core.module.plugin_manager.plugins["org.goorm.plugin."+current_project_type].clean)){
				$("a[action=clean]").removeClass("yuimenuitemlabel-disabled");
				$("a[action=clean]").parent().removeClass("yuimenuitem-disabled");
			} else {
				$("a[action=clean]").addClass("yuimenuitemlabel-disabled");
				$("a[action=clean]").parent().addClass("yuimenuitem-disabled");
			}
		}
*/
		$(document).trigger('onOpenProject');		
	},

	add_project_list: function () {
		$("#project_open_project_list").empty();
			
		$.get("project/get_list", null, function (data) {
						
			var sorting_data = data;
						
			for(var project_idx in sorting_data) {
				var icon_str = "";
				icon_str += "<div id='selector_" + sorting_data[project_idx].contents.name + "' value='" + project_idx + "' class='selector_project' type='"+sorting_data[project_idx].contents.type+"'>";
				icon_str += "<div style='padding-left:65px; padding-top:20px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis'>";
				icon_str += sorting_data[project_idx].contents.name;
				icon_str += "</div>";
				icon_str += "</div>";

				$("#project_open_project_list").append(icon_str);
			}
			
			$(".selector_project").click(function() {
				$(".selector_project").removeClass("selected_button");
				$(this).addClass("selected_button");
				
				var idx = $(this).attr("value");
				
				$("#div_project_path").attr("value", sorting_data[idx].name);
				$("#project_open_location").attr("value", "/" + sorting_data[idx].name);

				$("#div_project_information").empty();
				$("#div_project_information").append("<b>Project Type : </b>");
				$("#div_project_information").append(sorting_data[idx].contents.type+"<br/>");
				$("#div_project_information").append("<b>Project detailed Type : </b>");
				$("#div_project_information").append(sorting_data[idx].contents.detailedtype+"<br/>");
				$("#div_project_information").append("<b>Project Author : </b>");
				$("#div_project_information").append(sorting_data[idx].contents.author+"<br/>");
				$("#div_project_information").append("<b>Project Name : </b>");
				$("#div_project_information").append(sorting_data[idx].contents.name+"<br/>");
				$("#div_project_information").append("<b>Project About : </b>");
				$("#div_project_information").append(sorting_data[idx].contents.about+"<br/>");
				$("#div_project_information").append("<b>Project Date : </b>");
				$("#div_project_information").append(sorting_data[idx].contents.date+"<br/>");
				
				$("#div_project_name").attr("value", sorting_data[idx].contents.name);
				$("#div_project_type").attr("value", sorting_data[idx].contents.type);
			});
		});
	},
	
	add_project_item: function() {
		$("div[id='project.open']").find("#project_open_type").append("<option value='All'>All Project</option>");
		$("div[id='project.open']").find("#project_open_type").append("<option value='goorm'>goorm Project</option>");
		
		$("#project_open_type").change(function() {
			var type = $("#project_open_type option:selected").val();
			if(type=="All") {
				$("div[id='project.open']").find(".selector_project").each(function() {
					$(this).css("display", "block");
				});
			}
			else {
				$("div[id='project.open']").find(".selector_project").each(function() {
					if($(this).attr("type")==type) {
						$(this).css("display", "block");
					}
					else {
						$(this).css("display", "none");
					}
				});
			}
		});
	}
};