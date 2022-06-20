import {mapState} from 'vuex';
// TODO IGOR' SEARCH ALL COMPONENTS
import _ from 'underscore'
export default {
	name: 'search',
	props: {
		placeholder: String,
		minimize: {
			type: Boolean,
			default: false
		},

		loading : Boolean,
		activity : String,
		value : String,

		controlKeys : Boolean
	},

	data: function () {

		return {
			isTyping: false,
			searchTxt: ''
		}

	},

	created: () => {

	},

	watch: {
		searchTxt : {
			handler : _.debounce(function() {

				var text = this.searchTxt
				this.$emit('search', text)

				if (this.activity && text){
					this.core.activity.template('searching', {
						type : this.activity,
						value : text
					})
				}
	
			}, 500)
		},

		value : function(value){
			this.searchTxt = value
		}
	},
	computed: mapState({
		auth: state => state.auth,
		pocketnet: state => state.pocketnet,
		minimized: state => state.minimized,
		active: function (state) {
			return state.active || !this.minimize
		},
	}),

	methods: {
		change : function(event){
			this.searchTxt = event.target.value
		},

		clear : function(event){
			this.searchTxt = ''
		}, 
 
		clickicon: function () {
			this.$refs['input'].focus()
		},

		blured: function () {
		},

		focused: function () {
		},

		focus : function(){
			this.$refs['input'].focus()
		},

		keydown(event) {

			var e = false

			if(this.controlKeys){
				if (event.keyCode === 40 || event.keyCode === 38) {
					this.$emit('controlKey', event.keyCode === 40 ? 'down' : 'up')
					e = true
				}

				if (event.keyCode === 39 || event.keyCode === 13) {
					this.$emit('controlKey', 'enter')
					e = true
				}

			}

			if(e) {
				event.preventDefault()

				return false
			}
		},

		paste : function(evt){
			this.$emit('paste', evt)
		}
	},
}