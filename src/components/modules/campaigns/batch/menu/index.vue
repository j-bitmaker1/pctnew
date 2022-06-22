<template>
<div class="batch_menu">
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
	name: 'batch_menu',
	props: {
		batch: Object,
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
					text : 'campaigns.menu.deletebatch',
					icon : 'fas fa-trash',
					action : 'deletebatch'
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

		deletebatch : function(){

		}
	},
}
</script>
