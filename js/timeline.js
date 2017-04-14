/**
 * A module represents Timeline and flash like Play/Pause controls.
 * @module js/timeline  
 */
define([
		"jquery",
		"EventDispatcher"
		],
	function($, EventDispatcher){
	var 	time 			= 10,
			fps				= 20, 
			currentframe 	= 1, playInterval, sprite, $playhead,$frame, $view,oEffect;

		/**
		 * 
		 * Timeline. flash like time and play/pause controls
		 * @constructor 
		 * @alias module:timeline
		 */
	var timeline  = function(p_$view){
		EventDispatcher.call(this);
		/** The class "stop" property. */ 
		this.stop 	= this.stop.bind(this);
		/** The class "play" property. */ 
		this.play 	= this.play.bind(this);
		this.init	= this.init.bind(this);
		$view = p_$view;
	};
	
	timeline.prototype										= Object.create(EventDispatcher.prototype);
	timeline.prototype.constructor							= timeline;
	
	/** 
	 * Timeline initialization
	 * @param {Object} timeline timeline controller object
	 * @param {Object} p_sprite sprite controller object
	 * @param {JSON} oJson timeline configuration
	 */
	timeline.prototype.init = function(timeline, p_sprite, oJson){
		var oScope 		= this;
		sprite 			= p_sprite;
		time 			=	oJson.timesec || 30;
		fps				= 	oJson.fps || 25;
		currentframe	=	oJson.currentframe || 1;
		createtimeline.call(this);	
		
		effect = oEffect;
		this.setCurrentFrame(currentframe);
		
		sprite.addEventListener('ondrag', onDrag.bind(this));
		
		$('.timeline-cntrl a' ).click(function(e){
			oScope.handleEvent.call(oScope, e);
		});
		
		$('.effects a').click(function(e){
			var sEffect = $(e.currectTarget).attr('id'); 
			oScope.addEffect.call(this, sEffect);
		});
		
		this.setKeyFrame(1);
		sprite.init();

	};
	
	/**
	 * Set current frame to Selected. Update CSS properties if current frame is key frame
 	* @param {Number} p_nframe Frame number
	 */
	timeline.prototype.setCurrentFrame 		= function(p_nframe){
		//current frame is valid 
		if(p_nframe <= (time * fps)){
			currentframe = p_nframe;	
		}
		// set selected state
		$('.frame.item.selected').removeClass('selected');
		var  curFrame = $("#f_"+currentframe+".frame.item");			
		curFrame.addClass('selected');
		$('#frame_cnt').text(currentframe);
		//update CSS props of sprite if current frame is key frame
		if(oEffect){
			var lastFrame 	= this.getLastKeyFrame(currentframe),
			key				= oEffect.key[oEffect[currentframe]];
			if(key){
				sprite.updateCSS( key.css);
				sprite.invalidateControls.call(sprite);					
			}
		}
	};
	
	/**
	 * get previous key frame from current frame
 	* @param {Number} p_nframe current Frame number
	 */
	timeline.prototype.getLastKeyFrame 		= function(p_nframe){
		var i = 1;
		$('.frame.item.key').each(function(index, elem){
			if(i > Number(p_nframe)){
				return false;
			}
			i 	= $(elem).attr('id').split('_')[1];
		});
		return i;
	};
	
	/**
	 * Chnage current frame to Key Frame 
 * @param {Number} p_nframe Frame Number
	 */
	timeline.prototype.setKeyFrame 		= function(p_nframe){
		var  curFrame;
		if(p_nframe ){
			if(p_nframe > (time * fps))return;
			
			curFrame = parseInt(p_nframe);
		}else{
			curFrame = this.getCurrentFrame();			
		}
		this.stop();
		$curFrame = $("#f_"+curFrame+".frame.item");			
		if(!$curFrame.hasClass('key')){
			$curFrame.addClass('key');					
		}else{
			$curFrame.removeClass('key');
			sprite.invalidate();								
		}
	};
	
	
	timeline.prototype.getCurrentFrame 		= function(p_num){
		return currentframe;
	};
	
	/**
	 * Play animation 
	 */
	timeline.prototype.play 		= function(){
		if(playInterval){
			this.stop();
		}
		var oScope 	= this,
		nTime		= time;
		nFPS		= fps;
		
		playInterval 	= setInterval(function(){
			curfrm		= oScope.getCurrentFrame();
			if(curfrm >= (nTime * nFPS)){
				oScope.stop();
				clearInterval(playInterval);
			}
			oScope.setCurrentFrame(curfrm + 1);
		}.bind(oScope), Math.ceil(1000/fps));
		
		sprite.showControls(false);
		createAnimation.call(this);
	};
	
	/**
	 * Stop animation 
	 */
	timeline.prototype.stop 		= function(){
		if(playInterval){
			clearInterval(playInterval);
			playInterval = null;
		};
		sprite.showControls(true);
		sprite.invalidateControls(true);
		clearAnimation.call(this);
	};
	
	/**
	 * Event handler 
 * @param {Object} e Event
	 */
	timeline.prototype.handleEvent = function(e){
		var oScope = this,
		id 	= $(e.currentTarget).attr('id');
		//console.log('handleEvent() - '+ id);
		switch(id.toLowerCase()){
			case "btn_pause" :
				oScope.stop();
				break;
			case "btn_play" :
				oScope.play();
				break;
			case "btn_key" :
				oScope.setKeyFrame(oScope.getCurrentFrame());
				break;
			case "btn_prev" :
				oScope.setCurrentFrame(1);
				break;
			case "btn_next" :
				oScope.setCurrentFrame(time * fps);
				break;
		};
	};
	
	/**
	 * Event listenter for Drag event 
 	* @param {Object} obj Drag event data
	 */
	function onDrag(obj){
		var curFrame 	= this.getCurrentFrame(),
		$curFrame		= $("#f_"+currentframe+".frame.item"),
		bKey			= $curFrame.hasClass('key');
		
		if(bKey){
			updateCSS.call(this,obj);
		}
	};
	
	/**
	 *  Update CSS props in 'oEffect' object
 	* @param {Object} obj CSS data
	 */
	function updateCSS(obj){
		var curFrame 	= this.getCurrentFrame(),
		$curFrame		= $("#f_"+currentframe+".frame.item");
		if(!oEffect){
			oEffect = {key:[]};
		}
		if(isNaN(oEffect[curFrame])){
			oEffect[curFrame] 	= oEffect.key.length;
			oEffect.key.push({});
		}
		oEffect.key[oEffect[curFrame]] = {
				frame		: curFrame,
				css			: obj.css
			};	
			
		// console.log(JSON.stringify(oEffect));				
		 	
	};
	
	/**
	 * Create CSS styles of sprite transformation and Animation.
	 * Append it in the markup 
	 */
	function createAnimation(){
		var key = oEffect.key.slice(0);
		if(key.length){
			key.sort(function(a, b){
				return a.frame - b.frame;
			});
		};
		var totalF		= key[key.length - 1].frame;
		
		if(totalF){
			var s = '.sprite{animation-name: anim;animation-duration: '+Math.ceil(totalF /fps) +'s;}'
			var style = '@keyframes anim {';
			for (var i=0; i < key.length; i++) {
			  var frame = key[i].frame,
			  css		= key[i].css,
			  per		= Math.round((frame/totalF)* 100);
			  style		= style+' '+per+'% {';
			  	for (var prop in css) {
					style = style+ prop+':'+ css[prop]+';';
				  };
			  style		= style + '}';
			};
			 style		= style + '}';
			
			$('.anim-style').empty().append('<style>'+s+' '+style+'</style>');	
		//	console.log(style);
		//	console.log(s);
		}
	};
	
	/**
	 * Clear CSS style information from markup 
	 */
	function clearAnimation(){
		$('.anim-style').empty();
	};
	
	/**
	 * Create timeline view 
	 */
	function createtimeline(){
		if(time){
			var oScope = this,
			$frametemplate 	= $('<span class="frame hide"><a href="#" class="btn-frame">f</a></span>');
			
			$view.empty();
			$playhead 	= $('<div class"play-head"></div>');
			var frames = time * fps;
			
			for (var i=1; i <= frames; i++) {
				var $f 	= $frametemplate.clone().removeClass('hide').addClass('item');
				$f.attr({
					"id":'f_'+i,
					"title": ''+i
				})
				$f.click(function(e){
					oScope.stop();
					oScope.setCurrentFrame.call(oScope, parseInt($(this).attr('id').split('_')[1]));
					
				})
			  $view.append($f);
			};
			
		}
	};
	
<<<<<<< HEAD
=======
	function onInsert(e){
		var $target 	= $(e.event.target);
		var action 		= $target.attr('id').toLowerCase();
		var $target,$elem;
		var $elem 	= $('<div class="sprite"></div>')
		switch(action){
			case 'insertbefore' :
				$elem.insertBefore(e.target);
			break;
			case 'insertafter' :
				$elem.insertAfter(e.target);
			break;
			case 'insertinside' :
				e.target.append($elem);
			break;
		}
		createSprite.call(this, $elem);
		contextmenu.hide();
	};
>>>>>>> parent of 5807db4... update
	

	return timeline;

});

