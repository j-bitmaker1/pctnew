import { mapState } from 'vuex';
import assetsEdit from "@/components/modules/app/assets/edit/index.vue";
import asset from "@/components/modules/app/assets/asset/index.vue";
import f from '@/application/shared/functions.js'
import _ from 'underscore';
var sha1 = require('sha1');
import aggregationsEdit from "@/components/modules/app/aggregations/edit/index.vue";

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
		aggregationsEdit,
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
			aggregation : null,
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
                this.getassetsinfo()
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
			if(!this.total) return 'total'
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
		},

		firstsave : function(){
			if(this.edit && this.edit.id > 0) {
				return false
			}

			return true
		}
	}),

	methods : {

		focus : function(){
			this.focused = true
		},

		blur : function(){
			this.focused = false
		},

		getassetsinfo : function(){
			/*this.core.pct.assets(this.assets).then(r => {
				this.assetsinfo = r
				return Promise.resolve(r)
			})*/
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

		changeTotalValue : function(e){
			var newvalue = e.target.value

			var p = this.total / newvalue

			_.each(this.assets, (a) => {
				a.value = Number((a.value / p).toFixed(this.isModel ? 2 : 0))
			})

			if (this.haschanges){
				this.$emit('temp', this.assets)
			}
			else{
				this.$emit('cancelTemp')
			}
		},
		
		multiple(items){

			if (this.isModel){
				var d = (Math.max(100 - this.total, 0) || 100) / 100
				var multiple = 1

				var totalAssets = _.reduce(items, (m, i) => {
					return m + i.value
				}, 0)

				if (totalAssets <= 1.1){
					multiple = 100
				}

				if (totalAssets <= 1.1 || totalAssets > 100){
					items = _.map(items, (i) => {
						return {
							...i,
							value : d * multiple * i.value / totalAssets
						}
					})
				}
			}

			_.each(items, (item) =>{
				var asset = {
					ticker : item.ticker,
					name : item.name,
					value : item.value,
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
						value : v.value && this.isModel ? v.value : v.value || 0,
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

			if (this.assets[assetindex] && this.assets[assetindex].value){
				assetindex++
			}

			if (this.$refs[assetindex])
				this.$refs[assetindex].autofocus()

			this.$refs.assetsList.scrollLeft = 44

		},

		changename : function(e){
			this.name = e.target.value
		},
		changefee : function(e){
			this.advisorFee = e.target.value / 100
		},
		joinassets : function(assets){
			var jg = {}

			_.each(assets, (a) => {
				if(!jg[a.ticker]){
					jg[a.ticker] = a 
				}
				else{
					jg[a.ticker].value += a.value
				}
			})
			
			return _.toArray(jg)
		},

		pdfparser : function(){

			this.$store.commit('OPEN_MODAL', {
				id : 'modal_pdfparser',
				module : "pdfparser",
				caption : "Parse portfolio from PDF",
				data : {},
				events : {
					assets : (assets) => {
						this.multiple(assets)
						//this.assets = this.assets.concat(assets)

					}
				},
				mclass : 'absoluteContent'
			})

		},

		uploadFromFileStart : function(){
			//this.$store.commit('globalpreloader', true)
		},

		uploadFromFileUploadedAll : function(){
			//this.$store.commit('globalpreloader', false)
		},

		uploadFromFileUploaded: function(file){

			this.core.pct.loadFromfile({
				File : file.base64,
				FileType : (file.extension || "").toUpperCase()
			}, {
				preloader : true,
				showStatus : true
			}).then(assets => {
				this.multiple(assets)
			})
		},

		uploadFromFileError : function(e){

			if (e.text){
				this.$store.commit('icon', {
					icon: 'error',
					message: e.text
				})
			}

		},

		savedefault : function(){
			var r = null

			if(this.currentroot && this.currentroot != '0' && this.currentroot) r = this.currentroot

			this.save(r).catch(e => {

				if(e){
					this.$store.commit('icon', {
						icon: 'error',
						message: e.text
					})
				}
				
			})
		},

		checkModel : function(){

			if (this.isModel && this.total.toFixed(0) != 100){

				this.$dialog.confirm(
					'The total amount of the model portfolio must be exactly equal to 100%. Do You want to automatically adjust position weights to a portfolio total of 100%?', {
					okText: "Yes",
					cancelText : 'No'
				})
		
				.then((dialog) => {

					this.autoCorrectAssets()

				}).catch( e => {
					console.error(e)
				})

				return false

			}

			return true
		},

		autoCorrectAssets : function(){
			if (this.isModel){

				var items = this.assets

				var d = 100 / this.total

				items = _.map(items, (i) => {
					return {
						...i,
						value : Number((d * i.value).toFixed(2))
					}
				})

				this.assets = items

			}
		},

		save : function(catalogId, copy){
			if (!this.cansave()){
				return Promise.reject()
			}

			if (!this.checkModel()) return Promise.reject() 

			var action = null
			var positions = this.joinassets(this.assets)


			var data = {
				name : this.name,
				positions,
				advisorFee : this.advisorFee,
				isModel : this.isModel,
				... this.payload || {}
			}

			if (catalogId){
				data.catalogId = catalogId
			}

			if(this.edit && this.edit.id > 0 && !copy) data.id = this.edit.id

			if(data.id){

				action = this.core.api.pctapi.portfolios.update({
					
					... data
					
				}, {
					preloader : true,
					showStatus : true
				})
			}
			else{

				action = this.core.api.pctapi.portfolios.add({
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

		savecopyas: function(){



			
			if (this.name == this.edit.name)
			{

				this.core.vueapi.editcustom({
					schema : {
						fields : [
							{
								id : 'name',
								text : 'fields.portfolioname',
								rules : [{
									rule : 'required'
								}]
							}
						]
					},
					values : {
						name : this.name,
					},

					caption : "Enter portfolio name"
				}, ({name}) => {

					if(name == this.name){

						this.$store.commit('icon', {
							icon: 'error',
							message : 'You must enter a different name'
						})

						return
					}

					this.name = name

					this.saveas(true)
				})

			}
			else{
				this.saveas(true)
			}
			

		},

		saveas : function(copy){

			if (!this.cansave()){
				return
			}

			//this.selected, 

			this.core.vueapi.selectFolder((folder) => {


				this.save(folder.id, copy).catch(e => {
					this.$store.commit('icon', {
						icon: 'error',
						message: e.text
					})
				})
			})

		},

		cancelAggregation : function(){
			this.aggregation = null
		},

		aggregate : function(){

			var selected = null

			if (this.aggregation){
				selected = {}

				_.each(this.aggregation.items, (item) => {
					selected[item.item.id] = item.item
				})

			}
				
			this.core.vueapi.selectPortfolios( (portfolios) => {
				var selected = {}

				_.each(portfolios, (p, i) => {

					selected[p.id] = {
						item : p,
						weight : 0
					}

				})

				this.aggregation || (this.aggregation = {
					items : {}
				})

				this.aggregation.items = selected

			}, {selected})
		
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
				upload : images,
				context : 'portfolio'
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
				this.isModel = donor.isModel
				this.advisorFee = donor.advisorFee
			}


			this.hash = this.from ? '' : this.datahash()

		},

		model : function(){

			var assets = this.assets

			var total = this.total

			if(!this.isModel) this.lastTotalAssets = total
			else this.lastModelTotalAssets = total

			this.isModel = !this.isModel

			if(this.isModel){
				assets = _.map(assets, (a) => {
					return {
						...a,
						value : Number(((this.lastModelTotalAssets || 100) * (this.total ? a.value / this.total : 0)).toFixed(2))
					}
				}) 
			}

			else{
				if (this.lastTotalAssets){

					assets = _.map(assets, (a) => {

						return {
							...a,
							value : Number((a.value * this.lastTotalAssets / 100).toFixed(2))
						}
					}) 

				}
			}

			this.assets = assets
		}
	},
}