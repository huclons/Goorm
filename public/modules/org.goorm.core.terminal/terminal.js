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
		{key: '31', css: 'color:#FF8888;'},
		{key: '32', css: 'color:#88FF88;'},
		{key: '33', css: 'color:yellow;'},
		{key: '34', css: 'color:#8888FF;'},
		{key: '35', css: 'color:#FF33FF;'},
		{key: '36', css: 'color:cyan;'},
		{key: '37', css: 'color:white;'},
		{key: '01', css: 'font-weight:bold;'},
		{key: '04', css: 'text-decoration:underline;'},
		{key: '40', css: 'background-color:black;'},
		{key: '41', css: 'background-color:#FF8888;'},
		{key: '42', css: 'background-color:#88FF88;'},
		{key: '43', css: 'background-color:yellow;'},
		{key: '44', css: 'background-color:#8888FF;'},
		{key: '45', css: 'background-color:#FF33FF;'},
		{key: '46', css: 'background-color:cyan;'},
		{key: '47', css: 'background-color:white;'},
	];
	this.ansi_color_code_regexp = /\[([0-9][0-9];?)* ?m/g;
	this.bash_text_reset = /\[0*m/g;
	
	this.user = "";
	this.server = "";
	this.path = "";
	
	this.prompt_length = 0;
	
	//this.timestamp = "";
};

org.goorm.core.terminal.prototype = {
	init: function (target) {
		var self = this;
		
		this.target = target;
		
		this.socket = io.connect();
		
		$(target).append("<div id='welcome'>welcome to goorm terminal :)</div>");
		$(target).append("<div id='results'></div>");
		$(target).append("<span id='prompt'><input id='prompt_input' /></div></span>");
		
		self.timestamp = (new Date()).getTime();
		//$(target).find("#results").append("<div id='result_" + self.timestamp + "'>");
		//$(target).find("#result_" + self.timestamp).append("<span id='prompt_user'>" + self.user+ "</span>@<span id='prompt_server'>" + self.server + "</span>:<span id='prompt_path'>" + self.path + "</span>$ <input id='prompt_input' />");
		
		//$(target).find("#prompt").html("<span id='prompt_user'>" + this.user+ "</span>@<span id='prompt_server'>" + this.server + "</span>:<span id='prompt_path'>" + this.path + "</span>$ <input id='prompt_input' />");
		
		//self.socket.emit("pty_execute_command", "");
		
		$(target).find("#prompt_input").keydown(function (event) {
			if (event.keyCode == '13') {
				event.preventDefault();

				var command = $(this).val();
				//self.exec(command);
				
				//self.timestamp = (new Date()).getTime();
				//$(target).find("#results").append("<div id='result_" + self.timestamp + "'></div>");
				//$(target).find("#result_" + self.timestamp).append("<span id='prompt_user'>" + self.user+ "</span>@<span id='prompt_server'>" + self.server + "</span>:<span id='prompt_path'>" + self.path + "</span>$ ");
				
				self.socket.emit("pty_execute_command", command);
				
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
			else if (event.keyCode == '9') { //Tab
				event.preventDefault();
				
				var command = $(this).val();
				
				self.socket.emit("pty_execute_command", command + '\t');
			}
			else if ((event.keyCode == '99' || event.keyCode == '67') && event.ctrlKey) { //Ctrl + C
				event.preventDefault();
				
				self.socket.emit("pty_execute_command", '^C');
			}
		});
		
		$(target).click(function () {
			$(self.target).find("#prompt_input").focus();
		});
		
		var temp_stdout = "";
		
		this.socket.on("pty_command_result", function (data) {
			var stdout = data.stdout;
			
			temp_stdout += stdout;

			if (stdout.indexOf('\n') > -1 || stdout.indexOf('$') > -1) {
				temp_stdout = self.transform_bash_to_html(temp_stdout);
				$(self.target).find("#results").append(temp_stdout);
				
				temp_stdout = "";
			}
			
			$(self.target).find("#prompt_input").appendTo("#results pre:last");
			
			$(self.target).find("#prompt_input").val("");
			$(self.target).find("#prompt_input").focus();
			
			$(self.target).parent().parent().scrollTop(parseInt($(self.target).height()));
			
			self.resize_all();
		});
		
		$(core).bind("layout_resized", function () {
			self.resize_all();
		});
		
		this.resize_all();
	},
	
	set_prompt: function (data) {
		data = data.replace(']0;', '');
		data = data.split('[')[0];
		data = data.split('@');
		this.user = data[0];
		this.server = data[1].split(':')[0];
		this.path = data[1].split(':')[1];

		$(this.target).find("#prompt").find("#prompt_user").html(this.user);
		$(this.target).find("#prompt").find("#prompt_server").html(this.server);
		$(this.target).find("#prompt").find("#prompt_path").html(this.path);
		
		return this.user + "@" + this.server + ":" + this.path + "$ ";
	},
	
	transform_bash_to_html: function (data) {		
		data = data.split("\n");
		
		for (var i=0; i<data.length; i++) {
			
			if (data[i].indexOf(']0;') > -1) {
				data[i] = this.set_prompt(data[i]);
			}
			else {
				var words = data[i].split(this.bash_text_reset);
				
				var new_words = '';
				/*
				if (words.length > 1) {
					new_words += "<table style='width:100%;'><tr>";
				}
				*/
				
				for (var j=0; j<words.length; j++) {
				
					var spaces = "";
					
					//console.log(words[j] + " / " + this.ansi_color_code_regexp.test(words[j]));
					if (this.ansi_color_code_regexp.test(words[j])) {
						var ansi_color_code = words[j].match(this.ansi_color_code_regexp);
						
						var new_word = "<span style='";
						
						for (var k=0; k<this.ansi_color_codes.length; k++) {
							if (ansi_color_code[0].indexOf(this.ansi_color_codes[k].key) > -1) { 
								new_word += this.ansi_color_codes[k].css;
							}
						}

						var word = words[j].replace(this.ansi_color_code_regexp, '');//.split(' ');
						
						//var value = word.pop();
						//spaces = word.join('&nbsp;');
						
						var value = word.split(' ').join('&nbsp;');
						//console.log(value);
						new_word += "'>" + value + "</span>" + '&nbsp;';
						
						/*
						if (words.length > 1) {
							new_word = "<td style='width:" + 100/words.length + "%;'>" + new_word + "</td>";
						}
						*/
						

						
						//words[j] = spaces + new_word;
						
						words[j] = new_word;
					} 
						
					words[j] = words[j].split('\t').join('&#9;');
				}
				
				
				
				new_words += words.join("");
				
				/*
				if (words.length > 1) {
					new_words += "</tr></table>";
				}
				*/
				
				data[i] = new_words.replace(this.ansi_color_code_regexp, '');
				
				if (data[i].replace(/ */g, "") != "\r") {
				//	if (data[i].indexOf("&#9;") > -1) {
						data[i] = "<pre>" + data[i] + "</pre>";
				//	}
				}
			}


		}
		
		this.prompt_length = data[data.length - 1].length;

		data = data.join("");
		
		return data;
	},
	
	resize_all: function () {
		var layout_bottom_width = $(".yui-layout-unit-bottom").find(".yui-layout-wrap").width() - 20;
		var layout_bottom_height = $(".yui-layout-unit-bottom").find(".yui-layout-wrap").height() - 40;
		var target_height = $(this.target).find("#results").height() + 20;
		var prompt_width = (this.prompt_length + 2) * 9;
		
		$(this.target).find("#prompt_input").width(layout_bottom_width - prompt_width);
		
		if (target_height < layout_bottom_height) {
			$(this.target).height(layout_bottom_height);
		}
		else {
			$(this.target).height(target_height);
		}
	}
};