<template>
<div id="summary_page">

    <psummary :portfolioId="id" @changeData="change" :last="last"/>

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
			return this.$route.query.id ? Number(this.$route.query.id) : 0
		},
		
	},

	watch : {
		id : function(){}
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
        //this.$store.commit('summaryview', true)


		this.last = this.core.activity.getlastByType('portfolio')

		console.log('this.last', this.last)

		//this.load()
	},

    destroyed(){
        //this.$store.commit('summaryview', false)

    }
}
</script>



