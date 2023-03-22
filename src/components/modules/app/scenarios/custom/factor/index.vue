<template>
<div class="scenarios_custom_factor">
	<div class="info">
		<div class="name">
			<span>{{factor.name}}</span>
		</div>
		<div class="tv">
			<div class="type">
				<span>{{factor.type}}</span> <i v-if="factor.key" title="Key Factor" class="fas fa-certificate"></i>
			</div>

			<div class="volatility">
				<div class="label">
					<span>Volatility</span>
				</div>
				<div class="value">
					<value :value="factor.volatility / 100" mode="p"/>
				</div>
			</div>
		</div>

		<div class="sliderWrapper">
			<slider v-model="value" :name="name" :options="sliderOptions"/>
		</div>
	</div>
</div>
</template>

<style scoped lang="sass" src="./index.sass"></style>

<script>
import {
	mapState
} from 'vuex';

import slider from '@/components/assets/slider/index.vue'

export default {
	name: 'scenarios_custom_factor',
	props: {
		factor: Object
	},
	computed: {

		sliderOptions : function(){

			return {
				min : this.factor.min,
				max : this.factor.max,
				interval : 0.1,
				type : Number,
			}
		},

		value : {
			get() {
				return this.factor.value
			},
			set(value) {
				this.$emit('changed', value)
			}
		}
	},
	data : function(){
		return {
			
			name : "Loss",
			mode : '',
			
		}
	},
	components : {slider},
	methods: {

	},
}
</script>
