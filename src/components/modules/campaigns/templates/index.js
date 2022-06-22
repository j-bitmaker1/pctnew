import { mapState } from 'vuex';

export default {
    name: 'campaigns_templates',
    props: {
    },

    data : function(){

        return {
            loading : false,
            templates : null
        }

    },

    created() {
        this.load()
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
    }),

    methods : {
        load : function(){
            this.loading = true

            this.core.campaigns.getTemplates().then(r => {
                this.templates = r
            }).finally(() => {
                this.loading = false
            })
        }
    },
}