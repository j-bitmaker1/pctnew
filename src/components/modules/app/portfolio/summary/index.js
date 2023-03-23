import { mapState } from 'vuex';

import shares from "@/components/modules/app/portfolio/shares/index.vue";
import crashtest from "@/components/modules/app/portfolio/crashtest/index.vue";
import crashtesttemp from "@/components/modules/app/comparewith/stress/index.vue";
import scenariodetails from "@/components/modules/app/portfolio/crashtest/scenariodetails/index.vue";
import homeAdd from "@/components/modules/app/home/add/index.vue";
import portfolioCaption from "./portfoliocaption/index.vue";
import portfoliomenu from '@/components/modules/app/portfolio/menu/index.vue'
import ctmenu from '@/components/modules/app/portfolio/crashtest/menu/index.vue'

import customstresstest from "@/components/modules/app/scenarios/custom2/index.vue";
import retrospective from "@/components/modules/app/portfolio/retrospective/index.vue";
import retrospectivetemp from "@/components/modules/app/comparewith/retrospective/index.vue";

import factoranalysis from "@/components/modules/app/portfolio/factoranalysis/index.vue";


import widget from "./widget/index.vue";



export default {
    name: 'portfolio_summary',
    components: {
		shares,
		crashtest,
        scenariodetails,
        portfolioCaption,
        homeAdd,
        crashtesttemp,
        portfoliomenu,
        ctmenu,
        customstresstest,
        retrospective,
        factoranalysis,
        widget,
        retrospectivetemp
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
            cts : null,
            profile : null,
            portfolio : null,
            temp : null,
            error : null,
            lastCustomFactors : null,
            lastCustomResult : null,
            scroll : 0,
            view : 'stresstest',
            views : ['stresstest', 'customstresstest'],
            scrollWidth : 0
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
        height : state => state.dheight - 44 - 48 - 40,
        dwidth : state => state.dwidth - 44,
        mobileview : state => state.mobileview,

        widgets(){

            var correction = 44

            var widgets = {
                left : {
                    width : 30
                },
                center : {
                    width : 40
                },
                right : {
                    width : 30,
                    snap : 'none'
                },
                retrospective : {
                    width : 60,
                    snap : 'end'
                },
                /*factoranalysis : {
                    width : 40,
                    snap : 'end'
                }*/
            }

            var slideIndexes = []

            var indexes = _.map(widgets, (w, i) => {
                return i
            })


            if(this.dwidth + correction <= 900){
                widgets.left.width = 40
                widgets.center.width = 60
                widgets.right.width = 40
                widgets.retrospective.width = 100
                //widgets.factoranalysis.width = 100

                slideIndexes = [['left', 'center'], ['center', 'right'], ['retrospective']/*, ['factoranalysis']*/]
            }

            if(this.dwidth + correction > 900 && this.dwidth + correction <= 1920){
                widgets.left.sticky = true

                slideIndexes = [['left', 'center', 'right'], ['right', 'retrospective']/*, ['factoranalysis']*/]
            }

            if(this.dwidth + correction > 1920){
                widgets.left.width = 25
                widgets.center.width = 25
                widgets.right.width = 25
                widgets.retrospective.width = 25
                //widgets.retrospective.width = 25

                slideIndexes = [['left', 'center', 'right', 'retrospective']/*, ['retrospective', 'factoranalysis']*/]

            }

            var totalwidth = _.reduce(widgets, (m, widget) => {
                return m + widget.width
            }, 0)
            var position = (this.scroll + this.dwidth / 2) / this.scrollWidthC * 100
            var relativePosition = position * totalwidth / 100

            var slides = _.map(slideIndexes, (sindexes) => {

                var left = 0
                var ln

                for(let i = 0; i < indexes.length; i++){

                    if(indexes[i] == sindexes[0]){
                        ln = true
                    }

                    if(!ln){
                        left += widgets[indexes[i]].width
                    }
                }

                var width = _.reduce(sindexes, (m, si) => {
                    return m + widgets[si].width
                }, 0)
                
                var slide = {
                    widgets : sindexes,
                    left,
                    width,
                    rleft : left / (totalwidth / 100)
                    //active : relativePosition >= left && relativePosition < left + width
                }

                return slide

            })

            var active = _.min(slides, (slide) => {

                var v = Math.abs(((2 * slide.left + slide.width) / 2) - relativePosition)

                return v
            })

            if (active){
                active.active = true

                /*_.each(active.widgets, (i) => {
                    delete widgets[i].sticky
                })*/
            }

            return {
                widgets,
                slides
            }
        },

        scrollWidthC(){
            return this.scrollWidth 
        },


       
    }),

    mounted (){
        this.scrollWidth = this.$refs.bodyWrapper.scrollWidth
    },

    methods : {
        toslide(slide){
            console.log('slide', slide, this.scrollWidth, this.scrollWidth * (slide.rleft) / 100)

            this.$refs.bodyWrapper.scrollLeft = this.scrollWidth * (slide.rleft) / 100
        },
        scrolling : function(e){
            this.scroll = e.target.scrollLeft
            this.scrollWidth = e.target.scrollWidth

            console.log('e.target.scrollWidth ', e.target.scrollWidth )
        },
        ctloaded : function({ct, cts}){
            this.ct = ct
            this.cts = cts

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
            this.ct = null
            this.selectedScenario = null
            this.portfolio = null
            this.error = null

            if(!this.portfolioId){
                return Promise.reject('empty')
            }

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
                this.error = e
                console.error(e)

                this.$store.commit('icon', {
                    icon: 'error',
                    message: e.text || e.error
                })

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
        },

        cancelTempAssets : function(){
			this.temp = null
        },

        gotolast : function(){
            this.$emit('changeData', {
                portfolioId : this.last.data.portfolio.id
            })
        },
        
        scenariosChanged : function(){

        },

        scoreConverterChanged : function(){

        },

        changeView : function(v){
            this.view = v
            this.selectedScenario = null
        },

        customStressTestLoaded : function(dct){
            this.lastCustomResult = dct
            //this.ct = dct
            //this.selectedScenario = dct.scenarios[0]
        },

        saveFactors : function(factors){

            this.lastCustomFactors = factors
        },


        customscenariosaved : function(result){

            this.core.pct.scenariosAllIds().then(ids => {

                ids.push(result.id)

                return this.core.settings.stress.set('scenarios', ids)

            }).then(() => {

                this.lastCustomResult = null
                this.lastCustomFactors = null
                this.changeView('stresstest')
                
            })
            
        }

    },
}