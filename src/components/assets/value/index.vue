<template>
<span class="value">
    {{formatted}}
</span>
</template>

<script>
import {
    mapState
} from 'vuex';

export default {
    name: 'value',
    props: ['value', 'mode'],
    computed: mapState({
        auth: state => state.auth,
        valuemode : function(state){

            if(!this.mode) return null

            if(this.mode == 'auto')

                return state.valuemode

            return this.mode
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
