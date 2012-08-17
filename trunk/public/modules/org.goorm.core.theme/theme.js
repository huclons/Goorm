/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.theme = function () {
	this.theme_data = null;
};

org.goorm.core.theme.prototype = {

	init: function () {
		var self = this;

/* 		$("#project_explorer").prepend("<div id='project_selector'></div>"); */
/* 		$("#project_selector").append("<label class='selectbox'><select id='project_selectbox'></select></label>") */
/*

		$("#theme_selectbox").change(function() {
			self.on_project_selectbox_change($(this).val());
		});
*/

		$.get("theme/get_list", "", function (data) {
			self.theme_data = data
			self.make_theme_selectbox();
		});
		
		
	},
	
	make_theme_selectbox: function() {
		var self = this;
		
		$("#theme_selectbox").empty();
		$("#theme_selectbox").append("<option value='' selected>Select Project</option>");
		
		//길이 조절해야함
		var max_num = parseInt($("#theme_selectbox").width()/8);

		
		for(var project_idx=0; project_idx<self.theme_data.length; project_idx++) {
			var temp_name = self.theme_data[project_idx].contents.title;

			if(temp_name.length > max_num) {
				console.log("tmp:"+temp_name);
				temp_name = temp_name.substring(0, max_num-1);
				console.log("tmp:"+temp_name);
				temp_name += " …";
			}			

			if (self.theme_data[project_idx].name == core.status.current_project_path) {
				$("#theme_selectbox").append("<option value='"+project_idx+"' selected>"+temp_name+"</option>");
			}
			else {
				$("#theme_selectbox").append("<option value='"+project_idx+"'>"+temp_name+"</option>");
			}
		}
	}

};