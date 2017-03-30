define([
		"jquery",
		"EventDispatcher",
		"jqueryui",
		"punch",
		"touch"
	],
	function($, EventDispatcher, jquerui, punch, touch){
		var __instanceMoveBar;
		
		var MoveBar = function(){
			EventDispatcher.call(this);
			this.$view;
			this.onDragStart 	= this.onDragStart.bind(this);
			this.onDragStop 	= this.onDragStop.bind(this);
			this.onDrag		 	= this.onDrag.bind(this);
		}
		
		MoveBar.prototype										= Object.create(EventDispatcher.prototype);
		MoveBar.prototype.constructor							= MoveBar;
	
		MoveBar.prototype.init 	 = function($stage){
			this.$view 		=  $('<div id="movebar" class="drag-bar" data-target=""></div>');
			this.$view.css({
				'position':'absolute',
				'left':'0px',
				'top': '0px'
			});
			
			$stage.append(this.$view);
			
		}
		
	
		
		MoveBar.prototype.setTarget 	 = function($elem){
			this.$view.offset($elem.offset());
			this.setDrag(true);
		};
		
		MoveBar.prototype.setDrag 	 = function(p_flag){
			var oScope = this;
			try{
				this.$view.draggable('distroy');				
			}catch(e){
				console.log('destroy called before Draggble set ')
			}
			if(p_flag){
				this.$view.draggable({
					start:oScope.onDragStart,
					stop:oScope.onDragStop,
					cursor:'move',
					drag:oScope.onDrag
				});
			}
			
		};
		
		MoveBar.prototype.onDragStart 	 = function(event){
			this.dispatchEvent('drag_start',{type:'drag_start', target:this, offset:this.$view.offset()});
		};
		MoveBar.prototype.onDragStop 	 = function(event){
			this.dispatchEvent('drag_stop',{type:'drag_start', target:this, offset:this.$view.offset()});			
		};
		MoveBar.prototype.onDrag 	 = function(event){
			this.dispatchEvent('drag_progress',{type:'drag_start', target:this, offset:this.$view.offset()});			
		};
		
		
		if(!__instanceMoveBar){
			__instanceMoveBar = new MoveBar();
		}
		
		return __instanceMoveBar;
		
	})
