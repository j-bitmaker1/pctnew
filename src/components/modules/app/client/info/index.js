import { mapState } from 'vuex';
import questionnaire from '../questionnaire/index.vue'

export default {
	name: 'client_info',
	props: {
		profile : Object
	},

	components : {
		questionnaire
	},

	data : function(){

		return {
			loading : false,
			questionnaire : null
		}

	},

	created (){
		this.getQuestionnaire()
	},

	watch: {
		//$route: 'getdata'
	},
	computed: mapState({
		auth : state => state.auth,
		schema : state => state.crmschemas.contact,

	}),

	methods : {
		getQuestionnaire : function(){

			if (this.profile.questionnaire){
				this.core.api.crm.questionnaire.getresult(this.profile.questionnaire).then(r => {
					this.questionnaire = r
				}).catch(e => {
					console.error("E")
				})
			}
		}
	},
}