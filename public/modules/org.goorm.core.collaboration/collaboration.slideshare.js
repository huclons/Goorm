/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/
/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

org.goorm.core.collaboration.slideshare = {
  	socket: null,
	current_slide_name: null,
	button_play: null,
	button_prev: null,
	button_next: null,
	dialog_msg :null,
	buttons_msg:null,
	datum: null,
	flashMovie: null,
	drawing_state: 'undraw',
	slide_show_mode: false,
	layout_temp_data: {},

	init: function(){
		var self = this;
		$(core).bind('goorm_login_complete', function(){
			self.socket =    (org.goorm.core.collaboration.communication.socket == null) ? 
							(org.goorm.core.collaboration.communication.socket = io.connect()) :
			 				org.goorm.core.collaboration.communication.socket;
			self.connecting();
		})

		var slide_body = "";
		slide_body += "<div id='slide_url' class='layout_right_slide_tab'>";
		slide_body +=	"<div id='slide_url_input'>URL <input id='slideshare_url' type='text' value='http://www.slideshare.net/jeg0330/goorm-15035830'/></div>"
		slide_body += "</div>";
		slide_body += "<div id='slide_menu'>"
		slide_body += 	"<div id='slide_control'>"
		slide_body +=		"<button id='slide_prev'>"
		slide_body +=			"<img src='images/icons/context/prev.png' style='margin-top:3px;' />"
		slide_body +=		"</button>"
		slide_body +=		"<button id='slideshare_presentation'>"
		slide_body +=			"<img src='images/icons/context/play.png' style='margin-top:3px;' />"
		slide_body +=		"</button>"
		slide_body +=		"<button id='slide_next'>"
		slide_body +=			"<img src='images/icons/context/next.png' style='margin-top:3px;' />"
		slide_body +=		"</button>"
		slide_body +=	"</div>"
		slide_body += "</div>"
		slide_body += "<iframe id='iframe_slideshare' src='http://"+document.location.host+"/lib/slideshare/slide.html' width='100%' height='100%' frameborder=0 marginwidth=0 marginheight=0 scrolling=no> </iframe>"

		$("#slide_body").append(slide_body);		
		
		this.button_play = new YAHOO.widget.Button("slideshare_presentation", {
			onclick: {
				fn:function(){
					
					var url = $("#slideshare_url").val();
					if(url != ""){
						self.load_slide(url);
					}
					
					if(iframe_slideshare.player && iframe_slideshare.player.jumpTo) {
						iframe_slideshare.player.jumpTo(data.page);
					}
				} 
			}
		});

		this.button_prev = new YAHOO.widget.Button("slide_prev", {
 			onclick: {
 				fn:function(){
	 				iframe_slideshare.player.previous();
	 				self.slide_page = iframe_slideshare.player.getCurrentSlide();
					self.socket_mode("message", '{"channel": "slideshare", "workspace": "'+ core.user.group +'", "slide_url":"'+self.current_slide_name+'", "page":'+iframe_slideshare.player.getCurrentSlide()+'}');
				}
			}
		});
		
		this.button_next = new YAHOO.widget.Button("slide_next", {
 			onclick: {
 				fn: function(){
					iframe_slideshare.player.next();
					self.slide_page = iframe_slideshare.player.getCurrentSlide();
					self.socket_mode("message", '{"channel": "slideshare", "workspace": "'+ core.user.group +'", "slide_url":"'+self.current_slide_name+'", "page":'+iframe_slideshare.player.getCurrentSlide()+'}');
				}
			}
		});
		
		$(core).bind("layout_resized", function () {
			var layout_right_width = $(".yui-layout-unit-right").find(".yui-layout-wrap").width();
			$("#slideshare_url").width(layout_right_width - 80);
		});		
	},

	/*
	 * slideshare 주소를 알아내서 플레이어 로딩.
	 */
	 load_slide: function(url) {
	 	var self = this;
	 	$.ajax({
	 		url: "http://www.slideshare.net/api/oembed/2",
	 		data: {
	 			"url": url,
	 			"format": "json"
	 		},
	 		dataType: "jsonp",
	 		success: function(json){
	 			if(json.slide_image_baseurl){
					var slide_url = json.slide_image_baseurl.match(/.com\/([^/]*)\//);
				}
				
				// this.slideshare.loadPlayer() 에러남.
				iframe_slideshare.loadPlayer(slide_url[1]);
				//  iframe_slideshare.player.getCurrentSlide()
				self.current_slide_name = slide_url[1];
				self.socket_mode("message", '{"channel":"slideshare", "workspace": "'+ core.user.group +'", "slide_url":"'+slide_url[1]+'", "page":1}');
			}
		});
	},

	connecting: function(){
		var self = this;
		self.socket.on("slideshare_message", function (data) {
			if(data.slide_url != self.current_slide_name) {
				iframe_slideshare.loadPlayer(data.slide_url, data.page);
				self.current_slide_name = data.slide_url;
				$("#slideshare_url").val(data.slide_url);
			}
			if(iframe_slideshare.player && iframe_slideshare.player.jumpTo) {
				iframe_slideshare.player.jumpTo(data.page);
			}
		});
	},

	disconnecting: function(){
		this.socket.removeAllListeners("slideshare_get");
		this.socket.removeAllListeners("slideshare_message");
	},

	socket_mode: function(key,message){
		this.socket.emit(key,message);
	}
};