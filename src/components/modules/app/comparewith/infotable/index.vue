<template>
	<div class="infotable">
        <div class="line" :class="field.id" v-for="field in fields" v-if="showzero || data[field.id]">
            <div class="wrapper">
                <div class="label">
                    <span>{{$t(type + '.' + field.id)}}</span> 
                </div>
                <div class="forvalue" >
                
                    <template v-if="!(field.type == 'date' && !data[field.id])">
                        <span v-if="field.type == 'string'">{{data[field.id]}}</span>
                        <date v-if="field.type == 'date'" :date="data[field.id]" />
                        <value v-if="field.type == 'p' || field.type == 'd'" :mode="field.type" :value="data[field.id] || 0" />
                    </template>

                    <template v-else>
                        <span>&mdash;</span>
                    </template>

                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="sass">
.infotable
	display: flex
	align-items: center
	flex-wrap: wrap
	padding : 0.5 * $r

	.label
		span
			font-size: 0.8em
			font-weight: 700

	.wrapper
		padding : $r
		border-radius: 12px
		background: srgb(--neutral-grad-0)

	>div
		max-width: 50%
		padding : 0.5 * $r

		&.term
			min-width: 200px
			.wrapper
				background: srgb(--color-bg-ac)
				color : srgb(--text-on-bg-shadow-color)
</style>

<script>
import {
	mapState
} from 'vuex';

export default {
	name: 'comparewith_infotable',
	props: {
		fields: Array,
		data : Object,
		type : String,
		showzero : Boolean
	},
	computed: mapState({
		auth: state => state.auth,
	}),

	methods: {

	},
}
</script>
