<template>
<div id="riscscore_capacity">

	<div class="stepcaption">
        <span>Based on the past stock market history you need to assume the following level of risk or increase the savings as shown below to achieve your retirement goal.</span>
    </div>

    <div class="stepsubcaption">
        <span> We used this past market history (Monte Carlo Simulation) to predict the probability of your retirement goal success</span>
    </div>

	<capacity :initial="values"/>
</div>
</template>

<style scoped lang="sass">

</style>

<script>
import {
	mapState
} from 'vuex';

import capacity from "@/components/modules/app/client/capacity/index.vue"

export default {
	name: 'riscscore_capacity',
	props: {
		values: {
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

	},
}
</script>
