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

			<div class="componentWrapper" v-if="idswithcurrent.length">
				<component :is="module" :key="key" :ids="idswithcurrent" @selectone="selectone" @removeitem="removeitem" @showassets="showassets"/>
			</div>

			<div class="empty mobp" v-if="!idswithcurrent.length">
				<span>Please select a portfolios to compare</span>
			</div>

			<div class="golast mobp" v-if="!idswithcurrent.length && last">
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
	.detailspanel,
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

	.detailspanel
		right: auto
		left : 0
		border-left: 0
		border-right: 1px solid srgb(--neutral-grad-1)
</style>

<script>
import linenavigation from "@/components/assets/linenavigation/index.vue";

import stress from '@/components/modules/app/compare/stress/index.vue'
import allocation from '@/components/modules/app/compare/allocation/index.vue'
import distribution from '@/components/modules/app/compare/distribution/index.vue'
import retrospective from '@/components/modules/app/compare/retrospective/index.vue'

import f from '@/application/shared/functions.js'


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

		idswithcurrent : function(){
			if(!this.ids.length) return [this.currentportfolio]

			return this.ids
		},

		module : function(){
			return this.active
		},

		active : function(){
			return this.$route.query[this.navkey] || this.navdefault
		},
		...mapState({
			mobileview : state => state.mobileview,
			currentportfolio : state => state.currentportfolio,
		})
	},

	watch : {
		idswithcurrent : function(){

			console.log('this.idswithcurrent', this.idswithcurrent, this.currentportfolio)

			if(this.idswithcurrent.length > 1){

				this.core.api.pctapi.portfolios.gets(this.idswithcurrent).then(r => {
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
			key : 'str'
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

			_.each(this.idswithcurrent, (id) => {
				selected[id] = {id}
			})

			this.core.vueapi.selectPortfolios((portfolios) => {

				this.gotoportfolios(_.map(portfolios, (p) => {
					return p.id
				}))

			}, {selected})
		},

		showassets : function(id){
			this.core.api.pctapi.portfolios.get(id).then(r => {

				this.core.vueapi.editPortfolio(r, () => {
					this.key = f.makeid()
				})

			})
		},

		selectone : function(id){

			var ids = _.filter(this.idswithcurrent, (i) => {return i != id})

			this.core.vueapi.selectPortfolios((portfolios) => {

				var id = portfolios[0].id

				ids.push(id)

				this.gotoportfolios(ids)

			}, {one : true, filter : (portfolio) => {
				return portfolio.id != id
			}})
		},

		removeitem : function(id){

			var ids = _.filter(this.idswithcurrent, (i) => {return i != id})
			this.gotoportfolios(ids)

		}
	},

	created() {
		this.last = this.core.activity.getlastByType('compare')
		
	}
}
</script>
