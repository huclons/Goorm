/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jshint evil: true, devel: true, node: true, plusplus: false, undef: false */
/*serverside jslint comment for global */
/*global mongoose: false, Scheme: false, Schema: false, __redis_mode: false, __local_mode: false, __workspace: false, __path: false, __temp_dir: false, __service_mode: false */


var commander = require('commander')
  , fs = require('fs')
  , colors = require('colors')
  , forever = require('forever')
  , os = require('os')
  , exec = require('child_process').exec
  , http = require('http')
  , querystring = require('querystring');

fs.readFile(__dirname+"/info_goorm.json", "utf8", function(err, contents) {
	if (err!=null) {
		console.log("Can not find file:info_goorm.json");
	}
	else {
		var info = JSON.parse(contents);
		commander.version('goormIDE '+info.version+'.alpha');

		commander
			.on('--help', function(){
				console.log('Detail Help:');
				console.log('');
				console.log('  Basic Usage:');
				console.log('');
				console.log('   - If you download source-code in your private space:');
				console.log('');
				console.log('    $ node goorm.js [command] [options]');
				console.log('    ex) $ node goorm.js -h');
				console.log('');
				console.log('   - If you installed goorm using npm:');
				console.log('');
				console.log('    $ goorm [command] [options]');
				console.log('    ex) $ goorm -h');
				console.log('');
				console.log('  Command: update');
				console.log('');
				console.log('   - update goormIDE server info:');
				console.log('');
				console.log('    $ node goorm.js update');
				console.log('    $ goorm update');
				console.log('');
				console.log('  Command: Start / Restart / Stop');
				console.log('');
				console.log('   - Start goormIDE server:');
				console.log('');
				console.log('    $ node goorm.js start [options]');
				console.log('    $ goorm start [options]');
				console.log('');

				//useonly(mode=basic)
				console.log('    + Option:');
				console.log('');
				console.log('      -d, --daemon           run the goorm server as a daemon using the forever module...');
				console.log('      -p, --port [PORT NUM]  run the goorm server with port which you want...');
				console.log('');
				console.log('      $ node goorm.js start -d');
				console.log('      $ goorm start --daemon');
				console.log('      $ node goorm.js start -p 9999');
				console.log('      $ goorm start --port 9999');
				console.log('      $ node goorm.js start --redis-mode');
				console.log('      $ goorm start --redis-mode');
				console.log('');
				//useonlyend

				

				console.log('   - Restart goormIDE server:');
				console.log('');
				console.log('    $ node goorm.js restart');
				console.log('    $ goorm restart');
				console.log('');
				console.log('   - Stop goormIDE server:');
				console.log('');
				console.log('    $ node goorm.js stop');
				console.log('    $ goorm stop');
				console.log('');
				console.log('  Command: Set Configs');
				console.log('');
				console.log('   - Set workspace:');
				console.log('');
				console.log('    $ node goorm.js set [options] [value]');
				console.log('    $ goorm set [options] [value]');
				console.log('');
				console.log('   - Set temporary directory:');
				console.log('');
				console.log('    $ node goorm.js set [options] [value]');
				console.log('    $ goorm set [options] [value]');
				console.log('');
				console.log('    + Option:');
				console.log('');
				console.log('      -w, --workspace       set the workspace directory. default value is "workspace"');
				console.log('');
				console.log('      $ node goorm.js set -w workspace');
				console.log('      $ goorm start --workspace my_workspace');
				console.log('');
				console.log('      -t, --temp-directory  set the temporary directory. default value is "temp_files"');
				console.log('');
				console.log('      $ node goorm.js set -t temp');
				console.log('      $ goorm set --temp-directory temp_files');
				console.log('');

				

				console.log('      $ node goorm.js set -x plugin_exclude_list');
				console.log('      $ goorm set --plugin_exclude_list [plugin_exclude_list]');
				console.log('');
				console.log('  Command: Clean Configs');
				console.log('');
				console.log('    $ node goorm.js clean');
				console.log('    $ goorm clean');
				console.log('');
			});

		commander
			.command('update')
			.action(function (env, options) {
				
				var print_message = 'Do you want to send server information to developer?(yes/no) ';
				commander.confirm(print_message, function(arg){
					process.stdin.pause();
					
					if(arg) {
						send_log("server update", command_update);
					}
					else {
						command_update();
					}
				});
			});
			
		commander
			.command('start [option]')
			.option('-d, --daemon', 'run the goorm server as a daemon using the forever module...')
			.option('-p, --port [PORT NUM]', 'run the goorm server with port which you want...')
			.option('-s, --send-info [Y/N],', 'send server information to developer...')
			.option('-h, --home [HOME Directory]', 'set HOME directory in server')
			.option('-w, --workspace [WORKSPACE Directory]', 'set WORKSPACE directory in server')
			.option('--redis-mode', 'run the goorm with redis-server')

			

			.action(function (env, options) {
				var process_options = [];
				process_options.push(options.port);
				process_options.push(options.home);
				process_options.push(options.workspace);
				var redis_mode = false;
				var optimization_mode = false;

				

				function start_process(){
					fs.exists(__dirname+'/info_server.json', function(exists){
						if(!exists) {
							command_update();
						}

						if (options.daemon) {							
							forever.startDaemon(__dirname+'/server.js', {
								'env': { 'NODE_ENV': 'production' },
								'spawnWith': { env: process.env },
								'options': process_options
							});
							console.log("goormIDE server is started...");
						}
						else {
							forever.start(__dirname+'/server.js', {'options': process_options});
						}
					});
				}
				
				

				if(options.redisMode){
					redis_mode = true;
					process_options.push(redis_mode);
				} else {
					process_options.push(redis_mode);
				}
				
				if(options.optimizationMode){
					optimization_mode = true;
					process_options.push(optimization_mode);
				} else {
					process_options.push(optimization_mode);
				}

				

				if(options['sendInfo']){
					var send = options['sendInfo'];
					if(send == 'y' || send == 'yes' || send == 'Y' || send == 'Yes'){
						send_log("server start", function() {});
					}

					start_process();
				}
				else{
					var print_message = 'Do you want to send server information to developer?(yes/no) ';
					commander.confirm(print_message, function(arg){
						process.stdin.pause();

						if(arg) {
							send_log("server start", function() {});
						}

						start_process();
					});
				}
			});
		
		commander
			.command('restart')
			.action(function (env, options) {
				forever.list(null, function(format, list){
					var get_current_project_path = function(raw){
						var path = raw.parent.rawArgs[1].split('/');
						path.pop();
						path = path.join('/');

						return path;
					}

					var current_project_path = get_current_project_path(env);

					if(list) {
						var target_index = -1;

						for(var i=0; i<list.length; i++) {
							if( list[i].file.indexOf(current_project_path) > -1 ){
								target_index = i;
								break;
							}
						}

						if( target_index != -1 ) {
							var options = list[i].options;

							forever.stop(target_index);
							forever.startDaemon(__dirname+'/server.js', {
								'env': { 'NODE_ENV': 'production' },
								'spawnWith': { env: process.env },
								'options' : options
							});

							console.log("goormIDE server is restarted...");
						}
						else{
							console.log("goormIDE server not found...");
						}
					}
					else{
						console.log("goormIDE server not found...");
					}
				});
			});
			
		commander
			.command('stop')
			.action(function (env, options) {
				forever.list(null, function(format, list){
					var get_current_project_path = function(raw){
						var path = raw.parent.rawArgs[1].split('/');
						path.pop();
						path = path.join('/');

						return path;
					}

					var current_project_path = get_current_project_path(env);

					if(list) {
						var target_index = -1;

						for(var i=0; i<list.length; i++) {
							if( list[i].file.indexOf(current_project_path) > -1 ){
								target_index = i;
								break;
							}
						}

						if( target_index != -1 ) {
							var options = list[i].options;

							forever.stop(target_index);
							console.log("goormIDE server is stopped...");
						}
						else{
							console.log("goormIDE server not started...");
						}
					}
					else{
						console.log("goormIDE server not started...");
					}
				});
			});
			
		commander
			.command('set [option]')
			.option('-w, --workspace [dir_name]', 'Set the workspace directory')
			.option('-t, --temp-directory [dir_name]', 'Set the temporary directory')

			

			.option('-x, --plugin_exclude_list [plugin_exclude_list]','Set the plugin list you want to exclude plugin loading (ex)[\"org.goorm.plugin.c\",\"org.goorm.plugin.cpp\",\"org.goorm.plugin.java\"]')
			.action(function (env, options) {	
				
				if (!fs.existsSync(process.env.HOME + '/.goorm/')) {
					fs.mkdirSync(process.env.HOME + '/.goorm/');
					fs.writeFileSync(process.env.HOME + '/.goorm/config.json', "", 'utf8');
				}
				else if(!fs.existsSync(process.env.HOME + '/.goorm/config.json')){
					fs.writeFileSync(process.env.HOME + '/.goorm/config.json', "", 'utf8');
				}
				////prepare config.json
				
				if (fs.existsSync(process.env.HOME + '/.goorm/')) {
					var config_data = {};
					var raw_config_data = fs.readFileSync(process.env.HOME + '/.goorm/config.json', 'utf8');
					if(raw_config_data && typeof(raw_config_data) != 'object' ) config_data = JSON.parse(fs.readFileSync(process.env.HOME + '/.goorm/config.json', 'utf8'));
					
					var workspace = config_data.workspace || process.env.PWD + '/' + "workspace/";
					var temp_dir = config_data.temp_dir || process.env.PWD + '/' + "temp_files/";
					var plugin_exclude_list = config_data.plugin_exclude_list || null;

					

					if (options.workspace)	 {	
						workspace = options.workspace || process.env.PWD + '/' + "workspace/";
						
						if (!fs.existsSync(workspace)) {
							fs.mkdirSync(workspace);
						}
						else {
							console.log("That directory already exists!");
						}
					}
					
					if (options['tempDirectory'])	 {	
						temp_dir = options['tempDirectory'] || process.env.PWD + '/' + "temp_files/";
						
						if (!fs.existsSync(temp_dir)) {
							fs.mkdirSync(temp_dir);
						}
						else { 
							console.log("That directory already exists!");
						}
					}

					////exclude plugin
					if(options['plugin_exclude_list']){
						plugin_exclude_list = options['plugin_exclude_list'] || null;
						//console.log(plugin_exclude_list);
					}
					
					
					
					if(workspace && workspace[workspace.length - 1] != '/') workspace = workspace + '/';
					if(temp_dir && temp_dir[temp_dir.length - 1] != '/') temp_dir = temp_dir + '/';
					

					//useonly(mode=basic)
					var config_data = {
						workspace: workspace,
						temp_dir: temp_dir,
						plugin_exclude_list : plugin_exclude_list
					};
					//useonlyend

					
			
					fs.writeFileSync(process.env.HOME +  '/.goorm/config.json', JSON.stringify(config_data), 'utf8');
					console.log("goormIDE: your configs are successfully added!");
				}
			})
		
		commander
			.command('clean')
			.action(function (env, options) {
				if (fs.existsSync(process.env.HOME + '/.goorm/')) {
					fs.writeFileSync(process.env.HOME +  '/.goorm/config.json', "");
					console.log("goormIDE: your configs are successfully removed!");
				}
			});
			
			
		commander.parse(process.argv);
	}
});

