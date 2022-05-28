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
        uploaded : function(data){
            
            this.$store.commit('globalpreloader', true)

            var results = []

            return Promise.all(_.map(data, (d) => {

                return this.core.filemanager.upload(d.file).then(r => {
                    console.log("R", r)
                    results.push(r)
                    return Promise.resolve()
                })

            })).then(() => {

                console.log("results", results)

                if (this.$refs.page && this.$refs.page.load)
                    this.$refs.page.load()

                this.$store.commit('icon', {
                    icon: 'success',
                })

            }).catch(e => {

                console.error(e)

                this.$store.commit('icon', {
                    icon: 'error',
                    message: e.error
                })

            }).finally(() => {

                this.$store.commit('globalpreloader', false)

            })
			console.log('files', files)
		},


        uploadError : function(e){
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