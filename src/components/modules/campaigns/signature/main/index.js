import { mapState } from 'vuex';

import f from "@/application/shared/functions.js"

import htmleditor from '@/components/common/htmleditor/index.vue'
//import { Signature } from '../../../../../application/campaigns/kit';

export default {
    name: 'signature_main',
    props: {
        signature : Object
    },

    components : {
        htmleditor
    },
    data : function(){

        return {
            prev : '',
            name : '',
            body : ''
        }

    },

    created() {
        this.name = this.signature.Name || ""
        this.body = this.signature.Html || ""

        console.log('this.signature', this.signature)
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        valid : function(){

            if(this.name && this.body) return true

            return false
        },
        haschanges : function(){
            return this.name != this.signature.Name || 
                this.body != this.signature.Html
        },
        auth : state => state.auth
    }),

    methods : {

        save : function(){

            var promise = null

            var sig = this.signature.clone()

            sig.Name = this.name
            sig.Html = this.body
            sig.Json = ""
            sig.Type = "html"

            //console.log('sig', sig, sig.export(), new Signature(sig.export()))

            //return

            if (this.signature.Id){
                promise = this.core.campaigns.updateSignature(sig)
            }
            else{

                sig.Id = f.makeid()

                console.log("sig", sig)

                promise = this.core.campaigns.createSignature(sig).then(r => {
                    this.$router.replace('/signature/' + r.Id).catch(e => {})
                })
            }

            
        },
        cancel : function(){

            if(!this.haschanges){

                this.close()
                return
            }

            return this.$dialog.confirm(
                this.$t('campaigns.labels.signatureCancel'), {
                okText: this.$t('yes'),
                cancelText : this.$t('no')
            })
    
            .then((dialog) => {

                this.name = this.signature.Name
                this.body = this.signature.Body

            })
            
        },

        close : function(){
            this.$emit('close')
        },
    },
}