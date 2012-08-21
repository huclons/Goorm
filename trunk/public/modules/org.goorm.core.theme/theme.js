/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.theme = function () {
	this.theme_data = null;
	this.current_theme = null;
	this.current_theme_contents = null;
	this.current_theme_contents_position_array = [];
	this.details_dialog = null;
	
};

org.goorm.core.theme.prototype = {

	init: function () {
		var self = this;
		
		this.details_dialog = new org.goorm.core.theme.details();
		this.details_dialog.init();
		
		$.get("theme/get_list", "", function (data) {
			self.theme_data = data
			self.make_theme_selectbox();
		});		

/* 		$("#project_explorer").prepend("<div id='project_selector'></div>"); */
/* 		$("#project_selector").append("<label class='selectbox'><select id='project_selectbox'></select></label>") */

		$("#theme_selectbox").change(function() {
			if($(this).val() == -1){
				self.create_new_theme();
				self.details_dialog.show();
			}
			else{
				self.on_theme_selectbox_change($(this).val());
				self.get_theme_contents($(this).val());
				

			}
		});
	},

	//load theme select box 
	make_theme_selectbox: function() {
		var self = this;
		
		$("#theme_selectbox").empty();
/* 		$("#theme_selectbox").append("<option value='' selected>Select Project</option>"); */

		var max_num = parseInt($("#theme_selectbox").width()/8);

		for(var theme_idx=0; theme_idx<self.theme_data.length; theme_idx++) {
			var temp_name = self.theme_data[theme_idx].contents.title;

			if(temp_name.length > max_num) {
				temp_name = temp_name.substring(0, max_num-1);
				temp_name += " …";
			}

			if (self.theme_data[theme_idx].name == core.preference["preference.theme.current_theme"]) {
				// need to edit 
				$("#theme_selectbox").append("<option value='"+theme_idx+"' selected>"+temp_name+"</option>");
				self.current_theme = self.theme_data[theme_idx];
				self.on_theme_selectbox_change(theme_idx);
			}
			else {
				$("#theme_selectbox").append("<option value='"+theme_idx+"'>"+temp_name+"</option>");
			}
		}
		
		$("#theme_selectbox").append("<option value='-1'>Create New Theme ...</option>");
	},

	//select box change
	on_theme_selectbox_change: function (theme_idx) {
		var self = this;

		self.current_theme = self.theme_data[theme_idx];

		var temp_description = self.current_theme.contents.description;
		var temp_date = self.current_theme.contents.date;
		var temp_author = self.current_theme.contents.author;
		
		var max_num = parseInt(($(".theme_info").width()-80)/8);
		
		if(temp_description.length > max_num) {
			temp_description = temp_description.substring(0, max_num-1);
			temp_description += " …";
		}
		
		if(temp_author.length > max_num) {
			temp_author = temp_author.substring(0, max_num-1);
			temp_author += " …";
		}
		
		$(".theme_info").empty();
		$(".theme_info").append("<div>Description : "+temp_description+"</div>");
		$(".theme_info").append("<div>Version : "+temp_date+"</div>");
		$(".theme_info").append("<div>Author : "+temp_author+"</div>");

	},
	get_theme_contents: function(theme_idx) { 
		var self = this;
		var path = "/public/configs/themes/"+self.current_theme.name+"/"+self.current_theme.name+".json";

		$.ajax({
			url: "theme/get_contents",			
			type: "GET",
			data: { path: path },
			success: function(data) {
				self.current_theme_contents = JSON.parse(data);
				
				for (var position in self.current_theme_contents){
					self.current_theme_contents_position_array.push(position);
				}
				
				self.apply_theme();
			}
		});
	},
	apply_theme: function() {
		var self = this;
		self.save_theme();
	},
	
	save_theme: function() { 
		var self = this;
		console.log("here!!!");
		var url = "theme/put_contents";
		var path = self.current_theme.name + "/" + self.current_theme.name+".css";
		var filedata = "";
		
		for (var position in self.current_theme_contents){
			for(var selector in self.current_theme_contents[position]){
				filedata += selector + " {\n"
				for(var property in self.current_theme_contents[position][selector]){
					filedata += "\t" + property + ":" + self.current_theme_contents[position][selector][property] + ";\n"     
				}
				filedata += "}\n"  
			}
		}

		$.ajax({
			url: url,			
			type: "GET",
			data: { path: path, data: filedata },
			success: function(data) {
				//self.canvas.objects = [];
				//self.canvas.objects = eval(data);
				//self.canvas.draw();

				//apply theme
				var css_node = $("link[kind='theme']");
				if(css_node.length==0){
					$("head").append("<link>");
					css_node = $("head").children(":last");
					css_node.attr({
						rel:  "stylesheet",
						type: "text/css",
						href: "/configs/themes/"+self.current_theme.name + "/" + self.current_theme.name+".css",
						kind: "theme"
					});
				}
				else{
					css_node.attr({
						href: "/configs/themes/"+self.current_theme.name + "/" + self.current_theme.name+".css",
						kind: "theme"
					});
				}

				m.s("Save complete! (" + self.filename + ")", "org.goorm.core.theme");
			}
		});

	},
	//create new theme
	create_new_theme: function() {
		console.log("create new theme");
		$(".theme_info").empty();
	}
};