import { mapState } from 'vuex';

export default {
    name: 'portfolios_list',
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
                IncludePositions : true
                //crmContactIdFilter : 0
            }
        }
    }),

    methods : {
        select : function(){

        }
    },
}