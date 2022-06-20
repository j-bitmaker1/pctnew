import { _ } from 'core-js';
import { mapState } from 'vuex';

export default {
    name: 'licence',
    props: {
    },

    data : function(){

        return {
            loading : false,

            product : this.core.user.product
        }

    },

    created : () => {

    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,

        need : function(state) {
            return _.filter((this.$route.query.need || "").split(","), v => {return v})
        },

        needMap : function(){
            var m = {}
            _.each(this.need, (v) => {m[v] = true})

            return m
        },

        myfeatures : state => state.features,

        features : function(){
            return _.sortBy(this.product, (v) => {

                if(_.indexOf(this.need, v.id) > -1) return 0

                if(this.myfeatures[v.id]) return 1

                return 2
            })
        }
    }),

    methods : {
        gettrial : function(product){
            console.log('product', product)
            return this.core.api.user.trial.activate(product.id, {
                preloader : true,
                showStatus : true
            })
        },

        gettrials : function(){

            console.log("/")

            var productsForTrial = _.filter(this.product, (product) => {
                return product.trial && !this.myfeatures[product.id]
            })

            console.log('productsForTrial', productsForTrial)

            return Promise.all(_.map(productsForTrial, product => {
                return this.gettrial(product)
            }))
        }
    },
}