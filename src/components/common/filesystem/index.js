import _ from 'underscore';
import { mapState } from 'vuex';

export default {
    name: 'filesystem',
    props: {
        initialroot : Number,
        select : Object
    },

    data : function(){

        return {
            loading : false,
            contents : [],
            currentroot : undefined,
            history : []
        }

    },

    created : function() {
        this.history.push(this.root)

        this.load()
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
        root : function(){

            if(typeof currentroot != 'undefined') return currentroot

            return this.initialroot || 0

        },

        showback : function(){

            if (this.history.length > 1) return true

            console.log('this.root', this.root)

            return this.root ? true : false
        },

        sorted : function(){
            return _.sortBy(this.contents, function(c){

                if(c.type == 'directory') return 0
                if(c.type == 'portfolio') return 1

            })
        }
    }),

    methods : {
        load : function(){
            this.loading = true

            return this.core.api.filesystem.get(this.root).then(r => {

                this.contents = r

                return Promise.resolve(r)
            }).finally(() => {
                this.loading = false
            })
        },

        down : function(r){
            this.currentroot = r
            this.history.push(r)

            this.load().then(r => {
                this.movescroll()
            })
        },

        up : function(){
            if (this.history.length > 1){
                this.currentroot = this.history[this.history.length - 2]
                this.history.pop();
            }
            else{
                this.currentroot = 0
            }

            console.log('this.history', this.history)

            this.load().then(r => {
                this.movescroll()
            })

            
        },

        movescroll : function(){
            setTimeout(() => {
                this.$refs['items'].scrollLeft = 0
            }, 50)

            console.log('movescroll')
        },

        open : function(c){
            if (c.type == 'directory'){
                this.down(c.id)
            }

            if(c.type == 'portfolio'){
                if(this.select) this.$emit('selectFile', c)
            }
        }
    },
}