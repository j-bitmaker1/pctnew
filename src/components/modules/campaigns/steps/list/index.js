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
    },

    watch: {
    },
    computed: mapState({
        auth: state => state.auth,
    }),

    methods: {
        refer: function (step) {

            var refid = step.TrackStepId

            if (refid)
                return _.find(this.steps, (s) => {
                    return s.Id == refid
                })

            return null
        }
    },
}