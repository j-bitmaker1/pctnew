<template>
<div class="customTimeInput">
	<div class="inputWrapper" v-for="(input, i) in inputs">

		<div class="arrows up" @click="e => arrow(1, i)">
			<i class="fas fa-arrow-up"></i>
		</div>
		<div class="input">
			<input type="number" v-if="i == 'd'" placeholder="0" v-model="dvalue"/>
			<input type="number" v-if="i == 'h'" placeholder="0" v-model="hvalue"/>
			<input type="number" v-if="i == 'm'" placeholder="0" v-model="mvalue"/>
		</div>
		<!--<div class="inputscroll">
			<div class="scrolledWrapper">
				<div class="scrolled customscroll notswipable">
					<div class="number" v-for="i in c">
						{{i}}
					</div>
				</div>
			</div>
		</div>-->
		<div class="label">
			<span>{{input.name}}</span>
		</div>
		<div class="arrows down" @click="e => arrow(-1, i)">
			<i class="fas fa-arrow-down"></i>
		</div>

	</div>
</div>
</template>

<style scoped lang="sass">
.customTimeInput
	display: flex

	.inputscroll
		height: 100px
		position: relative
		overflow: hidden
		width: 100px
		margin : 0 auto

		.scrolledWrapper
			top : -50px
			bottom: -50px
			left : 0
			right: 0
			position: absolute
			
			.scrolled
				text-align: center
				left : 0
				bottom: 0
				top : 0
				right : 0
				padding-top: 100px
				padding-bottom: 100px
				position: absolute
				overflow-y: scroll
				scroll-snap-type: y mandatory
				scroll-behavior: smooth

				&::-webkit-scrollbar
					display: none

				.number
					padding : $r
					scroll-snap-align: center

	.inputWrapper
		flex-grow: 2
		display: flex
		flex-direction: column

		.label
			text-align: center
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
			
</style>

<script>

export default {
	name: 'customTimeInput',
	model: {
        prop: 'modelValue',
        event: 'update:modelValue'
    },
	props: {
		modelValue : {
			type : Number,
			default : 0
		}
	},

	

	data : function(){
		return {
			c : 20,
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
				return Math.floor(this.modelValue / (24 * 60))
			},
			set(value){

				if(value < 0) value = 0
				if(value > 365) value = 365

				value = Number(value)

				this.update({d : value})
			}
		},

		hvalue : {
			get(){
				return Math.floor((this.modelValue - this.dvalue * 24 * 60) / 60)
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
				return this.modelValue - this.dvalue * 24 * 60 - this.hvalue * 60
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
		update : function({d,h,m}){

			var v = 
				(typeof d == 'undefined'? this.dvalue : d) * 24 * 60 + 
				(typeof h == 'undefined'? this.hvalue : h) * 60 + 
				(typeof m == 'undefined'? this.mvalue : m) * 1

			console.log("total", v, {d,h,m})

			this.$emit('update:modelValue', v)
		},

		arrow : function(inc, i){
			this[i + 'value'] = this[i + 'value'] + inc
		}
	},
}
</script>
