import { mapState } from 'vuex';

export default {
    name: 'fastmenu',
    props: {
    },

    data : function(){

        return {
            loading : false,
            allitems : [
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
					icon : "fas fa-list-ul",
                    features : ['PCT'],
				},

                {
                    route : '/campaigns',
					id : 'campaigns',
					text : 'menu.campaigns', 
					icon : "fas fa-route",
                    
                    features : ['CAMPAIGN'],
				},

                {
                    route : '/help',
					id : 'help',
					text : 'menu.help', 
					icon : "fas fa-info",
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

        items : function(state){
            return _.filter(this.allitems, (item) => {
				return !item.features || _.find(item.features, (f) => {
					return state.features[f]
				})
			})
        }
    }),

    methods : {
        explore : function(){
			this.core.vueapi.explore()
		},

        sharequestionnaire: function () {

			this.core.activity.template('action', this.core.activity.actions.sharequestionnaire())
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