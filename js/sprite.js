/**
 * A module represents controller for the sprite element on the stage.
 * @module js/sprite  
 */
define([
		"jquery",
		"EventDispatcher",
		"jqueryui",
		"punch",
		"touch"
		],
		
	function($, EventDispatcher, jqueryui, punch, touch){
		
		/**
 		* Editable Sprite Controller
 		* @constructor
 		* @alias module:sprite
		*/
		var sprite = function(p_view, p_container){
			EventDispatcher.call(this);
			/** The class '$view' property - jQuery element */
			this.$view 			= p_view;
			/** The class '$conainer' property - jQuery element */
			this.$container		= p_container;
			/** The class 'offset' property - object */
			this.offset 		= this.$view.offset();
			this.offset.width 	= this.$view.width();
			this.offset.height 	= this.$view.height();
			createScaleBar.call(this, this.offset, 'scalebar', this.$view, this.$container);
			createMoveBar.call(this, this.offset, 'headermove', this.$view, this.$container );
			return this;
		};

	sprite.prototype										= Object.create(EventDispatcher.prototype);
	sprite.prototype.constructor							= sprite;
	
	/**
	 *Apply CSSS to view 
 	* @param {Object} css Style props
	 */	
	sprite.prototype.updateCSS							= function(css){
		this.$view.css(css);
	};
	
	/**
	 * Initialize sprite controller 
	 */
	sprite.prototype.init 		= function(){
			onDragStop.call(this, this.$view);		
	};
	
	/** 
	 *draw Scale bar handle 
	 * @param {Object} offset
	 * @param {String} id
	 * @param {jQuery} view
	 * @param {jQuery} $container
	 */
	function createScaleBar(offset, id, view, $container){
		var bar =  $('<div id="'+id+'" class="drag-bar"></div>');
		bar.css({
			'position':'absolute',
			'left':(offset.width - (bar.width()/2))+'px',
			'top': (offset.height - (bar.height()/2))+'px'
		}).html('1');
		view.append(bar);
		setDrag.call(this, bar, onDragScale.bind(this));
	
		return bar;
	}
	
	/**
	 * Draw Offset handle
 * @param {Object} offset
 * @param {String} id
 * @param {jQuery} view
	 */
	function createMoveBar(offset, id, view){
		var parentId 	= view.attr("id");
		var left 		= (view.css('position') === "absolute") ? 'left' : 'margin-left';
		var top 		= (view.css('position') === "absolute") ? 'top' : 'margin-top';
		var bar 		=  $('<div id="'+id+'2" class="drag-bar" data-target="'+parentId+'"></div>');
		bar.css({
			'position':'absolute',
			'left':(-(bar.width()/2))+'px',
			'top': (-(bar.height()/2))+'px'
		}).html('0');
		view.append(bar);
		setDrag.call(this, bar, onDragMove.bind(this) );
		
		return bar;
		
	}
	
	/**
	 * Initiate JQueryUI lib on offset and scale handles 
 * @param {Object} bar
 * @param {Object} dragFun
	 */
	function setDrag(bar, dragFun){
		bar.draggable({
			start:onDragStart.bind(this),
			stop:onDragStop.bind(this),
			cursor:'move',
			drag:dragFun
		});
		
	};
	
	/**
	 * Private: Drag handler for Offset handler 
	 */
	function onDragMove(e){
		$elem 		= $(e.target),
		$target 	= $elem.parent(),
		offset1		= $elem.offset();
		position1	= $elem.position();
		offset2		= $target.offset(),
		position2	= $target.position(),
		
		$target.offset({
			'left':offset1.left,
			'top':offset1.top
			});
// 
			// 'left':offset1.left+'px',
			// 'top': offset1.top +'px'
		//});
		console.log('movebar '+ JSON.stringify(position1));
		$elem.css({
			'left':(-($elem.width()/2))+'px',
			'top':(-($elem.width()/2))+'px'
			});
	
		
	}

	/**
	 * Private: Drag handler for Scale handler 
	 */
	function onDragScale(e){
		var $scalebar 	= $(e.target),
		$target 		= $scalebar.parent();
		
		$target.css({
			'width': ($scalebar.position().left - $target.position().left)+'px', 
			'height': ($scalebar.position().top - $target.position().top)+'px' 
		});
	//	console.log($target.attr('data-target')+' | '+$target.offset().top+' | '+$target.offset().left);
	}
	
	/**
	 * Private: jQueryUI drag start handler 
 	* @param {Object} e Drag data
	 */
	function onDragStart(e){
	//	console.log('onDragStart'+e);
	}
	
	/**
	 * Private: jQueryUI drag stop handler 
	 * @param {Object} e Drag data
	 */
	function onDragStop(e){
		this.dispatchEvent('ondrag',{type:'ondrag', target:this, css:{
						"left":this.$view.css('left'), 
						"top":this.$view.css('top'), 
						"width":this.$view.css('width'), 
						"height":this.$view.css('height')
						}});
	};
	
	/**
	 * 
 	* @param {Object} e
	 */
	function onStart(e){
		$target = $(e.target),
		$elem 	= $target.parent();
		$target.css({
			'left':$elem.offset().left + ($elem.offset().width - ($target.width()/2))+'px',
			'top': $elem.offset().top + ($elem.offset().height - ($target.height()/2))+'px'
		});
	
	}
	
	/**
	 *	Show Hide tranform handlers 
 * @param {Boolean} show
	 */
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
	
	/**
	 * Refresh transform handlers 
	 */
	sprite.prototype.invalidate  = function(){
		onDragStop.call(this);
	};
	
	/**
	 * Refresh transform handlers 
	 */
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
	


	return sprite;



	}
);