/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/



org.goorm.core.console = function () {
	this.target = null;
	this.history = [];
	this.history_count = 0;
};

org.goorm.core.console.prototype = {
	init: function (target) {
		var self = this;
		
		this.target = target;
		
		$(target).append("<div id='result'></div>");
		$(target).append("<div id='prompt'></div>");
		
		$(target).find("#prompt").html("<span id='prompt_path'>user@goorm:/$ </span><input id='prompt_input' />");
		
		$(target).find("#prompt_input").keydown(function (event) {
			if (event.keyCode == '13') {
				event.preventDefault();
				
				var command = $(this).val();
				self.exec(command);
				self.history.push(command);
				self.history_count = self.history.length - 1;
			}
			else if (event.keyCode == '40') { //Down Arrow
				if (self.history_count < self.history.length) {
					self.history_count++;
				}
				
				$(self.target).find("#prompt_input").val(self.history[self.history_count]);
			}
			else if (event.keyCode == '38') { //Up Arrow
				if (self.history_count > 0) {
					self.history_count--;
				}
				
				$(self.target).find("#prompt_input").val(self.history[self.history_count]);
			}
		});
	},
	
	exec: function (command) {
		var self = this;
		
		$.ajax({
			url: "shell/exec",
			type: "GET",
			data: { command: command },
			success: function (data) {
				var stdout = data.stdout;
				stdout = stdout.split("\n").join("<br />");
				
				$(self.target).find("#result").append("<span id='prompt_path'>user@goorm:/$ " + command + "</span>");
				$(self.target).find("#result").append("<div class='stdout'>" + stdout + "</div>");
				
				$(self.target).find("#prompt_input").val("");
				$(self.target).find("#prompt_input").focus();
				
				console.log($(self.target).parent().parent().html());
				$(self.target).parent().parent().animate({ scrollTop: $(self.target).height() }, 500);
			}
		});
	}
};