<template>
	<div class="scenarios_scenario">
		
		<div class="nameWrapper mobp">
			<div class="name" @click="use">
				<span>{{scenario.name}}</span> 
			</div>

			<div class="forcheck" @click="use">
				<i class="fas fa-circle" v-if="!using"></i>
				<i class="fas fa-check-circle good" v-else></i>
			</div>
		</div>

		<div class="description mobp">
			<span>{{scenario.shocks || scenario.description}}</span> <span class="showmore" @click="showfactors"><template v-if="!factorsshowed">Details</template><template v-else>Hide</template></span>
		</div>

		<div class="factorsWrapper" v-if="factorsshowed">
			<factors :info="scenario"/>
		</div>


		<div class="keywords infopt mobp" v-if="scenario.region || (scenario.keywords && scenario.keywords.length)">
			<span class="liketicker">{{scenario.region}}</span> <tags :tags="scenario.keywords"/>
		</div>

		<div class="custom mobp" v-if="scenario.custom">
			<div class="cwrap label">
				<i class="fas fa-user"></i> <date :date="scenario.updated || scenario.created"/>
			</div>

			<div class="cwrap edit" @click="edit">
				<i class="fas fa-pen"></i> <span>Edit</span>
			</div>

			<div class="cwrap delete" @click="remove">
				<i class="fas fa-trash"></i> <span>Delete</span>
			</div>
		</div>
	</div>
	

</template>

<style scoped lang="sass">
.custom
	display: flex
	grid-gap: $r
	align-items: center
	.cwrap
		display: flex
		align-items: center
		border-radius: 24px
		background: srgb(--neutral-grad-0)
		padding : $r 2 * $r
		grid-gap: $r
		font-size: 0.8em

		&.label
			background: srgb(--neutral-grad-4)
			color : srgb(--neutral-grad-0)

		&.edit
			

		i
			font-size: 0.8em
			color : srgb(--color-txt-ac)
		
.keywords
	white-space: nowrap
	overflow: hidden
	text-overflow: ellipsis
.description
	margin-bottom: 2 * $r
	span
		font-size: 0.8em
.nameWrapper
	margin-bottom: $r
	display: flex
	align-items: flex-start
	justify-content: space-between

	.forcheck
		margin-left: auto
		padding : 2 * $r
		padding-top: 0

		i
			color : srgb(--neutral-grad-0)

			&.good
				color : srgb(--color-good)

	.name
		padding-right: 6 * $r
		span
			font-weight: 700
			font-size: 1.2em
.factorsWrapper
	margin-bottom: 4 * $r

	::v-deep
		.infopt
			display: none
.showmore
	text-decoration: underline
	color : srgb(--color-txt-ac)
</style>

<script>
import {
	mapState
} from 'vuex';

import factors from "../factors/index.vue"

export default {
	name: 'scenarios_scenario',
	props: {
		scenario: Object,
		using : Boolean
	},
	computed: mapState({
		auth: state => state.auth,

		
	}),

	components : {
		factors
	},

	data : function(){
		return {
			factorsshowed : false
		}
	},

	methods: {
		use : function(){
			this.$emit('use', this.using ? false : true)
		},
		showfactors : function(){
			this.factorsshowed = !this.factorsshowed
		},

		remove : function(){
			return this.$dialog.confirm(
				"Do you really want to delete your custom scenario", {
				okText: this.$t('yes'),
				cancelText : this.$t('no')
			})
	
			.then((dialog) => {

				this.core.api.pctapi.customscenarios.delete(this.scenario.id, {
					preloader : true,
					showStatus : true
				}).then(r => {
					this.$emit('removed')
				})

			}).catch( e => {
			})
		},

		edit : function(){
			this.core.vueapi.createCustomScenario({
				edit : this.scenario
			}, (scenario) => {
				this.$emit('changed', scenario)
            })
		}
	},
}
</script>
