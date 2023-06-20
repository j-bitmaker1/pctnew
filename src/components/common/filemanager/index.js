import { mapState } from 'vuex';

import pages_list from './pages/list/index.vue'
import pages_file from './pages/file/index.vue'
import f from '@/application/shared/functions.js'

export default {
    name: 'filemanager',
    props: {
        upload : Array,
        scroll : Number,
        fromEditor : Boolean,
        open : Function,
        context : {
            type : String,
            default : 'portfolio'
        },

        allowedExtensions : Array
    },

    data : function(){

        return {
            loading : false,
            page : {
                key : 'list',
                data : {}
            },

            extensions : ['csv', 'xls', 'xlsx', 'pdf', 'png', 'jpg', 'jpeg']
        }

    },
    

    created (){
        this.core.activity.template('action', this.core.activity.actions.fileManager())

        if(this.upload && this.upload.length){
            this.uploaded(this.upload)
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
                return f.files.checkExtension(file, this.allowedExtensions || this.extensions)
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
                upack = [upack]
            }

            
            Promise.all(_.map(upack, (data) => {
                return this.uploaded(data)
            }))

        },
        cancelUploadingStore : function(){
            this.$store.commit('clearUploading')
        },

        process : function(id, type, restart){

            return this.core.api.tasks[restart ? 'restart' : 'create'](id, type).then(r => {
                console.log("R", r)
            }).catch(e => {
                console.error(e)
                return Promise.resolve()
            })

        },
        

        restartprocess : function(file, type){
            return this.process(file.id, type, true)
        },

        runprocess : function(file, type){
            console.log('file, type', file, type)
            return this.process(file.id, type)
        },

        uploaded : function(data){

            if(_.isEmpty(data)) return Promise.resolve()
            
            this.$store.commit('globalpreloader', true)

            var results = []

            return Promise.all(_.map(data, (d) => {

                return this.core.api.files.upload({
                    file : d.file,
                    files : d.files
                }).then(r => {

                    console.log("R", r)

                    results.push(r)

                    if (this.context == 'portfolio'){
                        /// 
                        return this.process(r, 'PARSEPORTFOLIO')
                    }

                    
                    return Promise.resolve()
                })

            })).then(() => {

                this.$store.commit('icon', {
                    icon: 'success',
                })

                if (this.$refs.page && this.$refs.page.reload){
                    this.$refs.page.reload()
                }

                /*if (this.$refs.page && this.$refs.page.reload){

                    setTimeout(() => {

                        this.$store.commit('globalpreloader', true)
                        this.$store.commit('icon', {
                            icon: 'success',
                        })

                        setTimeout(() => {
                            this.$refs.page.reload()
                            this.$store.commit('globalpreloader', false)

                            
                        }, 2000)

                    }, 100)
                }

                else{
                    this.$store.commit('icon', {
                        icon: 'success',
                    })
                }*/

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


            if (e.text){
				this.$store.commit('icon', {
					icon: 'error',
					message: e.text
				})
			}
        },

        camera : function(){
        

            this.core.vueapi.camera((images) => {

                var r = []
                
                Promise.all(_.map(images, (image) => {
                    return f.urltoFile(image, "Image_" + f.date.nowUtc1000()).then(file => {

                        r.push({
                            base64 : image,
                            file : file
                        })

                        return Promise.resolve()
                    })
                })).then(() => {
                    this.uploaded(r)
                })

            }, {
                title : "Take a photo of a document"
            })

        },

        getmodule : function(){

            if(this.page.key == 'list') return pages_list
            if(this.page.key == 'file') return pages_file
        },
			
        openFile : function(file){

            if (this.open){
                this.open(file)
                this.$emit('close')
                return
            }

            console.log('file', file)


            if(!this.defaultOpen(file)){
                this.core.api.files.getattachment(file.info[0].StorageKey, file.id).then(r => {

                    this.core.filehandler(r, {
                        name : file.FileName
                    })
    
                }).finally(() => {
                })
                
            }

        },

        back : function(){
           
        },

        close : function(){
            this.$emit('close')
        },

        defaultOpen : function(file){

            ///// ONLY CREATE PORTFOLIO

            var task = (this.core.gettasks(file) || {})['PARSEPORTFOLIO'] || {}

            if (this.context == 'portfolio' && task.status == 'SUCCESS' && task.data && task.data.length){
                this.core.vueapi.fileManager_File(file, {
                    createPortfolio : this.createPortfolio
                }, {
                    name : file.info.FileName
                })

                return true
            }
            
        },

        createPortfolio : function(portfolio){

            if (this.fromEditor)
                this.$emit('createPortfolio', portfolio)

            else{
                this.core.vueapi.newPortfolio({from : portfolio})
            }

            this.close()
        }
    },
}