import { mapState } from 'vuex';
import f from "@/application/functions.js";
export default {
    name: 'share',
    props: {
        url : String
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
    }),

    methods : {
        sharelink : function(e){
            this.nativeshare(e)
        },

        nativeshare : function(e){

            e.target.blur();

            var plugin = f.deep(window, 'plugins.socialsharing')

            if(!plugin){

             

                this.$store.commit('icon', {
                    icon : 'error',
                    message : "Socialsharing plugin hasn't exist"
                })

                return
            }

            plugin.shareWithOptions({

                message: ed.sharing.text.body || '', 
                subject: ed.sharing.text.title || '',
                images : ed.sharing.images || [],
                url: ed.url

            }, () => {

               this.$emit('close')

            }, function(){

            });
        },

        copylink : function(){
            f.copytext(this.url || '')

            this.$store.commit('icon', {
                icon : 'success',
                message : "Link copied to clipboard"
            })

            this.$emit('close')
        }
    },
}