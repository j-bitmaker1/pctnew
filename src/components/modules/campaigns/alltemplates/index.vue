<template>
<div id="campaigns_alltemplates">
	<div class="linenavigation">
		<linenavigation :buttons="true" :second="true" :items="navigation" :navdefault="navdefault" :navkey="navkey"/>
	</div>
	<div class="cwrapper">
		<component :is="module"/>
	</div>
</div>
</template>

<style scoped lang="sass">
.linenavigation
	margin-top: 2 * $r
.cwrapper
	margin-top: 2 * $r
</style>

<script>
import {
	mapState
} from 'vuex';

import templates from '@/components/modules/campaigns/templates/index.vue';
import emails from '@/components/modules/campaigns/emails/index.vue';
import linenavigation from "@/components/assets/linenavigation/index.vue";

export default {
	name: 'campaigns_alltemplates',
	props: {
		data: Object
	},
	components: {
        templates, linenavigation, emails
	},
	data : function(){

		return {

			navigation : [
				
				{
					text : 'campaigns.labels.campaigntemplates',
					id : 'templates',
					icon : "fas fa-route"
				},
				{
					text : 'campaigns.labels.emailtemplates',
					id : 'emails',
					icon : "fas fa-envelope"
				}
			],

			navkey : 't',
			navdefault : 'templates'
		}
	},

	computed: mapState({
		auth: state => state.auth,
		module : function(){
			return this.active
		},

		active : function(){
			return this.$route.query[this.navkey] || this.navdefault
		},
	}),

	methods: {

	},
}
</script>
