<template>
<div class="page">

	<topheader back="/portfolios" :gray="true">
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

			<component :is="module" :portfolio="portfolio" v-if="!loading && portfolio"/>
			
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
</style>

<script>

import linenavigation from "@/components/assets/linenavigation/index.vue";

import shares from "@/components/modules/app/portfolio/shares/index.vue";
import crashtest from "@/components/modules/app/portfolio/crashtest/index.vue";
import portfoliomenu from '@/components/modules/app/portfolio/menu/index.vue'

import client from '@/components/modules/app/portfolio/client/index.vue'

export default {
	name: 'portfolios_page',
	components: {
		linenavigation,
		shares,
		crashtest,
		portfoliomenu,
		client
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
					id : 'crashtest'
				},
				{
					text : 'labels.shares',
					id : 'shares'
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

				if(!r.crmContactId){
					return Promise.resolve()
				}

				this.core.user.activity.template('portfolio', this.portfolio)

				return this.core.api.crm.contacts.gets({Ids : [r.crmContactId]}).then(c => {
			
					this.profile = c[0]
				})

			}).finally(() => {
				this.loading = false
			})
		},


		deleteportfolio : function(){
			this.$router.push('/portfolios')
		},

		editportfolio : function(portfolio){
			this.portfolio = portfolio
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
