import { mapState } from 'vuex';

export default {
    name: 'settings_pdf',
    props: {
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
    }),

    methods : {
        editDisclosure : function(){
            this.core.vueapi.editorjs({
                initial : {}
            }, (edited) => {
                console.log("edited", edited)
            },{
                caption : "Edit disclosure"
            })
        }
    },
}