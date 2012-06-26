/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.debug = function () {
	//this.ready = 1;
	this.func = null;
};

org.goorm.core.debug.prototype = {
	
	shell: function (cmd, func) {
		var self = this;
		var url = "shell/execute";

		$.ajax({
			url: url,			
			type: "POST",
			data: "cmd="+cmd,
			beforeSend: function(){
				var func = func;
			},
			success: function(data) {
				
				core.module.layout.inner_bottom_tabview.selectTab(1);
				
				data = data.replace(/ /gi, "");
				
				if(data.length==1) {
					data = data.replace(/\n/gi, "");
				}
								
				if(data=="") {
					$("#debug").prepend("<pre>build complete!</pre>");
				}
				else {
					$("#debug").prepend("<pre>"+data+"</pre>");
				}
				
				if ( typeof func == "function" ) {
					func();
				}
				core.module.layout.project_explorer.refresh();
			}
		});
	},
	
	shell2: function (cmd, func) {
		var self = this;
		var url = "shell/execute";
		//this.func = func;
		
		$.ajax({
			url: url,			
			type: "POST",
			data: "cmd="+cmd+"&option=android",
			beforeSend: function(){
				var func = func;
			},
			success: function(data) {
			
				core.module.layout.project_explorer.refresh();

				$("#debug").prepend("<pre>"+data+"</pre>");
				if ( typeof func == "function" )
					func();
			}
		});
	},
	
	run: function (cmd, func) {
		var self=this;
		this.func=func;

		$("#console").find("iframe")[0].contentwindow.manda(cmd);

		core.module.layout.project_explorer.refresh();
		core.module.layout.inner_bottom_tabview.selectTab(3);
		if ( typeof self.func == "function" )
			self.func();
		// var self = this;
		// var url = "module/org.goorm.core.debug/debug.shell.php";
		// this.func = func;
		// $.ajax({
			// url: url,			
			// type: "POST",
			// data: "cmd="+cmd,
			// success: function(data) {
				// core.module.layout.project_explorer.refresh();
				// core.module.layout.inner_bottom_tabview.selectTab(2);
// 				
				// c.m(data.split("\n").join("<br/>"), "run");
// 				
				// if ( typeof self.func == "function" )
					// self.func();
			// }
		// });
	}
	
};
