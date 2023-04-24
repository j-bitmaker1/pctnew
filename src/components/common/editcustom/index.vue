<template>
<div id="filesystem_edit">
	<edit @save="save" @close="close" :schema="schema" :edit="values" :ignoreerrors="ignoreerrors"/>
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
		schema : Object,
		ignoreerrors : Boolean
	},
	components : {
		edit
	},
	computed: mapState({
		auth: state => state.auth,
	}),

	created(){
		console.log('schema', this.schema)
	},

	methods: {
		
		close : function(){
			this.$emit('close')
		},

		cancel : function(){
			this.close()
		},

		save: function(data){

			console.log('data', data)

			this.$emit('save', data)
			this.close()
		},
	},
}
</script>
