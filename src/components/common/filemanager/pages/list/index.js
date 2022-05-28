import { mapState } from 'vuex';
import f from '@/application/functions';

import file from './file/index.vue'

export default {
    name: 'filemanager_pages_list',
    props: {
    },

    components : {
        file
    },

    data : function(){

        return {
            loading : false,
            files : [],
            searchvalue : ''
        }

    },

    created(){
        this.load()
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,

        filtered : function(){
            if(this.searchvalue){

                return f.clientsearch(this.searchvalue, this.files, (file) => {

                    return f.namear([
                        file.info.FileName, 
                        file.status, 
                        (file.info.ContentType || "").replace('application/'),

                        f.namear(_.map(file.data, (d) => {
                            return d.Ticker
                        }))
                    ])

                })
            }
            else{
                return this.files
            }
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
        load : function(){

            this.loading = true

            this.core.filemanager.getall().then(files => {
                console.log('files', files)
                this.files = files

                return Promise.resolve()
            }).finally(() => {
                this.loading = false
            })
        },

        search : function(v){
            this.searchvalue = v
        },

        deleteitems : function(){
            
        }
    },
}