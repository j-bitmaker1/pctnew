<template>
<div class="part" :class="name + (customscroll ? ' customscroll' : '') + ' ' + (cls || '')" :style="style">
	<transition name="fade">
		<slot name="content" v-if="active">
		</slot>
	</transition>
</div>
</template>

<style scoped lang="sass">
.fade-enter-active, .fade-leave-active
	transition: opacity .3s

.fade-enter, .fade-leave-to
	opacity: 0
</style>

<script>
import {
	mapState
} from 'vuex';

export default {
	name: 'summary_widget',
	props: {
		name : String,
		customscroll : Boolean,
		widgets : Object,
		cls : String
	},
	computed: mapState({
		auth: state => state.auth,
		widget(){
			return this.widgets.widgets[this.name]
		},
		style(){

			if(!this.widget) return ''

			var styles = []

			if(this.widget.width) styles.push('min-width: ' + this.widget.width + '%')
			if(this.widget.width) styles.push('max-width: ' + this.widget.width + '%')
			if(this.widget.sticky) styles.push('position:sticky')
			if(this.widget.snap) styles.push('scroll-snap-align:' + this.widget.snap)

			return styles.join(';')
		},

		active(){
			return this.widget.active || this.widget.sticky || false
		}
	}),

	methods: {

	},
}
</script>
