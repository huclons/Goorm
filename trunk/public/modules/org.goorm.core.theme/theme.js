/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module theme
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class theme
 **/
org.goorm.core.theme = function () {
	this.buttonThemeSelector = null;
	this.buttonThemeSelectorFunction = null;
	this.buttonThemeMenuRender = null;
/*
	this.buttonNewTheme = null;
	this.buttonNewThemeFunction = null;
*/
	this.buttonApplyTheme = null;
	this.buttonApplyThemeFunction = null;	

	this.colorPicker = null;
	this.buttonColorPickerOk = null;
	this.buttonColorPickerOkFunction = null;
	this.buttonColorPickerCancel = null;
	this.buttonColorPickerCancelFunction = null;
	this.colorToRgb = null;	
	
	this.colorBoxClickFunction = null;
	this.areaBoxClickFunction = null;
	this.cssBoxClickFunction = null;
	this.inputBoxClickFunction = null;
	
	this.applyTheme = null;
		
	this.partArray = null;

/* 	this.dialogNewTheme = null; */
	this.dialogNewArea = null;
	this.dialogNewCss = null;
	
	this.currentTheme = null;
	
	this.themeTitle = null;
	this.themeDir = null;
	this.themeVersion = null;
	this.themeAuthor = null;
	this.themeAuthorMail = null;
};

