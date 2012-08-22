/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.debug = function () {
	//this.ready = 1;
	//this.func = null;
	
	this.target = "";
	this.layout = null;
	this.table_thread = null;
	this.table_variable = null;
};

org.goorm.core.debug.prototype = {

	init: function () {
		var self = this;

		$(core).bind("layout_loaded", function () {
			var el = core.module.layout.inner_layout.getUnitByPosition('bottom').get('wrap');
			
			$("#debug").append("<div id='debug_left'>Left Layout</div>");
			$("#debug").append("<div id='debug_center'>Center Layout</div>");
			
			//var el = $("#" + self.target).parent().get(0);
			//$("#" + self.target).parent().height(200);
			
			//$("#" + self.target).height(200);
			
			var layout_bottom_height = $(".yui-layout-unit-bottom").find(".yui-layout-wrap").height() - 26;
			var layout_bottom_width = $(".yui-layout-unit-bottom").find(".yui-layout-wrap").width();
			
			console.log(layout_bottom_width);
			
			$("#debug").height(layout_bottom_height);
			
			self.layout = new YAHOO.widget.Layout("debug", {
				parent: core.module.layout.inner_layout,
				units: [
					{ position: 'left', width: 250, height: layout_bottom_height, body: "debug_left", resize:true, gutter:'0px 0px 0px 0px', collapse:false, minWidth:200, scroll: true },
					{ position: 'center', height: layout_bottom_height, body: "debug_center", resize:true, scroll: true }
				]
			});
			

			self.layout.on("render", function () {
				$("#goorm_inner_layout_bottom").find(".yui-content").height(layout_bottom_height);
				
				console.log(layout_bottom_height);
				
				$("#debug_left").css("height", layout_bottom_height);
				$("#debug_center").css("height", layout_bottom_height);
				
				$("#debug_center").parent().css("width", layout_bottom_width - 250);
				$("#debug_center").parent().parent().css("width", layout_bottom_width - 250);
				
				$("#debug").find(".yui-layout-doc").width("100%");
				
				
				self.table_thread = null;
				self.table_variable = null;
				
				
				var table_thread_column_definition = [
					{key:"no", label:"No", sortable:false },
					{key:"thread", label:"Thread", sortable:false}
				];
				
				var table_thread_data_properties = new YAHOO.util.DataSource();
				table_thread_data_properties.responseSchema = { 
					resultNode: "property", 
					fields: ["no","thread"] 
				};
				
				
				self.table_thread = new YAHOO.widget.DataTable("debug_left", table_thread_column_definition, table_thread_data_properties);
				self.table_thread.render();
				
				

				var table_variable_column_definition = [
					{key:"variable", label:"Variable", sortable:false },
					{key:"value", label:"Value", sortable:false},
					{key:"summary", label:"Summary", sortable:false}
				];
				
				var table_variable_data_properties = new YAHOO.util.DataSource();
				table_variable_data_properties.responseSchema = { 
					resultNode: "property", 
					fields: ["variable","value","summary"] 
				};
				
				
				self.table_variable = new YAHOO.widget.DataTable("debug_center", table_variable_column_definition, table_variable_data_properties);
				self.table_variable.render();

			});

			$(core).bind("layout_resized", function () {
				var layout_bottom_height = $(".yui-layout-unit-bottom").find(".yui-layout-wrap").height() - 26;
				$("#debug_left").css("height", layout_bottom_height);
				$("#debug_center").css("height", layout_bottom_height);
				
				$("#" + self.target).height(layout_bottom_height);
			});
			
			self.layout.render();

		});
	}

	/*

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
*/
	
};
