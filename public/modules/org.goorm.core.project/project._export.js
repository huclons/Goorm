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

			if ($("#project_export_project_path").attr("value")=="Not selected") {
				alert.show(core.module.localization.msg["alertProjectNotSelected"]);
				return false;
			}

			var postdata = {
				selected_project_name: $("#project_export_project_name").attr("value"),
				selected_project_path: $("#project_export_project_path").attr("value"),
				project_export_type: $("#project_export_datatype").attr("value")
			};

						
			$.post("project/export", postdata, function (data) {
				var received_data = eval("("+data+")");

				if(received_data.errCode==0) {
					location.href=received_data.download_path;
					setTimeout(function() {
						core.module.layout.project_explorer.refresh();
					}, 50);
				}

			});
		
			//
			this.hide(); 
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
	
		$.post("project/get_list", "", function (data) {
			
			var sorting_data = eval(data);
			
			for(var name in sorting_data) {
				var icon_str = "";
				icon_str += "<div id='selector_" + sorting_data[name].filename + "' value='" + sorting_data[name].filename + "' class='selector_project'>";
				icon_str += "<div style='white-space:nowrap; overflow:hidden; text-overflow:ellipsis; padding-left:65px; padding-top:20px;'>";
				icon_str += sorting_data[name].filename;
				icon_str += "</div>";
				icon_str += "</div>";
	
				$("#project_export_project_list").append(icon_str);
			}
			
			
			$(".selector_project").click(function() {
				$("#project_export_project_name").attr("value", "");
				$("#project_export_project_path").attr("value", "");
			
				$(".selector_project").removeClass("selected_button");
				$(this).addClass("selected_button");
				
				$("#project_export_project_path").attr("value", $(this).attr("value"));
				$("#project_export_location").attr("value", "/" + $(this).attr("value") + "/");

				$.ajax({
					type: "GET",
					dataType: "xml",
					async :false,
					url: "project/"+$(this).attr("value")+"/project.xml",
					success: function(xml) {
						$("#project_export_project_information").empty();
						$("#project_export_project_information").append("<b>project Type : </b>");
						$("#project_export_project_information").append($(xml).find("TYPE").text()+"<br/>");
						$("#project_export_project_information").append("<b>project Author : </b>");
						$("#project_export_project_information").append($(xml).find("AUTHOR").text()+"<br/>");
						$("#project_export_project_information").append("<b>project Name : </b>");
						$("#project_export_project_information").append($(xml).find("NAME").text()+"<br/>");
						$("#project_export_project_information").append("<b>project About : </b>");
						$("#project_export_project_information").append($(xml).find("ABOUT").text()+"<br/>");
						$("#project_export_project_information").append("<b>project Date : </b>");
						$("#project_export_project_information").append($(xml).find("DATE").text()+"<br/>");
						
						$("#project_export_project_name").attr("value", $(xml).find("NAME").text());
					}
					, error: function(xhr, status, error) {alert.show(core.module.localization.msg["alertError"] + error);}
				});
			});
		});
	},
	
	add_project_item: function() {
		$("div[id='project_export']").find("#project_export_type").append("<option value='All'>All Project</option>");
		$("div[id='project_export']").find("#project_export_type").append("<option value='goorm'>goorm Project</option>");
		
		$("#project_export_type").change(function() {
			var type = $("#project_export_type option:selected").val();
			if(type=="All") {
				$("div[id='project_export']").find(".selector_project").each(function() {
					$(this).css("display", "block");
				});
			}
			else {
				$("div[id='project_export']").find(".selector_project").each(function() {
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