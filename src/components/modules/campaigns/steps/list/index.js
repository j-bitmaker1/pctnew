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
        },
        campaign : Object
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

            this.core.campaigns.campaignTemplates.addstep(p).then((step) => {

                var cloned = this.core.campaigns.campaignTemplates.clonelist(this.steps)

                if (p.after){
                    var i = _.findIndex(cloned, (c) => {return c.id == p.after.id})


                    if (i > -1){
                        cloned.splice(i + 1, 0, step)
                    }
                }
                else{
                    cloned.unshift(step)
                }


                this.change(cloned)

            }).catch(e => {
                if(e == 'closed'){

                }
                else{
                    this.$store.commit('icon', {
                        icon: 'error',
                        message: e.error
                    })
                }
            })

        },

        change : function(v){
            this.$emit('change', v)
        },

        changeStep : function(step){
            var cloned = this.core.campaigns.campaignTemplates.clonelist(this.steps) 
            var i = _.findIndex(cloned, (c) => {return c.id == step.id})

            if (i > -1){
                cloned[i] = step
            }

            this.change(cloned)
        },

        editStep : function(step){

            var p = {}

            p.steps = this.steps
            p.level = this.level

            this.core.campaigns.campaignTemplates.editstep(step, p).then(clone => {
                this.changeStep(clone)
            }).catch(e => {
                
            })
        },

        removeStep : function(step){
            var cloned = this.core.campaigns.campaignTemplates.clonelist(this.steps)

            cloned = _.filter(this.steps, (s) => {
                return s.id != step.id
            })

            this.change(cloned)
        }
    },
}