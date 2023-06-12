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

    getasset = function(ticker){
        return this.api.pctapi.stress.annuities.get(ticker).then(r => {
            if(r) return Promise.resolve(r)

            else {
                return this.api.pctapi.assets.info([ticker]).then(r => {

                    return Promise.resolve(r[0])
                })
            }

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

    parseLtrDetails = function(r){
        var d = {}

        _.each(r, (a) => {

            if (d[a.id]){
                d[a.id].weight += parseFloat(a.weight.replace(/[,]/g,''))
            }
            else{
                d[a.id] = {
                    country : a.country,
                    expRatio : parseFloat(a.expRatio) / 100,
                    ticker : a.id,
                    lclbeta : parseFloat(a.lclbeta) / 100,
                    lclidx : parseFloat(a.lclidx) / 100,
                    ltr : parseFloat(a.ltr) / 100,
                    yield : parseFloat(a.yield) / 100,
                    weight : parseFloat(a.weight.replace(/[,]/g,'')),

                    margin_spread : a.margin_spread ? (parseFloat(a.margin_spread) / 100) : 0,
                    stepup_rate : a.stepup_rate ? (parseFloat(a.stepup_rate) / 100) : 0,
                    upside_max : a.upside_max ? (parseFloat(a.upside_max) / 100) : 0,
                    enhancement : a.enhancement ? (parseFloat(a.enhancement) / 100) : 0

                }
            }

            
        })

        return d
    }

    parseStressTest = function(ct, p = {}){


        var d = {
            scenarios : [],
            ocr : 0,
            term : p.term,
            ltr : 0,
            yield : 0
        }

        var c = {}

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

            c[s.id] = scenario

            if(scenario.id == -2){
                d.yield = scenario.loss || 0
            }

            if(scenario.id == -1){
                d.ltr = scenario.loss || 0
            }
        })

        if (ct.positions){

            d.contributors = {}

            _.each(ct.positions, function(position){
                _.each(position.scenarioResults, (sr) => {
                    d.contributors[sr.id] || (d.contributors[sr.id] = [])


                    d.contributors[sr.id].push({
                        value : sr.value,
                        ticker : position.id /// will be ticker
                    })

                    if (c[sr.id])
                        c[sr.id].contributors = d.contributors[sr.id]
                })
            })

        }

        if(!p.saveorder)

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

            var percentedValue = (portfolio && portfolio.isModel) || (mode == 'p' && portfolio)

            
            var value = percentedValue ? portfolio.total() : total

            console.log("percentedValue", percentedValue, portfolio, total, value)


            common.cts[i] = this.ctRelative(c, value)
            
            //this.ctRelative(c, portfolio && portfolio.isModel ? portfolio.total() : (mode == 'p' && portfolio ? portfolio.total() : total))


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

    stresstestskt = function(portfolios, mode, p){

        var filtered = {}

        _.each(portfolios, (p) => {
            if(p) filtered[p.id] = p
        })

        var positions = []

        _.each(filtered, (p) => {
            positions = positions.concat(p.positions)
        })

        return (p.term ? this.calcterm(positions) : Promise.resolve(0)).then(term => {


            p.term = term

            var cts = {}
            var max = _.max(filtered, (p) => {return p.total()})
            var total = max.total()

            console.log('total', total)

            return Promise.all(_.map(filtered, (portfolio) => {

                var promise = portfolio.id < 0 ? this.stresstestPositions(portfolio.positions, p) : this.stresstest(portfolio.id, p)

                return promise.then(r => {
                    cts[portfolio.id] = r
        
                    return Promise.resolve()
                })
            })).then(r => {

                return Promise.resolve(this.composeCTS(cts, total, mode, filtered))
            })
        })

        
      
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
        if(!p.fee) p.fee = []

        var common = []

        _.each(assetsLists, (assets, i) => {
            common = common.concat(assets)
        })

        
        return (p.term ? this.calcterm(common) : Promise.resolve(0)).then(term => {

            _.each(assetsLists, (assets, i) => {

                var aportfolio = new Portfolio({
                    name : "temp",
                    id : -(i + 1),
                    tempportfolio : true
                })
        
                aportfolio.positions = _.clone(assets)
                aportfolio.name = ('+ ' + _.reduce(assets, (m, asset) => {

                    //if(asset.term && p.term) term = asset.term
        
                    return asset.name + ';' // + ' (' + v + ');' 
        
                }, ''))

                if(p.names[i]) aportfolio.name = p.names[i]

                portfolios[aportfolio.id] = aportfolio

                promises.push(this.stresstestPositions(aportfolio.positions, {term, fee : p.fee[i]}).then((r) => {
                    cts[aportfolio.id] = r
        
                    return Promise.resolve()
                }))

            })


            var max = _.max(portfolios, (p) => { return p.total() })

            return Promise.all(promises).then(() => {

                return Promise.resolve({
                    result : this.composeCTS(cts, max.total(), mode, portfolios),
                    portfolios
                })

            })

        })
    }

    totalPositions = function(positions){
        return _.reduce(positions, (m, p) => {

            return (p.isCovered || p.external || p.annuity_type) ? m + p.value : m

        }, 0)
    }

    calculateLoss = function(ltr, term, fee = 0, serverAlternative, positions){

        var total = this.totalPositions(positions)

        //if (annuity.Margin_spread > 0) ttlLTR = ttlLTR - annuity.Margin_spread * 100;
        //if (annuity.upside_max != 0 && ttlLTR > annuity.upside_max * 100) ttlLTR = annuity.upside_max * 100; // Upper limit
        //if (annuity.enhancement != 0) ttlLTR = ttlLTR * annuity.enhancement;
        //if (annuity.stepup_rate != 0 && ttlLTR > 0 && ttlLTR < annuity.stepup_rate) ttlLTR = annuity.stepup_rate; // Step Up  initially in %
        
        if (ltr){
            return _.reduce(ltr, (m, asset) => {

                var p = (Math.pow(1 + (asset.ltr || asset.lclidx) + asset.yield - (fee ? fee(asset) || 0 : 0) - asset.expRatio, term) - 1)

                if(asset.margin_spread) p = p - asset.margin_spread
                if(asset.upside_max && p > asset.upside_max) p = asset.upside_max
                if(asset.enhancement > 0) p = p * asset.enhancement
                if(asset.stepup_rate > 0 && p > 0 && p < asset.stepup_rate) p = asset.stepup_rate
                
                return m + asset.weight * p
    
            }, 0)
        }

        if ((term && term > 1) || fee){
            return total * (Math.pow(1 + serverAlternative / total - (fee ? fee() || 0 : 0), term) - 1)
        }
        
        return serverAlternative
    }

    correctTermLTR = function(ct = {}, term = '', ltr = null, fee, positions){
        

        var rct = JSON.parse(JSON.stringify(ct));

        var scenario = _.find(rct.scenarios, (scenario) => {
            return scenario.id == -1
        })

        console.log('term', term)

        if(!term) term = 1

        if (scenario){
            var t = term
            //var t = Number(term.replace("Y", ''))
            //var total = portfolio.total()

            //scenario.loss = total * (Math.pow(1 + scenario.loss / total, t) - 1)
            scenario.term = t
            scenario.name = 'Long Term Return' + (t > 1 ? ' ('+t+' years)' : '') 

            scenario.loss = this.calculateLoss(ltr, t, fee, scenario.loss, positions)
            
            //this.calculateLoss(ltr, t, fee)


            return rct
            
        }

        return ct
    }

    composePortfolio = function(assets, p = {}){

        var aportfolio = p.portfolio ? p.portfolio.clone() : new Portfolio({
            name : "temp",
            id : -1,

            tempportfolio : true
        })


        if(p.portfolio){
            _.each(assets, (asset) => {
                aportfolio.positions.push({
                    ...asset,
                    external : true
                })
            })

            aportfolio.originalid = aportfolio.id
            aportfolio.id = aportfolio.id + '_with_assets'
            aportfolio.name = '+ ' + _.reduce(assets, (m, asset) => {
                return asset.name + ';'
            }, '')
        }
        else{
            aportfolio.positions = _.clone(assets)

            aportfolio.name = _.reduce(assets, (m, asset) => {
                return asset.name + ';'
            }, '')
        }

        if(p.name){
            aportfolio.name = p.name
        }

        return aportfolio
       
    }

    /* */

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

        /*if (p.term)
            _.each(assets, (asset) => {
                if(asset.term) term = asset.term
            })*/

        aportfolio.positions = _.clone(assets)

        portfolios[aportfolio.id] = aportfolio

        return (p.term ? this.calcterm([].concat(portfolio.positions, assets)) : Promise.resolve(0)).then(term => {
            promises.push(this.stresstest(portfolio.id, {

                term,  
                fee : p.fee || null
    
            }).then((r) => {
                
                cts[portfolio.id] = r
    
                return Promise.resolve()
            }))
    
            promises.push(this.stresstestPositions(aportfolio.positions, {
    
                term,  
                fee : p.fee || null
    
            } ).then((r) => {
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
        })

        
    }

    annuities = function(){
        return this.api.pctapi.stress.annuities.list()
    }

    calcterm = function(positions){
        var term = 0

        return this.annuities().then((list) => {

            console.log('positions', positions)

            _.each(positions, (p) => {

                var inl = _.find(list, (a) => {
                    return a.id == p.ticker
                })

                if (inl){
                    if(inl.term){
                        var t = Number(inl.term.replace("Y", '')) 

                        if(term < t) term = t 
                    }
                }

            })

            return Promise.resolve(term)

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

        //var term = null

        aportfolio.name = '+ ' + _.reduce(assets, (m, asset) => {

            //if(asset.term && p.term) term = asset.term

            //var v = f.values.format(this.core.user.locale, 'd', asset.value)

            return asset.name + ';' // + ' (' + v + ');' 

        }, '')

        portfolios[aportfolio.id] = aportfolio

        return (p.term ? this.calcterm([].concat(portfolio.positions, assets)) : Promise.resolve(0)).then(term => {

            promises.push(this.stresstest(portfolio.id, {
                term,  
                fee : p.fee || null
            }).then((r) => {
    
                cts[portfolio.id] = r
    
                return Promise.resolve()
            }))
    
            promises.push(this.stresstestPortfolio(aportfolio, {
                term, 
                fee : p.fee || null
            }).then((r) => {
                cts[aportfolio.id] =  r
    
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
                    value : asset.value,
                    isCovered : asset.isCovered,
                    annuity_type : asset.annuity_type
                }
            } )
        }

        return this.stresstestdt(data, p)
    }

    stresstestPositions = function(positions, p = {}){

        var data = {
            portfolioId : -1,
            
            positions : _.filter(_.map(positions, asset => {

                return {
                    name : asset.name || asset.ticker,
                    ticker : asset.ticker,
                    value : asset.value,
                    isCovered : asset.isCovered,
                    annuity_type : asset.annuity_type
                }
            }), (a) => {
                return a.name
            })
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
        }).then(r => {

            if(p.term || p.fee){

                return (p.term ? this.ltrdetails(data) : Promise.resolve(null)).then((ltr) => {

                    return this.getpositions(data).then((positions) => {
                        return Promise.resolve(this.correctTermLTR(r, p.term, ltr, p.fee, positions))
                    })
                    
                })

            }

            return Promise.resolve(r)
        })

    }

    stresstest = function(id, p = {}){

        var data = {
            portfolioId : id
        }

        return this.stresstestdt(data, p)

    }

    getpositions = function(data){

        return data.portfolioId && data.portfolioId > 0 ? this.api.pctapi.portfolios.get(data.portfolioId).then((portfolio) => {

            return portfolio.positions

        }) : Promise.resolve([]).then((r) => {
            return [].concat(data.positions || [], r)
        })
    }

    customstresstest = function(data, p = {}, method = 'customtest'){

        return this.api.pctapi.stress[method](data, p).then(r => {
            return Promise.resolve(this.parseStressTest(r, {
                saveorder : true
            }))
        })

    }

    customtestStressTestsScenariosFromFactors = function(portfolios, factors, p = {}){

        var result = {}

        return Promise.all(_.map(portfolios, (portfolio) => {

            return this.customstresstest({
                portfolio,
                factors
            }, {}, 'customtestScenariosFromFactors').then((r) => {

                result[portfolio.id] = r
            })

        })).then(() => {
            return Promise.resolve(result)
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
                if(p.term == 3){

                    data.scenarioIds = ["125", "126", "127", "128", "129"]

                    return Promise.resolve(data)
                }

                if(p.term == 6){

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

            return Promise.reject(e)
        })

    }

    ltrdetails = function(data = {}){
        /*var data = {
            portfolioId : id
        }*/

        return this.api.pctapi.stress.ltrdetails(data).then(r => {
            return Promise.resolve(this.parseLtrDetails(r))
        })
    }

    ltrdetailsByAssets = function(portfolios = []){

        var positions = {}

        _.each(portfolios, (portfolio) => {
            _.each(portfolio.positions, (asset) => {

                if(!positions[asset.ticker]){
                    positions[asset.ticker] = {
                        name : asset.name,
                        ticker : asset.ticker,
                        value : 1
                    }
                }
            })
         
        })

        return this.ltrdetails({
            positions : _.toArray(positions)
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

    assetsPortfolios = function(portfolios){
        var positions = []

        _.each(portfolios, (portfolio) => {
            positions = positions.concat(portfolio.positions)
        })

        return this.assets(positions)
    }

    assets = function(tickers){

        if(!_.isArray(tickers) && tickers.positions) tickers = tickers.positions

        var t = _.uniq(_.filter(_.map(tickers, (t) => {
            if(isObject(t)) {

                if(!t.isCovered) return null 

                return t.ticker
            }

            return t
        }), (t) => {return t}), (t) => {return t})

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

    getPortfolioFromOptimization(portfolio, traded){

        var positions = portfolio.positions

        var newpositions = []


        _.each(positions, (asset) => {

            var ca = _.clone(asset)

            var lp = _.find(traded, (ta) => {
                return asset.ticker == ta.cTicker || asset.name == ta.cName
            })

            if (lp){
                ca.value = parseFloat(lp.cWo.replace(/[,]/g,''))
                ca.optimized = true
            }
            
            newpositions.push(ca)
          
        })

        var add = _.filter(traded, (ta) => {
            var f = _.find(newpositions, (asset) => {
                return asset.ticker == ta.cTicker || asset.name == ta.cName
            })

            if(!f) return true
        })

        _.each(add, (ta) => {
            newpositions.push({
                isCovered : true,
                value : parseFloat(ta.cWo.replace(/[,]/g,'')),
                name : ta.cName,
                ticker : (ta.cTicker || "").replace(" EQUITY", "")
            })
        })

        var aportfolio = portfolio.clone()
            aportfolio.name = "Optimized portfolio"
            aportfolio.id = -1
            aportfolio.tempportfolio = true
            aportfolio.positions = newpositions

        return aportfolio
    }   

    optimization = function(portfolio, data, p = {}){

        return this.optimizationParameters(portfolio, data).then((data) => {

            return this.api.pctapi.stress.optimization.get(data, p)

        }).then((r) => {

            return Promise.resolve(this.getPortfolioFromOptimization(portfolio, r.tradedAsset))
        })
    }

    optimizationParameters = function(portfolio, data, p = {}){


        var types = {
            "modelType": "string",
            "optimizeOcr": "string",
            "targetOcr": "string",
            "targetLoss": "string",
            "scenarioId": "string",
            "turnover": "string",
            "maxPosition": "string",
            "equityMin": "string",
            "equityMax": "string",
            "fixedIncomeMin": "string",
            "fixedIncomeMax": "string",
            "currencyMin": "string",
            "currencyMax": "string",
            "commodityMin": "string",
            "commodityMax": "string",
            "alternativesMin": "string",
            "alternativesMax": "string",
            "optimizerStep": "string",
            "optimizeRp": "string",
            "targetRp": "string",
            "sumWeights": "string",
            "crashLoss": "string",
            "ltr": "string",
            "horizon": "string",
            "crash1": "string",
            "crash2": "string",
            "saveMore": "string",
            "saveMoreFrom": "string",
            "saveMoreTo": "string",
            "withDraw": "string",
            "withDrawFrom": "string",
            "withDrawTo": "string",
            "useBuyList": "string",
            "useOnlyBuyList": "string",
            "gradualOptimization": "string"
        }

        var result = {
            buyListId : 0,
            optimizeOcr : data.ocr ? 1 : 0,
            targetOcr : data.ocr || 0,

            targetLoss: data.scenario ? data.scenario.loss : 0,
            scenarioId: data.scenario ? data.scenario.id : 0,

            turnover : 'maxpositions',
            maxPosition : 'maxpositions',

            equityMin : 0,
            equityMax : 'maxpositions',

            fixedIncomeMin: 0,
            fixedIncomeMax: "maxpositions",
            currencyMin: 0,
            currencyMax: "maxpositions",
            commodityMin: 0,
            commodityMax: "maxpositions",
            alternativesMin: 0,
            alternativesMax: "maxpositions",

            useBuyList: 0,
            useOnlyBuyList: 0,
            gradualOptimization: 0,

            portfolioId : -1,
        }
        
        return this.core.getsettings("OPTIMIZATION", portfolio.id).then(s => {

            var total = portfolio.total()


            if (s){
                result.turnover = total * (s.totalturnover || 100) / 100
                result.maxPosition = total * (s.maxPositionSize || 100) / 100

                if (s.alternatives){
                    result.alternativesMin = total * (s.alternatives[0] || 0) / 100
                    result.alternativesMax = total * (s.alternatives[1] || 0) / 100
                }

                if (s.commodity){
                    result.commodityMin = total * (s.commodity[0] || 0) / 100
                    result.commodityMax = total * (s.commodity[1] || 0) / 100
                }

                if (s.currency){
                    result.currencyMin = total * (s.currency[0] || 0) / 100
                    result.currencyMax = total * (s.currency[1] || 0) / 100
                }

                if (s.equity){
                    result.equityMin = total * (s.equity[0] || 0) / 100
                    result.equityMax = total * (s.equity[1] || 0) / 100
                }

                if (s.fixedIncome){
                    result.fixedIncomeMin = total * (s.fixedIncome[0] || 0) / 100
                    result.fixedIncomeMax = total * (s.fixedIncome[1] || 0) / 100
                }

                if(s.optimizationMode == 1){
                    result.gradualOptimization = 1
                }

                if(s.buylist){

                    result.buyListId = s.buylist.value
                    result.useBuyList = 1

                    if(s.useOnlyBuyList){
                        result.useOnlyBuyList = 1
                    }

                }

                var assets = []

                _.each(portfolio.positions, (asset) => {

                    if (s[asset.ticker]){
                        var asc = {
                            ticker : asset.originalTicker || asset.ticker,
                            isTradable : true,
                            minValue : total * (s[asset.ticker][0] || 0) / 100,
                            maxValue : total * (s[asset.ticker][1] || 1) / 100
                        }

                        assets.push(asc)
                    }
                })

                if (assets.length){
                    result.optimizerConstraints = assets
                }

            }

            _.each(result, (v, i) => {
                if(v == 'maxpositions') result[i] = total
            })

            result.positions = _.map(portfolio.positions, (asset) => {
                return {
                    name : asset.name,
                    ticker : asset.ticker,
                    value : asset.value
                }
            })

            _.each(types, (t, i) => {
                if (typeof result[i] != 'undefined' && result[i].toString){
                    result[i] = result[i].toString()
                }
            })

            return result
        })

        


    }


    benchmarks = function(scale = 1){

        var result = {}

        var spypositions = [{
            isCovered : true,
            name :"SPDR S&P 500 ETF TRUST",
            ticker : "SPY US",
            value : 100
        }]

        var spyaggpositions = [{
            isCovered : true,
            name :"SPDR S&P 500 ETF TRUST",
            ticker : "SPY US",
            value : 60
        },{
            isCovered :  true,
            name : "ISHARES BARCLAYS AGGREGATE",
            ticker: "AGG US",
            value: 40,
        }]

        var getresult = function(index, data){
            result[index] = {
                ocr : data.ocr,
                loss : data.loss * scale,
                ploss : (data.loss).toFixed(1),
                profit : data.profit * scale,
                pprofit : (data.profit).toFixed(1),
                scenarios : _.map(data.scenarios, (scenario) => {
                    return {
                        ...scenario,
                        loss : (scenario.loss || 0) * scale,
                        ploss : (scenario.loss || 0).toFixed(1)
                    }
                }),
                yield : data.yield * scale,
                pyield : (data.yield).toFixed(1),
                ltr : data.ltr * scale,
                pltr : (data.ltr).toFixed(1)
            }

            /*var y = _.find(data.scenarios, (s) => {
                return s.id == -2
            }) || {}

            result[index].yield = (y.loss || 0) * scale

            var l = _.find(data.scenarios, (s) => {
                return s.id == -1
            }) || {}

            result[index].ltr = (l.loss || 0) * scale*/
        }

        var promises = [
            this.stresstestPositions(spypositions).then(r => {
                getresult('spy', r)
            }),
            this.stresstestPositions(spyaggpositions).then(r => {
                getresult('spyagg', r)
            })
        ]

        return Promise.all(promises).then(() => {
            return Promise.resolve(result)
        })

    }

}

export default PCT