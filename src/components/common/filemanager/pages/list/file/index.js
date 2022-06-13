import { mapState } from 'vuex';
import f from '@/application/functions';

import filespreview from '../../../filespreview/index.vue'
import filemenu from '../../../filemenu/index.vue'

export default {
    name: 'filemanager_list_file',
    props: {
        file : Object,
        cut : Boolean
    },

    components : {filespreview, filemenu},

    data : function(){

        return {
            loading : false
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
        }
    }),

    methods : {
        open : function(){
            this.$emit('open')
        },

        deleted : function(){
            this.$emit('deleted')
        },
    },
}