<template>
<div id="campaigns_steps_edit">
    <component @change="change" :is="type" :step="clone || step" :steps="steps"/>

	<div class="savePanel">
		<button class="button black" @click="cancel">
			Cancel
		</button>

		<button class="button" @click="save" :disabled="!haschanges">
			Save
		</button>
	</div>
</div>
</template>

<style scoped lang="sass">

::v-deep
	.mobp
		padding-left: 2 * $r
		padding-right: 2 * $r
		
	.fromWrapper
		padding: 0 2 * $r
	.descriptionCaption
		margin-top: 2 * $r
		padding :  0 2 * $r
		span
			font-size: 0.8em
			font-weight : 700
			color : srgb(--color-txt-ac)
	.stickerWrapper
		text-align: center
		padding : 2 * $r
		margin-top: 2 * $r
		margin-bottom: 2 * $r
	.description
		padding : 2 * $r
		
		margin-bottom: 2 * $r
		span
			font-size: 0.9em

</style>

<script>
import {
	mapState
} from 'vuex';

import notification from './notification/index.vue'
import wait from './wait/index.vue'
import email from './email/index.vue'
import ifstep from './ifstep/index.vue'
import subcampaign from './subcampaign/index.vue'

export default {
	name: 'campaigns_steps_edit_notification',
	props: {
		step: Object,
		type : String,
		steps : Array
	},

	components : {
		notification,
		wait,
		ifstep,
		email,
		subcampaign
	},

	computed: mapState({
		auth: state => state.auth,

		haschanges : function(){
			return this.clone && JSON.stringify(this.step) != JSON.stringify(this.clone)
		}
	}),

	data : function(){
		return {
			clone : null
		}
	},

	created : function(){
		//this.clone = this.step.clone()
	},

	methods: {
		close : function(){
			this.$emit('close')
		},
		cancel : function(){
			this.close()
		},
		save : function(){
			this.$emit('success', this.clone)

			this.close()
		},

		change : function(v){
			this.clone = v
		}
	},
}
</script>
