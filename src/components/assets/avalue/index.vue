<template>
    <span class="value" @click.prevent.stop="action">{{formatted}}</span>
    <!--<a :href="link" v-else>{{formatted}}</a>-->
</template>

<script>
import {
    mapState
} from 'vuex';

import f from '@/application/shared/functions.js'
var EmailValidator = require("email-validator");
import parsePhoneNumber from 'libphonenumber-js'

export default {
    name: 'avalue',
    props: ['value'],
    computed: mapState({
        auth: state => state.auth,

        type : function(){

            console.log("AVALUE", this.value)

            if(this.value){

                if (EmailValidator.validate(this.value)) return 'email'
                
                try{
                    const phoneNumber = parsePhoneNumber(this.value, 'US')
            
                    if (phoneNumber) return 'phone'
                }
                catch(e){

                }
            }

            
        },

        formatted : function(){

            if(this.type == 'phone'){

                const phoneNumber = parsePhoneNumber(this.value, 'US')

                console.log('phoneNumber', phoneNumber)

                return phoneNumber.formatInternational()
            }

            if (this.type == 'email'){
                return this.value
            }

            if(typeof this.value == "number") f.values.format(this.core.user.locale, this.valuemode, this.value)

            return this.value
            
        },

        clean : function(){

            if(this.type == 'phone'){
                const phoneNumber = parsePhoneNumber(this.value, 'US')

                return phoneNumber.number
            }

            return this.value
        },

        link : function(){
            if(this.type == 'phone') return 'tel:' + this.clean
            if(this.type == 'email') return 'mailto:' + this.clean
        }
    }),

    methods: {
        action : function(){
            if(this.type){

                var menu = [
                    {
                        text: 'button.copy',
                        icon: 'fas fa-copy',
                        action : this.copyvalue
                    }
                ]

                if(this.type == 'phone'){
                    menu.push({
                        text: 'button.call',
                        icon: 'fas fa-phone',
                        action : this.defaultLinkAction
                    })
                }

                if(this.type == 'email'){
                    menu.push({
                        text: 'button.sendemail',
                        icon: 'fas fa-at',
                        action : this.defaultLinkAction
                    })
                }

                this.core.vueapi.listmenupromise(menu).catch(e => {})
            }


        },

        copyvalue : function(){
            f.copytext(this.formatted)

            this.$store.commit('icon', {
                icon: 'success',
                message: "Text was copied"
            })
        },

        defaultLinkAction : function(){
            f.openexternallink(this.link)
        }
    },
}
</script>
