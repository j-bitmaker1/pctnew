import _ from 'underscore';
import { mapState } from 'vuex';

export default {
    name: 'clients_edit',
    props: {
        edit : Object,
        payload : {
            type : Object,
            default : () => {return {}}
        },

        editing : {
            type : Boolean,
            default : true
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

        schema : state => state.crmschemas.contact,

        generalFields : function(){
            var f = this.schema.general.fields

            f = _.filter(f, (f) => {
                return !this.payload[f.id]
            })

            return f
        },

        additionalFields : function(){
            var f = this.schema.additional.fields

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