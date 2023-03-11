<template>
<div class="page">

	<topheader :back="mobileview ? 'back' : ''">
		<template v-slot:info>
			<span>Capacity</span>
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
				<div class="profileWrapper" v-if="profile">
					<div id="clientprofile">
						<div class="userpicWrapper">
							<userpic :userinfo="profile || {}" />
						</div>

						<div class="data" v-if="profile">
							<div class="name">{{profile.FName}} {{profile.LName}}</div>
							<div class="email"><avalue :value="profile.Email"/></div>
						</div>
					</div>
				</div>
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

#clientprofile
	display: column
	justify-content: center
	align-items: center
	text-align: center
	margin-bottom: 2 * $r

	.userpicWrapper
		max-width: 80px
		margin : 0 auto

	.data
		.name
			font-size: 1.2em
			font-weight: 700
		.email
			font-size: 0.8em
			
.componentWrapper
	margin-top: 2 * $r

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
