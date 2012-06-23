/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module project
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class property
 * @extends project
 **/
org.goorm.core.project.property = function () {
	/**
	 * This presents the current browser version
	 * @property dialog
	 * @type Object
	 * @default null
	 **/
	this.dialog = null;
	
	/**
	 * This presents the current browser version
	 * @property tabView
	 * @type Object
	 * @default null
	 **/
	this.tabView = null;
	
	/**
	 * This presents the current browser version
	 * @property treeView
	 * @type Object
	 * @default null
	 **/

	this.treeView = null;
	/**
	 * The array object that contains the information about buttons on the bottom of a dialog 
	 * @property buttons
	 * @type Object
	 * @default null
	 **/
	this.buttons = null;
	
	this.manager = null;
	
	this.property = null;
	
	this.plugin = null;
};

org.goorm.core.project.property.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor
	 **/
	init: function () { 
		var self = this;
		this.manager = new org.goorm.core.project.property.manager();
		this.manager.xmlParser("configs/project/property/default.xml");
		this.xml=this.manager.xml;
		
		this.property = new Object();
		this.plugin = new Object();
		
		this.dialog = new org.goorm.core.project.property.dialog();
		
		// Handler for OK button
		var handleOk = function() {
			var valid = 1;
			
			// For input elements, validate values and put them into 'postdata'
			$("#propertyTabview").find("input").each(function(){
				
				var input = $(this);
				if ($(this).attr("validate")){
					var validate = $(this).attr("validate").split(',');
					
					// Check validation criteria
					for (var i=0;i<validate.length;i++){
						if (valid) valid = self.manager.validate(input, validate[i]);
						else return false;
					}
				}
				if(valid){
					if($(this).attr("type") == "checkbox"){
						if($(this).attr("checked") == true){
							self.property[$(this).attr("name")]="true";
						}
						else {
							self.property[$(this).attr("name")]="false";
						}
					}
					else {
						self.property[$(this).attr("name")]=$(this).val();
					}
				}
			});
			// For textarea elements, validate values and put them into 'postdata'
			$("#propertyTabview").find("textarea").each(function(){
				var str = $(this).val();
				
				if(valid){
					self.property[$(this).attr("name")]=$(this).val();
				}
			});
			
			$("#propertyTabview").find("select").each(function(){
				self.property[$(this).attr("name")]=$(this).text();
			});
			// If all values are valid, call php function to save them in project.xml
			if(valid) {
				self.saveProjectXml();
				this.hide();
			}
		};

		var handleCancel = function() { 
			this.hide();
			self.setBefore(); 
		};
		
		this.buttons = [ {text:"OK", handler:handleOk, isDefault:true},
						 {text:"Cancel",  handler:handleCancel}]; 
						 
		this.dialog = new org.goorm.core.project.property.dialog();
		this.dialog.init({
			title:"Project Property", 
			path:"configs/dialogs/org.goorm.core.project/project.property.html",
			width:700,
			height:500,
			modal:true,
			buttons:this.buttons,
			success: function () {
				// On the right side of dialog
				self.manager.createTreeView(self.xml);

				// Plugin setting
				for (var i=0;i < core.module.plugin_manager.pluginList.length; i++){
										
					var pluginName=core.module.plugin_manager.pluginList[i].pluginName;
					self.manager.xmlParser('plugins/' + pluginName + '/config.xml');
					pluginName = $(self.manager.xml).find("plugin").attr("name");
				
					self.plugin[pluginName] = new self.manager.plugin(core.module.plugin_manager.pluginList[i].pluginName);
					self.plugin[pluginName].xml = self.manager.xml;
				}
					
				$("#propertyTabview #Information").show();

				// TreeView labelClick function
				self.manager.treeView.subscribe("clickEvent", function(nodedata){
					var label = nodedata.node.label;
					label = label.replace(/[/#. ]/g,"");
					
					$("#propertyTabview").children().hide();
					$("#propertyTabview #property_"+label).show();
				});
			}
		});
		this.dialog = this.dialog.dialog;
		
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method show 
	 **/
	show: function () {
		var self = this;
		if(core.currentProjectPath != null && core.currentProjectPath != ""){
			this.setProjectInformation();
			this.dialog.panel.show();
		}
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method refreshToolBox 
	 **/
	refreshToolBox: function () {

		$(".toolsets").css("display", "none");
		
		var activeFileType = null;
		
		if (core.module.layout.workSpace.windowManager.activeWindow > -1) {
			activeFileType = core.module.layout.workSpace.windowManager.window[core.module.layout.workSpace.windowManager.activeWindow].filetype;
		}
		
		var toolBoxButtonMenu = core.module.plugin_manager.toolBoxSelector;
		//console.log(activeFileType);
		
		if(core.currentProjectType) {
			for (var value in core.module.plugin_manager.plugins) {
				if ("org.goorm.plugin." + core.currentProjectType.toLowerCase() == value) {
					
					if(core.module.plugin_manager.plugins["org.goorm.plugin."+core.currentProjectType.toLowerCase()].refreshToolBox) {				
							core.module.plugin_manager.plugins["org.goorm.plugin."+core.currentProjectType.toLowerCase()].refreshToolBox();
							if(toolBoxButtonMenu)
								toolBoxButtonMenu.set("label", core.module.plugin_manager.plugins[value].toolboxName);
					}else{
						$("#"+core.currentProjectType.toLowerCase()+"_toolset").css("display", "block");
					}
					//console.log(core.module.plugin_manager.plugins[value].toolboxName);
					
					break;
				}
			}
		}		
		else if(activeFileType) {
			for (var value in core.module.plugin_manager.plugins) {
				if (typeof(core.module.plugin_manager.plugins[value].filetypes)!="undefined") {
					if(core.module.plugin_manager.plugins[value].filetypes.indexOf(activeFileType) > -1) {
						if(core.module.plugin_manager.plugins["org.goorm.plugin."+core.module.plugin_manager.plugins[value].name].refreshToolBox) {				
							core.module.plugin_manager.plugins["org.goorm.plugin."+core.module.plugin_manager.plugins[value].name].refreshToolBox();
						}else{
							$("#"+core.module.plugin_manager.plugins[value].name+"_toolset").css("display", "block");
						}
						
						
						//console.log(core.module.plugin_manager.plugins[value].toolboxName);
						toolBoxButtonMenu.set("label", core.module.plugin_manager.plugins[value].toolboxName);
						break;
					}
				}
			}
		}
	},
	
	setProjectInformation: function () {
		var self=this;
		this.property = new Object();
		this.getProperty(this.xml);			
			
		// Get the contents of project.xml and put them into repective HTML elements
		$.ajax({
			type: "POST",
			dataType: "xml",
			url: "project/" + core.currentProjectPath + "/project.xml",
			success: function (xml) {
				
				$("#propertyTabview").text("");
				
				$(xml).find("PROJECT").each(function(){
					$(this).children().each(function(){
						self.property[$(this)[0].tagName] = $(this).text();
					});
				});
				
				self.manager.createTabView(self.xml);
				// Plugin setting
				var pluginNode = self.manager.treeView.getNodeByProperty("label","Plugin");
				self.manager.treeView.removeChildren(pluginNode);
				for (var name in self.plugin){
					if(name == self.property['TYPE']){
						$(self.plugin[name].xml).find("project").each(function(){
							$(this).find("property").each(function(){
								if(self.property[$(this).attr("name")] == null){
									self.property[$(this).attr("name")] = $(this).attr("default");
									self.plugin[name].property[$(this).attr("name")] = $(this).attr("default");
								}
								else {
									self.plugin[name].property[$(this).attr("name")] = self.property[$(this).attr("name")];
								}
							});
						});
						
						self.manager.addTreeView(pluginNode,self.plugin[name].xml);
						self.manager.treeView.render();
						self.manager.createTabView(self.plugin[name].xml);
						
						// Set build configuration
						core.dialogBuildConfiguration.setBuildConfig();
					}

					else {
						self.plugin[name].property = new Object();
					}
				}
				
				// TreeView labelClick function
				self.manager.treeView.subscribe("labelClick", function(node){
					var label = node.label;
					label = label.replace(/[/#. ]/g,"");
					
					$("#propertyTabview").children().hide();
					$("#propertyTabview #property_"+label).show();
				});
				
				self.setBefore();
				
				self.refreshToolBox();
			}
		});
	},
	setBefore: function(){
		var self=this;
		$("#propertyTabview").find("input").each(function(){
			if(self.property[$(this).attr("name")]!=null){
				if($(this).attr("type") == "checkbox"){
					if(self.property[$(this).attr("name")] == "true")
						$(this).attr("checked",true);
					else $(this).attr("checked",false);
				}
				else{
					$(this).val(self.property[$(this).attr("name")]);
				}
			}
		});
		$("#propertyTabview").find("textarea").each(function(){
			if(self.property[$(this).attr("name")]!=null){
				$(this).val(self.property[$(this).attr("name")]);
			}
		});
		$("#propertyTabview").find("select").each(function(){
			if(self.property[$(this).attr("name")]!=null){
				$(this).children("option[value = " + self.property[$(this).attr("name")] + "]").attr("selected", "ture");
				$(this).val(self.property[$(this).attr("name")]);
			}
		});
	},
	
	getProperty: function (xml) {
		var self=this;
		$(xml).find("project").each(function(){
			if ($(this).find("property").length > 0) {
				$(this).find("property").each(function(){
					self.property[$(this).attr("name")] = $(this).attr("default");
				});
			}
		});
	},
	
	saveProjectXml: function(callback){
		var self=this;
		self.property['projectPath'] = core.currentProjectPath;
		var str = JSON.stringify(self.property);
		
		$.ajax({
			type: "POST",
			data: "data="+str,
			url: "./module/org.goorm.core.project/project.property.ok.php",
			success: function (data) {
				if(typeof callback == "function")
					callback();
			}
		});
	}
};