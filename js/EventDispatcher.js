define([
], function(Logger){
	function EventDispatcher() {
		this.events = {};
		return this;
	}
	EventDispatcher.prototype = {
		constructor					: EventDispatcher,
		addEventListener			: function (key, func) {
		    if (!this.events.hasOwnProperty(key)) {
		        this.events[key] = [];
		    }
		    this.events[key].push(func);
		},
		hasEventListener			: function (key, func) {
		    if (!this.events.hasOwnProperty(key)) {
				if(func){
					if(this.events[key].indexOf(func) !== -1){
						return true;
					}
				}
		        return false;
		    }
		    return true;
		},
		removeEventListener			: function (key, func) {
		    if (this.events.hasOwnProperty(key)) {
		        for (var i in this.events[key]) {
		            if (this.events[key][i] === func || typeof this.events[key][i] == 'function') {
		                this.events[key].splice(i, 1);
		            }
		        }
		    }
		},
		removeAllEventListener		: function (key, func) {
			for(var key in this.events){
				var keyPointer	= this.events[key];
		        for (var i in keyPointer) {
	                this.events[key].splice(i, 1);
		        }
		        keyPointer = null;
			}
		},
		dispatchEvent				: function (key, dataObj) {
		    if (this.events.hasOwnProperty(key)) {
		        dataObj = dataObj || {};
		        dataObj.currentTarget = this;
		        var eventKeyCopy	= this.events[key].slice(0);
		        for (var i=0; i < eventKeyCopy.length; i++) {
					eventKeyCopy[i](dataObj);
				};
		    }
		},
		destroy						: function () {

		}
	};

	return EventDispatcher;
});