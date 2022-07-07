<template>
<div class="campaign_step_menu">
	<tooltip>
		<template v-slot:item>
			<div :class="buttonclass">
				<i class="fas fa-ellipsis-v"></i>
			</div>
		</template>

		<template v-slot:content="i">
			<listmenu :items="menu" @action="menuaction" :close="i.close"/>
		</template>

	</tooltip>
</div>
</template>

<style scoped lang="sass">

</style>

<script>
import {
	mapState
} from 'vuex';

export default {
	name: 'campaign_step_menu',
	props: {
		editing : Boolean,
		step: Object,
		buttonclass : {
			type : String,
			default : 'buttonpanel'
		}
	},
	computed: mapState({
		auth: state => state.auth,

		menu : function(){

			return [
				{
					text : 'campaigns.menu.editstep',
					icon : 'fas fa-edit', 
					action : 'editstep'
				},
				{
					text : 'campaigns.menu.deletestep',
					icon : 'fas fa-trash',
					action : 'deletestep'
				}

			]
		}

	}),

	methods: {
		menuaction : function(action, item){
			if (this[action]){
				this[action]()
			}   
		},

		editstep : function(){
			this.$emit('edit')
		},

		deletestep : function(){
			this.$emit('remove')
		}
	},
}
</script>
