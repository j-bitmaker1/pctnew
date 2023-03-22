import { mapState } from 'vuex';
import infotable from '../infotable/index.vue'

export default {
    name: 'comparewith_structureinfo',
    props: {
        annuity : Object,
        weight : Number,
        mode : String
    },
    components : {
        infotable
    },

    data : function(){

        return {
            loading : false,

            fields : [
                {
                    id : 'term',
                    type : 'string'
                },
                {
                    id : 'margin_spread',
                    type : 'p'
                },
                {
                    id : 'participation_guarantee',
                    type : 'p'
                },
                {
                    id : 'guaranteed_principal',
                    type : 'p'
                },
                /*{
                    id : 'withdrawal_starting_date',
                    type : 'date'
                },*/
                {
                    id : 'guaranteed_income',
                    type : 'p'
                },
                /*{
                    id : 'start_date_principal_guarantee',
                    type : 'date'
                },*/
                /*{
                    id : 'annuity_type',
                    type : 'string'
                },*/
                
                {
                    id : 'stepup_rate',
                    type : 'p'
                },
                {
                    id : 'death_benefit',
                    type : 'p'
                },
                {
                    id : 'buffer',
                    type : 'p'
                },
                {
                    id : 'upside_max',
                    type : 'p'
                },
                {
                    id : 'downside_max',
                    type : 'p'
                },
                {
                    id : 'barrier',
                    type : 'p'
                },
                {
                    id : 'coupon',
                    type : 'p'
                },
                {
                    id : 'enhancement',
                    type : 'p'
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
    }),

    methods : {
        
    },
}