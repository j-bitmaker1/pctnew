import { mapState } from 'vuex';

import rxiframe from '../rxiframe/index.vue'
export default {
	name: 'pdfparser',
	props: {
	},

	components : {
		rxiframe
	},

	data : function(){

		return {
			loading : false,
			src : "https://rixtrema.net/pdfparser?appstore=true"
		}

	},

	beforeDestroy(){
		window.removeEventListener('message', this.receiveMessage)
	},

	created(){
		window.addEventListener('message', this.receiveMessage)
	},

	watch: {
		//$route: 'getdata'
	},
	computed: mapState({
		auth : state => state.auth,
	}),

	methods : {
		onLoad : function(){

		},

		receiveMessage : function(message){

			if(this.src.indexOf(message.origin) == -1) return

			if(message.origin === 'https://rixtrema.net') {

				if(message.data.parsed_data) {

					var assets = this.core.pct.parseAssetsFromPdfParser(message.data.data)

					this.$emit('assets', assets)
					this.$emit('close')
				}
			}
		}
	},
}