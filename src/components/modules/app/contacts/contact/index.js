import { mapState } from 'vuex';
import profilemenu from "@/components/modules/app/client/menu/index.vue";
export default {
	name: 'contacts_contact',
	props: {
		profile : Object,
		hasmenu : {
			type : Boolean,
			default : true
		}
	},

	components : {profilemenu},

	data : function(){

		return {
			loading : false
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
		edit : function(profile){
			this.$emit('edit', profile)
		},

		deletecontact: function(profile){
			this.$emit('deletecontact', profile)
		},

		open : function(e){
			this.$emit('open', this.profile)
		},

		portfoliosChanged: function(p){
			this.$emit('portfoliosChanged', p)
		},
	},
}