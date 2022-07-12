import { mapState } from 'vuex';
import campaignPreview from "../single/preview/index.vue"
export default {
    name: 'campaigns_list',
    props: {
        batch : Object
    },

    components : {
        campaignPreview
    },

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
            return 'campaigns.single.list'
        },

        payload : function(){

            var data = {
                SortFields : [{
					Field : this.sorting[this.sort].field,
					Order : this.sorting[this.sort].sort
				}]
            }

            data.BatchId = this.batch.Id

			return data
		},
    }),

    methods : {
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

        open : function(campaign){
            this.$router.push('/campaigns/campaign/' + campaign.Id).catch(e => {})
        },

        deletesingle : function(item){
            if(this.$refs['list']) this.$refs['list'].datadeleted(item, "Id")
        }
    },
}