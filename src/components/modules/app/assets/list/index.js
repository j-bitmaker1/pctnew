import { mapState } from 'vuex';

import asset from '../asset/index.vue'

export default {
    name: 'assets_list',
    props: {
        assets : Array
    },

    components : {
        asset
    },

    data : function(){

        return {
            loading : false,
            assetsinfo : {}
        }

    },

    created(){

    },

    watch: {
        assets : {
            immediate : true,
            handler : function() {
                this.get()
            }
        }
    },
    computed: mapState({
        auth : state => state.auth,
    }),

    methods : {
        get : function(){
			this.core.pct.assets(this.assets).then(r => {
				this.assetsinfo = r
				return Promise.resolve(r)
			})
		},
    },
}