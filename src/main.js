import Vue from 'vue'
import App from '@/App.vue'
import './registerServiceWorker'

require('babel-polyfill')
window.$ = window.jQuery = require('jquery');

var deviceready = function(clbk){

	if(typeof window.cordova != 'undefined')
	{
	  	document.addEventListener('deviceready', function(){
  
			/*var appbrowser = f.deep(window, 'cordova.InAppBrowser')
  
			if (appbrowser) window.open = appbrowser*/
  
			//window.screen.orientation.lock('portrait')
		
			//navigator.splashscreen.hide();			
  
			clbk()
		
	  	}, false);
	}
	else{
	  	clbk()
	}
}

deviceready(() => {
	new Vue({
		render: h => h(App),
	}).$mount('#pct-root')
})