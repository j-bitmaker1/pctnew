import { mapState } from 'vuex';

import filepreview from '../list/file/index.vue'
import asset from './asset/index.vue'


export default {
    name: 'filemanager_pages_file',
    props: {
        file : Object
    },

    components : {
        filepreview,
        asset
    },

    data : function(){

        return {
            loading : false
        }

    },

    created() {
        console.log('this.file', this.file)
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
        haschanges : function(){
            return false
        },
        menu : function(){
			return [
				
				{
					text : 'labels.deleteitems',
					icon : 'fas fa-trash',
					action : this.deleteitems
				}

			]
		},
    }),

    methods : {
        save : function(){

        },
        cancel : function(){
            this.close()
        },
        close : function(){
            this.$emit('close')
        }
    },
}