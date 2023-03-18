import { mapState } from 'vuex';

import linenavigation from "@/components/assets/linenavigation/index.vue";
import distribution from "../distribution/index.vue";
import allocation from "../allocation/index.vue";
import assets from "../assets/index.vue";
import edit from "../edit/index.vue";

export default {
	name: 'portfolios_shares',
	props: {
		portfolio : Object,
		editInsteadList : Boolean
	},

	components : {
		linenavigation,
		allocation,
		distribution,
		assets,
		edit
	},

	data : function(){

		return {
			loading : false,
			temp : null,
			
			navkey : 's',
			navdefault : 'assets',

			assets : [],
			assetsinfo : {},
		}

	},

	created : function(){
		//this.get()
	},

	watch: {

		['portfolio.positions'] : {
			deep: true,
			immediate : true,
			handler : function(){
				this.get()
			}
		}
	},
	computed: mapState({
		auth : state => state.auth,
		active : function(){
			return this.$route.query[this.navkey] || this.navdefault
		},
		module : function(){

			if(this.active == 'assets' && this.editInsteadList) return 'edit'

			return this.active
		},

		assetsedit : function(){
			return {
				name : this.portfolio.name,
				assets : this.assets,
				id : this.portfolio.id,
				isModel : this.portfolio.isModel
			}
		},

		navigation : function(){

			var menu = []

			menu.push({
				text : 'labels.assetslist',
				id : 'assets',
				icon : 'fas fa-list'
			})

			if(!this.temp){
				menu.push({
					text : 'labels.allocation',
					id : 'allocation',
					icon : 'fas fa-chart-pie'
				})

				menu.push({
					text : 'labels.distribution',
					id : 'distribution',
					icon : 'fas fa-chart-area'
				})
			}

			return menu
		}
	}),

	methods : {
		get : function(){

			this.assets = this.portfolio.positions
			this.loading = true

			this.core.pct.assets(this.portfolio).then(r => {

				this.assetsinfo = r

				return Promise.resolve(r)
			}).finally(() => {
				this.loading = false
			})
		},

		editportfolio : function(){
			this.$emit('editportfolio')
		},

		updclbk : function(){
			this.editportfolio()
		},

		tempassets : function(assets){
			this.$emit('temp', assets)
			this.temp = assets
        },

		cancelTemp : function(){
			this.$emit('cancelTemp')
			this.temp = null
        },

	},
}