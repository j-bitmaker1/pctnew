<template>
<div class="page">

	<topheader>
		<template v-slot:info>
			<span>Clients</span>
		</template>
		<template v-slot:right>
			<div class="buttonpanel" @click="newclient">
				<i class="fas fa-plus"></i>
			</div>
		</template>
	</topheader>

	<maincontent>

		<template v-slot:content>
			<clients type="client"/>
		</template>

	</maincontent>

</div>
</template>

<style scoped lang="sass">

</style>

<script>
import clients from "@/components/modules/app/contacts/index.vue";

export default {
	name: 'clients_page',
	components: {
		clients
	},

	computed: {

	},

	methods: {
		newclient : function(){

			this.core.vueapi.newClient()
			
		}
	},

	mounted() {

	}
}
</script>
