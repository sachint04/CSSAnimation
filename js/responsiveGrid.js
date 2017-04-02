/**
 * 
 * This module is represents responsive grid system
 *@exports js/responsiveGrid 
 */
define([
		'jquery'
	
	],	function($){
	
	/**
 		* Editable Sprite Controller
 		* @constructor
 		* @alias module:ResponsiveGrid
		*/
	var responsiveGrid = function(_canvas, _config){
		this.canvas 	= _canvas;
		this.context	= this.canvas.getContext('2d');
		this.config		= _config;
		this.draw 		= this.draw.bind(this);
		this.refresh 	= this.refresh.bind(this);
		this.offset;
	}
	
	responsiveGrid.prototype.draw = function(){
		
		this.canvas.width		= this.config.stage.width();
		this.canvas.height 		= this.config.stage.height();
		this.context.clearRect(0,0, this.config.stage.width(), this.config.stage.height());
		
		var col = this.config.col,
		height	= this.config.stage.height(),
		width	= this.config.stage.width();
		
		this.offset	= width / Number(col);
		this.context.strokeStyle = 'rgb(155,155,155)';
		this.context.setLineDash([5, 10] );
		this.context.beginPath()
		for(var i= 1; i<=col; i++){
			var noffset = i * this.offset;
			this.context.moveTo(noffset, 0);
			this.context.lineTo(noffset, height);
			this.context.stroke();				
		}
		
		var obj 	= checkPadding.call(this),
		$canvas = $(this.canvas);
		$canvas.css('left', obj.left);
		$canvas.css('top', obj.top);
	}
	
	responsiveGrid.prototype.refresh = function(_stage){
		this.draw();
		var obj 	= checkPadding.call(this),
		$canvas = $(this.canvas);
		$canvas.css('left', obj.left);
		$canvas.css('top', obj.top);
		
	};
	
	function checkPadding(){
		var $canvas = $(this.canvas),
		_stage		= this.config.stage,
		left 		= parseInt(_stage.css('left'), 10) || 0,
		pLeft		= parseInt(_stage.css('padding-left'), 10),
		top 		= parseInt(_stage.css('top'), 10) || 0,
		pTop		= parseInt(_stage.css('padding-top'), 10),
		cssLeft		= (left 	+ pLeft) +'px',
		cssTop		= (top 		+ pTop) +'px';
		return {left : cssLeft, top:cssTop};
	}
	
	
	return responsiveGrid
	}
)
