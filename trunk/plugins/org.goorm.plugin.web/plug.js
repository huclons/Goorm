/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jslint evil: true, devel: true, node: true, plusplus: true, unparam: false */
/*global mongoose: true, Scheme: true, org: true, core: true, goorm: true, io: true */

org.goorm.plugin.web = function () {
	this.name = "web";
	this.mainmenu = null;
};

org.goorm.plugin.web.prototype = {
	init: function () {
		
		this.add_project_item();
		
		this.mainmenu = core.module.layout.mainmenu;
		
		//this.debugger = new org.uizard.core.debug();
		//this.debug_message = new org.uizard.core.debug.message();
		
		this.cErrorFilter = /[A-Za-z]* error: [A-Za-z0-9 '",:_\\\/\.\+\-\*\#\@]*/;
		this.cWarningFilter = /[A-Za-z]* warning: [A-Za-z0-9 '",:_\\\/\.\+\-\*\#\@]*/;
		this.lineFilter = /:[0-9]*:/;
		
		this.add_mainmenu();
		
		this.add_menu_action();
		
		//core.dictionary.loadDictionary("plugins/org.uizard.plugin.c/dictionary.json");
	},
	
	
	add_project_item: function () {
		$("div[id='project_new']").find(".project_types").append("<div class='project_wizard_first_button' project_type='webp'><div class='project_type_icon'><img src='/org.goorm.plugin.web/images/web.png' class='project_icon' /></div><div class='project_type_title'>Web Project</div><div class='project_type_description'>Web Project (HTML5/Javascript)</div></div>");
		
		$("div[id='project_new']").find(".project_items").append("<div class='project_wizard_second_button all webp' description='  Create New Project for web' project_type='web' plugin_name='org.goorm.plugin.web'><img src='/org.goorm.plugin.web/images/web.png' class='project_item_icon' /><br /><a>Web Project</a></div>");
		
		$(".project_dialog_type").append("<option value='web'>Web Projects</option>").attr("selected", "");
		
	},

	add_mainmenu: function () {
		var self = this;
		
		$("ul[id='plugin_new_project']").append("<li class=\"yuimenuitem\"><a class=\"yuimenuitemlabel\" href=\"#\" action=\"new_file_web\" localizationKey='file_new_web_project'>Web Project</a></li>");
		//this.mainmenu.render();
	},
	
	add_menu_action: function () {
		$("a[action=new_file_web]").unbind("click");
		$("a[action=new_file_web]").click(function () {
			core.dialog.new_project.show();
			$(".project_wizard_first_button[project_type=webp]").trigger("click");
			$("#project_new").find(".project_types").scrollTop($(".project_wizard_first_button[project_type=webp]").position().top - 100);
		});
	},
	
	new_project: function(data) {
		/* data = 
		   { 
			project_type,
			project_detailed_type,
			project_author,
			project_name,
			project_desc,
			use_collaboration
		   }
		*/
		var send_data = {
				"plugin" : "org.goorm.plugin.web",
				"data" : data
		};
		
		$.get('/plugin/new', send_data, function(result){
			setTimeout(function() {
				var filepath = core.status.current_project_path + '/';
				var filename = 'index.html';
				var filetype = 'html';

				core.module.layout.workspace.window_manager.open(filepath, filename, filetype, null, {});

				core.module.layout.project_explorer.refresh();
				$(core).trigger("on_project_open");
			}, 500);

		});
	},
	
run: function(path) {
	var send_data = {
			"plugin" : "org.goorm.plugin.web",
			"data" : {
				"project_path" : path
			}
	};
	
	$.get('/plugin/run', send_data, function(result){
		if(result.code == 200){
			//success 
			if(result.run_path) {
				window.open('.'+result.run_path+'/index.html', 'goormWeb');
			}
		}
	});
}	
};