import _ from 'underscore';
import { mapState } from 'vuex';
import portfoliomenu from '@/components/modules/app/portfolio/menu/index.vue'
export default {
	name: 'portfolios_portfolio',
	props: {
		portfolio : Object,
		hasmenu : {
			type : Boolean,
			default : true
		}
	},

	components : {
		portfoliomenu
	},

	data : function(){

		return {
			loading : false,
		   
		}

	},

	created : () => {

	},

	watch: {
		//$route: 'getdata'
	},
	computed: mapState({
		auth : state => state.auth,
		total : function(){
			return _.reduce(this.portfolio.positions, (m, p) => {
				return m + p.value
			}, 0)
		}
	}),

	methods : {

		click : function(){

			if(this.portfolio.status == 'DELETED') return

			this.$emit('click', this.portfolio)
		},

		editportfolio : function(data){

			
			this.$emit('editportfolio', data)

		},

		deleteportfolio : function(){

			this.$emit('deleteportfolio', this.portfolio)
			
		}
	},
}