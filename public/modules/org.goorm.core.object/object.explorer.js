/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

org.goorm.core.object.explorer = function () {
	this.target = null;
	this.treeview_object = null;
	this.data=null;
};

org.goorm.core.object.explorer.prototype = {
	init: function (target) {
		$(target).empty();
		var self = this;
		
		self.target =target;// jQuery.extend(true,{},target);
		
		var query={};
		if(core.module.layout.workspace.window_manager==null || core.module.layout.workspace.window_manager==undefined){
			query.selected_file_path= '';
		}else if(core.module.layout.workspace.window_manager.active_filename==null || core.module.layout.workspace.window_manager.active_filename==undefined){
			query.selected_file_path='';
		}else{
			query.selected_file_path=core.module.layout.workspace.window_manager.active_filename;
		}
		
		$.get("edit/get_object_explorer"
			,query
			,function(data){
				//console.log('got_object_explorer_data');
				//console.log(data);
			
				$("#"+self.target).unbind();
				$("#"+self.target).bind("refresh",function(){
					//console.log('self.data',self.data);

					/////target ='object_tree'
					self.refresh( self.target, self.data );
				});
				//self.treeview_object.render();
				self.refresh(self.target, data)
			}
		);

	},
	refresh : function(target,treedata){
		//console.log('object_tree_ refresh');
		var self=this;
		$("#current_object_explorer").empty();
		$("#object_tree").empty();
			
		

		var selected_file_path="";
		if(core.module.layout.workspace.window_manager==null || core.module.layout.workspace.window_manager==undefined){
			selected_file_path= '';
		}else if(core.module.layout.workspace.window_manager.active_filename==null || core.module.layout.workspace.window_manager.active_filename==undefined){
			selected_file_path='';
		}else{
			selected_file_path=core.module.layout.workspace.window_manager.active_filename;
		}

		if(selected_file_path=="")return;
		if(	!(selected_file_path.split(".").pop()=='c' || selected_file_path.split(".").pop()=='cpp')	)return;
		

		//////pass succeed
		var current_path_html="";
		current_path_html+="<div style='padding:8px;'>"+selected_file_path+"</div>";

		$("#current_object_explorer").html(current_path_html);
		
		self.target = target;//jQuery.extend(true,{},target);
		self.data=jQuery.extend(true,{},treedata);


		
		self.makeTreeData(self.data);
		

		if(self.data==null || self.data.children==undefined){
			return;
		}
		//console.log('treedata',jQuery.extend(true,{},self.data.children));
		self.treeview_object = new YAHOO.widget.TreeView(self.target, self.data.children);
		//console.log('self.tree',self.treeview_object);
		
			/*
					self.treeview_object.subscribe("dblClickEvent", function(nodedata) {	
						
						if (nodedata.node.expanded) {
							nodedata.node.collapse();
						}
						else { 
							nodedata.node.expand();
						}
					});
			*/		
		self.treeview_object.render();
	},
	makeTreeData : function(input){
		var self=this;
		if(input.children==undefined){
			self.data=null;
			return;
		}

		for(var i=0;i<input.children.length;i++){

			self.build(input.children[i]);
		}
	},
	////object tree build
	build : function(input){
		var self=this;
		input.cls=input.type;
		input.type="html";
		input.html="<div class='node'>";
		input.html+='<img src="/images/org.goorm.core.outline/'+input.cls+'_type.png"  style="width:10px;margin-left:2px;margin-right:6px;">';
		input.html+=input.name+"("+input.cls+")"+"</div>";
		//input.expanded=false;
		
		if(input.children==undefined){
			return;
		}
		if(input.children.length>0){
			for(var i=0;i<input.children.length;i++){
				self.build(input.children[i]);
			}
		}

	}
};