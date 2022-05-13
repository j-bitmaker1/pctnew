import { mapState } from 'vuex';

import linenavigation from "@/components/assets/linenavigation/index.vue";
import distribution from "../distribution/index.vue";
import allocation from "../allocation/index.vue";
import assets from "../assets/index.vue";

export default {
    name: 'portfolios_shares',
    props: {
    },

    components : {
        linenavigation,
        allocation,
        distribution,
        assets
    },

    data : function(){

        return {
            loading : false,
            navigation : [
                {
                    text : 'labels.assetslist',
                    id : 'assets',
                    icon : 'fas fa-list'
                   
                },

                {
                    text : 'labels.allocation',
                    id : 'allocation',
                    icon : 'fas fa-chart-pie'
                   
                },
                
                {
                    text : 'labels.distribution',
                    id : 'distribution',
                    icon : 'fas fa-chart-area'
                   
                },
             
            ],
            navkey : 's',
            navdefault : 'assets',

            assets : []
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
        active : function(){
            return this.$route.query[this.navkey] || this.navdefault
        },
        module : function(){
            return this.active
        }
    }),

    methods : {
        get : function(){

            this.loading = true

            this.core.pct.getassets().then(r => {

                this.assets = r

                return Promise.resolve(r)
            }).finally(() => {
                this.loading = false
            })
        },

    },
}