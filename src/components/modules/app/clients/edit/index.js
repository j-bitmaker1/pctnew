import { mapState } from 'vuex';

export default {
    name: 'clients_edit',
    props: {
    },

    data : function(){

        return {
            loading : false,

            fields : [
                {
                    id : 'email',
                    text : 'fields.email',
                    type : 'email',

                    rules : [
                        {
                            rule : 'required'
                        }
                    ]
                },

                {
                    id : 'firstname',
                    text : 'fields.firstname',
                    type : '',

                    rules : [
                        {
                            rule : 'required'
                        }
                    ]
                },

                {
                    id : 'lastname',
                    text : 'fields.lastname',
                    type : '',

                    rules : [
                        {
                            rule : 'required'
                        }
                    ]
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
        haschanges : function(){
            return true
        }
    }),

    methods : {
        save : function(){
            var r = this.$refs['form'].get()

            if (r){

                this.$emit('close')
                
            }
        },
        cancel : function(){
            this.$emit('close')
        }
    },
}