<template>
<div id="filesystem_edit">
	<edit @save="save" @close="close" :schema="schema" :edit="values"/>
</div>
</template>

<style scoped lang="sass">

</style>

<script>
import {
	mapState
} from 'vuex';

import edit from '@/components/common/edit/index.vue'

export default {
	name: 'filesystem_edit',
	props: {
		values: Object,
		schema : Object
	},
	components : {
		edit
	},
	computed: mapState({
		auth: state => state.auth,
	}),

	methods: {
		
		close : function(){
			this.$emit('close')
		},

		cancel : function(){
			this.close()
		},

		save: function(data){
			this.$emit('save', data)
			this.close()
		},
	},
}
</script>
