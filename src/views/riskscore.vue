<template>
<div class="abspage">

	<topheader :back="back">
	  <template v-slot:info>
		<logotype />
	  </template>
	</topheader>

	<maincontent>
		<template v-slot:content>
			<linepreloader v-if="loading"/>
			<riskscore v-if="info" :info="info" :token="token"/>

			<div class="empty" v-if="!loading && !info">
				<span>Questionnaire not found, try reloading the page or ask the adviser for another link</span>
			</div>
		</template>
	</maincontent>

</div>
</template>

<style scoped lang="sass">

.empty
	padding : 4 * $r
	text-align: center
	opacity: 0.8

::v-deep
	.stickedTop
		top : 0
</style>

<script>

import riskscore from "@/components/modules/app/riskscore/index.vue";
import { mapState } from 'vuex';

export default {
	name: 'riskscore_page',
	components: {
        riskscore
	},

	data : function(){
		return {
			loading : true,
			info : null
		}
	},

	computed: mapState({
		auth : state => state.auth,
		back : function(){
			if(!this.auth) return null
	
			return "/"
		},

		token : function(){
			return this.$route.params.token
		}
	}),


	methods: {
		load : function(){
			

			this.core.api.crm.questionnaire.getdata(this.token).then(r => {

				this.info = r

				return Promise.resolve(r)

			}).finally(() => {
				this.loading = false
			})
		}
	},

	created(){
		this.load()
	},

	mounted() {

	}
}
</script>
