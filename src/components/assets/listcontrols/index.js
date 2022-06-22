import { mapState } from 'vuex';

export default {
    name: 'listcontrols',
    
    props: {
        searchvalue : String,
        count : Number,
        sorting : {
            type : Object,
            default : () => {return {}}
        },
        listdate : {
            type : Array,
            default : () => {return []}
        },
        sortvalue : String,
        activity : String,
        datepicker : Object

    },


    data : function(){

        return {
            loading : false,
        }

    },

    created : () => {

    },

    watch: {
        //$route: 'getdata'
    },
    computed: {
        date: {
            get() {
                return this.listdate
            },
            set(value) {

                this.$emit('date', value)
            }
        },

        ...mapState({
            auth : state => state.auth,
        })
    },
    

    methods : {
        search : function(v){
            this.$emit('search', v)
        },
        sort : function(e){
            this.$emit('sort', e.target.value)
        }
    },
}