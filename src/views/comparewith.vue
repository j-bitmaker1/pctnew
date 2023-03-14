<template>
<div class="page">

	<topheader :back="mobileview ? 'back' : ''">
		<template v-slot:info>
			<span>Compare with structured</span>
		</template>
		<template v-slot:right>
			<!--<div class="buttonpanel">
				<i class="fas fa-search" @click="addportfolio"></i>
			</div>-->
		</template>
	</topheader>

	<maincontent>
		<template v-slot:content>

            <div class="selectors">
            </div>

			<div class="linenavigation">
				<linenavigation :items="navigation" :navdefault="navdefault" :navkey="navkey"/>
			</div>

			<div class="componentWrapper" v-if="portfolio">
				<component :is="module" :ids="[portfolio]" />
			</div>

			<div class="empty mobp" v-if="!portfolio">
				<span>Please select a portfolio to compare</span>
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
import distribution from '@/components/modules/app/compare/distribution/index.vue'

import { mapState } from 'vuex';
export default {
	name: 'comparewith_page',
	components: {
		stress, linenavigation, distribution
	},

	computed: {
		portfolio : function(){
			return this.$route.query.portfolio
		},

        structure : function(){
			return this.$route.query.structure
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
        structure: function(){

			if(structure){

			}
		},
		portfolio : function(){

			if(portfolio){

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
		}
	},

	methods: {
		addportfolio : function(){

			this.core.vueapi.selectPortfolios((portfolios) => {


				this.$router.replace({
                    query : {
                        ... this.$route.query,
                        ... {
							portfolio : portfolios[0].id
						}
                    }
                }).catch(e => {})

			}, {one : true})
		}
	},

	created() {
		//this.last = this.core.activity.getlastByType('compare')
		
	}
}
</script>
