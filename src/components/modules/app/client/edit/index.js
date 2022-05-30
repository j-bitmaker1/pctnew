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
			},

			uploading : null,

			images : {
				resize : {
					width : 640,
					height : 640
				}
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

		imageProfile : function(){
			if(this.uploading){
				return {
					image : this.uploading.base64
				}
			}

			return this.general
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

			console.log("R", r, a)

			if (r && a){

				var data = {
					... a || {},
					... r || {},
					... this.payload || {},

					/*... {
						image : this.general.image
					}*/
				}

				this.check(data).then(r => {

					if(this.edit){

						/*this.core.vxstorage.invalidate(this.edit.ID, 'client')
						this.core.vxstorage.invalidate(this.edit.ID, 'lead')*/

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

					console.log("data", data, r)

					if(!data.ID) data.ID = this.edit.ID

					if (this.uploading){
						return this.core.crm.uploadAvatar(data.ID, this.uploading.file, {
							preloader : true
						})
					}

					return Promise.resolve()
	
				}).then(() => {

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

				console.log('this.edit', this.edit)

				this.general.image = this.edit.imageLink
			}
		},

		imageChange : function(i){
			this.uploading = i
			console.log("I", i)
		},

		check : function(){
			return Promise.resolve()
		}

	},
}