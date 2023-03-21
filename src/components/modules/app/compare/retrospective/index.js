import { mapState } from 'vuex';


export default {
    name: 'compare_retrospective',
    props: {
        ids : Array
    },

    components : {
        
    },

    data : function(){

        return {
            loading : false,
            portfolios : [],
        }

    },

    created (){
        this.load()
    },

    watch: {
        ids : {
            immediate : true,
            handler : function(){
                this.load()
            }
        }
    },
    computed: mapState({
        auth : state => state.auth,

        options : function(){
            var o = {height : 300}

            return o
        }
    }),

    methods : {
        changeperiod : function(e){
			this.period = Number(e.target.value)
		},

		changestd : function(e){
			this.current_std = Number(e.target.value)
		},

        load : function(){

            this.loading = true

            this.core.api.pctapi.portfolios.gets(this.ids).then(r => {

                this.portfolios = r
                
            }).finally(() => {
                this.loading = false
            })
        },

        
    },
}