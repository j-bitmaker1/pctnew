import { mapState } from 'vuex';

import pages_list from './pages/list/index.vue'
import pages_file from './pages/file/index.vue'
import { isEmpty } from 'underscore';


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
            }
        }

    },
    

    created (){
        this.core.user.activity.template('action', this.core.user.activity.actions.fileManager())

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
		}
    }),

    methods : {
        uploaded : function(data){

            if(isEmpty(data)) return Promise.resolve()
            
            this.$store.commit('globalpreloader', true)

            var results = []

           

            return Promise.all(_.map(data, (d) => {

                return this.core.api.tasks.create({
                    file : d.file
                }).then(r => {

                //return this.core.filemanager.upload(d.file).then(r => {
                    results.push(r)
                    return Promise.resolve()
                })

            })).then(() => {


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