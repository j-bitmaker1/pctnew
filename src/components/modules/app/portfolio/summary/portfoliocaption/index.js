import { mapState } from 'vuex';
import portfoliomenu from '@/components/modules/app/portfolio/menu/index.vue'
import client from  '@/components/modules/app/portfolio/client/index.vue'

export default {
    name: 'summary_portfoliocaption',
    props: {
        portfolio : Object,
        profile : Object,
    },

    components : {
        portfoliomenu, client
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
        changeClient : function(profile){
            this.$emit('changeclient', profile)
        },
        editportfolio : function(){
            this.$emit('editportfolio')
        },
        deleteportfolio : function(){
            this.$emit('deleteportfolio')
        },

        openclient : function(){
            this.core.vueapi.openlead({
				leadid : this.profile.ID
			}, {

			})
        }
    },
}