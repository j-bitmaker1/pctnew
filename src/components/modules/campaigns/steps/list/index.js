import { _ } from 'core-js';
import { mapState } from 'vuex';
import step from '../step/index.vue'

export default {
    name: 'campaignsStepsList',
    props: {
        steps: Array,
        editing: Boolean,
        level: {
            type: Number,
            default: 0
        }
    },

    components: {
        step
    },

    data: function () {

        return {
            loading: false,
            templates: {}
        }

    },

    created() {
        console.log(this.steps)
    },

    watch: {
    },
    computed: mapState({
        auth: state => state.auth,
    }),

    methods: {
        refer: function (step) {

            var refid = step.while || step.mail

            if (refid){
                return _.find(this.steps, (s) => {
                    return s.id == refid
                })
            }

            return null
        },

        addstep : function(p = {}){

            p.steps = this.steps
            p.level = this.level

            this.core.campaigns.campaignTemplates.addstep(p).catch(e => {
                if(e == 'closed'){

                }
                else{
                    this.store.commit('icon', {
                        icon: 'error',
                        message: e.error
                    })
                }
            })

        }
    },
}