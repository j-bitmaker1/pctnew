<template>
<div class="campaign_menu">
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
	name: 'campaign_menu',
	props: {
		campaign: Object,
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
					text : 'campaigns.menu.deletesingle',
					icon : 'fas fa-trash',
					action : 'deletesingle'
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

		deletesingle : function(){

		}
	},
}
</script>
