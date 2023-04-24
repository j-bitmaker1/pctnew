<template>
<div class="page">

	<topheader :back="mobileview ? 'back' : ''">
		<template v-slot:info>
			<span>Compare Structured</span>
		</template>
		<template v-slot:right>
			
		</template>
	</topheader>

	<maincontent>
		<template v-slot:content>

            <div class="selectors">

				<div class="selector">
					<div class="namerow" @click="addportfolio" >
						<div class="nameB" >
							<div class="detailspanel" v-if="portfolio" @click.stop="showassets">
								<i class="fas fa-list-ul"></i>
							</div>

							<template v-if="portfolio">
								<span>{{portfolio.name}}</span> &middot; <value :value="portfolio.total()" :mode="portfolio.isModel ? 'p100' : 'd'" />
								
							</template>
							<template v-else>
								<span>Select portfolio</span>
							</template>

							<div class="selectionpanel">
								<i class="fas fa-search"></i>
							</div>
						</div>
					</div>
				</div>

				<div class="selector">
					<div class="namerow">
						<div class="nameB" @click="addannuity">
							<template v-if="structure">
								<span>{{structure.name}}</span>
								
								
							</template>
							<template v-else>
								<span>Select Structured Product</span>
							</template>
						</div>

						<div class="inputwrapper" v-if="structure">
							<input type="number" :value="weight" :placeholder="defaultAnnuityValue" @change="wchanged"/>

							<div class="vicon">
								<span v-if="valuemode == 'd'">$</span>
								<span v-if="valuemode != 'd'">%</span>
							</div>
						</div>

						<div class="selectionpanel" @click="addannuity">
							<i class="fas fa-search"></i>
						</div>
					</div>
				</div>
				
            </div>

			<div class="portfolioInfoWrapper" v-if="portfolio">
				<portfolioinfo :portfolio="portfolio"/>
			</div>

			<div class="structureInfoWrapper" v-if="structure">
				<structureinfo :annuity="structure" :weight="Number(weight) || defaultAnnuityValue" :mode="valuemode"/>
			</div>

			<div class="settings" v-if="portfolio && structure">

				<div class="setting">

					<iconstoggle :icons="includemodes" @change="changeincludemode" :value="includemode"/> 
					<span>{{includemodeLabel}}</span>
				</div>

			</div>

			<div class="linenavigation">
				<linenavigation :items="navigation" :navdefault="navdefault" :navkey="navkey"/>
			</div>

			<div class="componentWrapper" v-if="portfolio && structure">
				<component :key="key" :is="module" :includemode="includemode" :portfolio="portfolio" type="split" :mode="valuemode" :assets="[annuityWeighted]"/>
			</div>

			<div class="empty mobp" v-if="!portfolio || !structure">
				<span>Please select a portfolio and structure to compare</span>
			</div>

			<div class="golast mobp" v-if="(!portfolio && !structure) && last">
				<router-link :to="last.link + '&c=' + active">
					<button class="button">Go to last comparison</button>
				</router-link>
			</div>


		</template>
	</maincontent>

</div>
</template>

<style scoped lang="sass">
.portfolioInfoWrapper,
.structureInfoWrapper
	padding-bottom: 2 * $r
	margin-top: 2 * $r

.settings
	padding: $r

	.setting
		display: flex
		align-items : center

		span
			margin-left: $r
.linenavigation
	margin-top: 4 * $r

.componentWrapper

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
		padding-left: 40px
		padding-right: 40px

		&.left
			justify-content: left

		.inputwrapper
			position: relative
			.vicon
				position: absolute
				top : 0
				bottom : 0
				left: $r
				display: flex
				align-items: center
				padding : 0 $r

		input
			border-radius: 24px
			text-align: center
			height: 38px
			background: srgb(--neutral-grad-1)
			width: 110px
			font-size: 0.9em
		

	.nameB
		cursor: pointer
		padding: $r 2 * $r
		max-width: 80%
		overflow: hidden
		text-overflow: ellipsis
		grid-gap: $r

		span
			font-size: 0.9em
	.detailspanel,
	.selectionpanel
		position: absolute
		right : 0
		top : 0
		bottom: 0
		display: flex
		border-radius: 24px
		align-items: center
		padding-right: $r
		padding-left: $r
		border-left: 1px solid srgb(--neutral-grad-1)
		background: srgb(--neutral-grad-0)
		z-index: 2

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
		left : $r
		border-left: 0
		border-right: 1px solid srgb(--neutral-grad-1)

