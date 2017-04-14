define([
	'jquery',
	'EventDispatcher'],
	function($, EventDispatcher){
	var $view;
	var arr	= ['Instert Before', 'Insert After', 'Insert Inside'];
	var __instance;
	
	var contextmenu = function(){
		EventDispatcher.call(this);
		this.$target;
		createView.call(this);
	}
	
	contextmenu.prototype										= Object.create(EventDispatcher.prototype);
	contextmenu.prototype.constructor							= contextmenu;
	
	
	function createView(){
		var oScope 		= this;
		$view = $('#contextmenu');		
		for (var i=0; i < arr.length; i++) {
		  var $elem = $('<button id="'+arr[i].split(' ').join('')+'" class="context-item" title="'+arr[i]+'">'+arr[i]+'</button>');
		  arr[i] 	= $elem;
		};
		$view.append(arr);
		$view.click(function(e){
			oScope.dispatchEvent('CONTEXT_SHOW', {type:'CONTEXT_SHOW', event:e, target:oScope.$target});
		})
	}
	
	contextmenu.prototype.show 				= function(obj, $target){
		this.$target 	= $target;
		$view.removeClass('hide');
		var w 	=	$view.width();
		$view.css({'left':obj.x, 'top':obj.y});
	}
	
	contextmenu.prototype.hide 				= function(obj){
		$view.addClass('hide').offset(obj);
	}
	
	if(!__instance){

		__instance = new contextmenu();
	}
	
	return __instance;
})
