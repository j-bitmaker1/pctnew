import { mapState } from 'vuex';
import buylist from '../buylist/index.vue';
import f from '@/application/shared/functions';

export default {
    name: 'buylists_lists',
    props: {
    },

    components : {
        buylist
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

    created : () => {

    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
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

        api : function(){
			return 'pctapi.buylists.list'
		}
    }),

    methods : {
        search : function(v){
            this.searchvalue = v
        },

        select : function(v){

            this.$emit('selected', v)
            this.$emit('close')
        },

		click : function(e, item){

			if(f.removePopoverFromEvent(e)) return

			this.select(item)
		},

        createbuylist : function(){
            this.core.vueapi.editBuylist(null, (l) => {
                this.select(l)
            })
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

		deletebls : function(bls){

			_.each(bls, (bl) => {
				if(this.$refs['list']) this.$refs['list'].datadeleted(bl, "id")
			})

		},

		deletebl : function(bl){
			console.log("ASDASDDAS", bl)
			this.deletebls([bl])
		},

        reload : function(){
			if(this.$refs['list']) this.$refs['list'].reload()
		},
    },
}