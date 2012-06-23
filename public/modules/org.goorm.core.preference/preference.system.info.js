org.goorm.core.preference.info = function (){
	this.browser = name;
	this.browserVersion = 0;
	this.version = 3.0;
	this.isiPad = false;
	this.os=null;
};

org.goorm.core.preference.info.prototype = {
	init : function() {
		var self = this;
		$.ajax({
			type: 'get', 
			dataType: "xml",
			url: "configs/server.xml", 
			data: "arg=L", 
			success: function(xml) {
				$("#sosV").append($(xml).find("OS").attr("version"));
				$("#apacheV").append($(xml).find("Apache").attr("version"));
				$("#phpV").append($(xml).find("PHP").attr("version"));
				$("#redisV").append($(xml).find("Redis").attr("version"));
				$("#nodeV").append($(xml).find("Node").attr("version"));
			}
		});
		
		$.ajax({
			type: 'get', 
			dataType: "xml",
			url: "configs/goorm.xml", 
			data: "arg=L", 
			success: function(xml) {
				$("#coreV").append($(xml).find("version").text());
				$("#yuiV").append($(xml).find("YUI").attr("version"));
				$("#jqueryV").append($(xml).find("jQuery").attr("version"));
				$("#codemirrorV").append($(xml).find("CodeMirror").attr("version"));
			}
		});
		
		if (navigator.appVersion.indexOf("Win")!=-1) 
			this.os="Windows";
		else if (navigator.appVersion.indexOf("Mac")!=-1) 
			this.os="MacOS";
		else if (navigator.appVersion.indexOf("X11")!=-1) 
			this.os="UNIX";
		else if (navigator.appVersion.indexOf("Linux")!=-1) 
			this.os="Linux";
		else
			this.os="Unknown";
		
		if($.browser.mozilla)
			this.browser = "Firefox";
		else if($.browser.msie)
			this.browser = "IE";
		else if($.browser.opera)
			this.browser = "Opera";
		else if($.browser.chrome)
			this.browser = "Chrome";
		else if($.browser.safari)
			this.browser = "Safari";
		else
			this.browser = "Unknown";

		this.browserVersion = $.browser.version;
		
		//Need for device identification
		this.isiPad = navigator.userAgent.match(/iPad/i) != null;
		
		$("#cos").append(this.os);
		$("#browser").append(this.browser+" ("+this.browserVersion+")");		
		if(this.isiPad) {
			$("#device").append("iPad");
		}
		else {
			$("#device").append("PC");

		}
		
	}
};
