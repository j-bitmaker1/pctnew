<template>
<div id="campaigns_steps_edit_notification">

	<div class="fromWrapper mobp">
		<forms :value="value" @change="changeFields" ref="forms" :fields="fields"/>
	</div>

	<div class="descriptionCaption">
		<span>Descrtiption</span>
	</div>
	<div class="description mobp">
		<span>This campaign step sends a notification with the text you entered to your phone.</span>
	</div>

	<div class="stickerWrapper">
		<sticker src="mail.png" :width="128"/>
	</div>
	

</div>
</template>

<style scoped lang="sass">

</style>

<script>
import {
	mapState
} from 'vuex';

export default {
	name: 'campaigns_steps_edit_notification',
	props: {
		step: Object
	},

	computed: mapState({
		auth: state => state.auth
	}),

	data : function(){
		return {
			value : {},
			fields : [{
				id : 'notification',
				text : 'campaigns.fields.notificationmessage',
				input : 'textarea',
				rules : [{
					rule : 'required'
				}]
			}]
		}
	},

	created : function(){
		this.value.notification = this.step.notification || ""
	},

	methods: {
		changeFields : function(v){
			this.change(v)
		},
		change : function(values){
			var clone = this.step.clone()

			_.each(values, (v, i) => {
				clone[i] = v
			})

			console.log('clone', clone)

			this.$emit('change', clone)
		}
	},
}
</script>
