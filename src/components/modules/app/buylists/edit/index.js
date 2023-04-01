import { mapState } from 'vuex';
import assetsEdit from "@/components/modules/app/assets/edit/index.vue";
import asset from "@/components/modules/app/assets/asset/index.vue";
import f from '@/application/shared/functions.js'
import _ from 'underscore';
var sha1 = require('sha1');

export default {
	name: 'portfolios_edit',
	props: {
		edit : Object,
		payload : Object,
		currentroot : [String, Number],
		from : Object,
		wnd : Boolean,
		updclbk : Function,
		showdif : Boolean
	},

	components : {
		assetsEdit,
		asset
	},

	data : function(){

		return {
			loading : false,
			mincount : 9,
			assets : [],
			hash : '',
			name : '',
			advisorFee : 0,
			focused : false,
			isModel : false,

			lastTotalAssets : 0 /// ismodel convertation
		}

	},

	created : function() {

		this.ini()
		
	},

	mounted : function(){
		this.$refs.assetsList.scrollLeft = 44

		/*setTimeout(() => {
			if(!this.name){
				this.$refs.inputname.focus()
			}
		}, 50)*/
	},

	watch: {
        assets : {
            immediate : true,
            handler : function() {
            }
        }
    },
	computed: mapState({
		auth : state => state.auth,

		total : function(){
			return Number((_.reduce(this.assets, (m, asset) => {
				return m + asset.value
			}, 0)).toFixed(2))
		},

		uncovered : function(){
			return _.reduce(this.assets, (m, asset) => {
				return !asset.isCovered ? (m + asset.value) : m
			}, 0)
		},
		extended : function(){
			var diff = Math.max(this.mincount - this.assets.length, 0) + 1

			var extended = _.clone(this.assets)

			for(var i = 0; i < diff; i++){
				extended.push({
					ticker : '',
					name : '',
					value : 0,
					ID : f.makeid()
				})
			}

			return extended
		},

		validate : function(){
			if(!this.name) return 'name'
		},

		difference : function(){
			var donorassets = (this.edit || this.from || {}).assets

			var diff = {}
			var rms = {}

			_.each(this.assets, (a) => {
				var da = _.find(donorassets, (as) => {
					return as.ticker == a.ticker
				})

				if(!da){
					diff[a.ticker]  = 0
				}

				else {
					diff[a.ticker] = da.value
				}
			})

			_.each(donorassets, (da) => {
				if(typeof diff[da.ticker] == 'undefined') rms[da.ticker] = da
			})

			return {
				diff, rms
			}
		},

		haschanges : function(){
			return this.datahash() != this.hash
		},

		cordova : function(){
			return window.cordova
		}
	}),

	methods : {

		focus : function(){
			this.focused = true
		},

		blur : function(){
			this.focused = false
		},

	
		datahash : function(){

			return sha1(this.name + this.advisorFee + JSON.stringify(_.map(this.assets, (asset) => {
				return {
					ticker : asset.ticker,
					value : asset.value
				}
			})))

		},
		cancel : function(){
			if (this.haschanges){ /// check changes instead

				if(this.wnd){
					return this.$dialog.confirm(
						'You have unsaved changes. Discard them and close this window?', {
						okText: 'Yes, close',
						cancelText : 'No'
					})
			
					.then((dialog) => {
						
						this.$emit('close')
	
					}).catch( e => {
						
					})
				}

				else{
					this.ini()
				}

				this.$emit('cancelTemp')

			}

			this.$emit('close')
		},

		cansave : function(){

			if (this.validate){

				this.$store.commit('icon', {
					icon: 'warning',
					message: this.$t('validation.portfolio.' + this.validate)
				})

				if(this.validate == 'name'){
					this.$refs['inputname'].focus()
					this.$refs['inputname'].closest('.customscroll').scrollTop = this.$refs['inputname'].offsetTop - 100
				}

				return false
			}

			return true
		},

		
		multiple(items){


			_.each(items, (item) =>{
				var asset = {
					ticker : item.ticker,
					name : item.name,
					isCovered : true
				}

				this.assets.push(asset)
			})
		},

		leaveAsset : function(index){
			setTimeout(() => {

				if (index < this.assets.length - 1){
					document.activeElement.blur();
					return
				}

				this.autofocus()
			})
		},
		assetchanged : function(index, v){
			var old = index > -1 ? this.assets[index] : null

			if(!old){

				if (v.ticker && v.name)
					this.assets.push({
						ticker : v.ticker,
						name : v.name,
						isCovered : v.isCovered
					})
			}
			else{
				old = _.extend(old, v)
			}

			if (this.haschanges){
				this.$emit('temp', this.assets)
			}
			else{
				this.$emit('cancelTemp')
			}

			
		
		},

		remove : function(index){
			if (this.assets[index]){
				this.assets.splice(index, 1)
			}

			if(this.haschanges){
				this.$emit('temp', this.assets)
			}
			else{
				this.$emit('cancelTemp')
			}

		},

		autofocus : function(){

			var assetindex = Math.max(this.assets.length - 1, 0)

			if (this.assets[assetindex]){
				assetindex++
			}

			if (this.$refs[assetindex])
				this.$refs[assetindex].autofocus()

			this.$refs.assetsList.scrollLeft = 44

		},

		changename : function(e){
			this.name = e.target.value
		},

		joinassets : function(assets){
			var jg = {}

			_.each(assets, (a) => {
				if(!jg[a.ticker]){
					jg[a.ticker] = a 
				}
				else{
				}
			})
			
			return _.toArray(jg)
		},

		

		save : function(){
			if (!this.cansave()){
				return Promise.reject()
			}

			var action = null
			var positions = this.joinassets(this.assets)


			var data = {
				name : this.name,
				positions,
				... this.payload || {}
			}


			if(this.edit) data.id = this.edit.id

			if(this.edit){

				action = this.core.api.pctapi.buylists.update({
					
					... data
					
				}, {
					preloader : true,
					showStatus : true
				})
			}
			else{

				action = this.core.api.pctapi.buylists.add({
					... data
				}, {
					preloader : true,
					showStatus : true
				})
			   
			}


			return action.then(r => {

				data = {
					...data,
					...r
				}

				if(this.updclbk) this.updclbk(data)

				this.$emit('edit', data)

				this.$emit('close')

			})
			
		},

		scan : function(){
			this.$store.commit('OPEN_CAMERA', {
				data : {
					multiple : true,
					mask : {
						title : "Take a photo of a document"
					}
				},
				events : {
					selected : (images) => {

						//base64

						var r = []

						Promise.all(_.map(images, (image) => {
							return f.urltoFile(image, "Image_" + f.date.nowUtc1000()).then(file => {

								r.push({
									base64 : image,
									file : file
								})

								return Promise.resolve()
							})
						})).then(() => {

							this.filemanager(r)
							
						}).catch(e => {

							console.error(e)

							this.$store.commit('icon', {
								icon: 'error'
							})
						})

						

					}
				}
			})
		},

		filemanager : function(images){
			this.core.vueapi.fileManager({
				fromEditor : true,
				upload : images
			}, {
				createPortfolio : (portfolio) => {
					if(!this.name) this.name = f.files.getName(portfolio)

					this.multiple(portfolio.assets)
				}
			})
		},

		addasset : function(){
			this.autofocus()
		},

		ini : function(){
			var donor = this.edit || this.from


			if (donor){
				this.assets = []
				
				_.each(donor.assets, (e) => {
					this.assets.push(_.clone(e))
				})

				this.name = donor.name
			}

			this.hash = this.datahash()
		},

		
	},
}