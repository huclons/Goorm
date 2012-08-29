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
		$("div[id='project_new']").find(".project_types").append("<div class='project_wizard_first_button' project-type='cpp'><div class='project_type_icon'><img src='/org.goorm.plugin.cpp/images/cpp.png' class='project_icon' /></div><div class='project_type_title'>C/C++ Project</div><div class='project_type_description'>C/C++ Project using GNU Compiler Collection</div></div>");
		
		$("div[id='project_new']").find(".project_items").append("<div class='project_wizard_second_button all cpp' description='  Create New Project for C' projecttype='cpp'><img src='/org.goorm.plugin.cpp/images/cpp_console.png' class='project_item_icon' /><br /><a>C/C++ Console Project</a></div>");
		
		$(".project_dialog_type").append("<option value='cpp'>C/C++ Projects</option>");
		
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
		var self=this;
		
		this.path_project = "";

		var classname = "main";

		var cmd1 = "./"+classname;
		console.log(cmd1);
		core.module.layout.terminal.send_command(cmd1+'\r');
	},
	
	debug: function (path) {
		var self = this;
		var table_variable = core.module.debug.table_variable;
		var debug_module = core.module.debug;
		var send_data = {
				"plugin" : "org.goorm.plugin.cpp",
				"path" : path,
				"mode" : "init"
		};
		
		if(!this.debug_con) {
			this.debug_con = io.connect();
			this.current_debug_project = path;
		}
		this.debug_con.removeAllListeners("debug_response");
		this.debug_con.on('debug_response', function (data) {
			console.log(data);
			var regex = /Local variables:/;
			
			if(data == "exited") {
			// 커넥션 끊겼을시 처리
//				self.debug_con.disconnect();
				self.debug_con = null;
				console.log("connection disconnect()");
				table_variable.initializeTable();
				table_variable.refreshView();
			}
			else if(regex.test(data) || self.debug_buffer === true) {
			// Local variable 값을 처리하는 부분.
				var variables = null;
				var regex_end = /\(gdb\)/;
				var lines = data.split('\n');
				$.each(lines, function(i, line){
					if(line == '') return;
					
					if(regex_end.test(line)) {
						// local variable 세팅 완료
						self.debug_buffer = false;
						table_variable.refreshView();
					}
					else if(self.debug_buffer === true) {
						// local variable 추가
						var variable = line.split(' = ');
						table_variable.addRow({"variable":variable[0].trim(),"value":variable[1].trim()});
					}
					else if(regex.test(line)) {
						// local variable 시작
						self.debug_buffer = true;
						table_variable.initializeTable();
					}
				});
			}
			else {
			}
		});
		
		$(debug_module).off("value_changed");
		$(debug_module).on("value_changed",function(e, data){
			self.debug_cmd({
				"mode":"set_value",
				"project_path":path,
				"variable":data.variable,
				"value":data.value
			});
		});
		
		// debug탭 초기화
		table_variable.initializeTable();
		table_variable.refreshView();
		
		this.debug_con.emit("debug", send_data);
		setTimeout(function(){
			self.debug_cmd({
					"mode":"init",
					"project_path":path
			});
		}, 2000);
	},
	
	/*
	 * 디버깅 명령어 전송
	 */
	debug_cmd: function (cmd) {
		/*
		 * cmd = { mode, project_path }
		 */
		var self=this;
		if(!this.debug_con) {
			console.log("no connection!");
			return ;
		}
		
		var windows = core.module.layout.workspace.window_manager.window;
		for (var i in windows) {
			var window = windows[i];
			if (window.project == this.current_debug_project) {
				var filename = window.filename;
				var breakpoints = window.editor.breakpoints;
				if(breakpoints.length > 0){
					self.debug_con.emit("debug", {
						"plugin" : "org.goorm.plugin.cpp",
						"mode" : "set_breakpoints",
						"filename" : filename,
						"breakpoints" : breakpoints
					});
				}
			}
		}
		
		var json = cmd;
		json.plugin = "org.goorm.plugin.cpp";
		switch (cmd.mode) {
		case 'init':
			json.mode = "init_run";
			self.debug_con.emit("debug", json);
			break;
		case 'continue':
		case 'terminate':
		case 'step_over':
		case 'step_in':
		case 'step_out':
		case 'set_value':
			json.mode = cmd.mode;
			self.debug_con.emit("debug", json);
			break;
		default : break;
		}
	},
	
	build: function (projectName, projectPath, callback) {
		var self=this;
		
		this.path_project = "";

		var buildOptions = "-g";
//		var buildOptions = $("#buildConfiguration").find('[name=plugin\\.c\\.buildOptions]').val();		
//		if(buildOptions == undefined){
//			buildOptions = core.dialogPreference.preference['plugin.c.buildOptions'];
//		}
//		
		var buildSource = "main.c";
//		var buildSource = $("#buildConfiguration").find('[name=plugin\\.c\\.buildSource]').val();		
//		if(buildSource == undefined){
//			buildSource = core.dialogPreference.preference['plugin.c.buildSource'];
//		}
//		
		var buildTarget = "main";
//		var buildTarget = $("#buildConfiguration").find('[name=plugin\\.c\\.buildTarget]').val();		
//		if(buildTarget == undefined){
//			buildTarget = core.dialogPreference.preference['plugin.c.buildTarget'];
//		}
		
		var cmd1 = "gcc "+buildSource+" -o "+this.path_project+buildTarget+" -Wall"+" "+ buildOptions;
		console.log(cmd1);
		core.module.layout.terminal.send_command(cmd1+'\r');
		
		if(callback) callback();
	},
	clean: function(){
		console.log("cpp clean");
	}
};