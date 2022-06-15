import { mapState } from 'vuex';

export default {
    name: 'fastmenu',
    props: {
    },

    data : function(){

        return {
            loading : false,
            items : [
                {
					id : 'explore',
					text : 'menu.explore',
					icon : "fas fa-search",
					action : this.explore
				},
                {
					id : 'add',
					text : 'menu.add',
					icon : "fas fa-plus",
					action : this.add 
				},
                {
                    route : '/profile',
					id : 'profile',
					text : 'menu.profile', 
					icon : "fas fa-user"
				},

                {
                    route : '/compare',
					id : 'compare',
					text : 'menu.compare', 
					icon : "fas fa-list-ul"
				},

                /*{
					id : 'questionnaire',
					text : 'menu.questionnaire',
					icon : "fas fa-link",
					action : this.sharequestionnaire

				}*/

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
        explore : function(){
			this.core.vueapi.explore()
		},

        sharequestionnaire: function () {

			this.core.user.activity.template('action', this.core.user.activity.actions.sharequestionnaire())
			this.core.vueapi.sharequestionnaire()
			
		},

        close : function(){
            this.$emit('close')
        },

        open : function(item){
			if(item.route) {
				this.$router.push(item.route)
			}

			if(item.action) item.action()
		},

        add : function(){

            this.core.vueapi.addMenu()

        },

        tohelp : function(){
            this.$router.push("/faq")
        }
    },
}