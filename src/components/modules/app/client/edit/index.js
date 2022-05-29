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
				Status : '',
				image : ''
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
					... this.payload || {},

					... {
						image : this.general.image
					}
				}

				this.checkImageUpload(data).then(r => {

					if(this.edit){

						this.core.vxstorage.invalidate(this.edit.ID, 'client')
						this.core.vxstorage.invalidate(this.edit.ID, 'lead')

						action = this.core.api.crm.contacts.update({
							ID : this.edit.ID,
							... data
						}, {
							preloader : true,
							//showStatus : true
						})
					}
					else{
		
						action = this.core.api.crm.contacts.add({
							... data
						}, {
							preloader : true,
							//showStatus : true
						})
					
					}
	
					return action

				}).then(r => {

					data = {
						...data,
						...r
					}

					this.$emit('success', data)
	
					this.$emit('close')

					this.$store.commit('icon', {
						icon: 'success',
					})
	
				}).catch((e = {}) => {

					console.log("E", e)

					if(e.alreadyExists){

						if(this.edit){

						}
						else{
							return this.core.api.crm.contacts.getbyemail(data.Email, {
								preloader : true,
							}).then(r => {

								console.log("R", r)

								var type = 'client'

								if(r.Type == "LEAD") type = 'lead'

								return this.$dialog.confirm(
									this.$t('labels.exist' + type), {
									okText: this.$t('labels.goexist' + type),
									cancelText : 'No'
								})
						
								.then((dialog) => {
									this.$emit('close')
									this.$router.push(type + '/' + r.ID)
				
								}).catch( e => {
									
								})

							})
						}

						
					}

					this.$store.commit('icon', {
						icon: 'error',
						message: e.error
					})

					console.error("E", e)
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

			//this.checkEmail('maxgrishkov@gmail.com')


			if (this.edit){
				_.each(this.schema, (g, i) => {
					_.each(g.fields, (f) => {
						this[i][f.id] = this.edit[f.id]
					})
				})
			}
		},

		imageChange : function(i){
			this.$set(this.general, 'image', i.base64)
			console.log("I", i)
		},

		checkImageUpload : function(data){
			if(data.image && data.image.indexOf('base64,') > -1){

				data.image = '' //// todo upload api

				return Promise.resolve()
			}

			return Promise.resolve()
		}

	},
}