<template>
<div class="customTimeInput">
	<div class="inputWrapper day">

		<div class="arrows up" @click="e => arrow(1, 'd')">
			<i class="fas fa-arrow-up"></i>
		</div>
		<div class="input">
			<input type="number" placeholder="0" v-model="dvalue"/>
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

		input
			text-align: center
			width : 100%
			height: 44px
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
			input
				border-radius: 24px
			
</style>

<script>

export default {
	name: 'daytime',
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
		},
		ddiff : {
			type : Number,
			default : 0
		}
	},

	

	data : function(){
		return {
			inputs : {
				d : {
					name : 'Days',
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
				return this.modelValue.day ? this.modelValue.day - this.ddiff : 0
			},
			set(value){

				if(value < 0) value = 0

				value = Number(value)

				this.updateday(value)
			}
		},

		hvalue : {
			get(){
				return Math.floor((this.modelValue.time) / 60)
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
				return this.modelValue.time - this.hvalue * 60
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
				(typeof h == 'undefined'? this.hvalue : h) * 60 + 
				(typeof m == 'undefined'? this.mvalue : m) * 1

			this.$emit('update:modelValue', {
				day : this.dvalue + this.ddiff,
				time : v
			})
		},

		updateday : function(v){
			this.$emit('update:modelValue', {
				day : v + this.ddiff,
				time : this.hvalue * 60 + this.mvalue * 1
			})
		},

		arrow : function(inc, i){
			this[i + 'value'] = this[i + 'value'] + inc
		}
	},
}
</script>
