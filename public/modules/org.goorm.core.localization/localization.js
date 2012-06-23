/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module menu
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class menu
 **/
org.goorm.core.localization = function () {
	/**
	 * This presents the current browser version
	 * @property language
	 * @type Object
	 * @default null
	 **/
	this.language = null;
	
	/**
	 * This presents the current browser version
	 * @property data
	 * @type Object
	 * @default null

	 **/
	this.data1 = null;
	
	this.data2 = null;
	
	this.data3 = null;
	
	this.beforeLanguage = null;
	
	this.msg = null;
};

org.goorm.core.localization.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 **/
	init: function () {

	},
	
	/**
	 * This function is an goorm core changeLanguage function.  
	 * @constructor 
	 **/
	changeLanguage: function (language) {
		var self = this;
		
		var isFirst = false;
		
		if (localStorage.getItem("language")==null && core.serverLanguage=="client") {
			isFirst = true;
			console.log("first");
		}

		localStorage.setItem("language", language);

		var current = "";

		if(language=="us") {
			current = "English";
		}
		else if(language=="kor") {
			current="한국어";
		}
		$("#languageButton-button").text(current);

		//Get a stencil and adapt it to div
		var url = "file/get_contents";
		
		$.ajax({
			url: url,			
			type: "GET",
			data: "path=configs/language/"+language+".menu.json",
			success: function(data) {

				self.data1 = eval(data);
				
				self.apply(self.data1[0]);
			}
		});

		$.ajax({
			url: url,			
			type: "POST",
			data: "path=configs/language/"+language+".dialog.json",
			success: function(data) {
				self.data2 = eval(data);
				
				self.apply(self.data2[0]);
			}
		});
		
		$.ajax({
			url: url,			
			type: "POST",
			data: "path=configs/language/"+language+".msg.json",
			success: function(data) {
				self.data3 = eval(data);
				delete self.msg;	
				self.msg = new Array();
				
				self.applyMsg(self.data3[0]);
				
				if (isFirst && language=="kor") {
					confirmation.init({
						title: core.localization.msg["confirmationLanguageTitle"], 
						message: core.localization.msg["confirmationLanguageMessage"],
						yesText: core.localization.msg["confirmationYes"],
						noText: core.localization.msg["confirmationNo"],
						yes: function () {
							core.localization.changeLanguage(language);
							core.localization.beforeLanguage=language;
						}, no: function () {
							core.localization.changeLanguage("us");
							core.localization.beforeLanguage="us";
						}
					});
					
					confirmation.panel.show();
				}
			}
		});
		
/*
		$.getScript('config/language/' + language + '.msg.js', function () {

			delete self.msg;	
			eval("self.msg = new org.goorm.core.localization."+language+"();");
			self.msg.init();
			
			if (isFirst && language=="kor") {
				confirmation.init({
					title: core.localization.msg["confirmationLanguageTitle"], 
					message: core.localization.msg["confirmationLanguageMessage"],
					yesText: core.localization.msg["confirmationYes"],
					noText: core.localization.msg["confirmationNo"],
					yes: function () {
						core.localization.changeLanguage(language);
						core.localization.beforeLanguage=language;
					}, no: function () {
						core.localization.changeLanguage("us");
						core.localization.beforeLanguage="us";
					}
				});
				
				confirmation.panel.show();
			}
		});	
*/

	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 **/
	apply: function (data) {
		var self = this;
		
		if (data != null) {
			$.each(data, function (key, value) {
				
				var helptext = $("[localizationKey='" + key + "']").find(".helptext").html();
				
				$("[localizationKey='" + key + "']").html(this.value);
				
				if (helptext != null) {
					$("[localizationKey='" + key + "']").append("<em class='helptext'>" + helptext + "</em>");
				}
				
				if(this.children) {
					self.apply(this.children);
				}
			});
		}
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 **/
	applyMsg: function (data) {
		var self = this;
		
		if (data != null) {
			$.each(data, function (key, value) {
				eval("self.msg[\""+key+"\"]"+"=\""+this.value+"\";");
			});
		}
	}
};