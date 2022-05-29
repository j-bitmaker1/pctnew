import { mapState } from 'vuex';

export default {
    name: 'sequence',
    props: {
        direction : {
            type : String,
            default : 'horizontal'
        },

        pages : Array
    },

    data : function(){

        return {
            loading : false,
            cur : null
        }

    },

    created(){
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
    }),

    methods : {
        back : function(from){
            var i = _.findIndex(this.pages, {
                id : from
            })

            if (i > 0){
                var id = this.pages[i - 1].id
                
                this.to(id)
            }

            else{
                this.$emit('back')
            }
        },
        next : function(from){
            var i = _.findIndex(this.pages, {
                id : from
            })


            if (i < this.pages.length - 1){
                var id = this.pages[i + 1].id
                
                this.to(id)
            }

            else{
                this.$emit('finish')
            }
        },
        to : function(to){

            this.cur = to

            setTimeout(() => {

                var props = []
                var value = 0

                if(this.direction == 'vertical'){
                    props = ['scrollTop', 'offsetTop']
                }

                if(this.direction == 'horizontal'){
                    props = ['scrollLeft', 'offsetLeft']
                }

                if (to){
                    if (this.$refs[to]){

                        value = this.$refs[to][props[1]]
                    }	
                }


                this.scroll(props[0], value)

                
            }, 50)

        },

        scroll : function(prop, value){
            this.$refs.sequence[prop] = value
        },

        current : function(){
            return this.cur
        }
    },
}