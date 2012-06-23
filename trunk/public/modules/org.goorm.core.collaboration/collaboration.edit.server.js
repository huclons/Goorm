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
 * @class edit.server
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
var server = ws.createServer({ debug: true });

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
  
  //server.send(conn.id, "Connected as: "+conn.id);
  //conn.broadcast("<"+conn.id+"> connected");

  var self = conn;

  conn.redis_subscriber = redis.createClient();
  conn.redis_publisher = redis.createClient();

  conn.redis_subscriber.subscribeTo("*",
    function (channel, message, subscriptionPattern) {
      var output = '{"channel": "' + channel + '", "payload": ' + message + '}';
 
       //sys.puts(output);
       conn.write(output);
  });

  current_user_id = conn.user_id = ++user_count;

  //store the current user's id on global store
  main_store.rpush('pad-users', conn.user_id, function(err, reply){
    main_store.lrange('pad-users', 0, -1, function(err, values){
      conn.write('{"channel": "initial", "id":' + current_user_id + ', "users":[' + values + '] }');
         
         //send all the exisiting diff messages
         // main_store.lrange('pad-diff', 0, -1, function(err, messages){
         // for(var msg_id in messages){
         // conn.write('{"channel": "diff", "payload": ' + messages[msg_id] + '}');
         // }
         // });
         //
 
         main_store.lrange('pad-chat', 0, -1, function(err, messages){
           for(var msg_id in messages){
             conn.write('{"channel": "chat", "payload": ' + messages[msg_id] + '}');
           }
         });
 
         //publish the message when joining
         conn.redis_publisher.publish("join", JSON.stringify({"user": conn.user_id}),
         function (err, reply) {
           sys.puts(err);
           sys.puts("Published message to " +
           (reply === 0 ? "no one" : (reply + " subscriber(s).")));
         });
    });
  });
  
  conn.addListener("message", function(raw_message){
     log(conn.id + ": "+JSON.stringify(raw_message));
    
     message_obj = JSON.parse(raw_message);
     channel = message_obj["type"];
     message = message_obj["message"];
     timestamp = new Date().getTime();
     serialized_message = JSON.stringify({"user": this.user_id, "message": message, "timestamp": timestamp, "channel": channel });
 
     //store snapshot
    if(channel == "snapshot"){
       sys.puts(serialized_message);
       main_store.set('pad-snapshot', serialized_message, function(){});
     }
     //send all the exisiting diff messages
     else if(channel == "playback"){
       main_store.lrange('pad-1', 0, -1, function(err, messages){
         for(var msg_id in messages){
           log(messages[msg_id]);
           var parsed_msg = JSON.parse(messages[msg_id]); //this is a dirty hack REMOVE!
           conn.write('{"channel":"' + parsed_msg['channel'] + '", "payload": ' + messages[msg_id] + '}');
         }

         //once all messages sent, send a playback complete message
         conn.write('{"channel": "playback_done", "payload": "" }');
       });
     }
     else {
       conn.redis_publisher.publish(channel, serialized_message,
         function (err, reply) {
           sys.puts("Published message to " +
             (reply === 0 ? "no one" : (reply + " subscriber(s).")));
           //store the messages on main store
           main_store.rpush('pad-1', serialized_message, function(err, reply){});
       });
     }
  });

});

server.addListener("close", function(conn){
  log(conn.id + ": onClose");
   
   //publish a message before leaving
   conn.redis_publisher.publish("leave", JSON.stringify({"user": conn.user_id}),
     function (err, reply) {
       sys.puts(err);
       sys.puts("Published message to " +
         (reply === 0 ? "no one" : (reply + " subscriber(s).")));
   });
     
   conn.redis_publisher.close();
   conn.redis_subscriber.close();
});

server.listen(8090);