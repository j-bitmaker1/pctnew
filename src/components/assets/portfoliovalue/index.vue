<template>
    <value :value="resvalue" :mode="modecomposed" :colored="colored" />
</template>

<script>
import {
    mapState
} from 'vuex';

export default {
    name: 'portfoliovalue',
    props: ['value', 'colored', 'portfolio', 'mode', 'includeuncovered', 'p100'],
    computed: mapState({
        auth: state => state.auth,
        dollars : state => state.dollars,
        resvalue : function(){


            if(!this.portfolio) return this.value

            if (this.dollars == 'p' && !this.portfolio.isModel && this.mode != 'p') {
                return (this.p100 ? 100 : 1) * this.value / (this.portfolio.total() + (this.includeuncovered ? this.portfolio.uncovered() : 0)) * 100
            }

            return (this.p100 ? 100 : 1) * this.value
        },

        modecomposed : function(){
            return this.mode == 'p' ? this.mode : ((this.portfolio && this.portfolio.isModel) || this.dollars == 'p' ? 'p100' : 'd')
        }
    }),

    methods: {

    },
}
</script>
