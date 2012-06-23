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
org.goorm.core.theme._css = function () {
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

org.goorm.core.theme._css.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor
	 **/
	init: function (parent) {
		var self = this;
		this.parent = parent;
		var handleOk = function() {
			var areaName = $(self.target).attr("id");
			areaName = areaName.replace(/.$/g, '').replace("Cell",'');
	
			var string="";
			string+="<div id='"+areaName+"Cell"+($(self.target).parent().children().length+1)+"' class='cssCell newCssCell'><div style='overflow:auto; float:left'><div class='property'>"+$("#newProperty").attr("value")+"</div><br>";
			if($("#newSelector").attr("value").length>25)
				string+="<div class='idClassName' value='"+$("#newSelector").attr("value")+"'>"+$("#newSelector").attr("value").substr(0,25)+"..."+"</div></div>";	
			else
				string+="<div class='idClassName' value='"+$("#newSelector").attr("value")+"'>"+$("#newSelector").attr("value")+"</div></div>";		
	
			if($("#newProperty").attr("value").indexOf("color") > -1) {
				string+="<input type='text' class='cssValue' value='#FFFFFF'></input>";
				string+="<button class='colorbox' style='background-color:white'></button></div>";
			}
			else{
				string+="<input type='text' class='cssValue' value=''></input>";
				string+="</div>";
			}
			
			if($("#cssBox"+areaName+" .idClassName[value='"+$("#newSelector").attr("value")+"']").length==0)
				$(self.target).before(string);
			else
				$($("#cssBox"+areaName+" .idClassName[value='"+$("#newSelector").attr("value")+"']")[$("#cssBox"+areaName+" .idClassName[value='"+$("#newSelector").attr("value")+"']").length-1]).parent().parent().after(string);
			
			$(".newCssCell").bind("click",self.parent.cssBoxClickFunction, this);
			
			if($("#newProperty").attr("value").indexOf("color") > -1) {
 				$(".newCssCell").children(".colorbox").bind('click', self.parent.colorBoxClickFunction, this);
			}
			$(".newCssCell").removeClass("newCssCell");
			
			this.hide(); 
			
			$("#newSelector").attr("value",".yui-skin-sam");
			$("#newSelector").addClass("exampleSelector");
			$("#newProperty").attr("value","margin-top");
			$("#newProperty").addClass("exampleProperty");			
		};

		var handleCancel = function() { 
			this.hide(); 

			$("#newSelector").attr("value",".yui-skin-sam");
			$("#newSelector").addClass("exampleSelector");
			$("#newProperty").attr("value","margin-top");
			$("#newProperty").addClass("exampleProperty");
			
		};
		
		this.buttons = [ {text:"OK", handler:handleOk, isDefault:true},
						 {text:"Cancel",  handler:handleCancel}];
						 			 
		this.dialog = new org.goorm.core.theme._css.dialog();
		this.dialog.init({
			title:"Add New CSS", 
			path:"../../config/preference/org.goorm.core.theme/theme._css.html",
			width:220,
			height:133,
			modal:true,
			buttons:this.buttons,
			success: function () {
				$("#newSelector").bind('focus',function(){
					$(this).attr("value","");
					$(this).removeClass("exampleSelector");
				});
				$("#newProperty").bind('focus',function(){
					$(this).attr("value","");
					$(this).removeClass("exampleProperty");
				});
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