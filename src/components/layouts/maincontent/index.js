import { mapState } from 'vuex';

export default {
    name: 'maincontent',
    props: {
    },

    components : {

    },

    data : function(){

        return {
            loading : false
        }

    },

    created : () => {

    },

    watch: {
        //$route: 'getdata'
    },

    

    computed: mapState({
        auth : state => state.auth,
        iconshow: function() {
			return this.$store.state.icon ? true : false
		},
       
        modalShowed : state => state.modalShowed,
    }),

    methods : {
     
      
        closeModal : function(){
            this.$store.commit('setmodal', null)
        },

        scroll : function(v){
            this.$refs['scrollable'].scrollTop = v || 0
        },
        
      
    },
}