/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/



org.goorm.core.terminal = function () {
	this.target = null;
	this.history = [];
	this.history_count = 0;
	this.socket = null;
	this.ansi_color_codes = [
		{key: '30', css: 'color:#000000;'},
		{key: '31', css: 'color:#FF6666;'},
		{key: '32', css: 'color:#66FF66;'},
		{key: '33', css: 'color:yellow;'},
		{key: '34', css: 'color:#6666FF;'},
		{key: '35', css: 'color:purple;'},
		{key: '36', css: 'color:cyan;'},
		{key: '37', css: 'color:white;'},
		{key: '01', css: 'font-weight:bold;'},
		{key: '04', css: 'text-decoration:underline;'},
		{key: '40', css: 'background-color:black;'},
		{key: '41', css: 'background-color:#FF6666;'},
		{key: '42', css: 'background-color:#66FF66;'},
		{key: '43', css: 'background-color:yellow;'},
		{key: '44', css: 'background-color:#6666FF;'},
		{key: '45', css: 'background-color:purple;'},
		{key: '46', css: 'background-color:cyan;'},
		{key: '47', css: 'background-color:white;'},
	];
	this.ansi_color_code_regexp = /\[([0-9][0-9];?)*m/;
	this.bash_text_reset = /\[0*m/;
};

org.goorm.core.terminal.prototype = {
	init: function (target) {
		var self = this;
		
		this.target = target;
		
		this.socket = io.connect();
		
		$(target).append("<div id='result'></div>");
		$(target).append("<div id='prompt'></div>");
		
		$(target).find("#prompt").html("<span id='prompt_path'>user@goorm:/$ </span><input id='prompt_input' />");
		
		$(target).find("#prompt_input").keydown(function (event) {
			if (event.keyCode == '13') {
				event.preventDefault();
				
				var command = $(this).val();
				//self.exec(command);
				
				$(self.target).find("#result").append("<span id='prompt_path'>user@goorm:/$ " + command + "</span>");
				
				self.socket.emit("execute_command", command);
				
				self.history.push(command);
				self.history_count = self.history.length - 1;
			}
			else if (event.keyCode == '40') { //Down Arrow
				if (self.history_count < self.history.length - 1) {
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
		
		$(target).click(function () {
			$(self.target).find("#prompt_input").focus();
		});
		
		this.socket.on("command_result", function (data) {
			var stdout = data.stdout;
			
			stdout = self.transform_bash_to_html(stdout);
			
			$(self.target).find("#result").append("<div class='stdout'>" + stdout + "</div>");
				
			$(self.target).find("#prompt_input").val("");
			$(self.target).find("#prompt_input").focus();
				
			$(self.target).parent().parent().animate({ scrollTop: $(self.target).height() }, 500);
		});
	},
	
	exec: function (command) {
		var self = this;
		
		$.ajax({
			url: "terminal/exec",
			type: "GET",
			data: { command: command },
			success: function (data) {
				var stdout = data.stdout;
				stdout = stdout.split("\n").join("<br />");
				
				$(self.target).find("#result").append("<span id='prompt_path'>user@goorm:/$ " + command + "</span>");
				$(self.target).find("#result").append("<div class='stdout'>" + stdout + "</div>");
				
				$(self.target).find("#prompt_input").val("");
				$(self.target).find("#prompt_input").focus();
				
				$(self.target).parent().parent().animate({ scrollTop: $(self.target).height() }, 500);
			}
		});
	},
	
	transform_bash_to_html: function (data) {
		
		data = data.split("\n");
		
		for (var i=0; i<data.length; i++) {
			
			var words = data[i].split(this.bash_text_reset);
			
			var new_words = '';
			
			if (words.length > 1) {
				new_words = "<table><tr>";
			}
			
			for (var j=0; j<words.length; j++) {
				if (this.ansi_color_code_regexp.test(words[j])) {
					var ansi_color_code = words[j].match(this.ansi_color_code_regexp);
					
					var new_word = "<span style='";
					
					for (var k=0; k<this.ansi_color_codes.length; k++) {
						if (ansi_color_code[0].indexOf(this.ansi_color_codes[k].key) > -1) { 
							new_word += this.ansi_color_codes[k].css;
						}
					}
					
					new_word += "'>" + words[j].replace(this.ansi_color_code_regexp, '') + "</span>";
					
					words[j] = new_word;
				} 
			}
			
			new_words += words.join(" ");
			
			if (words.length > 1) {
				new_words = "</tr></table>";
			}
		}
		
		data = data.join("<br />");
		
		return data;
	}
};