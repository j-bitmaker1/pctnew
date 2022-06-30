import { mapState } from 'vuex';
import f from "@/application/shared/functions.js";
export default {
	name: 'share',
	props: {
		url : String,
		message : String,
		subject : String,
		images : Array,
		files : Array
	},

	data : function(){

		return {
			loading : false
		}

	},

	created : () => {

	},

	watch: {
		//$route: 'getdata'
	},
	computed: mapState({
		auth : state => state.auth,

		cordova : function(){return window.cordova}
	}),

	methods : {
		sharelink : function(e){
			this.nativeshare(e)
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
				url: this.url

			}, () => {

			   this.$emit('close')

			}, function(){

			});
		},

		copylink : function(){
			f.copytext(this.url || '')

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