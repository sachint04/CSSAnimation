define([
		"jquery",
		"EventDispatcher",
		"jqueryui",
		"punch",
		"touch"
		],
	function($, EventDispatcher, jqueryui, punch, touch){
	
		
		var sprite = function(p_view, p_container){
			  EventDispatcher.call(this);
			this.$view 			= p_view;
			this.$container		= p_container;
			this.offset 		= this.$view.offset();
			this.offset.width 	= this.$view.width();
			this.offset.height 	= this.$view.height();
			createScaleBar.call(this, this.offset, 'scalebar', this.$view, this.$container);
			moveScaleBar.call(this, this.offset, 'headermove', this.$view, this.$container );
			return this;
		};

	sprite.prototype										= Object.create(EventDispatcher.prototype);
	sprite.prototype.constructor							= sprite;
	
	sprite.prototype.updateCSS							= function(css){
		this.$view.css(css);
	};
	
	sprite.prototype.init 		= function(){
			onDragStop.call(this, this.$view);		
	};
	
	function createScaleBar(offset, id, view, $container){
		var bar =  $('<div id="'+id+'" class="drag-bar"></div>');
		bar.css({
			'position':'absolute',
			'left':(offset.width - (bar.width()/2))+'px',
			'top': (offset.height - (bar.height()/2))+'px'
		}).html('1');
		view.append(bar);
		setDrag.call(this, bar, onDrag.bind(this));
	
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
		setDrag.call(this, bar, onDrag1.bind(this) );
		
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

	function onDrag1(e){
		$target = $(e.target),
		$elem 	= $('#'+$target.attr('data-target')),
		$scalebar = $elem.find('#scalebar');
		
		$elem.css({'top':$target.position().top+'px'});
		$elem.css({'left':$target.position().left+'px'});
	//	console.log($target.attr('data-target')+' | '+$target.offset().top+' | '+$target.offset().left);
	}
	function onDragStart(e){
		console.log('onDragStart'+e);
	}
	function onDragStop(e){
		this.dispatchEvent('ondrag',{type:'ondrag', target:this, css:{
						"left":this.$view.css('left'), 
						"top":this.$view.css('top'), 
						"width":this.$view.css('width'), 
						"height":this.$view.css('height')
						}});
	};
	
	sprite.prototype.showControls  = function(show){
		var movebar 	= $("#headermove2"),
		scalebar 		= $("#scalebar");
		if(show){
			movebar.removeClass('hide');
			scalebar.removeClass('hide');
		}else{
			movebar.addClass('hide');
			scalebar.addClass('hide');
		}
	};
	
	sprite.prototype.invalidate  = function(){
		onDragStop.call(this);
	};
	sprite.prototype.invalidateControls  = function(){
		var bar 		= $("#headermove2"),w,h,l,t,width,height, pos;
		pos			= this.$view.position();
		l 				= pos.left;
		t 				= pos.top;
		width			= bar.width();
		height			= bar.height();
		
		bar.css({
			'position':'absolute',
			'left': (l -(width/2))+'px',
			'top': 	(t -(height/2))+'px'
		});
		
		bar 		= $("#scalebar");
		w 			= bar.width();
		h 			= bar.height();
		width 		= this.$view.width();
		height 		= this.$view.height();
		 
		bar.css({
			'position':'absolute',
			'left':(width 	- (w/2))+'px',
			'top': (height 	- (h/2))+'px'
		});
	};
	
	function setDrag(bar, dragFun){
		bar.draggable({
			start:onDragStart.bind(this),
			stop:onDragStop.bind(this),
			cursor:'move',
			drag:dragFun
		});
		
	};

	return sprite;



	}
);