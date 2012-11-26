/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

var fs = require("fs");
var rimraf = require('rimraf');

//var g_env = require("../configs/env.js");

var g_file = require("../modules/org.goorm.core.file/file");
var g_preference = require("../modules/org.goorm.core.preference/preference");
var g_project = require("../modules/org.goorm.core.project/project");
var g_scm = require("../modules/org.goorm.core.scm/scm");
var g_terminal = require("../modules/org.goorm.core.terminal/terminal");
var g_theme = require("../modules/org.goorm.core.theme/theme");
var g_plugin = require("../modules/org.goorm.plugin/plugin");
var g_help = require("../modules/org.goorm.help/help");
var g_auth = require("../modules/org.goorm.auth/auth");
var g_auth_manager = require("../modules/org.goorm.auth/auth.manager");
var g_admin = require("../modules/org.goorm.admin/admin");
var g_social = require("../modules/org.goorm.auth/social");

var EventEmitter = require("events").EventEmitter;

/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('index', { title: 'goormIDE' });
	g_file.init();
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
	var evt = new EventEmitter();
	
	evt.on("project_do_delete", function (data) {
		res.json(data);
	});

	g_project.do_delete(req.query, evt);
};

exports.project.get_list = function(req, res){
	var evt = new EventEmitter();
	
	evt.on("project_get_list", function (data) {
		res.json(data);
	});
	
	g_project.get_list(evt);
};

exports.project.do_import = function(req, res){
	var evt = new EventEmitter();

	evt.on("project_do_import", function (data) {
		res.json(data);
	});

	g_project.do_import(req.body, req.files.file, evt);
};

exports.project.do_export = function(req, res){
	var evt = new EventEmitter();
	
	evt.on("project_do_export", function (data) {
		res.json(data);
	});
	
	g_project.do_export(req.query, evt);
};

exports.project.do_clean = function(req, res){
	var evt = new EventEmitter();
	
	evt.on("project_do_clean", function (data) {
		res.json(data);
	});
	
	g_project.do_clean(req.query, evt);
};

exports.project.get_property = function(req, res){
	var evt = new EventEmitter();
	evt.on("get_property", function (data) {
		res.json(data);
	});
	
	g_project.get_property(req.query, evt);
};

exports.project.set_property = function(req, res){
	var evt = new EventEmitter();
	evt.on("set_property", function (data) {
		res.json(data);
	});
	
	g_project.set_property(req.query, evt);
};

/*
 * API : SCM
 */
exports.scm = function(req, res){
	g_scm.index(req.query, res);
};

/*
 * API : Plugin
 */

exports.plugin = function(req, res){
	res.send(null);
};

exports.plugin.get_list = function(req, res){
	var evt = new EventEmitter();
	
	evt.on("plugin_get_list", function (data) {
		res.json(data);
	});

	g_plugin.get_list(evt);
};

exports.plugin.do_new = function(req, res){
	g_plugin.do_new(req.query, res);
};

exports.plugin.generate = function(req, res){
	g_plugin.generate(req.query, res);
};

exports.plugin.build = function(req, res){
	g_plugin.build(req.query, res);
};

exports.plugin.clean = function(req, res){
	g_plugin.clean(req.query, res);
};

exports.plugin.run = function(req, res){
	g_plugin.run(req.query, res);
};

/*
 * API : File System
 */

exports.file = function(req, res){
	res.send(null);
};

exports.file.do_new = function(req, res){
	var evt = new EventEmitter();
	
	evt.on("file_do_new", function (data) {
		res.json(data);
	});

	g_file.do_new(req.query, evt);
};

exports.file.do_new_folder = function(req, res){
	var evt = new EventEmitter();
	
	evt.on("file_do_new_folder", function (data) {
		res.json(data);
	});

	g_file.do_new_folder(req.query, evt);
};

exports.file.do_new_other = function(req, res){
	var evt = new EventEmitter();
	
	evt.on("file_do_new_other", function (data) {
		res.json(data);
	});

	g_file.do_new_other(req.query, evt);
};


exports.file.do_new_untitled_text_file = function(req, res){
	var evt = new EventEmitter();

	evt.on("file_do_new_untitled_text_file", function (data) {
		res.json(data);
	});

	g_file.do_new_untitled_text_file(req.query, evt);
};

exports.file.do_load = function(req, res){
	res.send(null);
};

exports.file.do_save_as = function(req, res){
	var evt = new EventEmitter();
	
	evt.on("file_do_save_as", function (data) {
		res.json(data);
	});

	g_file.do_save_as(req.query, evt);
};

exports.file.do_delete = function(req, res){
	var evt = new EventEmitter();

	evt.on("file_do_delete", function (data) {
		res.json(data);
	});

	g_file.do_delete(req.query, evt);
};


exports.file.get_contents = function(req, res){
	var path = req.query.path;

	fs.readFile(__path + path, "utf8", function(err, data) {
		res.json(data);
	});
};

exports.file.get_url_contents = function(req, res){
	var evt = new EventEmitter();

	evt.on("file_get_url_contents", function (data) {
		res.json(data);
	});

	g_file.get_url_contents(req.query.path, evt);
};

