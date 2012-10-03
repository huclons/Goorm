/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/org.goorm.core.preference.manager=function(){this.ini=null,this.treeview=null,this.preferences=null},org.goorm.core.preference.manager.prototype={init:function(e){var t=this;this.preferences=[]},get_default_file:function(e,t){$.getJSON(e,function(e){$.isFunction(t)&&t(e)})},add_treeview:function(e,t){var n=this,r=t.label,i=new YAHOO.widget.TextNode(r,e,t.expanded);$.isArray(t.child)&&$.each(t.child,function(e,t){n.add_treeview(i,t)})},create_treeview:function(e){var t=this,n=new YAHOO.widget.TreeView("preference_treeview"),r=new YAHOO.widget.TextNode(e.core.label,n.getRoot(),e.core.expanded),i=new YAHOO.widget.TextNode(e.plugin.label,n.getRoot(),!1);$.each(e.core.child,function(e,n){t.add_treeview(r,n)}),n.render(),this.treeview=n},add_tabview:function(e){var t=this,n=e.label;n=n.replace(/[/#. ]/g,""),$("#preference_tabview").append("<div id='"+n+"' style='display:none'></div>");var r=new YAHOO.widget.TabView(n);$.isArray(e.tab)&&($.each(e.tab,function(e,t){if(!$.isEmptyObject(t.html)){var n=t.html,i=t.label,s=t.classname;$.ajax({type:"GET",dataType:"html",async:!1,url:n,success:function(e){var t=new YAHOO.widget.Tab({label:i,content:e});r.addTab(t)}})}}),r.set("activeIndex",0))},create_tabview:function(e){var t=this,n=null;$.each(e.core.child,function(e,n){t.add_tabview(n)})},unserialize:function(e){var t=function(e,t,n,r){throw new window[e](t,n,r)},n=function(e,n,r){var i=[],s=e.slice(n,n+1),o=2;while(s!=r)o+n>e.length&&t("Error","Invalid"),i.push(s),s=e.slice(n+(o-1),n+o),o+=1;return[i.length,i.join("")]},r=function(e,t,n){buf=[];for(var r=0;r<n;r++){var i=e.slice(t+(r-1),t+r);buf.push(i)}return[buf.length,buf.join("")]},i=function(e,s){s||(s=0);var o=[],u=e.slice(s,s+1).toLowerCase(),a=s+2,f=new Function("x","return x"),l=0,c=0;switch(u){case"i":f=new Function("x","return parseInt(x)");var h=n(e,a,";"),l=h[0],p=h[1];a+=l+1;break;case"b":f=new Function("x","return (parseInt(x) == 1)");var h=n(e,a,";"),l=h[0],p=h[1];a+=l+1;break;case"d":f=new Function("x","return parseFloat(x)");var h=n(e,a,";"),l=h[0],p=h[1];a+=l+1;break;case"n":p=null;break;case"s":var d=n(e,a,":"),l=d[0],v=d[1];a+=l+2;var h=r(e,a+1,parseInt(v)),l=h[0],p=h[1];a+=l+2,l!=parseInt(v)&&l!=p.length&&t("SyntaxError","String length mismatch");break;case"a":var p={},m=n(e,a,":"),l=m[0],g=m[1];a+=l+2;for(var y=0;y<parseInt(g);y++){var b=i(e,a),w=b[1],E=b[2];a+=w;var S=i(e,a),x=S[1],T=S[2];a+=x,p[E]=T}a+=1;break;default:t("SyntaxError","Unknown / Unhandled data type(s): "+u)}return[u,a-s,f(p)]};return i(e,0)[2]},plugin:function(e){this.plugin_name=null,this.xml=null,this.version=null,this.url=null,this.preference={},this.ini={}}};