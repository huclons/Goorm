org.goorm.core.device=function(){this.os="",this.type=""},org.goorm.core.device.prototype={init:function(){var e=navigator.userAgent.match(/iPad/i)!=null,t=navigator.userAgent.match(/iPhone/i)!=null,n=navigator.userAgent.match(/iPod/i)!=null,r=navigator.userAgent.match(/Android/i)!=null,i=navigator.userAgent.match(/webOS/i)!=null,s={};e?($(".device_type").html("iPad"),this.type="iPad",this.os="iOS"):t?($(".device_type").html("iPhone"),this.type="iPhone",this.os="iOS"):n?($(".device_type").html("iPod"),this.type="iPod",this.os="iOS"):r?($(".device_type").html("iPod"),this.type="Android",this.os="Android"):i?($(".device_type").html("webOS"),this.type="webOS",this.os="webOS"):($(".device_type").html("PC"),this.type="PC",navigator.appVersion.indexOf("Win")!=-1&&(this.os="windows"),navigator.appVersion.indexOf("Mac")!=-1&&(this.os="MacOS"),navigator.appVersion.indexOf("X11")!=-1&&(this.os="UNIX"),navigator.appVersion.indexOf("Linux")!=-1&&(this.os="Linux"))}};