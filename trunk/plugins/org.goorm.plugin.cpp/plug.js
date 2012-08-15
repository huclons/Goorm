/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.plugin.cpp = function () {
	this.name = "c";
	this.mainmenu = null;
	this.debug_con = null;
	this.build_options = null;
	this.build_source = null;
	this.build_target = null;
	this.build_file_type = "o";
};

org.goorm.plugin.cpp.prototype = {
	init: function () {
		this.addProjectItem();
		
		this.mainmenu = core.module.layout.mainmenu;
		
		//this.debugger = new org.goorm.core.debug();
		//this.debug_message = new org.goorm.core.debug.message();
		
		this.cErrorFilter = /[A-Za-z]* error: [A-Za-z0-9 '",:_\\\/\.\+\-\*\#\@]*/;
		this.cWarningFilter = /[A-Za-z]* warning: [A-Za-z0-9 '",:_\\\/\.\+\-\*\#\@]*/;
		this.lineFilter = /:[0-9]*:/;
		
		this.add_mainmenu();
		
		//core.dictionary.loadDictionary("plugins/org.uizard.plugin.c/dictionary.json");
	},
	
	addProjectItem: function () {
		$("div[id='project_new']").find(".project_types").append("<div class='project_wizard_first_button' project-type='cp'><div class='project_type_icon'><img src='/org.goorm.plugin.cpp/images/cpp.png' class='project_icon' /></div><div class='project_type_title'>C/C++ Project</div><div class='project_type_description'>C/C++ Project using GNU Compiler Collection</div></div>");
		
		$("div[id='project_new']").find(".project_items").append("<div class='project_wizard_second_button all cp' description='  Create New Project for C' projecttype='cpp'><img src='/org.goorm.plugin.cpp/images/cpp_console.png' class='project_item_icon' /><br /><a>C/C++ Console Project</a></div>");
		
		$(".project_dialog_type").append("<option value='c'>C/C++ Projects</option>");
		
	},
	
	add_mainmenu: function () {
		var self = this;
		
		$("ul[id='plugin_new_project']").append("<li class=\"yuimenuitem\"><a class=\"yuimenuitemlabel\" href=\"#\" action=\"new_file_cpp\" localizationKey='file_new_cpp_project'>C/C++ Project</a></li>");
		this.mainmenu.render();
	},
	
	add_menu_action: function () {
		$("a[action=new_file_cpp]").unbind("click");
		$("a[action=new_file_cpp]").click(function () {
			core.dialog.new_project.show();
			$(".project_wizard_first_button[project-type=cpp]").trigger("click");
			$("#project_new").find(".project_types").scrollTop($(".project_wizard_first_button[project-type=cpp]").position().top - 100);
		});
	},
	
	new_project: function(data) {
		/* data = 
		   { 
			project_type,
			project_detailed_type,
			project_author,
			project_name,
			project_about,
			use_collaboration
		   }
		*/
		var send_data = {
				"plugin" : "org.goorm.plugin."+data.project_type,
				"data" : data
		};
		
		$.get('/plugin/new', send_data, function(result){
			core.module.layout.project_explorer.refresh();
		});
	},
	
	run: function(path) {
		console.log(path);
	},
	
	debug: function (path) {
		var self = this;
		var send_data = {
				"plugin" : "org.goorm.plugin.cpp",
				"path" : path,
				"mode" : "init"
		};
		
		if(!this.debug_con) {
			this.debug_con = io.connect();
		}
		this.debug_con.removeAllListeners("debug_response");
		this.debug_con.on('debug_response', function (data) {
			console.log(data);
			$("#debug").append("<div>"+data+"</div>");
			
			if(data == "ready") {
				self.debug_con.emit("debug", {
					"plugin" : "org.goorm.plugin.cpp",
					"path" : path,
					"mode" : "run"
				});
			}
		});
		$("#debug").empty();
		this.debug_con.emit("debug", send_data);
	}
};