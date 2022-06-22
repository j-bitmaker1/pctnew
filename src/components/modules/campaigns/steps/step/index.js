import { mapState } from 'vuex';
import smenu from '../menu/index.vue'

import email from './email/index.vue'
import wait from './wait/index.vue'
import notify from './notify/index.vue'
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
        notify,
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

            var type = null

            this.step.Type == "SEND" ? type = 'email' : null
            this.step.Type == "WAIT" ? type = 'wait' : null
            this.step.Type == "NOTIFY" ? type = 'notify' : null
            this.step.Type == "IF" ? type = 'ifstep' : null
            this.step.Type == "FINISH" ? type = 'finish' : null
            this.step.Type == "WHILE" ? type = 'whilestep' : null
            

            return type
        },

        
    }),

    methods : {
        
    },
}