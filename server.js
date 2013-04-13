/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

var mongoose_module = require('mongoose');
Schema = mongoose_module.Schema;	//global
ObjectId = mongoose_module.Types.ObjectId; // global
global.__use_mongodb = true;
mongoose = mongoose_module.createConnection('mongodb://localhost/goorm_ide');	//global

var express = require('express')
  , routes = require('./routes')
  , socketio = require('socket.io')
  , http = require('http')
  , colors = require('colors')
  , everyauth = require('everyauth')
  , fs = require('fs');

port = 9999; //default
var home = process.env.HOME;
global.__redis_mode = false;

if (process.argv[2] > 0 && process.argv[2] < 100000) {
	port = process.argv[2];
}

if(fs.existsSync(process.argv[3])){
	home = process.argv[3];
}

if (process.argv[5] && process.argv[5] == 'true') {
	global.__redis_mode = true;
}

mongoose.on('error', function(err){
	global.__use_mongodb = false;
	console.log('\nmongoDB connection error. Is the "mongod" turned off?'.red);
	console.log(err);
});

//everyauth.debug = true;

var goorm = module.exports = express();
var g_terminal = require("./modules/org.goorm.core.terminal/terminal");
var g_collaboration = require("./modules/org.goorm.core.collaboration/collaboration");
var g_utility = require("./modules/org.goorm.core.utility/utility");
var g_port_manager = require("./modules/org.goorm.core.utility/utility.port_manager");
var g_configs_social = require("./configs/social");

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
else {
	global.__workspace = __path + "workspace/";
}

if (config_data.temp_dir != undefined) {
	global.__temp_dir = config_data.temp_dir;
}
else {
	global.__temp_dir = __path + "temp_files/";
}

