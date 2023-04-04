<template>
<div id="filesystem_edit">
	<edit @success="success" :payload="payload" @cancel="cancel" @close="close" :schema="schema" :update="update" :create="create" index="id" :edit="edit"/>
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
		edit: Object,
		type : String,
		rootid : String
	},
	components : {
		edit
	},
	computed: mapState({
		auth: state => state.auth,
		payload : function(){
			return {
				catalogId : this.rootid
			}
		},
		schema : function(){

			if (this.type == 'folder'){
				return {
					fields : [
						{
							id : 'name',
							text : 'fields.foldername',
							rules : [{
								rule : 'required'
							}]
						}
					]
				}
			}
			
		},

		create : function(){
			return 'filesystem.create.' + this.type
		},

		update : function(){
			return 'filesystem.update.' + this.type
		}
	}),

	methods: {
		
		close : function(){
			this.$emit('close')
		},

		cancel : function(){
			this.close()
		},

		success: function(data){
			this.$emit('success', data)
			this.close()
		},
	},
}
</script>
