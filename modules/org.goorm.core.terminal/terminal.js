var pty=require("../../libs/pty/pty.js");module.exports={start:function(e){var t=this;e.set("log level",0),e.sockets.on("connection",function(e){var n=[];e.on("terminal_join",function(t){t=JSON.parse(t),e.join(t.workspace+"/"+t.terminal_name),console.log("Joined: "+t.workspace+"/"+t.terminal_name),n.push(pty.spawn("bash",[],{name:"xterm-color",cols:80,rows:30,cwd:process.env.HOME,env:process.env})),n[n.length-1].on("data",function(n){var r={};r.stdout=n,r.terminal_name=t.terminal_name,e.emit("pty_command_result",r)}),console.log("Terminal Count: "+n.length);var r={index:n.length-1,timestamp:t.timestamp};e.to().emit("terminal_index",JSON.stringify(r))}),e.on("terminal_leave",function(t){t=JSON.parse(t),e.leave(t.workspace+"/"+t.terminal_name)}),e.on("pty_execute_command",function(e){console.log("#execute command"),console.log(e),e=JSON.parse(e),t.exec(n[e.index],e.command)}),e.on("change_project_dir",function(t){console.log(t),t=JSON.parse(t),n[t.index].write("cd "+global.__path+"workspace/"+t.project_path+"\r"),e.to().emit("on_change_project_dir",t)})})},exec:function(e,t){e!=undefined&&e!=null?t.indexOf("	")>-1?e.write(t):e.write(t+" \r"):console.log("terminal object is empty...")}};