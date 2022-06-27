<template>
<div id="datepicker">

	<input type="date" :placeholder="options.placeholders ? options.placeholders.from : ''" v-if="range" v-model="rangeValueFrom" :min="fromMin" :max="fromMax"/>

	<input type="date" :placeholder="options.placeholders ? options.placeholders.to : ''" v-if="range" v-model="rangeValueTo" :min="toMin" :max="toMax"/>

    <input type="date" :placeholder="options.placeholder" v-if="!range" v-model="value" :max="fromMin" :min="toMax"/>

</div>
</template>

<style scoped lang="sass">
#datepicker
    display: flex
    grid-gap: $r

input
    height: 40px
    border-radius: 24px
    padding : 0 2 * $r
    background: srgb(--background-secondary-theme)
    flex-grow : 2
</style>

<script>
import {
    mapState
} from 'vuex';

var addZero = function(n){
    if (Number(n) < 10)
    {
        n = "0" + n;
    }

    return n;
}

export default {
    name: 'datepicker',

    model: {
        prop: 'modelValue',
        event: 'update:modelValue'
    },

    props: {
        range : Boolean,
        modelValue: [Date, Array],
		options: {
            type: Object,
            default: () => {
                return {}
            }
        },
    },
    emits: ['update:modelValue'],

    computed: {
        value: {
            get() {
                return this.modelValue ? this.fromdate(this.modelValue) : undefined
            },
            set(value) {

                value = this.toDate(value)

                this.$emit('update:modelValue', value)
            }
        },

        rangeValueFrom : {
            get() {
                return this.modelValue[0] ? this.fromdate(this.modelValue[0]) : undefined
            },
            set(value) {

                value = this.toDate(value)

                var v = [value, this.modelValue[1]]

                this.$emit('update:modelValue', v)
            }
        },

        rangeValueTo : {
            get() {
                return this.modelValue[1] ? this.fromdate(this.modelValue[1]) : undefined
            },
            set(value) {

                value = new Date(value)

                var v = [this.modelValue[0], value]

                this.$emit('update:modelValue', v)
            }
        },

        fromMin : function(){
            return this.options.min ? this.fromdate(this.options.min) : undefined
        },

        fromMax : function(){
            return this.rangeValueTo || this.toMax
        },

        toMin : function(){
            return this.rangeValueFrom || this.fromMin
        },

        toMax : function(){
            return this.options.max ? this.fromdate(this.options.max) : undefined
        },

        ...mapState({
            auth: state => state.auth,
        })
    },

    methods: {
        fromdate : function(date){

            if(!date) return undefined

            return date.getFullYear() + '-' + addZero(date.getMonth() + 1) + '-' + addZero(date.getDate())
        },

        toDate : function(str){

            if(!str) return undefined

            return new Date(str)
        },
    },
}
</script>
