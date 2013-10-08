
/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jslint evil: true, devel: true, node: true, plusplus: true, unparam: false */
/*global mongoose: true, Scheme: true, org: true, core: true, goorm: true, io: true */

var common = require(__path+"plugins/org.goorm.plugin.nodejs/modules/common.js");
if(!__local_mode) {
var message = require(__path+"modules/org.goorm.core.collaboration/collaboration.message.js")
}
var g_auth = require(__path+"modules/org.goorm.auth/auth.js")
var g_collaboration = require(__path+"modules/org.goorm.core.collaboration/collaboration.js")
var g_communication = require(__path+"modules/org.goorm.core.collaboration/collaboration.communication.js")
var EventEmitter = require("events").EventEmitter

var http = require('http');
var port_fingerprint = '__GOORM_RUN_PORT';
var db_id_fingerprint = '__USER_DB_ID';
var db_pw_fingerprint = '__USER_DB_PW';
var exec = require('child_process').exec;

module.exports = {
	do_new: function(req, res) {
		var evt = new EventEmitter();
		var new_project = require(common.path+"modules/project/new_project.js");
		/* req.data = 
		   { 
			project_type,
			project_detailed_type,
			project_author,
			project_name,
			project_desc,
			use_collaboration
		   }
		*/
		
		evt.on("do_new_complete", function (data) {
			if(global.__service_mode) {
				var user = req.user;
				var project_path = __workspace + req.data.project_author + '_' + req.data.project_name;

				var db_id = user.id;
				var db_pw = user.pw.substring(0,10);
				var io = g_collaboration.get_io();

				var send_message = function(data){
					var return_msg = {
						'db_pw' : user.pw.substring(0,10)
					}

					io.sockets.sockets[data.client.id].emit("nodejs_prj_info", JSON.stringify(return_msg));

					var messagedata = {
						'type' : 'nodejs_prj_info',
						'from' : [{
							'id':'Goorm',
							'type':''
						}],
						'to' : [{
							'id':data.user.id,
							'type':data.user.type
						}],
						'data' : {
							'db_pw' : user.pw.substring(0,10)
						},
						'checked' : false
					}

					message.add(messagedata, {'only_one':true});
				}

				var push_message = function(data){
					var messagedata = {
						'type' : 'nodejs_prj_info',
						'from' : [{
							'id':'Goorm',
							'type':''
						}],
						'to' : [{
							'id':data.user.id,
							'type':data.user.type
						}],
						'data' : {
							'db_pw' : user.pw.substring(0,10)
						},
						'checked' : false
					}

					message.add(messagedata);
				}

				var user_list = [];
				user_list.push({
					'id' : user.id,
					'type' : user.type
				})

				var db_id_replace_command = 'find '+project_path+'/ -name "*.js" -print0 | xargs -0 sed -i "s#'+db_id_fingerprint+'#'+db_id+'#g"';
				var db_pw_replace_command = 'find '+project_path+'/ -name "*.js" -print0 | xargs -0 sed -i "s#'+db_pw_fingerprint+'#'+db_pw+'#g"';

				exec(db_id_replace_command, function(err, stdout, stderr){
				exec(db_pw_replace_command, function(err, stdout, stderr){
					g_communication.is_connected(io, user_list, send_message, push_message);
					res.json(data);
				});
				});
			} else {
				res.json(data);
			}
		});
		
		new_project.do_new(req, evt);
	},
	
	debug: function(req, evt) {
		var debug = require(common.path+"modules/project/debug.js");
		
		if(req.mode == "init") {
			debug.init(req, evt);
		}
		else if (req.mode == "close") {
			debug.close();
		}
		else {
			debug.debug(req, evt);
		}
	},

	undeploy : function(id, callback){
		var content = "";
		http.get('http://service.goorm.io/undeploy?id='+id, function(res){
			res.on('data', function(chunk){
				content += chunk;
			});

			res.on('end', function(){
				if(content && content != ""){
					content = JSON.parse(content);
					
					if(!content.result){
						console.log(content);
					}
				} else {
					console.log(content);
				}

				if(callback) callback()
			})
		})
	},

	get_port : function(id, callback){
		var self = this;
		var response = {};

		var content = "";
		
		http.get('http://service.goorm.io/deploy?id='+id, function(res){
			res.on('data', function(chunk){
				content += chunk;
			});

			res.on('end', function(){
				if(content && content != ""){
					content = JSON.parse(content);

					if(content.result){

						response.result = true;
						response.data = {
							'uid' : content.uid,
							'port' : content.detail
						}
						callback(response);			
					}
					else{
						self.undeploy(id);

						response.result = false;
						response.code = 10;
						callback(response);		
					}
				}
				else{
					self.undeploy(id);

					response.result = false;
					response.code = 11;
					callback(response);
				}
			});
		})
	},

	extend_function: function (req, res) {
		var self = this;

		g_auth.get_user_data(req, function(user_data){
			var auth = {};

			if( user_data.id ) {
				auth.loggedIn = true;
				auth.password = {}
				auth.password.user = user_data;
			}

			/* req.query
				{ 
					data: { project_path: 'miaekim_chat', source_path: './', main: 'app' },
	  				plugin: 'org.goorm.plugin.nodejs_examples',
	  				extend_function: 'replace_app_port' 
	  			}
			*/
			if(auth.loggedIn == undefined ) {
				res.json({
					'code' : 0,
					'result' : false
				})
			} else if( !(auth.loggedIn && auth.password.user.id) ){
				res.json({
					'code' : 0,
					'result' : false
				})
			}
			else if(req.query.extend_function == "stop"){
				if(auth == undefined) {
					res.json({
						'code' : 10,
						'result' : false
					})
				}
				if( !(auth.loggedIn && auth.password.user.id) ){
					res.json({
						'code' : 0,
						'result' : false
					})
				}
				else{
					self.undeploy(auth.password.user.id, function () {
						res.json({'result' : true, command: '\x03', special_key: true});
					});
				}
			}
			else if(req.query.extend_function == "replace_app_port") {
				var user = auth.password.user;
				var data = req.query.data;

				var project_path = data['project_path'];
				var source_path = data['source_path'];
				var main = data['main'];

				var main_file = __workspace + project_path + '/' + source_path + main + '.js';

				if(__service_mode){

					// workspace / project_path /source_path / main
					//
					var run_file = __workspace + project_path + '/' + source_path + main + '_run.js';
					var run_path = __workspace + project_path + '/' + source_path + main + '_run';

					exec('find '+__workspace+project_path+'  -path "*node_modules*"  -prune -o -print | grep .js  ',function(err,stdout,stderr){
						if(!err && !stderr){					
							var file_list=stdout.split("\n");
							file_list.pop();
							var num=0;
							var has_port_fingerprint = false;

							for(var i=0;i<file_list.length;i++){
								if(file_list[i].indexOf('jquery')>=0 || file_list[i].indexOf('json')>=0){
									num++;
								}
								else
								{
									(
										function(iter){
											exec('cat '+file_list[iter], function(err,stdout,stderr){
												num++;

												if(stdout.indexOf(port_fingerprint)>=0){
													has_port_fingerprint=true;												
												}

												if(num==file_list.length){
													////this is the time ending search

													if(!has_port_fingerprint){
														////app does not use port
															res.json({
																'result' : true,
																'use_port' : false,
																'run_path' : main_file
															})
														
													}
													else{
														self.undeploy(user.id, function(){
															self.get_port(user.id, get_port_callback);
														})
													}
												}

											});
										}
									)(i);
								}
							}
						}

					});

					// get port
					//
					//self.get_port(user.id, get_port_callback);


					var get_port_callback = function(get_port_result){
						if(!get_port_result.result){
							res.json(get_port_result);
						}
						else{
							var port = get_port_result.data.port;

							// replace
							// 
							// sed "s/[port_fingerprint]/[given_port]/g" target.js > target_new.js
							var port_replace_command = 'sed "s/'+port_fingerprint+'/'+port+'/g" '+main_file+' > '+run_file+'';

							exec(port_replace_command, function(err, stdout, stderr){
								if(err){
									console.log(port_replace_command);
									console.log(err, stdout, stderr);
									res.json({
										'code' : 2,
										'result' : false
									})
								}
								else{
									var io = g_collaboration.get_io();

									var send_message = function(data){
										var return_msg = {
											'service_path' : 'http://'+data.user.id+'.run.goorm.io'
										}

										io.sockets.sockets[data.client.id].emit("nodejs_info", JSON.stringify(return_msg));
									}

									var push_message = function(data){
										var messagedata = {
											'type' : 'nodejs_info',
											'from' : [{
												'id':'Goorm',
												'type':''
											}],
											'to' : [{
												'id':data.user.id,
												'type':data.user.type
											}],
											'data' : {
												'service_path' : 'http://'+data.user.id+'.run.goorm.io'
											},
											'checked' : false
										}

										message.add(messagedata);
									}

									var user_list = [];
									user_list.push({
										'id' : user.id,
										'type' : user.type
									})

									g_communication.is_connected(io, user_list, send_message, push_message);

									res.json({
										'result' : true,
										'use_port' : true,
										'run_path' : run_path
									})
								}
							});
						}
					}

		
				}
				else{
					res.json({
						'result' : true,
						'use_port' : false,
						'run_path' : main_file
					})
				}
			}
		})
	}
};
