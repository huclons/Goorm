var walk=require("walk"),g_env=require("../../configs/env.js"),EventEmitter=require("events").EventEmitter;module.exports={get_list:function(e){var t=this;plugins=[];var n={followLinks:!1};walker=walk.walk(__path+"plugins",n),walker.on("directories",function(t,n,r){if(t==__path+"plugins"){for(var i=0;i<n.length;i++)n[i].name!=".svn"&&plugins.push({name:n[i].name});e.emit("plugin_get_list",plugins)}r()}),walker.on("end",function(){})},do_new:function(e,t){var n=require("../../plugins/"+e.plugin+"/modules/");n.do_new(e,t)},debug_server:function(e){var t=this;console.log("debug server started"),e.set("log level",0),e.sockets.on("connection",function(e){var t=null,n=new EventEmitter;console.log("debug server connected"),n.on("response",function(t){console.log(t),e.emit("debug_response",t)}),e.on("debug",function(e){e.mode=="init"&&(t!==null&&t.debug({mode:"close"},n),t=require("../../plugins/"+e.plugin+"/modules/")),t!==null&&t.debug(e,n)})})},run:function(e,t){var n=require("../../plugins/"+e.plugin+"/modules/");n.run(e,t)}};