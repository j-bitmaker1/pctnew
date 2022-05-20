<template>
<div id="riskscore_risk">

    <div class="stepcaption">
        <span>Below is your risk profile based on your answers.</span>
    </div>

    <div class="stepsubcaption">
        <span>If you're satisfied with your risk and return profile, please click Next. If you disagree, move the sliders to the acceptable loss or gain. Investing requires accepting risk.</span>
    </div>

    <risk :target="target" @change="change"/>
</div>
</template>

<style scoped lang="sass">

</style>

<script>
import {
    mapState
} from 'vuex';

import risk from "@/components/modules/app/features/risk/index.vue"

export default {
    name: 'riscscore_capacity',
    props: {
        points: Number
    },
    components : {
        risk
    },
	data : function(){
		return {
			value : null
		}
	},
    computed: mapState({
        auth: state => state.auth,

		target : function(){

            console.log("this.questionPoints", this.points)

			return this.value || this.points || 0
		},

    }),

    methods: {
        change : function(value){
            this.value = value

            this.$emit('change', this.value)
        }
    },
}
</script>