exports.file.put_contents = function(req, res){

	var evt = new EventEmitter();

	evt.on("file_put_contents", function (data) {
		res.json(data);
	});

	// g_file.put_contents(req.query, evt);
	g_file.put_contents(req.body, evt);
};

exports.file.get_nodes = function(req, res){
	console.log("session : %s", req.loggedIn);

	var evt = new EventEmitter();
	var path = req.query.path;
	path = path.replace(/\/\//g, "/");

	//res.setHeader("Content-Type", "application/json");
	
	evt.on("got_nodes", function (data) {
		try {
			res.json(data);
			//res.send(JSON.stringify(data));
			//res.end();
		}
		catch (exception) {
			throw exception;
		}
	});
	
	g_file.get_nodes(__workspace+'/' + path, evt);
};

exports.file.get_dir_nodes = function(req, res){
	var evt = new EventEmitter();
	var path = req.query.path;
	path = path.replace(/\/\//g, "/");

	//res.setHeader("Content-Type", "application/json");
	
	evt.on("got_dir_nodes", function (data) {
		try {
			//console.log(JSON.stringify(data));
			res.json(data);
			
			//res.send(JSON.stringify(data));
			//res.end();
		}
		catch (exception) {
			throw exception;
		}
	});
	
	g_file.get_dir_nodes(__workspace+'/' + path, evt);
};

exports.file.get_file = function(req, res){
	var evt = new EventEmitter();
	var filepath = req.query.filepath;
	var filename = req.query.filename;
	filepath = filepath.replace(/\/\//g, "/");

	//res.setHeader("Content-Type", "application/json");
	
	evt.on("got_file", function (data) {
		try {
			//console.log(JSON.stringify(data));
			res.json(data);
			
			//res.send(JSON.stringify(data));
			//res.end();
		}
		catch (exception) {
			throw exception;
		}
	});
	
	g_file.get_file(filepath, filename, evt);
};

exports.file.do_move = function(req, res){
	var evt = new EventEmitter();

	evt.on("file_do_move", function (data) {
		res.json(data);
	});

	g_file.do_move(req.query, evt);
};

exports.file.do_rename = function(req, res){
	var evt = new EventEmitter();

	evt.on("file_do_rename", function (data) {
		res.json(data);
	});

	g_file.do_rename(req.query, evt);
};

exports.file.get_property = function(req, res){
	var evt = new EventEmitter();

	evt.on("file_get_property", function (data) {
		res.json(data);
	});

	g_file.get_property(req.query, evt);
};

exports.file.do_export = function(req, res){
	var evt = new EventEmitter();

	evt.on("file_do_export", function (data) {
		res.json(data);
	});

	g_file.do_export(req.query, evt);
};

exports.file.do_import = function(req, res){
	var evt = new EventEmitter();

	evt.on("file_do_import", function (data) {
		res.json(data);
	});

	g_file.do_import(req.body, req.files.file, evt);
};

exports.file.do_search_on_project = function(req, res){
	var evt = new EventEmitter();

	evt.on("file_do_search_on_project", function (data) {
		res.send(data);
	});
	
	g_file.do_search_on_project(req.query, evt);
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
		
	evt.on("executed_command", function (data) {
		try {
			res.json(data);
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

exports.preference.get_server_info = function(req, res){
	var evt = new EventEmitter();

	evt.on("preference_get_server_info", function (data) {
		res.json(data);
	});

	g_preference.get_server_info(req.query, evt);
};

exports.preference.get_goorm_info = function(req, res){
	var evt = new EventEmitter();

	evt.on("preference_get_goorm_info", function (data) {
		res.json(data);
	});

	g_preference.get_goorm_info(req.query, evt);
};
exports.preference.put_filetypes = function(req, res){
	var evt = new EventEmitter();

	evt.on("preference_put_filetypes", function (data) {
		res.json(data);
	});

	g_preference.put_filetypes(req.query, evt);
};


/*
 * API : Theme
 */
exports.theme = function(req, res){
	res.send(null);
};

exports.theme.get_list = function(req, res){
	var evt = new EventEmitter();
	
	evt.on("theme_get_list", function (data) {
/* 		res.json(data[1].contents.title); */
		res.json(data);
	});
	
	g_theme.get_list(evt);

};
exports.theme.get_contents = function(req, res){
	var path = req.query.path;

	fs.readFile(__path + path, "utf8", function(err, data) {
		res.json(data);
	});
};
exports.theme.put_contents = function(req, res){
	var evt = new EventEmitter();

	evt.on("theme_put_contents", function (data) {
		res.json(data);
	});

	g_theme.put_contents(req.query, evt);
	/* 	res.send(null); */
};

/*
 * API : Help
 */
exports.help = function(req, res){
	res.send(null);
};

exports.help.get_readme_markdown = function(req, res){
	var data = g_help.get_readme_markdown();
	
	res.json(data);
};

exports.help.send_to_bug_report = function(req, res) {
	var evt = new EventEmitter();
	
	evt.on("help_send_to_bug_report", function (data) {
		res.json(data);
	});
	
	g_help.send_to_bug_report(req.query, evt);
}

/*
 * API : Auth
 */
exports.auth = function(req, res){
	res.send(null);
};
 
exports.auth.get_info = function(req, res){
	//console.log(req.session.auth.google.user);
	var available_list = g_auth.get_list();
	var evt = new EventEmitter();

	if (req.session.auth && req.session.auth.loggedIn) {
		evt.on("auth_get_info", function(evt, i){
			if(available_list[i]){
				var type = available_list[i];
				if(req.session.auth[type]){
					res.json(req.session.auth[type].user);
				}
				else{
					evt.emit("auth_get_info", evt, ++i);
				}
			}
			else{
				res.json({});
			}
		});
		evt.emit("auth_get_info", evt, 0);
		// for(var type in req.session.auth){
			// if(available_list.indexOf(type) != -1){
				// req.session.auth[type].user.type = type;
				// res.json(req.session.auth[type].user);
				// break;
			// }
		// }
		// res.json(req.session.auth[type].user);
		// res.json(req.session.auth.google.user);
	}
	else {
		res.json({});
	}	
};

exports.auth.login = function(req, res){
	g_auth_manager.login(req.body, req, function(result){
		res.json(result);
	});
}

exports.auth.logout = function(req, res){
	g_auth_manager.logout(req, function(result){
		res.json(result);
	});
}

exports.auth.signup = function(req, res){
	var evt = new EventEmitter();
	
	evt.on("auth_check_user_data", function (data) {
		if(data.result){
			g_auth_manager.register(req, function(result){
				res.json({
					'type' : 'signup',
					'data' : result
				});
			});
		}
		else{
			res.json({
				'type' : 'check',
				'data' : data
			});
		}
	});
	
	g_auth_manager.check(req.body, evt);
};

exports.auth.signup.check = function(req, res){
	var evt = new EventEmitter();

	evt.on("auth_check_user_data", function (data) {
		res.json(data);
	});

	g_auth_manager.check(req.body, evt);
};

exports.admin = function(req, res){
	res.json(null);
}

exports.admin.check = function(req, res){
	g_auth_manager.check_admin(function(result){
		res.json(result);
	});
}

exports.admin.get_config = function(req, res){
	g_admin.get_config(function(config){
		res.json(config);
	});
}

exports.admin.user_add = function(req, res){
	var evt = new EventEmitter();
	
	evt.on("auth_check_user_data", function (data) {
		if(data.result){
			g_auth_manager.user_add(req.body, function(result){
				res.json({
					'type' : 'signup',
					'data' : result
				});
			});
		}
		else{
			res.json({
				'type' : 'check',
				'data' : data
			});
		}
	});
	
	g_auth_manager.check(req.body, evt);
}

exports.admin.user_del = function(req, res){
	g_auth_manager.remove(req.body, function(result){
		res.json(result);
	});
}


exports.user = function(req, res){
	res.json(null);
}

exports.user.get = function(req, res){
	g_auth_manager.user_get(req.body, function(data){
		res.json(data);
	});
}

exports.user.set = function(req, res){
	var evt = new EventEmitter();
	
	evt.on("auth_set_check_user_data", function (data) {
		if(data.result){
			g_auth_manager.user_set(req, function(result){
				res.json({
					'type' : 'set',
					'data' : result // true, false
				});
			});
		}
		else{
			res.json({
				'type' : 'check',
				'data' : data // code, result
			});
		}
	});
	
	g_auth_manager.set_check(req.body, evt);
}

exports.user.list = function(req, res){
	g_auth_manager.get_list(function(data){
		res.json(data);
	});
}

/*
 * Download and Upload
 */
 
exports.download = function(req, res) {
	
	res.download(__temp_dir+'/'+req.query.file, function(err) {
		
		rimraf(__temp_dir+'/'+req.query.file, function(err) {
			if (err!=null) {
			}
			else {
				// download and remove complete
			}
		});

		
	}, function (err) {
		// ...
	});
};

/*
 * Social
 */

exports.social = function(req, res){
	res.send(null);
};

exports.social.login = function(req, res){
	var social_type = req.query.type;
	if(!social_type) res.redirect('/');
	
	var g_social_m = new g_social(social_type);
	g_social_m.login(req, function(result){
		res.redirect('/');
	});
};

exports.social.twitter = function(req, res){
	var method = req.route.method;
	var api_root = req.body.api_root;
	var data = req.body.data;

	var g_social_m = new g_social('twitter');
	g_social_m.load(req.session.auth['twitter'], method, api_root, data, function(result){
		res.json(result);
	});
};


/*************************
 * 로그인 관련
 *************************/
//id/pw 로그인
/*
exports.member = {};
exports.member.login = function(req, res){
	g_member_service.login(req, function(result) { 
		res.send(result); 
	});
};
*/
//로그아웃
/*
exports.member.logout = function(req, res){
	res.send("member logout");
};
*/
//현재 로그인 상태 (로그인한 계정의 정보)
/*
exports.member.login_status = function(req, res){
	res.send("member login status");
};
*/
