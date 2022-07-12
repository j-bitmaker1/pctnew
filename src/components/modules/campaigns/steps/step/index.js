import { mapState } from 'vuex';
import smenu from '../menu/index.vue'

import email from './email/index.vue'
import wait from './wait/index.vue'
import notification from './notification/index.vue'
import finish from './finish/index.vue'
import start from './start/index.vue'
import ifstep from './ifstep/index.vue'
import subcampaign from './subcampaign/index.vue'
import whilestep from './whilestep/index.vue'
import lead from './lead/index.vue'

export default {
    name: 'campaigns_step',
    props: {
        step : Object,
        editing : Boolean,
        level : Number,
        refer : Object,
        campaign : Object
    },

    components : {
        smenu,
        email,
        wait,
        notification,
        finish,
        ifstep,
        whilestep,
        lead,
        subcampaign,
        start
    },

    data : function(){

        return {
            loading : false
        }

    },

    created(){
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,

        component : function(){

            return this.step.type() || ''

        },

        
    }),

    methods : {
        change : function(v){
            this.$emit('change', v)
        },

        edit : function(){
            this.$emit('editStep')
        },

        remove : function(){
            this.$emit('removeStep')
        }
    },
}