import { mapState } from 'vuex';

import search from '../search/index.vue'
import annuities from '../annuities/index.vue'
import linenavigation from "@/components/assets/linenavigation/index.vue";

export default {
    name: 'assets_lookup',
    props: {
    },

    components : {
        search, annuities, linenavigation
    },

    data : function(){

        return {
            loading : false,

            navigation : [
				{
					text : 'labels.structured',
					id : 'annuities',
				},
				{
					text : 'labels.assets',
					id : 'search',
				}
			],

            navdefault : 'annuities',

            navkey : 'al',

            searchvalue : ''
        }

    },

    created : () => {

    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        active : function(){
			return this.$route.query[this.navkey] || this.navdefault
		},
        auth : state => state.auth,
    }),

    methods : {
        search : function(v){
            this.searchvalue = v
        },

        selected : function(asset){

            this.$store.commit('globalpreloader', true)

            this.core.api.pctapi.stress.annuities.list().then(result => {

                var structured = _.find(result, (a) => {
                    return a.ticker == asset.ticker
                })

                this.$emit('selected', structured || asset)
                this.$emit('close')

            }).finally(() => {
                this.$store.commit('globalpreloader', false)
            })

        }
    },
}