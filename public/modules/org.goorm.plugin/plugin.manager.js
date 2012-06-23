/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module plugin
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class manager
 * @extends plugin
 **/
org.goorm.plugin.manager = function () {
	/**
	 * This presents the current browser version
	 * @property plugins
	 * @type Object
	 * @default null
	 **/
	this.plugins = null;
	
	/**
	 * This presents the current browser version
	 * @property pluginList
	 * @type Object
	 * @default null
	 **/
	this.pluginList = null;
	
	/**
	 * This presents the current browser version
	 * @property interval
	 * @type Object
	 * @default null
	 **/
	this.interval = null;
	
	/**
	 * This presents the current browser version
	 * @property preference
	 * @type Object
	 * @default null
	 **/
	this.preference = null;
	
	/**
	 * This presents the current browser version
	 * @property toolBoxSelector
	 * @type Object
	 * @default null
	 **/
	this.toolBoxSelector = null;
};

org.goorm.plugin.manager.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 **/
	init: function () {
		this.plugins = new Object();
		this.pluginList = $.makeArray();
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method getAllPlugins 
	 **/
	getAllPlugins: function () {
		var self = this;
		
		var url = "plugin/get_list";
				
		//var i = 0;
		//this.interval = window.setInterval(function () { if(i<100) { statusbar.progressbar.set('value', i+=10); } else { window.clearInterval(self.interval); } }, 100);
		
		//statusbar.startLoading();
		
		$.ajax({
			url: url,			
			type: "GET",
			async: false,
			success: function(data) {
				self.pluginList = eval(data);
				
				//statusbar.progressbar.set('value', 100);
				/*
				if(self.interval) {
					window.clearInterval(self.interval);
				}
				*/
				
				//statusbar.stopLoading();
				
				$(core).trigger("pluginLoaded");
				
				//$(core).trigger("goormLoading");
			}
		});
		
		$(core).trigger("pluginLoaded");
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method loadAllPlugins 
	 * @param {Number} index The index.
	 **/
	loadAllPlugins: function (index) {
		var self = this;
		
		//for refactoring
		this.pluginList = [];

		if (index == this.pluginList.length && this.pluginList.length != 0) {
		
			$("#toolBoxSelectBoxDummy").prepend("<option value='all'>ALL</option>");
			
			self.toolBoxSelector = new YAHOO.widget.Button({ 
					id: "toolBoxSelectBox", 
					name: "toolBoxSelectBox",
					label: "Select Tool",
					type: "menu",  
					menu: "toolBoxSelectBoxDummy", 
					container: "toolBoxSelector"
			});

			var toolBoxClick = function (p_sType, p_aArgs) {
				var oEvent = p_aArgs[0],	//	DOM event
					oMenuItem = p_aArgs[1];	//	MenuItem instance that was the target of 
											//	the event 
				if (oMenuItem) {
					if (oMenuItem.value=="all") {
						$("#toolBoxSelectBox-button").text($(oMenuItem.element).text());
						$(".toolsets").css("display", "block");
					}
					else {
						$("#toolBoxSelectBox-button").text($(oMenuItem.element).text());
						$(".toolsets").css("display", "none");
						$("#"+oMenuItem.value+"_toolset").css("display", "block");
					}
				}
			};

			self.toolBoxSelector.getMenu().subscribe("click", toolBoxClick);


			return false;
		}
		else if(this.pluginList.length != 0){
			if (index==0) {
				$("#toolBox").empty();
				$("#toolBox").prepend("<div id='toolBoxSelector' style='height:22px; background-color:#eee; border-bottom:1px solid #ddd; padding:5px; font-size:10px;'><div style='float:left; padding-top:4px; padding-right:4px; font-weight:bold;'>Tool</div></div>");
				$("#toolBoxSelector").append("<select id='toolBoxSelectBoxDummy' name='toolBoxSelectBoxDummy' style='width:100%;'></select>");
			}
			
			var pluginName = this.pluginList[index].pluginName;

			if (pluginName != undefined) {	
				
				$.getScript('plugins/' + pluginName + '/plug.js', function () {
										
						//Plugin initialization
						//console.log(pluginName);
						eval("self.plugins['"+pluginName+"'] = new " + pluginName + "();");
						self.plugins[pluginName].init();
		
						index++;
						
						self.loadAllPlugins(index);

						$(core).trigger("goormLoading");
					
				});	
			}
		}
		else {
			$(core).trigger("goormLoading");
		}
	},

	newProject : function (projectName, projectAuthor, projectType, projectDetailedType, projectPath, postdata){
	//console.log(projectDetailedType);
		if(projectType == "goorm") {
		
		}
		else {
			if(eval("typeof this.plugins['org.goorm.plugin."+projectType+"'].newProject") == "function") {				
				eval("this.plugins['org.goorm.plugin."+projectType+"'].newProject(projectName, projectAuthor, projectType, projectDetailedType, projectPath, postdata)");
				core.dialogProjectProperty.setProjectInformation();
			}
		}
	}
};
