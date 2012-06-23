org.goorm.core.device = function() {
	
};

org.goorm.core.device.prototype = {
	get: function () {
		//////////////////////////////////////////////////////////////////////////////////////////////////////
		// Get the device type / osType / isTouchDevice
		//////////////////////////////////////////////////////////////////////////////////////////////////////

		var isiPad = navigator.userAgent.match(/iPad/i) != null;
		var isiPhone = navigator.userAgent.match(/iPhone/i) != null;
		var isiPod = navigator.userAgent.match(/iPod/i) != null;
		var isAndroid = navigator.userAgent.match(/Android/i) != null;
		var isWebOS = navigator.userAgent.match(/webOS/i) != null;
		
		
		var result = {};

		if(isiPad) {
			$('.deviceType').html("iPad");
			
			result.deviceType = "iPad";
			result.osType = "iOS";
		}
		else if(isiPhone) {
			$('.deviceType').html("iPhone");
			
			result.deviceType = "iPhone";
			result.osType = "iOS";			
		}
		else if(isiPod) {		
			$('.deviceType').html("iPod");
			
			result.deviceType = "iPod";
			result.osType = "iOS";			
		}
		else if(isAndroid) {		
			$('.deviceType').html("iPod");
			
			result.deviceType = "Android";
			result.osType = "Android";			
		}	
		else if(isWebOS) {		
			$('.deviceType').html("webOS");
			
			result.deviceType = "webOS";
			result.osType = "webOS";			
		}		
		else {
			$('.deviceType').html("PC");
			
			result.deviceType = "PC";
			
			if (navigator.appVersion.indexOf("Win") != -1) {
				result.osType = "Windows";
			}
			if (navigator.appVersion.indexOf("Mac") != -1) {
				result.osType = "MacOS";
			}
			if (navigator.appVersion.indexOf("X11") != -1) {
				result.osType = "UNIX";
			}
			if (navigator.appVersion.indexOf("Linux") != -1) {
				result.osType = "Linux";
			}
		}

		return result;
	}
};