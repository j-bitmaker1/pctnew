import f from '@/application/functions'
import _, { isObject } from "underscore"

import Capacity from "./capacity";
import Riskscore from "./riskscore";

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

    constructor({api, user, vxstorage}){

        this.api = api
        this.capacity = Capacity
        this.riskscore = new Riskscore(this)
        this.vxstorage = vxstorage
        
    }

    prepare = function(){

        return Promise.resolve()
    }

    parseDefaultCt = function(df){
        var d = {}

        _.each(df, (v, i) => {

            var scmap = {}

            _.each(v.scmap, (s, i) => {

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

                scmap[i] = scenario
            })

            d[i] = {scmap, loss : f.numberParse(v.loss), ocr : f.numberParse(v.loss)}
        })

        return d
    }

    parseScenarioInfo = function(s){
        var scenario = {} 

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

        return scenario
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

            scenario = {
                ...scenario,
                ...this.parseScenarioInfo(s)
            }

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

    parseStandartDeviationOld = function(r){
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
            return Promise.resolve(this.parseStandartDeviationOld(r))
        })
    }

    loadFromfile = function(data, p){
        return this.api.pct.portfolio.fromfile(data, p).then(r => {
            return Promise.resolve(this.parseAssetsFromFile(r))
        })
    }


    ////////////// NEW

    parseStandartDeviation = function(r){

        r.sharpeRatio = r.longTermReturn / r.standardDeviation

    
        return r
    }

    parseStressTest = function(ct){


        var d = {
            scenarios : [],
            ocr : 0
        }

        _.each(ct.scenarioResults, (s) => {

            if(!s.id){ ///crash rating

                d.ocr = s.value

                return
            }

            var scenario = {}

            scenario.loss = s.value // will be loss
            scenario.name = s.name
            scenario.id = s.id

            d.scenarios.push(scenario)
        })

        if(ct.positions){

            d.contributors = {}

            _.each(ct.positions, function(position){
                _.each(position.scenarioResults, (sr) => {
                    d.contributors[sr.id] || (d.contributors[sr.id] = [])


                    d.contributors[sr.id].push({
                        value : sr.value,
                        ticker : position.id /// will be ticker
                    })
                })
            })

        }

        d.scenarios = _.sortBy(d.scenarios, (s) => {
            return s.loss
        })

        d.profit = (_.max(d.scenarios, (scenario) =>{
            return scenario.loss
        }) || {}).loss || 0

        d.loss = (_.min(d.scenarios, (scenario) =>{
            return scenario.loss
        }) || {}).loss || 0

        return d
    }

    parseScenario = function(s){
        var scenario = {} 


        scenario.id = Number(s.id)
        scenario.keywords = _.filter((s.keywords || "").split('; '), function(t) { return t })

        scenario.description = s.description
        scenario.name = s.name
        scenario.region = s.region
        scenario.shocks = s.shocks

        scenario.types = _.uniq(_.filter([s.type, s.type2, s.type3], function(t) { return t }))

        /*_.each(s.sh, (s) => {
            var shock = {}

            shock.name = s.Name
            shock.type = s.Type
            shock.value = f.numberParse(s.Val)

            scenario.shocks.push(shock)
        })*/

        return scenario
    }

    setPortfolioToClient = function(clientid, portfolio, p){

        var portfolioid = portfolio

        if(_.isObject(portfolioid)) portfolioid = portfolio.id

        var data = {
            id : portfolioid,
            crmContactId : clientid
        }
        
        this.vxstorage.invalidateManyQueue(
            [portfolio.crmContactId], 
            ['client', 'lead']
        )

        return this.api.pctapi.portfolios.update(data, p).then(r => {
            return Promise.resolve()
        })
    }

    setPortfoliosToClient = function(clientid, portfolioids, p){

        return Promise.all(_.map(portfolioids, (portfolio) => {
            return this.setPortfolioToClient(clientid, portfolio, p)
        }))

    }

    stresstest = function(id, p = {}){

        var data = {
            portfolioId : id
        }

        return this.api.pctapi.stress.test(data, p).then(r => {

            return Promise.resolve(this.parseStressTest(r))
        })
    }

    stressdetails = function(id, p = {}){

        var data = {
            portfolioId : id
        }

        return this.api.pctapi.stress.details(data, p).then(r => {

            return Promise.resolve(this.parseStressTest(r))
        })
    }

    standartDeviation = function(id){

        var data = {
            portfolioId : id
        }

        return this.api.pctapi.stress.deviation(data).then(r => {
            return Promise.resolve(this.parseStandartDeviation(r))
        })
    }

    scenarios = function(ids){
        return this.api.pctapi.stress.scenarios({}).then(r => {


            var filtered = _.map(_.filter(r, (s) => {
                return !ids || _.indexOf(ids, Number(s.id)) > -1 
            }), (s) => {
                return this.parseScenario(s)
            })


            return Promise.resolve(filtered)
        })
    }

    assets = function(tickers){

        if(!_.isArray(tickers) && tickers.positions) tickers = tickers.positions

        var t = _.filter(_.map(tickers, (t) => {
            if(isObject(t)) {

                if(!t.isCovered) return null 

                return t.ticker
            }

            return t
        }), (t) => {return t})

        return this.api.pctapi.assets.info(t).then(r => {

            var mapped = {}

            _.each(r, (a) => {
                mapped[a.ticker] = a
            })

            return Promise.resolve(mapped)
        })
    }

    parseText = function(txt){
        var lines = txt.split(/\r\n/g)
        var assets = []


        _.each(lines, (line) => {
            var words = f.bw(line)


            if (words.length == 2){
                if(words[1].replace(/[^0-9]/g, '').length == words[1].length){
                    assets.push({search : words[0], value : Number(words[1])})
                }
            }
        })


        return assets
    }

}

export default PCT