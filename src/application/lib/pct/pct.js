import f from '@/application/shared/functions.js'
import _, { isObject } from "underscore"

import Capacity from "./capacity";
import Riskscore from "./riskscore";
import ScoreConverter from "./scoreConverter";

import { Portfolio } from '@/application/shared/kit.js'

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

    constructor(core){


        this.api = core.api
        this.capacity = Capacity
        this.riskscore = new Riskscore(this)
        this.vxstorage = core.vxstorage
        this.settings = core.settings.stress
        this.user = core.user
        this.core = core

        this.scoreConverter = new ScoreConverter(this)
        
    }

    destroy (){
        this.scoreConverter.destroy()
    }

    prepare = function(){

        var promises = [
            this.scoreConverter.prepare()
        ]

        return Promise.all(promises)
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

        re.sharpeRatio = re.standardDeviation ? re.longTermReturn / re.standardDeviation : 0

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

        r.sharpeRatio = r.standardDeviation ? r.longTermReturn / r.standardDeviation : 0

        return r
    }

    parseStressTest = function(ct, p = {}){


        var d = {
            scenarios : [],
            ocr : 0,
            term : p.term
        }

        console.log('ct.scenarioResults', ct.scenarioResults)

        _.each(ct.scenarioResults, (s) => {

            if(!s.id){ ///crash rating

                d.ocr = s.value

                return
            }

            var scenario = {}

            scenario.loss = s.value // will be loss
            scenario.name = s.name
            scenario.id = s.id
            scenario.custom = s.isCustom ? true : false

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

        scenario.factors = []

        scenario.key = s.isKeyScenario

        _.each(s.factors, (s) => {
            var factor = {}

            factor.name = s.name
            factor.type = s.type
            factor.value = f.numberParse(s.value)

            scenario.factors.push(factor)
        })

        scenario.factors = _.sortBy(scenario.factors, (f) => {
            return -Math.abs(f.value)
        })

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
            ['client']
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

    ctRelative = function(ct, max){
        var nct = {
            ocr : ct.ocr,
            loss : max ? ct.loss / max : 0,
            profit : max ? ct.profit / max : 0,
            scenarios : _.map(ct.scenarios, (s) => {

                return {
                    id : s.id,
                    name : s.name,
                    loss : max ? s.loss / max : 0,
                    custom : s.custom ? true : false
                }
            }),

            term : ct.term
        }

        return nct
    }

    ocr = function(value){
        return this.scoreConverter.convert(value)
    }

    composeCTS = function(cts, total, mode, portfolios = {}){
        var common = {
            cts : {},
            scenarios : {}
        }

        var maxAbs = 0

        _.each(cts, (ct) => {
            var m = Math.max( Math.abs(ct.loss) , Math.abs(ct.profit))

            if (m > maxAbs){
                maxAbs = m
            }
        })

        if(!total) total = maxAbs

        if (total) maxAbs = maxAbs / total

        else maxAbs = 0
        
        _.each(cts, (c, i) => {

            var portfolio = portfolios[i]

            common.cts[i] = this.ctRelative(c, portfolio && portfolio.isModel ? portfolio.total() : (mode == 'p' && portfolio ? portfolio.total() : total))


            _.each(common.cts[i].scenarios, (scenario) => {
                if(!common.scenarios[scenario.id]) common.scenarios[scenario.id] = {
                    id : scenario.id,
                    name : scenario.name,
                    loss : {},

                    custom : scenario.custom ? true : false
                }


                common.scenarios[scenario.id].loss[i] = scenario.loss
            })
        })

        common.scenarios = _.sortBy(common.scenarios, (sc) => {
            return _.reduce(sc.loss, (m, l) => {
                return m + l
            }, 0)
        })

        common.max = maxAbs
        common.total = total

        if(mode == 'p'){
            common.max = 1
            common.total = 1
        }


        return common
    }

    stresstests = function(ids, total, mode, portfolios){

        var cts = {}

        return Promise.all(_.map(ids, (id) => {
            return this.stresstest(id).then(r => {
                cts[id] = r
    
                return Promise.resolve()
            })
        })).then(r => {
            return Promise.resolve(this.composeCTS(cts, total, mode, portfolios))
        })
      
    }

    stresstestPositionsList = function(assetsLists, mode, p = {}){

        var cts = {}
        var promises = []
        var portfolios = {}
        var term = null

        if(!p.names) p.names = []

        _.each(assetsLists, (assets, i) => {

            var aportfolio = new Portfolio({
                name : "temp",
                id : -(i + 1),
                tempportfolio : true
            })
    
            aportfolio.positions = _.clone(assets)
            aportfolio.name = p.names[i] || ('+ ' + _.reduce(assets, (m, asset) => {

                if(asset.term) term = asset.term
    
                return asset.name + ';' // + ' (' + v + ');' 
    
            }, ''))

            portfolios[aportfolio.id] = aportfolio

            promises.push(this.stresstestPositions(aportfolio.positions, {term}).then((r) => {
                cts[aportfolio.id] = r
    
                return Promise.resolve()
            }))

        })

        var max = _.max(portfolios, (p) => {
            return p.total()}
            )

        return Promise.all(promises).then(() => {

            return Promise.resolve({
                result : this.composeCTS(cts, max.total(), mode, portfolios),
                portfolios
            })

        })
    }

    stresstestWithPositions = function(portfolio, assets, mode, p = {}){
        var cts = {}

        var promises = []

        var portfolios = {
            [portfolio.id] : portfolio
        }

        if(!p.name) p.name = "Editing portfolio"

        var aportfolio = new Portfolio({
            name : p.name,
            id : -1,

            tempportfolio : true
        })

        var term = null

        if(p.term)
            _.each(assets, (asset) => {
                if(asset.term) term = asset.term
            })

        aportfolio.positions = _.clone(assets)

        portfolios[aportfolio.id] = aportfolio

        promises.push(this.stresstest(portfolio.id, {term}).then((r) => {
            cts[portfolio.id] = r

            return Promise.resolve()
        }))

        promises.push(this.stresstestPositions(aportfolio.positions, {term}).then((r) => {
            cts[aportfolio.id] = r

            return Promise.resolve()
        }))

        var max = _.max(portfolios, (p) => {return p.total()})

        return Promise.all(promises).then(() => {

            return Promise.resolve({
                result : this.composeCTS(cts, max.total(), mode, portfolios),
                portfolios
            })

        })
    }

    stresstestWithPositionsSplit = function(portfolio, assets, mode, p = {}){

        var cts = {}

        var promises = []

        var portfolios = {
            [portfolio.id] : portfolio
        }

        var aportfolio = portfolio.clone()

        _.each(assets, (asset) => {
            aportfolio.positions.push({
                ...asset,

                external : true
            })
        })

        aportfolio.originalid = aportfolio.id
        aportfolio.id = aportfolio.id + '_with_assets'

        var term = null

        aportfolio.name = '+ ' + _.reduce(assets, (m, asset) => {

            if(asset.term && p.term) term = asset.term

            //var v = f.values.format(this.core.user.locale, 'd', asset.value)

            return asset.name + ';' // + ' (' + v + ');' 

        }, '')

        portfolios[aportfolio.id] = aportfolio


        promises.push(this.stresstest(portfolio.id, {term}).then((r) => {
            cts[portfolio.id] = r

            return Promise.resolve()
        }))

        promises.push(this.stresstestPortfolio(aportfolio, {term}).then((r) => {
            cts[aportfolio.id] = r

            return Promise.resolve()
        }))

        var max = _.max(portfolios, (p) => {
            return p.total()
        })

        return Promise.all(promises).then(() => {

            return Promise.resolve({
                result : this.composeCTS(cts, max.total(), mode, portfolios),
                portfolios
            })

        })
      
    }

    customstresstest = function(data, p = {}){

        return this.api.pctapi.stress.customtest(data, p).then(r => {
            return Promise.resolve(this.parseStressTest(r))
        })

    }

    stresstestPortfolio = function(portfolio, p = {}){

        var data = {
            portfolioId : portfolio.originalid || portfolio.id,

            positions : _.map(_.filter(portfolio.positions, (p) => {
                return p.external
            }), asset => {
                return {
                    name : asset.name,
                    ticker : asset.ticker,
                    value : asset.value
                }
            } )
        }

        return this.stresstestdt(data, p)
    }

    stresstestPositions = function(positions, p = {}){

        console.log('stresstestPositions', p)

        var data = {
            portfolioId : -1,
            
            positions : _.filter(_.map(positions, asset => {

                return {
                    name : asset.name || asset.ticker,
                    ticker : asset.ticker,
                    value : asset.value
                }
            }), (a) => {
                return a.name
            })
        }

        return this.stresstestdt(data, p)
    }

    stresstest = function(id, p = {}){

        var data = {
            portfolioId : id
        }

        return this.stresstestdt(data, p)

    }

    stresstestdt = function(data, p = {}){

        return this.getscenarios(p).then(scdata => {

            data = {
                ...data,
                ...scdata
            }
            return this.scoreConverter.prepare()

        }).then(() => {
            return this.api.pctapi.stress.test(data, p)
        }).then(r => {
            return Promise.resolve(this.parseStressTest(r, p))
        })

    }

    stressdetails = function(portfolio, p = {}){


        var data = {
            portfolioId : portfolio.originalid || portfolio.id
        }

        var extraPositions = _.map(_.filter(portfolio.positions, (p) => {
            return p.external
        }), asset => {

            return {
                name : asset.name,
                ticker : asset.ticker,
                value : asset.value
            }
        } )

        if (extraPositions.length){
            data.positions = extraPositions
        }

        if (portfolio.tempportfolio){
            data.positions = _.filter(_.map(portfolio.positions, asset => {

                return {
                    name : asset.name || asset.ticker,
                    ticker : asset.ticker,
                    value : asset.value
                }
            }), (a) => {
                return a.name
            })
        }


        return this.getscenarios({term : p.term}).then(scdata => {
            data = {
                ...data,
                ...scdata
            }

            return this.api.pctapi.stress.details(data, p)
        }).then(r => {

            return Promise.resolve(this.parseStressTest(r))
        })

    }

    getscenarios = function(p = {}){

        var data = {}

        var rxscenarios = []
        var customscenarios = []

        return this.scenarios().then(scenarios => {

            rxscenarios = scenarios

            return this.api.pctapi.customscenarios.list()

        }).then(r => {

            customscenarios = r

            return this.settings.getall()

        }).then(settings => {

            if (p.term){
                if(p.term.toLowerCase() == '3y'){

                    data.scenarioIds = ["125", "126", "127", "128", "129"]

                    return Promise.resolve(data)
                }

                if(p.term.toLowerCase() == '6y'){

                    data.scenarioIds = ["130", "131", "132", "133", "134"]

                    return Promise.resolve(data)
                }
            }

            if(!settings.scenarios.value.length){
                data.onlyKeyScenarios = true
            }
            else{

                data.scenarioIds = _.filter(settings.scenarios.value, (id) => {
                    return _.find(rxscenarios, (s) => {
                        return s.id == id
                    })
                })

                data.customScenarioIds = _.filter(settings.scenarios.value, (id) => {
                    return _.find(customscenarios, (s) => {
                        return s.id == id
                    })
                })
            }

            
            return Promise.resolve(data)
        }).catch(e => {
            console.error(e)

            return Promise.reject(e)
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

    scenariosWithCustoms = function(ids){
        return this.scenarios(ids).then(r1 => {
            return this.api.pctapi.customscenarios.list().then(r2 => {


                var filtered = _.filter(r2, (s) => {
                    return !ids || _.indexOf(ids, Number(s.id)) > -1 
                })

                return Promise.resolve(r1.concat(filtered))
            })
        })
    }

    scenariosAllIds = function(){
        var scenarios = null

        return this.scenariosWithCustoms().then(s => {
            scenarios = s

            return Promise.resolve()
        }).then(() => {
            return this.core.settings.stress.getall()
        })
        .then(settings => {

            if (!settings.scenarios.value.length){
                
                var u = []
                _.each(scenarios, (s) => {
                    if(s.key) u.push(s.id)
                })

                return Promise.resolve(u)

            }
            return Promise.resolve(settings.scenarios.value)

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