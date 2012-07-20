
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , io = require('socket.io');

var goorm = module.exports = express.createServer();
var g_terminal = require("./modules/org.goorm.core.terminal/terminal");
var g_utility = require("./modules/org.goorm.core.utility/utility");

global.__path = __dirname;


// Configuration

goorm.configure(function(){
  goorm.set('views', __dirname + '/views');
  goorm.set('view engine', 'jade');
  goorm.use(express.bodyParser());
  goorm.use(express.methodOverride());
  goorm.use(goorm.router);
  goorm.use(express.static(__dirname + '/public'));
  goorm.use(express.static(__dirname + '/plugins'));
});

goorm.configure('development', function(){
  goorm.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

goorm.configure('production', function(){
  goorm.use(express.errorHandler());
});

// Routes
goorm.get('/', routes.index);

//for project
goorm.get('/project/new', routes.project.do_new);
goorm.get('/project/load', routes.project.do_load);
goorm.get('/project/save', routes.project.do_save);
goorm.get('/project/delete', routes.project.do_delete);
goorm.get('/project/get_list', routes.project.get_list);
goorm.get('/project/import', routes.project.do_import);
goorm.get('/project/export', routes.project.do_export);
goorm.get('/project/clean', routes.project.do_clean);
goorm.get('/project/get_property', routes.project.get_property);

//for plugin
goorm.get('/plugin/get_list', routes.plugin.get_list);
goorm.get('/plugin/install', routes.plugin.install);

//for filesystem
goorm.get('/file/new', routes.file.do_new);
goorm.get('/file/load', routes.file.do_load);
goorm.get('/file/save', routes.file.do_save);
goorm.get('/file/delete', routes.file.do_delete);
goorm.get('/file/get_contents', routes.file.get_contents);
goorm.get('/file/get_url_contents', routes.file.get_url_contents);
goorm.get('/file/put_contents', routes.file.put_contents);
goorm.get('/file/get_nodes', routes.file.get_nodes);
goorm.get('/file/get_dir_nodes', routes.file.get_dir_nodes);
goorm.get('/file/import', routes.file.do_import);
goorm.get('/file/export', routes.file.do_export);
goorm.get('/file/move', routes.file.do_move);
goorm.get('/file/rename', routes.file.do_rename);
goorm.get('/file/get_property', routes.file.get_property);

//for shell
goorm.get('/terminal/exec', routes.terminal.exec);

//for preference
goorm.get('/preference/save', routes.preference.save);
goorm.get('/preference/ini_parser', routes.preference.ini_parser);
goorm.get('/preference/ini_maker', routes.preference.ini_maker);

//for theme
goorm.get('/theme/save', routes.theme.save);
goorm.get('/theme/get_list', routes.theme.get_list);

goorm.listen(9999, function(){
  console.log("goorm IDE server listening on port %d in %s mode", goorm.address().port, goorm.settings.env);
});


g_terminal.start(goorm);
