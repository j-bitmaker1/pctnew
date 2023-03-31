import { mapState } from 'vuex';
import buylist from '../buylist/index.vue';
export default {
    name: 'buylists_lists',
    props: {
    },

    components : {
        buylist
    },

    data : function(){

        return {
            loading : false,
            buylists : [],
            searchvalue : ''
        }

    },

    created : () => {

    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,

        filtered : function(){
            if(this.searchvalue){

                return f.clientsearch(this.searchvalue, this.buylists, (l) => {
                    return (l.name)
                })
            }
            else{
                return this.buylists
            }
        },
    }),

    methods : {
        search : function(v){
            this.searchvalue = v
        },

        select : function(v){
            this.$emit('select', v)
            this.$emit('close')
        },

        createbuylist : function(){
            
        }
    },
}