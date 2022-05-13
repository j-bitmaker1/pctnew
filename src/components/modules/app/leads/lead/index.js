import { mapState } from 'vuex';

export default {
    name: 'leads_lead',
    props: {
        profile : Object
    },

    data : function(){

        return {
            loading : false,

            menu : [
                {
                    text : 'labels.editlead',
                    icon : 'fas fa-pen',
                    action : 'edit'
                },
                {
                    text : 'labels.deletelead',
                    icon : 'fas fa-trash',
                    action : 'delete'

                }
            ]
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
        menuaction : function(action){
            if (this[action]){
                this[action]()
            }   
        },

        edit : function(){
            console.log("ASAS")
        },

        delete : function(){
            console.log("ASAS2")
        }
    },
}