<template>
<div class="customTimeInput">
	<div class="inputWrapper day">

		<div class="arrows up" @click="e => arrow(1, 'd')">
			<i class="fas fa-arrow-up"></i>
		</div>
		<div class="input">
			<select class="custom" v-model="dvalue">
                <option :value="v.value" v-for="(v, i) in day" :key="i">{{v.text}}</option>
            </select>
		</div>
	
		<div class="label">
			<span>Day</span>
		</div>
		<div class="arrows down" @click="e => arrow(-1, 'd')">
			<i class="fas fa-arrow-down"></i>
		</div>

	</div>

	<div class="inputsWrapper">
		<div class="inputWrapper">
			<div class="arrows up" @click="e => arrow(1, 'h')">
				<i class="fas fa-arrow-up"></i>
			</div>
			<div class="input">
				<input type="number"  placeholder="0" v-model="hvalue"/>
			</div>
		
			<div class="label">
				<div class="commonlabel">
					<span>Time (HH:MM)</span>
				</div>
			</div>
			<div class="arrows down" @click="e => arrow(-1, 'h')">
				<i class="fas fa-arrow-down"></i>
			</div>

		</div>

		<div class="inputWrapper">
			<div class="arrows up" @click="e => arrow(1, 'm')">
				<i class="fas fa-arrow-up"></i>
			</div>
			<div class="input">
				<input type="number"  placeholder="0" v-model="mvalue"/>
			</div>
		
			<div class="label">
				
			</div>
			<div class="arrows down" @click="e => arrow(-1, 'm')">
				<i class="fas fa-arrow-down"></i>
			</div>

		</div>
	</div>
</div>
</template>

<style scoped lang="sass">
.inputsWrapper
	display: flex
.customTimeInput
	display: flex

	.inputWrapper
		flex-grow: 2
		display: flex
		flex-direction: column

		&.day
			flex-grow: 3
			flex-basis: 50%

		.label
			height: 24px
			line-height: 24px
			text-align: center
			position: relative

			.commonlabel
				position: absolute
				left: 0
				top : 0
				height: 100%
				width: 200%
			span
				color : srgb(--color-txt-ac)
				font-size: 0.7em

		.arrows
			opacity: 0.5
			text-align: center
			padding : $r
			i
				font-size: 0.8em

		select,
		input
			text-align: center
			width : 100%
			height: 44px
			

		input
			background: srgb(--background-total-theme)

		&:nth-last-child(1)
			input
				border-top-right-radius: 24px
				border-bottom-right-radius: 24px
		&:nth-child(1)
			input
				border-top-left-radius: 24px
				border-bottom-left-radius: 24px

		&.day
			select
				border-radius: 24px
			
</style>

<script>

export default {
	name: 'weekday',
	model: {
        prop: 'modelValue',
        event: 'update:modelValue'
    },
	props: {
		modelValue : {
			type : Object,
			default : function() {
				return {
					day : 0,
					time : 0
				}
			}
		}
	},

	

	data : function(){
		return {
			day : [
				{
					value : 1,
					text : "Monday"
				},
				{
					value : 2,
					text : "Tuesday"
				},
				{
					value : 3,
					text : "Wednesday"
				},
				{
					value : 4,
					text : "Thursday"
				},
				{
					value : 5,
					text : "Friday"
				},
				{
					value : 6,
					text : "Saturday"
				},
				{
					value : 7,
					text : "Sunday"
				},
			],
			inputs : {
				d : {
					name : 'Day',
				},
				h : {
					name : 'Hours',
				},
				m : {
					name : 'Minutes',
				}
			}
		}
	},

	computed: {
       
		dvalue : {
			get(){
				return this.modelValue.day
			},
			set(value){

				if(value < 0) value = 0

				value = Number(value)

				this.updateday(value)
			}
		},

		hvalue : {
			get(){
				return Math.floor((this.modelValue.time) / 3600)
			},
			set(value){

				value = Number(value)

				if(value < 0) value = 0
				if(value > 23) value = 23

				this.update({h : value})
			}
		},

		mvalue : {
			get(){
				return Math.floor((this.modelValue.time - this.hvalue * 3600) / 60)
			},
			set(value){

				value = Number(value)

				if(value < 0) value = 0
				if(value > 59) value = 59

				this.update({m : value})
			}
		}
    },

	methods: {
		update : function({h,m}){

			var v = 
				(typeof h == 'undefined'? this.hvalue : h) * 3600 + 
				(typeof m == 'undefined'? this.mvalue : m) * 60

			this.$emit('update:modelValue', {
				day : this.dvalue,
				time : v
			})
		},

		updateday : function(v){
			this.$emit('update:modelValue', {
				day : v,
				time : this.hvalue * 3600 + this.mvalue * 1
			})
		},

		arrow : function(inc, i){
			this[i + 'value'] = this[i + 'value'] + inc
		}
	},
}
</script>
