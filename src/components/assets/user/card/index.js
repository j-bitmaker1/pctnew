import _ from 'underscore';
import { mapState } from 'vuex';

export default {
    name: 'user_card',
    props: {
        userinfo : {
            type : Object,
            default : {}
        }
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

        empty : function(){
            return _.isEmpty(this.userinfo) 
        }
    }),

    methods : {
        
    },
}