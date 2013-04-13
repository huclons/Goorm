/*
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/
var EventEmitter = require("events").EventEmitter;
module.exports = {
	files: [],
	
	msg: function (io, socket, msg) {
		/*
		 * msg = {slide_url, page}
		 */

		 var message;
		 if(msg.type=="request"){
		 	/*var clients = io.sockets.clients();
		 	for(var i=0 ;i<clients.length;i++){
		 		var client = clients[i];
		 		if(client.store.store)
		 		console.log("client id:",client.store.store,"msg id:",msg.userid);
		 		if(client.store.data.id_type && client.store.data.id_type.id == msg.userid){
		 			console.log("client id:",client.id,"msg id:",msg.userid);
		 			io.sockets.in(msg.workspace).emit("synchronize_request", '{"id":'+client.id+'}');
		 		}
		 	}*/
		 	var user_list = [{id:msg.userid,type:"password",group:msg.group}];
		 	var evt_user = new EventEmitter();
			var clients = io.sockets.clients();
			evt_user.on('get_user', function(evt_user, user_index){
				if(user_list[user_index] != undefined){
					var user = user_list[user_index];
					var evt_client = new EventEmitter();

					evt_client.on('is_connected', function(evt_client, i){

						if(clients[i] != undefined){
							var client = clients[i];

							client.get('id_type', function(err, id_type){
								if(JSON.stringify({'id':user.id,'group':user.group ,'type':user.type}) == id_type){
									
									var data =  {"userid":client.id};
									console.log(msg.group);
									socket.broadcast.to(msg.group).emit("synchronize_request", JSON.stringify(data));
									evt_user.emit('get_user', evt_user, ++user_index);
								}
								else{
									evt_client.emit('is_connected', evt_client, ++i);
								}
							})
						}
						else{
							evt_user.emit('get_user', evt_user, ++user_index);
						}
					});	
					evt_client.emit('is_connected', evt_client, 0);
				}
			});
			evt_user.emit('get_user', evt_user, 0);
		 	
		 }else if(msg.type == "respond"){
		 	message = {slide_url: msg.slide_url, page:msg.page, img:msg.img};
		 	io.sockets.sockets[msg.id].emit("slideshare_message",message);
		 }else{
			message = {slide_url: msg.slide_url, page:msg.page};
		
			socket.broadcast.to(msg.workspace).emit("slideshare_message", message);
			////socket.emit("slideshare_message", message);
		
			//io.sockets.in(msg.workspace).emit("slideshare_message", message);
		}
	},
	alert_msg: function (io, socket, msg) {
		/*
		 * msg = {slide_url, page}
		 */
		// console.log("alert_msg")
		 //console.log(msg)
		 var message;
		 
		 	var clients = io.sockets.clients();
		 	var group=msg.group;
		 	var level=msg.level;
		 	if(level&&level=='Assistant'){
			 	if(msg.type=="every"){
			 		for(var i=0;i<clients.length;i++){
			 			clients[i].get('id_type', function(err, id_type){
			 			var id_type=JSON.parse(id_type);
			 			if(id_type!=null){
			 				var group_user=id_type.group;
			 					if(group_user==msg.group)
			 					io.sockets.sockets[clients[i].id].emit("slideshare_get_msg",msg.msg);

		 				}
		 			
					 	});
					}
				}else if(msg.type=="specific"){

					for(var i=0;i<clients.length;i++){
			 			clients[i].get('id_type', function(err, id_type){
			 			var id_type=JSON.parse(id_type);
			 			if(id_type!=null){
			 				var group_user=id_type.group;
			 					if(group_user==msg.group&&id_type.id==msg.send_to_id)
			 					io.sockets.sockets[clients[i].id].emit("slideshare_get_msg",msg.msg);

		 				}
		 			
					 	});
					}

				}
			}
		 //	io.sockets.emit("slideshare_get_msg",msg.msg);
		 

	}

};

/*{ store: 
   { options: undefined,
     clients: 
      { sQAw_2KrN1032RAoUaLh: [Object],
        G6F7aLxKgWmQ7huQUaLi: [Circular] },
     manager: 
      { server: [Object],
        namespaces: [Object],
        sockets: [Object],
        _events: [Object],
        settings: [Object],
        handshaken: [Object],
        connected: [Object],
        open: [Object],
        closed: {},
        rooms: [Object],
        roomClients: [Object],
        oldListeners: [Object],
        sequenceNumber: 743547618,
        gc: [Object] } },
  id: 'G6F7aLxKgWmQ7huQUaLi',
  data: 
   { workspace: 'dudbstjr70_w',
     id_type: '{"id":"yys1221","type":"password"}' } }*/