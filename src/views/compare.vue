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

			<div class="linenavigation">
				<linenavigation :items="navigation" :navdefault="navdefault" :navkey="navkey"/>
			</div>

			<div class="componentWrapper" v-if="ids.length">
				<component :is="module" :ids="ids" />
			</div>

			<div class="empty" v-if="!ids.length">
				<span>Please select a portfolios to compare</span>
			</div>
			
		</template>
	</maincontent>

</div>
</template>

<style scoped lang="sass">
.componentWrapper
	margin-top: 4 * $r
.empty
	text-align: center
	padding : 6 * $r 0

	span
		font-size: 0.9em
</style>

<script>
import linenavigation from "@/components/assets/linenavigation/index.vue";

import stress from '@/components/modules/app/compare/stress/index.vue'
import allocation from '@/components/modules/app/compare/allocation/index.vue'
import distribution from '@/components/modules/app/compare/distribution/index.vue'


export default {
	name: 'compare_page',
	components: {
		stress, linenavigation, distribution, allocation
	},

	computed: {
		ids : function(){
			return _.filter((this.$route.query.ids || "").split(','), (f) => {return f})
		},

		module : function(){
			return this.active
		},

		active : function(){
			return this.$route.query[this.navkey] || this.navdefault
		}
	},

	data : function(){
		return {
			navigation : [
				{
					text : 'labels.crashtest',
					id : 'stress'
				},
				{
					text : 'labels.allocation',
					id : 'allocation'
				},
				{
					text : 'labels.distribution',
					id : 'distribution'
				}
			],
			navdefault : 'stress',
			navkey : 'c',
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
