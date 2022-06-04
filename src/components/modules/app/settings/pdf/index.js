import { mapState } from 'vuex';

export default {
    name: 'settings_pdf',
    props: {
    },

    data : function(){

        return {
            loading : false
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
    }),

    methods : {
        load : function(){

            this.loading = true

            this.core.settings.pdf.getall().then(settings => {
                console.log("R", settings)
            }).finally(() => {
                this.loading = false
            })

        },
        editDisclosure : function(){

            console.log("this.core.settings.pdf.get('disclosure')", this.core.settings.pdf.get('disclosure'))

            this.core.vueapi.editorjs({
                initial : this.core.settings.pdf.get('disclosure').value
            }, (edited) => {

                this.core.settings.pdf.set('disclosure', edited).catch(e => {
                    console.error(e)
                })

                console.log("edited", edited)
            },{
                caption : "Edit disclosure"
            })
        }
    },
}