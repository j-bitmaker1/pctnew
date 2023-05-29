import { mapState } from 'vuex';
import f from "@/application/shared/functions.js"

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

    data : function(){

        return {
            loading : false,
            showedallanswers : false
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
            f.copyTextToClipboard(f.convertNewLinesToBr(this.event.data.message))

            this.core.sitemessage('Text was copied')
        },

        copycode : function(){
            f.copyTextToClipboard(f.convertNewLinesToBr(this.event.data.html))

            this.core.sitemessage('Code was copied')

        },

        expandhtmlresult : function(){
            this.core.vueapi.htmlpage(this.event.data.html)
        }
    },
}