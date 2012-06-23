/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module utility
 **/

/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class statusbar
 * @extends utility
 **/
org.goorm.core.utility.sorting = function () {

};

org.goorm.core.utility.sorting.prototype = {
	
	sortingFunction: function (a, b) {
		if (a.sortkey < b.sortkey) return -1;
		if (a.sortkey > b.sortkey) return 1;
		return 0; 
	},
	
	quickSort: function (array) {
		if (array.length != 0) {
			
			array.sort(this.sortingFunction);


			return array;
		}
	}

};