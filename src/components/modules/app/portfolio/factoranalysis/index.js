import { mapState } from 'vuex';
import fmap from './fmap/index.vue'
export default {
    name: 'factoranalysis',
    props: {
        portfolio : Object
    },

    components : {
        fmap
    },

    data : function(){

        return {
            loading : false,

            factors : []
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
        selectfactors : function(index){
            this.core.vueapi.selectfactors({
                select : {
                    disabled : true,
                    context : 'factors'
                }
            }, {
                selected : (factors) => {

                    if(typeof index == 'undefined'){
                        var fs = factors.concat(this.factors)

                            fs = _.filter(fs, (v, i) => {
                                if(i < 2) return true
                            })

                        this.factors = fs
                    }

                    else{
                        this.$set(this.factors, index, factors[0])
                    }

                    
                }
            })
        },

        changeFactor : function(index){
            this.selectfactors(index)
        }
    },
}