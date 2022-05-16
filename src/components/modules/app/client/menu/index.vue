<template>
<div class="client_menu">
    <tooltip>
        <template v-slot:item>
            <div class="buttonpanel">
                <i class="fas fa-ellipsis-v"></i>
            </div>
        </template>

        <template v-slot:content="i">
            <listmenu :items="menu" @action="menuaction" :close="i.close"/>
        </template>

    </tooltip>
</div>
</template>

<style scoped lang="sass">

</style>

<script>
import {
    mapState
} from 'vuex';

export default {
    name: 'client_menu',
    props: {
        profile: Object
    },
    computed: mapState({
        auth: state => state.auth,

        menu : function(){
            return [
                {
                    text : 'labels.editclient',
                    icon : 'fas fa-pen',
                    action : 'editclient'
                },
                {
                    text : 'labels.deleteclients',
                    icon : 'fas fa-trash',
                    action : 'deleteclient'
                }
            ]
        }

    }),

    methods: {
        menuaction : function(action, item){
            if (this[action]){
                this[action]()
            }   
        },

        deleteclient : function(c){
           
        },

        editclient : function(){

            this.$store.commit('OPEN_MODAL', {
                id : 'modal_client_edit',
                module : "client_edit",
                caption : "Edit client",

                data : {
                    edit : this.profile
                },

                events : {
                    success : (data) => {
                        var profile = _.extend(this.profile, data)

                        this.$emit('edit', profile)
                    }
                }
            })
        }
    },
}
</script>
