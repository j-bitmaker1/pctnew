import { mapState } from 'vuex';

import portfoliolist from '../list/index.vue'
import filesystem from '@/components/common/filesystem/index.vue'

export default {
	name: 'portfolios_main',
	props: {
		additional : Object,
		select : Object,
		onlylist : Boolean
	},

	components : {
		portfoliolist, 
		filesystem
	},

	data : function(){

		return {
			loading : false,
			currentSelection : null
		}

	},

	created() {
	},

	watch: {
		//$route: 'getdata'
	},
	computed: mapState({
		auth : state => state.auth,
	}),

	methods : {
		selected : function(portfolios){

			this.currentSelection = null
			
			this.$emit('selected', portfolios)
			this.$emit('close')

		},

		reload : function(data){
			this.$refs['list'].reload()
			this.$refs['filesystem'].load(data.catalogId || "0")
		},

		selectionChange : function(k, v){

			this.currentSelection = k
		},

		selectionCancel : function(k){

			this.currentSelection = null
		}
	},
}