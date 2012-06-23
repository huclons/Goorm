org.goorm.core.browser = function() {
	
};

org.goorm.core.browser.prototype = {
	/**
	 * This function is an goorm core initializating function.  
	 * This operates the initialization tasks for layout, actions, plugins...
	 * @constructor
	 * @param {String} container The container
	 **/
	get: function() {
		var result = {};
		
		//////////////////////////////////////////////////////////////////////////////////////////////////////
		// Get the Browser Information
		//////////////////////////////////////////////////////////////////////////////////////////////////////
		
		var userAgent = navigator.userAgent.toLowerCase();
 
		// Figure out what browser is being used
		$.browser = {
			version: (userAgent.match( /.+(?:rv|it|ra|ie|me)[\/: ]([\d.]+)/ ) || [])[1],
			chrome: /chrome/.test( userAgent ),
			safari: /webkit/.test( userAgent ) && !/chrome/.test( userAgent ),
			opera: /opera/.test( userAgent ),
			msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
			mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )
		};
		
		
		if($.browser.mozilla)
			result.browser = "Firefox";
		else if($.browser.msie)
			result.browser = "IE";
		else if($.browser.opera)
			result.browser = "Opera";
		else if($.browser.chrome)
			result.browser = "Chrome";
		else if($.browser.safari)
			result.browser = "Safari";
		else
			result.browser = "Unknown";
			

		result.browserVersion = $.browser.version;
				
		  
		$('.browserName').html(result.browser + " " + result.browserVersion);
		
		return result;
	}
};