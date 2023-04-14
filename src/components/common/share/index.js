import { mapState } from 'vuex';
import f from "@/application/shared/functions.js";
export default {
	name: 'share',
	props: {
		url : String,
		message : String,
		subject : String,
		images : Array,
		files : Array,
		settings : Object
	},

	data : function(){

		return {
			loading : false,
			values : {}
		}

	},

	created() {
		if (this.settings.savels){

			try{
				this.values = JSON.parse(localStorage[this.settings.savels] || "{}")
			}
			catch(e){
				console.log(e)
			}

		}
	},

	watch: {
		//$route: 'getdata'
	},
	computed: mapState({
		auth : state => state.auth,

		cordova : function(){return window.cordova},

		composedUrl : function(){
			return this.url + this.parameters
		},

		parameters : function(){
			var v = _.reduce(this.values, (m, v, i) => {
				return v ? (m + '&' + i + '=1') : ''
			}, '')

			return v ? '?' + v : ''
		}
	}),

	methods : {
		sharelink : function(e){
			this.nativeshare(e)
		},

		changesettings : function(v){
			this.values = v

			if (this.settings.savels){
				localStorage[this.settings.savels] = JSON.stringify(this.values)
			}
		},

		nativeshare : function(e){

			e.target.blur();

			var plugin = f.deep(window, 'plugins.socialsharing')

			if(!plugin){

				this.$store.commit('icon', {
					icon : 'error',
					message : "Socialsharing plugin hasn't exist"
				})

				return
			}

			plugin.shareWithOptions({

				message: this.message || '', 
				subject: this.subject || '',
				images : this.images || [],
				files : _.map(this.files || [], (f) => {return f.base64}),
				url: this.composedUrl

			}, () => {

			   this.$emit('close')

			}, function(){

			});
		},

		copylink : function(){
			f.copytext(this.composedUrl || '')

			this.$store.commit('icon', {
				icon : 'success',
				message : "Link copied to clipboard"
			})

			this.$emit('close')
		},

		download : function(){
			return Promise.all(_.map(this.files, (file) => {

				return f.Base64.toFileFetch(file.base64, file.type, file.name).then(File => {
					return f.download(File, file.name)
				}).then(r => {

					this.$store.commit('icon', {
						icon : 'success',
						message : "Downloaded successfully"
					})

				}).catch(e => {

					console.error(e)

					this.$store.commit('icon', {
						icon : 'error'
					})

					this.$emit('close')
				})

			}))
		}
	},
}