import _ from 'underscore';
import { mapState } from 'vuex';

export default {
    name: 'assets_edit',
    props: {
        ticker : String,
        name : String,
        value : Number
    },

    data : function(){

        return {
            loading : false,
            namestring : '',
            searchresult : []
            
        }

    },

    created : () => {

    },

    watch: {
        namestring : function(){

            if (this.namestring.length > 0 && this.namestring.length < 10){
                this.search()
            }

        }
    },
    computed: mapState({
        auth : state => state.auth,
    }),

    methods : {
        namechange : _.debounce(function(e) {
            this.namestring = e.target.value
        }),

        search : function(){

            if(!this.namestring) return

            this.core.api.pctapi.assets.search({
                searchStr : this.namestring
            }).then(r => {

                this.searchresult = _.first(r || [], 5)


            }).catch(e => {
                console.error(e)
            })
            
        },

        focus : function(){
            this.search()
        },

        blur : function(){
            setTimeout(e => {
                this.searchresult = []
            }, 200)
            
        },

        select : function(item){

            this.searchresult = []
            this.namestring = ''

            this.changed({
                ticker : item.ticker,
                name : item.name
            })
            
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