org.goorm.core.theme.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor
	 **/
	init: function () {
		var self = this;
		
		self.setOn();
		
		self.currentTheme = core.dialogPreference.preference["preference.theme.currentTheme"];
		self.buttonThemeSelector = new YAHOO.widget.Button("buttonThemeSelector", {  
			type: "menu",  
			menu: "buttonThemeSelectorMenu" 
		}); 

/* 		self.buttonNewTheme =  new YAHOO.widget.Button("buttonNewTheme", { onclick: { fn: self.buttonNewThemeFunction } }); */
		self.buttonApplyTheme = new YAHOO.widget.Button("buttonApplyTheme", { onclick: { fn: self.buttonApplyThemeFunction } });

		this.colorPicker = new YAHOO.widget.ColorPicker("yui-picker", {
			showhsvcontrols: true,
			showhexcontrols: true,
			images: {
				PICKER_THUMB: "images/org.goorm.core.theme/picker_thumb.png",
				HUE_THUMB: "images/org.goorm.core.theme/hue_thumb.png"
			}
		});

		this.buttonColorPickerOk =  new YAHOO.widget.Button("buttonColorPickerOk", { onclick: { fn: self.buttonColorPickerOkFunction } });
		this.buttonColorPickerCancel =  new YAHOO.widget.Button("buttonColorPickerCancel", { onclick: { fn: self.buttonColorPickerCancelFunction } });

		self.load();

		
/* 		this.dialogNewTheme = new org.goorm.core.theme._new(); */
/* 		this.dialogNewTheme.init(this); */

		this.dialogNewArea = new org.goorm.core.theme.area();
		this.dialogNewArea.init(this);

		this.dialogNewCss = new org.goorm.core.theme._css();
		this.dialogNewCss.init(this);
		
		if (localStorage.getItem("preference.theme.currentTheme")==null) {
			self.currentTheme = core.serverTheme;
			self.buttonApplyThemeFunction();
		}
	},
	
	setOn: function() {
		var self = this;	
		this.applyTheme = function(){
			for(var j = 0; j < self.partArray.length; j++ ){
				i=1;
				$("#cssBox"+self.partArray[j]).children().each(function(){
					if($(this).attr("class").indexOf("addNewCss")>-1) {}
					else {
						$($("#"+$(this).attr('id')+" .idClassName").attr("value")).css($("#"+$(this).attr('id')+" .property").text(),$("#"+$(this).attr('id')+" .cssValue").attr("value"));
						i++;
					}
				});
			}
		};
		
		this.buttonThemeSelectorFunction = function (p_sType, p_aArgs) {
			var oEvent = p_aArgs[0],	//	DOM event
				oMenuItem = p_aArgs[1];	//	MenuItem instance that was the target of the event
				
			self.currentTheme=oMenuItem.value;
console.log($("#buttonThemeSelector-button"));
			if (oMenuItem) {
				$("#buttonThemeSelector-button").html($(oMenuItem.element).text());
			
				var dir = "configs/themes/"+oMenuItem.value+"/"+oMenuItem.value+".json";

				//clear areaBox 
				$('.areaBox').children().remove();
				$(".cssBox").remove();
				
				self.loadJson(dir);
			}
		};
/*		
		this.buttonNewThemeFunction = function () {
			self.dialogNewTheme.show();
		};
*/
		this.buttonApplyThemeFunction = function () {
			$("input[name='preference\.theme\.currentTheme']").attr("value",self.currentTheme);

			var i=1;
			
			var url = "module/org.goorm.core.theme/theme.save.php";
			var data = "{\n";
			var path = "configs/themes/"+self.currentTheme;

			var cssUrl = "module/org.goorm.core.theme/theme.saveCss.php";
			var cssData = "";

			var previousAreaName = "0";
			data=data+'\t"title":"'+self.themeTitle+'",\n\t"dirName":"'+self.themeDir+'",\n\t"version":"'+self.themeVersion+'",\n\t"author":"'+self.themeAuthor+'",\n\t"e-mail":"'+self.themeAuthorMail+'",\n\t"theme":{\n';
			for(var j = 0; j < self.partArray.length; j++ ){
				i=1;
				data=data+'\t\t"'+self.partArray[j]+'":{\n';
								
				$("#cssBox"+self.partArray[j]).children().each(function(){	
					if($(this).attr("class").indexOf("addNewCss")>-1){}
					
					else {			
						if(previousAreaName=="0"){
							cssData=cssData+$("#"+$(this).attr('id')+" .idClassName").attr("value")+'{';
							data=data+'\t\t\t"'+$("#"+$(this).attr('id')+" .idClassName").attr("value")+'":{';
						}
						else if(previousAreaName==$("#"+$(this).attr('id')+" .idClassName").attr("value")){		
							data=data+',';
						}
						else{
							cssData=cssData+"\n}\n"+$("#"+$(this).attr('id')+" .idClassName").attr("value")+"{";
							if(i==1){
								data=data+'\t\t\t"'+$("#"+$(this).attr('id')+" .idClassName").attr("value")+'":{';
							}
							else{
								data=data+'},\n\t\t\t"'+$("#"+$(this).attr('id')+" .idClassName").attr("value")+'":{';
							}
						}
						cssData=cssData+"\n\t\t"+$("#"+$(this).attr('id')+" .property").text()+":"+$("#"+$(this).attr('id')+" .cssValue").attr("value")+";";
						data=data+'"'+$("#"+$(this).attr('id')+" .property").text()+'":"'+$("#"+$(this).attr('id')+" .cssValue").attr("value")+'"';
						previousAreaName=$("#"+$(this).attr('id')+" .idClassName").attr("value");
						i++;
					}
				});

				if(j==(self.partArray.length)-1)
					data=data+"}\n\t\t}";
				else

					data=data+"}\n\t\t},\n";		
			}
			data=data+"\n\t}\n}";

			$.ajax({
				url: url,			
				type: "POST",
				data: { path: path, fileName: self.currentTheme ,data: data },
				success: function(e) {
					var receivedData = eval("("+e+")");
					if(receivedData.errCode==0) {
						m.s("Save theme file successfully");
					}
					else {
						alert.show(receivedData.errCode + " : " + receivedData.message);
					}			
				}
			});
						
			$.ajax({
				url: cssUrl,			
				type: "POST",
				data: { fileName: self.currentTheme, data: cssData },
				success: function(e) {
					var receivedData = eval("("+e+")");
					if(receivedData.errCode==0) {
						self.loadCSS();
					}
					else {
						alert.show(receivedData.errCode + " : " + receivedData.message);
					}				
				}
			});

		};
		
		this.buttonThemeMenuRender = function (p_sType, p_aArgs, themeTitle) {
			this.addItems([
				{ text: themeTitle[0], value: themeTitle[1] }
			]);
		};
		this.buttonColorPickerOkFunction = function (p_oEvent) {
			$("#"+$(".yui-picker-panel").attr("parent")+" .colorbox").css("background-color", "rgb("+$(self.colorPicker).attr("newValue")+")");
			$("#"+$(".yui-picker-panel").attr("parent")+" .cssValue").attr("value", "#"+self.colorPicker.get("hex"));
			$(".yui-picker-panel").hide();
		};

		this.buttonColorPickerCancelFunction = function (p_oEvent) {
			$(".yui-picker-panel").hide();
		};

		this.colorToRgb = function (color) {
			var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
			var red = parseInt(digits[2]);
			var green = parseInt(digits[3]);
			var blue = parseInt(digits[4]);
			var rgb=[red,green,blue];
			
			return rgb;
		};		
		this.cssBoxClickFunction = function (o) {
			$(".yui-picker-panel").hide();	

			$(o.currentTarget).parent().children().removeClass("selected");
			$(o.currentTarget).find("input").focus();

			if($(o.currentTarget).attr("class").indexOf("addNewCss")>-1){
				self.dialogNewCss.show(this);
			}
			else
				$(o.currentTarget).addClass("selected");
		};		
		this.inputBoxClickFunction = function (o) {
			$(".yui-picker-panel").hide();

			$(o.currentTarget).parent().parent().children().removeClass("selected");
			$($(o.currentTarget).parent()).addClass("selected");
		};	
		this.colorBoxClickFunction = function (o) {
		
			$(o.currentTarget).parent().parent().children().removeClass("selected");		
			$(o.currentTarget).parent().addClass("selected");	
			$(".yui-picker-panel").attr("parent",$($(o.currentTarget).parent()).attr('id'));

			if(($(window).width())-($("."+$(o.currentTarget).attr("class")).offset().left)-25<392) {
				$(".yui-picker-panel").css("left",(o.currentTarget).offsetLeft-392+25+83+"px");
				$(".yui-picker-panel").css("top",(o.currentTarget).offsetTop+23+"px");				
			}
			
			else {
				$(".yui-picker-panel").css("left",(o.currentTarget).offsetLeft+25+"px");
				$(".yui-picker-panel").css("top",(o.currentTarget).offsetTop+"px");
			}
			
			$(".yui-picker-panel").show();

			var rgb = self.colorToRgb($(this).css("background-color"));
			self.colorPicker.setValue([rgb[0],rgb[1],rgb[2]]);
			
			o.stopPropagation();
		};	
		this.areaBoxClickFunction = function(o){
			$(".areaCell").removeClass("selected");
			
			var areaClassNames = $(o.target).attr("class").toString();
			var areaClassNamesArray = areaClassNames.split(' ');

			$("#cssBox"+areaClassNamesArray[1]).children().removeClass("selected");

			$(".cssBox").hide();
						
			if($(o.target).attr("class").indexOf("addNewArea")>-1) {
				$("#cssBoxdefault").show();
				self.dialogNewArea.show(this);
			}
			else{
				$("#cssBox"+$(o.target).text()).show();
				$(o.target).addClass("selected");
			}
		};
	},
	
	load: function () {

		var self = this;
		var postdata = {
			kind: "theme"
		};
		var sortingData;			

		$.post("module/org.goorm.core.theme/theme.getList.php", postdata, function (data) {	
			sortingData = eval(data);

			for (var i in sortingData) {
				if(sortingData[i].cls=='folder') {
					if(sortingData[i].filename=='assets'||sortingData[i].filename=='.svn') {
						continue;
					}
					//////////

					var dir = "configs/themes/"+sortingData[i].filename+"/"+sortingData[i].filename+".json";
					var themeTitle = "";
					var themeDirName = "";
					$.ajax({
						url : dir,
						dataType : "json",
						success : function(jd){
							themeTitle = jd['title'];
							themeDirName = jd['dirName'];							

							(self.buttonThemeSelector).getMenu().subscribe("render", self.buttonThemeMenuRender, [themeTitle, themeDirName]);
						}
					});
												
					/////////
					//(self.buttonThemeSelector).getMenu().subscribe("render", self.buttonThemeMenuRender, sortingData[i].filename);	
					
					if(core.dialogPreference.preference["preference.theme.currentTheme"]==sortingData[i].filename) {
						dir = "configs/themes/"+sortingData[i].filename+"/"+sortingData[i].filename+".json";						
						$.ajax({
							url : dir,
							dataType : "json",
							success : function(jd){
								themeTitle = jd['title'];										
								$("#buttonThemeSelector-button").html(themeTitle);
							}
						});
						//init thème contents (areaBox, cssBox)
						var selectedTheme = sortingData[i].filename;
						dir = "configs/themes/"+sortingData[i].filename+"/"+sortingData[i].filename+".json";

						self.loadJson(dir);
						self.loadCSS();
					}
				}
			}
			

		});
		(self.buttonThemeSelector).getMenu().subscribe("click", self.buttonThemeSelectorFunction);	
	},
	
	
	initDivView : function() {
		var self = this;
		$("#cssBoxdefault").show();
		for(var i = 0; i < self.partArray.length; i++ ){
			$("#cssBox"+self.partArray[i]).hide();
		}
	},
	
	loadJson: function (dir) {

		var self = this;
		self.partArray = new Array();

		$.ajax({
			url : dir,
			dataType : "json",
			success : function(jd){
				self.themeAuthor=jd['author'];
				self.themeDir=jd['dirName']
				self.themeVersion=jd['version'];
				self.themeAuthorMail=jd['e-mail'];
				self.themeTitle=jd['title'];
			

				for (var areaName in jd['theme']){
					self.partArray.push(areaName);
					$(".areaBox").append("<div class='areaCell "+areaName+"'>"+areaName+"</div>");	

				}
				
				$(".areaBox").append("<div class='areaCell addNewArea'>Add New Area</div>");	
																
				var string = "";
				for (var name in jd['theme']) {
					var i=1;
					string+="<div id='cssBox"+name+"' class='cssBox'>";
					for(var name2 in jd['theme'][name]) {
	
						//alert(name2) == id,class name
						for(var name3 in jd['theme'][name][name2]) {
							//alert(name3) == property
							string+="<div id='"+name+"Cell"+i+"' class='cssCell'><div style='overflow:auto; float:left'><div class='property'>"+name3+"</div><br>";
							if(name2.length>40)
								string+="<div class='idClassName' value='"+name2+"'>"+name2.substr(0,40)+"..."+"</div></div><br><br>";	
							else
								string+="<div class='idClassName' value='"+name2+"'>"+name2+"</div></div><br><br>";	
	
							//alert(jd[name][name2][name3]) == value
							string+="<input type='text' class='cssValue' value='"+jd['theme'][name][name2][name3]+"'></input>";
		
							if(name3.indexOf("color") > -1)
							{
								string+="<button style='background-color:"+jd['theme'][name][name2][name3]+";' class='colorbox'></button></div>";
							}
							else
								string+="</div>";
							i++;
						}
					}
					string+="<div id='"+name+"Cell"+i+"' class='cssCell addNewCss'><div style='float:left; margin-left:5px;  margin-top:7px; font-size:11px'>Add New CSS</div></div>";
					string+="</div>";
				}
				string+="<div id='cssBoxdefault' class='cssBox'></div>";
				$(".themeContents").append(string);	

				self.initDivView();	
				self.connectFunction();
			}
		});
	},
	
	connectFunction: function(){
		var self = this;

		$(".areaCell").bind('click', self.areaBoxClickFunction, this);
		$(".colorbox").bind('click', self.colorBoxClickFunction, this);
		$(".cssCell").bind('click', self.cssBoxClickFunction, this);
		$(".cssCell input").bind('click', self.inputBoxClickFunction, this);
 
 		//subscribe to the rgbChange event;
		self.colorPicker.on("rgbChange", function(o){
			$(self.colorPicker).attr("newValue",o.newValue);
		});	
		
	},
	
	
	/**
	 * To get css files for this plugin
	 * @method loadCSS
	 **/
	loadCSS: function () {
		var self = this;
		
		$("head").append("<link>");
	    var css = $("head").children(":last");
	    css.attr({
	    	rel:  "stylesheet",
	    	type: "text/css",
	    	href: "temp/"+self.currentTheme+".css"
	    });
	}
};