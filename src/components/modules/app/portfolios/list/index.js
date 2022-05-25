import _ from 'underscore';
import { mapState } from 'vuex';

import portfolio from '../portfolio/index.vue'

export default {
	name: 'portfolios_list',
	props: {
		additional : Object,
		actions : Array,
		showClient : Boolean,
		select : {
			type : Object,
			default : function(){
				return {
					context : 'portfolio'
				}
			}
		},

		hasmenu : {
			type : Boolean,
			default : true
		}
	},

	components : {
		portfolio
	},

	data : function(){

		return {
			loading : false,
			searchvalue : '',
			count : 0,
			sort : 'FName_asc',
			sorting : {
				FName_asc : {
					text : 'fname_asc',
					field : 'FName',
					sort : 'asc'
				},
				FName_desc : {
					text : 'fname_desc',
					field : 'FName',
					sort : 'desc'
				}
			},

		}

	},

	created() {


	},

	watch: {
		tscrolly : function(){

			if (this.$refs['list']){

				if (this.$refs['list'].height() - 1000 < this.tscrolly + this.dheight){
					this.$refs['list'].next()
				}
				
			}
			
		}
	},
	computed: mapState({
		dheight: state => state.dheight,
		tscrolly : state => state.tscrolly,
		auth : state => state.auth,

		payload : function(){
			return {
				IncludePositions : true,
				... this.additional || {}
			}
		},

		

		menu : function(){

			return this.actions ? this.actions : [
				{
					text : 'labels.deleteportfolios',
					icon : 'fas fa-trash',
					action : this.deleteportfolios
				}
			]

		},

		api : function(){
			if(this.showClient){
				return 'pctapi.portfolios.listwithClients'
			}
			else{
				return 'pctapi.portfolios.list'
			}
			
		}
	}),

	methods : {

		reload : function(){
			if(this.$refs['list']) this.$refs['list'].reload()
		},

		open : function(portfolio){

			this.$emit('open', portfolio)

			//
		},

		search : function(v){
			this.searchvalue = v
		},

		setcount : function(v){
			this.count = v
		},

		sortchange : function(v){
			this.sort = v
		},

		changeClient : function(client){
			this.$emit('changeClient', client)
		},

		selectClientToPortfolios : function(portfolios){

			this.core.vueapi.selectClientToPortfolios(portfolios, (client) => {

				this.changeClient(client)
			})

		},

		////clbks

		deleteportfolios : function(portfolios){

			_.each(cc, (portfolio) => {
				if(this.$refs['list']) this.$refs['list'].datadeleted(portfolio, "id")
			})

		},

		deleteportfolio : function(portfolio){
			this.deleteportfolios([portfolio])
		},

	},
}