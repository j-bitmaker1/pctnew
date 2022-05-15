import _ from 'underscore';
import { mapState } from 'vuex';

export default {
    name: 'clients_edit',
    props: {
        edit : Object,
        payload : {
            type : Object,
            default : () => {return {}}
        }
    },

    data : function(){

        return {
            loading : false,

            general : {
                email : '',
                lastname : '',
                firstname : '',
                status : ''
            },

            additional : {
                title : '',
                country : '',
                state : '',
                city : '',
                zip : '',
                phone : ''
            }

        }

    },

    created : () => {

    },

    watch: {
       
    },
    computed: mapState({
        auth : state => state.auth,
        haschanges : function(){
            return true
        },

        generalFields : function(){
            var f = [
                
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
                },

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
                    id : 'status',
                    text : 'fields.status',
                    type : '',

                    input : 'select',

                    values : [
                        {
                            text : 'fields.deleted',
                            value : 'deleted',
                        },
                        {
                            text : 'fields.newlead',
                            value : 'newlead',
                        },
                        {
                            text : 'fields.client',
                            value : 'client',
                        }

                    ],

                    rules : [
                        {
                            rule : 'required'
                        }
                    ]
                }
                
            ]

            f = _.filter(f, (f) => {
                return !this.payload[f.id]
            })


            return f
        },

        additionalFields : function(){
            var f = [

                {
                    id : 'title',
                    text : 'fields.title',
                    type : '',

                    rules : [
                       
                    ]
                },

                {
                    id : 'country',
                    text : 'fields.country',
                    type : '',
                    placeholder : "",
                    rules : [
                       
                    ]
                },

                {
                    id : 'state',
                    text : 'fields.state',
                    type : '',
                    placeholder : "NY",
                    rules : [
                       
                    ]
                },

                {
                    id : 'city',
                    text : 'fields.city',
                    type : '',
                    placeholder : "",
                    rules : [
                       
                    ]
                },

                {
                    id : 'zip',
                    text : 'fields.zip',
                    type : '',
                    placeholder : "10003",
                    rules : [
                       
                    ]
                },

                {
                    id : 'phone',
                    text : 'fields.phone',
                    type : 'tel',
                    placeholder : "",
                    rules : [
                       
                    ]
                }
            ]

            f = _.filter(f, (f) => {
                return !this.payload[f.id]
            })

            return f
        }
    }),

    methods : {
        save : function(){
            var r = this.$refs['general'].get()
            var a = this.$refs['additional'].get()

            if (r && a){

                var data = {
                    ... a || {},
                    ... r || {},
                    ... this.payload || {}
                }

                if(this.edit){

                    action = this.core.crm.contacts.update({
                        id : this.edit.id,
                        ... data
                    })
                }
                else{
    
                    action = this.core.crm.contacts.add({
                        ... data
                    })
                   
                }
    
                this.$store.commit('globalpreloader', true)
    
                action.then(r => {
    
                    this.$store.commit('icon', {
                        icon: 'success',
                    })
    
                    this.$emit('close')
    
                }).catch((e = {}) => {
    
                    this.$store.commit('icon', {
                        icon: 'error',
                        message: e.error
                    })
                    
                }).finally(() => {
                    this.$store.commit('globalpreloader', false)
                })

            }
        },
        cancel : function(){
            this.$emit('close')
        },

        changeGeneral : function(general){
            console.log('general', general)
        },

        changeAdditional : function(additional){
            console.log('additional', additional)
        }
    },
}