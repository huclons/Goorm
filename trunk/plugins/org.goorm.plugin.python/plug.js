/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jslint evil: true, devel: true, node: true, plusplus: true, unparam: false */
/*global mongoose: true, Scheme: true, org: true, core: true, goorm: true, io: true */

org.goorm.plugin.python = function () {
	this.name = "python";
	this.mainmenu = null;
	this.debug_con = null;
	this.current_debug_project = null;
	this.terminal = null;
	this.preference = null;
};

org.goorm.plugin.python.prototype = {
	init: function () {
		this.add_project_item();
		
		this.mainmenu = core.module.layout.mainmenu;
		
		this.cErrorFilter = /[A-Za-z]* error: [A-Za-z0-9 '",:_\\\/\.\+\-\*\#\@]*/;
		this.cWarningFilter = /[A-Za-z]* warning: [A-Za-z0-9 '",:_\\\/\.\+\-\*\#\@]*/;
		this.lineFilter = /:[0-9]*:/;
		
		this.add_mainmenu();
		
		this.add_menu_action();
		
		this.preference = core.preference.plugins['org.goorm.plugin.python'];
	},
	
	add_project_item: function () {
		// Project New 왼쪽에 Project Type 버튼 추가
		$("div[id='project_new']").find(".project_types").append("<div class='project_wizard_first_button' project_type='python'><div class='project_type_icon'><img src='/org.goorm.plugin.python/images/python.png' class='project_icon' /></div><div class='project_type_title'>Python Project</div><div class='project_type_description'>Python Project</div></div>");
		
		// Project New 오른쪽에 새 Project Button 추가
		$("div[id='project_new']").find(".project_items").append("<div class='project_wizard_second_button all python' description='  Create New Project for Python' project_type='python' plugin_name='org.goorm.plugin.python'><img src='/org.goorm.plugin.python/images/python_console.png' class='project_item_icon' /><br /><a>Python Project</a></div>");

		// Project Open/Import/Export/Delete에 Project Type Option 추가
		$(".project_dialog_type").append("<option value='python'>Python Projects</option>").attr("selected", "");
		
	},

	add_mainmenu: function () {
		var self = this;
		
		// File - New.. Project Type 추가
		$("ul[id='plugin_new_project']").append("<li class=\"yuimenuitem\"><a class=\"yuimenuitemlabel\" href=\"#\" action=\"new_file_python\" localizationKey='file_new_python_project'>Python Project</a></li>");
		//this.mainmenu.render();
	},
	
	add_menu_action: function () {
		
		// 위에서 추가한 mainmenu에 대한 action 추가
		$("a[action=new_file_python]").unbind("click");
		$("a[action=new_file_python]").click(function () {
			core.dialog.new_project.show();
			$(".project_wizard_first_button[project_type=python]").trigger("click");
			$("#project_new").find(".project_types").scrollTop($(".project_wizard_first_button[project_type=python]").position().top - 100);
		});
	},
	
	new_project: function(data) {

		var send_data = {
				"plugin" : "org.goorm.plugin.python",
				"data" : data
		};
		
		$.get('/plugin/new', send_data, function(result){
			// 가끔씩 제대로 refresh가 안됨.
			setTimeout(function(){
				var property = core.property.plugins['org.goorm.plugin.python'];

				var filepath = core.status.current_project_path + '/' + property['plugin.python.source_path'];
				var filename = property['plugin.python.main']+'.py';
				var filetype = 'py';

				core.module.layout.workspace.window_manager.open(filepath, filename, filetype, null, {});

				core.module.layout.project_explorer.refresh();
				$(core).trigger("on_project_open");
			}, 500);
		});
	},
	
	run: function(path) {
		var self=this;
		var property = core.property.plugins['org.goorm.plugin.python'];
		
		var classpath = property['plugin.python.source_path'];
		var classname = property['plugin.python.main']+'.py';

		var workspace = core.preference.workspace_path;
		var absolute_path=workspace+core.status.current_project_path+"/"+classpath+classname;

		core.module.layout.terminal.send_command("clear;"+'\r');
		core.module.layout.terminal.send_command("python "+absolute_path +'\r');
	},

	debug: function (path) {
		var self = this;
		var property = core.property.plugins['org.goorm.plugin.python'];
		var table_variable = core.module.debug.table_variable;
		var debug_module = core.module.debug;
		this.terminal = core.module.layout.workspace.window_manager.open("/", "debug", "terminal", "Terminal").terminal;
		this.current_debug_project = path;
		this.prompt = /\(Pdb\) $/;
		this.terminal.debug_endstr = /The program finished/;
		
		// debug탭 초기화
		table_variable.initializeTable();
		table_variable.refreshView();
		
		this.breakpoints = [];
		
		// debug start!
		var send_data = {
				"plugin" : "org.goorm.plugin.python",
				"path" : path,
				"mode" : "init"
		};
		
		if(this.terminal.index != -1) {
			self.debug_cmd(send_data);
		}
		else {
			$(this.terminal).one("terminal_ready", function(){
				self.debug_cmd(send_data);
			});
		}
		
		$(debug_module).off("value_changed");
		$(debug_module).on("value_changed",function(e, data){
			self.terminal.send_command(data.variable+"="+data.value+"\r", self.prompt);
		});
		
		$(debug_module).off("debug_end");
		$(debug_module).on("debug_end",function(){
			table_variable.initializeTable();
			table_variable.refreshView();
			
			// clear highlight lines
			var windows = core.module.layout.workspace.window_manager.window;
			for (var i in windows) {
				var window = windows[i];
				if (window.project == self.current_debug_project) {
					window.editor && window.editor.clear_highlight();
				}
			}
			
			setTimeout(function(){
				self.debug_cmd({mode:'terminate'});
			}, 500);
		});
	},

	/*
	 * 디버깅 명령어 전송
	 */
	debug_cmd: function (cmd) {
		/*
		 * cmd = { mode, project_path }
		 */
		var self=this;
		var property = core.property.plugins['org.goorm.plugin.python'];
		var table_variable = core.module.debug.table_variable;
		
		var workspace = core.preference.workspace_path;
		var projectName = core.status.current_project_path+"/";
		var mainPath = property['plugin.python.main'] + '.py';
		var source_path = property['plugin.python.source_path'];
		
//		if(this.terminal === null) {
//			console.log("no connection!");
//			var result = {result:false, code:6};
//			core.module.project.display_error_message(result, 'alert');
//			return ;
//		}
		
		if(!this.terminal) this.terminal = core.module.layout.workspace.window_manager.open("/", "debug", "terminal", "Terminal").terminal;

		switch (cmd.mode) {
		case 'init':
			self.terminal.flush_command_queue();
			self.terminal.send_command("python -m pdb "+workspace+projectName+source_path+mainPath+"\r", null);
			self.set_breakpoints();
			self.terminal.send_command("run\r", self.prompt, function(){
				cmd.mode = 'continue';
				self.debug_cmd(cmd);
			});
			break;
		case 'continue':
			self.set_breakpoints();
			self.terminal.send_command("continue\r", self.prompt, function(){
				self.debug_get_status();
			}); break;
		case 'terminate':
			self.terminal.flush_command_queue();
			self.terminal.send_command("quit\r", self.prompt);
			setTimeout(function(){
				self.terminal.send_command("y\r", /(Exit|Quit) anyway\?/);
				self.terminal.flush_command_queue();
			}, 500);
			table_variable.initializeTable();
			table_variable.refreshView();
			
			// clear highlight lines
			var windows = core.module.layout.workspace.window_manager.window;
			for (var i in windows) {
				var window = windows[i];
				if (window.project == self.current_debug_project) {
					window.editor && window.editor.clear_highlight();
				}
			}
			
			$("#goorm_main_toolbar .debug_continue, #goorm_main_toolbar .debug_terminate, #goorm_main_toolbar .debug_step_over, #goorm_main_toolbar .debug_step_in, #goorm_main_toolbar .debug_step_out").addClass('debug_not_active');
			$("#goorm_main_toolbar .debug").removeClass("debug_not_active");
			$("#Debug .menu-debug-continue, #Debug .menu-debug-terminate, #Debug .menu-debug-step-over, #Debug .menu-debug-step-in, #Debug .menu-debug-step-out").addClass('debug_not_active');
			$("#Debug .menu-debug-start").removeClass('debug_not_active');
			
			break;
		case 'step_over':
			self.set_breakpoints();
			self.terminal.send_command("next\r", self.prompt, function(){
				self.debug_get_status();
			}); break;
		case 'step_in':
			self.set_breakpoints();
			self.terminal.send_command("step\r", self.prompt, function(){
				self.debug_get_status();
			}); break;
		case 'step_out':
			self.set_breakpoints();
			self.terminal.send_command("jump\r", self.prompt, function(){
				self.debug_get_status();
			}); break;
		default : break;
		}
		
	},

	set_breakpoints: function(){
		var self = this;
		var windows = core.module.layout.workspace.window_manager.window;
		for (var i in windows) {
			var window = windows[i];
			if (window.project == this.current_debug_project) {
				var filename = window.filename;
				
				if(!window.editor) continue;				
				var breakpoints = window.editor.breakpoints;
				// self.terminal.send_command('clear\r', self.prompt, function() {
				// 	self.terminal.send_command('y\r', self.prompt, function() {
						for(var i=0; i < breakpoints.length; i++) {
							var breakpoint = breakpoints[i];
							breakpoint += 1;
							breakpoint = filename+":"+breakpoint;
							self.terminal.send_command("b "+breakpoint+"\r", self.prompt);
						}
				// 	});
				// });
			}
		}
	},

	debug_get_status: function(){
		var self = this;
		this.terminal.send_command("where\r", this.prompt, function(terminal_data){
			self.set_currentline(terminal_data);
		});

		// Timing Problem by nys
		//
		setTimeout(function(){
			self.terminal.send_command("p locals().keys()\r", self.prompt, function(local_terminal_data){
				self.set_debug_variable(local_terminal_data);
			});
		}, 500)
	},
	
	set_currentline: function(terminal_data){
		var self = this;
		var lines = terminal_data.split('\n');
		
		// clear highlight lines
		var windows = core.module.layout.workspace.window_manager.window;
		for (var i in windows) {
			var window = windows[i];
			if (window.project == self.current_debug_project) {
				window.editor && window.editor.clear_highlight();
			}
		}

		$.each(lines, function(i, line){
			if(lines == '') return;
			// 현재 라인 처리
//			var regex = /.py\(\d+\)/;
			var regex = /> ((.*)\/)?(.*)(\(\d+)/

			if(regex.test(line)) {
				var filepath = line.replace(core.preference.workspace_path, "")
				var match = line.match(regex);
				var filepath = match[2];
				var filename = match[3];
				var line_number = match[4].substring(1);				
				if(line_number == '1') return;

				var windows = core.module.layout.workspace.window_manager.window;
								
				for (var j=0; j<windows.length; j++) {
					var window = windows[j];

					if (window.project == self.current_debug_project 
							&& window.filename == filename){

						if(typeof(line_number) == "string") line_number = parseInt(line_number);

						if(filepath && filepath.search(window.filepath.substring(0, window.filepath.length-1)) > -1) {
							window.editor.highlight_line(line_number-1);
						}
						else if (!filepath) {
							window.editor.highlight_line(line_number-1);
						}
					}
				}
			}
		});
	},

	set_debug_variable: function(terminal_data){
		var self = this;
		var lines = terminal_data.split('\n');

		lines.shift(); // remove 'p locals().keys()'
		lines.pop(); // remove '(Pdb) '

		var keys = JSON.parse(lines.join('\n').replace(/\'/g, '"'));

		var get_value = function(key, callback) {
			self.terminal.send_command('p '+key+'\r', self.prompt, function(data){
				if(data) {
					var line = data.split('\n');
					line.shift();
					line.pop();

					data = line.join('\n');
				}

				callback(data)
			});
		}

		var get_type = function(value) {
			if(/^'/.test(value)) {
				return 'String';
			}
			else if(/^</.test(value)) {
				return 'Module';
			}
			else {
				return 'Number';
			}
		}

		var table_variable = core.module.debug.table_variable;
		table_variable.initializeTable();
		table_variable.refreshView();

		$.each(keys, function(i,o){
			if( !/^__/.test(o)) {
				get_value(o, function(value){
					var type = get_type(value);

					value = ((value.replace(/&/g, '&amp;')).replace(/\"/g, '&quot;')).replace(/\'/g, '&#39;'); 
					value = value.replace(/</g, '&lt;').replace(/>/g, '&gt;');

					table_variable.addRow({
						"variable" : o,
						"value" : value,
						"summary" : type
					});
				})
			}
		});
	},
};