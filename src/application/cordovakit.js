import f from './functions'
import FaceId from './utils/faceid'
class Cordovakit {
	constructor(core){

		this.core = core
		this.store = this.core.store
		this.vm = this.core.vm
		this.faceid = new FaceId(this)
	}

	prepare(){

		document.documentElement.style.setProperty('--keyboardheight', `0px`);

		if (!window.cordova) return

		if (navigator.splashscreen) navigator.splashscreen.hide();

		window.screen.orientation.lock('portrait')

		document.documentElement.style.setProperty('--app-margin-top-default', `20px`);
		

		this.keyboard()
		this.links()
		this.openwith()
		//window.StatusBar.hide()
		window.StatusBar.backgroundColorByHexString('#00000000');
		window.StatusBar.styleDefault()
		//self.platform.sdk.theme.current == 'white' ? window.StatusBar.styleDefault() : window.StatusBar.styleLightContent()
	}

	keyboard(){
		window.addEventListener('keyboardWillShow', (event) => {

			document.documentElement.style.setProperty('--keyboardheight', `${event.keyboardHeight}px`);

			if (document.activeElement){
				document.activeElement.closest('.customscroll').scrollTop = document.activeElement.offsetTop - 100
			}
		});

		window.addEventListener('keyboardWillHide', () => {
			document.documentElement.style.setProperty('--keyboardheight', `${0}px`);
		});
		
	}

	links() {
		if (universalLinks != 'undefined'){
            universalLinks.subscribe('route-message', function (eventData) {

				var route = (eventData.url || '').replace('https://rixtrema.net/pctnew/')

				if (route){
					this.core.router.push(route)
				}
				
            });
        }
	}

	openwith(){

		if(!cordova.openwith) return

		var mime = {

			'image/jpeg' : 'images',
			'image/jpg' : 'images',
			'image/png' : 'images',
			'image/webp' : 'images'

		}

		var utitomime = {
			'public.image' : 'image/jpeg'
		}

		cordova.openwith.init();
		cordova.openwith.addHandler(function(intent){
			var sharing = {}

			if(intent.action == 'VIEW') return

			var promises = _.map(
				_.filter(intent.items || [], function(i){return i}),
				(item) => {

				return new Promise((resolve, reject) => {


					if(utitomime[item.type]) item.type = utitomime[item.type]

					if(item.base64 && isios()) item.data = 'data:' + item.type + ';base64,' + item.base64

					if(!item.type || item.data){
						resolve()
					}
					else{
						cordova.openwith.load(item, function(data) {

							item.data = 'data:' + item.type + ';base64,' + data

							resolve()

						});
					}


				}).then(r => {

					if (item.text){
						if(!sharing.messages) sharing.messages = []

						sharing.messages.push(item.text)
					}

					if(item.type && item.data){

						var mt = mime[item.type] || 'files'

						if(!sharing[mt]){
							sharing[mt] = []
						}

						sharing[mt].push(item.data)
					}

					return Promise.resolve()
				})
			})


			Promise.all(promises).then(r => {

				if (intent.exit) { cordova.openwith.exit(); }

				if(_.isEmpty(sharing)){
					
				}
				else{

					if(sharing.images || sharing.files){

						var up = [].concat(sharing.images, sharing.files)


						return Promise.all(_.map(up, (f) => {
							return this.f.Base64.toFileFetch(f)
						})).then(files => {
							this.store.commit('uploading', files)

							this.core.vuieapi.fileManager()
						})
						
					}

				}
			})
		});

	}

	vibration(total){

		if(f.isios()){

			if(typeof TapticEngine != 'undefined')
				TapticEngine.impact({
					style: "medium"
				});

		}
		else{
			if (navigator.vibrate && total){
				navigator.vibrate(50)
			}
		}

	   
	}


	_faceid() {

		if(!window.plugins.touchid) return Promise.reject('notavailable')

		return new Promise((resolve, reject) => {

			window.plugins.touchid.isAvailable(
				function(type) {

					if(localStorage['usefaceid']){

						window.plugins.touchid.didFingerprintDatabaseChange(

							function(changed) {
								
								if (changed) {
									reject('unauthorized')
								} else {

									window.plugins.touchid.verifyFingerprintWithCustomPasswordFallback(
										type == 'face' ? "Face ID" : 'Touch ID', // this will be shown in the native scanner popup
										function(msg) {
											resolve()
										}, // success handler: fingerprint accepted
										function(msg) {
				
											reject('unauthorized')
				
										} // error handler with errorcode and localised reason
									);

								}
							}
						);

					}
					else{
						return reject('usefaceid')
					}

				}, // type returned to success callback: 'face' on iPhone X, 'touch' on other devices
				function(msg) {

					return reject('notavailable')

				} 
			);

		})

		
	}

}

export default Cordovakit