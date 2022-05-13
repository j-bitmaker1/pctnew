import _ from 'underscore';
import { mapState } from 'vuex';

export default {
    name: 'portfolios_portfolio',
    props: {
        portfolio : Object
    },

    data : function(){

        return {
            loading : false,
            menu : [
                {
                    text : 'labels.editportfolio',
                    icon : 'fas fa-pen',
                    action : 'edit'
                },
                {
                    text : 'labels.deleteportfolio',
                    icon : 'fas fa-trash',
                    action : 'delete'

                }
            ]
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
        }
    }),

    methods : {

        click : function(){
            this.$emit('click')
        },

        menuaction : function(action){
            if (this[action]){
                this[action]()
            }   
        },

        edit : function(){
            
            this.$store.commit('OPEN_MODAL', {
                id : 'modal_portfolio_edit',
                module : "portfolio_edit",
                caption : "Edit Portfolio",
                data : {
                    edit : {
                        name : this.portfolio.name,
                        assets : this.portfolio.positions,
                        id : this.portfolio.id
                    }
                }
            })

        },

        delete : function(){
            console.log("ASAS2")
        }
    },
}