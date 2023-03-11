<template>
    <value :value="resvalue" :mode="mode == 'p' ? mode : ((portfolio && portfolio.isModel) || dollars == 'p' ? 'p100' : 'd')" :colored="colored" />
</template>

<script>
import {
    mapState
} from 'vuex';

export default {
    name: 'portfoliovalue',
    props: ['value', 'colored', 'portfolio', 'mode'],
    computed: mapState({
        auth: state => state.auth,
        dollars : state => state.dollars,
        resvalue : function(){

            console.log('this.portfolio', this.portfolio)

            if(!this.portfolio) return this.value

            if(this.dollars == 'p' && !this.portfolio.isModel && this.mode != 'p') {
                return this.value / (this.portfolio.total() + this.portfolio.uncovered()) * 100
            }

            return this.value
        }
    }),

    methods: {

    },
}
</script>