function send_log(title, callback) {

	var ori_data = {};
	ori_data.board_id='ide_log';
	ori_data.subject=title;
	ori_data.content='';
	ori_data.language='ko';
	
	var server_info = {};
	server_info.os = os.type()+" "+os.release();
	var ori_cpus = os.cpus();
	var cpus = [];
	for (k in ori_cpus) {
		cpus.push(ori_cpus[k].model+" : "+ori_cpus[k].speed);
	}
	server_info.cpus = cpus;
	server_info.memory = os.totalmem();
	var interfaces = os.networkInterfaces();
	var addresses = [];
	for (k in interfaces) {
	    for (k2 in interfaces[k]) {
	        var address = interfaces[k][k2];
	        if (address.family == 'IPv4' && !address.internal) {
	            addresses.push(address.address);
	        }
	    }
	}
	server_info.ip_address=addresses;
	server_info.start= new Date();
	
	var contents = "";
	contents += "<b>OS : </b>"+server_info.os+"<br/>";
	contents += "<b>CPU : </b>"+server_info.cpus+"<br/>";
	contents += "<b>MEMORY : </b>"+server_info.memory+"<br/>";
	contents += "<b>IP : </b>"+server_info.ip_address;
	ori_data.content = contents;

	var post_data = querystring.stringify(ori_data);
	
	var post_options = {
		host: 'www.goorm.io',
		port: '80',
		path: '/api/article/write',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': post_data.length
		}
	};
	
	var post_req = http.request(post_options, function(res) {
		res.setEncoding('utf8');
		
		var data = "";
		
		res.on('data', function (chunk) {
			data += chunk;
		});
		
		res.on('end', function() {
			console.log("Information was sent.");
			callback();
		});		
	});
	
	post_req.on('error', function(e) {
	});
	
	post_req.write(post_data);
	post_req.end();
}

function command_update() {
	var server_data = {};
	server_data.os_version = os.type()+" "+os.release();
	server_data.node_version = process.version;
	server_data.mongodb_version = "";
	server_data.theme = "default";
	server_data.language = "client";
	
	//useonly(mode=basic)
	fs.writeFileSync(__dirname +  '/info_server.json', JSON.stringify(server_data));
	console.log("Server info is updated...");
	process.stdin.destroy();
	//useonlyend

	
}
