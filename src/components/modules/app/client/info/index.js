import { mapState } from 'vuex';

export default {
    name: 'client_info',
    props: {
        profile : Object
    },

    data : function(){

        return {
            loading : false
        }

    },

    created (){
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
        schema : state => state.crmschemas.contact
    }),

    methods : {
       
    },
}