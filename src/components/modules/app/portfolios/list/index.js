import _ from 'underscore';
import { mapState } from 'vuex';

import portfolio from '../portfolio/index.vue'

export default {
	name: 'portfolios_list',
	props: {
		additional : Object,
		actions : {
			type : Array,
			default : () => {return []}
		},
		select : Object,
		showClient : Boolean,

		path : {
			type : String,
			default : ''
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

			selected : null,
			
		}

	},

	created() {

		console.log('this.select', this.select)

		if (this.select && this.select.selected){
			this.selected = _.clone(this.select.selected)
		}
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

		selectOptions : function(){
			return {
				class : 'leftselection',
				selected : this.select ? this.select.selected : null,
				disableActions : false,
				disable : (this.select && !this.select.multiple) ? true : false,
				filter : this.select ? this.select.filter : null,
			}
		},

		menu : function(){

			if (this.select){
				return this.select.actions
			}

			return [

				... this.actions,

				{
					text : 'labels.deleteportfolios',
					icon : 'fas fa-trash',
					action : 'deleteportfolios'
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

			if (this.select){
				this.$emit('selected', [portfolio])
				this.$emit('close')
			}
			else{
				this.$router.push(this.path + 'portfolio/' + portfolio.id)
			}
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

		selectionSuccess : function(portfolios){
			if (this.select){
				this.$emit('selected', portfolios)
			}
			else{
				this.selected = portfolios
			}
			
		},

		selectionChange : function(v){
			this.$emit('selectionChange', v)
		},

		selectionCancel : function(){
			this.selected = null

			this.$emit('selectionCancel')
		},

		menuaction : function(action){
			if (this[action]){
				this[action]()
			}   
		},

		deleteportfolios : function(portfolios){
			/*_.each(portfolios, (portfolio) => {

				if(this.$refs['list']) this.$refs['list'].datadeleted(portfolio, "id")

			})*/

			this.selectionCancel()
		},

		deleteportfolio : function(portfolio){
			this.deleteportfolios([portfolio])
		},

		editportfolio : function(data){
			this.core.vxstorage.update(data,  'portfolio')

			//if(this.$refs['list']) this.$refs['list'].datachanged(portfolio, "id")

		},

		changeClient : function(client){
			this.$emit('changeClient', client)
		},

		setportfoliostoclient : function(){

			this.$store.commit('OPEN_MODAL', {
				id : 'modal_clients',
				module : "clients",
				caption : "Select Client",
				data : {
					select : {
						multiple : false
					}
				},

				events : {
					selected : (clients) => {

						var client = clients[0]

						this.core.pct.setPortfoliosToClient(client.ID, this.selected, {
							preloader : true,
							showStatus : true
						}).then(r => {
							this.selected = null

							this.changeClient()
							///// clientChanged
						})

						
					}
				}
			})

		}

	},
}