import { mapState } from 'vuex';

import f from "@/application/shared/functions.js"

import htmleditor from '@/components/common/htmleditor/index.vue'

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
        this.body = this.signature.Body || ""

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
                this.body != this.signature.Body
        },
        auth : state => state.auth
    }),

    methods : {

        save : function(){

            var promise = null

            if (this.signature.Id){
                promise = this.core.campaigns.updateSignature({
                    Name : this.name,
                    Body : this.body,
                    Id : this.signature.Id
                })
            }
            else{
                promise = this.core.campaigns.createSignature({
                    Name : this.name,
                    Body : this.body
                }).then(r => {
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