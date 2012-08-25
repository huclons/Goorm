/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.core.edit.dictionary = function () {
	this.dictionary_list = null;	

};

org.goorm.core.edit.dictionary.prototype = {
	
	init: function (target, editor, filetype){
		this.dictionary_list = [];
		var self = this;
		
		this.target = target;
		
		this.contents = {};
		
		this.contents.js = [
			{
				keyword: "1. abcd",
				type: "",
				description: "asdfsafsafasfsfd"
			},
			{
				keyword: "2. abcefasdfd",
				type: "",
				description: "asdfsafsafasfsfd"
			},
			{
				keyword: "3. abasdfcd",
				type: "",
				description: "asdfsafsafasfsfd"
			},
			{
				keyword: "4. aasdbcd",
				type: "",
				description: "asdfsafsafasfsfd"
			},
			{
				keyword: "5. abfcd",
				type: "",
				description: "asdfsafsafasfsfd"
			},
			{
				keyword: "6. abasdcd",
				type: "",
				description: "asdfsafsafasfsfd"
			},
			{
				keyword: "7. abcddfsdf",
				type: "",
				description: "asdfsafsafasfsfd"
			},
			{
				keyword: "8. abcasdfsfffd",
				type: "",
				description: "asdfsafsafasfsfd"
			},
			{
				keyword: "9. abcffsdfsdfsfdd",
				type: "",
				description: "asdfsafsafasfsfd"
			},
			{
				keyword: "10. aasdbcd",
				type: "",
				description: "asdfsafsafasfsfd"
			},
			{
				keyword: "11. abfcd",
				type: "",
				description: "asdfsafsafasfsfd"
			},
			{
				keyword: "12. abasdcd",
				type: "",
				description: "asdfsafsafasfsfd"
			},
			{
				keyword: "13. abcddfsdf",
				type: "",
				description: "asdfsafsafasfsfd"
			},
			{
				keyword: "14. abcasdfsfffd",
				type: "",
				description: "asdfsafsafasfsfd"
			},
			{
				keyword: "15. abcffsdfsdfsfdd",
				type: "",
				description: "asdfsafsafasfsfd"
			}
		];
		
		this.contents.cpp = [
		];
		
		this.contents.xml = [
		];

		$(this.target).append("<div class='dictionary_box'></div>");
		$(this.target).find(".dictionary_box").hide();
		
		this.set(this.contents.js);
	},
	
	set: function (contents) {
		var self = this;
		
		$(this.target).find(".dictionary_box").empty();
		
		$(contents).each(function (i) {
			$(self.target).find(".dictionary_box").append("<div class='dictionary_element'>" + this.keyword + "</div>");
		});
		
		
		$(this.target).find(".dictionary_box .dictionary_element").hover(
			function () {
				$(self.target).find(".dictionary_box .hovered").removeClass("hovered");
				$(this).addClass("hovered");
			},
			function () {
				$(this).removeClass("hovered");
			}
		);
	},
	
	select: function (direction) {
		var self = this;
		
		if (direction == 1) {
			if ($(this.target).find(".dictionary_box .hovered").prev().length > 0) {
				var temp_el = $(this.target).find(".dictionary_box .hovered");

				temp_el.prev().addClass("hovered");
				temp_el.removeClass("hovered");
				
				console.log(temp_el.prev().position());
				
/*
				if (temp_el.prev().position().top < $(this.target).find(".dictionary_box").height()) {
					$(this.target).find(".dictionary_box").scrollTop(temp_el.prev().position().top);
				}
*/
				$(this.target).find(".dictionary_box").scrollTop(temp_el.prev().position().top + temp_el.prev().height() - $(this.target).find(".dictionary_box").height());
			}
			else {
				$(this.target).find(".dictionary_box .dictionary_element:first").addClass("hovered");
			}
		}
		else if (direction == -1) {
			if ($(this.target).find(".dictionary_box .hovered").next().length > 0) {
				var temp_el = $(this.target).find(".dictionary_box .hovered");

				temp_el.next().addClass("hovered");
				temp_el.removeClass("hovered");
				
				console.log(temp_el.next().position());
				
				//if (temp_el.next().position().top > $(this.target).find(".dictionary_box").height()) {
					$(this.target).find(".dictionary_box").scrollTop(temp_el.next().position().top + temp_el.next().height() - $(this.target).find(".dictionary_box").height());
				//}
			}
			else {
				$(this.target).find(".dictionary_box .dictionary_element:first").addClass("hovered");
			}
		}
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
	},
	
	hide: function () {
		$(this.target).find(".dictionary_box").hide();
		$(this.target).find(".dictionary_desc").hide();
	}

};