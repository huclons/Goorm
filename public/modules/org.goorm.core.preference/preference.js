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
org.goorm.core.preference = function () {
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
	 * This presents the current browser version
	 * @property buttons
	 * @type Object
	 * @default null
	 **/
	this.buttons = null;
	
	this.manager = null;
	
	this.ini = null;
	
	this.plugin = null;
	
	this.preference = null;
	
	this.firstShow = false;
	
	/**
	 * This presents the current browser version
	 * @property gridOpacitySlider
	 **/
	this.gridOpacitySlider = null;	
};

org.goorm.core.preference.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor
	 **/
	init: function () {
		
		var self = this;
		this.manager = new org.goorm.core.preference.manager();
		this.manager.init();
			
		this.manager.iniParser();
		this.ini = this.manager.ini;
		
		this.manager.xmlParser("configs/preferences/default.xml");
		this.xml=this.manager.xml;
		
		this.plugin = new Object();
		
		this.preference = new Object();
		
		this.getPreference(this.xml);
		
		this.dialog = new org.goorm.core.preference.dialog();
		var handleOk = function() {
			self.apply();
			this.hide();
		};

		var handleCancel = function() { 
			if (core.localization.beforeLanguage != localStorage.getItem("language")) {
				core.localization.changeLanguage(core.localization.beforeLanguage);
			}
		
			self.setBefore();
			this.hide();
		};
		
		this.buttons = [ {text:"OK", handler:handleOk, isDefault:true},
						 {text:"Cancel",  handler:handleCancel}];
						 
		this.dialog.init({
			title:"Preference", 
			path:"configs/dialogs/org.goorm.core.preference/preference.html",
			width:700,
			height:500,
			modal:true,
			buttons:this.buttons,
			success: function () {
								
				self.manager.createTreeView(self.xml);
				self.manager.createTabView(self.xml);
				
				var pluginNode = self.manager.treeView.getNodeByProperty("label","Plugin"); 
				
				// Plugin setting
				for (var i=0;i < core.pluginManager.pluginList.length; i++){
										
					var pluginName=core.pluginManager.pluginList[i].pluginName;
	
					self.manager.xmlParser('plugins/' + pluginName + '/config.xml');

					pluginName = $(self.manager.xml).find("plugin").attr("name");
					
					self.plugin[pluginName] = new self.manager.plugin(core.pluginManager.pluginList[i].pluginName);
					self.plugin[pluginName].xml = self.manager.xml;
					

					$(self.manager.xml).find("tree").each(function(){
						$(this).find("preference").each(function(){
							if(localStorage.getItem($(this).attr("name")) != null){
								self.plugin[pluginName].preference[$(this).attr("name")] = localStorage.getItem($(this).attr("name"));
								self.preference[$(this).attr("name")] = localStorage.getItem($(this).attr("name"));
							}
							else {
								self.plugin[pluginName].preference[$(this).attr("name")] = $(this).attr("default");
								self.preference[$(this).attr("name")] = $(this).attr("default");
							}
						});
						
						$(this).find("ini").each(function(){
							
							if(self.ini[$(this).attr("name")] != null){
								self.plugin[pluginName].ini[$(this).attr("name")] = self.ini[$(this).attr("name")];
							}
							else {
								self.plugin[pluginName].ini[$(this).attr("name")] = $(this).attr("default");
								self.ini[$(this).attr("name")] = $(this).attr("default");
							}
							
						});
					});
					self.plugin[pluginName].version = $(self.manager.xml).find("version").text();
					self.plugin[pluginName].url = $(self.manager.xml).find("url").text();
					
					self.manager.addTreeView(pluginNode,self.plugin[pluginName].xml);
					self.manager.treeView.render();
					self.manager.treeView.expandAll();
					self.manager.createTabView(self.manager.xml);
				}
				
				// TreeView labelClick function
				self.manager.treeView.subscribe("clickEvent", function(nodedata){
					var label = nodedata.node.label;

					label = label.replace(/[/#. ]/g,"");
					$("#preferenceTabview").children().hide();
					$("#preferenceTabview #"+label).show();
					
					// File_Type이 클릭될 떄에는 항상 오른쪽 칸이 refresh되도록 설정
					if (label == "File_Type") {
						$(".fileTypeList").find("div").first().trigger('click');
					}
					
					if (label == "Designer") {
						self.gridOpacitySlider.setValue(parseInt($("#gridOpacitySliderValue").val()*200));
						$("#gridOpacitySliderValueText").text(($("#gridOpacitySliderValue").val()*100)+"%");	
					}
						
				});
				
				
							
							
				// set username, password for svn
				/*
				$.post("plugins/org.goorm.plugin.svn/svn.config.json", function(data) {
					var configData = eval(data);
					$('#svn_username').val(configData[0].username);
					$('#svn_password').val(configData[0].password);
				});
				*/

				self.gridOpacitySlider = YAHOO.widget.Slider.getHorizSlider("gridOpacitySliderBg", "gridOpacitySliderThumb", 0, 200, 20);
				self.gridOpacitySlider.animate = true;
				self.gridOpacitySlider.getRealValue = function() {
					return ((this.getValue()/200).toFixed(1));
				}
				self.gridOpacitySlider.subscribe("change", function(offsetFromStart) {
					$("#gridOpacitySliderValue").val(self.gridOpacitySlider.getRealValue());
					$("#gridOpacitySliderValueText").text((self.gridOpacitySlider.getRealValue()*100)+"%");
				});
				
				// set Apply, restoreDefault Button
				$("#preferenceTabview").find(".apply").each(function(i){
					$(this).attr("id","applyBt_"+i);
					new YAHOO.widget.Button("applyBt_"+i,{onclick:{fn:function(){
						self.apply($("#preferenceTabview #applyBt_"+i).parents(".yui-navset").attr("id"));
					}}});
				});
				
				$("#preferenceTabview").find(".restoreDefault").each(function(i){
					$(this).attr("id","restoreDefaultBt_"+i);
					new YAHOO.widget.Button("restoreDefaultBt_"+i,{onclick:{fn:function(){
						self.restoreDefault($("#preferenceTabview #restoreDefaultBt_"+i).parents(".yui-navset").attr("id"));
					}}});
				});
				
				$(core).trigger("preferenceLoadingComplete");
			}
		});
		
		this.dialog = this.dialog.dialog;
	},
	
	apply: function(id){
		var self=this;
		var valid=1;
		var target="#preferenceTabview";
		if(id){
			target+= " #"+id;
		}
		
		$(target).find("input").each(function(){
			var input = $(this);
			if ($(this).attr("validate")){
				var validate = $(this).attr("validate").split(',');
				
				// �� ��ȿ���˻�
				for (var i=0;i<validate.length;i++){
					if (valid) valid = self.manager.validate(input, validate[i]);
					else return false;
				}
			}
			if(valid){
				
				if(self.ini[$(this).attr("name")] != null){
					if($(this).attr("type") == "checkbox"){
						if($(this).attr("checked") == true){
							self.ini[$(this).attr("name")] = "true";
						}
						else {
							self.ini[$(this).attr("name")] = "false";
						}
					}
					else {
						self.ini[$(this).attr("name")] = $(this).val();
					}
				}
				else{
					if($(this).attr("type") == "checkbox"){
						if($(this).attr("checked") == true){
							localStorage.setItem($(this).attr("name"),"true");
						}
						else {
							localStorage.setItem($(this).attr("name"),"false");
						}
					}
					else {
						localStorage.setItem($(this).attr("name"),$(this).val());
					}
				}
			}
		});
		
		$(target).find("textarea").each(function(){
			localStorage.setItem($(this).attr("name") , $(this).val());
		});
		
		$(target).find("select").each(function(){
			
			if(self.ini[$(this).attr("name")] != null){
				self.ini[$(this).attr("name")] = $(this).children("option:selected").val();
			}
			else{
				localStorage.setItem($(this).attr("name") , $(this).children("option:selected").val());
			}
			
		});
			
		// Save changes of the information about file types into filetype.json
			
		$.post("preference/save", { data: core.fileTypes }, function (data) {
			
		});
	
			
		if(valid){
			
			self.getPreference(self.xml);
			self.getPluginPreference();
			var str=JSON.stringify(self.ini);
			self.manager.iniMaker(str);
			$(document).trigger("onPreferenceConfirm");
			
			$(core.mainLayout.workSpace.windowManager.window).each(function(i) {
				if(this.alive && this.designer) {
					if(self.preference["preference.designer.showPreview"]=="true") {
						this.designer.canvas.toolbar.isPreviewOn = false;
					}
					else {
						this.designer.canvas.toolbar.isPreviewOn = true;
					}
					this.designer.canvas.toolbar.togglePreview();
					
					if(self.preference["preference.designer.showGrid"]=="true") {
						this.designer.canvas.toolbar.isGridOn = false;
					}
					else {
						this.designer.canvas.toolbar.isGridOn = true;
					}
					this.designer.canvas.toolbar.toggleGrid();
					
					if(self.preference["preference.designer.showRuler"]=="true") {
						this.designer.canvas.toolbar.isRulerOn = false;
					}
					else {
						this.designer.canvas.toolbar.isRulerOn = true;
					}
					this.designer.canvas.toolbar.toggleRuler();
					
					if(self.preference["preference.designer.snapToGrid"]=="true") {
						this.designer.canvas.snapToGrid = false;
					}
					else {
						this.designer.canvas.snapToGrid = true;
					}
					this.designer.canvas.toolbar.toggleSnapToGrid();
					
					this.designer.canvas.toolbar.changeGridUnit(self.preference["preference.designer.gridUnit"]);
					
					this.designer.canvas.toolbar.changeGridOpacity(self.preference["preference.designer.gridOpacity"]);
					
					this.designer.canvas.toolbar.changeRulerUnit(self.preference["preference.designer.rulerUnit"]);

		
				}
			});
		}
	},
	restoreDefault: function(id){
		var self=this;
		var target = "#preferenceTabview #"+id;
		var restoreObj = new Object();
		var flag=0;
		$(self.xml).find("item[label="+id+"] ini").each(function(){
			restoreObj[$(this).attr("name")] = $(this).attr("default");
			flag++;
		});
		$(self.xml).find("item[label="+id+"] preference").each(function(){
			restoreObj[$(this).attr("name")] = $(this).attr("default");
			flag++;
		});
		if(!flag){
			for(var pluginName in this.plugin){
				if(!flag){
					$(self.plugin[pluginName].xml).find("item[label="+id+"] ini").each(function(){
						restoreObj[$(this).attr("name")] = $(this).attr("default");
						flag++;
					});
					$(self.plugin[pluginName].xml).find("item[label="+id+"] preference").each(function(){
						restoreObj[$(this).attr("name")] = $(this).attr("default");
						flag++;
					});
				}
			}
		}
		
		$(target).find("input").each(function(){
			if(restoreObj[$(this).attr("name")]!=null){
				if($(this).attr("type") == "checkbox"){
					if(restoreObj[$(this).attr("name")] == "true")
						$(this).attr("checked",true);
					else $(this).attr("checked",false); 
				}
				else{
					$(this).val(restoreObj[$(this).attr("name")]);
				}
			}
		});
		$(target).find("textarea").each(function(){
			if(restoreObj[$(this).attr("name")]!=null){
				$(this).val(restoreObj[$(this).attr("name")]);
			}
		});
		$(target).find("select").each(function(){
			if(restoreObj[$(this).attr("name")]!=null){
				$(this).children("option[value = " + restoreObj[$(this).attr("name")] + "]").attr("selected", "ture");
				$(this).val(restoreObj[$(this).attr("name")]);
			}
		});
	},
	/**
	 * This function is an goorm core initializating function.  
	 * @method show 
	 **/
	show: function () {
		var self=this;
		this.dialog.panel.show();
		this.setBefore();
		if(!this.firstShow){
			$("#preferenceTabview #System").show();
			this.firstShow=true;
		}
	},
	setBefore: function(){
		var self=this;
		$("#preferenceTabview").find("input").each(function(){
			if(self.ini[$(this).attr("name")]!=null){
				if($(this).attr("type") == "checkbox"){
					if(self.ini[$(this).attr("name")] == "true")
						$(this).attr("checked",true);
					else $(this).attr("checked",false); 
				}
				else{
					$(this).val(self.ini[$(this).attr("name")]);
				}
			}
			else if(self.preference[$(this).attr("name")]!=null){
				if($(this).attr("type") == "checkbox"){
					if(self.preference[$(this).attr("name")] == "true")
						$(this).attr("checked",true);
					else $(this).attr("checked",false);
				}
				else{
					$(this).val(self.preference[$(this).attr("name")]);
				}
			}
		});
		$("#preferenceTabview").find("textarea").each(function(){
			if(self.ini[$(this).attr("name")]!=null){
				$(this).val(self.ini[$(this).attr("name")]);
			}
			else if(self.preference[$(this).attr("name")]!=null){
				$(this).val(self.preference[$(this).attr("name")]);
			}
		});
		$("#preferenceTabview").find("select").each(function(){
			if(self.ini[$(this).attr("name")]!=null){
				$(this).children("option[value = " + self.ini[$(this).attr("name")] + "]").attr("selected", "ture");
				$(this).val(self.ini[$(this).attr("name")]);
			}
			else if(self.preference[$(this).attr("name")]!=null){
				$(this).children("option[value = " + self.preference[$(this).attr("name")] + "]").attr("selected", "ture");
				$(this).val(self.preference[$(this).attr("name")]);
			}
		});
	},
	
	getPreference: function (xml) {
		var self=this;
		$(xml).find("tree").each(function(){
			if ($(this).find("ini").length > 0) {
				$(this).find("ini").each(function(){
					if(self.ini[$(this).attr("name")] == null){
						self.ini[$(this).attr("name")] = $(this).attr("default");
					}
				});
			}
			if ($(this).find("preference").length > 0) {
				$(this).find("preference").each(function(){
					if(localStorage.getItem($(this).attr("name")) != null && localStorage.getItem($(this).attr("name")) != ""){
						self.preference[$(this).attr("name")] = localStorage.getItem($(this).attr("name"));
					}
					else {
						self.preference[$(this).attr("name")] = $(this).attr("default");
					}
				});
			}
		});
	},
	
	getPluginPreference: function(){
		var self = this;
		for (pluginName in self.plugin){
			for(name in self.plugin[pluginName].preference){
				self.plugin[pluginName].preference[name] = localStorage.getItem(name);
				self.preference[name] = localStorage.getItem(name);
			}
		}
	}
	
};