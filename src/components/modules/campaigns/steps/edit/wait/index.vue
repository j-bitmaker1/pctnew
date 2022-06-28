<template>
<div id="campaigns_steps_edit_wait">

	<div class="modes mobp">

		<div class="mode" :class="{selected : timemode == 'time'}">
			<div class="header" @click="e => settimemode('time')">
				<div class="iconWrapper">
					<i class="far fa-circle"></i>
				</div>
				<div class="label">
					<span>Time interval</span>
				</div>
			</div>
			<div class="modecnt" v-if="timemode == 'time'">
				<timeInput v-model="time"/>
			</div>
		</div>

		<div class="mode" :class="{selected : timemode == 'nextday'}">
			<div class="header" @click="e => settimemode('nextday')">
				<div class="iconWrapper">
					<i class="far fa-circle"></i>
				</div>
				<div class="label">
					<span>In next day(s)</span>
				</div>
			</div>
			<div class="modecnt" v-if="timemode == 'nextday'">
				<daytimeInput v-model="daytime" :ddiff="8"/>
			</div>
		</div>

		<div class="mode" :class="{selected : timemode == 'day'}">
			<div class="header" @click="e => settimemode('day')">
				<div class="iconWrapper">
					<i class="far fa-circle"></i>
				</div>
				<div class="label">
					<span>On this day of the week</span>
				</div>
			</div>
			<div class="modecnt" v-if="timemode == 'day'">
				<weekdayInput v-model="weekdaytime"/>
			</div>
		</div>

	</div>

	<div class="while mobp">

		<div class="whwrapper">
			<div><checkboxtoggle v-model="whilemode"/></div>
			<div class="label"><span>Or wait until the email has been read</span></div>
		</div>
		
		<div class="whileselector" v-if="whilemode">
			<div class="stepWrapper" v-if="this.while">
				<step :step="this.while" />
			</div>
			<button class="button" @click="selectWhile" v-if="!this.while">Select email</button>
			<button class="button black" @click="selectWhile" v-if="this.while">Change email</button>
		</div>
	</div>


	<div class="descriptionCaption">
		<span>Descrtiption</span>
	</div>
	<div class="description mobp">
		<span>This step adds waiting to the campaign process.</span>
	</div>

	<div class="stickerWrapper">
		<sticker src="hourglass.png" :width="128"/>
	</div>
	

</div>
</template>

<style scoped lang="sass">
.whwrapper
	display: flex
	grid-gap: $r
	align-items: center

.while
	margin-top: 2 * $r
	margin-bottom: 2 * $r

	.stepWrapper
		margin-bottom: 2 * $r

	.whileselector
		margin-top: 2 * $r

	::v-deep
		.step_meta
			display: flex
			align-items: center
		.wrapper
			padding-bottom: 0
		.icontime
			.time
				display: none

.mode
	padding : 2 * $r 0
	.modecnt
		margin-top: 2 * $r
		padding : $r 2 * $r
		background: srgb(--neutral-grad-0)
		border-radius: 12px
	.header
		display: flex
		grid-gap: $r
		align-items: flex-start
	&.selected
		.header
			color : srgb(--color-txt-ac)
			.iconWrapper
				i:before
					content: "\f058"
</style>

<script>
import {
	mapState
} from 'vuex';

import timeInput from '../../../inputs/time/index.vue'
import daytimeInput from '../../../inputs/daytime/index.vue'
import weekdayInput from '../../../inputs/weekday/index.vue'

import step from '../../step/index.vue'

export default {
	name: 'campaigns_steps_edit_notification',
	props: {
		step: Object,
		steps : Array
	},

	components : {
		timeInput,
		daytimeInput,
		weekdayInput,
		step
	},

	computed: {
		whilemode : {
			get : function(){
				return this.selectwhile || this.step.while
			},

			set : function(v){
				if(v) this.selectwhile = true

				if(!v && !this.step.while) this.selectwhile = false
			}
		},
		...mapState({
			auth: state => state.auth
		})
	},

	watch : {
		timemode : function(){
			this.change()
		},

		time: function(){
			this.change()
		},

		daytime : {
			deep : true,
			handler : function(){
				this.change()
			}
		},

		weekdaytime : {
			deep : true,
			handler : function(){
				this.change()
			}
		}
	},

	

	data : function(){
		return {
			weekdaytime : {
				day : 0,
				time : 0
			},
			daytime : {
				day : 0,
				time : 0
			},
			time : 0,
			selectwhile : false,
			while : null,
			timemode : 'time' // nextday, day
		}
	},

	created : function(){
		this.time = this.step.time || 0

		this.daytime = {
			day : this.step.day >= 8 ? this.step.day : 0,
			time : this.step.time || 0
		}

		this.weekdaytime = {
			day : this.step.day < 8 && this.step.day > 0 ? this.step.day : 1,
			time : this.step.time || 0
		}

		console.log('this.step.while', this.step.while)

		if (this.step.while){

			var refer = _.find(this.steps, (s) => {
				return s.id == this.step.while
			})

			this.selectwhile = true

			if (refer){
				this.while = refer
			}

			
			
		}

		
	},

	methods: {
		
		change : function(){
			var clone = this.step.clone()

			if(this.timemode == 'time'){
				clone.time = this.time
			}

			if(this.timemode == 'nextday'){
				clone.time = this.daytime.time
				clone.day = this.daytime.day
			}

			if(this.timemode == 'day'){
				clone.time = this.weekdaytime.time
				clone.day = this.weekdaytime.day
			}

			if(this.selectwhile && this.while){
				clone.while = this.while.id
			}


			this.$emit('change', clone)
		},

		settimemode : function(v){
			this.timemode = v
		},

		selectWhile : function(){
			this.core.vueapi.customWindow(
            	'modules/campaigns/steps/selectemails/index.vue', 
            	"Select email for condition", 
				{
					steps : this.steps,
					selected : this.while ? this.while.id : null
				},

				{
					select : (step) => {
						this.while = step
					}
				}
			).catch(e => {

			})
		}
	},
}
</script>
