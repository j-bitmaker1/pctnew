<template>
<div class="slider customslider">
    <div class="sheader">

        <div class="name">
            <span>{{name}}</span>
        </div>

        <div class="value">
            <input type="Number" v-model="value"/>
        </div>

    </div>

    <div class="inputwrapper">
        <vue-slider :lazy="true" v-model="value" v-bind="options" />
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
        value: {
            get() {
                return this.modelValue
            },
            set(value) {

                if(this.options.min) value = Math.max(value, this.options.min)
                if(this.options.max) value = Math.min(value, this.options.max)

                this.$emit('update:modelValue', value)
            }
        }
    },

    
}
</script>
