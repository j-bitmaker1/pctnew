import { mapState } from 'vuex';
import smenu from '../menu/index.vue'

import email from './email/index.vue'
import wait from './wait/index.vue'
import notification from './notification/index.vue'
import finish from './finish/index.vue'
import ifstep from './ifstep/index.vue'
import whilestep from './whilestep/index.vue'

export default {
    name: 'campaigns_step',
    props: {
        step : Object,
        editing : Boolean,
        level : Number,
        refer : Object
    },

    components : {
        smenu,

        email,
        wait,
        notification,
        finish,
        ifstep,
        whilestep
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

        component : function(){

            console.log("this.step.type()", this.step.type(), this.step)
            
            return this.step.type() || ''

        },

        
    }),

    methods : {
        
    },
}