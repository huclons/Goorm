/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/org.goorm.core.file.open_url=function(){this.dialog=null,this.tabview=null,this.buttons=null,this.treeview=null},org.goorm.core.file.open_url.prototype={init:function(){var e=function(){core.module.layout.workspace.window_manager.add($("#open_url_address").val(),$("#open_url_address").val(),"url"),this.hide()},t=function(){this.hide()};this.buttons=[{text:"OK",handler:e,isDefault:!0},{text:"Cancel",handler:t}],this.dialog=new org.goorm.core.file.open_url.dialog,this.dialog.init({title:"Open URL",path:"configs/dialogs/org.goorm.core.file/file.open_url.html",width:420,height:150,modal:!0,buttons:this.buttons,yes_text:"Open",no_text:"Cancel"}),this.dialog=this.dialog.dialog},show:function(){this.dialog.panel.show()}};