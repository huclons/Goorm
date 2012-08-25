/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.edit.dictionary = function () {
	this.dictionary_list = null;
	this.contents = [];
	this.index = 0;
};

org.goorm.core.edit.dictionary.prototype = {
	
	init: function (target, editor, filetype){
		this.dictionary_list = [];
		var self = this;
		
		this.target = target;
		
		this.contents = [];

		$(this.target).append("<div class='dictionary_box'></div>");
		$(this.target).find(".dictionary_box").hide();
		
		this.set(filetype);
	},
	
	set: function (filetype) {
		var self = this;
		
		$(this.target).find(".dictionary_box").empty();
		
		if (filetype != null) {
			$.getJSON("configs/dictionary/" + filetype + ".json", function(data) {
				self.contents = eval(data);
			
				$(self.contents).each(function (i) {
					$(self.target).find(".dictionary_box").append("<div class='dictionary_element'>" + this.keyword + "</div>");
				});
	
				$(self.target).find(".dictionary_box .dictionary_element").hover(
					function () {
						$(self.target).find(".dictionary_box .hovered").removeClass("hovered");
						$(this).addClass("hovered");
					},
					function () {
						$(this).removeClass("hovered");
					}
				);
			});
		}
	},
	
	select: function (direction) {
		var self = this;
		
		if (direction == 1) {
			if ($(this.target).find(".dictionary_box .hovered").prev().length > 0) {
				var temp_el = $(this.target).find(".dictionary_box .hovered");

				temp_el.prev().addClass("hovered");
				temp_el.removeClass("hovered");

				if (this.index > 0) {
					this.index--;
				}
				
				$(this.target).find(".dictionary_box").scrollTop(($(this.target).find(".dictionary_box .hovered").height() - 2) * this.index);
			}
			else {
				$(this.target).find(".dictionary_box .dictionary_element:first").addClass("hovered");
				this.index = 0;
			}
		}
		else if (direction == -1) {
			if ($(this.target).find(".dictionary_box .hovered").next().length > 0) {
				var temp_el = $(this.target).find(".dictionary_box .hovered");

				temp_el.next().addClass("hovered");
				temp_el.removeClass("hovered");
				
				if (this.index < this.contents.length - 1) {
					this.index++;
				}
				
				$(this.target).find(".dictionary_box").scrollTop(($(this.target).find(".dictionary_box .hovered").height() - 2) * this.index);
			}
			else {
				$(this.target).find(".dictionary_box .dictionary_element:first").addClass("hovered");
				this.index = 0;
			}
		}
		
		
		console.log(this.index);
	},
	
	show: function (cursor_pos) {
		$(this.target).find(".dictionary_box").css('left', cursor_pos.x + 50);
		$(this.target).find(".dictionary_box").css('top', cursor_pos.y + 20);
		$(this.target).find(".dictionary_box").show();
		
		$(this.target).find(".dictionary_desc").css('left', cursor_pos.x + 60 + $(this.target).find(".dictionary_box").width());
		$(this.target).find(".dictionary_desc").css('top', cursor_pos.y + 20);
		$(this.target).find(".dictionary_desc").show();
		
		$(this.target).find(".dictionary_box .hovered").removeClass("hovered");
		$(this.target).find(".dictionary_box .dictionary_element:first").addClass("hovered");
		
		this.index = 0;
	},
	
	hide: function () {
		$(this.target).find(".dictionary_box").hide();
		$(this.target).find(".dictionary_desc").hide();
	}

};