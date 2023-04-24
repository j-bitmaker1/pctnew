<template>
<div class="abspage">

	<topheader :back="back">
	  <template v-slot:info>
		<logotype />
	  </template>
	</topheader>

	<maincontent>
		<template v-slot:content>
			<linepreloader v-if="loading"/>
			
			<div class="wrapper" v-if="info && !finished">

				<riskscore v-if="!previous" :includeTolerance="includeTolerance" :info="info" :token="token" @save="savelocal" @finish="finish"/>
				<div v-if="previous" class="previous mobp">
					<div class="question">
						<span>Do you want to proceed previous questionnaire?</span>
					</div>

					<div class="savePanel">
						<button class="button black" @click="clearAndStart">
							No
						</button>

						<button class="button" @click="proceed">
							Yes
						</button>
					</div>
				</div>

			</div>

			<div class="finished" v-if="finished">
				<div class="finished mobp">
					<div class="question">
						<span>Thank you for completing the survey! You can close this window.</span>
					</div>

				</div>
			</div>

			<div class="empty" v-if="!loading && !info">
				<span>Questionnaire not found, try reloading the page or ask the adviser for another link</span>
			</div>
		</template>
	</maincontent>

</div>
</template>

<style scoped lang="sass">
.finished,
.previous
	padding: 2 * $r
	padding-right: 0
	max-width: 640px
	margin : 0 auto
	.question
		margin-top : 2 * $r
		margin-bottom: 2 * $r
		max-width: 80%
		span
			font-size: 2em
#riskscore
	position: absolute
	left: 0
	top: 0
	bottom: 0
	right: 0
.empty
	padding : 4 * $r
	text-align: center
	opacity: 0.8

::v-deep
	.stickedTop
		top : 0
</style>

<script>

import riskscore from "@/components/modules/app/riskscore/index.vue";
import { mapState } from 'vuex';

export default {
	name: 'riskscore_page',
	components: {
        riskscore
	},

	data : function(){
		return {
			loading : true,
			info : null,
			previous : null,
			finished : false,
			key : "questionnaire_v2_"
		}
	},

	computed: mapState({
		auth : state => state.auth,
		back : function(){
			if(!this.auth) return null
	
			return "/"
		},

		token : function(){
			return this.$route.params.token
		},

		includeTolerance : function(){


			return this.$route.query.tolerance ? true : false
		}
	}),


	methods: {
		load : function(){
			

			this.core.api.crm.questionnaire.getdata(this.token).then(r => {

				this.info = r

				this.getlocal()

				return Promise.resolve(r)

			}).finally(() => {
				this.loading = false
			})
		},

		savelocal : function(questionnaire){
			if (questionnaire.id){
				localStorage[this.key + this.token] = JSON.stringify(questionnaire)
			}
				
		},

		getlocal : function(){
			if(this.token){
				var d = localStorage[this.key + this.token]

				if(d){
					try{
						this.previous = JSON.parse(d)
					}catch(e){

					}
				}
			}
		},

		clearAndStart : function(){
			localStorage.removeItem(this.key + this.token);
			this.previous = null
		},

		proceed : function(){
			this.info.previous = this.previous
			this.previous = null
		},

		finish : function(){
			localStorage.removeItem(this.key + this.token);
			this.previous = null
			this.finished = true
		}
	},

	created(){
		this.load()
	},

	mounted() {

	}
}
</script>
