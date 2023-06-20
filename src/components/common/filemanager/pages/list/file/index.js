import { mapState } from 'vuex';
import f from '@/application/shared/functions.js';

import filespreview from '../../../filespreview/index.vue'
import filemenu from '../../../filemenu/index.vue'

export default {
    name: 'filemanager_list_file',
    props: {
        file : Object,
        cut : Boolean,
        nomenu : Boolean
    },

    components : {filespreview, filemenu},

    data : function(){

        return {
            loading : false,
            processes : ['PARSEPORTFOLIO', 'CUSTOMFILE']
        }

    },

    created : () => {

    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
        size : function(){

            if(this.file.info && this.file.info.length){
                return f.formatBytes(_.reduce(this.file.info, (m, i) => {
                    return m + i.Size
                }, 0))
            }

            return 0

        },

        name : function(){
            if(this.file.info && this.file.info.length){
                return _.map(this.file.info, (i) => {
                    return i.FileName
                }).join(', ')
            }
        },

        hasassets : function(){
            return _.filter(this.file.data, (d) => {
                return d.Name
            }).length > 0
        },

        tasks : function(state){

            console.log('state._task', this.core.gettasks(this.file))

            return this.core.gettasks(this.file)

            var t = _.filter(state._task, (t) => {
                return t.fileId == this.file.id
            })

            var obj = {}

			_.each(t, (t) => {
				obj[t.type] = t.id
			})

            return obj
        }
    }),

    methods : {
        open : function(e){

			if(f.removePopoverFromEvent(e)) return

            this.$emit('open')
        },

        deleted : function(){
            this.$emit('deleted')
        },

        createPortfolio : function(){

            var portfolio = {
                name : this.file.info[0].FileName,
                assets : []
            }

            portfolio.assets = _.filter(_.map(this.file.data, (d) => {
                if(d.Name){
                    return {
                        isCovered : true,
                        ticker : d.Ticker,
                        value : d.Value,
                        name : d.Name
                    }
                }
            }), (a) => {return a})
            
            this.$emit('createPortfolio', portfolio)
        },

        runprocess : function(i){
            this.$emit('runprocess', i)
        },

        restartprocess : function(i){
            this.$emit('restartprocess', i)
        },
    },
}