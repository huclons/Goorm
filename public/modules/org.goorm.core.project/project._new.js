/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.project._new = function () {
	this.dialog = null;
	this.buttons = null;
	this.tabview = null;
};

org.goorm.core.project._new.prototype = {
	init: function () { 
		var self = this;
		
		var handle_ok = function() {
			// project create
			if ($("#input_project_type").attr("value")=="") {
				alert.show(core.module.localization.msg["alertProjectType"]);
				return false;
			}
			else if ($("#inputProjectSource").attr("value")=="") {
				alert.show(core.module.localization.msg["alertProjectSource"]);
				return false;
			}
			else if ($("#input_project_detailed_type").attr("value")=="") {
				alert.show(core.module.localization.msg["alertProjectDetailedType"]);
				return false;
			}
			else if ($("#input_project_author").attr("value")=="") {
				alert.show(core.module.localization.msg["alertProjectAuthor"]);
				return false;
			}
			else if ($("#input_project_name").attr("value")=="") {
				alert.show(core.module.localization.msg["alertProjectName"]);
				return false;
			}
			else if ($("#input_project_about").attr("value")=="") {
				alert.show(core.module.localization.msg["alertProjectAbout"]);
				return false;
			}
			else if ($("#check_project_new_import").is(":checked")) {
				if($("#project_new_import_file").attr("value").substr($("#project_new_import_file").attr("value").length-3,3).toLowerCase()!="zip") {
					alert.show(core.module.localization.msg["alertOnlyZipAllowed"]);
					return false;
				}
			}
			else if (!/^[\w-]*$/.test($("#input_project_author").attr("value"))) {
				alert.show(core.module.localization.msg["alertAllowCharacter"]);
				return false;
			}
			else if (!/^[\w-]*$/.test($("#input_project_name").attr("value"))) {
				alert.show(core.module.localization.msg["alertAllowCharacter"]);
				return false;
			}
			
			if ($("#new_projectUsingPlugin").val() == "yes") {			
				var postdata = {
					project_new_svn_url: $("#project_new_svn_url").attr("value"),
					project_new_svn_id: $("#project_new_svn_id").attr("value"),
					project_new_svn_pw: $("#project_new_svn_pw").attr("value"),
					project_new_svn_save_pw: $("#project_new_svn_save_pw").is(":checked")									
				}
				
				var input_project_type = $("#input_project_type").attr("value");
				var input_project_detailed_type = $("#input_project_detailed_type").attr("value");
				var input_project_author = $("#input_project_author").attr("value");
				var input_project_name = $("#input_project_name").attr("value");
				
				core.status.current_project_path = input_project_author+"_"+input_project_name;
				core.status.current_project_name = input_project_name;
				core.status.current_project_type = input_project_type;
				
				core.module.plugin_manager.new_project(input_project_name, input_project_author, input_project_type, input_project_detailed_type, input_project_author+"_"+input_project_name, postdata);
			}
			else {
				var postdata = {
					input_project_type: $("#input_project_type").attr("value"),
					input_project_detailed_type: $("#input_project_detailed_type").attr("value"),
					input_project_author: $("#input_project_author").attr("value"),
					input_project_name: $("#input_project_name").attr("value"),
					input_project_about: $("#input_project_about").attr("value"),
					input_use_collaboration: $("#check_use_collaboration").attr("checked")
				};
				
				$.post("project/new", postdata, function (data) {
					var received_data = eval("("+data+")");
					
					if(received_data.errCode==0) {
					
						core.status.current_project_path = received_data.author+"_"+received_data.project_name;
						core.status.current_project_name = received_data.project_name;
						core.status.current_project_type = received_data.type;
	
	
						core.dialog.open_project.open(core.status.current_project_path, core.status.current_project_name, core.status.current_project_type);
						
						if(!$("#check_project_new_import").is(":checked")) {
							
							var input_project_type = $("#input_project_type").attr("value");
							var input_project_detailed_type = $("#input_project_detailed_type").attr("value");
							var input_project_author = $("#input_project_author").attr("value");

							core.module.plugin_manager.new_project(core.status.current_project_name, postdata.input_project_author, postdata.input_project_type, postdata.input_project_detailed_type, core.status.current_project_path);
						}
						else {
							//여기서 전용 로딩중을 알림
							core.module.loading_bar.start("Import processing...");
							$('#project_new_import_form').submit();
						}

						
						// core.module.layout.project_explorer.refresh();
						// core.module.layout.refresh_console();
						// core.dialog.project_property.refresh_toolbox();
						// $("a[action=show_properties]").removeClass('yuimenuitemlabel-disabled');
						// $("a[action=show_properties]").parent().removeClass('yuimenuitem-disabled');
						// var str = core.status.current_project_path;
						// str.replace(".","");
						// str.replace("#","");
// 						
						// core.module.layout.show_chat(str);
					}
					else {
						alert.show(core.module.localization.msg["alertError"] + received_data.message);
						return false;
					}
				});				
			}
			
			this.hide(); 
		};

		var handle_cancel = function() { 
			
			this.hide(); 
		};
		
		this.buttons = [ {text:"OK", handler:handle_ok, isDefault:true},
						 {text:"Cancel",  handler:handle_cancel}]; 
						 
		this.dialog = new org.goorm.core.project._new.dialog();
		this.dialog.init({
			title:"New Project", 
			path:"configs/dialogs/org.goorm.core.project/project._new.html",
			width:800,
			height:500,
			modal:true,
			buttons:this.buttons,
			success: function () {
				self.add_project_item();
				
				var form_options = {
					target: "#project_new_import_upload_output",
					success: function(data) {
						core.module.layout.project_explorer.refresh();
						core.module.layout.refresh_console();
						core.dialog.project_property.refresh_toolbox();
						core.module.loading_bar.stop();
						//여기서 전용 로딩중을 뺌
					}
				}
	            //$('#project_new_import_form').ajaxForm(form_options);
				
				$('#project_new_import_form').submit(function() { 
				    // submit the form 
				    $(this).ajaxSubmit(); 
				    // return false to prevent normal browser submit and page navigation 
				    return false; 
				});
				
				$("#check_project_new_import").click(function() {
					if($(this).is(":checked")) {
						$("#project_new_import_div").css("display", "block");
					}
					else {
						$("#project_new_import_div").css("display", "none");
					}
				});
				
			},		
			kind:"new_project"
		});
				
		this.dialog = this.dialog.dialog;
	},
	
	show: function () {
		//count the total step of wizard dialog 
		this.dialog.total_step = $("div[id='project_new']").find(".wizard_step").size();
		
		// Add click event on dialog select item
		$(".project_wizard_first_button").click(function () {
			$(".project_wizard_second_button").removeClass("selected_button");
			
			$("#input_project_type").attr("value", "");
			$("#input_project_detailed_type").attr("value", "");
			
			$("#text_project_description").empty();
		
			$(".project_wizard_first_button").removeClass("selected_button");
			$(this).addClass("selected_button");
						
			$(".all").css("display", "none");
			$("."+$(this).attr("project-type")).css("display", "block");
		});
		
		$(".project_wizard_second_button").click(function () {
			$(".project_wizard_second_button").removeClass("selected_button");
			$(this).addClass("selected_button");
			
			$("#input_project_type").attr("value", "");
			$("#input_project_detailed_type").attr("value", "");
			
			$("#input_project_type").attr("value", $(this).attr("projecttype"));
			$("#input_project_detailed_type").attr("value", $(this).text());
			
			$("#text_project_description").empty();
			$("#text_project_description").append($(this).attr('description'));
			
			
			var self = this;
			$("#new_projectExpansionContainer").children().each(function (i) {
				if ($(this).attr("expansion") == $(self).attr("expansion")) {
					$(this).css("display", "block");
				}
				else {
					$(this).css("display", "none");
				}
			});
		});
		
		//for init
		$(".project_wizard_second_button").removeClass("selected_button");
		$(".project_wizard_second_button").removeClass("selected_button");
		$("#input_project_type").attr("value","");
		$("#input_project_detailed_type").val("");
		$("#input_project_author").val(core.user.first_name+"_"+core.user.last_name);
		$("#input_project_name").val("");
		$("#input_project_about").val("");
		$("#project_new_import_upload_output").empty();
		$("#project_new_import_file").val("");
		$("#check_project_new_import").attr('checked', "");
		$("#check_use_collaboration").attr('checked', "");
		
		$("div[id='project_new']").find(".project_types").scrollTop(0);
		$("div[id='project_new']").find(".project_items").scrollTop(0);
		
		this.dialog.showFirstPage();
		
		this.dialog.panel.show();
	},
	
	add_project_item: function () {
		// for step 1
		$("div[id='project_new']").find(".project_types").append("<div class='project_wizard_first_button' project-type='all'><div class='project_type_icon'><img src='images/org.goorm.core.project/project.png' class='project_icon' /></div><div class='project_type_title'>All</div><div class='project_type_description'>View all available project items (including plugins)</div></div>");

		$("div[id='project_new']").find(".project_types").append("<div class='project_wizard_first_button' project-type='goormp'><div class='project_type_icon'><img src='images/org.goorm.core.project/goormProject.png' class='project_icon' /></div><div class='project_type_title'>goorm Project</div><div class='project_type_description'>goorm3 Project Customization/Plugin/Theme</div></div>");
		
		$("div[id='project_new']").find(".project_items").append("<div class='project_wizard_second_button all goormp' description=' Create New goorm Customization Project' projecttype='goorm'><img src='images/org.goorm.core.project/customization.png' class='project_item_icon' /><br /><a>goorm Customization</a></div>");
		$("div[id='project_new']").find(".project_items").append("<div class='project_wizard_second_button all goormp' description=' Create New goorm Plugin' projecttype='goorm'><img src='images/org.goorm.core.project/plugin.png' class='project_item_icon' /><br /><a>goorm Plugin</a></div>");
		$("div[id='project_new']").find(".project_items").append("<div class='project_wizard_second_button all goormp' description=' Create New goorm Theme' projecttype='goorm'><img src='images/org.goorm.core.project/theme.png' class='project_item_icon' /><br /><a>goorm Theme</a></div>");
	}	
};