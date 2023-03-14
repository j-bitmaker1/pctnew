<template>
	<div class="scenarios_scenario">
		
		<div class="nameWrapper mobp">
			<div class="name" @click="use">
				<i class="fas fa-question-circle" @click.stop="showinfo"></i><span>{{scenario.name}}</span>
			</div>

			<div class="forcheck" @click="use">
				<i class="fas fa-circle" v-if="!using"></i>
				<i class="fas fa-check-circle good" v-else></i>
			</div>
		</div>

		<div class="extra" v-if="infoShowed">
			<div class="description mobp">
				<span>{{scenario.shocks || scenario.description}}</span> 
				<!--<span class="showmore" @click="showfactors"><template v-if="!factorsshowed">Details</template><template v-else>Hide</template></span>-->
			</div>

			<div class="factorsWrapper">
				<factors :info="scenario"/>
			</div>


			<div class="keywords infopt mobp" v-if="scenario.region || (scenario.keywords && scenario.keywords.length)">
				<span class="liketicker">{{scenario.region}}</span> <tags :tags="scenario.keywords"/>
			</div>
		</div>

		<div class="custom mobp" v-if="scenario.custom">
			

			<div class="cwrap edit" @click="edit">
				<i class="fas fa-pen"></i> <span>Edit</span>
			</div>

			<div class="cwrap delete" @click="remove">
				<i class="fas fa-trash"></i> <span>Delete</span>
			</div>

			<div class="cwrap label">
				<i class="fas fa-user"></i> <date :date="scenario.updated || scenario.created"/>
			</div>
		</div>

		
	</div>
	

</template>

<style scoped lang="sass">
.custom
	display: flex
	align-items: center
	margin-top: $r
	.cwrap
		display: flex
		align-items: center
		border-radius: 24px
		background: srgb(--neutral-grad-0)
		padding : $r 2 * $r
		margin-right: $r
		font-size: 0.8em

		&.label
			background: transparent

		i
			margin-right: $r
			font-size: 0.8em
			color : srgb(--color-txt-ac)
		
.keywords
	white-space: nowrap
	overflow: hidden
	text-overflow: ellipsis
.description
	margin-bottom: 2 * $r
	margin-left: 30px
	span
		font-size: 0.8em
		
.nameWrapper
	display: flex
	align-items: flex-start
	justify-content: space-between

	.forcheck
		margin-left: auto
		padding : 2 * $r
		padding-top: 0
		padding-bottom: 0

		i
			color : srgb(--neutral-grad-0)

			&.good
				color : srgb(--color-good)

	.name
		cursor: pointer
		padding-right: 6 * $r
		i
			
			margin-right: 10px
			width: 20px
			font-size: 0.9em
			opacity: 0.7
		span
			font-weight: 700
			font-size: 1em
.factorsWrapper

	::v-deep
		.infopt
			display: none
.showmore
	cursor: pointer
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
			factorsshowed : false,
			infoShowed : false
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


		showinfo : function(){
			this.infoShowed = !this.infoShowed
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
