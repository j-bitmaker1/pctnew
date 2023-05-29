import { mapState } from 'vuex';

export default {
    name: 'ai_history',
    props: {
    },

    data : function(){

        return {
            loading : false,
            history : []
        }

    },

    created () {
        this.get()
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
    }),

    methods : {
        selectchat : function(chat){
            this.$emit('selectchat', chat)
        },

        get : function(){
            this.loading = true
            this.core.api.ai_chats.list().then(history => {
                this.history = history
            }).finally(() => {
                this.loading = false
            })
        }
    },
}