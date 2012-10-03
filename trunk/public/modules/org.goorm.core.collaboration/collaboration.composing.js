/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/org.goorm.core.collaboration.composing=function(){this.target=null,this.objects=null,this.userID=0,this.socket=null,this.predefinedColors=null,this.assignedColors=null,this.updating_process_running=!1,this.update_queue=[],this.diff_worker=null,this.patch_worker=null,this.object_uuids=null,this.file_id=null,this.is_collaboration_on=null,this.panel=null,this.left=null,this.top=null,this.auto_save_timer=null,this.status=0,this.timer=null},org.goorm.core.collaboration.composing.prototype={init:function(target){var self=this;this.target=target,this.file_id=this.target.parent.filename,this.objects=this.target.objects,this.update_queue=[],this.predefinedColors=["#FFCFEA","#E8FF9C","#FFCC91","#42C0FF","#A7FF9E","#7DEFFF","#BABDFF","#FFD4EB","#AAFF75","#FF9EAB","#DCFF91","#8088FF"],this.assignedColors={},this.socket=io.connect(),this.auto_save_timer=null;var check_for_updates=function(){while(self.update_queue.length>0&&self.updating_process_running==0){var e=self.update_queue.shift();self.updating_process_running=!0,self.apply_update(e.action,e)}};$(this).bind("add",function(evt,object){if(object.properties.is_drawing_finished){var object_data={type:object.type,shape_name:object.shape_name,properties:{focus:object.properties.focus,is_dragging:object.properties.is_dragging,is_drawing_finished:object.properties.is_drawing_finished,selected_node:object.properties.selected_node,sx:object.properties.sx,sy:object.properties.sy,ex:object.properties.ex,ey:object.properties.ey,previous_x:object.properties.previous_x,previous_y:object.properties.previous_y,id:object.properties.id,name:object.properties.name,x:object.properties.x,y:object.properties.y,width:object.properties.width,height:object.properties.height,dashed:object.properties.dashed,connector:object.properties.connector,attribute_list:object.properties.attribute_list}};object_data.shape={},object_data.shape.properties={},$.each(object.shape.properties,function(key,value){eval("object_data.shape.properties."+key+" = '"+encodeURIComponent(value)+"';")}),self.socket.emit("message",'{"channel": "composing", "action":"add_object", "user":"'+core.user.first_name+"_"+core.user.last_name+'", "workspace": "'+core.status.current_project_name+'", "filepath":"'+self.filepath+'", "message": { "object": '+JSON.stringify(object_data)+" }}")}}),$(this).bind("modify",function(evt,object){if(object!=null&&object!=undefined){object.properties.status="none";var inner_node=[];$(object.properties.inner_node).each(function(){inner_node.push({x:object.x,y:object.y})});var object_data={type:object.type,shape_name:object.shape_name,properties:{focus:object.properties.focus,is_dragging:object.properties.is_dragging,is_drawing_finished:object.properties.is_drawing_finished,selected_node:object.properties.selected_node,sx:object.properties.sx,sy:object.properties.sy,ex:object.properties.ex,ey:object.properties.ey,previous_x:object.properties.previous_x,previous_y:object.properties.previous_y,id:object.properties.id,name:object.properties.name,x:object.properties.x,y:object.properties.y,width:object.properties.width,height:object.properties.height,dashed:object.properties.dashed,inner_node:inner_node,connector:object.properties.connector,attribute_list:object.properties.attribute_list}};object_data.shape={},object_data.shape.properties={},$.each(object.shape.properties,function(key,value){eval("object_data.shape.properties."+key+" = '"+encodeURIComponent(value)+"';")}),self.socket.emit("message",'{"channel": "composing", "action":"modify_object", "user":"'+core.user.first_name+"_"+core.user.last_name+'", "workspace": "'+core.status.current_project_name+'", "filepath":"'+self.filepath+'", "message": { "object": '+JSON.stringify(object_data)+" }}")}}),$(this).bind("remove",function(e,t){var n={properties:{id:t}};self.socket.emit("message",'{"channel": "composing", "action":"remove_object", "user":"'+core.user.first_name+"_"+core.user.last_name+'", "workspace": "'+core.status.current_project_name+'", "filepath":"'+self.filepath+'", "message": { "object": '+JSON.stringify(n)+" }}"),console.log("A")}),this.timer=window.setInterval(check_for_updates,500),this.socket.on("composing_message",function(e){if(!e)return!1;var t=JSON.parse(e);if(t.channel=="composing"&&t.user!=core.user.first_name+"_"+core.user.last_name&&t.filepath==self.filepath)switch(t.action){case"add_object":self.update_queue.push(t);break;case"modify_object":self.update_queue.push(t);break;case"remove_object":self.update_queue.push(t);break;default:console.log("invalid update")}})},set_filepath:function(){this.filepath=this.target.parent.filepath+this.target.parent.filename},apply_update:function(e,t){switch(e){case"add_object":this.add_object(t);break;case"modify_object":this.modify_object(t);break;case"remove_object":this.remove_object(t);break;default:console.log("invalid update")}},add_object:function(data){var self=this,object=eval(data.message.object),add_object_available=!0;$(self.objects).each(function(e){if(this.properties.id==object.properties.id)return add_object_available=!1,!1}),add_object_available&&(this.target.add(object.type,object.shape_name),this.set_properties(self.objects[self.objects.length-1],object),this.target.draw(),this.object_uuids.push(object.data_uuid)),this.updating_process_running=!1},set_properties:function(target,source){target.type=source.type,target.shape_name=source.shape_name,target.data_uuid=source.data_uuid,target.properties.focus=source.properties.focus,target.properties.is_dragging=source.properties.is_dragging,target.properties.is_drawing_finished=source.properties.is_drawing_finished,target.properties.selected_node=source.properties.selected_node,target.properties.sx=source.properties.sx,target.properties.sy=source.properties.sy,target.properties.ex=source.properties.ex,target.properties.ey=source.properties.ey,target.properties.previous_x=source.properties.previous_x,target.properties.previous_y=source.properties.previous_y,target.properties.id=source.properties.id,target.properties.name=source.properties.name,target.properties.x=source.properties.x,target.properties.y=source.properties.y,target.properties.width=source.properties.width,target.properties.height=source.properties.height,target.properties.dashed=source.properties.dashed,target.properties.inner_node=[],$(source.properties.inner_node).each(function(){target.properties.inner_node.push({x:this.x,y:this.y})}),target.properties.connector=source.properties.connector,target.properties.attribute_list=source.properties.attribute_list,source.shape.properties!=null&&$.each(source.shape.properties,function(key,value){eval("target.shape.properties."+key+" = '"+decodeURIComponent(value)+"';")}),target.shape.set_shape(),target.shape.show()},modify_object:function(data){var object=eval(data.message.object),index=-1;$(this.target.objects).each(function(e){this.properties.id==object.properties.id&&index<0&&(index=e)}),index>-1&&(this.set_properties(this.target.objects[index],object),this.target.draw()),this.updating_process_running=!1},remove_object:function(e){console.log("remove_object");var t=this,n=e.message.object.properties.id;$(this.target.objects).each(function(e){if(this.properties.id==n)return this.remove(),!1}),this.updating_process_running=!1,console.log("remove_object_complete")}};