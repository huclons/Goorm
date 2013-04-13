org.goorm.core.collaboration.push = {
	panel: null,
	index: 0,

	init: function () {
		var self= this;
		$('#layout-doc').append('<div id="push_Message"></div>')
		this.panel = new YAHOO.widget.Panel("push_Message",
			{ 
				width:"240px", 
			 	//fixedcenter:true, 
			 	close:false, 
			 	draggable:false, 
			 	zIndex:9999,
			 	//modal:true,
			 	visible:false,
			 	underlay: "none",
			 	effect:{effect:YAHOO.widget.ContainerEffect.FADE, duration:0.5}
			}
		);

		this.panel.setBody("");
		this.panel.cfg.setProperty('xy', [$('#layout-doc').width()-260, 50]);
		this.panel.render("layout-doc");

		$(core).bind('goorm_login_complete', function(){
			self.socket =    (org.goorm.core.collaboration.communication.socket == null) ? 
							(org.goorm.core.collaboration.communication.socket = io.connect()) :
			 				org.goorm.core.collaboration.communication.socket;
			self.socket.on('push_message',function(data){
				core.module.push_message.show('',data);
			});
		})
		//style="-moz-border-radius:10px !important;-webkit-border-radius:10px !important;border-radius:10px !important;"
	},
	
	show: function (img, str) {
		
		var self = this;
		var body = '<div style="text-align:left;"><img style="vertical-align:middle; margin-right:10px;" src="/images/org.goorm.core.collaboration/hue_thumb.png" /><span style="vertical-align:middle; font-weight:bold;">'+str+'</span></div>';
		this.panel.setBody(body);
		this.panel.show();
		
		setTimeout(function () {
			self.panel.hide();
		},2500);
	},
}