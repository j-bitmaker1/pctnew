
import { mapState } from 'vuex';

import f from '@/application/shared/functions.js'

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

        cpayload : function(){
            var d = {}

            if (this.payload.date){
                d.date = {
                    start : this.payload.date[0],
                    end : this.payload.date[1]
                }
            }

            return d
        }


    }),

    methods : {
        change : function(v){
            this.payload = v

            this.preview()

            console.log("V", v)
        },

        preview : function(){

            console.log('this.cpayload', this.cpayload)

            if(this.previewApi){

                this.loading = true

                f.deep(this.core.api, this.previewApi)(this.cpayload, {
                  
                }).then(r => {
                    this.itemsForExport = r
                }).finally(() => {
                    this.loading = false
                })

            }
        },

        run : function(){

            f.deep(this.core.api,this.api)(this.cpayload, {
                preloader : true,
            }).then(r => {

                this.core.vueapi.share({
                    files : [r]
                })

                /*this.core.filehandler(r, {
					name : "Exporting"
				})*/

                console.log("R", r)
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