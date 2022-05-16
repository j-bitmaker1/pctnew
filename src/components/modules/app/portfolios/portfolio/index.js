import _ from 'underscore';
import { mapState } from 'vuex';
import portfoliomenu from '@/components/modules/app/portfolio/menu/index.vue'
export default {
    name: 'portfolios_portfolio',
    props: {
        portfolio : Object
    },

    components : {
        portfoliomenu
    },

    data : function(){

        return {
            loading : false,
           
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
            this.$emit('click', this.portfolio)
        },

        editportfolio : function(){
            
           this.$emit('editportfolio', this.portfolio)

        },

        deleteportfolio : function(){

            this.$emit('deleteportfolio', this.portfolio)
            
        }
    },
}