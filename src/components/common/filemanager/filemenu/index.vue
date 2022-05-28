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
import f from '@/application/functions';
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

		},

		openOriginal : function(){

			var type = f.deep(this.file, 'info.ContentType')

            this.core.filemanager.original(this.file.id, type).then(file => {
                
				this.core.filehandler(file)

            }).finally(() => {
            })
		}
	},
}
</script>
