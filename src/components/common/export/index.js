
import { mapState } from 'vuex';

export default {
    name: 'export',
    props: {
        api : String,
        previewApi : String,

        parameters : {
            type : Array,
            default : () => {
                return [
                    {
                        id : 'date',
                        text : 'fields.daterange',
                        input : 'date',
                        type : 'datetime-local',
                        rules : [],
                        
                        range : true,
                        options : {
                            max : new Date()
                        }
                    }
                ]
            }
        }
    },

    data : function(){

        return {
            loading : false,
            payload : {},
            itemsForExport : undefined
        }

    },

    created() {
        console.log('api', this.api, this.previewApi)
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,

        valid : function(){
            return !_.isEmpty(this.payload)
        },


    }),

    methods : {
        change : function(v){
            this.payload = v

            console.log("V", v)
        },

        preview : function(){

            if(this.previewApi){

                this.loading = true

                this.core.api[this.previewApi](this.payload, {
                  
                }).then(r => {
                    this.itemsForExport = r
                }).finally(() => {
                    this.loading = false
                })

            }
        },

        run : function(){

            this.core.api[this.api](this.payload, {
                preloader : true,
                showStatus : true
            }).then(r => {
                this.close()
            })

        },

        close : function(){
            this.$emit('close')
        },

        cancel : function(){
            this.$emit('cancel')
            this.close()
        }
    },
}