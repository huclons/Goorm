/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.theme = function () {
	this.theme_data = null;
	this.current_theme = null;
};

org.goorm.core.theme.prototype = {

	init: function () {
		var self = this;

		$.get("theme/get_list", "", function (data) {
			self.theme_data = data
			self.make_theme_selectbox();
		});		

/* 		$("#project_explorer").prepend("<div id='project_selector'></div>"); */
/* 		$("#project_selector").append("<label class='selectbox'><select id='project_selectbox'></select></label>") */

		$("#theme_selectbox").change(function() {
			if($(this).val() == -1)
				self.create_new_theme();
			else
				self.on_theme_selectbox_change($(this).val());
		});
	},
	
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
	create_new_theme: function() {
		console.log("create new theme");
		$(".theme_info").empty();
	}
};