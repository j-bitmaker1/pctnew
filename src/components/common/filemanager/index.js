import { mapState } from 'vuex';

import pages_list from './pages/list/index.vue'
import pages_file from './pages/file/index.vue'
import f from '@/application/shared/functions.js'

export default {
    name: 'filemanager',
    props: {
        upload : Array,
        scroll : Number,
        fromEditor : Boolean
    },

    data : function(){

        return {
            loading : false,
            page : {
                key : 'list',
                data : {}
            },

            extensions : ['csv', 'xls', 'xlsx']
        }

    },
    

    created (){
        this.core.activity.template('action', this.core.activity.actions.fileManager())

        if(this.upload){

        }
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,

        cordova : function(){
			return window.cordova
		},

        hasUploading : state => state.uploading,

        uploading : function(){

            return _.filter(this.hasUploading, (file) => {
                return f.files.checkExtension(file, this.extensions)
            })

        }
    }),

    methods : {
        uploadStore : function(){

            var packs = {
                files : [],
                images : {
                    files : []
                }
            }

            _.each(this.uploading, (file) => {
                if(file.type.indexOf('image') > -1){
                    packs.images.files.push(file)
                }
                else{
                    packs.files.push({file})
                }
            })

            this.$store.commit('clearUploading')

            var upack = []

            if (packs.files.length)
                upack.push(packs.files)

            if (packs.images.files.length){
                upack.push(packs.images)
            }

            
            Promise.all(_.map(upack, (data) => {
                return this.uploaded(data)
            }))

        },
        cancelUploadingStore : function(){
            this.$store.commit('clearUploading')
        },

        uploaded : function(data){

            if(isEmpty(data)) return Promise.resolve()
            
            this.$store.commit('globalpreloader', true)

            var results = []

            return Promise.all(_.map(data, (d) => {

                return this.core.api.tasks.create({
                    file : d.file,
                    files : d.files
                }).then(r => {

                //return this.core.filemanager.upload(d.file).then(r => {
                    results.push(r)
                    return Promise.resolve()
                })

            })).then(() => {

                if (this.$refs.page && this.$refs.page.reload){

                    setTimeout(() => {

                        this.$store.commit('globalpreloader', true)

                        setTimeout(() => {
                            this.$refs.page.reload()
                            this.$store.commit('globalpreloader', false)

                            this.$store.commit('icon', {
                                icon: 'success',
                            })
                        }, 2000)

                    }, 100)
                }

                else{
                    this.$store.commit('icon', {
                        icon: 'success',
                    })
                }

            }).catch(e => {

                console.error(e)

                this.$store.commit('icon', {
                    icon: 'error',
                    message: e.error
                })

            }).finally(() => {
                this.$store.commit('globalpreloader', false)
            })
		},


        uploadError : function(e){

            console.log("E", e)

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
			
        openFile : function(file){

            this.core.vueapi.fileManager_File(file, {
                createPortfolio : this.createPortfolio
            }, {
                name : file.info.FileName
            })
        },

        back : function(){
           
        },

        close : function(){
            this.$emit('close')
        },

        createPortfolio : function(portfolio){

            console.log('portfolio', portfolio)
            if (this.fromEditor)
                this.$emit('createPortfolio', portfolio)

            else{
                this.core.vueapi.newPortfolio({from : portfolio})
            }

            this.close()
        }
    },
}