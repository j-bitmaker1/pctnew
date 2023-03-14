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
			navigation : [
				{
					text : 'labels.assetslist',
					id : 'assets',
					icon : 'fas fa-list'
				   
				},

				{
					text : 'labels.allocation',
					id : 'allocation',
					icon : 'fas fa-chart-pie'
				},
				
				{
					text : 'labels.distribution',
					id : 'distribution',
					icon : 'fas fa-chart-area'
				   
				},
			 
			],
			navkey : 's',
			navdefault : 'assets',

			assets : [],
			assetsinfo : {}
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
				id : this.portfolio.id
			}
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
			console.log("updclbkupdclbk")
			this.editportfolio()
		}

	},
}