import f from '@/application/functions'
import _ from "underscore"

import Capacity from "./capacity";

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
        this.capacity = Capacity
        
    }

    prepare = function(){

        return Promise.resolve()

        return this.api.pct.settings.get().then(r => {

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

        d.scenarios.push({
            id : -1,
            loss : d.assetClasses.longTermReturn,
            name : "Long Term Annualized Return"
        })

        d.scenarios.push({
            id : -2,
            loss : d.assetClasses.dy,
            name : "Yield"
        })

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

            d.scenarios.push(scenario)
        })

        d.scenarios = _.sortBy(d.scenarios, (s) => {
            return s.loss
        })

        d.profit = _.max(d.scenarios, (scenario) =>{
            return scenario.loss
        }).loss

        d.loss = _.min(d.scenarios, (scenario) =>{
            return scenario.loss
        }).loss

        return d
    }

    parseContributors = function(cs){
        var contributors = []


        _.each(cs, (c) => {
            var contributor = {}

            contributor.name = c.Name
            contributor.value = f.numberParse(c.Val)
            contributor.pos = f.numberParse(c.pos)

            contributors.push(contributor)
        })
        
        return contributors
    }

    parseAssets = function(as){
        var assets = []

        _.each(as, (a) => {
            var asset = {}

                asset.value = f.numberParse(a.WP)
                asset.expRatio  = f.numberParse(a.ExpRatio)
                asset.group = a.Group
                asset.sector = a.Sector
                asset.ticker = a.TickerID
                asset.yield = f.numberParse(a.Yield)
                asset.country = a.Country
                asset.name = a.Name
                
            assets.push(asset)
        })

        return assets
    }

    parseAssetsFromFile = function(as){
        var assets = []

        _.each(as, (a) => {
            var asset = {}

                asset.value = f.numberParse(a.Weight)
                asset.ticker = a.SrcTicker
                asset.name = a.Name
                
            assets.push(asset)
        })

        return assets
    }

    parseAssetsFromPdfParser = function(as){
        var assets = []

        _.each(as, (a) => {
            var asset = {}

                asset.value = f.numberParse(a.MarketValue)
                asset.ticker = a.Ticker
                asset.name = a.FullTextInOriginalFile
                
            assets.push(asset)
        })

        return assets
    }

    parseStandartDeviation = function(r){
        var re = {
            longTermReturn : f.numberParse(r.LongTermReturn),
            standardDeviation : f.numberParse(r.StandardDeviation),
            points : []
        }

        re.sharpeRatio = re.longTermReturn / re.standardDeviation

        _.each(r.points, (p) => {
            var point = {
                x : f.numberParse(p.x),
                y : f.numberParse(p.y)
            }

            re.points.push(point)
        })
       
        return re
    }

    get = function(){
        return this.api.pct.crashtest.get().then(r => {
            return Promise.resolve(this.parseCt(r))
        })
    }

    getcontributors = function(id){
        return this.api.pct.contributors.get(id).then(r => {
            return Promise.resolve(this.parseContributors(r))
        })
    }

    getassets = function(id){
        return this.api.pct.portfolio.getassets(id).then(r => {
            return Promise.resolve(this.parseAssets(r))
        })
    }

    getStandartDeviation = function(id){
        return this.api.pct.portfolio.standartDeviation(id).then(r => {
            return Promise.resolve(this.parseStandartDeviation(r))
        })
    }

    loadFromfile = function(data, p){
        return this.api.pct.portfolio.fromfile(data, p).then(r => {
            return Promise.resolve(this.parseAssetsFromFile(r))
        })
    }

}

export default PCT