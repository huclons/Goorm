/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/org.goorm.core.project._import=function(){this.dialog=null,this.buttons=null,this.project_list=null},org.goorm.core.project._import.prototype={init:function(){var e=this,t=function(){if($("#project_import_file").attr("value").substr($("#project_import_file").attr("value").length-3,3).toLowerCase()!="zip")return alert.show("Zip file only"),!1;core.module.loading_bar.start("Import processing..."),$("#project_import_my_form").submit()},n=function(){this.hide()};this.buttons=[{text:"OK",handler:t,isDefault:!0},{text:"Cancel",handler:n}],this.dialog=new org.goorm.core.project._import.dialog,this.dialog.init({title:"Import Project",path:"configs/dialogs/org.goorm.core.project/project._import.html",width:800,height:500,modal:!0,buttons:this.buttons,kind:"import",success:function(){var t=new YAHOO.util.Resize("project_import_dialog_left",{handles:["r"],minWidth:200,maxWidth:400});t.on("resize",function(e){var t=$("#project_import_dialog_middle").width(),n=e.width;$("#project_import_dialog_center").css("width",t-n-9+"px")});var n={target:"#project_import_upload_output",success:function(t){e.dialog.panel.hide(),core.module.loading_bar.stop(),t.err_code==0?(notice.show(t.message),core.module.layout.project_explorer.refresh()):alert.show(t.message)}};$("#project_import_my_form").ajaxForm(n),$("#project_import_my_form").submit(function(){return!1})}}),this.dialog=this.dialog.dialog,this.project_list=new org.goorm.core.project.list},show:function(){this.project_list.init("#project_import"),this.dialog.panel.show()}};