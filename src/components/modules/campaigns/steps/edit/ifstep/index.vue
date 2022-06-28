<template>
<div id="campaigns_steps_edit_ifstep">

	<div class="descriptionCaption">
		<span>Descrtiption</span>
	</div>
	<div class="description mobp">
		<span>This step causes the campaign to go one of two ways depending on whether the letter is due or not.</span>
	</div>

	<div class="descriptionCaption">
		<span>Select emails from list</span>
	</div>

	<selectemeails :steps="steps" @select="select" :selected="step.mail"/>

	<div class="stickerWrapper">
		<sticker src="signboard.png" :width="128"/>
	</div>
	

</div>
</template>

<style scoped lang="sass">

</style>

<script>

import selectemeails from '../../selectemails/index.vue'
import {
	mapState
} from 'vuex';

export default {
	name: 'campaigns_steps_edit_ifstep',
	props: {
		step: Object,
		steps : Array
	},

	components : {
		selectemeails
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
		select : function(step){
			this.change(step.id)
		},
		change : function(mail){
			var clone = this.step.clone()

			if(!clone.success) clone.success = []
			if(!clone.fail) clone.fail = []
			if(!clone.if) clone.if = 'readed'

			clone.mail = mail

			this.$emit('change', clone)
		}
	},
}
</script>
