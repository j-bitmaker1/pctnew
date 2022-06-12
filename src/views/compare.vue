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

			<div class="golast" v-if="!ids.length && last">
				<router-link :to="last.link">
					<button class="button">Go to last comparison</button>
				</router-link>
			</div>
			
		</template>
	</maincontent>

</div>
</template>

<style scoped lang="sass">
.componentWrapper
	margin-top: 4 * $r

.golast
	text-align: center
	padding : 3 * $r 0
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
		},

	},

	watch : {
		ids : function(){

			if(this.ids.length > 1){

				this.core.api.pctapi.portfolios.gets(this.ids).then(r => {
					this.core.user.activity.template('compare', r)		
					this.last = this.core.user.activity.getlastByType('compare')				
				})

			}

			
		}
	},

	data : function(){
		return {
			last : null,
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
		this.last = this.core.user.activity.getlastByType('compare')

		console.log('this.last', this.last)
	}
}
</script>
