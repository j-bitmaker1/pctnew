<template>
<div id="campaigns_steps_edit_email">

	<div class="descriptionCaption">
		<span>Descrtiption</span>
	</div>
	<div class="description mobp">
		<span>This step sends an email to the recipient of the campaign.</span>
	</div>

	<emails :select="true" :selected="step.template" @select="select"/>

	<div class="stickerWrapper">
		<sticker src="email2.png" :width="128"/>
	</div>
	

</div>
</template>

<style scoped lang="sass">

</style>

<script>
import {
	mapState
} from 'vuex';

import emails from '../../../emails/index.vue'

export default {
	name: 'campaigns_steps_edit_notification',
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
			this.change(Number(template.Id))
		},
		change : function(template){
			var clone = this.step.clone()

			clone.template = template

			this.$emit('change', clone)
		}
	},
}
</script>
