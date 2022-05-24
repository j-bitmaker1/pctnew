<template>
<span class="tags">
	<span class="tag" v-for="(tag,i) in tags">#{{tag.replace(/ /g,"_").toLowerCase()}} </span>
</span>
</template>

<style scoped lang="sass">
.tag
	font-size: 0.9em
	color : srgb(--color-txt-ac-1)
</style>

<script>
import {
	mapState
} from 'vuex';

export default {
	name: 'tags',
	props: {
		tags: Array
	},
	computed: mapState({
		auth: state => state.auth,
	}),

	methods: {
		click : function(tag){
			this.$emit('click', tag)
		}
	},
}
</script>
