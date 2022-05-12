import { mapState } from 'vuex';

import chart from './chart/index.vue'

export default {
    name: 'portfolios_crashtest',
    props: {
    },

    components : {
        chart
    },

    data : function(){

        return {
            loading : false,

            ct : {}
        }

    },

    created : function(){
        this.get()
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
    }),

    methods : {
        get : function(){

            this.loading = true

            this.core.pct.get().then(r => {

                this.ct = r

                console.log('this.ct', this.ct)

                return Promise.resolve(r)
            }).finally(() => {
                this.loading = false
            })
        }
    },
}