<template>
<div class="part" :class="name + (customscroll ? ' customscroll' : '')" :style="style">
	<slot name="content" v-if="active">
    </slot>
</div>
</template>

<style scoped lang="sass">

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
		widgets : Object
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
			if(this.widget.sticky) styles.push('position:sticky')

			return styles.join(';')
		},

		active(){
			return true
			
			//this.widget.active || this.widget.sticky
		}
	}),

	methods: {

	},
}
</script>
