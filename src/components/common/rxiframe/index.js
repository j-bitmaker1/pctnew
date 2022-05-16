import { mapState } from 'vuex';

export default {
    name: 'rxiframe',
    props: {
    },

    data : function(){

        return {
            loading : true
        }

    },

    beforeDestroy(){
        window.removeEventListener('message', this.receiveHiddenMessage)
    },

    created(){
        window.addEventListener('message', this.receiveHiddenMessage)
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
        src : function(){
            //return 'https://localhost/techmarket-helper/index.html?appstore=true&first=true'
            return 'https://rixtrema.net/techmarket-helper/index.html?appstore=true&first=true'
        }
    }),

    methods : {
        receiveHiddenMessage : function(message){

            if(this.src.indexOf(message.origin) == -1) return

            const {created, appstore, hideFirst} = message.data;

            if(appstore && hideFirst){
                window.removeEventListener('message', this.receiveHiddenMessage);
        
                this.loading = false

                return
            }

            if (created){

                this.core.user.extendA({
                    data : {
                        appstore : true
                    },
                    system : 'pct'
                }).then(({data}) => {

                    if (this.$refs['hiddenrxcom']){
                        

                        data.token = data.Token
                        delete data.Token

                        this.$refs['hiddenrxcom'].contentWindow.postMessage(data, '*')
                    }

                })

                return

            }

            
        },
        onLoadHidden : function(){

        }
    },
}