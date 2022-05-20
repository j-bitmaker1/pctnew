<template>
<div id="riskscore_secondpart">
	<sequence @finish="finish" @back="goback" ref="sequence" :pages="resultPages" direction="vertical">
		<template v-slot:default="slotProps">

			<component @change="v => {change(v, slotProps.item)}" :initial="capacity" :points="points" :values="values"  v-if="getmodule(slotProps.item)" :is="getmodule(slotProps.item)" v-bind="slotProps.item.data || {}" />

			<div class="savePanel">
				<button class="button black" @click="e => back(slotProps.item)">
					Back
				</button>
				<button class="button" @click="e => next(slotProps.item)">
					Next
				</button>
			</div>

		</template>
	</sequence>
</div>
</template>

<style scoped lang="sass">

#riskscore_secondpart
	width: 100%
	height: 100%

	::v-deep

		.sequence
			scroll-snap-type : none

		.stepcaption
			padding : 2 * $r
			span
				font-size: 1.5em
				font-weight: 700

		.stepsubcaption
			padding : 2 * $r

			span
				font-size: 0.9em

</style>

<script>
import {
	mapState
} from 'vuex';
import sequence from "@/components/common/sequence/index.vue";
import capacity from "../capacity/index.vue"
import risk from "../risk/index.vue"

export default {
	name: 'riskscore_secondpart',
	props: {
		values: {
			type: Object,
			default: () => {
				return {}
			}
		},
		points: Number,

		capacityValues : {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	components: {
		capacity,
		risk,
		sequence
	},
	computed: mapState({
		auth: state => state.auth,
		capacity : function(){

			var capacityValues = this.capacityValues

			return {
				ages : [capacityValues.age, capacityValues.retire],
				savings : capacityValues.savings,
				save : capacityValues.save,
				salary : capacityValues.salary * 12,
				savemoreRange : [capacityValues.age, capacityValues.retire],
				withdrawRange : [0,0],
				withdraw : 0
			}
		},
		resultPages: function () {
			var pages = []

			pages.push({
				id: 'risklevel',
				type: 'risk',
				data: {

				}
			})

			pages.push({
				id: 'capacity',
				type: 'capacity',
				data: {

				}
			})

			return pages
		}
	}),

	methods: {
		finish: function () {
			this.$emit('finish')
		},

		next : function(page, result){
			this.$refs['sequence'].next(page.id)
		},

		goback : function(){
			this.$emit('back')
		},

		back : function(page){

			this.$refs['sequence'].back(page.id)

		},

		capacityToQr : function(values){
			if(!values) return null

			var converted = {
				age : values.age[0],
				retire : values.age[1],
				save : values.save,
				saving : values.saving,
				salary : values.salary / 12
			}

			return converted
		},

		change : function(value, page){
			if(page.type == 'risk') this.$emit('changecr', value)
			if(page.type == 'capacity') this.$emit('changecapacity', this.capacityToQr(value))
		},

		getmodule: function (page) {

			if (page.type == 'capacity') return capacity
			if (page.type == 'risk') return risk

		}
	},
}
</script>
