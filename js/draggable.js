/**
 * 
 * This module is represents draggable element controller
 *@exports js/draggable 
 */
define(
	[
		"jquery",
		"EventDispatcher",
		"interact"],
	/**
	* Draggable Sprite Controller
	* @constructor
	* @alias module:Draggable
	*/
	function($, EventDispatcher, interact){
		
		var draggable 		= function(sprite, container, grid){
			EventDispatcher.call(this);
			this.grid 		= grid;
			this.sprite		= sprite;
			this.container	= container
		
			console.log(event.type, event.pageX, event.pageY);
			
		}
		
		draggable.prototype										= Object.create(EventDispatcher.prototype);
		draggable.prototype.constructor							= draggable;	
		
		/** 
		 * initalize Interact JS 
		 */
		draggable.prototype.init				= function(){
			var element 	= this.sprite[0];
			var nWidth		= this.sprite.outerWidth();
			
			var gridTargetScale = interact.createSnapGrid({
			  x:	this.grid.x, 
			  y:	1,
			  range: Infinity,
			 // offset: { x: 5, y: 10 }
			});
			var gridTargetDrag = interact.createSnapGrid({
			  x:	this.grid.x , 
			  y:	1,
			  range: Infinity,
			 // offset: { x: 5, y: 10 }
			});
			
			this.interact = interact(element)  
			  .draggable({
			    // enable inertial throwing
			    inertia: true,
			    // keep the element within the area of it's parent
			    restrict: {
			     restriction: 'parent'
			    },
			    // enable autoScroll
			   // autoScroll: true,
			    // call this function on every dragmove event
			    onmove: dragMoveListener,
			    snap:{
		    	
			    	targets:[   gridTargetDrag]
			    }
			  })
			.resizable({
				 snap:{
		    	
			    	targets:[   gridTargetScale]
			   }, 
			   restrict: {
      				restriction: 'parent',
    			},
				   edges:{
				   		right:true,
				   		bottom:true,
				   		top:true,
				   		left:true
				   	}
				   	
				}
			)
			.on(['resizemove', 'resizeend'], resizeListener.bind(this))
			.on('resizestart', function(event){
					event.target.setAttribute('data-w', $(event.target).outerWidth());
					event.target.setAttribute('data-h', $(event.target).outerHeight());
			})

		};
		
		/** 
		 * unset Interact and call initalize again 
 		* @param {Object} grid
		 */
		draggable.prototype.refresh				= function(grid){
			this.grid		= grid;
			var gridTargetScale = interact.createSnapGrid({
			  x:	this.grid.x, 
			  y:	1,
			  range: Infinity,
			 // offset: { x: 5, y: 10 }
			});
			var gridTargetDrag = interact.createSnapGrid({
			  x:	this.grid.x , 
			  y:	1,
			  range: Infinity,
			 // offset: { x: 5, y: 10 }
			});
			
			this.interact.unset();
			this.init();
		};
		
		function dragMoveListener (event) {
		  //  console.log(event.type, event.pageX, event.pageY);
		    var target = event.target,
		        // keep the dragged position in the data-x/data-y attributes
		        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
		        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
		
		    // translate the element
			//	target.style.webkitTransform =
		    // target.style.transform =
		      // 'translate(' + x + 'px, ' + y + 'px)';
		
		target.style.left = x+'px';
		target.style.top = y+'px';
			
		    // update the posiion attributes
		    target.setAttribute('data-x', x);
		    target.setAttribute('data-y', y);
		  }
		
		function resizeListener(event){
			var $target 	=	 $(event.target),
			w0			= (Number(event.target.getAttribute('data-w'))),
			h0			= (Number(event.target.getAttribute('data-h'))),
			offsetx		= event.pageX - event.x0,
			offsety		= event.pageY - event.y0,
			w1			= w0 + offsetx,
			h1			= h0 + offsety,
			range		= ( w1 % this.grid.x);
			console.log('range - '+ range);
			
			w1 = w1- range ;
			
			
			$target.width(w1);
			$target.height(h1);
			
			
		}
		
		
		return draggable;
	}
);
