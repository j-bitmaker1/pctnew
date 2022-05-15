import { mapState } from 'vuex';

import portfolio from '../portfolio/index.vue'

export default {
    name: 'portfolios_list',
    props: {
        additional : Object,
        actions : {
            type : Array,
            default : () => {return []}
        },
        select : Object
    },

    components : {
        portfolio
    },

    data : function(){

        return {
            loading : false,
            searchvalue : '',
            count : 0,
            sort : 'FName_asc',
            sorting : {
                FName_asc : {
                    text : 'fname_asc',
                    field : 'FName',
                    sort : 'asc'
                },
                FName_desc : {
                    text : 'fname_desc',
                    field : 'FName',
                    sort : 'desc'
                }
            },

            selected : null,
            
        }

    },

    created : () => {

    },

    watch: {
        tscrolly : function(){

            if (this.$refs['list']){

                if (this.$refs['list'].height() - 1000 < this.tscrolly + this.dheight){
                    this.$refs['list'].next()
                }
                
            }
            
        }
    },
    computed: mapState({
        dheight: state => state.dheight,
        tscrolly : state => state.tscrolly,
        auth : state => state.auth,

        payload : function(){
            return {
                IncludePositions : true,
                ... this.additional || {}
            }
        },

        menu : function(){

            if (this.select){
                return this.select.actions
            }

            return [

                ... this.actions,

                {
                    text : 'labels.deleteportfolios',
                    icon : 'fas fa-trash',
                    action : 'deleteportfolios'
                }
                
            ]
        }
    }),

    methods : {
        open : function(portfolio){

            if (this.select){
                this.$emit('selected', [portfolio])
            }
            else{
                this.$router.push('portfolio?id=' + portfolio.id)
            }

            
        },

        search : function(v){
            this.searchvalue = v
        },

        setcount : function(v){
            this.count = v
        },

        sortchange : function(v){
            this.sort = v
        },

        selectionSuccess : function(portfolios){
            this.selected = portfolios
        },

        closeselected : function(){
            this.selected = null
        },

        menuaction : function(action){
            if (this[action]){
                this[action]()
            }   
        },

        deleteportfolios : function(){

        },

        setportfoliostoclient : function(){
            this.$emit('selected', [this.selected])
            this.selected = null
        }

    },
}