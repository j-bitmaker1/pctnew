<template>
<div class="page index">

	<topheader>
		<template v-slot:info>
			<span>Notifications</span>
		</template>
		<template v-slot:right>
		</template>

	</topheader>

	<maincontent>
		<template v-slot:content>
			<notifications />
		</template>
	</maincontent>


</div>
</template>

<style lang="sass" scoped>

</style>

<script>
import notifications from "@/components/modules/notifications/index.vue";


export default {
	name: 'notifications_page',
	components: {
		notifications
	},

	data : function(){
		return { 
			searchEnabled : false
		}
	},

	computed: {

	},

	methods: {
		
	},

	mounted() {

	}
}
</script>
