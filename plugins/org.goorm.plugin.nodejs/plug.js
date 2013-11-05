/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jslint evil: true, devel: true, node: true, plusplus: true, unparam: false */
/*global mongoose: true, Scheme: true, org: true, core: true, goorm: true, io: true */

org.goorm.plugin.nodejs = function () {
	this.name = "nodejs";
	this.full_name = "org.goorm.plugin.nodejs";
	this.mainmenu = null;
	this.debug_con = null;
	this.current_debug_project = null;
	this.terminal = null;
	this.breakpoints = null;
};

org.goorm.plugin.nodejs.prototype = {
	init: function () {
		var self = this;

		this.add_project_item();
		
		this.mainmenu = core.module.layout.mainmenu;
		
		//this.debugger = new org.uizard.core.debug();
		//this.debug_message = new org.uizard.core.debug.message();
		
		this.cErrorFilter = /[A-Za-z]* error: [A-Za-z0-9 '",:_\\\/\.\+\-\*\#\@]*/;
		this.cWarningFilter = /[A-Za-z]* warning: [A-Za-z0-9 '",:_\\\/\.\+\-\*\#\@]*/;
		this.lineFilter = /:[0-9]*:/;
		
		this.add_mainmenu();
		this.add_toobar();

		this.add_menu_action();

		$(core).bind('goorm_login_complete', function(){
			self.socket = io.connect();
			self.init_socket_connect();
		})

		if(core.status.login_complete) {
			self.socket = io.connect();
			self.init_socket_connect();
		}
	},
	
	add_project_item: function () {
		$("div[id='project_new']").find(".project_types").append("<div class='project_wizard_first_button' project_type='nodejsp'><div class='project_type_icon'><img src='/org.goorm.plugin.nodejs/images/nodejs.png' class='project_icon' /></div><div class='project_type_title'>node.js Project</div><div class='project_type_description'>Server-side Javascript Project with node.js</div></div>");
		
		$("div[id='project_new']").find(".project_items").append("<div class='project_wizard_second_button all nodejsp' description='  Create New Project for nodejs' project_type='nodejs'  plugin_name='org.goorm.plugin.nodejs'><img src='/org.goorm.plugin.nodejs/images/nodejs_console.png' class='project_item_icon' /><br /><a>Nodejs Project</a></div>");

		
		$("div[id='project_new']").find(".project_items").append("<div class='project_wizard_second_button all nodejsp' description='  Create New Express Project for nodejs' project_type='nodejs'  plugin_name='org.goorm.plugin.nodejs'><img src='/org.goorm.plugin.nodejs/images/nodejs_console.png' class='project_item_icon' /><br /><a>Express Project</a></div>");
		

		$(".project_dialog_type").append("<option value='c'>nodejs Projects</option>").attr("selected", "");
		
	},
	
	add_mainmenu: function () {
		var self = this;
		
		$("ul[id='plugin_new_project']").append("<li class=\"yuimenuitem\"><a class=\"yuimenuitemlabel\" href=\"#\" action=\"new_file_nodejs\" localizationKey='file_new_nodejs_project'>node.js Project</a></li>");
		$("#Project ul:first-child").append("<li class=\"yuimenuitem\"><a class=\"yuimenuitemlabel\" href=\"#\" action='stop' style='background-image: url(configs/toolbars/org.goorm.core.project/image/control_stop.png); display:none;' localization_key='project_stop'>Stop<em class='helptext'>Ctrl + C</em></a></li>");
		//this.mainmenu.render();
	},

	add_toobar: function() {
		$('[id="project.toolbar"]').prepend("<a action='stop' tooltip=\"project_stop\" style=\"display:none;\"><div class=\"toolbar_button stop\" style=\"background:url('configs/toolbars/org.goorm.core.project/image/control_stop.png') no-repeat; width:16px; height: 16px; background-position: center;\"></div></a>");
	},
	
	add_menu_action: function () {
		var self = this;

		$("a[action=new_file_nodejs]").unbind("click");
		$("a[action=new_file_nodejs]").click(function () {
			core.dialog.new_project.show();
			$(".project_wizard_first_button[project_type=nodejsp]").trigger("click");
			$("#project_new").find(".project_types").scrollTop($(".project_wizard_first_button[project_type=nodejsp]").position().top - 100);
		});

		$(core).bind('terminal_key_hook-ctrl+c', function(){
			if( core.status.current_project_type == 'nodejs' ) {
				self.stop({
					'terminal' : true
				});
			}
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

		switch(data.project_detailed_type) {
		case "Express Project": 
			data.project_detailed_type="express";
			data.plugins["org.goorm.plugin.nodejs"]["plugin.nodejs.main"] = "app";
			break;
		case "Nodejs Project":
		default:
			data.project_detailed_type="default";
			data.plugins["org.goorm.plugin.nodejs"]["plugin.nodejs.main"] = "main";
		}
		
		var send_data = {
				"plugin" : "org.goorm.plugin.nodejs",
				"data" : data
		};

		$.get('/plugin/new', send_data, function(result){
			setTimeout(function(){
				var property = core.property.plugins['org.goorm.plugin.nodejs'];

				var filepath = core.status.current_project_path + '/';
				var filename = property['plugin.nodejs.main']+'.js';
				var filetype = 'js';

				core.module.layout.workspace.window_manager.open(filepath, filename, filetype, null, {});
				core.module.layout.project_explorer.refresh();
				$(core).trigger("on_project_open");
			}, 500);

		});
	},
	
	run: function(path) {
		var self=this;
		var property = core.property.plugins['org.goorm.plugin.nodejs'];
		
		var source_path = property['plugin.nodejs.source_path'];
		var main = property['plugin.nodejs.main'];

		var project_path = core.status.current_project_path;

		

		
		var workspace = core.preference.workspace_path;
		var run_path = workspace + project_path + '/' + source_path + main + '.js';

		var cmd1 = "node " + run_path;

		core.module.layout.terminal.send_command(cmd1+'\r');
		
	},
	
	stop: function(__option){
		var self=this;
		
		var option = (__option) ? __option : {};
		var terminal = option.terminal;

		var property = core.property.plugins['org.goorm.plugin.nodejs'];
		
		var source_path = property['plugin.nodejs.source_path'];
		var main = property['plugin.nodejs.main'];

		var project_path = core.status.current_project_path;

		if(core.service_mode) {
			var postdata = {
				'data' : {
					'project_path' : project_path,
					'source_path' : source_path,
					'main' : main
				},
				'plugin' : self.full_name,
				'extend_function' : 'stop'
			};

			$.get('/plugin/extend_function', postdata, function(response){
				if(response.result){
					if(!terminal) {
						var msg = {
							user : core.user.id,
							index: core.module.layout.terminal.index,
							command: response.command,
							special_key: response.special_key
						};

						if(!self.socket) {
							self.socket = io.connect();
						}

						self.socket.emit("pty_execute_command", JSON.stringify(msg));
					}

					$("a[action=run]").show();
					$("a[action=stop]").hide();
				}
				else{
					// fail to run a app.
					// 
					switch(response.code){
						case 0:
						case 2:
						case 10:
						case 11:
							core.module.toast.show(core.module.localization.msg['alert_stop_fail'])
							break;
					}
				}
			});
		} else {
			if(terminal) {
				var cmd = "\x03"
				core.module.layout.terminal.send_command(cmd+'\r');
			}
		}
	},

	debug: function (path) {
		var self = this;
		var property = core.property.plugins['org.goorm.plugin.nodejs'];
		var table_variable = core.module.debug.table_variable;
		var debug_module = core.module.debug;
		this.terminal = core.module.layout.workspace.window_manager.open("/", "debug", "terminal", "Terminal").terminal;
		this.current_debug_project = path;
		this.prompt = /debug>/;
		this.terminal.debug_endstr = /program terminated/;
		
		// debug탭 초기화
		table_variable.initializeTable();
		table_variable.refreshView();
		
		this.breakpoints = [];
		
//		// debug start!
		var send_data = {
				"plugin" : "org.goorm.plugin.nodejs",
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
		
//		$(debug_module).off("value_changed");
//		$(debug_module).on("value_changed",function(e, data){
//			self.terminal.send_command("set "+data.variable+"="+data.value+"\r", self.prompt);
//		});
		
		$(debug_module).off("debug_end");
		$(debug_module).on("debug_end",function(){
			table_variable.initializeTable();
			table_variable.refreshView();
			
			$.get("/remove_port", {
				"port": self.debug_port
			});
			
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
		var property = core.property.plugins['org.goorm.plugin.nodejs'];
		var table_variable = core.module.debug.table_variable;
		
		var main = property['plugin.nodejs.main'];
		var buildPath = " "+property['plugin.nodejs.source_path'];
		
		if(this.terminal === null) {
			// console.log("no connection!");
			var result = {result:false, code:6};
			core.module.project.display_error_message(result, 'alert');
			return ;
		}
				
		switch (cmd.mode) {
			case 'init':
				if(core.service_mode) {
					var property = core.property.plugins['org.goorm.plugin.nodejs'];
					
					var source_path = property['plugin.nodejs.source_path'];
					var main = property['plugin.nodejs.main'];

					var project_path = core.status.current_project_path;

					var postdata = {
						'data' : {
							'project_path' : project_path,
							'source_path' : source_path,
							'main' : main
						},
						'plugin' : self.full_name,
						'extend_function' : 'replace_app_port'
					};

					$.get('/plugin/extend_function', postdata, function(replace_app_port){
						if(replace_app_port.result){
							self.debug_port = replace_app_port.port || 5858;
							self.terminal.flush_command_queue();

							var cmd1 = "node debug --port=" + self.debug_port + " " + replace_app_port.run_path;
							self.terminal.send_command(cmd1+'\r');

							setTimeout(function(){
								self.terminal.send_command("\r", /connecting.*ok/);
								self.set_breakpoints();
								self.debug_get_status();
							}, 1000);
						}
					});
				} else {
					$.getJSON("/alloc_port", {
						"process_name": "node debug"
					}, function(result){
						self.debug_port = result.port;

						self.terminal.flush_command_queue();
						self.terminal.send_command("node debug --port=" + result.port+buildPath+main+"\r", null);
						setTimeout(function(){
							self.terminal.send_command("\r", /connecting.*ok/);
							self.set_breakpoints();
							self.debug_get_status();
						}, 1000);
					});
				}
				// $.getJSON("/alloc_port", {
				// 	"process_name": "node debug"
				// }, function(result){
				// 	self.debug_port = result.port;
				// 	self.terminal.flush_command_queue();
				// 	self.terminal.send_command("node debug --port=" + result.port+buildPath+main+"\r", null);
				// 	setTimeout(function(){
				// 		self.terminal.send_command("\r", /connecting.*ok/);
				// 		self.set_breakpoints();
				// 		self.debug_get_status();
				// 	}, 1000);
					
				// })
				break;
			case 'continue':
				self.set_breakpoints();
				self.terminal.send_command("cont\r", self.prompt, function(){
					setTimeout(function(){
						self.debug_get_status();
					}, 500);
				}); break;
				break;
			case 'terminate':
				self.terminal.flush_command_queue();
				self.terminal.send_command("quit\r", self.prompt);
				
				table_variable.initializeTable();
				table_variable.refreshView();
				
				// $.get("/remove_port", {
				// 	"port": self.debug_port
				// });
				
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
					setTimeout(function(){
						self.debug_get_status();
					}, 500);
				}); break;
			case 'step_in':
				self.set_breakpoints();
				self.terminal.send_command("step\r", self.prompt, function(){
					setTimeout(function(){
						self.debug_get_status();
					}, 500);
				}); break;
			case 'step_out':
				self.set_breakpoints();
				self.terminal.send_command("out\r", self.prompt, function(){
					setTimeout(function(){
						self.debug_get_status();
					}, 500);
				}); break;
			default:
				break;
		}
	},
	
	debug_get_status: function(){
		var self = this;
		this.terminal.send_command("backtrace\r", this.prompt, function(terminal_data){
			self.set_currentline(terminal_data);
		});
		
		// nodejs에서 전체 variable을 볼수있는 명령어가 없음.
//		this.terminal.send_command("locals\r", this.prompt, function(terminal_data){
//			self.set_debug_variable(terminal_data);
//		});
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
			if(line == '') return;
			
			// 현재 라인 처리
			var regex = /#0 (.*):([\d]+):([\d]+)/;
			if(regex.test(line)) {
				var match = line.match(regex);
				var filename = match[1];
				var line_number = match[2];
				
				var windows = core.module.layout.workspace.window_manager.window;
				for (var j=0; j<windows.length; j++) {
					var window = windows[j];
					if (window.project == self.current_debug_project 
							&& window.filename == filename) {
						window.editor.highlight_line(line_number);
					}
				}
			}
		});
	},
	
	set_debug_variable: function(terminal_data){
		var lines = terminal_data.split('\n');
		var table_variable = core.module.debug.table_variable;
		
		table_variable.initializeTable();
		
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
		table_variable.refreshView();
	},
	
	set_breakpoints: function(){
		var self = this;
		var property = core.property.plugins['org.goorm.plugin.nodejs'];
		var windows = core.module.layout.workspace.window_manager.window;
		var remains = [];
		var breakpoints = [];
		for (var i=0; i < windows.length; i++) {
			var window = windows[i];

			if (window.project == this.current_debug_project) {
				var filename = window.filename;
				var filepath = window.filepath;
				if(window.editor === null) continue;				
				
				for (var j = 0; j < window.editor.breakpoints.length; j++) {
					var breakpoint = window.editor.breakpoints[j];
					breakpoint += 1;
					filename = filename.split('.js')[0];
					breakpoint = "'" + filename + "', " + breakpoint;
					
					breakpoints.push(breakpoint);
				}
			}
		}
		
		for(var j=0; j < self.breakpoints.length; j++) {
			remains.push(self.breakpoints[j]);
		}
		
		if(breakpoints.length > 0){
			for(var j=0; j < breakpoints.length; j++) {
				var breakpoint = breakpoints[j];
				var result = remains.inArray(breakpoint);
				if(result == -1) {
					self.terminal.send_command("setBreakpoint(" + breakpoint + ")\r", />|(main\[[\d]\][\s\n]*)$/);
					self.breakpoints.push(breakpoint);
				}
				else {
					remains.remove(result);
				}
			}
		}
		else {
			// no breakpoints
		}
				
		for(var j=0; j < remains.length; j++) {
			var result = self.breakpoints.inArray(remains[j]);
			if(result != -1) {
				self.breakpoints.remove(result);
				self.terminal.send_command("clearBreakpoint(" + remains[j] + ")\r", />|(main\[[\d]\][\s\n]*)$/);
			}
		}

	},
	
	// build: function (projectName, callback) {
	// 	var self=this;
		
	// 	console.log("build not needed for nodejs.");
		
	// 	if(callback) callback();
	// },
	// clean: function(){
	// 	console.log("nodejs clean");
	// },

	init_socket_connect: function() {
		var self = this;
		if(!this.socket)
			this.socket = io.connect();

		this.socket.on('nodejs_info', function(data){
			var data = JSON.parse(data);

			var message = {
				'data' : {},
				'fn' : function(){
					self.init_dialog(data);
					core.module.auth.message.updating_process_running = false;
				}
			}

			core.module.auth.message.push(message);
		});

		this.socket.on('nodejs_prj_info', function(data){
			var data = JSON.parse(data);

			var message = {
				'data' : {},
				'fn' : function(){
					self.init_prj_dialog(data);
					core.module.auth.message.updating_process_running = false;
				}
			}

			core.module.auth.message.push(message);
		});

		$(document).off('click', '.running_app_button')
		$(document).on('click', '.running_app_button', function(){
			var target = $(this).html();
			window.open(target, '_blank')
		})
	},

	get_html : function(message){
		if(message.type == 'nodejs_info'){
			var html = "";
			var __class = message.checked ? 'checked' : 'unchecked';
			var content = core.module.localization.msg['notice_nodejs_app_running'] + message.data.service_path;

			html 	+= '<div class="'+__class+'"><div class="message_head" _id="'+message._id+'">[node.js App running information] </div><div class="message_content">'+content+'</div></div>';
			return html;
		}
		else if(message.type == 'nodejs_prj_info'){
			var html = "";
			var __class = message.checked ? 'checked' : 'unchecked';
			var content = core.module.localization.msg['notice_nodejs_db_access'] + message.data.db_pw;

			html 	+= '<div class="'+__class+'"><div class="message_head" _id="'+message._id+'">[node.js App db information] </div><div class="message_content">'+content+'</div></div>';
			return html;
		}
	},

	action : function(message){
		if(message.type == 'nodejs_info'){
			this.init_dialog(message.data);
		}
		else if(message.type == 'nodejs_prj_info'){
			this.init_prj_dialog(message.data);
		}
	},

	init_dialog : function(data){
		var handle_close = function(){
			this.hide();
		}

		var buttons = [{ id:"gPluginNodejsInfoB_Close", text:"<span localization_key='close'>Close</span>",  handler:handle_close}]

		self.dialog = org.goorm.core.collaboration.message.dialog;
		self.dialog.init({
			localization_key:"title_nodejs_info",
			title:"node.js App running information", 
			path:"configs/dialogs/org.goorm.core.plugin/plugin.nodejs.info.html",
			width:450,
			height:120,
			modal:true,
			buttons: buttons,
			duplicated: true,
			success: function () {
				var container_id = this.container_id
				$('[id="'+container_id+'"]').find('.nodejs_information_span').append(core.module.localization.msg['notice_nodejs_app_running'] + '<br><a class="running_app_button" style="cursor:pointer;font-weight:bold;">' + data.service_path +'</a>');

				self.dialog = self.dialog.dialog;
				this.panel.show();
			}
		})
	},

	init_prj_dialog : function(data){
		var handle_close = function(){
			this.hide();
		}

		var buttons = [{ id:"gPluginNodejsProjectInfoB_Close", text:"<span localization_key='close'>Close</span>",  handler:handle_close}]

		self.dialog = org.goorm.core.collaboration.message.dialog;
		self.dialog.init({
			localization_key:"title_nodejs_info",
			title:"node.js App db information", 
			path:"configs/dialogs/org.goorm.core.plugin/plugin.nodejs.info.html",
			width:600,
			height:120,
			modal:true,
			buttons: buttons,
			duplicated: true,
			success: function () {
				var container_id = this.container_id
				$('[id="'+container_id+'"]').find('.nodejs_information_span').append(core.module.localization.msg['notice_nodejs_db_access'] + '<br>'+core.user.id+'\'s MySQL, MongoDB Password : <span style="font-weight:bold;">' + data.db_pw +'</span>');

				self.dialog = self.dialog.dialog;
				this.panel.show();
			}
		})
	},
};