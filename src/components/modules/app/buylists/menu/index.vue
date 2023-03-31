<template>
<div class="buylist_menu">
	<tooltip :ext="ext">
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
	name: 'buylist_menu',
	props: {
		portfolio: Object,
		buttonclass : {
			type : String,
			default : 'buttonpanel'
		},

		ext : Boolean
	},
	computed: mapState({
		auth: state => state.auth,
		mobileview : state => state.mobileview,
		menu : function(){

			var menu = [
				{
					text : 'labels.edit',
					icon : 'fas fa-pen',
					action : this.edit,

            		features : ['PCT']
				},

				{
					text : 'labels.delete',
					icon : 'fas fa-trash',
					action : this.delete,

            		features : ['PCT']
				}
			]

			return this.core.user.extendByFeaturesMenu(menu)
		
		}

	}),

	methods: {
	

		edit : function(){

			

		},


		delete : function(){

			this.$dialog.confirm(
				"Do you really want to delete this buylist?", {
				okText: this.$t('yes'),
				cancelText : this.$t('no')
			})
	
			.then((dialog) => {

			

			})

			
		}

		
	},
}
</script>
