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
			if ($("#project_delete_project_path").attr("value")=="Not selected") {
				alert.show(core.module.localization.msg["alertProjectNotSelected"]);
				return false;
			}

			var postdata = {
				project_path: $("#project_delete_project_path").attr("value")
			};
			
			$.post("project/delete", postdata, function (data) {
				var received_data = eval("("+data+")");
				
				if(received_data.errCode==0) {
					if ( postdata.project_path == core.status.current_project_path ) {
						core.status.current_project_path = "";
						core.status.current_project_name = "";
						core.status.current_project_type = "";
					}
				}
				else {
					alert.show(core.module.localization.msg["alertError"] + received_data.message);
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
		
		//this.dialog.panel.setBody("AA");
	},
	
	show: function () {
		this.add_project_list();
		$("#project_delete_type").val("All");
		$("#project_delete_location").val("");
		$("#project_delete_project_information").empty();
		this.dialog.panel.show();
	},
	
	add_project_list: function () {
		$("#project_delete_list").empty();
			
		$.post("project/get_list", "", function (data) {
						
			var sorting_data = eval(data);
			
			for(var name in sorting_data) {
				var icon_str = "";
				icon_str += "<div id='selector_" + sorting_data[name].filename + "' value='" + sorting_data[name].filename + "' class='selector_project' type='"+sorting_data[name].type+"'>";
				icon_str += "<div style='white-space:nowrap; overflow:hidden; text-overflow:ellipsis; padding-left:65px; padding-top:20px;'>";
				icon_str += sorting_data[name].filename;
				icon_str += "</div>";
				icon_str += "</div>";
	
				$("#project_delete_list").append(icon_str);
			}
			
			$(".selector_project").click(function() {
				$(".selector_project").removeClass("selected_button");
				$(this).addClass("selected_button");
				
				$("#project_delete_project_path").attr("value", $(this).attr("value"));
				$("#project_delete_location").attr("value", "/" + $(this).attr("value") + "/");

				$.ajax({
					type: "GET",
					dataType: "xml",
					async :false,
					url: "project/" +  $(this).attr("value") + "/project.xml",
					success: function(xml) {
						$("#project_delete_project_information").empty();
						$("#project_delete_project_information").append("<b>Project Type : </b>");
						$("#project_delete_project_information").append($(xml).find("TYPE").text()+"<br/>");
						$("#project_delete_project_information").append("<b>Project detailed Type : </b>");
						$("#project_delete_project_information").append($(xml).find("DETAILEDTYPE").text()+"<br/>");
						$("#project_delete_project_information").append("<b>Project Author : </b>");
						$("#project_delete_project_information").append($(xml).find("AUTHOR").text()+"<br/>");
						$("#project_delete_project_information").append("<b>Project Name : </b>");
						$("#project_delete_project_information").append($(xml).find("NAME").text()+"<br/>");
						$("#project_delete_project_information").append("<b>Project About : </b>");
						$("#project_delete_project_information").append($(xml).find("ABOUT").text()+"<br/>");
						$("#project_delete_project_information").append("<b>Project Date : </b>");
						$("#project_delete_project_information").append($(xml).find("DATE").text()+"<br/>");
						
						$("#project_delete_project_name").attr("value", $(xml).find("NAME").text());
						$("#project_delete_project_type").attr("value", $(xml).find("TYPE").text());
					}
					, error: function(xhr, status, error) {alert.show(core.module.localization.msg["alertError"] + error);}
				});
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