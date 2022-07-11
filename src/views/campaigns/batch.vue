<template>
<div class="page">

	<topheader back="back">
		<template v-slot:info>
			<div class="header" v-if="!loading && batch">
				<div class="name">
					{{batch.Name}}
				</div>

				<div class="template">
					{{batch.TemplateName}}
				</div>

			</div>
		</template>
		<template v-slot:right>
			<batchmenu @deletebatch="deletebatch" v-if="!loading && batch" :batch="batch"/>
		</template>
	</topheader>

	<maincontent>
		<template v-slot:content>

			<linepreloader v-if="loading"/>

			<batchmain v-if="!loading && batch" :batch="batch"/>

		</template>
	</maincontent>

</div>
</template>

<style scoped lang="sass">
.name
	font-weight : 700
	font-size: 1.3em
	white-space: nowrap
	overflow: hidden
	text-overflow: ellipsis
	max-width: 90%
.template
	font-size: 0.9em
	color : srgb(--color-txt-ac)

</style>

<script>

import batchmain from '@/components/modules/campaigns/batch/main/index.vue'
import batchmenu from '@/components/modules/campaigns/batch/menu/index.vue'
export default {
	name: 'batch_page',
	components: {
        batchmain,
		batchmenu,
	},

	data : function(){
		return {
			batch : null,
			loading : true,
		}
	},

	computed: {
        id : function(){
            return this.$route.params.id
        }
	},

	methods: {
        load : function(){

			this.loading = true

            this.core.api.campaigns.batches.get(this.id).then(r => {
				console.log("R", r)
				this.batch = r
			}).finally(() => {
				this.loading = false
			})
        },

		deletebatch : function(){
			this.$router.replace('/campaigns?p=campaigns')
		}
	},

	created(){
		this.load()
	},

	mounted() {
		
	}
}
</script>
