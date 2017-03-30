require.config({
	waitSeconds: 200,
    shim:{
		'jquery':{
			exports: 'jQuery'
		},
		'jqueryui':{
			exports: 'jqueryui',
			deps: ['jquery']
		},
		'punch':{
			exports: 'punch',
			deps: ['jquery']
		},
		'touch':{
			exports: 'touch',
			deps: ['jquery']
		}
    },
    paths:{
        jquery				: 'libs/jquery-1.10.2',
           'jqueryui' 			: 'libs/jquery-ui-1.11.3.min',
        'punch'				: 'libs/jquery.ui.touch-punch.min',
        'touch'				: 'libs/jqueryui_touch'
        
    }
});

//  Protect against IE8 not having developer console open.
var console = window.console || {
    "log": function () {
    },
    "error": function () {
    },
    "trace": function () {
    }
};

if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
};

define([
		"jquery",
		"timeline",
		"sprite",
		"moveBar"
		],
		function($, Timeline, sprite, moveBar){
			var timeline = new Timeline($(".timlineview")); 
			var obj = {
				timesec: 8,
				fps: 25,
				currentframe:1
			}
			
			timeline.init(timeline, obj);
			moveBar.init($('.stage'))
			//timeline.play();
				
			
		}
);
