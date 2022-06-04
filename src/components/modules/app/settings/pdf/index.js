import { mapState } from 'vuex';

export default {
    name: 'settings_pdf',
    props: {
    },

    data : function(){

        return {
            loading : false,
            logotype : null,
            images : {
				resize : {
					width : 640,
					height : 640
				}
			}
        }

    },

    created (){
        this.load()
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
        logotypestyle : function(){
            return this.logotype ? "color:#fff;background: linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7) ), url('"+this.logotype+"'); background-size: cover; background-position: center center; background-repeat: no-repeat" : ''
        }
    }),

    methods : {
        load : function(){

            this.loading = true

            this.core.settings.pdf.getall().then(settings => {
                this.logotype = settings.logotype.value
            }).finally(() => {
                this.loading = false
            })

        },
        editDisclosure : function(){


            this.core.vueapi.editorjs({
                initial : this.core.settings.pdf.get('disclosure').value
            }, (edited) => {

                this.core.settings.pdf.set('disclosure', edited).catch(e => {
                    console.error(e)
                })

            },{
                caption : "Edit disclosure"
            })
        },
        imageChanged : function(file){

            this.logotype = file.base64

            this.$store.commit('globalpreloader', true)

            this.core.settings.pdf.set('logotype', file.base64).then(r => {

            }).catch(e => {

                this.logotype = null

                this.$store.commit('icon', {
                    icon: 'error'
                })
            }).finally(() => {
                this.$store.commit('globalpreloader', false)
            })
        }
    },
}