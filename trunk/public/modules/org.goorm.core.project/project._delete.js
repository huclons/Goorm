/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.project._delete = function () {
	this.dialog = null;
	this.buttons = null;
	this.chat = null;
};

org.goorm.core.project._delete.prototype = {
	init: function () {
		
		var self = this;
				
		var handle_delete = function() { 
			this.hide(); 
			// project delete
			if ($("#project_delete_project_path").attr("value")=="") {
				//alert.show(core.module.localization.msg["alertProjectNotSelected"]);
				alert.show("Not selected");
				return false;
			}

			var postdata = {
				project_path: $("#project_delete_project_path").attr("value")
			};

			$.get("project/delete", postdata, function (data) {
				var received_data = data;
				
				if(received_data.errCode==0) {
					if ( postdata.project_path == core.status.current_project_path ) {
						core.status.current_project_path = "";
						core.status.current_project_name = "";
						core.status.current_project_type = "";
					}
				}
				else {
					//alert.show(core.module.localization.msg["alertError"] + received_data.message);
					allert.show("Can not delete project");
				}
				
				core.module.layout.project_explorer.refresh();
				core.dialog.project_property.refresh_toolbox();
			});
			
			this.hide(); 
		};

		var handle_cancel = function() { 
			
			this.hide(); 
		};
		
		this.buttons = [ {text:"Delete", handler:handle_delete, isDefault:true},
						 {text:"Cancel",  handler:handle_cancel}]; 
						 
		this.dialog = new org.goorm.core.project._delete.dialog();
		this.dialog.init({
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
		       
				self.add_project_item();
			}
		});
		this.dialog = this.dialog.dialog;
	},
	
	show: function () {
		this.add_project_list();
		$("#project_delete_type").val("All");
		$("#project_delete_location").val("");
		$("#project_delete_project_information").empty();
		$("#project_delete_project_path").val("");
		this.dialog.panel.show();
	},

	add_project_list: function () {
		$("#project_delete_list").empty();
			
		$.get("project/get_list", "", function (data) {
						
			var sorting_data = data;
						
			for(var project_idx in sorting_data) {
				var icon_str = "";
				icon_str += "<div id='selector_" + sorting_data[project_idx].contents.name + "' value='" + project_idx + "' class='selector_project' type='"+sorting_data[project_idx].contents.type+"'>";
				icon_str += "<div style='padding-left:65px; padding-top:20px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis'>";
				icon_str += sorting_data[project_idx].contents.name;
				icon_str += "</div>";
				icon_str += "</div>";

				$("#project_delete_list").append(icon_str);
			}
			
			$(".selector_project").click(function() {
				$(".selector_project").removeClass("selected_button");
				$(this).addClass("selected_button");
				
				var idx = $(this).attr("value");
				
				$("#project_delete_project_path").attr("value", sorting_data[idx].name);
				$("#project_delete_location").attr("value", "/" + sorting_data[idx].name);

				$("#project_delete_project_information").empty();
				$("#project_delete_project_information").append("<b>Project Type : </b>");
				$("#project_delete_project_information").append(sorting_data[idx].contents.type+"<br/>");
				$("#project_delete_project_information").append("<b>Project detailed Type : </b>");
				$("#project_delete_project_information").append(sorting_data[idx].contents.detailedtype+"<br/>");
				$("#project_delete_project_information").append("<b>Project Author : </b>");
				$("#project_delete_project_information").append(sorting_data[idx].contents.author+"<br/>");
				$("#project_delete_project_information").append("<b>Project Name : </b>");
				$("#project_delete_project_information").append(sorting_data[idx].contents.name+"<br/>");
				$("#project_delete_project_information").append("<b>Project About : </b>");
				$("#project_delete_project_information").append(sorting_data[idx].contents.about+"<br/>");
				$("#project_delete_project_information").append("<b>Project Date : </b>");
				$("#project_delete_project_information").append(sorting_data[idx].contents.date+"<br/>");
				
				$("#project_delete_project_name").attr("value", sorting_data[idx].contents.name);
				$("#project_delete_project_type").attr("value", sorting_data[idx].contents.type);
			});
		});
	},

	add_project_item: function() {
		$("div[id='project.delete']").find("#project_delete_type").append("<option value='All'>All Project</option>");
		$("div[id='project.delete']").find("#project_delete_type").append("<option value='goorm'>goorm Project</option>");
		
		$("#project_delete_type").change(function() {
			var type = $("#project_delete_type option:selected").val();
			if(type=="All") {
				$("div[id='project.delete']").find(".selector_project").each(function() {
					$(this).css("display", "block");
				});
			}
			else {
				$("div[id='project.delete']").find(".selector_project").each(function() {
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