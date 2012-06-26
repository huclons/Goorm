org.goorm.core.preference.info = function (){
	this.browser = name;
	this.version = 0;
	this.version = 3.0;
	this.is_ipad = false;
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
				$("#server_osV").append($(xml).find("OS").attr("version"));
				$("#apache_version").append($(xml).find("Apache").attr("version"));
				$("#php_version").append($(xml).find("PHP").attr("version"));
				$("#redis_version").append($(xml).find("Redis").attr("version"));
				$("#nodeV").append($(xml).find("Node").attr("version"));
			}
		});
		
		$.ajax({
			type: 'get', 
			dataType: "xml",
			url: "configs/goorm.xml", 
			data: "arg=L", 
			success: function(xml) {
				$("#core_version").append($(xml).find("version").text());
				$("#yui_version").append($(xml).find("YUI").attr("version"));
				$("#jquery_version").append($(xml).find("jQuery").attr("version"));
				$("#codemirror_version").append($(xml).find("CodeMirror").attr("version"));
			}
		});
		
		if (navigator.appVersion.indexOf("Win")!=-1) 
			this.os="windows";
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

		this.version = $.browser.version;
		
		//Need for device identification
		this.is_ipad = navigator.userAgent.match(/iPad/i) != null;
		
		$("#cos").append(this.os);
		$("#browser").append(this.browser+" ("+this.version+")");		
		if(this.is_ipad) {
			$("#device").append("iPad");
		}
		else {
			$("#device").append("PC");

		}
		
	}
};