if (config_data.social_key != undefined) {
	global.__social_key = config_data.social_key;
	global.__social_key['possible_list'] = [];
}
else {
	global.__social_key = {};
	global.__social_key['possible_list'] = [];
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
store = null;

if(global.__redis_mode){
	var RedisStore = require('connect-redis')(express)
	store = new RedisStore
} else {
	store = new express.session.MemoryStore;
}

console.log("--------------------------------------------------------".grey);
console.log("workspace_path: " + __workspace);
console.log("temp_dir_path: " + __temp_dir);

console.log();
console.log("goormIDE:: starting...".yellow);
console.log("--------------------------------------------------------".grey);

g_configs_social.init(everyauth);

// Social Init
//
if(global.__social_key.google) g_configs_social.attach_google(global.__social_key.google);
if(global.__social_key.facebook) g_configs_social.attach_facebook(global.__social_key.facebook);
if(global.__social_key.github) g_configs_social.attach_github(global.__social_key.github);
if(global.__social_key.twitter) g_configs_social.attach_twitter(global.__social_key.twitter);

// Configuration
goorm.configure(function(){
	goorm.set('views', __dirname + '/views');
	goorm.set('view engine', 'jade');
	//goorm.use(express.favicon(__dirname + '/public/favicon.ico'));
	//goorm.use(express.logger('dev'));
	goorm.use(express.bodyParser({ keepExtensions: true, uploadDir: __temp_dir }));
	goorm.use(express.cookieParser());
	goorm.use(express.session({ secret : 'rnfmadlek', store:store }));
	goorm.use(everyauth.middleware(goorm))
	goorm.use(express.methodOverride());
	goorm.use(goorm.router);
	goorm.use(express.static(__dirname + '/public'));
	goorm.use(express.static(__dirname + '/plugins'));
	goorm.use(express.static(__dirname + '/stencils'));
	goorm.use(express.static(__temp_dir));
});


goorm.configure('development', function(){
  goorm.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

goorm.configure('production', function(){
  goorm.use(express.errorHandler());
});

// Routes
goorm.get('/',  routes.index);

//for project
goorm.get('/project/new',  routes.project.do_new);
goorm.get('/project/delete',  routes.project.do_delete);
goorm.get('/project/get_list',  routes.project.get_list);
goorm.post('/project/import',  routes.project.do_import);
goorm.get('/project/export',  routes.project.do_export);
goorm.get('/project/clean',  routes.project.do_clean);
goorm.get('/project/get_property',  routes.project.get_property);
goorm.get('/project/set_property',  routes.project.set_property);
goorm.get('/project/get_contents', routes.project.get_contents);
goorm.get('/project/move_file', routes.project.move_file);
//for SCM
goorm.get('/scm',  routes.scm);

//for plugin
goorm.get('/plugin/get_list',  routes.plugin.get_list);
//goorm.get('/plugin/install',  routes.plugin.install);
goorm.get('/plugin/new',  routes.plugin.do_new);
//goorm.get('/plugin/debug',  routes.plugin.debug);
goorm.get('/plugin/run',  routes.plugin.run);
goorm.get('/plugin/extend_function',  routes.plugin.extend_function);
goorm.post('/plugin/extend_function_sign',  routes.plugin.extend_function_sign);

//for filesystem
goorm.get('/file/new',  routes.file.do_new);
goorm.get('/file/new_folder',  routes.file.do_new_folder);
goorm.get('/file/new_untitled_text_file',  routes.file.do_new_untitled_text_file);
goorm.get('/file/new_other',  routes.file.do_new_other);
goorm.get('/file/load',  routes.file.do_load);
//goorm.get('/file/save',  routes.file.do_save);
goorm.get('/file/save_as',  routes.file.do_save_as);
goorm.get('/file/delete',  routes.file.do_delete);
goorm.get('/file/get_contents',  routes.file.get_contents);
goorm.get('/file/get_url_contents',  routes.file.get_url_contents);
//goorm.get('/file/put_contents',  routes.file.put_contents);
goorm.post('/file/put_contents',  routes.file.put_contents);
goorm.get('/file/get_nodes',  routes.file.get_nodes);
goorm.get('/file/get_dir_nodes',  routes.file.get_dir_nodes);
goorm.get('/file/get_file',  routes.file.get_file);
goorm.post('/file/import',  routes.file.do_import);
goorm.get('/file/export',  routes.file.do_export);
goorm.get('/file/move',  routes.file.do_move);
goorm.get('/file/rename',  routes.file.do_rename);
goorm.get('/file/get_property',  routes.file.get_property);
goorm.get('/file/search_on_project',  routes.file.do_search_on_project);

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
goorm.get('/help/send_to_bug_report',  routes.help.send_to_bug_report);

//for Auth
goorm.get('/auth/get_info',  routes.auth.get_info);
goorm.post('/auth/login', routes.auth.login);
goorm.post('/auth/login/duplicate', routes.auth.login.duplicate);
goorm.post('/auth/logout', routes.auth.logout);
goorm.post('/auth/signup', routes.auth.signup);
goorm.post('/auth/signup/check', routes.auth.signup.check);

// for admin
goorm.get('/auth/check_admin', routes.admin.check);
goorm.get('/admin/get_config',  routes.admin.get_config);
goorm.post('/admin/set_config',  routes.admin.set_config);
goorm.post('/admin/user/add',  routes.admin.user_add);
goorm.post('/admin/user/del',  routes.admin.user_del);
goorm.post('/admin/user/avail_blind',  routes.admin.user_avail_blind);

// for users
goorm.post('/user/get', routes.user.get);
goorm.post('/user/get/list', routes.user.list);
goorm.post('/user/get/list/group', routes.user.list.group);
goorm.get('/user/get/list/group_user_list', routes.user.list.group_user_list);
goorm.post('/user/set', routes.user.set);
goorm.post('/user/set_pw', routes.user.set_pw);
goorm.get('/user/project/get', routes.user.project.get);
goorm.get('/user/project/list', routes.user.project.list);
goorm.get('/user/project/list/no_co_developers', routes.user.project.list.no_co_developers);
goorm.post('/user/project/collaboration/push', routes.user.project.collaboration.push);
goorm.post('/user/project/collaboration/push/all', routes.user.project.collaboration.push.all);
goorm.post('/user/project/collaboration/pull', routes.user.project.collaboration.pull);
goorm.post('/user/project/collaboration/invitation/push', routes.user.project.collaboration.invitation.push);
goorm.post('/user/project/collaboration/invitation/pull', routes.user.project.collaboration.invitation.pull);

// for messages
goorm.get('/message/get', routes.message.get);
goorm.get('/message/get_list', routes.message.list);
goorm.get('/message/get_list/receive', routes.message.list.receive);
goorm.get('/message/get_list/unchecked', routes.message.list.unchecked);
goorm.post('/message/check', routes.message.check);
goorm.post('/message/edit', routes.message.edit);

//for download and upload
goorm.get('/download',  routes.download);
//by sim
goorm.get('/send_file', routes.send_file);
//by sim
//for slide
goorm.get('/lecture/open_file',routes.open_source);

//for Social API
goorm.get('/social/login', routes.social.login);
goorm.get('/social/list', routes.social.possible_list);

goorm.get('/alloc_port',  function(req, res) {
	// req : port, process_name
	res.json(g_port_manager.alloc_port(req.query));
});

goorm.get('/remove_port',  function(req, res) {
	// req : port
	res.json(g_port_manager.remove_port(req.query));
});

//for history
goorm.post('/history/get_history',  routes.history.get_history);

goorm.get('/db/is_open', function(req, res){
	var dbname = req.query.dbname;
	var is_open = eval('global.__use_'+dbname);
	
	res.json(is_open);
});

goorm.get('/edit/get_dictionary',  routes.edit.get_dictionary);
goorm.get('/edit/get_object_explorer',routes.edit.get_object_explorer);
goorm.get('/function/get_function_explorer',routes.function.get_function_explorer);

server = http.createServer(goorm).listen(port, function(){
		global.__serverport = server.address().port;
		console.log("goorm IDE server listening on port %d in %s mode", server.address().port, goorm.settings.env);
		console.log("Open your browser and connect to");
		console.log("'http://localhost:"+port+"' or 'http://[YOUR IP/DOMAIN]:"+port+"'");
	});
		
io = socketio.listen(server, {
	'heartbeatTimeout' : 30*1000
});

g_terminal.start(io);
g_collaboration.start(io);

g_port_manager.alloc_port({ "port": port,
	"process_name": "goorm" 
});

