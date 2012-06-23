/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module collaboration
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class chat.server
 * @extends collaboration
 **/

/**
 * This presents the current browser version
 * @property sys
 **/
var sys = require("sys");

/**
 * This presents the current browser version
 * @property ws
 **/
var ws = require('/usr/local/lib/node_modules/websocket-server/lib/ws/server');

/**
 * This presents the current browser version
 * @property redis
 **/
var redis = require("/usr/local/lib/node_modules/redis-client/lib/redis-client");

redis.debug_mode = true;
/**
 * This function is an goorm core initializating function.  
 * @method log
 * @param {Data} data The data. 
 **/
function log(data){
	sys.log("\033[0;32m"+data+"\033[0m");
}

/**
 * This presents the current browser version
 * @property user_count
 * @type Number
 * @default 0
 **/
var user_count = 0;

/**
 * This presents the current browser version
 * @property main_store
 **/
var main_store = redis.createClient();

/**
 * This presents the current browser version
 * @property server
 **/
var server = ws.createServer({ debug: false });

/**
 * This presents the current browser version
 * @property project_id
 **/
var project_id = null;


server.addListener("listening", function(){
	log("Listening for connections.");
});

server.addListener("request", function(req, res){
	res.writeHead(200, {"Content-Type": "text/plain"});
	res.write("Chat Server");
	res.end();
});

// Handle WebSocket Requests
server.addListener("connection", function(conn){
	log("opened connection: "+conn.id);

	var self = conn;

	conn.redis_subscriber = redis.createClient();
	conn.redis_publisher = redis.createClient();

	conn.redis_subscriber.subscribeTo("*", function (channel, message, subscriptionPattern) {
		var output = '{"channel": "' + channel + '", "payload": ' + message + '}';

		conn.write(output);
		log("output" + output);
	});
	
	
	conn.addListener("message", function(raw_message) {
		message_obj = JSON.parse(raw_message);
	
		if (message_obj["type"] != undefined)
			channel = message_obj["type"];
		
		if (message_obj["message"] != undefined)
			message = message_obj["message"];
		
		if (message_obj["project_id"] != undefined) 
			project_id = message_obj["project_id"];
			
		timestamp = new Date().getTime();
				
		//on initial chat of the project
		if(channel == "init"){
			current_user_id = conn.user_id = ++user_count;
			
			//push user to current project user group
			main_store.rpush("users_" + project_id, conn.user_id, function(err, reply){
			
				//get users list from the list
				main_store.lrange("users_" + project_id, 0, -1, function(err, values){
					conn.write('{"channel": "initial", "id":"' + current_user_id + '", "users":[' + values + '] }');
					//get previous messages from a list 		
					main_store.lrange("chat_" + project_id, -3, -1, function(err, messages){
						for(var msg_id in messages){
							conn.write('{"channel": "chat_'+ project_id +'", "payload": ' + messages[msg_id] + '}');
						}
					});
					
					conn.redis_publisher.publish("join", JSON.stringify({"user": conn.user_id}),function (err, reply) {
						sys.puts("139 Published message to " + (reply === 0 ? "no one" : (reply + " subscriber(s).")) + timestamp);
					});	
				});
			});
			sys.puts("user:" + conn.user_id + "has joined to " + project_id + "chat room");
		}
		else{
			serialized_message = '{"user":"' + this.user_id + '", "message": "' + message + '", "timestamp": "' + timestamp + '", "channel": "' + channel + '" }';
 
 			//store snapshot
			if(channel == "leave"){

				conn.redis_publisher.publish("leave", JSON.stringify({"user": conn.user_id}), function (err, reply) {
					//delete user id
					main_store.lrem("users_" + project_id, 0, conn.user_id + "", function (err, values){
						sys.puts("User "+ conn.user_id + " closed");
						conn.redis_publisher.close();
						conn.redis_subscriber.close();
					});
				});
				
				log("closing redis publisher & subscriber…..");
				//conn.redis_publisher.close();
				//conn.redis_subscriber.close();
			}
			else {
				//conn.redis_publisher.publish(channel, serialized_message, function (err, reply) {
				conn.redis_publisher.publish("chat_" + project_id, serialized_message, function (err, reply) {

					sys.puts("168 Published message to " + (reply === 0 ? "no one" : (reply + " subscriber(s).")) + " message: " + raw_message + timestamp);
					//store the messages on main store
					main_store.rpush("chat_" + project_id, serialized_message, function(err, reply){});
				});
			}
		}
	});

});

server.addListener("close", function(conn){
	log("onClose");
   
	//publish a message before leaving
	conn.redis_publisher.publish("leave", JSON.stringify({"user": conn.user_id}), function (err, reply) {
		//sys.puts(err);
		sys.puts("183 Published message to " + (reply === 0 ? "no one" : (reply + " subscriber(s).")));
		
		//delete user id
		main_store.lrem("users_" + project_id, 0, conn.user_id, function (err, reply){
			sys.puts("User "+ conn.user_id + " closed");
		
		
		});
	});
	
	
     
	conn.redis_publisher.close();
	conn.redis_subscriber.close();
});

server.listen(8085);