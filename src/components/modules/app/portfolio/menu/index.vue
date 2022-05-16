<template>
<div class="portfolio_menu">
    <tooltip>
        <template v-slot:item>
            <div :class="buttonclass">
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
    name: 'portfolio_menu',
    props: {
        portfolio: Object,
        buttonclass : {
            type : String,
            default : 'buttonpanel'
        }
    },
    computed: mapState({
        auth: state => state.auth,

        menu : function(){

            var menu = [
                
                {
                    text : 'labels.editportfolio',
                    icon : 'fas fa-pen',
                    action : 'edit'
                },
                {
                    text : 'labels.deleteportfolio',
                    icon : 'fas fa-trash',
                    action : 'delete'
                }
            ]

            return menu
        
        }

    }),

    methods: {
        menuaction : function(action, item){
            if (this[action]){
                this[action]()
            }   
        },

        edit : function(){
            
            this.$store.commit('OPEN_MODAL', {
                id : 'modal_portfolio_edit',
                module : "portfolio_edit",
                caption : "Edit Portfolio",
                data : {
                    edit : {
                        name : this.portfolio.name,
                        assets : this.portfolio.positions,
                        id : this.portfolio.id
                    }
                }
            })

        },

        delete : function(){
        }

        
    },
}
</script>
