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
			<clients />
		</template>

	</maincontent>

</div>
</template>

<style scoped lang="sass">

</style>

<script>
import clients from "@/components/modules/app/clients/index.vue";

export default {
	name: 'clients_page',
	components: {
		clients

	},

	computed: {

	},

	methods: {
		newclient : function(){
			this.$store.commit('OPEN_MODAL', {
				id : 'modal_client_edit',
				module : "client_edit",
				caption : "New client"
			})
		}
	},

	mounted() {

	}
}
</script>
