/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 **/

org.goorm.core.preference = function () {
	this.dialog = null;
	this.tabview = null;
	this.treeview = null;
	this.buttons = null;
	this.manager = null;
	this.ini = null;
	this.plugin = null;
	this.preference = null;
	this.firstShow = false;
	this.grid_opacity_slider = null;	
};

org.goorm.core.preference.prototype = {
	init: function () {
		
		var self = this;
		this.manager = new org.goorm.core.preference.manager();
		this.manager.init();
			
		this.manager.ini_parser();
		this.ini = this.manager.ini;
		
		this.manager.xml_parser("configs/preferences/default.xml");
		this.xml=this.manager.xml;
		
		this.plugin = new Object();
		
		this.preference = new Object();
		
		this.get_preference(this.xml);
		
		this.dialog = new org.goorm.core.preference.dialog();
		
		var handle_ok = function() {
			self.apply();
			this.hide();
		};

		var handle_cancel = function() { 
			if (core.module.localization.before_language != localStorage.getItem("language")) {
				core.module.localization.change_language(core.module.localization.before_language);
			}
		
			self.set_before();
			this.hide();
		};
		
		this.buttons = [ {text:"OK", handler:handle_ok, isDefault:true},
						 {text:"Cancel",  handler:handle_cancel}];
						 
		this.dialog.init({
			title:"Preference", 
			path:"configs/dialogs/org.goorm.core.preference/preference.html",
			width:700,
			height:500,
			modal:true,
			buttons:this.buttons,
			success: function () {
								
				self.manager.create_treeview(self.xml);
				self.manager.create_tabview(self.xml);
				
				var plugin_node = self.manager.treeview.getNodeByProperty("label","Plugin"); 
				
				// Plugin setting
				for (var i=0;i < core.module.plugin_manager.list.length; i++){
										
					var plugin_name=core.module.plugin_manager.list[i].plugin_name;
	
					self.manager.xml_parser('plugins/' + plugin_name + '/config.xml');

					plugin_name = $(self.manager.xml).find("plugin").attr("name");
					
					self.plugin[plugin_name] = new self.manager.plugin(core.module.plugin_manager.list[i].plugin_name);
					self.plugin[plugin_name].xml = self.manager.xml;
					

					$(self.manager.xml).find("tree").each(function(){
						$(this).find("preference").each(function(){
							if(localStorage.getItem($(this).attr("name")) != null){
								self.plugin[plugin_name].preference[$(this).attr("name")] = localStorage.getItem($(this).attr("name"));
								self.preference[$(this).attr("name")] = localStorage.getItem($(this).attr("name"));
							}
							else {
								self.plugin[plugin_name].preference[$(this).attr("name")] = $(this).attr("default");
								self.preference[$(this).attr("name")] = $(this).attr("default");
							}
						});
						
						$(this).find("ini").each(function(){
							
							if(self.ini[$(this).attr("name")] != null){
								self.plugin[plugin_name].ini[$(this).attr("name")] = self.ini[$(this).attr("name")];
							}
							else {
								self.plugin[plugin_name].ini[$(this).attr("name")] = $(this).attr("default");
								self.ini[$(this).attr("name")] = $(this).attr("default");
							}
							
						});
					});
					self.plugin[plugin_name].version = $(self.manager.xml).find("version").text();
					self.plugin[plugin_name].url = $(self.manager.xml).find("url").text();
					
					self.manager.add_treeview(plugin_node,self.plugin[plugin_name].xml);
					self.manager.treeview.render();
					self.manager.treeview.expandAll();
					self.manager.create_tabview(self.manager.xml);
				}
				
				// TreeView labelClick function
				self.manager.treeview.subscribe("clickEvent", function(nodedata){
					var label = nodedata.node.label;

					label = label.replace(/[/#. ]/g,"");
					$("#preference_tabview").children().hide();
					$("#preference_tabview #"+label).show();
					
					// File_Type이 클릭될 떄에는 항상 오른쪽 칸이 refresh되도록 설정
					if (label == "File_Type") {
						$(".filetype_list").find("div").first().trigger('click');
					}
					
					if (label == "Designer") {
						self.grid_opacity_slider.setValue(parseInt($("#grid_opacity_slider_value").val()*200));
						$("#grid_opacity_slider_value_text").text(($("#grid_opacity_slider_value").val()*100)+"%");	
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

				self.grid_opacity_slider = YAHOO.widget.Slider.getHorizSlider("grid_opacity_sliderBg", "grid_opacity_slider_thumb", 0, 200, 20);
				self.grid_opacity_slider.animate = true;
				self.grid_opacity_slider.getRealValue = function() {
					return ((this.getValue()/200).toFixed(1));
				}
				self.grid_opacity_slider.subscribe("change", function(offsetFromStart) {
					$("#grid_opacity_slider_value").val(self.grid_opacity_slider.getRealValue());
					$("#grid_opacity_slider_value_text").text((self.grid_opacity_slider.getRealValue()*100)+"%");
				});
				
				// set Apply, restore_default Button
				$("#preference_tabview").find(".apply").each(function(i){
					$(this).attr("id","applyBt_"+i);
					new YAHOO.widget.Button("applyBt_"+i,{onclick:{fn:function(){
						self.apply($("#preference_tabview #applyBt_"+i).parents(".yui-navset").attr("id"));
					}}});
				});
				
				$("#preference_tabview").find(".restore_default").each(function(i){
					$(this).attr("id","restore_defaultBt_"+i);
					new YAHOO.widget.Button("restore_defaultBt_"+i,{onclick:{fn:function(){
						self.restore_default($("#preference_tabview #restore_defaultBt_"+i).parents(".yui-navset").attr("id"));
					}}});
				});
				
				$(core).trigger("preference_loading_complete");
			}
		});
		
		this.dialog = this.dialog.dialog;
	},
	
	apply: function(id){
		var self=this;
		var valid=1;
		var target="#preference_tabview";
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
			
		$.post("preference/save", { data: core.filetypes }, function (data) {
			
		});
	
			
		if(valid){
			
			self.get_preference(self.xml);
			self.get_plugin_preference();
			var str=JSON.stringify(self.ini);
			self.manager.ini_maker(str);
			$(document).trigger("onPreferenceConfirm");
			
			$(core.module.layout.workspace.window_manager.window).each(function(i) {
				if(this.alive && this.designer) {
					if(self.preference["preference.designer.show_preview"]=="true") {
						this.designer.canvas.toolbar.is_preview_on = false;
					}
					else {
						this.designer.canvas.toolbar.is_preview_on = true;
					}
					this.designer.canvas.toolbar.toggle_preview();
					
					if(self.preference["preference.designer.show_grid"]=="true") {
						this.designer.canvas.toolbar.is_grid_on = false;
					}
					else {
						this.designer.canvas.toolbar.is_grid_on = true;
					}
					this.designer.canvas.toolbar.toggle_grid();
					
					if(self.preference["preference.designer.show_ruler"]=="true") {
						this.designer.canvas.toolbar.is_ruler_on = false;
					}
					else {
						this.designer.canvas.toolbar.is_ruler_on = true;
					}
					this.designer.canvas.toolbar.toggle_ruler();
					
					if(self.preference["preference.designer.snap_to_grid"]=="true") {
						this.designer.canvas.snap_to_grid = false;
					}
					else {
						this.designer.canvas.snap_to_grid = true;
					}
					this.designer.canvas.toolbar.toggle_snap_to_grid();
					
					this.designer.canvas.toolbar.change_grid_unit(self.preference["preference.designer.grid_unit"]);
					
					this.designer.canvas.toolbar.change_grid_opacity(self.preference["preference.designer.grid_opacity"]);
					
					this.designer.canvas.toolbar.change_ruler_unit(self.preference["preference.designer.ruler_unit"]);

		
				}
			});
		}
	},
	
	restore_default: function(id){
		var self=this;
		var target = "#preference_tabview #"+id;
		var restore_object = new Object();
		var flag=0;
		$(self.xml).find("item[label="+id+"] ini").each(function(){
			restore_object[$(this).attr("name")] = $(this).attr("default");
			flag++;
		});
		$(self.xml).find("item[label="+id+"] preference").each(function(){
			restore_object[$(this).attr("name")] = $(this).attr("default");
			flag++;
		});
		if(!flag){
			for(var plugin_name in this.plugin){
				if(!flag){
					$(self.plugin[plugin_name].xml).find("item[label="+id+"] ini").each(function(){
						restore_object[$(this).attr("name")] = $(this).attr("default");
						flag++;
					});
					$(self.plugin[plugin_name].xml).find("item[label="+id+"] preference").each(function(){
						restore_object[$(this).attr("name")] = $(this).attr("default");
						flag++;
					});
				}
			}
		}
		
		$(target).find("input").each(function(){
			if(restore_object[$(this).attr("name")]!=null){
				if($(this).attr("type") == "checkbox"){
					if(restore_object[$(this).attr("name")] == "true")
						$(this).attr("checked",true);
					else $(this).attr("checked",false); 
				}
				else{
					$(this).val(restore_object[$(this).attr("name")]);
				}
			}
		});
		$(target).find("textarea").each(function(){
			if(restore_object[$(this).attr("name")]!=null){
				$(this).val(restore_object[$(this).attr("name")]);
			}
		});
		$(target).find("select").each(function(){
			if(restore_object[$(this).attr("name")]!=null){
				$(this).children("option[value = " + restore_object[$(this).attr("name")] + "]").attr("selected", "ture");
				$(this).val(restore_object[$(this).attr("name")]);
			}
		});
	},

	show: function () {
		var self=this;
		this.dialog.panel.show();
		this.set_before();
		if(!this.firstShow){
			$("#preference_tabview #System").show();
			this.firstShow=true;
		}
	},

	set_before: function(){
		var self=this;
		$("#preference_tabview").find("input").each(function(){
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
		$("#preference_tabview").find("textarea").each(function(){
			if(self.ini[$(this).attr("name")]!=null){
				$(this).val(self.ini[$(this).attr("name")]);
			}
			else if(self.preference[$(this).attr("name")]!=null){
				$(this).val(self.preference[$(this).attr("name")]);
			}
		});
		$("#preference_tabview").find("select").each(function(){
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
	
	get_preference: function (xml) {
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
	
	get_plugin_preference: function(){
		var self = this;
		for (plugin_name in self.plugin){
			for(name in self.plugin[plugin_name].preference){
				self.plugin[plugin_name].preference[name] = localStorage.getItem(name);
				self.preference[name] = localStorage.getItem(name);
			}
		}
	}
	
};