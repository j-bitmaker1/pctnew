import { mapState } from 'vuex';
import appmenu from "@/components/modules/appmenu/index.vue";

export default {
    name: 'root',
    props: {
    },

    data : function(){

        return {
            loading : false
        }

    },
    components : {appmenu},
    created : () => {

    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        
        auth : state => state.auth,
        gallery : state => state.gallery,
        globalpreloader : state => state.globalpreloader,
        online : state => state.online,
        iconshow: function() {
			return this.$store.state.icon ? true : false
		},
    }),

    methods : {
        
    },
}