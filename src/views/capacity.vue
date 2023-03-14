<template>
<div class="page">

	<topheader :back="mobileview ? 'back' : ''">
		<template v-slot:info>
			<div class="capacityheader">
				<div class="forheader">
					<span>Capacity</span>
				</div>

				<div class="forclient">
					<div class="profileWrapper" v-if="profile">
						<div id="clientprofile">
							

							<div class="data" v-if="profile">
								<b>{{profile.FName}} {{profile.LName}},</b>&nbsp;<avalue :value="profile.Email"/>
							</div>
							<div class="userpicWrapper">
								<userpic :userinfo="profile || {}" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</template>
		<template v-slot:right>
			<div class="buttonpanel">
				<button class="button small" @click="getclient">Select client</button>
				<i class="fas fa-link" @click="sharequestionnaire"></i>
			</div>

			
		</template>
	</topheader>

	<maincontent>
		<template v-slot:content>

			<div class="componentWrapper" v-if="id">
				
				<capacity :ids="ids" :profile="profile" v-if="profile"/>

				<div class="loading" v-else>
					<linepreloader />
				</div>
			</div>

			<div class="empty mobp" v-if="!id">
				<span>Please select a client to view Capacity report</span>
			</div>
			
		</template>
	</maincontent>

</div>
</template>

<style scoped lang="sass">

.capacityheader
	display: flex
	align-items: center
.forclient
	margin-left: auto

#clientprofile
	justify-content: center
	align-items: center
	display: flex

	::v-deep
		span
			font-size: 0.8em!important

	span
		font-size: 1em!important

	.userpicWrapper
		max-width: 33px
		width: 33px
		height: 33px


	.data
		margin-right: $r
		display: flex
		font-size: 0.8em
			
.componentWrapper

.golast
	text-align: center
	padding : 3 * $r 0
.empty
	text-align: center
	padding : 6 * $r 0

	span
		font-size: 0.9em

::v-deep
	.header 
		align-items: center
		justify-content: center
		.result
			margin-left: 0
		.caption
			display: flex
			margin-right: 2 * $r
</style>

<script>
import capacity from "@/components/modules/app/client/capacity/index.vue";

import { mapState } from 'vuex';
export default {
	name: 'capacity_page',
	components: {
		capacity
	},

	computed: {
		id : function(){
			return this.$route.query.id || null
		},
		
		...mapState({
			mobileview : state => state.mobileview,
		})
	},

	watch : {
		id : {
			immediate : true,
			handler : function(){

				if(this.id){

					this.core.api.crm.contacts.get(this.id).then(r => {

						this.profile = r

						return Promise.resolve(r)
					}).catch(e => {

						this.error = e

					}).finally(() => {
					})

				}
				else{
					this.profile = null
				}

				
			}
		}
	},

	data : function(){
		return {
			profile : null,
			error : null
		}
	},

	methods: {
		getclient : function(){

			this.core.vueapi.selectContacts((contacts) => {

				this.$router.replace({
                    query : {
                        ... this.$route.query,
                        ... {
							id : contacts[0].ID
						}
                    }
                }).catch(e => {})

			}, {
				one : true
			})
		},

		sharequestionnaire : function(){
			this.core.vueapi.sharequestionnaire()
		}
	},

	created() {
	}
}
</script>
