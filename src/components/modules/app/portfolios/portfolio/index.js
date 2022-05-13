import _ from 'underscore';
import { mapState } from 'vuex';

export default {
    name: 'portfolios_portfolio',
    props: {
        portfolio : Object
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
        total : function(){
            return _.reduce(this.portfolio.positions, (m, p) => {
                return m + p.value
            }, 0)
        }
    }),

    methods : {
        menu : function(e){

            return false
        },

        click : function(){
            this.$emit('click')
        }
    },
}