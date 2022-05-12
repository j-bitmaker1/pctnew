import f from '@/application/functions'
import _ from "underscore"

class PCT {

    defaults = {
        optimizeRestrictions : {
            TotalTurnover: 100,
            MaxPosition: 100,
            EquityMin: 0,
            EquityMax: 100,
            FixedIncomeMin: 0,
            FixedIncomeMax: 100,
            CurrencyMin: 0,
            CurrencyMax: 100,
            CommodityMin: 0,
            CommodityMax: 100,
            AlternativesMin: 0,
            AlternativesMax: 100
        },

        currency : "d",

        IncludeScenarios : []
    }

    constructor({api, user}){
        this.api = api
    }

    prepare = function(){
        return this.api.pct.settings.get().then(r => {

            console.log("R", r)
            
            return Promise.resolve(r)
        })
    }

    parseCt = function(ct){
        var d = {}

        var ac = ct.AssetClasses[0]

        d.assetClasses = {
            dy : f.numberParse(ac.DY),
            longTermReturn : f.numberParse(ac.LongTermReturn)
        }

        d.average3Losses = f.numberParse(ct.Average3Losses)

        d.portfDate = f.date.fromshortstring(ct.PortfDate) 
        d.portfName = ct.PortfName
        d.portfPath = ct.PortfPath
        
        d.ocr = f.numberParse(ct.ocr)
        d.pcr = f.numberParse(ct.pcr)
        d.ocrPos = f.numberParse(ct.ocrPos)
        d.pcrPos = f.numberParse(ct.pcrPos)
        d.total = f.numberParse(ct.sumWeights)

        d.gf = _.clone(ct.gf)

        d.scenarios = []

        _.each(ct.sc, (s) => {
            var scenario = {}

            scenario.corr = f.numberParse(s.Corr)
            scenario.loss = f.numberParse(s.Loss)

            scenario.pl = f.numberParse(s.Pl)
            scenario.pr = f.numberParse(s.Pr)
            scenario.ovrl = f.numberParse(s.Ovrl)

            scenario.id = s.ID
            scenario.key = s.key
            scenario.shock = s.Sh

            scenario.shortDescription = s.Description
            scenario.description = s.Description2
            scenario.name = s.Name

            scenario.shocks = []

            _.each(s.sh, (s) => {
                var shock = {}

                shock.name = s.Name
                shock.type = s.Type
                shock.value = f.numberParse(s.Val)

                scenario.shocks.push(shock)
            })

            d.scenarios.unshift(scenario)
        })

        d.profit = _.max(d.scenarios, (scenario) =>{
            return scenario.loss
        }).loss

        d.loss = _.min(d.scenarios, (scenario) =>{
            return scenario.loss
        }).loss

        return d
    }

    get = function(){
        return this.api.pct.crashtest.get().then(r => {
            return Promise.resolve(this.parseCt(r))
        })
    }

}

export default PCT