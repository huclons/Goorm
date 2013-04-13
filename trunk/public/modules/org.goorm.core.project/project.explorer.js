/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

org.goorm.core.project.explorer = function () {
	this.target = null;
	this.treeview = null;
	this.context_menu_file = null;
	this.context_menu_folder = null;	
	this.context_menu_project = null;	
	this.current_tree_data = null;	
	this.current_project = null;
	this.project_data = null;
};

org.goorm.core.project.explorer.prototype = {
	init: function () {
		var self = this;

		$("#project_explorer").prepend("<div id='project_selector'></div>");
		$("#project_selector").append("<label class='selectbox'><select id='project_selectbox'></select></label>")

		$("#project_selectbox").change(function() {
			self.on_project_selectbox_change($(this).val());
		});

		$("#project_explorer").append("<div id='project_treeview' style='overflow-x:hidden'></div>");
		$("#project_explorer").append("<div id='project_list_table' height=100% style='overflow-x:hidden; display:none'></div>");
		
		if(!core.status.current_project_path) core.status.current_project_path = "";

		self.current_project = {};

		$(core).bind('project_get_list_complete', function(){
			if(!$.isEmptyObject(localStorage["current_project"])){
				self.current_project = $.parseJSON(localStorage["current_project"]);
				if(self.current_project.current_project_name != "" && self.check_project_list(self.current_project.current_project_path)){
					core.dialog.open_project.open(self.current_project.current_project_path, self.current_project.current_project_name, self.current_project.current_project_type);
				}
				else{
					self.current_project = {};

					core.status.current_project_name = ""
					core.status.current_project_path = ""
					core.status.current_project_type = ""

					localStorage.current_project = ""

					core.module.layout.communication.join();
				}
			}else{
				self.current_project = {};

				core.status.current_project_name = ""
				core.status.current_project_path = ""
				core.status.current_project_type = ""

				localStorage.current_project = ""

				core.module.layout.communication.join();
			}
			
		
			if(core.status.current_project_path==""){
				self.make_project_list_table();
			}else{
				$("#project_treeview").css('display','');
				$("#project_list_table").css('display','none');
			}
		})
		
		$(core).bind('goorm_login_complete', function(){
			var postdata = {
				'get_list_type' : 'collaboration_list'
			}

			$.get("project/get_list", postdata, function (data) {
				self.project_data = data;	
				self.make_project_selectbox();
				
				core.workspace = {};
				for(var i in data) {
					data[i].name && (core.workspace[data[i].name] = data[i].contents);
				}
				if(core.status.current_project_path==""){
					self.make_project_list_table();
				}

				$(core).trigger('project_get_list_complete');
			});
			
			var postdata = {
				kind: "project",
				path: "" + core.status.current_project_path
			};
			
			if(core.status.current_project_path==""){
				$("#project_treeview").css('display','none');
			}

			$.get("file/get_nodes", postdata, function (data) {
				if (data != null) {
					var sorting_data = eval(data);
					self.sort_project_treeview(sorting_data);

					self.treeview = new YAHOO.widget.TreeView("project_treeview", sorting_data);

					self.current_tree_data = self.treeview.getTreeDefinition();
		
					self.treeview.subscribe("clickEvent", function(nodedata) { return false; });
		
					self.treeview.subscribe("dblClickEvent", function(nodedata) {
						if(nodedata.node.data.cls == "file") {
							var filename = nodedata.node.data.filename;
							var filetype = nodedata.node.data.filetype;
							var filepath = nodedata.node.data.parent_label;

							core.module.layout.workspace.window_manager.open(filepath, filename, filetype);
						}
						else if(nodedata.node.data.cls == "dir") {
							if(nodedata.node.data.root == '/'){
								$('#project_selectbox').find('option').each(function(i, item){
									if($(item).html() == nodedata.node.data.name){
										$('#project_selectbox').val($(item).val())
										self.on_project_selectbox_change($(item).val());
									}
								})
							}
							else{
								if (nodedata.node.expanded) {
									nodedata.node.collapse();
								}
								else { 
									nodedata.node.expand();
								}
							}
						}
					});					
		
					self.treeview.render();
					
					self.treeview.subscribe("expandComplete", function (node) {
						self.refresh_context_menu();
						self.drag_n_drop();
						self.current_tree_data = self.treeview.getTreeDefinition();

						var dir_id = node.contentElId;
						$('#'+dir_id+' img').attr('src', 'images/icons/filetype/folderOpened.filetype.png');
					});

					self.treeview.subscribe("collapseComplete", function (node) {
						var dir_id = node.contentElId;
						$('#'+dir_id+' img').attr('src', 'images/icons/filetype/folder.filetype.png');
					})
					
					
					self.set_context_menu();
				}
			});
		});

		
	},
	
	refresh: function(event_emitting,not_me) {
		var self = this;

		var postdata = {
			'get_list_type' : 'collaboration_list'
		}
			
		$.get("project/get_list", postdata, function (data) {
			self.project_data = data;	
			self.make_project_selectbox();
			
			core.workspace = {};
			for(var i in data) {
				data[i].name && (core.workspace[data[i].name] = data[i].contents);
				if(core.status.current_project_path==""){
					self.make_project_list_table();
				}
			}
		});
		

		var temp_project_path = core.status.current_project_path;

		$("#project_treeview").css("background-color", "#FFF");

		var postdata = {
			kind: "project",
			path: "" + temp_project_path
		};

		if(core.status.current_project_path==""){
			$("#project_treeview").css('display','none');
		}
		$.get("file/get_nodes", postdata, function (data) {
			if (data != null) {
				// Root 폴더 생성
				if(temp_project_path != "") {
					var project_root = [{
						cls: "dir",
						expanded: true,
						html: "<div class='node root_folder'><img src=images/icons/filetype/folderOpened.filetype.png class='directory_icon folder' />"+temp_project_path+"<div class='fullpath' style='display:none;'>/"+temp_project_path+"</div></div>",
						name: temp_project_path,
						parent_label: "/",
						root: "/",
						sortkey: "0",
						type : "html"
					}];
					
					project_root[0].children = eval(data);
					var sorting_data = project_root;
				}
				else {
					var sorting_data = eval(data);
				}
				

				self.sort_project_treeview(sorting_data);	
				
				self.treeview.removeChildren(self.treeview.getRoot(), true);
				
				self.expand_treeview(self.current_tree_data, sorting_data);
				
				self.treeview.buildTreeFromObject(sorting_data);
	
				self.treeview.render();
				self.drag_n_drop();
				self.refresh_context_menu();
				self.refresh_event();

				if(core.status.current_project_path==""){
					self.make_project_list_table();
				}else{
					$("#project_treeview").css('display','');
					$("#project_list_table").css('display','none');
				}
			}

		});
	},
	
	expand_treeview: function (source, target) {
		var self = this;		
		$(source).each(function (i) {
			if (this.expanded == true && this.cls == "folder") {
				var object = this;
				$(target).each(function (j) {
					if (object.filename == this.filename && this.cls == "folder") {
						this.expanded = true;
						
						self.expand_treeview(object.children, this.children);
					}	
				});
			}
		});
	},

	make_project_selectbox: function() {
		var self = this;

		$("#project_selectbox").empty();
		
		$("#project_selectbox").append("<option localization_key='dictionary_project_list' value='' selected>"+core.module.localization.msg['dictionary_project_list']+"</option>");

		if(self.project_data){
			for(var project_idx=0; project_idx<self.project_data.length; project_idx++) {
				var temp_name = self.project_data[project_idx].name;
				
				if (self.project_data[project_idx].name == core.status.current_project_path) {
					$("#project_selectbox").append("<option value='"+project_idx+"' selected>"+temp_name+"</option>");
				}
				else {
					$("#project_selectbox").append("<option value='"+project_idx+"'>"+temp_name+"</option>");
				}
			}
		}
	},
		
	on_project_selectbox_change: function (project_idx) {
		var self = this;
		// need modify. NullA

		core.module.layout.communication.leave();
		
		if (project_idx!="") {
			
			self.current_project.current_project_path =  self.project_data[project_idx].name;
			self.current_project.current_project_name = self.project_data[project_idx].contents.name;
			self.current_project.current_projectType = self.project_data[project_idx].contents.type;
			core.dialog.open_project.open(self.current_project.current_project_path, self.current_project.current_project_name, self.current_project.current_projectType);
		}
		else {
		
			core.current_project_name = "";
			core.status.current_project_path = "";
			core.current_projectType = "";
			self.current_project.current_project_path = "";
			self.current_project.current_project_name = "";
			self.current_project.current_projectType = "";
			core.dialog.open_project.open(self.current_project.current_project_path, self.current_project.current_project_name, self.current_project.current_projectType);
		}
		
	},
	

	sort_project_treeview: function (sorting_data) { 				
	},	
	
	set_context_menu: function() {
		var self = this;

		self.context_menu_file = new org.goorm.core.menu.context();
		self.context_menu_file.init("configs/menu/org.goorm.core.project/project.explorer.file.html", "project.explorer.file", "", null, null);
		
		self.context_menu_folder = new org.goorm.core.menu.context();
		self.context_menu_folder.init("configs/menu/org.goorm.core.project/project.explorer.folder.html", "project.explorer.folder", "", null, null);

		self.context_menu_project = new org.goorm.core.menu.context();
		self.context_menu_project.init("configs/menu/org.goorm.core.project/project.explorer.html", "project.explorer", "", null, function(){
			self.refresh_event();
		});
		
		self.refresh_context_menu();

		//$(core).trigger("layout_loaded");
	},
	
	refresh_context_menu: function () {
		var self = this;

		$("#project_treeview").unbind("mousedown");
		$("#project_treeview").mousedown(function (e) {
			
			self.context_menu_file.hide()
			self.context_menu_project.hide();
			self.context_menu_folder.hide();
			
			$("#project_treeview").find(".ygtvfocus").removeClass("ygtvfocus");
				
			if (e.which == 3) {
				
				var offset = 0;
					
				if ( ($(window).height() - 36) < (e.clientY + $("div[id='project.explorer']").height()) ) {
					offset = e.clientY + $("div[id='project.explorer']").height() - $(window).height() + 36;
				};
				
				self.context_menu_project.show();
				$("div[id='project.explorer']").css("left", e.clientX);
				$("div[id='project.explorer']").css("top", e.clientY - offset);				
			}
			
			core.status.selected_file = null;
			
			e.stopPropagation();
			e.preventDefault();
			return false;			
		});

		$("#project_treeview").find(".ygtvcell").unbind("click");		
		$("#project_treeview").find(".ygtvcell").click(function (e) {
			if ($(this).hasClass("ygtvfocus") == false) {
				$("#project_treeview").find(".ygtvfocus").removeClass("ygtvfocus");
				
				if ($(this).hasClass("ygtvcontent")) {
					$(this).prev().addClass("ygtvfocus");
					$(this).addClass("ygtvfocus");		
				}
			}
		})

		$("#project_treeview").find(".ygtvcell").unbind("mousedown");		
		$("#project_treeview").find(".ygtvcell").mousedown(function (e) {
			
			self.context_menu_project.hide();
			self.context_menu_file.hide();
			self.context_menu_folder.hide();
			
			core.status.selected_file = $(this).find(".fullpath").html();

			if (e.which == 3) {
				if ($(this).find("img").hasClass("file")) {
					var offset = 0;
					
					if ( ($(window).height() - 36) < (e.clientY + $("div[id='project.explorer.file']").height()) ) {
						offset = e.clientY + $("div[id='project.explorer.file']").height() - $(window).height() + 36;
					};
					
					self.context_menu_file.show();
					
					$("div[id='project.explorer.file']").css("left", e.clientX);
					$("div[id='project.explorer.file']").css("top", e.clientY - offset);
				}
				else if ($(this).find("img").hasClass("folder")) {
					var offset = 0;
					
					if ( ($(window).height() - 36) < (e.clientY + $("div[id='project.explorer.folder']").height()) ) {
						offset = e.clientY + $("div[id='project.explorer.folder']").height() - $(window).height() + 36;
					};

					self.context_menu_folder.show();
					
					$("div[id='project.explorer.folder']").css("left", e.clientX);
					$("div[id='project.explorer.folder']").css("top", e.clientY - offset);				
				}
			}			

			e.stopPropagation();
			e.preventDefault();
			return false;			
		});		
	},

	refresh_event : function() {
		core.module.localization.change_language(localStorage.getItem("language"), true);
		core.module.action.init();
	},

	check_project_list : function(project_path){
		var self = this;

		if(self.project_data){
			var project_data = self.project_data;

			for(var i = 0; i<project_data.length; i++){
				if(project_data[i].name == project_path){
					return true;
				}
			}

			return false;
		}
		else{
			return false
		}
	},

	make_project_list_table : function(){
		var self=this;
		
		$("#project_treeview").css('display','none');

		var project_list_table=$("#project_list_table");
		project_list_table.empty();
		
		$("#project_list_table").append("<div id='my_project_list'></div>");
		$("#project_list_table").append("<div id='others_project_list'></div>");

		//console.log(core.module.localization.dict['my_project']);

		var my_project_list_title_html="<div class='table_list_title' localization_key='dictionary_my_project'>"+core.module.localization.msg['dictionary_my_project']+"</div>";
		var others_project_list_title_html="<div class='table_list_title' localization_key='dictionary_collaboration_project'>"+core.module.localization.msg['dictionary_collaboration_project']+"</div>";
		$("#my_project_list").append(my_project_list_title_html);
		$("#my_project_list").append("<div id='my_project_list_table'></div>");
		$("#others_project_list").append(others_project_list_title_html);
		$("#others_project_list").append("<div id='others_project_list_table'></div>");



		var table_column_definition = [
			{key:"type", label:'<span localization_key="dictionary_type">'+core.module.localization.msg['dictionary_type']+'</span>', width:30},
			{key:"name", label:'<span localization_key="dictionary_name">'+core.module.localization.msg['dictionary_name']+'</span>', width:50, maxAutoWidth : 100},
			{key:"author", label:'<span localization_key="dictionary_author">'+core.module.localization.msg['dictionary_author']+'</span>',  width:50, maxAutoWidth : 100}
		];
		
		var data_properties = new YAHOO.util.DataSource();
		
		data_properties.responseSchema = { 
			resultNode: "property", 
			fields: ["type","name", "author"] 
		};
		
		var my_table = new YAHOO.widget.DataTable("my_project_list_table", table_column_definition, data_properties);
		var others_table = new YAHOO.widget.DataTable("others_project_list_table", table_column_definition, data_properties);
		
		
		my_table.render();
		others_table.render();


		var my_project_list_arr=[];
		var others_project_list_arr=[];
		for(var p in core.workspace){
			if(core.workspace[p].author==core.user.id){
				my_project_list_arr.push(core.workspace[p]);
			}else{
				others_project_list_arr.push(core.workspace[p]);
			}
		}
		



		for(var i=0;i<my_project_list_arr.length;i++){
			//var img_html="";
			//img_html+="<img width=30px src='/org.goorm.plugin."+my_project_list_arr[i].type+"/images/"+my_project_list_arr[i].type+"_type.png' >  ";
			
			my_table.addRow({
				type : my_project_list_arr[i].type,
				name : my_project_list_arr[i].name,
				author : my_project_list_arr[i].author
			});
		}
		for(var i=0;i<others_project_list_arr.length;i++){
			//var img_html="";
			//img_html+="<img width=30px src='/org.goorm.plugin."+my_project_list_arr[i].type+"/images/"+my_project_list_arr[i].type+"_type.png' >  ";
			
			others_table.addRow({
				type : others_project_list_arr[i].type,
				name : others_project_list_arr[i].name,
				author : others_project_list_arr[i].author
			});
		}


		var row_click_my = function (data) {
			var record = my_table.getRecord(data.target);
		
			var selected_project_name=record._oData.author+"_"+record._oData.name;
			$('#project_selectbox').find('option').each(function(i, item){
				if($(item).html() == selected_project_name){
					$('#project_selectbox').val($(item).val())
					self.on_project_selectbox_change($(item).val());
				}
			})


		
		};

		my_table.subscribe("rowClickEvent", function(data){
			row_click_my(data);
		});
	

		var row_click_others = function (data) {
			var record = others_table.getRecord(data.target);
	
			var selected_project_name=record._oData.author+"_"+record._oData.name;
			$('#project_selectbox').find('option').each(function(i, item){
				if($(item).html() == selected_project_name){
					$('#project_selectbox').val($(item).val())
					self.on_project_selectbox_change($(item).val());
				}
			})


		
		};

		others_table.subscribe("rowClickEvent", function(data){
			row_click_others(data);
		});
	

		
	

		$("#my_project_list_table .yui-dt-rec").hover(function() {
		    $(this).css('cursor','pointer');
		    $(this).css('font-weight','bold');
		}, function() {
		    $(this).css('cursor','auto');
		    $(this).css('font-weight','');
		});
		
		$("#others_project_list_table .yui-dt-rec").hover(function() {
		    $(this).css('cursor','pointer');
		    $(this).css('font-weight','bold');
		}, function() {
		    $(this).css('cursor','auto');
		    $(this).css('font-weight','');
		});



		////end
		$("#project_list_table").css('display','');
		if(others_project_list_arr.length==0){
			$("#others_project_list").empty();
		}
		self.set_style();
	

	},
	
	set_style : function(){
		var self=this;
		$("#my_project_list_table").find("table").css("border", "0px");
		$("#my_project_list_table").find("table").css("font-size", "11px");
		$("#my_project_list_table").find("table").css("width", "100%");
		if(core.status.current_project_path=="")
			$("#my_project_list_table").find("table").css("border-bottom", "gray 1px solid");


		$("#others_project_list_table").find("table").css("border", "0px");
		$("#others_project_list_table").find("table").css("font-size", "11px");
		$("#others_project_list_table").find("table").css("width", "100%");
		if(core.status.current_project_path=="")
			$("#others_project_list_table").find("table").css("border-bottom", "gray 1px solid");
	},

	
	set_context_menu_project_list: function() {
		var self = this;

	},
	
	refresh_context_menu_project_list: function () {
		var self = this;

	},

	drag_n_drop : function(){
		var self = this;
		var drag_container = [];
		var target_container = [];
		var target = $('#project_treeview').find('.node');
		var startX = 0, startY = 0;

		target.each(function(i,ob){
			if($(ob).hasClass('root_folder')){
				$(ob).attr('id','tree_node_'+i);
				var ddt = new YAHOO.util.DDTarget('tree_node_'+i);
				target_container.push(ddt);
			}
			else{
				$(ob).attr('id','tree_node_'+i);
				var dd = new YAHOO.util.DD('tree_node_'+i);

				dd.on('dragDropEvent',function(ev){
					var current_path;
					var after_path;
					var tree_data;
					var target;
					if($('#'+ev.info).find('.folder')[0]&& ev.info != this.dragElId){
						after_path = $('#'+ev.info).find('div').text();
						current_path = $('#'+this.dragElId).find('div').text();
						self.drag_target = this.dragElId;
						var re = new RegExp(current_path);

						var list = self.treeview.getNodesBy(function(data){
							if(after_path==$(data.html).find('div').text()|| current_path == $(data.html).find('div').text()){
								return data;
							}
						});
						
						var getdata = {after_path: after_path, current_path: current_path};
						$.get('project/move_file',getdata,function(data){
							self.refresh(true);
						});
					}else{
						dd.setDragElPos(startX,startY);
					}
				},dd,true);

				dd.on('b4StartDragEvent',function(e){
					startX = e.x;
					startY = e.y;
				});
				dd.on('invalidDropEvent',function(e){
					dd.setDragElPos(startX,startY);
				});

				var ddt = new YAHOO.util.DDTarget('tree_node_'+i);
				target_container.push(ddt);
				drag_container.push(dd);
			}
		});
	}
};
