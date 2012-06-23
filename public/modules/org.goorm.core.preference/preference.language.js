org.goorm.core.preference.language = function () {
	this.preference = null;
};

org.goorm.core.preference.language.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor
	 **/
	init: function () {
		var self = this;
		
		var language = "";

		var laguageButton = new YAHOO.widget.Button("languageButton", {
													type: "menu",
													menu: "languageSelect"});

		var onMenuClick = function (p_sType, p_aArgs) {
			var oEvent = p_aArgs[0],	//	DOM event
				oMenuItem = p_aArgs[1];	//	MenuItem instance that was the target of 
										//	the event 
			if (oMenuItem) {
				$("#languageButton-button").text($(oMenuItem.element).text());
				core.localization.changeLanguage(oMenuItem.value);
			}
		 
		};
 
		laguageButton.getMenu().subscribe("click", onMenuClick);
		
		if(localStorage.getItem("language")==null) {
			if (core.serverLanguage=="client") {
				if(navigator.language=="ko") {
					language = "kor";
				}
				else {
					language = "us";
				}
			}
			else {
				language = core.serverLanguage;
			}
			
			core.localization.changeLanguage(language);
			core.localization.beforeLanguage=language;
			
		}
		else {
			core.localization.changeLanguage(localStorage.getItem("language"));
			core.localization.beforeLanguage=localStorage.getItem("language");
		}
		
		var languagePackDownloadButton = new YAHOO.widget.Button("languagePackDownloadButton");
	}
}