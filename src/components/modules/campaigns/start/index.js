import { mapState } from 'vuex';
import preview from '../template/preview/index.vue';
export default {
    name: 'campaigns_start',
    props: {
    },

    components : {
        preview
    },

    data : function(){

        return {
            loading : false,

            template : null,
            list : null
        }

    },

    created : () => {

    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
        valid : function(){
            return false
        }
    }),

    methods : {
        start : function(){},
        cancel : function(){
            this.$emit('close')
        },

        selecttemplate : function(){
            console.log("AS")
            this.core.campaigns.selectTemplate(this.template ? this.template.Id : null).then(t => {
                console.log("T", t)

                this.template = t
            }).catch(e => {
                console.error(e)
            })
        },

        selectcontacts : function(){
            this.core.vueapi.selectClients()
        }
    },
}