org.goorm.core.theme.area.dialog = function () {
	
	this.dialog = null;
};

org.goorm.core.theme.area.dialog.prototype = {
	init: function (option) {
		this.dialog = new org.goorm.core.dialog();
		this.dialog.init(option);
		
		return this;
	}

};