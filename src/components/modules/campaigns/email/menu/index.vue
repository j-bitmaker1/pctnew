<template>
<div class="template_menu">
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
	name: 'template_menu',
	props: {
		emailTemplate: Object,
		buttonclass : {
			type : String,
			default : 'buttonpanel'
		}
	},
	computed: mapState({
		auth: state => state.auth,

		menu : function(){

			var menu = [{
				text : 'campaigns.menu.deleteemail',
				icon : 'fas fa-trash',
				action : 'deleteemail'
			}]

			if(this.emailTemplate.Id){
				menu.push({
					text : 'campaigns.menu.cloneemail',
					icon : 'fas fa-clone',
					action : 'cloneemail'
				})
			}

			return menu
		}

	}),

	methods: {
		menuaction : function(action, item){
			if (this[action]){
				this[action]()
			}   
		},

		deleteemail : function(){
			this.core.campaigns.deleteEmailTemplate(this.emailTemplate.Id).then(r => {
				this.$emit('deleted')
			})
		},

		cloneemail : function(){
			this.$router.push('/campaigns/emailtemplate/new?clone=' + this.emailTemplate.Id).catch(e => {})
		}
	},
}
</script>
