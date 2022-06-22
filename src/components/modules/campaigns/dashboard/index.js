import { mapState } from 'vuex';

import f from '@/application/shared/functions.js'

import batchPreview from "../batch/preview/index.vue"

export default {
    name: 'campaigns_dashboard',

    props: {
        select : {
            type : Object,
            default : () => {
                return {
                    context : 'campaigns'
                }
            }
        }
    },

    components : {batchPreview},

    data : function(){

        return {
            loading : false,

            searchvalue : '',
			count : 0,
			sort : 'Started_DESC',
			sorting : {

				Started_ASC : {
					text : 'date_asc',
					field : 'Started',
					sort : 'ASC'
				},
				Started_DESC : {
					text : 'date_desc',
					field : 'Started',
					sort : 'DESC'
				}
			},

            listdate : []
        }

    },

    created : () => {

    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,

        api : function(){
            return 'campaigns.batches.list'
        },
        payload : function(){

            var data = {
                SortFields : [{
					Field : this.sorting[this.sort].field,
					Order : this.sorting[this.sort].sort
				}]
            }


            if(this.listdate && this.listdate[0] && this.listdate[1]){
                data.CreatedFilter = {
                    Start : this.listdate[0] ? f.date.toserverFormatDate(this.listdate[0]) + '0000' : undefined,
                    End : this.listdate[1] ? f.date.toserverFormatDate(this.listdate[1]) + '0000' : undefined
                }
            }
            else{
                data.CreatedFilter = {
                    Start: "20220103000000",
                    End: "20220715235959"
                }
            }

            

			return data
		},

        datepicker : function(){
            return {
                max : new Date(),

                placeholders : {
                    from : "From",
                    to : "To"
                }
            }
        }
    }),

    methods : {

        setdate : function(v){
            this.listdate = v
        },

        reload : function(){
			if(this.$refs['list']) this.$refs['list'].reload()
		},

        search : function(v){
			this.searchvalue = v
		},

		setcount : function(v){
			this.count = v
		},

		sortchange : function(v){
			this.sort = v
		},

        open : function(batch){
            this.$router.push('/campaigns/batch/' + batch.Id)
        }
    },
    
}