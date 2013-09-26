/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jslint evil: true, devel: true, node: true, plusplus: true, unparam: false */
/*global mongoose: true, Scheme: true, org: true, core: true, goorm: true, io: true */
 
org.goorm.plugin.c_examples = function () {
	this.name = "c_examples";
	this.mainmenu = null;
	this.debug_con = null;
	this.current_debug_project = null;
	this.terminal = null;
	this.preference = null;
};

org.goorm.plugin.c_examples.prototype = {
	init: function () {
		this.add_project_item();
		
		this.mainmenu = core.module.layout.mainmenu;
		
		//this.debugger = new org.goorm.core.debug();
		//this.debug_message = new org.goorm.core.debug.message();
		
		this.cErrorFilter = /[A-Za-z]* error: [A-Za-z0-9 '",:_\\\/\.\+\-\*\#\@]*/;
		this.cWarningFilter = /[A-Za-z]* warning: [A-Za-z0-9 '",:_\\\/\.\+\-\*\#\@]*/;
		this.lineFilter = /:[0-9]*:/;
		
		this.add_mainmenu();
		
		this.add_menu_action();
		
		//core.dictionary.loadDictionary("plugins/org.uizard.plugin.c/dictionary.json");
		
		this.preference = core.preference.plugins['org.goorm.plugin.c_examples'];
	},
	
	add_project_item: function () {
		$("div[id='project_new']").find(".project_types").append("<div class='project_wizard_first_button' project_type='c_examples'><div class='project_type_icon'><img src='/org.goorm.plugin.c_examples/images/cpp.png' class='project_icon' /></div><div class='project_type_title'>C Examples Project</div><div class='project_type_description'>C_Examples Project</div></div>");
		
		$("div[id='project_new']").find(".project_items").append("<div class='project_wizard_second_button all c_examples' description='  Create New Project for C' project_type='c_examples' plugin_name='org.goorm.plugin.c_examples'><img src='/org.goorm.plugin.c_examples/images/cpp_console.png' class='project_item_icon' /><br /><a>C Basic Example</a></div>");
		$("div[id='project_new']").find(".project_items").append("<div class='project_wizard_second_button all c_examples' description='  Create New Project for C' project_type='c_examples' plugin_name='org.goorm.plugin.c_examples'><img src='/org.goorm.plugin.c_examples/images/cpp_console.png' class='project_item_icon' /><br /><a>C File IO Example</a></div>");
		$("div[id='project_new']").find(".project_items").append("<div class='project_wizard_second_button all c_examples' description='  Create New Project for C' project_type='c_examples' plugin_name='org.goorm.plugin.c_examples'><img src='/org.goorm.plugin.c_examples/images/cpp_console.png' class='project_item_icon' /><br /><a>C Struct Example</a></div>");
		$("div[id='project_new']").find(".project_items").append("<div class='project_wizard_second_button all c_examples' description='  Create New Project for C' project_type='c_examples' plugin_name='org.goorm.plugin.c_examples'><img src='/org.goorm.plugin.c_examples/images/cpp_console.png' class='project_item_icon' /><br /><a>C Stack Example</a></div>");
		$("div[id='project_new']").find(".project_items").append("<div class='project_wizard_second_button all c_examples' description='  Create New Project for C' project_type='c_examples' plugin_name='org.goorm.plugin.c_examples'><img src='/org.goorm.plugin.c_examples/images/cpp_console.png' class='project_item_icon' /><br /><a>C Pointer Example</a></div>");
		
		$(".project_dialog_type").append("<option value='c_examples'>C Examples Projects</option>").attr("selected", "");
	},
	
	add_mainmenu: function () {
		var self = this;
		
		$("ul[id='plugin_new_project']").append("<li class=\"yuimenuitem\"><a class=\"yuimenuitemlabel\" href=\"#\" action=\"new_file_c_example\" localizationKey='file_new_cpp_project'>C Examples Project</a></li>");
		//this.mainmenu.render();
	},
	
	add_menu_action: function () {
		$("a[action=new_file_c_example]").unbind("click");
		$("a[action=new_file_c_example]").click(function () {
			core.dialog.new_project.show();
			$(".project_wizard_first_button[project_type=c_examples]").trigger("click");
			$("#project_new").find(".project_types").scrollTop($(".project_wizard_first_button[project_type=c_examples]").position().top - 100);
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
		data.plugins["org.goorm.plugin.c_examples"]["plugin.c_examples.main"] = "main";
/*		switch(data.project_detailed_type) {
		case "C Console Project": 
			data.project_detailed_type="c";
			data.plugins["org.goorm.plugin.c_examples"]["plugin.dart.main"] = "main";
			break;
		case "C++ Console Project": 
			data.project_detailed_type="cpp";
			data.plugins["org.goorm.plugin.c_examples"]["plugin.dart.main"] = "main";
			break;
		default:
			data.project_detailed_type="cexam1";
			data.plugins["org.goorm.plugin.c_examples"]["plugin.dart.main"] = "main";
		}*/
		var send_data = {
				"plugin" : "org.goorm.plugin.c_examples",
				"data" : data
		};
		
		$.get('/plugin/new', send_data, function(result){
			// update project.json file
			core.dialog.project_property.load_property(core.status.current_project_path, function(data){
				setTimeout(function(){
					var property = core.property.plugins['org.goorm.plugin.c_examples'];

					var filepath = core.status.current_project_path + '/' + property['plugin.c_examples.source_path'];
					var filename = property['plugin.c_examples.main']+'.c';
					var filetype = 'c';

					core.module.layout.workspace.window_manager.open(filepath, filename, filetype, null, {});
				}, 500);

				$(core).trigger("on_project_open");
				core.module.layout.project_explorer.refresh();
			});
		});
	},

	run: function(path) {
		var self=this;
		var property = core.property.plugins['org.goorm.plugin.c_examples'];
		
		var classpath = property['plugin.c_examples.build_path'];
		var classname = property['plugin.c_examples.main'];

		//var cmd1 = "./"+classpath+classname;
		var workspace = core.preference.workspace_path;
		//console.log('workspace',workspace);
		//console.log('core.status.current_project_path;',core.status.current_project_path);

		var absolute_path=workspace+core.status.current_project_path+"/"+classpath+classname;
		if(core.class_mode) {
			var cgexec = 'cgexec -g cpu:' + core.user.group + ' ';
			absolute_path = cgexec + absolute_path;
		}
		
		//console.log('absolute_path',absolute_path)
		var is_run_success=true;
		core.module.layout.terminal.send_command('\n\r', null);
		core.module.layout.terminal.send_command('clear;\r', null);

		core.module.layout.terminal.send_command(absolute_path+'\r', null, function(result){
			// var reg = /(.*)\w(.*)/g;
			// var message = result.replace(absolute_path, "").match(reg);
			// //message.pop();
			// if(/No such file or directory/g.test(message)||/그런 파일이나 디렉터리가 없습니다/g.test(message)) {
			// 	// 실행 실패

			// 	//alert.show(core.module.localization.msg['alert_plugin_run_error']);
			// 	console.log(' build fail')
			// 	is_run_success=false;
			// 	core.module.project.build.project.handle_build_for_run('run');
			// }
			// else {
			// 	// 아무 메시지도 안떴으면 성공.
			// 	console.log('run success');
			// 	//notice.show(core.module.localization.msg['alert_plugin_run_success']);
			// }
	
		});
		setTimeout(function(){
			core.module.toast.show(core.module.localization.msg['alert_plugin_check_terminal']);
		},1000);
	
	},
	
	debug: function (path) {
		var self = this;
		var property = core.property.plugins['org.goorm.plugin.c_examples'];
		var table_variable = core.module.debug.table_variable;
		var debug_module = core.module.debug;
		this.terminal = core.module.layout.workspace.window_manager.open("/", "debug", "terminal", "Terminal").terminal;
		this.current_debug_project = path;
		this.prompt = /\(gdb\) $/;
		this.terminal.debug_endstr = /exited normally/;
		
		// debug탭 초기화
		table_variable.initializeTable();
		table_variable.refreshView();
		
		this.breakpoints = [];
		
		// debug start!
		var send_data = {
				"plugin" : "org.goorm.plugin.c_examples",
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
		// $(debug_module).on("value_changed",function(e, data){
		// 	self.terminal.send_command("p "+data.variable+"="+data.value+"\r", self.prompt);
		// });
		
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
		var property = core.property.plugins['org.goorm.plugin.c_examples'];
		var table_variable = core.module.debug.table_variable;
		
		var workspace = core.preference.workspace_path;
		var projectName = core.status.current_project_path+"/";
		var mainPath = property['plugin.c_examples.main'];
		var buildPath = property['plugin.c_examples.build_path'];
		
//		if(this.terminal === null) {
//			console.log("no connection!");
//			var result = {result:false, code:6};
//			core.module.project.display_error_message(result, 'alert');
//			return ;
//		}
		
		switch (cmd.mode) {
		case 'init':
			self.terminal.flush_command_queue();
			self.terminal.send_command("gdb "+workspace+projectName+buildPath+mainPath+" --quiet\r", null);
			self.set_breakpoints();
			self.terminal.send_command("run\r", self.prompt, function(){
				self.debug_get_status();
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
			self.terminal.send_command("finish\r", self.prompt, function(){
				self.debug_get_status();
			}); break;
		default : break;
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
			self.terminal.send_command("info locals\r", self.prompt, function(local_terminal_data){
				self.set_debug_variable(local_terminal_data);
			});
		}, 500)
	},
	
	set_currentline: function(terminal_data){
		var self = this;
		var lines = terminal_data;
//		var lines = terminal_data.split('\n');
		
		// clear highlight lines
		var windows = core.module.layout.workspace.window_manager.window;
		for (var i in windows) {
			var window = windows[i];
			if (window.project == self.current_debug_project) {
				window.editor && window.editor.clear_highlight();
			}
		}

//		$.each(lines, function(i, line){
			if(lines == '') return;
			// 현재 라인 처리
			var regex = /at ((.*)\/)?(.*):(\d+)/;
			
			if(regex.test(lines)) {
				var match = lines.match(regex);
				var filepath = match[2];
				var filename = match[3];
				var line_number = match[4];
				
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
//		});
	},

	set_debug_variable: function(terminal_data){
		var self = this;
		var lines = terminal_data.split('\n');
		$.each(lines, function(i,o){
			var word = o.slice(o.indexOf(" = ")+1, o.length);
			
			if(/^=/.test(word) || /gdb/.test(word)){}
			else{
				lines[parseInt(i)-1] += o;
				delete lines[parseInt(i)];
			}
		});
		self.locals = {};
		var table_variable = core.module.debug.table_variable;
		
		var data;
		$(core.module.debug.table_variable).on('click_row',function(event, data){
			//console.log(data.target.find('.expand_row').attr('type'));

			var self_this = data.target.find('.expand_row')
			switch($(self_this).attr('type')){
				case 'array' :
					if($(self_this).attr('show')=='false'){

						var lines = self.locals[$(self_this).attr('key')];
						var target = $(self_this).parent().parent().next();
						$.each(lines, function(i, line){
							table_variable.addRow({								
								"variable" : "<div class='expand_row' type='"+line.type+"' num = '"+(parseInt($(self_this).attr('num'))+1)+"' style='margin-left:"+10*$(self_this).attr('num')+"px !important;' show='"+false+"'>"+i+"</div>",
								"value" : line.value,
								"summary" : line.type
							},data.index+parseInt(i)+1);

						});
						$(self_this).attr('show', 'true');

					}else{
						var lines = self.locals[$(self_this).attr('key')];
						table_variable.deleteRows(data.index+1, Object.keys(lines).length);
						/*var target = $(self_this).parent().parent().next();
						target.find('pre').remove();
						target.find('br').remove();*/
						$(self_this).attr('show', 'false');
						//table_variable.refreshView();
					}
				break;
				case 'pointer' : 
					if($(self_this).attr('show')=='false'){
						var val = self.locals[$(self_this).attr('key')].value.split(' ');

						self.terminal.send_command("p *"+$(self_this).attr('key')+"\r", self.prompt, function(local_terminal_data){

							var lines = local_terminal_data.split('\n');
							var inner_data = self.get_type(lines[1]);
							//self.locals[inner_data.variable] = inner_data.data;
							switch(inner_data.type){
								case 'array' :
									self.array_process(inner_data.data, function(array){
										self.locals[inner_data.variable] =  array;
									});
									table_variable.addRow({
										"variable" :"<div class='expand_row' type='"+inner_data.type+"' num = '"+(parseInt($(self_this).attr('num'))+1)+"' style='margin-left:"+10*$(self_this).attr('num')+"px !important;' show='"+false+"' key='"+inner_data.variable+"'>"+"*"+"</div>",//key='"+variable[0]+"
										"value" : inner_data.data,
										"summary" : inner_data.type
									},data.index+1);
								break;
								case 'struct' :
									self.struct_process(inner_data.data, function(array){
										self.locals[inner_data.variable] =  array;
									});
									table_variable.addRow({
										"variable" :"<div class='expand_row' type='"+inner_data.type+"' num = '"+(parseInt($(self_this).attr('num'))+1)+"' style='margin-left:"+10*$(self_this).attr('num')+"px !important;' show='"+false+"' key='"+inner_data.variable+"'>"+"*"+"</div>",//key='"+variable[0]+"
										"value" : inner_data.data,
										"summary" : inner_data.type
									},data.index+1);
								break;
								case 'pointer' :
									self.pointer_process(inner_data.data, function(data){
										self.locals[inner_data.variable] = data;
										
									});
									//var variable = inner_data.split(' = ');
									table_variable.addRow({
										"variable" :"<div class='expand_row' type='"+inner_data.type+"' num = '"+(parseInt($(self_this).attr('num'))+1)+"' style='margin-left:"+10*$(self_this).attr('num')+"px !important;' show='"+false+"' key='"+inner_data.variable+"'>"+"*"+"</div>",//key='"+variable[0]+"
										"value" : inner_data.data,
										"summary" : inner_data.type
									},data.index+1);
								break;
								default:
									
									table_variable.addRow({
										"variable" :"<div class='expand_row' type='"+inner_data.type+"' num = '"+(parseInt($(self_this).attr('num'))+1)+"' style='margin-left:"+10*$(self_this).attr('num')+"px !important;' show='"+false+"'>"+"*"+"</div>",//key='"+variable[0]+"
										"value" : inner_data.data,
										"summary" : inner_data.type
									},data.index+1);

								break;
							}
							
							/*variable[0] = variable[0].replace('$','');
							var target = $(self_this).parent().parent().next();
							table_variable.addRow({
								"variable" :"<div class='expand_row' type='"+inner_data.type+"' num = '"+(parseInt($(self_this).attr('num'))+1)+"' style='margin-left:"+10*$(self_this).attr('num')+"px !important;' show='"+false+"' key='"+inner_data.variable+"'>"+"*"+"</div>",//key='"+variable[0]+"
								"value" : inner_data.data,
								"summary" : inner_data.type
							},data.index+1);*/
							//var contents = '<span><pre class="expand_row">|__    variable:'+variable[0]+' value: '+variable[1]+' </pre></span>';
						});
						$(self_this).attr('show', 'true');
					}else{
						table_variable.deleteRows(data.index+1, 1);
						$(self_this).attr('show', 'false');
					}
				break;
				case 'struct' :
					if($(self_this).attr('show')=='false'){

						var lines = self.locals[$(self_this).attr('key')];
						console.log(lines);
						/*$.each(lines, function(i, line){
							table_variable.addRow({
								"value" : line.value,
								"summary" : line.type
							});
						});*/
						var target = $(self_this).parent().parent().next();
						$.each(lines, function(i, line){
							table_variable.addRow({
								"variable" : "<div class='expand_row' type='"+line.type+"' num = '"+(parseInt($(self_this).attr('num'))+1)+"' style='margin-left:"+10*$(self_this).attr('num')+"px !important;' show='"+false+"' key='"+line.variable+"'>"+line.variable+"</div>",
								"value" : line.data,
								"summary" : line.type
							},data.index+parseInt(i)+1);
							switch(line.type){
								case 'array' :
									self.array_process(line.data, function(array){
										self.locals[line.variable] =  array;
									});
								break;
								case 'struct' :
									self.struct_process(line.data, function(array){
										self.locals[line.variable] =  array;
									});
								break;
								case 'pointer' :
									self.pointer_process(line.data, function(data){
										self.locals[inner_data.variable] = data;
										
									});
								break;
							}
						});
						$(self_this).attr('show', 'true');

					}else{
						var lines = self.locals[$(self_this).attr('key')];
						table_variable.deleteRows(data.index+1, Object.keys(lines).length);
						$(self_this).attr('show', 'false');
						//table_variable.refreshView();
					}
				break;
			};
		});
		self.start(lines);
		console.log(lines);
		/*$(".expand_row").click(function(){
			var self_this = this;
			switch($(self_this).attr('type')){
				case 'array' :
					if($(self_this).attr('show')=='false'){

						var lines = self.locals[$(self_this).attr('key')];
						/*$.each(lines, function(i, line){
							table_variable.addRow({
								"value" : line.value,
								"summary" : line.type
							});
						});
						var target = $(self_this).parent().parent().next();
						var contents = '';
						$.each(lines, function(i, line){
							/*contents += '| <br />'
							contents += '| <br />'
							contents += '<span><pre class="expand_row">|__ value: '+line.value+'   type: '+line.type+' </pre></span>';

						});
						target.append(contents);
						$(self_this).attr('show', 'true');

					}else{
						var target = $(self_this).parent().parent().next();
						target.find('pre').remove();
						target.find('br').remove();
						$(self_this).attr('show', 'false');
						//table_variable.refreshView();
					}
				break;
				case 'pointer' : 
					if($(self_this).attr('show')=='false'){
						var val = self.locals[$(self_this).attr('key')].value.split(' ');
						self.terminal.send_command("p *"+val[0]+"\r", self.prompt, function(local_terminal_data){
							//+$(this).attr('key')+"="
							var lines = local_terminal_data.split('\n');
							var variable = lines[1].split(' = ');
							variable[0] = variable[0].replace('$','');
							var target = $(self_this).parent().parent().next();
							var contents = '<span><pre class="expand_row">|__    variable:'+variable[0]+' value: '+variable[1]+' </pre></span>';
							target.append(contents);
						});
						$(self_this).attr('show', 'true');
					}else{
						var target = $(self_this).parent().parent().next();
						target.find('pre').remove();
						target.find('br').remove();
						$(self_this).attr('show', 'false');
					}
				break;
				case 'struct' :
					if($(self_this).attr('show')=='false'){

						var lines = self.locals[$(self_this).attr('key')];
						/*$.each(lines, function(i, line){
							table_variable.addRow({
								"value" : line.value,
								"summary" : line.type
							});
						});
						var target = $(self_this).parent().parent().next();
						var contents = '';
						$.each(lines, function(i, line){
							/*contents += '| <br />'
							contents += '| <br />'
							contents += '<span><pre class="expand_row">|__    variable:'+line.variable +'  value: '+line.data+'   type: '+line.type+' </pre></span>';

						});
						target.append(contents);
						$(self_this).attr('show', 'true');

					}else{
						var target = $(self_this).parent().parent().next();
						target.find('pre').remove();
						target.find('br').remove();
						$(self_this).attr('show', 'false');
						//table_variable.refreshView();
					}
				break;
			};
		});*/
		/*table_variable.initializeTable();
		$.each(lines, function(i, line){
			if(line == '') return;

			// local variable 추가
			var variable = line.split(' = ');
			if (variable.length == 2) {
				table_variable.addRow({
					"variable": variable[0].trim(),
					"value": variable[1].trim()
				});
			}
		});
		table_variable.refreshView();*/
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
				self.terminal.send_command('clear\r', self.prompt);
				
				for(var i=0; i < breakpoints.length; i++) {
					var breakpoint = breakpoints[i];
					breakpoint += 1;
					breakpoint = filename+":"+breakpoint;
					self.terminal.send_command("break "+breakpoint+"\r", self.prompt);
				}
			}
		}
	},
	
	build: function (projectName,callback) {

		var build_result=false;
		var self=this;
		var workspace = core.preference.workspace_path;
		var property = core.property;
		if(projectName) {
			core.workspace[projectName] && (property = core.workspace[projectName])
		}
		else {
			projectName = core.status.current_project_path;
		}
		var plugin = property.plugins['org.goorm.plugin.c_examples'];
		var sourcePath = " "+workspace+projectName+"/"+plugin['plugin.c_examples.source_path'];
		var MakeFilePath = plugin['plugin.c_examples.makefile_path'];
		var buildOptions = " "+plugin['plugin.c_examples.build_option'];
		var buildPath = " "+workspace+projectName+"/"+plugin['plugin.c_examples.build_path']+plugin['plugin.c_examples.main'];

		var cmd = "";
		
		if(MakeFilePath != '' && MakeFilePath != 'make'){
			cmd = 'cd ' + workspace+projectName+"/"+MakeFilePath+"; make"+buildOptions;
		}
		else{
			MakeFilePath = 'make';
			cmd = workspace+projectName+"/"+MakeFilePath+sourcePath+buildPath+buildOptions;
		}

		var buildPath_guarantee_cmd='';
		buildPath_guarantee_cmd+= 'if [ ! -d '+workspace+projectName+'/'+plugin['plugin.c_examples.build_path']+' ];';
		buildPath_guarantee_cmd+= 'then mkdir -p '+workspace+projectName+'/'+plugin['plugin.c_examples.build_path']+';';
		buildPath_guarantee_cmd+= 'fi;clear;\n\r';

		// var cmd = workspace+projectName+"/"+MakeFilePath+sourcePath+buildPath+buildOptions;
		core.module.layout.terminal.send_command('\n\r', null);
		core.module.layout.terminal.send_command(buildPath_guarantee_cmd, null);
		core.module.layout.terminal.send_command(cmd+'\r', null, function(result){
			// if(/Build Complete/g.test(result)){
			// 	core.module.toast.show(core.module.localization.msg['alert_plugin_build_success']);
			// 	build_result=true;
			// }
			// else {
			// 	if(MakeFilePath != '' && MakeFilePath != 'make'){
			// 		build_result=true;
			// 	}
			// 	else{
			// 		alert.show(core.module.localization.msg['alert_plugin_build_error']);
			// 		build_result=false;
			// 	}
			// }
			core.module.toast.show(core.module.localization.msg['alert_plugin_check_terminal']);
			core.module.layout.project_explorer.refresh();
			
			if(callback)callback(build_result);
		});
	},
	
	clean: function(project_name){
		var workspace = core.preference.workspace_path;
		var property = core.property;
		if(project_name) {
			core.workspace[project_name] && (property = core.workspace[project_name])
		}
		else {
			var project_name = core.status.current_project_path;
		}
		var plugin = property.plugins['org.goorm.plugin.c_examples'];
		var buildPath = plugin['plugin.c_examples.build_path'];
		core.module.layout.terminal.send_command('\n\r', null);
		core.module.layout.terminal.send_command("rm -rf "+workspace+project_name+"/"+buildPath+"* \r", null, function(){
			core.module.layout.project_explorer.refresh();
		});
	},
	get_type : function(line){
		
		if(/=/.test(line)){
			var variable = line.slice(0, line.indexOf(" = "));
			var word = line.slice(line.indexOf(" = ")+3, line.length);
			if(word){
				if(/^{/.test(word)){
					var test = word.split(' = ');
					if(test.length > 1){
						return {							
							'type' : 'struct',
							'variable' : variable,
							'data' : word
						}
					}else{
						return {
							'type' : 'array',
							'variable' : variable,
							'data' : word
						}
					}
				}
				else if(/^0x/.test(word)){
					return {
						'type' : 'pointer',
						'variable' : variable,
						'data' : line
					}
				}
				else if(/^"/.test(word)){
					return {
						'type' : 'string',
						'variable' : variable,
						'data' : line
					}
				}
				else{
					return {
						'type' : 'number',
						'variable' : variable,
						'data' : word
					}
				}
			}
		}
		else{
			if(/^0x/.test(line)){
				return {
					'type' : 'pointer',
					'value' : line
				}
			}
			else{
				return {
					'type' : 'number',
					'value' : line
				}
			}
		}
	},
	get_value : function(word){
		var variable = word.split(' = ');
		return {
			'variable' : variable[0].trim(),
			'value' : variable[1].trim()
		}
	},
	struct_process : function(word, callback){
		var self = this;
		word = word.replace("{", "");
		word = word.replace("}", "");
		var array = {};
		var temp = [];
		var words = word.split(',').map(function(o){
			return o.trim(); 
		});
		
		$.each(words, function(i, __word){
			var __word_type = self.get_type(__word);
			if(/^{/.test(__word_type.data)){
				array[i] = __word_type;
				temp.push(i);
			}else if(/$}/.test(__word_type.data)){
				array[temp[0]].data += "," + __word;
				temp.pop();
			}else{
			
				if(temp.length>0){
					array[temp[0]].data += "," + __word;
				}else{
					array[i] = __word_type;
					
				}
			}
			//array[i] = __word_type;
		});
		callback(array);
	},
	array_process : function(word, callback){
		var self = this;

		word = word.replace("{", "");
		word = word.replace("}", "");
		var array = {};
		var words = word.split(',').map(function(o){ return o.trim(); });
		$.each(words, function(i, __word){
			var __word_type = self.get_type(__word);
			array[i] = __word_type;
		});
		callback(array);
	},

	pointer_process : function(word, callback){
		var self = this;
		var data = self.get_value(word);
		
		callback({
			'type' : 'pointer',
			'value' : data.value
		});
	},

	number_process : function(word, callback){
		var self = this;
		//var data = self.get_value(word);
		callback({
			'type' : 'number',
			'value' : word
		});
	},
	string_process : function(word, callback){
		var self = this;
		var data = self.get_value(word);
		callback({
			'type' : 'string',
			'value' : data.value
		});
	},

	start : function(lines){
		var self = this;
		var table_variable = core.module.debug.table_variable;
		table_variable.initializeTable();
		$.each(lines, function(i, line){
			if(!line || line == '' || /info locals/.test(line) || /gdb/.test(line)) return;
			var word = self.get_type(line);
			switch(word.type){
				case 'struct':
				self.struct_process(word.data, function(array){
						self.locals[word.variable] =  array;
						var variable = line.slice(line.indexOf(" = ")+3,line.length);
						var data = {};
						data.value = variable.trim();
						data.type = "struct";
						//console.log(variable,data,word.variable,line); line.indexOf(" = ")
						self.add_row(data, word.variable);
					});
				break;
				case 'array':
					self.array_process(word.data, function(array){
						self.locals[word.variable] =  array;

						var variable = line.slice(line.indexOf(" = ")+3,line.length);
						var data = {};
						data.value = variable.trim();
						data.type = "array";
						//console.log(variable,data,word.variable,line); line.indexOf(" = ")
						self.add_row(data, word.variable);
					});
					break;
				case 'pointer':
					self.pointer_process(word.data, function(data){
						self.locals[word.variable] = data;
						self.add_row(data, word.variable);
					});
					break;
				case 'number':
					self.number_process(word.data, function(data){
						self.locals[word.variable] = data;
						self.add_row(data, word.variable);
					});
					break;
				case 'string':
					self.string_process(word.data, function(data){
						self.locals[word.variable] = data;
						self.add_row(data, word.variable);
					});
					break;

				default:
					break;
			}
		});
		table_variable.refreshView();
	},

	push : function(table_variable){
		var self = this;
		console.log(self.locals['x']);
		self.terminal.send_command("p "+"x"+"="+self.locals['x'].value+"\r", self.prompt);
		/*var table_variable = core.module.debug.table_variable;
		table_variable.addRow({
					"variable": variable[0].trim(),
					"value": variable[1].trim()
				});
			}
		});
		table_variable.refreshView();*/
	},
	add_row : function(variable, key){
		if(variable && variable.value && variable.type){
			core.module.debug.table_variable.addRow({
				"variable": "<div class='expand_row' type='"+variable.type+"' num = '1' key='"+key+"' show='"+false+"'>"+key+"</div>",
				"value": variable.value,
				"summary": variable.type
			});
		}
	}
};