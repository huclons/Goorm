
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

//for project
app.get('/project/new', routes.project.do_new);
app.get('/project/load', routes.project.do_load);
app.get('/project/save', routes.project.do_save);
app.get('/project/delete', routes.project.do_delete);
app.get('/project/get_list', routes.project.get_list);
app.get('/project/import', routes.project.do_import);
app.get('/project/export', routes.project.do_export);
app.get('/project/clean', routes.project.do_clean);
app.get('/project/get_property', routes.project.get_property);

//for plugin
app.get('/plugin/get_list', routes.plugin.get_list);
app.get('/plugin/install', routes.plugin.install);

//for filesystem
app.get('/file/new', routes.file.do_new);
app.get('/file/load', routes.file.do_load);
app.get('/file/save', routes.file.do_save);
app.get('/file/delete', routes.file.do_delete);
app.get('/file/get_contents', routes.file.get_contents);
app.get('/file/get_url_contents', routes.file.get_url_contents);
app.get('/file/put_contents', routes.file.put_contents);
app.get('/file/get_nodes', routes.file.get_nodes);
app.get('/file/get_dir_nodes', routes.file.get_dir_nodes);
app.get('/file/import', routes.file.do_import);
app.get('/file/export', routes.file.do_export);
app.get('/file/move', routes.file.do_move);
app.get('/file/rename', routes.file.do_rename);
app.get('/file/get_property', routes.file.get_property);

//for shell
app.get('/shell/exec', routes.shell.exec);

//for preference
app.get('/preference/save', routes.preference.save);
app.get('/preference/ini_parser', routes.preference.ini_parser);
app.get('/preference/ini_maker', routes.preference.ini_maker);

//for theme
app.get('/theme/save', routes.theme.save);
app.get('/theme/get_list', routes.theme.get_list);

app.listen(9999, function(){
  console.log("goormIDE server listening on port %d in %s mode", app.address().port, app.settings.env);
});
