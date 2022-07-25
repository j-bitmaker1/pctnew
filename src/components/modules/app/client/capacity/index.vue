<template>
<div id="client_capacity">
	<div v-if="!loading">
		<capacity :initial="capacityValues" @change="change" ref="capacity"/>

		<div class="savePanel">
			<button class="button black" v-if="haschanges" @click="cancel">
				Cancel
			</button>
			<button class="button" :disabled="!haschanges" @click="save">
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

import {Settings} from "@/application/shared/settings";


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
			questionnaire : null,
			fromsettings : null
		}
	},
	components : {
		capacity
	},
	computed: mapState({
		auth: state => state.auth,
		haschanges : function(){

			if(!this.capacity || !this.capacity.values || _.isEmpty(this.capacity.values)) return false

			return JSON.stringify(this.capacity.values) != JSON.stringify(this.capacityValues)
		},

		capacityValues : function(){


			if (this.fromsettings) return this.fromsettings

			if (this.questionnaire) return this.core.pct.riskscore.convertQrToCapacity(this.questionnaire.capacity)
		
			return null
		
		},

		settingsKey : function(){

			if(!this.profile) return


			return 'capacity_' + this.profile.ID
		}
	}),

	created(){
	},	

	watch : {
		profile : {
			immediate : true,
			handler : function(){
				this.load()
			}
		}
	},

	methods: {
		change : function(v){
			this.capacity = v
		},

		save : function(){

			if (this.core.dynamicSettings[this.settingsKey]){
				//this.$store.commit('globalpreloader', true)

				this.fromsettings = _.clone(this.capacity.values)

				this.core.dynamicSettings[this.settingsKey].set('values', this.fromsettings)
			}
		},	

		cancel : function(){
			this.capacity = null

			if(this.$refs['capacity']) this.$refs['capacity'].init()
		},

		getSettings : function(){

			//if(!this.settingsKey) return Promise.resolve()

			if(!this.core.dynamicSettings[this.settingsKey]){
				this.core.dynamicSettings[this.settingsKey] = new Settings(this.core, 'CAPACITYVALUES', {
					'CAPACITYVALUES' : {
						values : {
							name: 'values',
							default: function() {
								return null
							}
						}
					}
				})
			}

			return this.core.dynamicSettings[this.settingsKey].getall().then(d => {
				console.log("D", d)
				this.fromsettings = d.values.value
			})
		},

		getQuestionnaire : function(){

			if (this.profile.questionnaire){
				return this.core.api.crm.questionnaire.getresult(this.profile.questionnaire).then(r => {
					this.questionnaire = r
				})
			}
			else{

				return Promise.resolve()
			}


		},

		load : function(){
			this.loading = true
			return Promise.all([this.getSettings(), this.getQuestionnaire()]).finally(() => {
				this.loading = false
			}).catch(e => {
				console.error(e)
			})
		}
	},
}
</script>
