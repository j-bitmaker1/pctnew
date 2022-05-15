import _ from 'underscore';
import { mapState } from 'vuex';
import f from "@/application/functions.js";
export default {
    name: 'listpaginated',
    props: {
        api : String,
        start: Number,
        from : String,
        to : String,
        selectMultiple : Boolean,
        payload : {
            type : Object,
            default : () => {return {}}
        },

        perpage : {
            type : Number,
            default : 20
        },

        bypages : Boolean,

        elheight : {
			type : Number,
			default : 0
		}
    },

    data : function(){

        return {
            loading : false,
            page : 0,
            refresh : false,
            count : 0,
            records : [],
            end : false,
            controller : null,
        }

    },

    created : function(){
        this.changed()
    },

    watch: {
        api : function(){
            this.changed()
        },

        payload : function(){
            this.changed()
        },
    },
    computed: mapState({
        auth : state => state.auth,
        epayload : function(){
            var epayload = _.clone(this.payload || {})

            if (this.bypages){
                epayload[this.from || "From"] = (this.page) 
            }
            else{
                epayload[this.from || "From"] = (this.page) * this.perpage + (this.start || 0)
            }

            
            epayload[this.to || "To"] = this.perpage

            return epayload
        }
    }),

    methods : {
       
        changed : function(){

            if (this.$refs['list'])
                this.$refs['list'].leaveSelectionMode()

            this.refresh = true
            this.end = false
            this.loading = false

            this.records = []
            this.count = 0
            this.page = 0

            if(this.controller && !this.controller.signal.dontabortable) this.controller.abort()

            this.load()

        },

        height : function(){
            return this.$el.clientHeight
        },  

        load : function(){

            if(this.end) return
            if(this.loading) return

            this.loading = true

            if (typeof AbortController != 'undefined') this.controller = new AbortController()

            this.$emit('loading', this.loading)

            f.deep(this.core.api, this.api)(this.epayload, {

                refresh : this.refresh, 
                controller : this.controller 

            }).then(data => {


                this.refresh = false

                this.records = this.records.concat(data.data)

                if(!this.count)
                    this.count = data.count

                console.log('this.page + 1', this.page + 1, this.perpage, this.count, data)

                if((this.page + 1) * this.perpage < this.count){
                    this.page++
                }
                else{
                    this.end = true
                }


                this.$emit('loaded', data)

                if(data.count) this.$emit('count', data.count)

            }).catch(e => {
                console.error('e', e)

            }).finally(() => {
                this.loading = false

                this.$emit('loading', this.loading)

                this.controller = null
            })
        },

        next : function(){
            this.load()
        },

        click : function(item){
			this.$emit('click', item)
		},

        selectionSuccess : function(v){
            this.$emit('selectionSuccess', v)
        },
        
        selectionCancel : function(){
            this.$emit('selectionCancel')
        }
    },
}