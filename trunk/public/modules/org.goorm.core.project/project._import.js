/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.project._import = function () {
	this.dialog = null;
	this.buttons = null;
	this.treeview = null;
	this.current_path = null;
};

org.goorm.core.project._import.prototype = {
	init: function () { 
		
		var self = this;
		
		var handle_ok = function() {
			if($("#project_import_file").attr("value").substr($("#project_import_file").attr("value").length-3,3).toLowerCase()!="zip") {
				//alert.show(core.module.localization.msg["alertOnlyZipAllowed"]);
				alert.show("Zip file only");
				return false;
			}
		
			$("#project_import_location").val(self.current_path);
			statusbar.start();
			$('#project_import_my_form').submit();
		};

		var handle_cancel = function() { 
			
			this.hide(); 
		};
		
		this.buttons = [ {text:"OK", handler:handle_ok, isDefault:true},
						 {text:"Cancel",  handler:handle_cancel}]; 
						 
		this.dialog = new org.goorm.core.project._import.dialog();
		this.dialog.init({
			title:"Import Project", 
			path:"configs/dialogs/org.goorm.core.project/project._import.html",
			width:800,
			height:500,
			modal:true,
			buttons:this.buttons,
			kind:"import",
			success: function () {
				var resize = new YAHOO.util.Resize("project_import_dialog_left", {
		            handles: ['r'],
		            minWidth: 200,
		            maxWidth: 400
		        });
				
		        resize.on('resize', function(ev) {
					var width = $("#project_import_dialog_middle").width();
		            var w = ev.width;
		            $("#project_import_dialog_center").css('width', (width - w - 9) + 'px');
		        });
		        			
				var form_options = {
					target: "#project_import_upload_output",
					success: function(data) {
						self.dialog.panel.hide();
						statusbar.stop();
						if (data.err_code==0) {
							notice.show(data.message);
							core.module.layout.project_explorer.refresh();
						}
						else {
							alert.show(data.message);
						}
						//notice.show(core.module.localization.msg["noticeProjectImportDone"]);
						
					}
				}
	            $('#project_import_my_form').ajaxForm(form_options);
				
				$('#project_import_my_form').submit(function() { 
				    // submit the form 
				    //$(this).ajaxSubmit(); 
				    // return false to prevent normal browser submit and page navigation 
				    return false; 
				});
				
			}
		});
		this.dialog = this.dialog.dialog;
		
		//this.dialog.panel.setBody("AA");
	},
	
	show: function () {
		this.add_project_list();
		$("#project_import_location").val("");
		$("#div_project_information").empty();
		$("#project_import").find("#project_import_dialog_left").scrollTop(0);
		this.dialog.panel.show();
	},
	
	add_project_list: function () {
		$("#project_import_project_list").empty();
			
		$.get("project/get_list", null, function (data) {
						
			var sorting_data = data;
						
			for(var project_idx in sorting_data) {
				var icon_str = "";
				icon_str += "<div id='selector_" + sorting_data[project_idx].contents.name + "' value='" + project_idx + "' class='selector_project' type='"+sorting_data[project_idx].contents.type+"'>";
				icon_str += "<div style='padding-left:65px; padding-top:20px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis'>";
				icon_str += sorting_data[project_idx].contents.name;
				icon_str += "</div>";
				icon_str += "</div>";

				$("#project_import_project_list").append(icon_str);
			}
			
			$(".selector_project").click(function() {
				$(".selector_project").removeClass("selected_button");
				$(this).addClass("selected_button");
				
				var idx = $(this).attr("value");
				
				$("#div_project_path").attr("value", sorting_data[idx].name);
				$("#project_import_location").attr("value", "/" + sorting_data[idx].name);

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
		$("#project_import").find("#project_import_type").append("<option value='All'>All Project</option>");
		$("#project_import").find("#project_import_type").append("<option value='goorm'>goorm Project</option>");
		
		$("#project_import_type").change(function() {
			var type = $("#project_import_type option:selected").val();
			if(type=="All") {
				$("#project_import").find(".selector_project").each(function() {
					$(this).css("display", "block");
				});
			}
			else {
				$("#project_import").find(".selector_project").each(function() {
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