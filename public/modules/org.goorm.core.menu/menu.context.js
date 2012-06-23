/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module menu
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class context
 * @extends menu
 **/
org.goorm.core.menu.context = function () {
	/**
	 * This presents the current browser version
	 * @property menu
	 * @type Object
	 * @default null
	 **/
	this.menu = null;
	
	/**
	 * This presents the current browser version
	 * @property target
	 * @type Object
	 * @default null
	 **/
	this.target = null;
	
	this.name = null;
};

org.goorm.core.menu.context.prototype = {
	
	/**
	 * This function is an goorm core initializating function.  
	 * @constructor 
	 * @param {String} path The path.
	 * @param {String} name The name.
	 * @param {String} trigger The trigger.
	 * @param {String} fingerprint The fingerprint.
	 * @param {String} target The target.
	 * @param {String} fn The fn.
	 * 
	 **/
	init: function (path, name, trigger, fingerprint, target, fn) {
		var self = this;
		
		this.target = target;
		
		if (name == "none") {
			$(trigger).bind("contextmenu", function(e) {
				return false;
			});
		}
		else {
			var url = "file/get_contents";
			
			if (trigger == "") {
				trigger = null;
			}
	
			$.ajax({
				url: url,			
				type: "GET",
				data: "path="+path,
				success: function(data) {
					if(fingerprint != null && fingerprint != "") {
						while (data.indexOf("[{@FINGERPRINT}]") != -1) {
							data = data.replace("[{@FINGERPRINT}]", fingerprint);							
						}
	
						name = name + "_" + fingerprint;
					}
					self.name=name;
					$("#goormMenuContainer").find("div[id='" + name + "']").remove();
					$("#goormMenuContainer").append(data);
					
					self.menu = new YAHOO.widget.ContextMenu( 
						name,  
						{ 
							trigger: trigger, 
							lazyload: true,
							effect: {  
								effect: YAHOO.widget.ContainerEffect.FADE, 
								duration: 0.15 
							}                                     
						}
					);
					
					//m.s("asdf" + fn, "asdf");
					
					if(fn) {
						fn.call(self);
					}

					/*
					if(fingerprint == "treeview") { //Does fingerprint div have a treeview?
		
						$("#"+trigger).find(".ygtvcell").bind("contextmenu", function (e) {

							var targetEl = e.target;
			 
							//m.s($(targetEl).html(), "menu.context");
							
							var currentNode = target.getNodeByElement(targetEl);
			 
			 				//m.s(currentNode.toSource(), "menu.context");
							
							if (currentNode) {
								m.s("show" + currentNode, "asdf");
								self.menu.show();
							}
							
							return false;
			 
						});
					}
					*/
				}
			});			
		}
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method blur 
	 **/
	show: function () {
		if (this.menu) {
			this.menu.show();
		}
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method cancel 
	 **/
	cancel: function () {
		if (this.menu) {
			this.menu.cancel();
		}
	},
	
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method blur 
	 **/
	blur: function () {
		if (this.menu) {
			this.menu.blur();
		}
	},	
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method blur 
	 **/
	hide: function () {
		if (this.menu) {
			this.menu.hide();
		}
	},
	
	/**
	 * This function is an goorm core initializating function.  
	 * @method remove 
	 **/
	remove: function () {
		$("#" + this.target).remove();
		
		delete this;
	}
};
