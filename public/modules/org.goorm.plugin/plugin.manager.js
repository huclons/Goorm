/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.plugin.manager = function () {
	this.plugins = null;
	this.list = 0;
	this.interval = null;
	this.preference = null;
	this.toolbox_selector = null;
};

org.goorm.plugin.manager.prototype = {
	init: function () {
		this.plugins = new Object();
		this.list = $.makeArray();
	},
	
	get_all_plugins: function () {
		var self = this;
		
		var url = "plugin/get_list";
				
		//var i = 0;
		//this.interval = window.setInterval(function () { if(i<100) { statusbar.progressbar.set('value', i+=10); } else { window.clearInterval(self.interval); } }, 100);
		
		//statusbar.start();
		
		$.ajax({
			url: url,			
			type: "GET",
			async: false,
			success: function(data) {
				self.list = eval(data);
				
				//statusbar.progressbar.set('value', 100);
				/*
				if(self.interval) {
					window.clearInterval(self.interval);
				}
				*/
				
				//statusbar.stop();
				
				//$(core).trigger("plugin_loaded");
				
				//$(core).trigger("goorm_loading");
			}
		});
		
		$(core).trigger("plugin_loaded");
	},
	
	load_all_plugins: function (index) {
		var self = this;
		
		//for refactoring
		this.list = [];

		if (index == this.list.length && this.list.length != 0) {
		
			$("#toolboxSelectBoxDummy").prepend("<option value='all'>ALL</option>");
			
			self.toolbox_selector = new YAHOO.widget.Button({ 
					id: "toolboxSelectBox", 
					name: "toolboxSelectBox",
					label: "Select Tool",
					type: "menu",  
					menu: "toolboxSelectBoxDummy", 
					container: "toolbox_selector"
			});

			var toolboxClick = function (p_sType, p_aArgs) {
				var oEvent = p_aArgs[0],	//	DOM event
					oMenuItem = p_aArgs[1];	//	MenuItem instance that was the target of 
											//	the event 
				if (oMenuItem) {
					if (oMenuItem.value=="all") {
						$("#toolboxSelectBox-button").text($(oMenuItem.element).text());
						$(".toolsets").css("display", "block");
					}
					else {
						$("#toolboxSelectBox-button").text($(oMenuItem.element).text());
						$(".toolsets").css("display", "none");
						$("#"+oMenuItem.value+"_toolset").css("display", "block");
					}
				}
			};

			self.toolbox_selector.getMenu().subscribe("click", toolboxClick);

			return false;
		}
		else if(this.list.length != 0){
			if (index==0) {
				$("#toolbox").empty();
				$("#toolbox").prepend("<div id='toolbox_selector' style='height:22px; background-color:#eee; border-bottom:1px solid #ddd; padding:5px; font-size:10px;'><div style='float:left; padding-top:4px; padding-right:4px; font-weight:bold;'>Tool</div></div>");
				$("#toolbox_selector").append("<select id='toolboxSelectBoxDummy' name='toolboxSelectBoxDummy' style='width:100%;'></select>");
			}
			
			var plugin_name = this.list[index].plugin_name;

			if (plugin_name != undefined) {	
				
				$.getScript('plugins/' + plugin_name + '/plug.js', function () {
										
						//Plugin initialization
						eval("self.plugins['"+plugin_name+"'] = new " + plugin_name + "();");
						self.plugins[plugin_name].init();
		
						index++;
						
						self.load_all_plugins(index);

						$(core).trigger("goorm_loading");
					
				});	
			}
		}
		else {
			$(core).trigger("goorm_loading");
		}
	},

	new_project: function (project_name, project_author, projectType, projectDetailedType, project_path, postdata){
		if(projectType == "goorm") {
		
		}
		else {
			if(eval("typeof this.plugins['org.goorm.plugin."+projectType+"'].new_project") == "function") {				
				eval("this.plugins['org.goorm.plugin."+projectType+"'].new_project(project_name, project_author, projectType, projectDetailedType, project_path, postdata)");
				core.dialog.project_property.set_project_information();
			}
		}
	}
};
