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
			//questionnaire : {"capacity":{"age":20,"retire":50,"save":45555,"savings":0,"salary":23444},"questions":{"q1":2,"q2":1,"q3":1,"q4":2,"q5":1,"q6":4}}
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