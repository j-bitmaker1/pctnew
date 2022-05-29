import { mapState } from 'vuex';
import f from '@/application/functions';

import file from './file/index.vue'
import _ from 'underscore';

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
            searchvalue : '',

            sort : 'date_asc',
			sorting : {
				name_asc : {
					text : 'fname_asc',
					field : 'name',
					sort : 'asc'
				},
				name_desc : {
					text : 'fname_desc',
					field : 'name',
					sort : 'desc'
				},

                date_asc : {
					text : 'date_asc',
					field : 'date',
					sort : 'asc'
				},
				date_desc : {
					text : 'date_desc',
					field : 'date',
					sort : 'desc'
				}
			},
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
        count : function(){
            return this.filtered.length
        },
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

        sorted : function(){

            var [field, ad] = this.sort.split('_')

            var srt = _.sortBy(this.filtered, (f) => {

                if(field == 'name') return f.info.FileName
                if(field == 'date') return f.completed || f.created

            })

            if(this.sort == 'date_asc') srt.reverse()
            if(this.sort == 'name_desc') srt.reverse()

            return srt
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
        sortchange : function(v){
			this.sort = v
		},

        load : function(){

            this.files = []
            this.loading = true

            this.core.filemanager.getall().then(files => {
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
            
        },

        added : function(r){
            this.files = _.concat(this.files, r)
        },

        open : function(file){
            this.$emit('openFile', file)
        }
    },
}