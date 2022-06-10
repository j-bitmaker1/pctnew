<template>
<div class="page">

	<topheader back="back">
		<template v-slot:info>
			<span>Compare</span>
		</template>
		<template v-slot:right>
			<div class="buttonpanel">
				 <i class="fas fa-plus" @click="addportfolio"></i>
			</div>
		</template>
	</topheader>

	<maincontent>
		<template v-slot:content>
			<compare :ids="ids" v-if="ids.length"/>

			<div class="empty" v-else>
				<span>Please select a portfolios to compare</span>
			</div>
		</template>
	</maincontent>

</div>
</template>

<style scoped lang="sass">
.empty
	text-align: center
	padding : 6 * $r 0

	span
		font-size: 0.9em
</style>

<script>


import compare from '@/components/modules/app/compare/index.vue'

export default {
	name: 'compare_page',
	components: {
		compare
	},

	computed: {
		ids : function(){
			return _.filter((this.$route.query.ids || "").split(','), (f) => {return f})
		}
	},

	data : function(){
		return {
			
		}
	},

	methods: {
		addportfolio : function(){

			var selected = {}

			_.each(this.ids, (id) => {
				selected[id] = {id}
			})

			this.core.vueapi.selectPortfolios((portfolios) => {

				this.$router.replace({
                    query : {
                        ... this.$route.query,
                        ... {
							ids : _.map(portfolios, (p) => {
								return p.id
							}).join(',')
						}
                    }
                })

			}, {selected})
		}
	},

	created() {
		
	}
}
</script>
