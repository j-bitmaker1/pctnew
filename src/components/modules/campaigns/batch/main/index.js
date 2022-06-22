import { mapState } from 'vuex';
import status from "../../status/index.vue"

import summarybutton from '@/components/delements/summarybutton/index.vue'

import campaignslist from '../../list/index.vue'

import { Campaigns } from '@/application/charts/index';
import {Chart} from 'highcharts-vue'
var campaignsChart = new Campaigns()

export default {
    name: 'campaigns_batch_main',
    props: {
        batch : Object
    },

    components : {status, summarybutton, campaignslist, highcharts : Chart}, 

    data : function(){

        return {
            loading : false,

            summary : [

                {
                    index : 'ErrorCampaigns',
                    text : 'campaigns.summary.ErrorCampaigns'
                },

                {
                    index : 'OpenedEmails',
                    text : 'campaigns.summary.OpenedEmails'
                },

                /*{
                    index : 'CompletedCampaigns',
                    text : 'campaigns.summary.CompletedCampaigns'
                },
                
                
                {
                    index : 'TotalCampaigns',
                    text : 'campaigns.summary.TotalCampaigns'
                },

                
                {
                    index : 'SentEmails',
                    text : 'campaigns.summary.SentEmails'
                },

                {
                    index : 'TotalEmails',
                    text : 'campaigns.summary.TotalEmails'
                }*/
            ]
        }

    },

    created : () => {

    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,

        chartOptions: function(){

			var d = campaignsChart.chartOptions({
                emails : 100 * this.batch.OpenedEmails / this.batch.TotalEmails,
                batchProgress : 100 * this.batch.CompletedCampaigns / this.batch.TotalCampaigns,
                current : 50 
            })

			return d
		},
    }),

    methods : {
        
    },
}