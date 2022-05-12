<template>
<span class="value" :style="{color : color}">
    {{formatted}}
</span>
</template>

<script>
import {
    mapState
} from 'vuex';

export default {
    name: 'value',
    props: ['value', 'mode', 'colored'],
    computed: mapState({
        auth: state => state.auth,
        currentStyles : state => state.currentStyles,
        valuemode : function(state){

            if(!this.mode) return null

            if(this.mode == 'auto')

                return state.valuemode

            return this.mode
        },

        color : function(){

            if (this.colored){

                return this.$store.getters.colorByValue(this.value)
            }

        },

        formatted : function(){

            var locale = 'en-US'

            if(!this.valuemode) 
                return new Intl.NumberFormat(locale).format(this.value)

            if(this.valuemode == 'd') 
                return new Intl.NumberFormat(locale, { 
                    
                    style: 'currency', 
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2

                }).format(this.value)

            if(this.valuemode == 'p') 
                return new Intl.NumberFormat(locale, { 

                    style: 'percent', 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2

                }).format(this.value)

         
            return this.value
        }
    }),

    methods: {

    },
}
</script>
