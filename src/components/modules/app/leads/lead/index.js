import { mapState } from 'vuex';
import profilemenu from "@/components/modules/app/client/menu/index.vue";
export default {
	name: 'leads_lead',
	props: {
		profile : Object,
		hasmenu : {
			type : Boolean,
			default : true
		}
	},

	components : {
		profilemenu
	},

	data : function(){

		return {
			loading : false,

			menu : [
				{
					text : 'labels.editlead',
					icon : 'fas fa-pen',
					action : 'edit'
				},
				{
					text : 'labels.deletelead',
					icon : 'fas fa-trash',
					action : 'delete'

				}
			]
		}

	},

	created : () => {

	},

	watch: {
		//$route: 'getdata'
	},
	computed: mapState({
		auth : state => state.auth,
	}),

	methods : {
		menuaction : function(action){
			if (this[action]){
				this[action]()
			}   
		},

		edit : function(profile){
			this.$emit('edit', profile)
		},

		deletelead : function(){
			this.$emit('deletelead', this.profile)
		},

		open : function(e){
			this.$emit('open', this.profile)
		},

		leadtocontact: function(){
			this.$emit('leadtocontact', this.profile)
		},
	},
}