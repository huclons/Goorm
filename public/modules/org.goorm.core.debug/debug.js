/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module debug
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class debug
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
				
				core.mainLayout.innerBottomTabView.selectTab(1);
				
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
				core.mainLayout.projectExplorer.refresh();
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
			
				core.mainLayout.projectExplorer.refresh();

				$("#debug").prepend("<pre>"+data+"</pre>");
				if ( typeof func == "function" )
					func();
			}
		});
	},
	
	run: function (cmd, func) {
		var self=this;
		this.func=func;

		$("#console").find("iframe")[0].contentWindow.manda(cmd);

		core.mainLayout.projectExplorer.refresh();
		core.mainLayout.innerBottomTabView.selectTab(3);
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
				// core.mainLayout.projectExplorer.refresh();
				// core.mainLayout.innerBottomTabView.selectTab(2);
// 				
				// c.m(data.split("\n").join("<br/>"), "run");
// 				
				// if ( typeof self.func == "function" )
					// self.func();
			// }
		// });
	}
	
};
