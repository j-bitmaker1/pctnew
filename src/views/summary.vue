<template>
<div id="summary_page">

    <psummary :portfolioId="id" @changeData="change"/>

</div>
</template>

<style scoped lang="sass">

</style>

<script>

import psummary from '@/components/modules/app/portfolio/summary/index.vue'


export default {
	name: 'portfolios_page',
	components: {
		psummary
	},

	computed: {

		id : function(){
			return this.$route.query.id
		},

		
	},

	watch : {
		id : {
			
		}
	},

	data : function(){
		return {
			
		}
	},

	methods: {
		change : function({portfolioId}){


			this.$router.push('?id=' + portfolioId)

			/*this.$router.replace({
				query : {
					... this.$route.query,
					... {
						id : portfolioId
					}
				}
			}).catch(e => {})*/
		}
	},

	created() {
        this.$store.commit('summaryview', true)
		//this.load()
	},

    destroyed(){
        this.$store.commit('summaryview', false)

    }
}
</script>



