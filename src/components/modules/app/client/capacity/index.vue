<template>
<div id="client_capacity">
	<div v-if="!loading">
		<capacity :initial="capacityValues" @change="change"/>

		<div class="savePanel" v-if="haschanges">
			<button class="button black" @click="cancel">
				Cancel
			</button>
			<button class="button" @click="save">
				Save Changes
			</button>
		</div>
	</div>
	<linepreloader v-else />
	

</div>
</template>

<style scoped lang="sass">
::v-deep
	.stickedTop
		top : 0px
</style>

<script>
import {
	mapState
} from 'vuex';

import capacity from "@/components/modules/app/features/capacity/index.vue"

export default {
	name: 'client_capacity',
	props: {
		profile: Object
	},
	data : function(){
		return {
			capacity : null,
			loading : true,
			questionnaire : null
		}
	},
	components : {
		capacity
	},
	computed: mapState({
		auth: state => state.auth,
		haschanges : function(){

			if(!this.capacity || !this.capacity.values) return false
			if(!this.capacityValues) return false

			return JSON.stringify(this.capacity.values) != JSON.stringify(this.capacityValues)
		},

		capacityValues : function(){

			if(!this.questionnaire) return null

			return this.core.pct.riskscore.convertQrToCapacity(this.questionnaire.capacity)
		}
	}),

	created(){
		this.getQuestionnaire()
	},	

	methods: {
		change : function(v){
			this.capacity = v
		},

		save : function(){

		},	

		cancel : function(){
			this.capacity = null
		},

		getQuestionnaire : function(){

			this.loading = true

			if (this.profile.questionnaire){

				this.core.api.crm.questionnaire.getresult(this.profile.questionnaire).then(r => {
		
					this.questionnaire = r
				}).finally(() => {
					this.loading = false
				})
			}
			else{
				this.loading = false
			}
		}
	},
}
</script>
