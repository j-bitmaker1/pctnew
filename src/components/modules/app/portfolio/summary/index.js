import { mapState } from 'vuex';

import shares from "@/components/modules/app/portfolio/shares/index.vue";
import crashtest from "@/components/modules/app/portfolio/crashtest/index.vue";
import crashtesttemp from "@/components/modules/app/comparewith/stress/index.vue";

import scenariodetails from "@/components/modules/app/portfolio/crashtest/scenariodetails/index.vue";

import homeAdd from "@/components/modules/app/home/add/index.vue";

import portfolioMenu from "./portfoliomenu/index.vue";


export default {
    name: 'portfolio_summary',
    components: {
		shares,
		crashtest,
        scenariodetails,
        portfolioMenu,
        homeAdd,
        crashtesttemp
	},
    props: {
        portfolioId : Number,
        last : Object
    },


    data : function(){

        return {
            loading : false,
            selectedScenario : null,
            ct : null,
            profile : null,
            portfolio : null,
            temp : null
        }

    },

    created : function() {
        this.load().catch(e => {})
    },

    watch: {
        portfolioId : function(){

            this.temp = null

            this.load().catch(e => {})
        },

    },
    computed: mapState({
        auth : state => state.auth,
        height : state => state.dheight - 44 - 56 - 40
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

            if(!this.portfolioId){
                return Promise.reject('empty')
            }

            this.loading = true
            this.ct = null
            this.selectedScenario = null
            this.portfolio = null

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

            this.temp = null

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
        changeclient : function(profile){
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
        },

        homeadd : function(type, id){
            if (type == 'portfolio'){

                this.$emit('changeData', {
                    portfolioId : id
                })

                return
            }
        },

        createportfolio: function () {
            this.$store.commit('OPEN_MODAL', {
                id: 'modal_portfolios_edit',
                module: "portfolio_edit",
                caption: "New Portfolio",

                events: {
                    edit: (data) => {

                        this.$emit('changeData', {
                            portfolioId : data.id
                        })
                        
                    }
                }
            })
        },

        tempassets : function(assets){
            
            this.temp = assets

            console.log('this.temp', this.temp)
        },

        cancelTempAssets : function(){
			this.temp = null
        },

        gotolast : function(){
            this.$emit('changeData', {
                portfolioId : this.last.data.portfolio.id
            })
        }
    },
}