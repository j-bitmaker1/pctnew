import { mapState } from 'vuex';

import portfoliolist from '@/components/modules/app/portfolios/list/index.vue'

export default {
    name: 'client_portfolios',
    props: {
    },

    components : {
        portfoliolist, 
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

        payload : function(){
            return {
                crmContactIdFilter : 1
            }
        }
    }),

    methods : {
        create : function(){
            this.$store.commit('OPEN_MODAL', {
                id : 'modal_portfolios_edit',
                module : "portfolio_edit",
                caption : "New Portfolio For Client",

                data : {
                    payload : {}
                }
            })
        },

        select : function(){

            this.$store.commit('OPEN_MODAL', {
                id : 'modal_portfolios_main',
                module : "portfolios_main",
                caption : "Select Portfolios For Client",

                data : {
                    
                    select : {
                        actions : [{
                            text : 'labels.setportfoliostoclient',
                            icon : 'fas fa-check',
                            action : 'setportfoliostoclient'
                        }]
                    },

                    additional : {}
                },

                events : {
                    selected : function(portfolios){
                    }
                }
            })
            
        }
    },
}