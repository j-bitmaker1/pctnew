<template>
<div class="timezonepicker">
    <select class="custom" v-model="value">
        <option :value="v" v-for="v in values" :key="v">{{v}}</option>
    </select>
</div>
</template>

<style scoped lang="sass">

</style>

<script>
import {
    mapState
} from 'vuex';

import moment from 'moment-timezone'

export default {
    name: 'timezonepicker',
    model: {
        prop: 'modelValue',
        event: 'update:modelValue'
    },

    props: {
        modelValue: [String],
    },
    emits: ['update:modelValue'],
    computed: {
		value: {
            get() {
	
                return this.modelValue
            },
            set(value) {
				console.log('value', value)
                this.$emit('update:modelValue', value)
            }
        },

		...mapState({
			auth: state => state.auth,

			values : function(){
				return moment.tz.names()
				return moment.tz.zonesForCountry('US')
			}
		})
	},

    methods: {
        
    },
}
</script>
