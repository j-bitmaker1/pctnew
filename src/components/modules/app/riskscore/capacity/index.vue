<template>
<div id="riscscore_capacity">

	<div class="stepcaption">
        <span>Based on the past stock market history you need to assume the following level of risk or increase the savings as shown below to achieve your retirement goal.</span>
    </div>

    <div class="stepsubcaption">
        <span> We used this past market history (Monte Carlo Simulation) to predict the probability of your retirement goal success</span>
    </div>

	<capacity @change="change" :initial="initial"/>
</div>
</template>

<style scoped lang="sass">

</style>

<script>
import {
	mapState
} from 'vuex';

import capacity from "@/components/modules/app/features/capacity/index.vue"

export default {
	name: 'riscscore_capacity',
	props: {
		initial: {
			type : Object,
			default : () => {
				return {}
			}
		}
	},
	components : {
		capacity
	},
	computed: mapState({
		auth: state => state.auth,
	}),

	methods: {
		change : function(capacity){
			console.log('ch', capacity)
			this.$emit('change', capacity)
		}
	},
}
</script>
