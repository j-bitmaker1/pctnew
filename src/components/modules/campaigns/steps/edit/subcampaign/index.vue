<template>
<div id="campaigns_steps_edit_subcampaign">

	<div class="descriptionCaption">
		<span>Descrtiption</span>
	</div>
	<div class="description mobp">
		<span>This campaign step sends a notification with the text you entered to your phone.</span>
	</div>

	<emails :select="true" :selected="step.subcampaign" @select="select"/>

	<div class="stickerWrapper">
		<sticker src="route.png" :width="128"/>
	</div>
	

</div>
</template>

<style scoped lang="sass">

</style>

<script>
import {
	mapState
} from 'vuex';

import emails from '../../../templates/index.vue'

export default {
	name: 'campaigns_steps_edit_subcampaign',
	props: {
		step: Object
	},

	components : {
		emails
	},

	computed: mapState({
		auth: state => state.auth
	}),

	data : function(){
		return {
		}
	},

	created : function(){
	},

	methods: {
	
		select : function(template){
			this.change(template.Id)
		},
		change : function(template){
			var clone = this.step.clone()

			clone.subcampaign = template


			this.$emit('change', clone)
		}
	},
}
</script>
