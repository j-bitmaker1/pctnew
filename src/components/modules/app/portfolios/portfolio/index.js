import _ from 'underscore';
import { mapState } from 'vuex';
import portfoliomenu from '@/components/modules/app/portfolio/menu/index.vue'
import client from '@/components/modules/app/portfolio/client/index.vue'
import f from '@/application/shared/functions';

export default {
	name: 'portfolios_portfolio',
	props: {
		portfolio : Object,
		hasmenu : {
			type : Boolean,
			default : true
		},
		showClient : Boolean
	},

	components : {
		portfoliomenu, client
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
		},

		profile : function(){
			if(this.showClient && this.portfolio.crmContactId){
				return this.core.vxstorage.get(this.portfolio.crmContactId, 'client')
			}
		}
	}),

	methods : {

		click : function(e){

			console.log("E", e)

			if(f.removePopoverFromEvent(e)) return
			
			if(this.portfolio.status == 'DELETED') return

			this.$emit('click', this.portfolio)
		},

		editportfolio : function(data){
			this.$emit('editportfolio', data)
		},

		deleteportfolio : function(){

			this.$emit('deleteportfolio', this.portfolio)
			
		},

		gotofolder : function(f){
			this.$emit('gotofolder', f)
		},

		changeClient : function(client){
			this.$emit('changeClient', client)
		}
	},
}