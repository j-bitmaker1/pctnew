<template>
<span class="value" :style="{color : color}">{{formatted}}</span>
</template>

<script>
import {
    mapState
} from 'vuex';

import f from '@/application/shared/functions.js'

export default {
    name: 'value',
    props: ['value', 'mode', 'colored'],
    computed: mapState({
        auth: state => state.auth,
        currentStyles : state => state.currentStyles,
        valuemode : function(state){

            if(!this.mode) return null

            if (this.mode == 'auto') return state.valuemode

            return this.mode
        },

        color : function(){

            if (this.colored){

                return this.$store.getters.colorByValue(this.value)
            }

        },

        formatted : function(){

            if(this.mode == 'string') return this.value

            return f.values.format(this.core.user.locale, this.valuemode, this.value)
            
        }
    }),

    methods: {

    },
}
</script>
