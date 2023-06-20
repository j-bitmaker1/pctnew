import { mapState } from 'vuex';
import f from "@/application/shared/functions.js"
import filepreview from "@/components/common/filemanager/pages/list/file/byid.vue"
export default {
    name: 'ai_event',
    props: {
        event : Object,
        rendered : Boolean,
        firstName : String,
        lastName : String,
        eventsinaction : Object,

        willremoving : Boolean,
        removing : Boolean,
        removed : Boolean,
        height : Number

    },

    components : {
        filepreview
    },

    data : function(){

        return {
            loading : false,
            showedallanswers : false,
            thumbs : 0
        }

    },

    created : () => {

    },

    watch: {
        thumbs : function(){
            if (this.event.data.requestId){
                this.core.api.ai_chats.rate(this.event.data.requestId, this.thumbs).then(() => {}).catch(e => {
                    console.error(e)
                })
            }
            
        }
    },
    computed: mapState({
        auth : state => state.auth,
        itisfile : function(){
            return (this.event.data.message || "").indexOf('rxfile:') > -1
        },
        fileid : function(){
        
            return (this.event.data.message || "").replace('rxfile:', '')
        }
    }),

    methods : {
        convertNewLinesToBr : f.convertNewLinesToBr,

        showmore : function(){
            this.showedallanswers = true
        },

        clickanswer : function(text, event){
            this.$emit('answer', {text, event})
        },

        getheight : function(){
            return this.$refs['evnt'].offsetHeight
        },

        copymessage : function(){
            f.copyTextToClipboard(this.event.data.message)

            this.core.sitemessage('Text was copied')
        },

        copycode : function(){
            f.copyTextToClipboard(f.convertNewLinesToBr(this.event.data.html))

            this.core.sitemessage('Code was copied')

        },

        deletefile : function(){
            

            return this.$dialog.confirm(
                "Are you sure you don't want to use this attachment in a chat?", {
                okText: 'Yes',
                cancelText : 'Cancel'
            })
    
            .then((dialog) => {

                this.$emit('deletefile', this.event.data.message)

            }).catch( e => {
                
            })
        },

        expandhtmlresult : function(){
            this.core.vueapi.htmlpage(this.event.data.html)
        },

        thumbsup : function(){
            this.thumbs = 1

            
            //if(!this.event.data.requestId) return
        },

        thumbsdown : function(){
            this.thumbs = -1

            //if(!this.event.data.requestId) return

        },
    },
}