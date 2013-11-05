/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jslint evil: true, devel: true, node: true, plusplus: true, unparam: false */
/*global mongoose: true, Scheme: true, org: true, core: true, goorm: true, io: true */

var fs = require("fs");
var rimraf = require('rimraf');
var exec = require('child_process').exec;

//var g_env = require("../configs/env.js");

var g_file = require("../modules/org.goorm.core.file/file");
var g_preference = require("../modules/org.goorm.core.preference/preference");
var g_project = require("../modules/org.goorm.core.project/project");
var g_terminal = require("../modules/org.goorm.core.terminal/terminal");
var g_theme = require("../modules/org.goorm.core.theme/theme");
var g_plugin = require("../modules/org.goorm.plugin/plugin");
var g_help = require("../modules/org.goorm.help/help");
var g_search = require("../modules/org.goorm.core.search/search");
var g_edit = require("../modules/org.goorm.core.edit/edit");
var g_function =require("../modules/org.goorm.core.function/function");



var EventEmitter = require("events").EventEmitter;



var check_special_characters = function(str) {
	var regex = ['~', '!', '#', '$', '^', '&', '*', '=', '+', '|', ':', ';', '?', '"', '<', '.', '>', ' '];
	var modify_regex = ['\~', '\!', '\#', '\$', '\^', '\&', '\*', '\=', '\+', '\|', '\:', '\;', '\?', '\"', '\<', '\.', '\>', '\\ '];

 	if (str) {
		var index = 0;

 		for(index=0; index<regex.length; index++) {
 			var ch = regex[index];
 			var modify_ch = regex[index];

 			str = str.split(ch).join(modify_ch);
 		}
 	}

 	return str;
};
var check_valid_path = function(str){
	if(!str)return false;
	return !(/\.\.|~|;|&|\|/.test(str));
};
/*
 * GET home page.
 */

