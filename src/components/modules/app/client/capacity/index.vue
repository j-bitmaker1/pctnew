<template>
<div id="client_capacity">
	<div v-if="!loading">
	
		<div class="linenavigation" v-if="questionnaire && fromsettings">
			<linenavigation :items="navigation" :navdefault="navdefault" :navkey="navkey"/>
		</div>
		
		<capacity :initial="capacityValues" @change="change" ref="capacity"/>

		<div class="savePanel" v-if="profile">
			<button class="button black" v-if="haschanges" @click="cancel">
				Cancel
			</button>
			<button class="button" :disabled="!haschanges" @click="save">
				Save Changes
			</button>
		</div>

		<div class="savePanel" v-else>
			<button class="button" :disabled="!haschanges" @click="addclient">
				<i class="fas fa-plus"></i> Create client
			</button>
		</div>
	</div>
	<linepreloader v-else />
	

</div>
</template>

<style scoped lang="sass">
#client_capacity
	padding-left: $r

::v-deep
	.stickedTop
		top : 0px

@media only screen and (max-width: 768px)
	#client_capacity
		padding-left: 0
</style>

<script>
import {
	mapState
} from 'vuex';

import {Settings} from "@/application/shared/settings";

import linenavigation from "@/components/assets/linenavigation/index.vue";

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
			fromsettings : null,

			navigation : [
				{
					text : 'labels.capacityfromquestionnaire',
					id : 'questionnaire',
					icon : 'far fa-question-circle'
				},
				{
					text : 'labels.capacityfromdefault',
					id : 'default',
					icon : 'fas fa-sliders-h'
				}
				
			],
			navdefault : 'default',
			navkey : 'source',
		}
	},
	components : {
		capacity, 
		linenavigation
	},
	computed: mapState({
		auth: state => state.auth,
		haschanges : function(){

			if(!this.capacity || !this.capacity.values || _.isEmpty(this.capacity.values)) return false

			return JSON.stringify(this.capacity.values) != JSON.stringify(this.capacityValues)
		},

		capacityValues : function(){

			if (this.fromsettings && this.questionnaire){
				if(this.active == this.navdefault) {
					return this.fromsettings
				}
				else return this.core.pct.riskscore.convertQrToCapacity(this.questionnaire.capacity)
			}

			if (this.fromsettings) return this.fromsettings
			if (this.questionnaire) return this.core.pct.riskscore.convertQrToCapacity(this.questionnaire.capacity)
		
			return {"ages":[20,40],"savings":10000,"save":0,"salary":200000,"savemoreRange":[20,40],"withdrawRange":[20,40],"withdraw":0}
		
		},

		settingsKey : function(){

			if(!this.profile) return


			return 'capacity_' + this.profile.ID
		},

		active : function(){
			return this.$route.query[this.navkey] || this.navdefault
		},
	}),

	created(){
	},	

	watch : {
		profile : {
			immediate : true,
			handler : function(){
				this.load()
			}
		},

		active : function(){
			if (this.$refs['capacity']){
				setTimeout(() => {
					this.$refs['capacity'].init()
				}, 20)
				
				console.log("???")
			}
				
		}
	},

	methods: {
		change : function(v){
			this.capacity = v
		},

		addclient : function(){
			this.core.vueapi.newClient((client) => {

				this.$emit('profilechanged', client)

				//this.profile = client

				/*setTimeout(() => {

					this.getSettings().then(() => {
						return this.save()
					}).then(() => {
						this.$router.push('client/' + this.profile.ID).catch(e => {})
					})

				}, 50)*/

				

			})
		},

		save : function(){

			if (this.core.dynamicSettings[this.settingsKey]){
				//this.$store.commit('globalpreloader', true)

				this.fromsettings = _.clone(this.capacity.values)

				this.core.dynamicSettings[this.settingsKey].set('values_' + this.profile.ID, this.fromsettings)


				//console.log('this.capacity', this.capacity.capacity)
				this.core.api.crm.contacts.updateCapacity(this.profile.ID, this.capacity.capacity.toFixed(0))

				if(this.active != this.navdefault){
					this.$router.replace({
						query : {
							... this.$route.query,
							... {
								[this.navkey] : this.navdefault
							}
						}
					}).catch(e => {})
				}
			}
		},	

		cancel : function(){
			this.capacity = null

			if(this.$refs['capacity']) this.$refs['capacity'].init()
		},


		load : function(){
			this.loading = true
			
			return this.core.crm.loadQuestionnaireWithSettings(this.profile).then((r) => {

				this.questionnaire = r.questionnaire
				this.fromsettings = r.fromsettings

			}).finally(() => {
				this.loading = false
			}).catch(e => {
				console.error(e)
			})

			

		}
	},
}
</script>
