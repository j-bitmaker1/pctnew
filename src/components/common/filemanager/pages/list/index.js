import { mapState } from 'vuex';
import f from '@/application/functions';

import file from './file/index.vue'
import _ from 'underscore';

export default {
    name: 'filemanager_pages_list',
    props: {
        scroll : Number
    },

    components : {
        file
    },

    data : function(){

        return {
            loading : false,
            searchvalue : '',
            count : null,
            sort : 'date_desc',
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
					field : 'Created',
					sort : 'asc'
				},
				date_desc : {
					text : 'date_desc',
					field : 'Created',
					sort : 'desc'
				}
			},
        }

    },

    created(){
    },

    watch: {
		tscrolly : function(){

			if (this.$refs['list']){

				if (this.$refs['list'].height() - 1000 < this.tscrolly + this.dheight){
					this.$refs['list'].next()
				}
				
			}
			
		}
	},
    computed: mapState({
        auth : state => state.auth,

        tscrolly : function(state){
			return this.scroll || state.tscrolly
		},

        payload : function(){
            return {
				//searchStrFilter : this.searchvalue,

				sortFields : [{
					field : this.sorting[this.sort].field,
					order : this.sorting[this.sort].sort
				}]
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

        setcount : function(v){
            this.count = v
        },

        sortchange : function(v){
			this.sort = v
		},


        search : function(v){
            this.searchvalue = v
        },

        deleteitems : function(items){
            this.core.api.tasks.deleteItems(_.map(items, (i) => {return i.id}), {
				preloader : true,
				showStatus : true
			}).then(() => {

				_.each(items, (item) => {
					this.deleted(item)
				})

			})
        },

		deleted : function(item){
			if(this.$refs['list']) this.$refs['list'].datadeleted(item, "id")
		},

        added : function(r){
            
        },

        open : function(file){
            this.$emit('openFile', file)
        }
    },
}