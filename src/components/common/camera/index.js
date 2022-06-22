import { mapState } from 'vuex';
import f from "@/application/shared/functions.js"

export default {
    name: 'camera',
    props: {
        multiple : Boolean,
        mask : Object
    },

    components : {
    },

    data : function(){

        return {
            loading : false,
            ready : false,
            current : null,
            focused : false,
            selected : {},
            sample : "",
            options : {
                x: 0,
                y: 0,
                width: window.screen.width,
                height: window.screen.height,
                camera: typeof CameraPreview != 'undefined' ? CameraPreview.CAMERA_DIRECTION.BACK : '',
                toBack: true,
                //tapPhoto: true,
                tapFocus: true,
                previewDrag: false,
                storeToFile: false,
                disableExifHeaderStripping: false
            },

            photos : [],

            thubnails : {},
            images : {},

            full : false,

            upload : {
                multiple: false,
                extensions: ['jpg', 'jpeg', 'png'],
                images: {
                    resize: {
                        type: 'fit'
                    }
                }
            }
        }

    },

    beforeDestroy : function(){
        this.destroy()
    },

    mounted : function(){
        this.init()
    },

    watch: {
        //$route: 'getdata'
    },

    computed: mapState({
        auth : state => state.auth,

        p : state => state.cameraenabled,

        count : function(){
            return _.toArray(this.selected).length
        },
        photolibraryaccessdecline : state => state.photolibraryaccessdecline,
       
    }),

    methods : {
        uploadStart(files) {
     
        },
        uploadSizeError(value) {
            /*if (!value) {
                this.$refs.dropdownMenu.hidePopup();
            }*/
        },
        uploadUploaded(data) {
            const validImageTypes = ['image/jpeg', 'image/png'];

            if (validImageTypes.includes(data.file.type)) {

                this.saveimage(data.base64).then(libitem => {

                    this.photos.unshift(libitem)
                    this.add(libitem)

                    if(!this.multiple){
                        this.useselected()
                    }

                })

            } else {
                
                
            }

            return Promise.resolve()
        },
        uploadUploadedAll(result) {

    
        },

        uploadError : function(error){
            this.$message({
                title : "Image hasn't uploaded",
                message : error
            })
        },

        focus : function(){
            this.focused = true
        },

        blur : function(){
            this.focused = false
        },

        add : function(libraryItem){
            this.$set(this.selected, libraryItem.id, true)
        },

        remove : function(id){
            this.$delete(this.selected, id)
        },

        select : function(id){
            if (this.selected[id]){
                this.remove(id)
            }
            else{
                this.add({
                    id : id
                })
            }

        },

        showfull : function(id){

            this.getimage(id).then(() => {
                this.current = this.images[id]
                this.full = true
            })
           
        },

        clearselected : function(){
            this.selected = {}
        },

        saveimage : function(url){

            return new Promise((resolve, reject) => {

                var dummy = () => {
                    var id = f.makeid()

                    this.thubnails[id] = url
                    this.images[id] = url

                    var libraryItem = {
                        id : id,
                        photoURL : url,
                        thumbnailURL : url
                    }
                    
                    resolve(libraryItem)
                }
                if (window.cordova && window.cordova.plugins.photoLibrary && window.cordova.plugins.photoLibrary.saveImage && !f.isios()){
                    window.cordova.plugins.photoLibrary.saveImage(url, 'PCT', function (libraryItem) {
                        resolve(libraryItem)
                    }, (e) => {
    
                        dummy()
                        
                    });
                }
                else{
                    dummy()
                }
                
            }) 

            
        },

        permissions : function(){
            return new Promise((resolve, reject) => {

                if (window.cordova && window.cordova.plugins.photoLibrary){
                    window.cordova.plugins.photoLibrary.requestAuthorization(() => {
                        this.$store.commit('photolibraryaccessdecline', false)

                        resolve()
                    }, () => {
                        this.$store.commit('photolibraryaccessdecline', true)
    
                        reject()
                    }, {
                        read: true
                    });
                }

                else
                {
                    resolve()
                }

                
            })
        },
        initlibraryagain : function(){
            this.permissions().then(this.library)
        },
        initlibrary : function(){

            if(!this.photolibraryaccessdecline){
                this.permissions().then(this.library)
            }
            
        },
        library : function(){

            if(window.cordova){

                if (window.cordova.plugins.photoLibrary)
                    window.cordova.plugins.photoLibrary.getLibrary(
                        (result) => {

                            this.photos = result.library

                            _.each(this.photos, (p) => {
                                this.getthubnail(p.id)
                            })

                        },
                        (err) => {
                            
                            this.initlibrary()

                        },
                        { // optional options
                            thumbnailWidth: 128,
                            thumbnailHeight: 128,
                            quality: 0.85,
                            includeAlbumData: false // default
                        }
                    )
            }
        },

        getthubnail : function(id){
            return cordova.plugins.photoLibrary.getThumbnail(id, (url) => {

                this.$set(this.thubnails, id, f.Base64.fromBlob(url))

                return Promise.resolve(url)
            }, (e) => {


            },{ // optional options
                thumbnailWidth: 125,
                thumbnailHeight: 125,
                quality: 0.8
            })
        },

        getimage : function(id){

            if(this.images[id]){
                return Promise.resolve(this.images[id])
            }

            if(cordova.plugins.photoLibrary){

                return new Promise((resolve, reject) => {

                    cordova.plugins.photoLibrary.getPhotoURL(id, (url) => {
    
                        f.fetchLocal(url).then(({data}) => {
    
                            this.images[id] = f.Base64.fromBlob(data)
    
                            resolve(this.images[id])

                        }).catch(reject)
    
                    }, (e) => {
    
                        console.error("E", e)
        
                        reject(e)
                        
                    })
                })
               
                
            }
            else{
                return Promise.reject('empty')
            }
            
        },

        cancel : function(){
            this.$emit('cancel')
            this.close()
        },

        close : function(){
            this.$emit('close')
        },

        exitfull : function(){
            this.full = false
            this.current = null
        },

        newpicture : function(){

            if (this.current){

                this.current = null
                this.full = false

                CameraPreview.startCamera(this.options);
            }
            
        },

        useselected : function(){

            var promises = _.map(this.selected, (s, i) => {
                return this.getimage(i)
            })

            return Promise.all(promises).then(r => {
                var imgs = [];

                _.each(this.selected, (s, i) => {
                    if (this.images[i])
                        imgs.push(this.images[i])
                })

                
                this.$emit('selected', imgs)
                this.close()
            })
      
        },

        getselected : function(){
            if (this.current){

                this.$emit('picture', this.current)

                this.saveimage(this.current).then(r => {

                    this.photos.unshift(r)
                    this.add(r)

                    if(!this.multiple){
                        this.useselected()
                    }
                    else{
                        this.newpicture()
                    }
                    
                    
                })
            }
            
        },

        takePicture : function(){
            if(!this.ready) return


            if(!this.focused && this.count > 0){
                this.focus()

                return
            }

            CameraPreview.getSupportedPictureSizes((dimensions) => {

                dimensions = _.filter(dimensions, function(d){
                    return d.width * d.height < 3 * 1000 * 1000
                })

                var maxdimension = _.max(dimensions, function(d){
                    return d.width * d.height
                })

                CameraPreview.takePicture(
                    {width : maxdimension.width, height : maxdimension.height, quality: 85}, 
                    (base64PictureData) => {
    
                        base64PictureData = 'data:image/jpeg;base64,' + base64PictureData
    
                        this.current = base64PictureData

                        CameraPreview.stopCamera();
    
                    }, (e) => {

                    })
            })

           
        },

        init : function(){

            this.photos = []

            if (typeof CameraPreview != 'undefined'){
                this.ready = true
                CameraPreview.startCamera(this.options);
            }
            else{

            }

            /*this.photos = [{
                id : 3
            },{
                id : 4
            }]

            this.thubnails[3] = this.images[3] = this.sample
            this.thubnails[4] = this.images[4] = this.sample*/

            this.library()

            document.getElementById("html").setAttribute("camera", "true");

        },

        destroy : function(){
            if (typeof CameraPreview != 'undefined'){
                CameraPreview.stopCamera();
            }

            document.getElementById("html").setAttribute("camera", "false");
        }   
    },
}