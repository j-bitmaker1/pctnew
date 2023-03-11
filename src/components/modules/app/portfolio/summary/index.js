import { mapState } from 'vuex';

import shares from "@/components/modules/app/portfolio/shares/index.vue";
import crashtest from "@/components/modules/app/portfolio/crashtest/index.vue";
import scenariodetails from "@/components/modules/app/portfolio/crashtest/scenariodetails/index.vue";
import client from   '@/components/modules/app/portfolio/client/index.vue'
import portfoliomenu from '@/components/modules/app/portfolio/menu/index.vue'


export default {
    name: 'portfolio_summary',
    components: {
		shares,
		crashtest,
        scenariodetails,
        client,
        portfoliomenu
	},
    props: {
        portfolioId : Number
    },


    data : function(){

        return {
            loading : true,
            selectedScenario : null,
            ct : null,
            profile : null,
        }

    },

    created : function() {
        this.load().catch(e => {})
    },

    watch: {
        portfolioId : function(){
            this.load().catch(e => {})
        }
    },
    computed: mapState({
        auth : state => state.auth,
    }),

    methods : {
        ctloaded : function({ct, cts}){
            this.ct = ct

            var scenario = this.ct.scenarios[this.ct.scenarios.length - 1]

            var _scenario = {
                id : scenario.id,
                name : scenario.name,
                loss : scenario.loss * cts.total
            }

            this.selectedScenario = _scenario

        },

        scenarioMouseOver : function({ct, scenario}){
            this.ct = ct
            this.selectedScenario = scenario
        },

        load : function(){

            this.loading = true

			return this.core.api.pctapi.portfolios.get(this.portfolioId).then(r => {

				this.portfolio = r

				this.core.activity.template('portfolio', this.portfolio)

				if(!r.crmContactId){
					return Promise.resolve()
				}

				return this.core.api.crm.contacts.gets({Ids : [r.crmContactId]}).then(c => {
					this.profile = c[0]
				})

			}).catch(e => {
                console.error(e)
            }).finally(() => {
				this.loading = false
			})

        },

        editportfolio : function(){

            this.load().then(() => {
                return this.$nextTick();
            }).then(() => {

                if (this.$refs.crashtest)
                    this.$refs.crashtest.load()

            }).catch(e => {})
        },
        deleteportfolio : function(){
            this.$emit('close')
        },
        changeClient : function(profile){
			this.profile = profile
		},

        selectPortfolio : function(){
            this.core.vueapi.selectPortfolios((portfolios) => {

                this.$emit('changeData', {
                    portfolioId : portfolios[0].id
                })

            }, {
                one : true
            })
        }
    },
}