/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/org.goorm.core.project.build.clean=function(){this.dialog=null,this.buttons=null,this.chat=null},org.goorm.core.project.build.clean.prototype={init:function(){var e=this,t=function(){var t=[];$("#build_clean_list input[type=checkbox]").each(function(){$(this).is(":checked")&&(t.push($(this).val()),core.module.plugin_manager.plugins["org.goorm.plugin."+$(this).attr("projectType")]!=undefined&&core.module.plugin_manager.plugins["org.goorm.plugin."+$(this).attr("projectType")].clean($(this).attr("name")))});if(t.length==0)return alert.show("Not Selected."),!1;var n={project_list:t};$.get("project/clean",n,function(t){t.err_code==0?(core.module.layout.project_explorer.refresh(),e.dialog.panel.hide()):alert.show(t.message)})},n=function(){this.hide()};this.buttons=[{text:"Clean",handler:t,isDefault:!0},{text:"Cancel",handler:n}],this.dialog=new org.goorm.core.project.build.clean.dialog,this.dialog.init({title:"Build Clean",path:"configs/dialogs/org.goorm.core.project/project.build.clean.html",width:400,height:400,modal:!0,buttons:this.buttons,success:function(){e.button_select_all=new YAHOO.widget.Button("build_clean_select_all"),e.button_deselect_all=new YAHOO.widget.Button("build_clean_unselect_all"),$("#build_clean_select_all").click(function(){e.select_all()}),$("#build_clean_unselect_all").click(function(){e.unselect_all()})}}),this.dialog=this.dialog.dialog},show:function(){this.project_list(),this.dialog.panel.show()},select_all:function(){$("#build_clean_list input[type=checkbox]").attr("checked",!0)},unselect_all:function(){$("#build_clean_list input[type=checkbox]").attr("checked",!1)},project_list:function(){$("#build_clean_list").empty(),$.get("project/get_list",null,function(e){for(var t=0;t<e.length;t++){var n="";n+="<div style='height:18px;padding:2px;'>",n+="<span class='checkbox'><input type='checkbox' name='"+e[t].name+"' value='"+e[t].name+"' projectType='"+e[t].contents.type+"' ",e[t].name==core.status.current_project_path&&(n+="checked='checked'"),n+="id='claean_selector_"+e[t].name+"' class='claean_selectors'><label data-on data-off></label></span>",n+="<label for='claean_selector_"+e[t].name+"' style='margin-left:4px;'>"+e[t].name+"</label>",n+="</div>",$("#build_clean_list").append(n)}})}};