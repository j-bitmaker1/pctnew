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

            listdate : [],
            stats : null
        }

    },

    created () {
        this.loadstats()
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

            console.log('this.listdate', this.listdate)

            if(this.listdate){
                data.CreatedFilter = {
                    Start : this.listdate[0] ? f.date.toserverFormatDate(this.listdate[0]) + '000' : undefined,
                    End : this.listdate[1] ? f.date.toserverFormatDate(this.listdate[1]) + '000' : undefined
                }
            }
            else{
               
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
            this.$router.push('/campaigns/batch/' + batch.Id).catch(e => {})
        },

        loadstats : function(){
            this.core.api.campaigns.misc.stats().then(r => {
                this.stats = r
                console.log("STATR", r)
            })
        },

        deletebatch : function(item){
            if(this.$refs['list']) this.$refs['list'].datadeleted(item, "Id")
        }
    },
    
}