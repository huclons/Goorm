/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/org.goorm.core.theme.manager=function(){this.parent=null,this.treeview=null,this.treeview_json=null,this.table_variable_array=[],this.table_name_array=[]},org.goorm.core.theme.manager.prototype={init:function(e){this.parent=e},add_treeview:function(e,t){var n=this,r=t.label,i=new YAHOO.widget.TextNode(r,e,t.expanded);$.isArray(t.child)&&$.each(t.child,function(e,t){n.add_treeview(i,t)})},create_treeview:function(e){var t=this,n=new YAHOO.widget.TreeView("theme_details_treeview"),r=new YAHOO.widget.TextNode(e.general.label,n.getRoot(),e.general.expanded);t.treeview_json=e.general.child,$.each(e.general.child,function(e,n){t.add_treeview(r,n)}),n.render(),this.treeview=n},add_tabview:function(e){var t=this,n=e.label;n=n.replace(/[/#. ]/g,""),$("#theme_details_tabview").append("<div id='"+n+"' style='display:none'></div>");var r=new YAHOO.widget.TabView(n);$.isArray(e.tab)&&($.each(e.tab,function(e,t){if(!$.isEmptyObject(t.html)){var n=t.html,i=t.label;$.ajax({type:"GET",dataType:"html",async:!1,url:n,success:function(e){var t=new YAHOO.widget.Tab({label:i,content:e});r.addTab(t)}})}}),r.set("activeIndex",0))},create_tabview:function(e){var t=this,n=null;$.each(e.general.child,function(e,n){t.add_tabview(n)})},create_datatable:function(){console.log("create datatable");var e=this;e.table_variable_array=[],e.table_name_array=[];var t=[{key:"selector",label:"Selector",hidden:!0},{key:"position",label:"Position",hidden:!0},{key:"description",label:"Description",width:170},{key:"property",label:"Property",width:100},{key:"value",label:"Value",width:360,editor:new YAHOO.widget.TextboxCellEditor({disableBtns:!0})},{key:"isArray",label:"isArray",hidden:!0}],n=new YAHOO.util.DataSource;n.responseSchema={fields:["selector","position","description","property","value","isArray"]},$.each(e.treeview_json,function(r,i){$.each(i.tab,function(r,i){e.table_variable_array.push(new YAHOO.widget.ScrollingDataTable(i.element,t,n,{width:"694px",height:"310px"})),e.table_name_array.push(i.element)})}),e.subscribe_datatable()},subscribe_datatable:function(){var e=this,t=function(e){var t=e.target;YAHOO.util.Dom.hasClass(t,"yui-dt-editable")&&this.highlightCell(t)};for(var n=0;n<e.table_variable_array.length;n++)e.table_variable_array[n].subscribe("cellMouseoverEvent",t),e.table_variable_array[n].subscribe("cellMouseoutEvent",e.table_variable_array[n].onEventUnhighlightCell),e.table_variable_array[n].subscribe("cellClickEvent",e.table_variable_array[n].onEventShowCellEditor)},set_datatable:function(){console.log("set datatable");var e=this;e.clear_datatable();var t=[],n=[];$.each(e.treeview_json,function(e,r){$.each(r.tab,function(e,r){$.each(r.style,function(e,i){t.push(r.element+"-"+i),n.push(r.element)})})});for(var r=0;r<t.length;r++){var i=e.table_name_array.indexOf(n[r]),s=e.parent.current_theme_data[t[r].split("_")[0]].selector,o=t[r].split("_")[0],u=e.parent.current_theme_data[t[r].split("_")[0]].description,a=t[r].split("_")[1],f=e.parent.current_theme_data[t[r].split("_")[0]].style[t[r].split("_")[1]];if($.isArray(f))for(var l=0;l<f.length;l++)e.table_variable_array[i].addRow({selector:s,position:o,description:u,property:a,value:f[l],isArray:!0},0);else e.table_variable_array[i].addRow({selector:s,position:o,description:u,property:a,value:f,isArray:!1},0)}},clear_datatable:function(){console.log("clear datatable");var e=this;for(var t=0;t<e.table_variable_array.length;t++)e.table_variable_array[t].getRecordSet().reset(),e.table_variable_array[t].render()},update_json:function(){var e=this;for(var t in e.parent.current_theme_data)for(var n in e.parent.current_theme_data[t].style)$.isArray(e.parent.current_theme_data[t].style[n])&&(e.parent.current_theme_data[t].style[n]=[]);for(var r=0;r<e.table_variable_array[0].getRecordSet()._records.length;r++){var i=e.table_variable_array[0].getRecordSet()._records[r]._oData.position,n=e.table_variable_array[0].getRecordSet()._records[r]._oData.property,s=e.table_variable_array[0].getRecordSet()._records[r]._oData.value,o=e.table_variable_array[0].getRecordSet()._records[r]._oData.isArray;o?e.parent.current_theme_data[i].style[n].push(s):e.parent.current_theme_data[i].style[n]=s}}};