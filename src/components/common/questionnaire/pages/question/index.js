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

        //this.$refs.fields.getinternal()
        
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
        initial : function(result){
            this.result = result
        },
        input : function(result){
            this.result = result

            if (this.result && this.question.forceNext){
                this.next()

                return
            }

            if (this.result)
                this.$emit('input', this.result)
        },

        back : function(){
            this.$emit('back')
        },

        next : function(){
            this.$emit('next', this.result)
        },

        focus : function(){
            this.$refs['fields'].focusOnIntput()
        }
    },
}