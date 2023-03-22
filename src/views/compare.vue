<template>
<div class="page">

	<topheader :back="mobileview ? 'back' : ''">
		<template v-slot:info>
			<span>Compare</span>
		</template>
		<template v-slot:right>
			<div class="buttonpanel">
				 <i class="fas fa-search" @click="addportfolio"></i>
			</div>
		</template>
	</topheader>

	<maincontent>
		<template v-slot:content>

			<div class="linenavigation">
				<linenavigation :items="navigation" :navdefault="navdefault" :navkey="navkey"/>
			</div>

			<div class="componentWrapper" v-if="ids.length">
				<component :is="module" :ids="ids" @selectone="selectone" @removeitem="removeitem"/>
			</div>

			<div class="empty mobp" v-if="!ids.length">
				<span>Please select a portfolios to compare</span>
			</div>

			<div class="golast mobp" v-if="!ids.length && last">
				<router-link :to="last.link + '&c=' + active">
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

::v-deep
	.selectionpanel
		position: absolute
		right : 0
		top : 0
		bottom: 0
		display: flex
		border-radius: 24px
		align-items: center
		border-left: 1px solid srgb(--neutral-grad-1)
		background: srgb(--neutral-grad-0)
		padding-right: $r
		padding-left: $r

		i
			cursor: pointer
			width : 24px
			padding : $r
			font-size: 0.8em
			color : srgb(--neutral-grad-3)

			+transition(0.3s)

			&:hover
				color : srgb(--neutral-grad-2)
</style>

<script>
import linenavigation from "@/components/assets/linenavigation/index.vue";

import stress from '@/components/modules/app/compare/stress/index.vue'
import allocation from '@/components/modules/app/compare/allocation/index.vue'
import distribution from '@/components/modules/app/compare/distribution/index.vue'
import retrospective from '@/components/modules/app/compare/retrospective/index.vue'



import { mapState } from 'vuex';
export default {
	name: 'compare_page',
	components: {
		stress, linenavigation, distribution, allocation, retrospective
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
		...mapState({
			mobileview : state => state.mobileview,
		})
	},

	watch : {
		ids : function(){

			if(this.ids.length > 1){

				this.core.api.pctapi.portfolios.gets(this.ids).then(r => {
					this.core.activity.template('compare', r)		
					this.last = this.core.activity.getlastByType('compare')				
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
					id : 'stress',
					icon : 'fas fa-chart-bar'
				},
				{
					text : 'labels.allocation',
					id : 'allocation',
					icon : 'fas fa-chart-pie'
				},
				{
					text : 'labels.distribution',
					id : 'distribution',
					icon : 'fas fa-chart-area'
				},
				{
					text : 'labels.retrospective',
					id : 'retrospective',
					icon : 'fas fa-history'
				}
				
			],
			navdefault : 'stress',
			navkey : 'c',
		}
	},

	methods: {
		gotoportfolios : function(ids){
			this.$router.replace({
				query : {
					... this.$route.query,
					... {
						ids : ids.join(',')
					}
				}
			}).catch(e => {})
		},	
		addportfolio : function(){

			var selected = {}

			_.each(this.ids, (id) => {
				selected[id] = {id}
			})

			this.core.vueapi.selectPortfolios((portfolios) => {

				this.gotoportfolios(_.map(portfolios, (p) => {
					return p.id
				}))

			}, {selected})
		},

		selectone : function(id){

			var ids = _.filter(this.ids, (i) => {return i != id})

			this.core.vueapi.selectPortfolios((portfolios) => {

				var id = portfolios[0].id

				ids.push(id)

				this.gotoportfolios(ids)

			}, {one : true, filter : (portfolio) => {
				return portfolio.id != id
			}})
		},

		removeitem : function(id){

			var ids = _.filter(this.ids, (i) => {return i != id})
			this.gotoportfolios(ids)

		}
	},

	created() {
		this.last = this.core.activity.getlastByType('compare')
		
	}
}
</script>
