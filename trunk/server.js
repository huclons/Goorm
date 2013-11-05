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

var express = require('express'),
	fs 		= require('fs'),
	goorm = module.exports = express();

port = 9998; //default
var home = process.env.HOME;
var workspace =  null;


port = 9999; //default







global.__redis_mode = false;
global.__optimization_mode = false;






goorm.init = function() {

	if (process.argv[2] > 0 && process.argv[2] < 100000) {
		port = process.argv[2];
	}

	if(fs.existsSync(process.argv[3])){
		home = process.argv[3];
	}

	if(fs.existsSync(process.argv[4])){
		workspace = process.argv[4];
	}

	
	if (process.argv[5] && process.argv[5] == 'true') {
		global.__redis_mode = true;
	}

	if (process.argv[6] && process.argv[6] == 'true') {
		global.__optimization_mode = true;
	}
	

	

	

	if(__redis_mode) {
		cluster = require('cluster');
		var numCPUs = require('os').cpus().length;
	}

	

	

	var routes = require('./routes')
	  , socketio = require('socket.io')
	  , http = require('http')
	  , colors = require('colors')
	
	  , redis = require('socket.io/node_modules/redis');

	var g_terminal = require("./modules/org.goorm.core.terminal/terminal");
	var g_file = require("./modules/org.goorm.core.file/file");
	
	var g_utility = require("./modules/org.goorm.core.utility/utility");
	var g_port_manager = require("./modules/org.goorm.core.utility/utility.port_manager");

	

	global.__path = __dirname+"/";

	var server = null;
	var io = null;
	var config_data = {
		workspace: undefined,
		temp_dir: undefined,
		social_key: undefined,
		redis_mode: undefined
	};

	var users = []

	console.log("goormIDE:: loading config...".yellow);

	if (fs.existsSync(home + '/.goorm/config.json')) {
		var data = fs.readFileSync(home + '/.goorm/config.json', 'utf8');
		if (data != "") {
			config_data = JSON.parse(data);
		}
	}

	if (config_data.workspace != undefined) {
		global.__workspace = config_data.workspace;
	}
	else if (workspace){
		global.__workspace = workspace;
	}
	else {
		
		var base = process.env.HOME + "/goorm_workspace/";

		if(!fs.existsSync(base)){
			fs.mkdir(base, 0755, function(err){
				if (err) {
					console.log('Cannot make goorm_workspace : '+base+' ... ', err);
				}
			});
		}

		global.__workspace = process.env.HOME + "/goorm_workspace/";
		

		

		
	}

	if (config_data.temp_dir != undefined) {
		global.__temp_dir = config_data.temp_dir;
	}
	else {
		
		var temp = process.env.HOME + "/goorm_tempdir/";

		if(!fs.existsSync(temp)){
			fs.mkdir(temp, 0755, function(err){
				if (err) {
					console.log('Cannot make goorm_tempdir : '+temp+' ... ', err);
				}
			});
		}

		global.__temp_dir = process.env.HOME + "/goorm_tempdir/";
		

		
	}

	

	if(config_data.plugin_exclude_list != undefined){
		console.log(config_data.plugin_exclude_list);
		global.__plugin_exclude_list = config_data.plugin_exclude_list.split(",");
		for(var i=0;i<global.__plugin_exclude_list.length;i++){
			var type=global.__plugin_exclude_list[i];
			global.__plugin_exclude_list[i]="org.goorm.plugin."+type;
		}
	}
	else global.__plugin_exclude_list = null;
	// Session Store
	//
	global.store = null;

	if(global.__redis_mode){
		var RedisStore = require('connect-redis')(express)
		global.store = new RedisStore
	} else {
		global.store = new express.session.MemoryStore;
	}

	global.file_type = [];
	g_file.init();

	console.log("--------------------------------------------------------".grey);
	console.log("workspace_path: " + __workspace);
	console.log("temp_dir_path: " + __temp_dir);

	console.log();
	console.log('If you want to change a workspace, use -w option.');
	console.log('node goorm.js start -w [workspace]')
	console.log();
	console.log("goormIDE:: starting...".yellow);
	console.log("--------------------------------------------------------".grey);

	

	// Configuration
	goorm.configure(function(){
		goorm.set('views', __dirname + '/views');
		if ( !__optimization_mode ) {
			goorm.set('view engine', 'jade');
		}
		else {
			goorm.engine('html', require('ejs').renderFile);
		}
		goorm.use(express.bodyParser({ keepExtensions: true, uploadDir: __temp_dir, limit : 10000000 }));

		

		goorm.use(express.methodOverride());
		goorm.use(goorm.router);
		goorm.use(express.static(__dirname + '/public'));
		goorm.use(express.static(__dirname + '/plugins'));

		

		goorm.use(express.static(__temp_dir));
	});

	goorm.configure('development', function(){
	  goorm.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	});

	goorm.configure('production', function(){
	  goorm.use(express.errorHandler());
	});

	process.on('uncaughtException', function(err) {
	        if(!fs.existsSync("./error_log/")) fs.mkdirSync("./error_log/", 0777);
	        var now = new Date();
	        var date_now=(now.getMonth()+1)+"_"+now.getDate()+"_"+now.getHours()+"_"+now.getMinutes()+"_"+now.getSeconds();
	        if(!fs.existsSync('./error_log/'+ date_now+".log"))fs.writeFileSync('./error_log/'+ date_now+".log",'Caught exception: \n' + err+err.stack+"\n", 'utf8');
	        else{console.log("come on")
	                fs.appendFileSync('./error_log/'+ date_now+".log",'Caught exception: \n' + err+err.stack+"\n", "utf8");
	        }

	        console.log('Caught exception: ' + err+err.stack+"\n"+"saved at "+'./error_log/'+ date_now+".log");
	        process.exit(1);
	});

	var check_session = function(req, res, next) {
		
		next();
		

		

		
	}

	// Routes
	
	goorm.get('/',  routes.index);
	

	

	//for project
	goorm.get('/project/new', check_session, routes.project.do_new);
	goorm.get('/project/delete', check_session, routes.project.do_delete);
	goorm.get('/project/get_list', check_session, routes.project.get_list);
	goorm.post('/project/import', check_session, routes.project.do_import);
	goorm.get('/project/export', check_session, routes.project.do_export);
	goorm.get('/project/clean', check_session, routes.project.do_clean);
	goorm.get('/project/get_property', check_session, routes.project.get_property);
	goorm.get('/project/set_property', check_session, routes.project.set_property);
	goorm.get('/project/get_contents', routes.project.get_contents);
	goorm.get('/project/move_file', check_session, routes.project.move_file);

	

	

	//for plugin
	goorm.get('/plugin/get_list', routes.plugin.get_list);
	//goorm.get('/plugin/install',  routes.plugin.install);
	goorm.get('/plugin/new',  routes.plugin.do_new);
	goorm.get('/plugin/make_template',  routes.plugin.make_template);
	//goorm.get('/plugin/debug',  routes.plugin.debug);
	goorm.get('/plugin/run',  routes.plugin.run);

	

	//for filesystem
	goorm.get('/file/new', check_session, routes.file.do_new);
	goorm.get('/file/new_folder', check_session, routes.file.do_new_folder);
	goorm.get('/file/new_untitled_text_file', check_session, routes.file.do_new_untitled_text_file);
	goorm.get('/file/new_other', check_session, routes.file.do_new_other);
	goorm.get('/file/save_as', check_session, routes.file.do_save_as);
	goorm.get('/file/delete', check_session, routes.file.do_delete);
	goorm.get('/file/delete_all', check_session, routes.file.do_delete_all);
	goorm.get('/file/copy_file_paste', check_session, routes.file.do_copy_file_paste);
	goorm.get('/file/get_contents',  routes.file.get_contents);
	goorm.get('/file/get_url_contents',  routes.file.get_url_contents);
	goorm.post('/file/put_contents', check_session, routes.file.put_contents);
	goorm.get('/file/get_file', check_session, routes.file.get_file);
	goorm.get('/file/get_result_ls', check_session, routes.file.get_result_ls);
	goorm.post('/file/check_valid_edit', check_session, routes.file.check_valid_edit);
	goorm.post('/file/import', check_session, routes.file.do_import);
	goorm.get('/file/export',  check_session, routes.file.do_export);
	goorm.get('/file/move',  check_session, routes.file.do_move);
	goorm.get('/file/rename', check_session, routes.file.do_rename);
	goorm.get('/file/get_property', check_session, routes.file.get_property);
	goorm.get('/file/search_on_project', check_session, routes.file.do_search_on_project);

	//for preference
	goorm.get('/preference/workspace_path',  function(req, res) {
		res.json({"path": global.__workspace});
	});
	goorm.get('/preference/get_server_info',  routes.preference.get_server_info);
	goorm.get('/preference/get_goorm_info',  routes.preference.get_goorm_info);
	goorm.get('/preference/put_filetypes',  routes.preference.put_filetypes);

	//for theme
	goorm.get('/theme/get_list',  routes.theme.get_list);
	goorm.post('/theme/get_contents',  routes.theme.get_contents);
	goorm.post('/theme/put_contents',  routes.theme.put_contents);

	//for help
	goorm.get('/help/get_readme_markdown',  routes.help.get_readme_markdown);

	

	
	goorm.post('/local_login', function (req, res){
		var response = {};
		response.result = false;

		var id = req.body.id;
		var pw = req.body.pw;

		var crypto = require('crypto');
		var sha_pw = crypto.createHash('sha1');
		sha_pw.update(pw);
		pw = sha_pw.digest('hex');

		var users = config_data.users;
		if(users && users.length > 0) {
			for(var i=0; i<users.length; i++) {
				var user = users[i];

				if (user.id == id && user.pw == pw) {
					response.result = true;
				}
			}
		}

		res.json(response);
	});
	

	

	//for download and upload
	goorm.get('/download', check_session,  routes.download);
	goorm.post('/upload', check_session, routes.upload);
	goorm.get('/send_file', check_session, routes.send_file);

	//folder upload
	goorm.post('/upload/dir_file', check_session, routes.upload_dir_file);
	goorm.post('/upload/dir_skeleton', check_session, routes.upload_dir_skeleton);

	

	goorm.get('/alloc_port',  function(req, res) {
		// req : port, process_name
		res.json(g_port_manager.alloc_port(req.query));
	});

	

	goorm.get('/remove_port',  function(req, res) {
		// req : port
		res.json(g_port_manager.remove_port(req.query));
	});

	

	goorm.get('/get_option', function(req, res){

		
		var is_optimization = __optimization_mode;

		var option = {
			'is_optimization' : is_optimization
		}
		

		

		res.json(option);
	})

	goorm.get('/edit/get_dictionary',  routes.edit.get_dictionary);
	goorm.get('/edit/get_object_explorer',routes.edit.get_object_explorer);
	goorm.get('/function/get_function_explorer',routes.function.get_function_explorer);

	goorm.post('/edit/save_tags', routes.edit.save_tags);
	goorm.get('/edit/load_tags', routes.edit.load_tags);
	
	

	// clustering
	//
	if(global.__redis_mode) {
		global.__redis = {};
		global.__redis.pub = redis.createClient();
		global.__redis.sub = redis.createClient();
		global.__redis.store = redis.createClient();

		

		g_terminal.bind(global.__redis.sub, global.__redis.pub);

		__redis.sub.on('message', function(channel, message) {
			switch(channel) {
				

				case 'demo_terminal':
					g_terminal.store(channel, message);
					break;

				default:
					break;
			}
		})

		if (cluster.isMaster) {
			for (var i = 0; i < numCPUs; i++) {
				cluster.fork();
			}
			
			cluster.on('exit', function(worker, code, signal) {
				var exitCode = worker.process.exitCode;
				console.log('worker ' + worker.process.pid + ' died ('+exitCode+'). restarting...');
				cluster.fork();
			});
			
			cluster.on('online', function(worker) {
				console.log("worker %s (%s) online", worker.id, worker.process.pid);
			});
			
			cluster.on('listening', function(worker, address) {
				console.log("worker %s listening %s:%s", worker.id, address.address, address.port);
			});
		} else {
			server = goorm.listen(port, function(){
				global.__serverport = server.address().port;
				console.log("goorm IDE server listening on port %d in %s mode", server.address().port, goorm.settings.env);
				console.log("Open your browser and connect to");
				console.log("'http://localhost:"+port+"' or 'http://[YOUR IP/DOMAIN]:"+port+"'");
			});

			io = socketio.listen(server, {
				'heartbeatTimeout' : 30*1000
			});

			if(global.__redis_mode) {
				io.configure(function(){
					io.set('store', new socketio.RedisStore({
						'redis' : redis,
				        'redisPub': global.__redis.pub,
				        'redisSub': global.__redis.sub,
				        'redisClient': global.__redis.store
					}));
				})
			}
			
			g_terminal.start(io);

			

			g_port_manager.alloc_port({ "port": port,
				"process_name": "goorm" 
			});
		}
	}
	else {
		server = goorm.listen(port, function(){
			global.__serverport = server.address().port;
			console.log("goorm IDE server listening on port %d in %s mode", server.address().port, goorm.settings.env);
			console.log("Open your browser and connect to");
			console.log("'http://localhost:"+port+"' or 'http://[YOUR IP/DOMAIN]:"+port+"'");
		});

		io = socketio.listen(server, {
			'heartbeatTimeout' : 30*1000
		});

		g_terminal.start(io);

		

		g_port_manager.alloc_port({ "port": port,
			"process_name": "goorm" 
		});
	}
}

goorm.init();