exports.index = function(req, res){
	var mode = "all";

	

	
	if( __optimization_mode ) {
		res.render('main.html');
	}
	else {
		res.render('index', { 'title': 'goormIDE', 'mode': mode });
	}
	
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

	

	
	g_project.get_list(req.query, evt);
	
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

exports.project.move_file = function(req, res){
	g_project.move_file(req.query, res);
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
exports.plugin.make_template = function(req, res){

	

	
	g_plugin.make_template(req.query, res);
	
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

exports.plugin.stop = function(req, res){
	g_plugin.stop(req.query, res);
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

	

	
	var project_path = req.query.path.split("/")[0];
	if(req.query.path.split("/")[0] == "")
		project_path = req.query.path.split("/")[1];

	valid_project(project_path, req.__user.id, function(result){
		if (result) {
			g_file.do_new(req.query, evt);
		}
		else {
			var res_data = {
				err_code : 20,
				message : 'alert_file_permission',
				path: req.query.ori_name
			}

			res.json(res_data);
		}
	});
	
};

exports.file.do_new_folder = function(req, res){
	var evt = new EventEmitter();
	
	evt.on("file_do_new_folder", function (data) {
		res.json(data);
	});

	

	
	var project_path = req.query.current_path.split("/")[0];
	if(req.query.current_path.split("/")[0] == "")
		project_path = req.query.current_path.split("/")[1];

	valid_project(project_path, req.__user.id, function(result){
		if (result) {
			g_file.do_new_folder(req.query, evt);
		}
		else {
			var res_data = {
				err_code: 20,
				message : 'alert_file_permission',
				path: req.query.ori_name
			}

			res.json(res_data);
		}
	});
	
};

exports.file.do_new_other = function(req, res){
	var evt = new EventEmitter();
	
	evt.on("file_do_new_other", function (data) {
		res.json(data);
	});

	

	
	var project_path = req.query.current_path.split("/")[0];
	if(req.query.current_path.split("/")[0] == "")
		project_path = req.query.current_path.split("/")[1];

	valid_project(project_path, req.__user.id, function(result){
		if (result) {
			g_file.do_new_other(req.query, evt);
		}
		else {
			var res_data = {
				err_code: 20,
				message : 'alert_file_permission',
				path: req.query.ori_name
			}

			res.json(res_data);
		}
	});
	
};


exports.file.do_new_untitled_text_file = function(req, res){
	var evt = new EventEmitter();

	evt.on("file_do_new_untitled_text_file", function (data) {
		res.json(data);
	});

	

	
	var project_path = req.query.current_path.split("/")[0];
	if(req.query.current_path.split("/")[0] == "")
		project_path = req.query.current_path.split("/")[1];

	valid_project(project_path, req.__user.id, function(result){
		if (result) {
			g_file.do_new_untitled_text_file(req.query, evt);
		}
		else {
			var res_data = {
				err_code: 20,
				message : 'alert_file_permission',
				path: req.query.ori_name
			}

			res.json(res_data);
		}
	});
	
};

exports.file.do_load = function(req, res){
	res.send(null);
};

exports.file.do_save_as = function(req, res){
	var evt = new EventEmitter();
	
	evt.on("file_do_save_as", function (data) {
		res.json(data);
	});

	var project_path = req.query.path.split("/")[0];
	if(req.query.path.split("/")[0] == "")
		project_path = req.query.path.split("/")[1];

	valid_project(project_path, req.__user.id, function(result){
		if (result) {
			g_file.do_save_as(req.query, evt);
		}
		else {
			var res_data = {
				err_code: 20,
				message : 'alert_file_permission',
				path: req.query.ori_name
			}

			res.json(res_data);
		}
	});
};

exports.file.do_delete_all = function(req, res){
	//var evt = new EventEmitter();
	var files = req.query.files;
	var directories = req.query.directorys;

	var items = files.concat(directories);

	var evt = new EventEmitter();
	evt.on('fail', function (){
		var data = {};
		data.err_code = 20;
		data.message = "Can not delete file";

		res.json({
			result : data
		});
	});

	evt.on('check_all', function (__evt, i){
		if (items[i]) {
			var path = items[i].split("/")[0];
			if (path == "") path = items[i].split("/")[1];

			valid_project(path, req.__user.id, function (result){
				if(result) {
					__evt.emit('check_all', __evt, ++i);
				}
				else {
					__evt.emit('fail');
				}
			});
		}
		else {
			g_file.do_delete_all(req.query, function(result){
				res.json(result);
			});
		}
	});

	evt.emit('check_all', evt, 0);
}
exports.file.do_copy_file_paste = function(req, res){
	var files = req.query.files || [];
	var directories = req.query.directorys || [];

	var items = files.concat(directories);

	var evt = new EventEmitter();
	evt.on('fail', function (){
		var data = {};
		data.err_code = 20;
		data.message = "Can not cp&paste file";

		res.json({
			result : data
		});
	});

	evt.on('check_all', function (__evt, i){
		if (items[i]) {
			var path = items[i].split("/")[0];
			if (path == "") path = items[i].split("/")[1];

			valid_project(path, req.__user.id, function (result){
				if(result) {
					__evt.emit('check_all', __evt, ++i);
				}
				else {
					__evt.emit('fail');
				}
			});
		}
		else {
			g_file.do_copy_file_paste(req.query, function(result){
				res.json(result);
			});
		}
	});

	evt.emit('check_all', evt, 0);
}

exports.file.do_delete = function(req, res){
	var evt = new EventEmitter();
	var user_level = null;
	var author_level = null;

	evt.on("file_do_delete", function (data) {
		res.json(data);
	});

	

	

	
	g_file.do_delete(req.query, evt);
	
};


exports.file.get_contents = function(req, res){
	var path = req.query.path;
	var abs_path = __path + path;

	//1. valid path
	if( !check_valid_path(path) ){
		console.log('invalid path in get_contents');
		res.json(false);
		return false;
	}

	//2. don't need to check (ex) dialog html
	if(req.query.type !== 'get_workspace_file'){
		fs.readFile(abs_path, "utf8", function(err, data) {
			if(err){
				res.json(false);
			}else{
				res.json(data);
			}
		});
		return true;
	}
	
	//from here workspace file!!!!!
	abs_path = __workspace + path;	
	//local -> do not check any thing

	
	fs.readFile(abs_path, "utf8", function(err, data) {
		if(err){
			res.json(false);
		}else{
			res.json(data);
		}
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
	var evt = new EventEmitter();
	var path = req.query.path;
	var type = req.query.type || null;
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

	

	
	var nodes_data = {
		path : __workspace+'/' + path
	};

	g_file.get_nodes(nodes_data, evt, type);
	
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
	
	

	
	req.query.path = __workspace+'/' + path;
	g_file.get_dir_nodes(req.query, evt);
	
};

exports.file.get_result_ls = function(req, res){
	var evt = new EventEmitter();
	//var path = req.query.path;
	//path = path.replace(/\/\//g, "/");

	evt.on("got_result_ls", function (data) {
		res.json(data);
	});

	

	
	g_file.get_result_ls(req.query, evt);
	
};


exports.file.get_file = function(req, res){
	var evt = new EventEmitter();
	var filepath = req.query.filepath;
	var filename = req.query.filename;
	if(filepath)
		filepath = filepath.replace(/\/\//g, "/");
	else{
		res.json({});
		return;		
	}
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


exports.file.check_valid_edit = function(req, res){
	var evt = new EventEmitter();
	var project_path = req.body.project_path;
	var filepath = req.body.filepath;
	var filename = req.body.filename;

	if(project_path && filepath && filename){
		filepath = filepath.replace(/\/\//g, "/");
		if( !check_valid_path(project_path) || !check_valid_path(filepath) || !check_valid_path(filename) ){
			res.json({});
			return false;			
		}
	}
	else{
		res.json({});
		return false;		
	}
	evt.on("check_valid_edit", function (data) {
		if(!data.result) {
			switch(data.code) {
				case 0:
					console.log('Error: check_valid_edit, project not found.', __workspace + project_path);
					break;

				case 1:
					console.log('Error: check_valid_edit, project path is not directory.', __workspace + project_path);

				case 2:
					console.log('Error: check_valid_edit, project path cannot read.', __workspace + project_path);

				case 10:
					
					break;

				default:
					break;
			}
		}

		res.json(data);
	});
	
	g_file.check_valid_edit(project_path, filepath, filename, evt);
};



exports.file.do_move = function(req, res){
	var evt = new EventEmitter();
	var user_level = null;
	var author_level = null;

	var move_fail = function (msg) {
		var res_data = {
			err_code : 20,
			message : msg,
			path: req.query
		};
		res.json(res_data);
	};
	evt.on("file_do_move", function (data) {
		res.json(data);
	});

	

	
	g_file.do_move(req.query, evt);
	
};

exports.file.do_rename = function(req, res){
	var evt = new EventEmitter();
	var user_level = null;
	var author_level = null;

	evt.on("file_do_rename", function (data) {
		res.json(data);
	});

	if(req.query.ori_path === '/' || req.query.ori_path === '') {
		var res_data = {
			err_code : 20,
			message : 'alert_deny_rename_folder_in_workspace_root',
			path: req.query.ori_name
		};
		res.json(res_data);
	} else {
		

		
		g_file.do_rename(req.query, evt);
		
	}
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

	if(req.query.is_overwrite)
		req.body.is_overwrite = req.query.is_overwrite;

	g_file.do_import(req.body, req.files.file, evt);
};

exports.file.do_search_on_project = function(req, res){
	var evt = new EventEmitter();

	evt.on("file_do_search_on_project", function (data) {
		res.send(data);
	});
	
	

	
	g_search.do_search(req.query, evt);
	
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
	var path = req.body.path;

	fs.readFile(__path + path, "utf8", function(err, data) {
		res.json(data);
	});
};
exports.theme.put_contents = function(req, res){
	var evt = new EventEmitter();

	evt.on("theme_put_contents", function (data) {
		res.json(data);
	});

	g_theme.put_contents(req.body, evt);
	/* 	res.send(null); */
};

/*
 * API : Help
 */
exports.help = function(req, res){
	res.send(null);
};

exports.help.get_readme_markdown = function(req, res){
	var data = g_help.get_readme_markdown(req.query.language, req.query.filename, req.query.filepath);
	
	res.json(data);
};



exports.project.get_contents = function(req, res){
	var path = req.query.path;
	var user = req.query.username;

	var command = exec("cd "+__workspace+path+";zip -r " + __temp_dir+path + ".zip *", function (error, stdout, stderr) {
		if (error == null) {
			fs.readFile(__temp_dir+path + ".zip", "base64",function(err, data) {
				res.send(data);
			});
		}
		else {
			console.log("error : "+error);
			res.send("error : "+error);
		}
	});
}




/*
 * Download and Upload
 */
 
exports.download = function(req, res) {
	res.download(__temp_dir+'/'+req.query.file, function(err) {
		if(err){
			console.log('download err', err);
			res.json('download fail try later.');
		}
		rimraf(__temp_dir+'/'+req.query.file, function(err) {

			if (err) {
				console.log('after download, rimraf err', err);
			}
			else {

				// download and remove complete
			}
		});

		
	}, function (err) {
		// ...
		console.log('Donwload Error : ['+err+']');
	});
};
exports.upload = function(req,res){
	//req.files
	//req.body.file_import_location_path
	// console.log(req.files);
	// console.log(req.body);


	var file_import_location_path= req.body.file_import_location_path;

	if(!req.files){
		res.json({'err_code':10, 'message':'No file to upload'});
		return false;
	}
	else if(!file_import_location_path || file_import_location_path.indexOf('..') > -1){
		
		res.json({'err_code':20, 'message':'Invalid Query'});
		return false;
	}

	var file_list=[];

	if(!Array.isArray(req.files.file)){
		//one file
		file_list.push(req.files.file);

	}else{
		file_list=req.files.file;
	}


	if( file_list.length == 0  ){
		console.log('1-1');
		res.json({'err_code':10, 'message':'No file to upload'});
		return false;
	}
	




	var evt = new EventEmitter();

	var do_import_cnt=file_list.length;
	var complete_import_cnt=0;

	evt.on('file_do_import', function(result){
		complete_import_cnt++;
		if(result.err_code!==0){
			res.json(result);
			return false;

		}
		if(complete_import_cnt===do_import_cnt){
			evt.emit('all_file_do_import',result);
		}


	});

	evt.on('all_file_do_import', function(result){
		//complete
		authority_setting(file_import_location_path.split('/')[0],  file_import_location_path);
		res.json(result);
	});




	for(var i=0;i<do_import_cnt;i++){
		
		g_file.do_import( req.body, file_list[i],  evt );
	}
	

	
}
exports.send_file=function(req,res){
	// console.log('__workspace', __workspace)
	// console.log('req.query.file', req.query.file);
	// var path=__workspace+'/'+req.query.file;
	// for(var i=0;i<4;i++){
	// 	path = path.replace(/\/\//g, "/");
	// }
	 if(req.query.file.indexOf('..')>-1){
	 	console.log('hacking trial!!')
	 	res.json(null);
	 	return false;
	 }
	//console.log(path);
	res.sendfile(req.query.file, {'root' :__temp_dir}, function(err) {
		if(err)console.log(err);
		 rimraf(__temp_dir+'/'+req.query.file, function(err) {
		 	if (err!=null) {
		 	}
		 	else {
		 		// send file remove?????????
		 	}
		 });

		
	}, function (err) {
		// ...
	});
};


exports.upload_dir_file = function(req,res){
	var evt = new EventEmitter();
	
	evt.on("upload_dir_file", function (data) {
		res.json(data);
	});

	g_file.upload_dir_file(req, evt);
};

exports.upload_dir_skeleton = function(req,res){
	var evt = new EventEmitter();
	
	evt.on("upload_dir_skeleton", function (data) {
		res.json(data);
	});

	g_file.upload_dir_skeleton(req, evt);
};



exports.edit = function(req,res){
	res.send(null);
}

exports.edit.get_dictionary = function(req, res){
	var evt = new EventEmitter();
	
	evt.on("edit_get_dictionary", function (data) {
		res.json(data);
	});

	g_edit.get_dictionary(req.query, evt);
};



exports.edit.get_proposal_java = function(req, res){
	var evt = new EventEmitter();
	
	evt.on("got_proposal_java", function (data) {
		res.json(data);
	});

	g_edit.get_proposal_java(req.query, evt);
};


exports.edit.get_auto_import_java = function(req, res){
	var evt = new EventEmitter();
	
	evt.on("got_auto_import_java", function (data) {
		res.json(data);
	});

	g_edit.get_auto_import_java(req.query, evt);
};


exports.edit.get_object_explorer = function(req,res){
	var evt =  new EventEmitter();

	evt.on("got_object_explorer",function(data){
		res.json(data);
	});
	g_edit.get_object_explorer(req.query,evt);
}


exports.edit.save_tags = function(req, res){
	var option = req.body;

	

	
	g_edit.save_tags_data(option);
	res.json(true);
	
}

exports.edit.load_tags = function(req, res){
	var option = req.query;

	

	
	g_edit.load_tags_data(option, function(response){
		res.json(response);
	});
	
}


exports.function = function (req,res){
	res.json(null);
}

exports.function.get_function_explorer =function(req,res){
	var evt = new EventEmitter();

	evt.on("got_function_explrorer",function(data){
		res.json(data);
	});
	console.log(req.query);
	g_function.get_function_explorer(req.query, evt);

}






