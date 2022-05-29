import _ from 'underscore';
import { mapState } from 'vuex';

export default {
    name: 'assets_edit',
    props: {
        ticker : String,
        name : String,
        value : Number,
        isCovered : Boolean
    },

    data : function(){

        return {
            loading : false,
            namestring : '',
            focused : false
        }

    },

    created : () => {

    },

    watch: {
        namestring : _.debounce(function(){

            /*if (this.namestring.length > 0 && this.namestring.length < 10){
                this.search()
            }*/

        })
    },
    computed: mapState({
        auth : state => state.auth,
    }),

    methods : {
        namechange : function(e) {
            this.namestring = e.target.value
        },

        search : function(){

            this.core.vueapi.searchAssets((item) => {
                this.changed({
                    ticker : item.ticker,
                    name : item.name,
                    isCovered : true //// from search true
                })
            })

            
        },

        focus : function(e){
            this.focused = true

            this.search()

            this.$emit('focus')

            this.$el.closest('.customscroll').scrollTop = e.target.offsetTop - 100

        },

        blur : function(){

            this.focused = false

            setTimeout(e => {

                if (this.ticker){
                    this.namestring = ''
                }

                
            }, 200)

            this.$emit('blur')
            
        },

        select : function(item){

            this.changed({
                ticker : item.ticker,
                name : item.name,
                isCovered : true //// from search true
            })

            this.namestring = ''
            
        },

        changevalue : function(e){
            this.changed({
                value : Number(e.target.value)
            })
        },

        changed : function(v){
            this.$emit('changed', v)
        },

        autofocus : function(){

            if (this.ticker){
                this.$refs['valueinput'].focus()
            }
            else{
                this.$refs['nameinput'].focus()
            }
        }
    },
}