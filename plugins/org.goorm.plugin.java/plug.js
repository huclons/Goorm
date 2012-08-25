/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.plugin.java = function () {
	this.name = "java";
	this.mainmenu = null;
	this.build_options = null;
	this.build_source = null;
	this.build_target = null;
	this.build_file_type = "o";
	this.debug_con = null;
};

org.goorm.plugin.java.prototype = {
	init: function () {
		
		this.addProjectItem();
		
		this.mainmenu = core.module.layout.mainmenu;
		
		//this.debugger = new org.uizard.core.debug();
		//this.debug_message = new org.uizard.core.debug.message();
		
		this.cErrorFilter = /[A-Za-z]* error: [A-Za-z0-9 '",:_\\\/\.\+\-\*\#\@]*/;
		this.cWarningFilter = /[A-Za-z]* warning: [A-Za-z0-9 '",:_\\\/\.\+\-\*\#\@]*/;
		this.lineFilter = /:[0-9]*:/;
		
		this.add_mainmenu();
		
		//core.dictionary.loadDictionary("plugins/org.uizard.plugin.c/dictionary.json");
	},
	
	addProjectItem: function () {
		$("div[id='project_new']").find(".project_types").append("<div class='project_wizard_first_button' project-type='javap'><div class='project_type_icon'><img src='/org.goorm.plugin.java/images/java.png' class='project_icon' /></div><div class='project_type_title'>Java Project</div><div class='project_type_description'>Java Project using GNU Compiler Collection</div></div>");
		
		$("div[id='project_new']").find(".project_items").append("<div class='project_wizard_second_button all javap' description='  Create New Project for Java' projecttype='java'><img src='/org.goorm.plugin.java/images/java_console.png' class='project_item_icon' /><br /><a>Java Console Project</a></div>");
		
		$(".project_dialog_type").append("<option value='c'>Java Projects</option>");
		
	},
	
	add_mainmenu: function () {
		var self = this;
		
		$("ul[id='plugin_new_project']").append("<li class=\"yuimenuitem\"><a class=\"yuimenuitemlabel\" href=\"#\" action=\"new_file_java\" localizationKey='file_new_java_project'>Java Project</a></li>");
		this.mainmenu.render();
	},
	
	add_menu_action: function () {
		$("a[action=new_file_java]").unbind("click");
		$("a[action=new_file_java]").click(function () {
			core.dialog.new_project.show();
			$(".project_wizard_first_button[project-type=java]").trigger("click");
			$("#project_new").find(".project_types").scrollTop($(".project_wizard_first_button[project-type=java]").position().top - 100);
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
				"plugin" : "org.goorm.plugin.java",
				"data" : data
		};
		
		$.get('/plugin/new', send_data, function(result){
			core.module.layout.project_explorer.refresh();
		});
	},
	
	run: function(path) {
		var self=this;
		
		this.path_project = "";

		var classpath = "src/project";
		var classname = "HelloWorld";

		var cmd1 = "java -cp "+classpath+" "+classname;
		console.log(cmd1);
		core.module.layout.terminal.send_command(cmd1+'\r');

	},
	
	debug: function (path) {
		var self = this;
		var send_data = {
				"plugin" : "org.goorm.plugin.java",
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
					"plugin" : "org.goorm.plugin.java",
					"path" : path,
					"mode" : "run"
				});
			}
		});
		$("#debug").empty();
		this.debug_con.emit("debug", send_data);
	},
	
	build: function (projectName, projectPath, callback) {
		var self=this;
		
		this.path_project = "";

		var buildOptions = "";
//		var buildOptions = $("#buildConfiguration").find('[name=plugin\\.c\\.buildOptions]').val();		
//		if(buildOptions == undefined){
//			buildOptions = core.dialogPreference.preference['plugin.c.buildOptions'];
//		}
//		
		var buildSource = "src/project/HelloWorld.java";
//		var buildSource = $("#buildConfiguration").find('[name=plugin\\.c\\.buildSource]').val();		
//		if(buildSource == undefined){
//			buildSource = core.dialogPreference.preference['plugin.c.buildSource'];
//		}
//		
		var cmd1 = "javac "+buildSource;
		console.log(cmd1);
		core.module.layout.terminal.send_command(cmd1+'\r');
		
		if(callback) callback();
	},
	clean: function(){
		console.log("java clean");
	}
};