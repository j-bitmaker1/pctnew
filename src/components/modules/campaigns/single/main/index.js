import { mapState } from 'vuex';

import status from '../../status/index.vue'
import f from "@/application/shared/functions.js"
export default {
    name: 'campaigns_batch_main',
    props: {
        campaign : Object
    },

    components : {
        status
    },
    data : function(){

        return {
            loading : true,
            steps : []
        }

    },

    created() {
        this.load()
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
        stickerdefault : function(){
            var ar = ['s1.png', 's2.png', 's3.png']

            return ar[f.rand(0, ar.length - 1)]
        }
    }),

    methods : {
        load : function(){

            console.log('this.campaign', this.campaign)

            this.loading = true
            this.core.api.campaigns.single.steps(this.campaign.Id).then(r => {
                this.steps = r
            }).finally(() => {
                this.loading = false
            })
        }
    },
}