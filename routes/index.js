var fs = require("fs");

var g_env = require("../configs/env.js");

var g_file = require("../modules/org.goorm.core.file/file");
var g_preference = require("../modules/org.goorm.core.preference/preference");
var g_project = require("../modules/org.goorm.core.project/project");
var g_terminal = require("../modules/org.goorm.core.terminal/terminal");
var g_theme = require("../modules/org.goorm.core.theme/theme");
var g_plugin = require("../modules/org.goorm.plugin/plugin");

var EventEmitter = require("events").EventEmitter;

/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('index', { title: 'goormIDE' })
};


/*
 * API : Project
 */

exports.project = function(req, res){
	res.send(null);
};

exports.project.do_new = function(req, res){
	var evt = new EventEmitter();
	
	evt.on("project_do_new", function (data) {
		console.log("start");
		console.log(data);
		res.json(data);
	});
	
	g_project.do_new(req.query, evt);
};

exports.project.do_load = function(req, res){
	res.send(null);
};

exports.project.do_save = function(req, res){
	res.send(null);
};

exports.project.do_delete = function(req, res){
	res.send(null);
};

exports.project.get_list = function(req, res){
	res.send(null);
};

exports.project.do_import = function(req, res){
	res.send(null);
};

exports.project.do_export = function(req, res){
	res.send(null);
};

exports.project.do_clean = function(req, res){
	res.send(null);
};

exports.project.get_property = function(req, res){
	res.send(null);
};


/*
 * API : Plugin
 */

exports.plugin = function(req, res){
	res.send(null);
};

exports.plugin.get_list = function(req, res){
	res.send(null);
};

/*
 * API : File System
 */

exports.file = function(req, res){
	res.send(null);
};

exports.file.do_new = function(req, res){
	res.send(null);
};

exports.file.do_load = function(req, res){
	res.send(null);
};

exports.file.do_save = function(req, res){
	res.send(null);
};

exports.file.do_delete = function(req, res){
	res.send(null);
};


exports.file.get_contents = function(req, res){
	var path = req.query.path;

	fs.readFile(g_env.path + 'public/' + path, "utf8", function(err, data) {
		res.json(data);
	});
};

exports.file.get_url_contents = function(req, res){
	res.send(null);
};

exports.file.put_contents = function(req, res){
	res.send(null);
};

exports.file.get_nodes = function(req, res){
	var evt = new EventEmitter();
	var path = req.query.path;
	
	console.log(path);
	res.setHeader("Content-Type", "application/json");
	
	evt.on("got_nodes", function (data) {
		try {
			res.send(JSON.stringify(data));
			res.end();
		}
		catch (exception) {
			throw exception;
		}
	});
	
	g_file.get_nodes(g_env.path + 'workspace/' + path, evt);
};

exports.file.get_dir_nodes = function(req, res){
	var evt = new EventEmitter();
	var path = req.query.path;
	
	console.log(path);
	res.setHeader("Content-Type", "application/json");
	
	evt.on("got_dir_nodes", function (data) {
		try {
			res.send(JSON.stringify(data));
			res.end();
		}
		catch (exception) {
			throw exception;
		}
	});
	
	g_file.get_dir_nodes(g_env.path + 'workspace/' + path, evt);
};

exports.file.do_import = function(req, res){
	res.send(null);
};

exports.file.do_exort = function(req, res){
	res.send(null);
};

exports.file.do_move = function(req, res){
	res.send(null);
};

exports.file.do_rename = function(req, res){
	res.send(null);
};

exports.file.get_property = function(req, res){
	res.send(null);
};


/*
 * API : Terminal
 */

exports.terminal = function(req, res){
	res.send(null);
};

exports.terminal.exec = function(req, res){
	var evt = new EventEmitter();
	var command = req.query.command;
	
	console.log(command);
	res.setHeader("Content-Type", "application/json");
	
	evt.on("executed_command", function (data) {
		try {
			res.send(JSON.stringify(data));
			res.end();
		}
		catch (exception) {
			throw exception;
		}
	});
	
	g_terminal.exec(command, evt);
};

/*
 * API : Preference
 */

exports.preference = function(req, res){
	res.send(null);
};

exports.preference.save = function(req, res){
	res.send(null);
};

exports.preference.ini_parser = function(req, res){
	res.send(null);
};

exports.preference.ini_maker = function(req, res){
	res.send(null);
};

/*
 * API : Theme
 */

exports.theme = function(req, res){
	res.send(null);
};

exports.theme.save = function(req, res){
	res.send(null);
};

exports.theme.get_list = function(req, res){
	res.send(null);
};