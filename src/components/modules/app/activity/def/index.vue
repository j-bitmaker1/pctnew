<template>
<div class="activity_def">
	<div class="row" @click="open" >
		<div class="value" v-if="label">
			<span>{{$t(label)}}</span>
		</div>

		<div class="type" v-if="type">
			<span>{{$t(type)}}</span>
		</div>

        <div v-if="!label && !type"><span>&mdash;</span></div>

		<!---->
	</div>
</div>
</template>

<style scoped lang="sass">
.row
    display: flex
    padding : $r
    padding-left: 0
    align-items: center
    justify-content: space-between

    .type
        margin-left: auto

        span
            font-size: 0.8em
            color : srgb(--color-txt-ac-1)
</style>

<script>
import {
	mapState
} from 'vuex';

export default {
	name: 'activity_def',
	props: {
		label: String,
		type : String
	},
	computed: mapState({
		auth: state => state.auth
	}),

	methods: {
		open : function(){
			this.$emit('open')
		}
	},
}
</script>
