var _ = require('underscore');

import f from "./functions";

const { Howl, Howler } = require('howler');

class Notifier {

	constructor(core, p) {
		if (!p) p = {}

		this.core = core
		this.showed = JSON.parse(localStorage[this.key] || "{}")

	}

	key = 'showednotifications'
	showed = {}

	addshowed(id) {

		this.showed = JSON.parse(localStorage[this.key] || "{}")
		this.showed[id] = true
		localStorage[this.key] = JSON.stringify(this.showed)

	}

	clearshowed() {
		this.showed = {}
		localStorage[this.key] = JSON.stringify(this.showed)
	}

	playsound() {
		// If cordova is available, use the media plugin to play a sound
		if (window.Media && window.cordova && window.cordova.file && window.cordova.file.applicationDirectory) {

			var soundSrc = window.cordova.file.applicationDirectory + 'www/sounds/glass.mp3';

			if (soundSrc.startsWith('file://'))
				soundSrc = soundSrc.substring(7);

			var notificationSound = new Media(soundSrc);

			notificationSound.play();
		}


		else if (Howl) {
			var notificationSound = new Howl({
				src: ['sounds/glass.mp3'],
				html5: true
			});

			notificationSound.play();
		}
	}

	notifySoundOrAction() {

		var lastsounddate = localStorage['lastsounddate'] || null

		if (lastsounddate) {
			lastsounddate = new Date(lastsounddate)

			if (f.date.addseconds(lastsounddate, 10) > (new Date())) {
				return
			}
		}

		localStorage['lastsounddate'] = (new Date())

		if (window.cordova && window.POCKETNETINSTANCE) {
			window.POCKETNETINSTANCE.mobile.vibration.small()
		}
		else {
			this.playsound()
		}
	}

	message(event) {

		if (event.eventId){

			if (this.showed[event.eventId]) return Promise.resolve()

				this.addshowed(event.eventId)

		}

		this.notifySoundOrAction()
		this.show(event, '/url')

	}

	show = function (info, click) {

		if (typeof click != 'function') {
			var route = click

			click = () => {
				this.core.vm.$router.push(route).catch(e => {})

				if (this.core.apptochat) this.core.apptochat()
			}
		}

		var position = f.mobileview() ? 'top-left' : "bottom-left";

		return this.core.vm.$message({
			title: info.title,
			message: info.message,
			icon: info.icon || null,
			img: info.img || null,
			onClick: click,
			zIndex: 2999,
			supportHTML: true,
			wrapperClassName: "notificationWrapper",
			position: position,
			type: 'info',
			duration: 5000
		})
	}

	simplemessage = function(info){
		var position = f.mobileview() ? 'top-left' : "bottom-left";

		return this.core.vm.$message({
			title: info.title,
			message: info.message,
			icon: info.icon, 
			zIndex: 2999,
			supportHTML: true,
			wrapperClassName: "notificationWrapper",
			position: position,
			type: 'info',
			duration: 5000
		})
	}
}

export default Notifier