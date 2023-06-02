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
					id : 'filemanager',
					text : 'menu.filemanager',
					icon : "fas fa-eye",
					action : this.filemanager
				},

                {
					id : 'questionnaire',
					text : 'menu.questionnaire',
					icon : "fas fa-link",
					action : this.sharequestionnaire

				},
                /*{
					id : 'ai',
					text : 'menu.ai',
					svg : "logoai.svg",
					action : this.openai,
					features : ['AI'],

				}*/

                /*{
                    route : '/help',
					id : 'help',
					text : 'menu.help', 
					icon : "fas fa-info",
				},*/

                /**/

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


        openai: function () {

			this.core.vueapi.openai()
			
		},

        close : function(){
            this.$emit('close')
        },

        open : function(item){
			if(item.route) {
				this.$router.push(item.route).catch(e => {})
			}

			if(item.action) item.action()
		},

        add : function(){

            this.core.vueapi.addMenu()

        },

        tohelp : function(){
            this.$router.push("/faq").catch(e => {})
        },

        filemanager : function(){
            this.core.vueapi.fileManager({
			}, {
				
			})
        }
    },
}