import _ from 'underscore';
import { mapState } from 'vuex';
import f from '../../../application/functions';

export default {
	name: 'common_edit',
	props: {

		edit : Object,
		index : String,

		payload : {
			type : Object,
			default : () => {return {}}
		},

		update : String,
		create : String,
		schema : Object
	},

	data : function(){

		return {
			loading : false,
			values : {}
		}

	},

	created(){
		this.init()
	},

	watch: {
	   
	},
	computed: mapState({
		auth : state => state.auth,
		haschanges : function(){
			return true
		},

		
	}),

	methods : {
		save : function(){
			var r = this.$refs['fields'].get()
			var action = null

			var request = f.deep(this.core.api, this.create)

			if(!request){
				console.error('request')
				return
			}

			if (r){

				var data = {
					... r || {},
					... this.payload || {}
				}

				if(this.edit){

					action = request({
						[index] : this.edit[index],
						... data
					}, {
						preloader : true,
						showStatus : true
					})
				}
				else{
	
					action = request({
						... data
					}, {
						preloader : true,
						showStatus : true
					})
				   
				}
	
				action.then(r => {
	
					this.$emit('success', data)
	
					this.$emit('close')
	
				}).catch((e = {}) => {
					console.error(e)
				})

			}
		},
		cancel : function(){
			this.$emit('close')
		},

		init : function(){

			_.each(this.schema.fields, (f) => {
				this.$set(this.values, f.id, this.edit ? this.edit[f.id] : '')
			})

		}
	},
}