::v-deep
	.panelWrapper
		display: flex
		align-items: center
		padding : 2 * $r

		.einfo
			margin-left: $r

		.value
			margin-left: $r

		span,
		input
			font-size: 1.2em
			padding : 0


@media only screen and (max-width: 768px)
	.selectors
		flex-wrap: wrap

		.selector
			flex-basis: 100%
</style>

<script>
import linenavigation from "@/components/assets/linenavigation/index.vue";
//import distribution from '@/components/modules/app/compare/distribution/index.vue'

import structureinfo from '@/components/modules/app/comparewith/structureinfo/index.vue'
import portfolioinfo from '@/components/modules/app/comparewith/portfolioinfo/index.vue'
import stress from '@/components/modules/app/comparewith/stress/index.vue'
import retrospective from '@/components/modules/app/comparewith/retrospective/index.vue'

import f from '@/application/shared/functions.js'

import { mapState } from 'vuex';
export default {
	name: 'comparewith_page',
	components: {
		stress, 
		linenavigation, 
		structureinfo,
		portfolioinfo,
		retrospective
	},

	computed: {
		p : function(){
			return this.$route.query.p || this.currentportfolio ||''
		},


		weight : function(){
			var w = Number((this.$route.query.w || '').replace(/[^0-9]/g, '')) || this.defaultAnnuityValue

			if (w < 0) w = this.defaultAnnuityValue

			if (this.valuemode == 'p100'){
				if (w > 100){
					w = 100
				}
			}

			return w
		},

        st : function(){
			return this.$route.query.st || ''
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
			currentportfolio : state => state.currentportfolio,
			mobileview : state => state.mobileview,
		}),

		defaultAnnuityValue : function(){

			if (this.portfolio){
				return this.portfolio.total()
			}

			return 100000
			//this.includemode == 'i'
		},

		annuityWeighted : function(){

			return {
				...this.structure,
				ticker : this.structure.ticker,
				value : this.weight
			}
		},

		portfolioFromStructure : function(){

		},

		includemodeLabel : function(){
			return (_.find(this.includemodes, (im) => {
				return im.id == this.includemode
			}) || {}).title
		}

	},

	watch : {
        p: {
			immediate : true,
			handler : function(){

				if(this.p){
					this.core.api.pctapi.portfolios.get(this.p).then(r => {
						this.portfolio = r

						this.saveactivity()
					})
				}
				else{
					this.portfolio = null
				}
			}
		},

		st: {
			immediate : true,
			handler : function(){

				if (this.st){
					this.core.pct.getasset(this.st).then(r => {

						console.log("RRR ", r)

						this.structure = r

						this.saveactivity()
					})
				}
				else
					this.structure = null
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
					id : 'stress',
					icon : 'fas fa-chart-bar'
				},
				{
					text : 'labels.retrospective',
					id : 'retrospective',
					icon : 'fas fa-history'
				}
			],
			navdefault : 'stress',
			navkey : 'c',

			portfolio : null,
			structure : null,
			last : null,
			key : 'str',

			includemode : localStorage['comparewith_includemode'] || 'e',
			
            includemodes : [
				{
					icon : "fas fa-chart-pie",
					id : 'i',
                    title : 'Structured Compared with Portfolio'
				},
				{
					icon : "fas fa-plus-circle",
					id : 'e',
                    title : 'Structured Added to the Portfolio'
				}
			],
			
		}
	},

	methods: {

		saveactivity : function(){
			if (this.portfolio && this.structure){

				this.core.activity.template('comparewith', {
					portfolio : this.portfolio,
					annuityWeighted : this.annuityWeighted
				})

				this.last = this.core.activity.getlastByType('comparewith')
			}
			
		},

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
			this.core.vueapi.assetsLookup((result) => {

				console.log('result', result)

				this.$router.replace({
                    query : {
                        ... this.$route.query,
                        ... {
							st : result.ticker
						}
                    }
                }).catch(e => {})

			})
		},

		changeincludemode : function(v){
			this.includemode = v

            localStorage['comparewith_includemode'] = v
		},

		showassets : function(){

			this.core.vueapi.editPortfolio(this.portfolio, () => {
				this.key = f.makeid()
			})

		}
	},

	created() {
		this.last = this.core.activity.getlastByType('comparewith')
	}
}
</script>
