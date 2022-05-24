import { mapState } from 'vuex';

import portfoliolist from '../list/index.vue'
import filesystem from '@/components/common/filesystem/index.vue'
import _ from 'underscore';

export default {
	name: 'portfolios_main',
	props: {
		additional : Object,
		select : Object
	},

	components : {
		portfoliolist, 
		filesystem
	},

	data : function(){

		return {
			loading : false,
		}

	},

	created() {
	},

	watch: {
		//$route: 'getdata'
	},
	computed: mapState({
		auth : state => state.auth,
		fsselect : function(){

			if(!this.select) return undefined

			return {
				context : this.select.context,
				disableMenu : true,

				filter : (item) => {
					return item.type == this.select.context && (!this.select.filter || this.select.filter(item))
				}
			}
		},

		pfselect : function(){
			if(!this.select) return undefined

			return {
				context : this.select.context,
				disableMenu : true
			}
		},

		/*menu : function(){
			if(!this.select) return undefined

			return []
		}*/
	}),

	methods : {

		reload : function(data){
			this.$refs['list'].reload()
			this.$refs['filesystem'].load(data.catalogId || "0")
		},

		open : function(portfolio){

			if(this.select){
				this.$emit('selected', [portfolio])
			}
			else{
				this.$emit('open', portfolio)
			}

			this.$emit('close')
			
		},

		selected : function(portfolios){

			var fromfs = _.map(_.filter(portfolios, (p) => {
				return p.context == 'filesystem'
			}), (p) => {
				return p.id
			})

			this.core.api.pctapi.portfolios.gets(fromfs, {
				preloader : true
			}).then(r => {

				_.each(r, (portfolio) => {
					portfolios[portfolio.id] = portfolio
				})


				this.$emit('selected', portfolios)

				this.$emit('close')
			})

			
		}

	},
}