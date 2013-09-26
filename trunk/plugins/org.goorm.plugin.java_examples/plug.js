/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jslint evil: true, devel: true, node: true, plusplus: true, unparam: false */
/*global mongoose: true, Scheme: true, org: true, core: true, goorm: true, io: true */

org.goorm.plugin.java_examples = function () {
	this.name = "java_examples";
	this.dialogs={};
	this.mainmenu = null;
	this.current_debug_project = null;
	this.terminal = null;
	this.breakpoints = null;
	this.preference = null;
	this.error_message_save=[];
	this.error_marker=[];
	this.output_tab=null;
};

org.goorm.plugin.java_examples.prototype = {
	init: function () {
		var self=this;
		this.add_project_item();

		
		
		this.mainmenu = core.module.layout.mainmenu;
		
		//this.debugger = new org.uizard.core.debug();
		//this.debug_message = new org.uizard.core.debug.message();
		this.cErrorFilter = /[A-Za-z]* error: [A-Za-z0-9 '",:_\\\/\.\+\-\*\#\@]*/;
		this.packageFilter = /[ '",:\\\/\+\-\*\#\@]/g;
		this.cWarningFilter = /[A-Za-z]* warning: [A-Za-z0-9 '",:_\\\/\.\+\-\*\#\@]*/;
		this.lineFilter = /:[0-9]*:/;
		
		this.add_mainmenu();
		this.add_menu_action();

		$(core).on('on_project_open',function(){
			self.add_menu_action();
			self.add_output_tab();
		});

		this.init_dialog();
		this.preference = core.preference.plugins['org.goorm.plugin.java_examples'];
	},
	
	add_project_item: function () {
		$("div[id='project_new']").find(".project_types").append("<div class='project_wizard_first_button' project_type='javaexamp'><div class='project_type_icon'><img src='/org.goorm.plugin.java_examples/images/java.png' class='project_icon' /></div><div class='project_type_title'>Java Example Project</div><div class='project_type_description'>Java Project using SUN Java Compiler Collection</div></div>");
		
		$("div[id='project_new']").find(".project_items").append("<div class='project_wizard_second_button all javaexamp' description='  Create New Project for Java' project_type='java_examples' plugin_name='org.goorm.plugin.java_examples'><img src='/org.goorm.plugin.java_examples/images/java_console.png' class='project_item_icon' /><br /><a>Java Inherit</a></div>");
		$("div[id='project_new']").find(".project_items").append("<div class='project_wizard_second_button all javaexamp' description='  Create New Project for Java' project_type='java_examples' plugin_name='org.goorm.plugin.java_examples'><img src='/org.goorm.plugin.java_examples/images/java_console.png' class='project_item_icon' /><br /><a>Java Thread</a></div>");
		$("div[id='project_new']").find(".project_items").append("<div class='project_wizard_second_button all javaexamp' description='  Create New Project for Java' project_type='java_examples' plugin_name='org.goorm.plugin.java_examples'><img src='/org.goorm.plugin.java_examples/images/java_console.png' class='project_item_icon' /><br /><a>Java File IO</a></div>");
		$("div[id='project_new']").find(".project_items").append("<div class='project_wizard_second_button all javaexamp' description='  Create New Project for Java' project_type='java_examples' plugin_name='org.goorm.plugin.java_examples'><img src='/org.goorm.plugin.java_examples/images/java_console.png' class='project_item_icon' /><br /><a>Java HashMap Usage</a></div>");
		$("div[id='project_new']").find(".project_items").append("<div class='project_wizard_second_button all javaexamp' description='  Create New Project for Java' project_type='java_examples' plugin_name='org.goorm.plugin.java_examples'><img src='/org.goorm.plugin.java_examples/images/java_console.png' class='project_item_icon' /><br /><a>Java Exception Usage</a></div>");

		
		$(".project_dialog_type").append("<option value='java_examples'>Java Example Projects</option>").attr("selected", "");;
		
	},
	
	add_mainmenu: function () {
		var self = this;
		
		$("ul[id='plugin_new_project']").append("<li class=\"yuimenuitem\"><a class=\"yuimenuitemlabel\" href=\"#\" action=\"new_file_java_example\" localizationKey='file_new_java_example_project'>Java Example Project</a></li>");
		//this.mainmenu.render();
	},

	add_output_tab: function(){
		var self = this;
		var tabview = core.module.layout.inner_bottom_tabview;

		if(tabview.output_manager) {
			$("#output_tab").html("");
			tabview.removeTab(tabview.output_tab);
			tabview.output_manager.detach();

			tabview.output_tab = null;
			tabview.output_manager = null;
		}

		if(core.status && /java/.test(core.status.current_project_type) && $("#output_tab").length == 0){
			self.attach_output(tabview);
		}
	},

	add_menu_action: function () {
		var self =this;

		var show_template_menu = function() {
			$("#new_java_interface_context").css("display","")
			$("#new_java_class_context").css("display","")
			$("#new_java_package_context").css("display","")
			$("#folder_open_context_ul").css("display","")
		}

		var hide_template_menu = function() {
			if($("#new_java_interface_context")) $("#new_java_interface_context").css("display","none")
			if($("#new_java_class_context")) $("#new_java_class_context").css("display","none")
			if($("#new_java_package_context")) $("#new_java_package_context").css("display","none")
			if($("#folder_open_context_ul")) $("#folder_open_context_ul").css("display","none")
		}

		var init_template_menu = function() {
			if($("#folder_open_context_ul").length == 0){
				$("#folder_open_context_div").append("<ul id='folder_open_context_ul'></ul>")
			}
			if($("#new_java_package_context").length == 0){
				$("#folder_open_context_ul").append("<li class='yuimenuitem'><a class='yuimenuitemlabel' href='#' id='new_java_package_context' action='new_java_package_action'>Package</a></li>");
			}
			if($("#new_java_class_context").length == 0){
				$("#folder_open_context_ul").append("<li class='yuimenuitem'><a class='yuimenuitemlabel' href='#' id='new_java_class_context' action='new_java_class_action'>Class</a></li>");
			}
			if($("#new_java_interface_context").length == 0){
				$("#folder_open_context_ul").append("<li class='yuimenuitem'><a class='yuimenuitemlabel' href='#' id='new_java_interface_context' action='new_java_interface_action'>Interface</a></li>");
			}
		}

		var bind_action_to_template_menu = function() {
			$("a[action=new_java_package_action]").off("mousedown");
			$("a[action=new_java_package_action]").mousedown(function() {
				var filepath=core.status.selected_file;
				if(filepath.indexOf("/src")>=0){
					var project_name = core.status.current_project_path;
					var source_path=project_name+"/src"
					$("#java_examples_package_name").val(filepath.substring(filepath.indexOf(source_path)+source_path.length+1).replace(/\//g,"."));
					$("#java_examples_package_source_folder").val(source_path)
					$("#java_examples_package_source_folder").attr("disabled","disabled")
					self.dialogs['package'].panel.show();
				}else{
					alert.show("Not source folder please make in src folder");
				}
			});
			
			$("a[action=new_java_class_action]").off("mousedown");
			$("a[action=new_java_class_action]").mousedown(function() {
				var filepath=core.status.selected_file;
				if(filepath.indexOf("/src")>=0){

					var project_name = core.status.current_project_path;
					var source_path=project_name+"/src"
					$("#java_examples_class_package").val(filepath.substring(filepath.indexOf(source_path)+source_path.length+1).replace(/\//g,"."))
					$("#java_examples_class_source_folder").val(project_name+"/src")
					$("#java_examples_class_source_folder").attr("disabled","disabled")
					
					self.dialogs['class'].panel.show();
				}else{
					alert.show("Not source folder please make in src folder");
				}
			});

			$("a[action=new_java_interface_action]").off("mousedown");
			$("a[action=new_java_interface_action]").mousedown(function() {
				var filepath=core.status.selected_file;
				if(filepath.indexOf("/src")>=0){
					var project_name = core.status.current_project_path;
					var source_path=project_name+"/src";

					$("#java_examples_interface_package").val(filepath.substring(filepath.indexOf(source_path)+source_path.length+1).replace(/\//g,"."))
					$("#java_examples_interface_source_folder").val(project_name+"/src")
					$("#java_examples_interface_source_folder").attr("disabled","disabled")
					
					self.dialogs['interface'].panel.show();
				}else{
					alert.show("Not source folder please make in src folder");
				}						
			});

			$('a[action=new_java_package_action], a[action=new_java_class_action], a[action=new_java_interface_action]').off('hover');
			$('a[action=new_java_package_action], a[action=new_java_class_action], a[action=new_java_interface_action]').hover(function(e){
				$('#folder_open_context_ul').find('.yuimenuitemlabel-selected').removeClass('yuimenuitemlabel-selected').parent().removeClass('yuimenuitem-selected');

				$(this).addClass('yuimenuitemlabel-selected');
				$(this).parent().addClass('yuimenuitem-selected');

				e.stopPropagation();
				e.preventDefault();
				return false;
				
			}, function(){
				$('#folder_open_context_ul').find('.yuimenuitemlabel-selected').removeClass('yuimenuitemlabel-selected').parent().removeClass('yuimenuitem-selected');
			});

			$('a[action=new_java_package_action], a[action=new_java_class_action], a[action=new_java_interface_action]').off('blur');

		}

		$("a[action=new_context]").off("hover");
		$("a[action=new_context]").hover(function(e) {
			
			var filename = (core.status.selected_file.split("/")).pop();
			var filetype = null;
			if(filename.indexOf(".") != -1)
				filetype = (filename.split(".")).pop();

			if(!filetype){
				if(/java/.test(core.property['type'])){
					
					show_template_menu();
					init_template_menu();
					bind_action_to_template_menu();

				}else{
					hide_template_menu();
				}
			}
		});
		
		$("a[action=new_file_java_example]").off("click");
		$("a[action=new_file_java_example]").click(function () {
			core.dialog.new_project.show();
			$(".project_wizard_first_button[project_type=javaexamp]").trigger("click");
			$("#project_new").find(".project_types").scrollTop($(".project_wizard_first_button[project_type=javaexamp]").position().top - 100);
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

		var self = this;
		//console.log(data);
		//console.log(data.project_detailed_type);
		/*switch(data.project_detailed_type){
			case  "Java Inherit":
				data.project_detailed_type="Java Inherit";
				break;
			default :
				break;
		}*/
		

		var send_data = {
				"plugin" : "org.goorm.plugin.java_examples",
				"data" : data
		};
		
		$.get('/plugin/new', send_data, function(result){
			// 가끔씩 제대로 refresh가 안됨.
			// because it takes some time to copy template
			setTimeout(function(){
				var property = core.property.plugins['org.goorm.plugin.java_examples'];
				
				var main_file_path="";
				main_file_path+=core.status.current_project_path + '/' + property['plugin.java_examples.source_path'];
				main_file_path+=property['plugin.java_examples.main']+'.java';
				
				var filename = (main_file_path.split("/")).pop();
				var filepath = main_file_path.replace(filename, "");
				var filetype = 'java';

				core.module.layout.workspace.window_manager.open(filepath, filename, filetype, null, {});

				core.module.layout.project_explorer.refresh();
				$(core).trigger("on_project_open");
				
			}, 500);
		});
	},
	
	run: function(path) {
		var self=this;
		var property = core.property.plugins['org.goorm.plugin.java_examples'];
		
		var workspace = core.preference.workspace_path;
		var projectName = core.status.current_project_path+"/";
		var classpath = property['plugin.java_examples.build_path'];
		var classname = property['plugin.java_examples.main'];
		var cmd1 = "java -cp "+workspace+projectName+classpath+" "+classname;
		core.module.layout.terminal.send_command('clear;\r', null);
		core.module.layout.terminal.send_command(cmd1+'\r', null, function(result){
			// var reg = /(.*)\w/g;
			// var message = result.replace(cmd1, "").match(reg);
			// message.pop();
			// //console.log(result,message);
			// if(/NoClassDefFoundError/g.test(message)) {
			// 	// 실행 실패
			// 	alert.show("클래스 파일이 존재하지않거나 경로가 옳바르지 않습니다.<br>프로젝트를 빌드 하시거나 경로설정을 확인하시기 바랍니다.");
			// }
			// else {
			// 	// 아무 메시지도 안떴으면 성공.
			// 	//notice.show("성공적으로 실행되었습니다.");
			// 	org.goorm.core.utility.toast.show(
			// 		core.module.localization.msg['alert_plugin_run_success']
			// 		,1000
			// 		,function(){
			// 			org.goorm.core.layout.terminal.focus();
			// 		}
			// 	);
				
			// }
		});
		setTimeout(function(){
			core.module.toast.show(core.module.localization.msg['alert_plugin_check_terminal']);
		},1000);

	},
	
	debug: function (path) {
		var self = this;
		var property = core.property.plugins['org.goorm.plugin.java_examples'];
		var table_variable = core.module.debug.table_variable;
		var debug_module = core.module.debug;
		this.terminal = core.module.layout.workspace.window_manager.open("/", "debug", "terminal", "Terminal").terminal;
		this.current_debug_project = path;
		this.prompt = /(main\[[\d]\][\s\n]*)$/;
		this.terminal.debug_endstr = /application exited/;
		$("#debug_center table tbody").css("outline", "none")
		// debug탭 초기화
		table_variable.initializeTable();
		table_variable.refreshView();
		
		this.breakpoints = [];
		
		// debug start!
		$("#debug_center table tbody").css("outline", "none")
		var send_data = {
				"plugin" : "org.goorm.plugin.java_examples",
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
		// 	self.terminal.send_command("set "+data.variable+"="+data.value+"\r", self.prompt);
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
		var property = core.property.plugins['org.goorm.plugin.java_examples'];
		var table_variable = core.module.debug.table_variable;
		
		var workspace = core.preference.workspace_path;
		var projectName = core.status.current_project_path+"/";
		var mainPath = property['plugin.java_examples.main'];
		var buildPath = property['plugin.java_examples.build_path'];
		
		//		if(this.terminal === null) {
		//			// console.log("no connection!");
		//			var result = {result:false, code:6};
		//			core.module.project.display_error_message(result, 'alert');
		//			return ;
		//		}
		switch (cmd.mode) {
		case 'init' :
			self.terminal.send_command("jdb -classpath "+workspace+projectName+buildPath+" "+mainPath+"\r", null);
			self.set_breakpoints();
			self.terminal.send_command("run\r", />/, function(){
				self.debug_get_status();
			});
			break;
		case 'continue':
			self.set_breakpoints();
			self.terminal.send_command("cont\r", self.prompt, function(){
				self.debug_get_status();
			}); break;
		case 'terminate':
		//			self.set_breakpoints();
			self.terminal.flush_command_queue();
			self.terminal.send_command("exit\r", self.prompt); 
			
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
			self.terminal.send_command("step up\r", self.prompt, function(){
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

		// Timing Problem
		//
		setTimeout(function(){
			self.terminal.send_command("locals\r", self.prompt, function(local_terminal_data){
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
			if(line == '') return;
			// 현재 라인 처리
			var regex = /\[1\].*\((.*):([\d]+)\)/;
			if(regex.test(line)) {
				var match = line.match(regex);
				var filename = match[1];
				var line_number = match[2];
				
				var windows = core.module.layout.workspace.window_manager.window;
				for (var j=0; j<windows.length; j++) {
					var window = windows[j];
					if (window.project == self.current_debug_project 
							&& window.filename == filename) {

						if(typeof(line_number) == "string") line_number = parseInt(line_number);

						window.editor.highlight_line(line_number-1);
					}
				}
			}
		});
	},
	set_debug_variable: function(terminal_data){
		var self = this;
		var lines = terminal_data.split('\n');
		var table_variable = core.module.debug.table_variable;
		var group = 0;
		table_variable.initializeTable();
		$("#debug_left").width(250);
		$.each(lines, function(i, line){
			if(line == '') return;
			
			// local variable 추가
			var len;
			var variable = line.split(' = ');
			var summary = line.split('.');
			
			if(summary.length != 1){

				summary = summary[summary.length-1];

				if(summary){
					/*if(/\[/.test(summary)){
						summary = summary.slice(0,summary.indexOf('['));
						len = summary.slice(summary.indexOf('['), summary.indexOf(']'));
					}else{
						summary = summary.slice(0, summary.indexOf('('));
					}*/
					summary = summary.slice(0, summary.indexOf('('));
				}

			}else{

				if(/instance of/.test(summary[0])){
					summary = summary[0].slice(15, summary[0].length);
					summary = summary.slice(0, summary.indexOf('('));
				}else{
					summary = " ";	
				}
			}
			//console.log(summary);
			if (variable.length == 2) {
				if(summary != " "){
					table_variable.addRow({
						"variable": "<img class='debug_plus' src='/images/org.goorm.core.layout/small_plus.jpg'></img>"+"<div class='expand_row' num = '1' type='"+summary+"' group='"+group+"' show='"+false+"'>"+ variable[0].trim()+"</div>",
						"value": variable[1].trim(),
						"summary": summary
					});
					group++;
				}else{
					table_variable.addRow({
						"variable": variable[0].trim(),
						"value": variable[1].trim(),
						"summary": summary
					});
				}
				
			}
		});
		table_variable.refreshView();


		$(core.module.debug.table_variable).on('click_row',function(event, data){
			var self_this = data.target.find('.expand_row');
			var group = $(self_this).attr('group');
			var img = data.target.find('.debug_plus');
			if(/\[/.test($(self_this).attr('type'))){
				if($(self_this).attr('show') == 'false'){
					self.terminal.send_command("dump "+$(self_this).text()+"\r", self.prompt, function(local_terminal_data){
						var datas = local_terminal_data.replace(/\n/g, "");
						var line = {};
						datas = datas.slice(datas.indexOf("{")+1, datas.indexOf("}")-1).split(',');
						$.each(datas, function(i,o){
							line.variable = i;
							line.data = o;
							line.type = "";
							self.add_subrow(data.index, line,group, self_this, false, i);
						})
						$(self_this).attr('show', 'true')
						$(img).attr('src','/images/org.goorm.core.layout/minus_icon.jpg');
					});	
				}else{
					var num = $(self_this).attr('num');
					var lines = $('div [group="'+$(self_this).attr('group')+'"]');
					var length = 0;
					for(var i=0;i<lines.length;i++){
						if($(lines[i]).attr('num') > num){
							length++;
						}
					}
					table_variable.deleteRows(data.index+1, length);
					$(self_this).attr('show', 'false');
					$(img).attr('src','/images/org.goorm.core.layout/small_plus.jpg');
				}
			}else{
				if($(self_this).attr('show') == 'false'){
					var command = "";
					if(/\bArrayList\b|\bHashMap\b|\bList\b|\bHashSet\b|\bHashtable\b|\bVector\b|\bStack\b/.test($(self_this).attr('type'))){
						command = "print "+$(self_this).text()+"\r";
					}else{
						command = "dump "+$(self_this).text()+"\r";
					}
					if($(self_this).attr('parent')){
						if($(self_this).attr('parent_type') == "HashSet"){
							command = "dump "+$(self_this).attr('parent')+".toArray()["+$(self_this).text()+"]"+"\r";
						}else if($(self_this).attr('parent_type') == "HashMap"){
							command = 'dump '+$(self_this).attr("parent")+'.get("'+$(self_this).text()+'")'+'\r';
						}else{
							command = "dump "+$(self_this).attr('parent')+".get("+$(self_this).text()+")"+"\r";
						}
					}
					self.terminal.send_command(command, self.prompt, function(local_terminal_data){
						var datas = local_terminal_data.replace(/\n/g, "");
						var line = {};
						if(/{/.test(datas)){
							datas = datas.slice(datas.indexOf("{")+1, datas.indexOf("}")).split(',');
						}else{
							datas = datas.slice(datas.indexOf("[")+1, datas.indexOf("]")).split(',');	
						}
						
						$.each(datas, function(i,o){
							o = o.trim();
							line.variable = i;
							line.data = o;
							line.type = $(self_this).attr('type');
							if(line.type=="HashMap"){
								line.variable = o.slice(0, o.indexOf("="));
								line.data = o.slice(o.indexOf("=")+1);
							}
							if(/^([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}@([0-9a-zA-Z_-]+)/.test(o.replace(/=/g, ""))){
								self.add_subrow(data.index, line,group, self_this, true, i);
							}else{
								self.add_subrow(data.index, line,group, self_this, false, i);
							}
						})
						$(self_this).attr('show', 'true')
						$(img).attr('src','/images/org.goorm.core.layout/minus_icon.jpg');
					});	
				}else{
					var num = $(self_this).attr('num');
					var lines = $('div [group="'+$(self_this).attr('group')+'"]');
					var length = 0;
					var start = $.inArray(self_this[0], lines)+1;
					for(var i=start;i<lines.length;i++){
						if($(lines[i]).attr('num') > num){
							length++;
						}else break;
					}
					table_variable.deleteRows(data.index+1, length);
					$(self_this).attr('show', 'false');
					$(img).attr('src','/images/org.goorm.core.layout/small_plus.jpg');
				}
			}
			
		});
	},
	add_subrow: function(index, line, group, self_this, expandable, i){
		var table_variable = core.module.debug.table_variable;
		if(expandable){
			table_variable.addRow({
				//file_button_last.gif
				"variable" : "<img class='debug_plus' style='margin-left:"+(10*$(self_this).attr('num'))+"px !important;' src='/images/org.goorm.core.layout/small_plus.jpg'></img><div group='"+group+"' class='expand_row' parent_type='"+line.type+"' num = '"+(parseInt($(self_this).attr('num'))+1)+"' style='margin-left:"+(10*$(self_this).attr('num')+20)+"px !important;' show='"+false+"' parent='"+$(self_this).text()+"'>"+line.variable+"</div>",
				"value" : line.data,
				"summary" : line.type
			}, index+parseInt(i)+1);
		}else{
			table_variable.addRow({
				"variable" : "<img class='debug_plus' style='margin-left:"+(10*$(self_this).attr('num'))+"px !important;' src='/images/org.goorm.core.layout/file_button_last.gif'></img><div group='"+group+"' type='"+line.type+"' num = '"+(parseInt($(self_this).attr('num'))+1)+"' style='margin-left:"+(10*$(self_this).attr('num')+20)+"px !important;'>"+line.variable+"</div>",
				"value" : line.data,
				"summary" : line.type
			}, index+parseInt(i)+1);
		}
		
	},
	
	set_breakpoints: function(){
		var self = this;
		var property = core.property.plugins['org.goorm.plugin.java_examples'];
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
					var classname = filename.split('.java')[0];
					var __package = filepath.split(property['plugin.java_examples.source_path']).pop();
					__package = __package.replace("/", ".");
					
					breakpoint = __package + classname + ":" + breakpoint;
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
					self.terminal.send_command("stop at "+breakpoint+"\r", />|(main\[[\d]\][\s\n]*)$/);
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
				self.terminal.send_command("clear "+remains[j]+"\r", />|(main\[[\d]\][\s\n]*)$/);
			}
		}

	},
	
	build: function (projectName, callback, is_auto_build, fileName, target) {
		var self=this;
		var workspace = core.preference.workspace_path;
		var property = core.property;
		if(!projectName) {
			projectName = core.status.current_project_path;
		}
		
		var plugin = property.plugins['org.goorm.plugin.java_examples'];
		var buildOptions = " "+plugin['plugin.java_examples.build_option'];
		var buildPath = " "+workspace+projectName+"/"+plugin['plugin.java_examples.build_path'];
		var sourcePath = " "+workspace+projectName+"/"+plugin['plugin.java_examples.source_path'];
		
		var buildPath_guarantee_cmd='';
		buildPath_guarantee_cmd+= 'if [ ! -d '+workspace+projectName+'/'+plugin['plugin.java_examples.build_path']+' ];';
		buildPath_guarantee_cmd+= 'then mkdir -p '+workspace+projectName+'/'+plugin['plugin.java_examples.build_path']+';';
		buildPath_guarantee_cmd+= 'fi;clear;\n\r';


		var cmd = workspace+projectName+"/"+"make"+sourcePath+buildPath+buildOptions;

		if(is_auto_build) {
			core.module.layout.terminal.send_command(buildPath_guarantee_cmd, null);
			core.module.layout.terminal.send_command(cmd+'\r', {'prompt':null, 'no_write':true}, function(result){
				setTimeout(function(){
					core.module.layout.terminal.no_write = false;
				}, 300);

				var window_manager = core.module.layout.workspace.window_manager;
				var __window = window_manager.window[window_manager.active_window];
				var editor = __window.editor;

				var output_manager = self.output_manager;
				var error_manager = editor.error_manager;

				var parsed_data = output_manager.parse(result);

				// init
				//
				self.organize_import(parsed_data);
				error_manager.clear();
				output_manager.clear();

				var is_activated_data = function(target_name, data){
					var filename = data.substring(data.lastIndexOf("/")+1, data.lastIndexOf(":"));

					if(filename.indexOf('/') != -1) {
						filename = filename.substring(filename.lastIndexOf('/')+1);
					}

					if(target_name.indexOf('/') != -1) {
						target_name = target_name.substring(target_name.lastIndexOf('/')+1);
					}

					if(filename == target_name) return true;
					else return false;
				}

				var get_error_data = function(parsed_data, index) {
					var index_data = parsed_data[index];
					var next_data = parsed_data[index+1];

					var line_number = index_data.substring( parseInt(index_data.lastIndexOf(":"))+1 )- 1; // start : 0 ~
					var line_data = editor.editor.getLine(line_number);

					var error_message = next_data.substring(0, next_data.indexOf("\r\n"));

					var error_syntax = next_data.substring(error_message.length);
					if(error_syntax.split("\r\n").length > 3) {
						error_syntax = error_syntax.split("\r\n")[1].substring( error_syntax.split("\r\n")[2].indexOf("^") );
					} else {
						error_syntax = "";
					}

					if( error_message == "" ) {
						error_message = next_data.substring(0, next_data.indexOf(line_data));
						error_syntax = next_data.substring(next_data.indexOf(line_data), next_data.indexOf("^"));
					}

					return {
						'line_number' : line_number,
						'error_message' : error_message,
						'error_syntax' : error_syntax
					}
				}

				for(var i=0; i<parsed_data.length; i++) {
					var data = parsed_data[i];

					if(data && is_activated_data(fileName, data) ) {
						var error_data = get_error_data(parsed_data, i);

						error_manager.add_line(error_data);
						output_manager.push(error_data);
					}
				}

				error_manager.error_message_box.add(target);
				error_manager.init_event();

				$(editor).bind('editor_update', function(){
					error_manager.init_event();
				})

				__window.set_saved();
			});
		}else{
			core.module.layout.terminal.send_command(buildPath_guarantee_cmd, null);
			core.module.layout.terminal.send_command(cmd+'\r', null, function(result){
				// if(/Build Complete/g.test(result)){
				// 	notice.show(core.module.localization.msg['alert_plugin_build_success']);
				// }
				// else {
				// 	alert.show(core.module.localization.msg['alert_plugin_build_error']);
				// }
				core.module.toast.show(core.module.localization.msg['alert_plugin_check_terminal']);
				core.module.layout.project_explorer.refresh();
			});
			if(callback) callback();
		}
	},

	attach_output: function(target) {
		var self = this;
		this.output_tab = null;
		this.output_tab = new YAHOO.widget.Tab({ label: "<span id='gLayoutTab_Output' localization_key='output'>Output</span>", content: "<div id='output_tab'></div>" });

		target.addTab(self.output_tab);
		target.output_tab = this.output_tab;
		target.output_manager = this.output_manager;

		self.output_manager.init(target, $('#output_tab'));

		if(!core.is_mobile) {
			core.module.localization.local_apply('#goorm_inner_layout_bottom .yui-nav', 'dict');
		}
	},

	output_manager : {
		'container' : null,
		'storage' : [],

		init : function(tabview, container) {
			this.tabview = tabview;
			this.attach(tabview, container);
		},

		parse : function(raw){
			if( raw.indexOf(': error: ') > -1 ) {
				var result = raw.split(': error: ');
				return result;
			}
			else{
				var result = raw.split(': ');
				return result;
			}
		},

		attach : function(tabview, container) {
			var self = this;
			this.container = container;

			if($(container).find('#output_table').length != 0) $(container).find('#output_table').remove();
			$(container).append('<div id="output_table"></div>');

			var layout_bottom_height = $("div.yui-layout-unit-bottom div.yui-layout-wrap").height() - 26;
			var layout_bottom_width = $("div.yui-layout-unit-bottom div.yui-layout-wrap").width();

			var table_variable_column_definition = [{
				key: "line_number",
				label: "Line Number",
				sortable: false,
				width : 100
			}, {
				key: "error_message",
				label: "Error Message",
				sortable: false
			}, {
				key: "error_syntax",
				label: "Detail",
				sortable: false
			}];
			
			var table_variable_data_properties = new YAHOO.util.DataSource();
			table_variable_data_properties.responseSchema = {
				resultNode: "property",
				fields: ["line_number", "error_message", "error_syntax"]
			};

			tabview.table_variable = new YAHOO.widget.DataTable("output_table", table_variable_column_definition, table_variable_data_properties);
			tabview.table_variable.set("MSG_EMPTY", "N/A");
			tabview.table_variable.render();

			$(container).height(layout_bottom_height);
			$(container).find('#output_table table').css('width', '100%');
			$(container).find('#output_table table').css('border', 'none');

			$(core).on("layout_resized", function(){
				var layout_bottom_height = $("div.yui-layout-unit-bottom div.yui-layout-wrap").height() - 26;
				var layout_bottom_width = $("div.yui-layout-unit-bottom div.yui-layout-wrap").width();

				$(container).height(layout_bottom_height);
			});

			this.restore();
		},

		detach : function() {
			var container = this.container;
			var tabview = this.tabview;

			if(container) {
				$('#output_table').remove();
			}

			if(tabview) {
				tabview.table_variable = null;
			}
		},

		push : function(data) {
			var tabview = this.tabview;

			if(tabview.table_variable) {
				data.line_number++;
				tabview.table_variable.addRow(data);

				data.line_number--;
				this.storage.push(data);
			}
		},

		restore : function() {
			var tabview = this.tabview;

			if(this.storage.length != 0) {
				for(var i=0; i<this.storage.length; i++) {
					var data = this.storage[i];

					tabview.table_variable.addRow(data);
				}
			}
		},

		clear : function() {
			var tabview = this.tabview;

			if(tabview.table_variable) {
				tabview.table_variable.initializeTable();
				tabview.table_variable.refreshView();

				this.storage = [];
			}
		}
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
		var plugin = property.plugins['org.goorm.plugin.java_examples'];
		var buildPath = plugin['plugin.java_examples.build_path'];
		core.module.layout.terminal.send_command("rm -rf "+workspace+project_name+"/"+buildPath+"* \r", null, function(){
			core.module.layout.project_explorer.refresh();
		});
	},
	make_class: function(){
		var self =this;
		var workspace = core.preference.workspace_path;
		var property = core.property;
		var filepath=core.status.selected_file;
		var project_name = core.status.current_project_path;
		var select=$(":input:radio[name=java_class_modifier]:checked").attr("value");
		var select_check=[];
		$(":input:checkbox[name=java_class_option]").each(function(check){
			if($($(":input:checkbox[name=java_class_option]")[check]).is(':checked'))
				select_check.push($($(":input:checkbox[name=java_class_option]")[check]).attr("value"))
			else{
				select_check.push('')

			}
			//select_check.push($($(":input:checkbox[name=java_class_option]:checked")[check]).attr("value"))

		})
		if(!$("#java_class_name").val()||$("#java_class_name").val()==""){
			alert.show("Type name is empty");
			return ;
		}
		if(self.packageFilter.test($("#java_class_package").val())){
			alert.show("Please check package name again");
			return ;
		}

		var senddata = {
			'filepath':filepath,
			'project_name':project_name,
			'source_folder':$("#java_class_source_folder").val(),
			'methods':select_check,
			'workspace':workspace,
			'package': $("#java_class_package").val(),
			'name':$("#java_class_name").val(),
			'modifier':select,
			'type':'class',
			'plugin':'org.goorm.plugin.java_examples'
				};
		select_check=[];
		$.get("plugin/make_template", senddata, function (data) {
			//console.log("Aasdasdadasdasdadada111")				
			//console.log(data)
			if(data.code==204){

				self.dialogs['class'].panel.hide();
				alert.show("Same name of file already exist for create package")
				return ;
			}else if(data.code==202){

				self.dialogs['class'].panel.hide();
				alert.show("Same name of java file already exist for create class")
				return ;
			}else if(data.code==203){
				self.dialogs['class'].panel.hide();
				alert.show("Package not exist make package first")
				return ;

			}
			
			self.dialogs['class'].panel.hide();
			core.module.layout.project_explorer.refresh();
		});

		//var plugin = property.plugins['org.goorm.plugin.java'];
		//var buildPath = plugin['plugin.java.build_path'];
		//console.log("touch "+workspace+filepath+"/"+"main.java")

		
	},
	make_package: function(){
		var self =this;
		var workspace = core.preference.workspace_path;
		var property = core.property;
		var filepath=core.status.selected_file;
		var project_name = core.status.current_project_path;
		if(!$("#java_package_name").val()||$("#java_package_name").val()==""){
			alert.show("Type name is empty");
			return ;
		}
		if(self.packageFilter.test($("#java_package_name").val())){
			alert.show("Please check package name again");
			return ;
		}
		var senddata = {
			'filepath':filepath,
			'project_name':project_name,
			'source_folder':$("#java_package_source_folder").val(),
			'workspace':workspace,
			'name':$("#java_package_name").val(),
			'type':'package',
			'plugin':'org.goorm.plugin.java_examples'
				};

		$.get("plugin/make_template", senddata, function (data) {
			//console.log("Aasdasdadasdasdadada111")				
			if(data.code==201){

				self.dialogs['package'].panel.hide();
				alert.show("Same name of file already exist for create package")
				return ;
			}


			
			self.dialogs['package'].panel.hide();
			core.module.layout.project_explorer.refresh();
		});

		//var plugin = property.plugins['org.goorm.plugin.java'];
		//var buildPath = plugin['plugin.java.build_path'];
		//console.log("touch "+workspace+filepath+"/"+"main.java")

		
	},
	make_interface: function(){
		var self =this;
		var workspace = core.preference.workspace_path;
		var property = core.property;
		var filepath=core.status.selected_file;
		var project_name = core.status.current_project_path;
		var select=$(":input:radio[name=java_interface_modifier]:checked").attr("value");
		if(!$("#java_interface_name").val()||$("#java_interface_name").val()==""){
			alert.show("Type name is empty");
			return ;
		}
		if(self.packageFilter.test($("#java_interface_package").val())){
			alert.show("Please check package name again");
			return ;
		}
		var senddata = {
			'filepath':filepath,
			'project_name':project_name,
			'source_folder':$("#java_interface_source_folder").val(),
			'workspace':workspace,
			'package': $("#java_interface_package").val(),
			'name':$("#java_interface_name").val(),
			'modifier':select,
			'type':'interface',
			'plugin':'org.goorm.plugin.java_examples'
				};
		$.get("plugin/make_template", senddata, function (data) {
			//console.log("Aasdasdadasdasdadada111")				
			if(data.code==204){

				self.dialogs['interface'].panel.hide();
				alert.show("Same name of file already exist for create package")
				return ;
			}else if(data.code==202){

				self.dialogs['interface'].panel.hide();
				alert.show("Same name of java file already exist for create interface")
				return ;
			}else if(data.code==203){
				self.dialogs['interface'].panel.hide();
				alert.show("Package not exist make package first")
				return ;

			}


			
			self.dialogs['interface'].panel.hide();
			core.module.layout.project_explorer.refresh();
		});

		//var plugin = property.plugins['org.goorm.plugin.java'];
		//var buildPath = plugin['plugin.java.build_path'];
		//console.log("touch "+workspace+filepath+"/"+"main.java")

		
	},
	init_dialog: function(){
		var self=this;

		var handle_ok_package = function(panel) {
			self.make_package();

			if (typeof(this.hide) !== 'function' && panel) {
				panel.hide();
			}
			else{
				this.hide();
			}
		};
		var handle_ok_interface = function(panel) {
			self.make_interface();

			if (typeof(this.hide) !== 'function' && panel) {
				panel.hide();
			}
			else{
				this.hide();
			}
		};
		var handle_ok_class = function(panel) {
			self.make_class();

			if (typeof(this.hide) !== 'function' && panel) {
				panel.hide();
			}
			else{
				this.hide();
			}
		};
		var handle_cancel = function() { 
			this.hide(); 
		};

		var buttons_package = [
			{ id:"gPluginJavaExamplesPackageB_OK", text:"<span localization_key='ok'>OK</span>",  handler:handle_ok_package},
			{ id:"gPluginJavaExamplesPackageB_CNCL", text:"<span localization_key='cancel'>Cancel</span>",  handler:handle_cancel}
		];

		var buttons_interface = [
			{ id:"gPluginJavaExamplesInterfaceB_OK", text:"<span localization_key='ok'>OK</span>",  handler:handle_ok_interface},
			{ id:"gPluginJavaExamplesInterfaceB_CNCL", text:"<span localization_key='cancel'>Cancel</span>",  handler:handle_cancel}
		];

		var buttons_class = [
			{ id:"gPluginJavaExamplesClassB_OK", text:"<span localization_key='ok'>OK</span>",  handler:handle_ok_class},
			{ id:"gPluginJavaExamplesClassB_CNCL", text:"<span localization_key='cancel'>Cancel</span>",  handler:handle_cancel}
		];

		var dialog_class = new org.goorm.core.dialog();
		dialog_class.init({
			localization_key:"title_class",
			title:"Class", 
			path:"configs/dialogs/org.goorm.core.plugin/plugin.java_examples.class.html",
			width:400,
			height:360,
			modal:true,
			yes_text: "<span localization_key='ok'>OK</span>",
			no_text: "<span localization_key='close'>Close</span>",
			buttons: buttons_class,
			success: function () {
				
			}			
		});
		self.dialogs["class"] = dialog_class;

		var dialog_package = new org.goorm.core.dialog();
		dialog_package.init({
			localization_key:"title_package",
			title:"Package", 
			path:"configs/dialogs/org.goorm.core.plugin/plugin.java_examples.package.html",
			width:400,
			height:200,
			modal:true,
			yes_text: "<span localization_key='ok'>OK</span>",
			no_text: "<span localization_key='close'>Close</span>",
			buttons: buttons_package,
			success: function () {
				
			}			
		});
		self.dialogs["package"] = dialog_package;

		var dialog_interface = new org.goorm.core.dialog();
		dialog_interface.init({
			localization_key:"title_interface",
			title:"Interface", 
			path:"configs/dialogs/org.goorm.core.plugin/plugin.java_examples.interface.html",
			width:400,
			height:310,
			modal:true,
			yes_text: "<span localization_key='ok'>OK</span>",
			no_text: "<span localization_key='close'>Close</span>",
			buttons: buttons_interface,
			success: function () {
				
			}			
		});
		self.dialogs["interface"] = dialog_interface;
	},

	//auto import
	organize_import : function(data){
		var self=this;
		var result_split=data;
		var err_java_file=[];
		var missing_symbol=[];

		//build result parsing start
		for(var i=0;i<result_split.length;i++){
			if(/cannot find symbol/g.test(result_split[i]) ){
				//determine err java file
				if( ((result_split[i-1]+"").split('\n').pop()).indexOf(core.module.layout.workspace.window_manager.active_filename) == -1 ){
					//not in current editor
					continue;
				}
				err_java_file.push( (result_split[i-1]+"").split('\n').pop()   );

				//determine missing symbol
				var missing_err=(result_split[i]+"").split("\n");
				for(var k=0;k<missing_err.length;k++){
					if(missing_err[k].indexOf('symbol:')!=-1){
						missing_symbol.push(missing_err[k].split(' ').pop().split('\r')[0] );
						break;
					}
				}

			}

		}
		//parsing end

		// console.log(err_java_file);
		// console.log(missing_symbol);

		//core.status.err_java_file=err_java_file;
		//core.status.missing_symbol=missing_symbol;
		
		core.status.missing_symbol=[];
		core.status.err_java_file=[];

		for(var i=0; i<missing_symbol.length; i++){
			var pre=false;
			for(var k=0;k<core.status.missing_symbol.length;k++){
				if(missing_symbol[i]==core.status.missing_symbol[k]){
					pre=true;
					break;
				}	
			}
			if(!pre){
				core.status.missing_symbol.push(missing_symbol[i]+"");
				core.status.err_java_file.push(err_java_file[i]+"");
			}
		}


		//query to server
	},
};