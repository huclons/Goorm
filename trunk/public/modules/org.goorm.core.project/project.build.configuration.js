/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/org.goorm.core.project.build.configuration=function(){this.dialog=null,this.buttons=null,this.chat=null},org.goorm.core.project.build.configuration.prototype={init:function(){var e=this,t=function(){core.module.plugin_manager.plugins["org.goorm.plugin."+core.status.current_project_type]!=undefined&&core.module.plugin_manager.plugins["org.goorm.plugin."+core.status.current_project_type].build(core.status.current_project_name,core.status.current_project_path),this.hide()},n=function(){this.hide()};this.buttons=[{text:"Build",handler:t,isDefault:!0},{text:"Cancel",handler:n}],this.dialog=new org.goorm.core.project.build.configuration.dialog;var r="configs/dialogs/org.goorm.core.project/project.build.configuration.html";this.dialog.init({title:"Build Configuration",path:r,width:600,height:400,modal:!0,buttons:this.buttons,success:function(){}}),this.dialog=this.dialog.dialog},show:function(){core.status.current_project_path!=""?this.dialog.panel.show():alert.show(core.module.localization.msg.alertProjectNotOpend)},init_dialog:function(e,t){var n={path:e};$.get("file/get_contents",n,function(e){$("#build_configuration").append(e),t()})},set_build_config:function(){$("#build_configuration").text(""),core.module.plugin_manager.plugins["org.goorm.plugin."+core.status.current_project_type]!=undefined&&core.module.plugin_manager.plugins["org.goorm.plugin."+core.status.current_project_type].set_build_config&&core.module.plugin_manager.plugins["org.goorm.plugin."+core.status.current_project_type].set_build_config(this)}};