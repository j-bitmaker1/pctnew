import { mapState } from 'vuex';

import portfolioRetrospective from "@/components/modules/app/portfolio/retrospective/index.vue"


export default {
    name: 'compare_retrospective',
    props: {
        ids : Array
    },

    components : {
        portfolioRetrospective
        
    },

    data : function(){

        return {
            loading : false,
            portfolios : [],
            
        }

    },

    created (){
        this.load()
    },

    watch: {
        ids : {
            immediate : true,
            handler : function(){
                this.load()
            }
        }
    },
    computed: mapState({
        auth : state => state.auth,

        

    }),

    methods : {
        
        load : function(){

            this.loading = true

            this.core.api.pctapi.portfolios.gets(this.ids).then(r => {

                this.portfolios = r
                
            }).finally(() => {
                this.loading = false
            })
            
        },

        selectone : function(id){
            this.$emit('selectone', id)
        },

        removeitem : function(id){
            this.$emit('removeitem', id)
        }

        
    },
}