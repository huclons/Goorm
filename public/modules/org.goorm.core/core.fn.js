org.goorm.core.fn = function() {
	
};

org.goorm.core.fn.prototype = {
	init: function () {
		//////////////////////////////////////////////////////////////////////////////////////////////////////
		// Expand jquery function : reverse()
		//////////////////////////////////////////////////////////////////////////////////////////////////////
		
		$.fn.reverse = function() {
			return this.pushStack(this.get().reverse(), arguments);
		};
		
		//I forgot why I needed this function... fuck 
		$.fn.formatForDisplay = function() {
			if (this.size()==0) return "<em>wrapped set is empty</em>"
			var text = '';
			this.each(function(){
				text += '<div>' + this.tagName;
				if (this.id) text += '#' + this.id;
				text += '</div>';
			});
		  return text;
		}; 
		
		$.fn.move = function (old_index, new_index) {
		    while (old_index < 0) {
		        old_index += this.length;
		    }
		    while (new_index < 0) {
		        new_index += this.length;
		    }
		    if (new_index >= this.length) {
		        var k = new_index - this.length;
		        while ((k--) + 1) {
		            this.push(undefined);
		        }
		    }
		    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
		    return this; // for testing purposes
		};
	}
};