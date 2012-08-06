/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
  **/

org.goorm.core.design.canvas.dialog = function () {
	this.dialog = null;
};

org.goorm.core.design.canvas.dialog.prototype = {
	init: function (option) {
		this.dialog = new org.goorm.core.dialog();
		this.dialog.init(option, true);
		
		return this;
	}
};