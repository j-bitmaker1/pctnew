<template>
<div class="page">

	<topheader back="back" :gray="true">
		<template v-slot:info>
			
			<div class="captionsl">
				<div class="clientinfo" v-if="profile">
					<router-link :to="'/client/' + profile.ID">
						<client :profile="profile" :small="true"/>
					</router-link>
				</div>
				<div class="divider" v-if="profile">
					<span>/</span>
				</div>
				<div>
					<span>{{name}}</span>
				</div>
			</div>
			
		</template>
		<template v-slot:right>
			<portfoliomenu v-if="!loading && portfolio" @edit="editportfolio" @delete="deleteportfolio" :portfolio="portfolio" @changeClient="changeClient"/>
		</template>
	</topheader>

	<maincontent>
		<template v-slot:content>

			<div class="linenavigation">
				<linenavigation :items="navigation" :navdefault="navdefault" :navkey="navkey"/>
			</div>

			<component :is="module" :portfolio="portfolio" :profile="profile" v-if="!loading && portfolio"/>
			
		</template>
	</maincontent>

</div>
</template>

<style scoped lang="sass">
.linenavigation
	background: srgb(--background-secondary-theme)
	margin-bottom: $r
.clientinfo
	background: srgb(--background-secondary-theme)
.captionsl
	display: flex
	flex-wrap: nowrap
	align-content: space-between
	align-items: center
	grid-gap: $r
	white-space: nowrap
	-webkit-mask-image: linear-gradient(to left, transparent 3%, black 10%)
	mask-image: linear-gradient(to left, transparent 3%, black 10%)

@media only screen and (min-width: 1024px)
	.linenavigation
		background: srgb(--background-total-theme)

	.clientinfo
		background: transparent
</style>

<script>

import linenavigation from "@/components/assets/linenavigation/index.vue";

import shares from "@/components/modules/app/portfolio/shares/index.vue";
import crashtest from "@/components/modules/app/portfolio/crashtest/index.vue";
import portfoliomenu from '@/components/modules/app/portfolio/menu/index.vue'

import client from   '@/components/modules/app/portfolio/client/index.vue'

import analysis from "@/components/modules/app/portfolio/analysis/index.vue";


export default {
	name: 'portfolios_page',
	components: {
		linenavigation,
		shares,
		crashtest,
		portfoliomenu,
		client,
		analysis
	},

	computed: {
		name : function(){

			if(this.portfolio) return this.portfolio.name
			
			return ''
		},

		module : function(){
			return this.active
		},

		active : function(){
			return this.$route.query[this.navkey] || this.navdefault
		},

		id : function(){
			return this.portfolioid || this.$route.params.id
		},

		client : function(){
			return null
		}
	},

	data : function(){
		return {
			navigation : [
				{
					text : 'labels.crashtest',
					id : 'crashtest',
					icon : 'fas fa-chart-bar'
				},
				{
					text : 'labels.shares',
					id : 'shares',
					icon : 'fas fa-list'
				},
				{
					text : 'labels.more',
					id : 'analysis',
					icon : 'fas fa-caret-down'
				}
			],

			portfolio : null,
			profile : null,
			navkey : 'p',

			loading : false,

			navdefault : 'crashtest'
		}
	},

	methods: {
		load : function(){
			this.loading = true
			this.core.api.pctapi.portfolios.get(this.id).then(r => {

				this.portfolio = r

				this.core.activity.template('portfolio', this.portfolio)

				if(!r.crmContactId){
					return Promise.resolve()
				}

				

				return this.core.api.crm.contacts.gets({Ids : [r.crmContactId]}).then(c => {
			
					this.profile = c[0]
				})

			}).finally(() => {
				this.loading = false
			})
		},


		deleteportfolio : function(){
			this.$router.push('/portfolios').catch(e => {})
		},

		editportfolio : function(portfolio){
			//this.portfolio = portfolio
		},

		changeClient : function(profile){
			this.profile = profile
		}
	},

	created() {
		this.load()
	}
}
</script>
