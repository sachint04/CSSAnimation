define([
		"jquery",
		"EventDispatcher",
		"jqueryui",
		"punch",
		"touch"
		],
	function($, EventDispatcher, jqueryui, punch, touch){
		var offset,$view,$container;
		var sprite = function(p_view, p_container){
			  EventDispatcher.call(this);
			$view 			= p_view;
			$container		= p_container;
			offset 			= $view.offset();
			offset.width 	= $view.width();
			offset.height 	= $view.height();
			createScaleBar.call(this, offset, 'scalebar', $view, $container);
			moveScaleBar.call(this, offset, 'headermove', $view,$container );
			

			return this;
		}

	sprite.prototype										= Object.create(EventDispatcher.prototype);
	sprite.prototype.constructor							= sprite;
	
	sprite.prototype.updateCSS							= function(css){
		$view.css(css);
	};
	
	function createScaleBar(offset, id, view, $container){
		var bar =  $('<div id="'+id+'" class="drag-bar"></div>');
		bar.css({
			'position':'absolute',
			'left':(offset.width - (bar.width()/2))+'px',
			'top': (offset.height - (bar.height()/2))+'px'
		}).html('1');
		view.append(bar);
		setDrag.call(this, bar, onDrag.bind(this), onStart.bind(this));
		return bar;
	}

	function moveScaleBar(offset, id, view){
		var parentId 	= view.attr("id");
		var left 		= (view.css('position') === "absolute") ? 'left' : 'margin-left';
		var top 		= (view.css('position') === "absolute") ? 'top' : 'margin-top';
		var bar 		=  $('<div id="'+id+'2" class="drag-bar" data-target="'+parentId+'"></div>');
		bar.css({
			'position':'absolute',
			'left':(-(bar.width()/2))+'px',
			'top': (-(bar.height()/2))+'px'
		}).html('0');
		view.parent().append(bar);
		setDrag.call(this, bar, onDrag1.bind(this), onStart1.bind(this)  );
		
		
		return bar;
		
	}

	function onDragContainer(e){
	
	}
	function onStart(e){
		$target = $(e.target),
		$elem 	= $target.parent();
		$target.css({
			'left':$elem.offset().left + ($elem.offset().width - ($target.width()/2))+'px',
			'top': $elem.offset().top + ($elem.offset().height - ($target.height()/2))+'px'
		});
	
	}
	function onDrag(e){
		$target = $(e.target),
		$elem 	= $target.parent();
		$elem.width($target.offset().left - $elem.offset().left  );
		$elem.height($target.offset().top - $elem.offset().top );
		$target.css({
			'left':$elem.offset().left + ($elem.offset().width - ($target.width()/2))+'px',
			'top': $elem.offset().top + ($elem.offset().height - ($target.height()/2))+'px'
		});
	
	
	}
	function onStart1(e){
		
	}
	function onDrag1(e){
		$target = $(e.target),
		$elem 	= $('#'+$target.attr('data-target')),
		$scalebar = $elem.find('#scalebar')
		$elem.css({'top':$target.position().top+'px'});
		$elem.css({'left':$target.position().left+'px'});
		
		
		
	
		
	//	console.log($target.attr('data-target')+' | '+$target.offset().top+' | '+$target.offset().left);
	}
	function onDragStart(e){
		console.log('onDragStart'+e);
	}
	function onDragStop(e){
		this.dispatchEvent('ondrag',{type:'ondrag', target:this, css:{
						"left":$elem.css('left'), 
						"top":$elem.css('top'), 
						"width":$elem.css('width'), 
						"height":$elem.css('height')
						}});
	}
	
	function setDrag(bar, dragFun){
		bar.draggable({
			start:onDragStart.bind(this),
			stop:onDragStop.bind(this),
			cursor:'move',
			drag:dragFun
		})
		
	}

	return sprite;



	}
);