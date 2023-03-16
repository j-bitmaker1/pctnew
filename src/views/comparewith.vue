<template>
<div class="page">

	<topheader :back="mobileview ? 'back' : ''">
		<template v-slot:info>
			<span>Compare with structured</span>
		</template>
		<template v-slot:right>
			
		</template>
	</topheader>

	<maincontent>
		<template v-slot:content>

            <div class="selectors">

				<div class="selector">
					<div class="namerow left">
						<div class="nameB" @click="addportfolio">
							<template v-if="portfolio">
								<span>{{portfolio.name}}</span>
								<div class="selectionpanel">
									<i class="fas fa-search"></i>
								</div>
							</template>
							<template v-else>
								<span>Select portfolio</span>
							</template>
						</div>
					</div>
				</div>

				<div class="selector">
					<div class="namerow">
						<div class="nameB" @click="addannuity">
							<template v-if="structure">
								<span>{{structure.name}}</span>
								
								<div class="selectionpanel">
									<i class="fas fa-search"></i>
								</div>
							</template>
							<template v-else>
								Select structure
							</template>
						</div>

						<div class="inputwrapper" v-if="structure">
							<input type="number" :value="weight" placeholder="100000" @change="wchanged"/>

							<div class="vicon">
								<span v-if="valuemode == 'd'">$</span>
								<span v-if="valuemode != 'd'">%</span>
							</div>
						</div>
					</div>
				</div>
				
            </div>

		

			<div class="structureInfoWrapper" v-if="structure">
				<structureinfo :annuity="structure" :weight="Number(weight) || 100000" :mode="valuemode"/>
			</div>

		

			<div class="componentWrapper" v-if="portfolio && structure">
				<component :is="module" :portfolio="portfolio" type="split" :mode="valuemode" :assets="[annuityWeighted]"/>
			</div>

			<div class="empty mobp" v-if="!portfolio">
				<span>Please select a portfolio and structure to compare</span>
			</div>

			<!--<div class="golast mobp" v-if="!ids.length && last">
				<router-link :to="last.link">
					<button class="button">Go to last comparison</button>
				</router-link>
			</div>-->
			
		</template>
	</maincontent>

</div>
</template>

<style scoped lang="sass">
.structureInfoWrapper
	padding-bottom: 2 * $r
	margin-top: 2 * $r

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
.selectors
	display: flex
	align-items: center

	.selector
		flex-basis: 50%
		padding : $r
		flex-grow: 1
		flex-shrink: 0
		min-width: 0

	.namerow
		display: flex
		align-items: center
		border-radius: 24px
		background: srgb(--neutral-grad-0)
		margin: 0 auto
		text-align: center
		white-space: nowrap
		overflow: hidden
		width: 100%
		position: relative
		justify-content: center

		&.left
			justify-content: left

		.inputwrapper
			position: relative
			.vicon
				position: absolute
				top : 0
				bottom : 0
				right: 0
				display: flex
				align-items: center
				padding : 0 $r

		input
			border-radius: 24px
			text-align: center
			height: 38px
			background: srgb(--neutral-grad-1)
		

	.nameB
		cursor: pointer
		padding: $r 2 * $r
		max-width: 80%
		overflow: hidden
		text-overflow: ellipsis

		span
			font-size: 0.9em

	.selectionpanel
		position: absolute
		right : $r
		top : 0
		bottom: 0
		display: flex
		border-radius: 24px
		align-items: center
		border-left: 1px solid srgb(--neutral-grad-1)
		background: srgb(--neutral-grad-0)

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
//import distribution from '@/components/modules/app/compare/distribution/index.vue'

import structureinfo from '@/components/modules/app/comparewith/structureinfo/index.vue'
import stress from '@/components/modules/app/comparewith/stress/index.vue'


import { mapState } from 'vuex';
export default {
	name: 'comparewith_page',
	components: {
		stress, 
		linenavigation, 
		//distribution,
		structureinfo
	},

	computed: {
		p : function(){
			return this.$route.query.p || ''
		},

		weight : function(){
			return (this.$route.query.w || '').replace(/[^0-9]/g, '')
		},

        s : function(){
			return this.$route.query.s || ''
		},

		module : function(){
			return this.active
		},

		active : function(){
			return this.$route.query[this.navkey] || this.navdefault
		},

		valuemode : function(){
			if(this.portfolio && this.portfolio.isModel){
				return 'p100'
			}

			return 'd'
		},

		...mapState({
			mobileview : state => state.mobileview,
		}),

		annuityWeighted : function(){

			var w = Number(this.weight || 100000)

			if (w < 0) w = 100000

			if(this.valuemode == 'p100'){
				if (w > 100){
					w = 100
				}
			}

			return {
				...this.structure,
				ticker : this.structure.id,
				value : w
			}
		}

	},

	watch : {
        p: {
			immediate : true,
			handler : function(){

				if(this.p){
					this.core.api.pctapi.portfolios.get(this.p).then(r => {
						this.portfolio = r
					})
				}
			}
		},

		s: {
			immediate : true,
			handler : function(){

				if (this.s){
					this.core.api.pctapi.stress.annuities.get(this.s).then(r => {
						this.structure = r

					})
				}
			}
		},
		w : {
			immediate : true,
			handler : function(){

				
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
					text : 'labels.distribution',
					id : 'distribution'
				}
			],
			navdefault : 'stress',
			navkey : 'c',

			portfolio : null,
			structure : null
			
		}
	},

	methods: {

		wchanged : function(e){
			this.$router.replace({
				query : {
					... this.$route.query,
					... {
						w : e.target.value
					}
				}
			}).catch(e => {})
		},
		addportfolio : function(){

			this.core.vueapi.selectPortfolios((portfolios) => {


				this.$router.replace({
                    query : {
                        ... this.$route.query,
                        ... {
							p : portfolios[0].id
						}
                    }
                }).catch(e => {})

			}, {one : true})
		},

		addannuity : function(){
			this.core.vueapi.annuitiesLookup((result) => {

				this.$router.replace({
                    query : {
                        ... this.$route.query,
                        ... {
							s : result.id
						}
                    }
                }).catch(e => {})

			})
		}
	},

	created() {
		//this.last = this.core.activity.getlastByType('compare')
		
	}
}
</script>
