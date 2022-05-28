import { mapState } from 'vuex';
import assetsEdit from "@/components/modules/app/assets/edit/index.vue";
import f from '@/application/functions'
import _ from 'underscore';
var sha1 = require('sha1');
import aggregationsEdit from "@/components/modules/app/aggregations/edit/index.vue";

export default {
	name: 'portfolios_edit',
	props: {
		edit : Object,
		payload : Object
	},

	components : {
		assetsEdit,
		aggregationsEdit
	},

	data : function(){

		return {
			loading : false,
			mincount : 9,
			assets : [],
			hash : '',
			name : '',
			aggregation : null,
			focused : false
		}

	},

	created : function() {

		if (this.edit){
			this.assets = []
			
			_.each(this.edit.assets, (e) => {
				this.assets.push(_.clone(e))
			})

			this.name = this.edit.name
		}

		this.hash = this.datahash()
		
	},

	mounted : function(){
		this.$refs.assetsList.scrollLeft = 100
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
			return _.reduce(this.assets, (m, asset) => {
				return m + asset.value
			}, 0)
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

		haschanges : function(){
			return this.datahash() != this.hash
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

			return sha1(this.name + JSON.stringify(_.map(this.assets, (asset) => {
				return {
					ticker : asset.ticker,
					value : asset.value
				}
			})))

		},
		cancel : function(){
			if (this.haschanges){ /// check changes instead

				return this.$dialog.confirm(
					'You have unsaved changes, close the window and forget?', {
					okText: 'Yes, close',
					cancelText : 'No'
				})
		
				.then((dialog) => {
					
					this.$emit('close')

				}).catch( e => {
					
				})

			}

			this.$emit('close')
		},

		cansave : function(){
			if (this.validate){

				this.$store.commit('icon', {
					icon: 'error',
					message: 'Validation Error'
				})

				return false
			}

			return true
		},

		save : function(catalogId){
			if (!this.cansave()){
				
				return
			}

			var action = null
			var positions = this.joinassets(this.assets)

			var data = {
				name : this.name,
				positions,
				... this.payload || {}
			}

			if (catalogId){
				data.catalogId = catalogId
			}

			if(this.edit) data.id = this.edit.id

			if(this.edit){

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


			action.then(r => {

				data = {
					...data,
					...r
				}

				this.$emit('edit', data)

				this.$emit('close')

			}).catch((e = {}) => {
				
			})

			//this.$emit('save', this.assets)

			
		},
		assetchanged : function(index, v){
			var old = this.assets[index]
			var af = false

			if(!old){

				af = true

				if (v.ticker && v.name)
					this.assets.push({
						ticker : v.ticker,
						name : v.name,
						value : v.value || 0,
						isCovered : v.isCovered
					})
			}
			else{
				old = _.extend(old, v)

				if(index == this.assets.length - 1) af = true
			}

			if (af)
				setTimeout(() => {
					this.autofocus()
				})
			
		},

		remove : function(index){
			if (this.assets[index]){
				this.assets.splice(index, 1)
			}
		},

		autofocus : function(){
			var assetindex = this.assets.length - 1

			if (this.assets[assetindex] && this.assets[assetindex].value){
				assetindex++
			}

			if (this.$refs[assetindex])
				this.$refs[assetindex].autofocus()

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
						this.assets = this.assets.concat(assets)
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
				this.assets = this.assets.concat(assets)
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

		saveas : function(){

			if (!this.cansave()){
				return
			}

			this.core.vueapi.selectFolder(this.selected, (folder) => {
				this.save(folder.id)
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
						console.log('images', images)
					}
				}
			})
		},

		filemanager : function(){
			this.core.vueapi.fileManager({}, {
				assets : () => {
					
				}
			})
		}
	},
}