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
		},

		scroll : Number
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
					field : 'name',
					sort : 'asc'
				},
				FName_desc : {
					text : 'fname_desc',
					field : 'name',
					sort : 'desc'
				},

				updated_asc : {
					text : 'date_asc',
					field : 'updated',
					sort : 'asc'
				},
				updated_desc : {
					text : 'date_desc',
					field : 'updated',
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
		tscrolly : function(state){
			return this.scroll || state.tscrolly
		},
		auth : state => state.auth,

		payload : function(){

		
			return {
				searchStrFilter : this.searchvalue,
				IncludePositions : true,
				... this.additional || {},

				sortFields : [{
					field : this.sorting[this.sort].field,
					order : this.sorting[this.sort].sort
				}]
			}
		},

		menu : function(){

			return this.actions ? this.actions : [
				{
					text : 'labels.deleteportfolios',
					icon : 'fas fa-trash',
					action : this.deleteportfoliosMenu
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

			_.each(portfolios, (portfolio) => {
				if(this.$refs['list']) this.$refs['list'].datadeleted(portfolio, "id")
			})

		},

		deleteportfolio : function(portfolio){
			this.deleteportfolios([portfolio])
		},

		gotofolder : function(f){
			this.$emit('gotofolder', f)
		},

		deleteportfoliosMenu : function(portfolios){
			this.$dialog.confirm(
				"Do you really want to delete "+portfolios.length+" portfolio(s)?", {
				okText: vm.$t('yes'),
				cancelText : vm.$t('no')
			})
	
			.then((dialog) => {

				this.$store.commit('globalpreloader', true)
				
				return Promise.all(_.map(portfolios, (c) => {
					return this.core.api.pctapi.portfolios.delete(c.id)
				})).then(r => {

					this.deleteportfolios(portfolios)
	
					this.$store.commit('icon', {
						icon: 'success'
					})

				}).catch(e => {

					this.$store.commit('icon', {
						icon: 'error',
						message: e.error
					})
				}).finally(() => {
					this.$store.commit('globalpreloader', false)
				})

			})
		}
	},
}