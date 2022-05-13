import { mapState } from 'vuex';
import assets from '@/components/modules/app/assets/list/index.vue'

export default {
    name: 'portfolios_assets',
    props: {
        assets : Array
    },

    components : {
        assets
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
        edit : function(){
            this.$store.commit('OPEN_MODAL', {
                id : 'modal_portfolios_edit',
                module : "portfolios_edit",
                caption : "Edit Portfolio",
                data : {
                    edit : this.assets
                }
            })
        }
    },
}