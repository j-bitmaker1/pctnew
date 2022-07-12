import { mapState } from 'vuex';
import status from "../../status/index.vue"

import summarybutton from '@/components/delements/summarybutton/index.vue'

import campaignslist from '../../list/index.vue'

import { Campaigns } from '@/application/charts/index';
import { Chart } from 'highcharts-vue'
import f from '@/application/shared/functions';

var campaignsChart = new Campaigns()

export default {
    name: 'campaigns_batch_main',
    props: {
        batch: Object
    },

    components: { status, summarybutton, campaignslist, highcharts: Chart },

    data: function () {

        return {
            loading: false,

            summary: [

                {
                    index: 'ErrorCampaigns',
                    text: 'campaigns.summary.ErrorCampaigns'
                },

                {
                    index: 'OpenedEmails',
                    text: 'campaigns.summary.OpenedEmails'
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

    created: () => {

    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth: state => state.auth,

        sticker : function(){
            var s = ['advertising.png', 'marketing.png', 'product.png', 'goal.png', 's2.png']

            return s[0, this.batch.CompletedCampaigns % s.length]
        },

        chartOptions: function () {

            var metrics = [
                { index: 'PreparingCampaigns', color: "#999999" }, 
                { index: 'VerificationCampaigns', color: "#999999" }, 
                { index: 'WaitCampaigns', color: "#888888" }, 
                { index: 'ActiveCampaigns', color: '#000080' }, 
                { index: 'PauseCampaigns', color: "#999999" }, 
                { index: 'UnsubscribedCampaigns', color: "#ff033e" }, 
                { index: 'ErrorCampaigns', color: "#ff033e" }, 
                { index: 'CompletedCampaigns', color: '#228b22' }, 
                { index: 'DeletedCampaigns', color: '#ff033e' }
            ]

            var points = _.map(metrics, (m) => {
                return {
                    value : this.batch[m.index],
                    color : m.color,
                    name : this.$t('campaigns.batch.' + m.index)
                }
            })

            points = _.filter(points, (p) => {return p.value})

            var chartData = campaignsChart.chartData(points)

            /*var d = campaignsChart.chartOptions({
                emails : this.batch.TotalEmail ? 100 * this.batch.OpenedEmails / this.batch.TotalEmails : 0,
                batchProgress : this.batch.TotalCampaigns ? 100 * this.batch.CompletedCampaigns / this.batch.TotalCampaigns : 0,
                current : 50 
            })*/

            var d = campaignsChart.chartOptions(chartData)

            return d
        },
    }),

    methods: {

    },
}