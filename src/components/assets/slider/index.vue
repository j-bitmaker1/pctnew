<template>
<div class="slider customslider">
    <div class="sheader">

        <div class="name">
            <span>{{name}}</span>
        </div>

        <div class="value" v-if="!isarray">
            <input type="number" @change="e => value = e.target.value" :value="value"/>
        </div>

        <div class="values" v-if="isarray">
            <div class="value">
                <input type="number" @change="e => valuemin = e.target.value" :value="valuemin"/>
            </div>

            <div class="divider">
                <span>&mdash;</span>
            </div>

            <div class="value">
                <input type="number" @change="e => valuemax = e.target.value" :value="valuemax"/>
            </div>
        </div>

    </div>

    <div class="inputwrapper">
        <vue-slider :lazy="true" v-model="valuear" v-bind="options" v-if="isarray"/>
        <vue-slider :lazy="true" v-model="value" v-bind="options" v-if="!isarray"/>
    </div>

    <div class="minmax">
        <div class="min">
            <value :value="options.min" :mode="mode" />
        </div>
        <div class="max">
            <value :value="options.max" :mode="mode" />
        </div>
    </div>

</div>
</template>

<style scoped lang="sass">


</style>

<script>

import VueSlider from 'vue-slider-component'

var clearvalue = function(v){
    return v.replace ? (v.replace(/[^0-9]/g,"") || 0) : v
}



export default {
    name: 'slider',
    model: {
        prop: 'modelValue',
        event: 'update:modelValue'
    },
    props: {
        options: {
            type: Object,
            default: () => {
                return {}
            }
        },
        modelValue: [Number, Array],
        name: String,
        mode: String,

    },

    components: {
        VueSlider
    },

    emits: ['update:modelValue'],

    computed: {
        isarray : function(){
            return _.isArray(this.modelValue)
        },
        value: {
            get() {
                return this.modelValue
            },
            set(value) {
                value = clearvalue(value)

                if(this.options.min) value = Math.max(value, this.options.min)
                if(this.options.max) value = Math.min(value, this.options.max)

                this.$emit('update:modelValue', value)
            }
        },

        valuear: {
            get() {
                return this.modelValue
            },
            set(value) {
                value = [clearvalue(value[0]), clearvalue(value[1])]

                _.each(value, (v, i) => {
                    value[i] = this.check(v)
                })

                console.log('value', value)

                this.$emit('update:modelValue', value)
            }
        },

        valuemin: {
            get() {
                return this.modelValue[0]
            },
            set(value) {
                console.log('value2', value) 

                value = this.check(value)


                this.$emit('update:modelValue', [value, this.modelValue[1]])

            }
        },

        valuemax: {
            get() {
                return this.modelValue[1]
            },
            set(value) {

                value = this.check(value)

                this.$emit('update:modelValue', [this.modelValue[0], value])
            }
        },
    },

    methods : {
        check : function(v){


            console.log("VVV2", v)

            v = clearvalue(v)

            console.log("VVV", v)

            if(this.options.min) v = Math.max(v, this.options.min)
            if(this.options.max) v = Math.min(v, this.options.max)

            return v
        }
    }

    
}
</script>
