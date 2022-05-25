<template>
<div class="activity_search">
	<div class="row" @click="open">
		<div class="value">
			<span>{{search.value}}</span>
		</div>

		<div class="type">
			<span>{{$t('activity.searches.' + search.type)}}</span>
		</div>

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
	name: 'activity_search',
	props: {
		search: Object
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
