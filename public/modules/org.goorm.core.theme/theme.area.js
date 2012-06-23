/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module preference
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class preference
 **/
org.goorm.core.theme.area = function () {
	/**
	 * This presents the current browser version
	 * @property dialog
	 * @type Object
	 * @default null
	 **/
	this.dialog = null;
	this.buttons = null;
	this.parent = null;
	this.target = null;
};

org.goorm.core.theme.area.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor
	 **/
	init: function (parent) {
		var self = this;
		
		this.parent = parent;
		
		var handleOk = function() {
			console.log(self.target);
			var errCode = 0;
			
			$(".areaCell").each(function(){
				if($(this).text()==$("#newArea").attr("value")) {
					errCode=1;
				}			
			});
			
			if($("#newArea").attr("value").indexOf(" ")>-1) {
				errCode=2;
			}
			
			if(errCode==0){
				parent.partArray.push($("#newArea").attr("value"));
				var string ="<div class='areaCell newAreaCell "+$("#newArea").attr("value")+"'>"+$("#newArea").attr("value")+"</div>";
				$(self.target).before(string);
				
				string = "";
				string+="<div id='cssBox"+$("#newArea").attr("value")+"' class='cssBox newCssBox'>";
				string+="<div id='"+$("#newArea").attr("value")+"Cell"+i+"' class='cssCell addNewCss newCssCell'><div style='float:left; margin-left:5px;  margin-top:7px; font-size:11px'>Add New CSS</div></div>";
				string+="</div>";
				$(".themeContents").append(string);	
				
				$(".newAreaCell").bind('click', self.parent.areaBoxClickFunction, this);
				$(".newCssCell").bind("click",self.parent.cssBoxClickFunction, this);
				$(".newCssBox").hide();
				
				$(".newAreaCell").removeClass("newCssCell");
				$(".newCssCell").removeClass("newCssCell");
				$(".newCssBox").removeClass("newCssCell");
			}
			
			else{
				if(errCode==1)
					alert.show(core.localization.msg["alertNaming"]);
				else
					alert.show(core.localization.msg["alertValue"]);
			}
			this.hide();  
		};


		var handleCancel = function() { 
			this.hide(); 

		};
		
		this.buttons = [ {text:"OK", handler:handleOk, isDefault:true},
						 {text:"Cancel",  handler:handleCancel}];
						 
						 
		this.dialog = new org.goorm.core.theme._css.dialog();
		this.dialog.init({
			title:"Add New Area", 
			path:"configs/preferences/org.goorm.core.theme/theme.area.html",
			width:220,
			height:150,
			modal:true,
			buttons:this.buttons,
			success: function () {
			}
		});
		
		this.dialog = this.dialog.dialog;
			
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method show 
	 **/
	show: function(target) {
		var self=this;
		this.target = target;
 
		this.dialog.panel.show();
	},
	
};