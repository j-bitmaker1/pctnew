import { mapState } from 'vuex';

export default {
    name: 'masterpanel',
    props: {
        status : Object
    },

    data : function(){

        return {
            loading : false,
            client : null,
            portfolio : null
        }

    },

    created : () => {

    },

    watch: {
        status : function(){
            if (this.status.context.portfolio){
                this.core.api.pctapi.portfolios.get(this.status.context.portfolio).then(r => {
                    this.portfolio = r
                }).catch(e => {
                    this.portfolio = null
                })
            }

            if(this.status.context.client){
                this.core.api.crm.contacts.gets({Ids : [this.status.context.client]}).then(c => {
                    this.client = c[0]
                    console.log('this.client', this.client)
                }).catch(e => {
                    this.client = null
                })
            }
        }
    },
    computed: mapState({
        auth : state => state.auth,
    }),

    methods : {
        change : function(type, data){
            this.$emit('change', {type, data})
        },

        startover : function(){
            this.$emit('startover')
        }
    },
}