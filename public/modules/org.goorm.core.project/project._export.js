/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.project._export = function () {
	this.dialog = null;
	this.buttons = null;
	this.tabview = null;
	this.treeview = null;	
};

org.goorm.core.project._export.prototype = {
	init: function () { 
	
		var self = this;
		
		var handle_ok = function() { 

			if($("#project_export_project_path").val()=="" || $("#project_export_project_name").val()=="") {
				//alert.show(core.module.localization.msg["alertFileNameEmpty"]);
				alert.show("Not Selected.");
				return false;
			}

			var postdata = {
				user: core.user.first_name+"_"+core.user.last_name,
				project_path: $("#project_export_project_path").val(),
				project_name: $("#project_export_project_name").val()
			};
								
			$.get("project/export", postdata, function (data) {
				if (data.err_code == 0) {
					self.dialog.panel.hide();
					
					var downloaddata = {
						file: data.path	
					};
					
					location.href = "download/?file="+data.path;
				}
				else {
					alert.show(data.message);
				}
			});
			
		};

		var handle_cancel = function() { 
			
			this.hide(); 
		};
		
		this.buttons = [ {text:"OK", handler:handle_ok, isDefault:true},
						 {text:"Cancel",  handler:handle_cancel}]; 
						 
		this.dialog = new org.goorm.core.project._export.dialog();
		this.dialog.init({
			title:"Export", 
			path:"configs/dialogs/org.goorm.core.project/project._export.html",
			width:800,
			height:500,
			modal:true,
			yes_text:"Open",
			no_text:"Cancel",
			buttons:this.buttons,
			success: function () {
				var resize = new YAHOO.util.Resize("project_export_dialog_left", {
		            handles: ['r'],
		            minWidth: 250,
		            maxWidth: 400
		        });
				
		        resize.on('resize', function(ev) {
					var width = $("#project_export_dialog_middle").width();
		            var w = ev.width;
		            $("#project_export_dialog_center").css('width', (width - w - 9) + 'px');
		        });
		        
				self.add_project_item();
			}
		});
		this.dialog = this.dialog.dialog;
		
		//this.dialog.panel.setBody("AA");
	},

	show: function () {
		this.add_project_list();
		$("#project_export_type").val("All");
		$("#project_export_location").val("");
		$("#project_export_project_information").empty();
		$("div[id='project_export']").find("#project_export_dialog_left").scrollTop(0);
		this.dialog.panel.show();
	},
	
	add_project_list: function () {
		$("#project_export_project_list").empty();
			
		$.get("project/get_list", null, function (data) {
						
			var sorting_data = data;
						
			for(var project_idx in sorting_data) {
				var icon_str = "";
				icon_str += "<div id='selector_" + sorting_data[project_idx].contents.name + "' value='" + project_idx + "' class='selector_project' type='"+sorting_data[project_idx].contents.type+"'>";
				icon_str += "<div style='padding-left:65px; padding-top:20px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis'>";
				icon_str += sorting_data[project_idx].contents.name;
				icon_str += "</div>";
				icon_str += "</div>";

				$("#project_export_project_list").append(icon_str);
			}
			
			$("#project_export_project_list .selector_project").click(function() {
				$(".selector_project").removeClass("selected_button");
				$(this).addClass("selected_button");
				
				var idx = $(this).attr("value");
				
				$("#project_export_project_path").attr("value", "/" + sorting_data[idx].name);
				$("#project_export_project_name").attr("value", sorting_data[idx].contents.name);

				$("#project_export_project_information").empty();
				$("#project_export_project_information").append("<b>Project Type : </b>");
				$("#project_export_project_information").append(sorting_data[idx].contents.type+"<br/>");
				$("#project_export_project_information").append("<b>Project detailed Type : </b>");
				$("#project_export_project_information").append(sorting_data[idx].contents.detailedtype+"<br/>");
				$("#project_export_project_information").append("<b>Project Author : </b>");
				$("#project_export_project_information").append(sorting_data[idx].contents.author+"<br/>");
				$("#project_export_project_information").append("<b>Project Name : </b>");
				$("#project_export_project_information").append(sorting_data[idx].contents.name+"<br/>");
				$("#project_export_project_information").append("<b>Project About : </b>");
				$("#project_export_project_information").append(sorting_data[idx].contents.about+"<br/>");
				$("#project_export_project_information").append("<b>Project Date : </b>");
				$("#project_export_project_information").append(sorting_data[idx].contents.date+"<br/>");
				
				$("#div_project_name").attr("value", sorting_data[idx].contents.name);
				$("#div_project_type").attr("value", sorting_data[idx].contents.type);
			});
		});
	},
	
	add_project_item: function() {
		$("#project_export_type").append("<option value='All'>All Project</option>");
		$("#project_export_type").append("<option value='goorm'>goorm Project</option>");
		
		$("#project_export_type").change(function() {
			var type = $("#project_export_type option:selected").val();
			if(type=="All") {
				$("#project_export_project_list .selector_project").each(function() {
					$(this).css("display", "block");
				});
			}
			else {
				$("#project_export_project_list .selector_project").each(function() {
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