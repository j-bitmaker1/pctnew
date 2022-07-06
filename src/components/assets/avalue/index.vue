<template>
    <span class="value" v-if="!type">{{formatted}}</span>
    <a :href="link" v-else>{{formatted}}</a>
</template>

<script>
import {
    mapState
} from 'vuex';

import f from '@/application/shared/functions.js'
var PhoneValidator = require('rf-phone-validator');
var EmailValidator = require("email-validator");

export default {
    name: 'avalue',
    props: ['value'],
    computed: mapState({
        auth: state => state.auth,

        type : function(){
            var pv = new PhoneValidator(this.value);

            if (pv.valid()) return 'phone'

            if (EmailValidator.validate(this.value)) return 'email'
        },

        formatted : function(){

            if(this.type == 'phone'){
                var pv = new PhoneValidator(this.value);

                return pv.format()
            }

            if (this.type == 'email'){
                return this.value
            }

            if(typeof this.value == "number") f.values.format(this.core.user.locale, this.valuemode, this.value)

            return this.value
            
        },

        clean : function(){

            if(this.type == 'phone'){
                var pv = new PhoneValidator(this.value);

                return pv.clean()
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

            }
        }
    },
}
</script>
