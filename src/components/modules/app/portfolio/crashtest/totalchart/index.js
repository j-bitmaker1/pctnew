import { mapState } from 'vuex';
import ctmain from '../main/index.vue'
import crslider from '../crslider/index.vue'
export default {
    name: 'crashtest_totalchart',
    props: {
        portfolios : Object,
        mode : String,
        cts : Object,
        height : Number,
        cpmdata : Array,
        optimize : Number,
        optimizedPortfolio : Object
    },

    components : {
        crslider,
        ctmain
    },

    data : function(){

        return {
            loading : false,
            currentOptimization : null,
            doingoptimization : false
        }

    },

    created(){
        this.loadOptimization()
        this.core.on('settingsUpdated', this.name, (type) => {

			if(type == 'OPTIMIZATION'){
				if(this.currentOptimization) {
                    this.optimization(this.currentOptimization)
                }
			}
		})

    },

    beforeDestroy(){
		this.core.off('settingsUpdated', this.name)
	},

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
    }),

    methods : {

        
        scenarioMouseOver : function(e){
			this.$emit('scenarioMouseOver', e)
		},

        savecurrentOptimization : function(){

            var savedata = null

            if(this.currentOptimization){
                savedata = {
                    ...this.currentOptimization,
                    portfolio : this.optimize
                }
            }

            this.core.setsettings("OPTIMIZATION_RESULT", this.optimize, savedata).then(s => {
                console.log('saved')
            })

        },  

        loadOptimization: function(){

            console.log('loadOptimization')

            this.core.getsettings("OPTIMIZATION_RESULT", this.optimize).then(s => {

                if(s){

                    /*var portfolio = this.portfolios[s.portfolio]
                 
                    this.optimization({
                        ...s,
                        portfolio
                    })*/
                }

            })

        },  

        optimization : function(d){

            if(!d){

                this.currentOptimization = null
                this.savecurrentOptimization()
                this.$emit('optimized', null)

                return
            }

            this.doingoptimization = d

            this.core.pct.optimization(d.portfolio, {
                ocr : d.ocr,
                scenario : d.scenario
            }).then(optimizedPorftolio => {

                this.currentOptimization = d

                this.savecurrentOptimization()

                this.$emit('optimized', optimizedPorftolio)

            }).catch(e => {

                this.$store.commit('icon', {
					icon: 'error',
					message: e.error
				})

                console.error(e)

            }).finally(() => {
                this.doingoptimization = false
            })
        }
    },
}