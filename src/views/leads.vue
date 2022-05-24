<template>
<div class="page">

	<topheader>
		<template v-slot:info>
			<span>Leads</span>
		</template>
		<template v-slot:right>

			<div class="buttonpanel" @click="newlead">
				<i class="fas fa-plus"></i>
			</div>

			<div class="buttonpanel" @click="sharequestionnaire">
				<i class="fas fa-link"></i>
			</div>
		</template>
	</topheader>

	<maincontent>

		<template v-slot:content>
			<leads ref="list"/>
		</template>

	</maincontent>

</div>
</template>

<style scoped lang="sass">

</style>

<script>
import leads from "@/components/modules/app/leads/index.vue";

export default {
	name: 'leads_page',
	components: {
		leads

	},

	computed: {

	},

	methods: {
		sharequestionnaire: function () {

			this.core.api.crm.questionnaire.getlink().then(url => {

				this.$store.commit('OPEN_MODAL', {
					id: 'modal_share',
					module: "share",
					caption: "Share Questionnaire",
					mclass : 'small',
					data : {
						url
					}
				})

			}).catch(e => {
				
				this.$store.commit('icon', {
					icon: 'error',
					message: e.error
				})

			})

			
		},

		newlead : function(){
			this.core.vueapi.createContact({
				Type : "LEAD"
			}, (data) => {

				console.log('data', data)

				if(this.$refs['list']) this.$refs['list'].search(data.FName + " " + data.LName)

			}, {
				caption : "New lead"
			})
		},

		reload(){
			if(this.$refs['list']) this.$refs['list'].reload()
		}
	},

	mounted() {
		//if(this.$refs['list']) this.$refs['list'].search("max grishkov")
	}
}
</script>
