<template>
<div class="filemanager_filemenu">
	<tooltip>
		<template v-slot:item>
			<div :class="buttonclass">
				<i class="fas fa-ellipsis-v"></i>
			</div>
		</template>

		<template v-slot:content="i">
			<listmenu :items="menu" :close="i.close"/>
		</template>

	</tooltip>
</div>
</template>

<style scoped lang="sass">

</style>

<script>
import {
	mapState
} from 'vuex';
import f from '@/application/shared/functions.js';
export default {
	name: 'filemanager_filemenu',
	props: {
		file: Object,
		buttonclass : {
			type : String,
			default : 'buttonpanel'
		}
	},
	computed: mapState({
		auth: state => state.auth,

		menu : function(){

			return [
				{
					text : 'labels.openOriginal',
					icon : 'fas fa-search',
					action : this.openOriginal
				},
				{
					text : 'labels.deleteFile',
					icon : 'fas fa-trash',
					action : this.deleteFile
				}
			]
		}

	}),

	methods: {
		deleteFile : function(){
			this.core.api.tasks.delete(this.file.id, {
				preloader : true
			}).then(r => {
				this.$emit('deleted')
			})
		},

		open : function(file){

            this.core.api.tasks.getattachment(file.StorageKey, this.file.id/*, file.ContentType*/).then(r => {

				this.core.filehandler(r, {
					name : file.FileName
				})

            }).finally(() => {
            })
		},

		openOriginal : function(){

			if (this.file.info && this.file.info.length){
				if (this.file.info.length == 1){
					this.open(this.file.info[0])

					return
				}
			}

			
		}
	},
}
</script>
