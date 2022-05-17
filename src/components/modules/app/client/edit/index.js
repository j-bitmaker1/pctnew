import _ from 'underscore';
import { mapState } from 'vuex';

export default {
	name: 'clients_edit',
	props: {
		edit : Object,
		payload : {
			type : Object,
			default : () => {return {}}
		}
	},

	data : function(){

		return {
			loading : false,

			general : {
				Email : '',
				FName : '',
				LName : '',
				Status : ''
			},

			additional : {
				Title : '',
				Country : '',
				State : '',
				City : '',
				Zip : '',
				Phone : ''
			}

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

		schema : state => state.crmschemas.contact,

		generalFields : function(){
			var f = this.schema.general.fields

			f = _.filter(f, (f) => {
				return !this.payload[f.id]
			})

			return f
		},

		additionalFields : function(){
			var f = this.schema.additional.fields

			f = _.filter(f, (f) => {
				return !this.payload[f.id]
			})

			return f
		}
	}),

	methods : {
		save : function(){
			var r = this.$refs['general'].get()
			var a = this.$refs['additional'].get()
			var action = null

			if (r && a){

				var data = {
					... a || {},
					... r || {},
					... this.payload || {}
				}

				if(this.edit){

					action = this.core.api.crm.contacts.update({
						ID : this.edit.ID,
						... data
					}, {
						preloader : true,
						showStatus : true
					})
				}
				else{
	
					action = this.core.api.crm.contacts.add({
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
					
				})

			}
		},
		cancel : function(){
			this.$emit('close')
		},

		changeGeneral : function(general){
		},

		changeAdditional : function(additional){
		},

		init : function(){


			if (this.edit){
				_.each(this.schema, (g, i) => {
					_.each(g.fields, (f) => {
						this[i][f.id] = this.edit[f.id]
					})
				})
			}
		}
	},
}