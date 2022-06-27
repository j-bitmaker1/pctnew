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
			<button class="button">Select email</button>
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

	.whileselector
		margin-top: 2 * $r
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

export default {
	name: 'campaigns_steps_edit_notification',
	props: {
		step: Object
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

	components : {
		timeInput,
		daytimeInput,
		weekdayInput
	},

	data : function(){
		return {
			weekdaytime : {
				days : 0,
				time : 0
			},
			daytime : {
				days : 0,
				time : 0
			},
			time : 0,
			selectwhile : false,
			timemode : 'time' // nextday, day
		}
	},

	created : function(){
		this.time = this.step.time || 0

		this.daytime = {
			days : this.step.days >= 8 ? this.step.days : 0,
			time : this.step.time || 0
		}

		this.weekdaytime = {
			days : this.step.days < 8 && this.step.days > 0 ? this.step.days : 1,
			time : this.step.time || 0
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
				clone.days = this.daytime.days
			}

			if(this.timemode == 'day'){
				clone.time = this.weekdaytime.time
				clone.days = this.weekdaytime.days
			}


			this.$emit('change', clone)
		},

		settimemode : function(v){
			this.timemode = v
		}
	},
}
</script>
