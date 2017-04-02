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
		this.offset;
	}
	
	responsiveGrid.prototype.draw = function(){

		this.canvas.width		= this.config.width;
		this.canvas.height 	= this.config.height;
		this.context.clearRect(0,0, this.config.width, this.config.height);
		
		var col = this.config.col,
		height	= this.config.height,
		width	= this.config.width;
		
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
	}
	
	
	
	return responsiveGrid
	}
)
