import { mapState } from 'vuex';

export default {
    name: 'pages_question',
    props: {
        question : Object,
        values : Object
    },

    data : function(){

        return {
            loading : false,
            result : null
        }

    },

    created () {
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
        cannext : function(){
            return this.result ? true : false
        },
        qvalues : function(){
            return this.values[this.question.id]
        }
    }),

    methods : {
        input : function(result){
            this.result = result
        },

        back : function(){
            this.$emit('back')
        },

        next : function(){
            this.$emit('next', this.result)
        }
    },
}