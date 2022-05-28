import { mapState } from 'vuex';

import pages_list from './pages/list/index.vue'
import pages_file from './pages/file/index.vue'


export default {
    name: 'filemanager',
    props: {
    },

    data : function(){

        return {
            loading : false,
            page : {
                key : 'list',
                data : {}
            }
        }

    },

    created (){
        this.core.user.activity.template('action', this.core.user.activity.actions.fileManager())
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
    }),

    methods : {
        uploadFromFileStart : function(){
			//this.$store.commit('globalpreloader', true)
		},

		uploadFromFileUploadedAll : function(){
			//this.$store.commit('globalpreloader', false)
		},

		uploadFromFileUploaded: function(file){

            console.log("file", file)

        },

        uploadFromFileError : function(e){
            if (e.text){
				this.$store.commit('icon', {
					icon: 'error',
					message: e.text
				})
			}
        },

        camera : function(){

            this.core.vueapi.camera((images) => {

            }, {
                title : "Take a photo of a document"
            })

        },

        getmodule : function(){

            if(this.page.key == 'list') return pages_list
            if(this.page.key == 'file') return pages_file
        },
			
    },
}