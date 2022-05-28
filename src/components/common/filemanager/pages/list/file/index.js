import { mapState } from 'vuex';
import f from '@/application/functions';

import filepreview from '../../../filepreview/index.vue'
import filemenu from '../../../filemenu/index.vue'

export default {
    name: 'filemanager_list_file',
    props: {
        file : Object
    },

    components : {filepreview, filemenu},

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

            var size = f.deep(this.file, 'info.Size')

            if(!size) return 0

            return f.formatBytes(size)
        }
    }),

    methods : {
        
    },
}