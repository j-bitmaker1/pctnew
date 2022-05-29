import { mapState } from 'vuex';

export default {
    name: 'filemanager_asset',
    props: {
        asset : Object
    },

    data : function(){

        return {
            loading : false
        }

    },

    created : () => {

    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
    }),

    methods : {
        searchAssets : function(){
            this.core.vueapi.searchAssets((a) => {
                console.log("AAA", a)
            })
        }
    },
}