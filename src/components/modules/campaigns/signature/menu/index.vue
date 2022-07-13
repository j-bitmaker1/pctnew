<template>
<div class="signature_menu">
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
	name: 'signature_menu',
	props: {
		signature: Object,
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
					text : 'campaigns.menu.deletesignature',
					icon : 'fas fa-trash',
					action : 'deletesignature'
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

		deletesignature : function(){
			this.core.campaigns.deleteSignature(this.signature.Id, this.signature.System).then(() => {
				this.$emit('deleted')
			})
		}
	},
}
</script>
