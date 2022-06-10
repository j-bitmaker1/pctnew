import { mapState } from 'vuex';

export default {
    name: 'client_questionnaire',
    props: {
        result : Object,
        wnd : Boolean
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
        schema : function(){

            return {
                questions : this.core.pct.riskscore.questions(),
                capacity : this.core.pct.riskscore.capacityQuestions(),
            }
        }
    }),

    methods : {
        
    },
}