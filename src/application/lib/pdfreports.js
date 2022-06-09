import f from '@/application/functions'
import _ from 'underscore'
import moment from 'moment'


import {
    Allocation,
    Distribution,
    MonteCarlo
} from "../charts/index.js"

class PDFReports {

    meta = {
        intro : {
            key : 'intro',
            require : true
        },

        stressTest: {
            key : 'stressTest',
            require : true
        },

        scenarioDescription : {
            key : 'scenarioDescription',
            default : true
        },

        positionSummary : {
            key : 'positionSummary',
            default : true
        },
        allocation: {
            key : 'allocation',
            default : true
        },

        distribution: {
            key : 'distribution',
            default : true
        },

        capacity: {
            key : 'capacity',
            default : true
        },

        glossary : {
            key : 'glossary',
            require : true
        },

        disclosure : {
            key : 'disclosure',
            require : true
        },

        userdisclosure : {
            key : 'userdisclosure',
            require : true
        },
    }

    constructor({api, settings, pct, i18n}){
        this.api = api
        this.settings = settings
        this.i18n = i18n
        this.pct = pct
    }

    stressTest = function(tools){
        var {portfolio, profile} = tools.data

        var image = tools.size({width : 0.9, height : 0.9})

        var size = {
            width : image.width * 6,
            height : image.height * 6
        }

        return this.pct.stresstest(portfolio.id).then(ct => {
    
            var xml = tools.svgCreator.make(size, ct)
    
            return tools.svgCreator.topng(xml, size)
 
        }).then(img => {
            image.image = img
            image.alignment = 'center'
            return Promise.resolve([image])

        }) 
    }

    scenarioDescription = function(tools){

        var {portfolio, profile} = tools.data

        var scenarios = null,
            ct = null;

        var results = []

        var caption = tools.helpers.caption({
            text : this.i18n.t("pdfreports.reports.scenarioDescription"), 
            style: 'h3',
            pageBreak : 'before'
        })

        results.push(caption)

        return this.pct.scenarios().then(s => {
            scenarios = s

            return this.pct.stresstest(portfolio.id).then(_ct => {
                ct = _ct
            })
        }).then(r => {


            return Promise.resolve(results)
        })
        
    }

    positionSummary = function(tools){

        var {portfolio, profile} = tools.data

        var results = []

        var caption = tools.helpers.caption({
            text : this.i18n.t("pdfreports.reports.positionSummary"),
            style: 'h3',
            pageBreak : 'before'
        })


        return this.pct.assets(portfolio).then(assetsInfo => {

            console.log("assetsInfo", assetsInfo)

            results.push(caption)

            return tools.helpers.tables({
                rowsInTable : 18,
                pageOffset : 10,
                array : portfolio.positions,
    
                body : function(index){
                    return []
                },
    
                table : function(body, index){
                    return tools.tables.standart({
                        margin: [ 0, 10, 0, 0 ],
                        body : body,
                        widths : [100, '*'],
                        style : 'table'
                    })
                },
    
                row : function(_p, clbk){
                    var position = _p.item;
    
                    var row = [{
                        margin: [ 0, 3, 0, 3 ],
                        text : position.ticker + '\n',
                        style : 'table'
                    },{
                        margin: [ 0, 3, 0, 3 ],
                        text : position.name,
                        style : 'table'
                    }];
    
                    clbk(row);
    
                }
    
            })
        })

        .then(r => {

    
            _.each(r.tables, function(t){
                results.push(t);
            })
    
            return Promise.resolve(results)
          
        })

       
    }

    intro = function(tools){

        var {portfolio, profile} = tools.data

        moment.locale(tools.data.locale)

        return tools.logotype.insert({

            w : 250,
            h : 50,
            applySize: true,

        }).then(logo => {

            var paddingRight = 50;

            logo.logo.margin = [200, 170, paddingRight, 20];

            var result = []

            result.push({
                cnt : logo.logo
            })

            result.push({
                cnt : {
                    text : tools.data.meta.reportName,
                    color : tools.data.meta.titleColor || "#000",
                    style : 'h1',
                    margin : [0, 160, paddingRight, 70],
                    alignment : 'right',
                }
            })

            result.push({
                cnt : {
                    text: 'Date of creation: ' + moment(new Date()).local().format("LL"),
                    fontSize: 8,
                    alignment: 'right',
                    bold: true,
                    margin: [0, 10, paddingRight, 4],
                }
            })

            return Promise.resolve(result)
        })
       
    }

    report = function(key, tools){
        if (this.meta[key] && this[key]){


            return this[key](tools).then(r => {
                return Promise.resolve(r)
            }).catch(e => {

                console.error(e, key)

                return Promise.reject(e)
            })

        }
        else{
            return Promise.resolve([])
        }
    }

    glossary = function(tools){

        var content = [];

        var glossary = tools.glossary || {};

        if(_.isEmpty(glossary)) return Promise.resolve([])

        content.push({
            text: 'Glossary of terms:',
            style: 'h3',
            pageBreak : 'before'
        });

        var gs = _.sortBy(_.map(glossary, function(g, i){
            return {
                w : i,
                d : g
            }
        }), function(g){
            return g.w;
        });

        var	gsTable = {
            key : "glossary",
            layout: 'noBorders',
            margin: [0, 20, 0, 10],
            table : {
                widths: [130, "*"],
                body: []
            }
        };

        _.each(gs, function(g, i){

            var row = [
                {
                    text : g.w,
                    bold : true,
                    margin: [ 4, 4, 4, 4 ],
                    style : "table"
                },
                {
                    text : g.d,
                    margin: [ 4, 4, 4, 4 ],
                    style : "table",
                    alignment : "justify"
                }
            ];

            if(i % 2 == 0)
            {
                row[0].fillColor = '#E6E6E6';
                row[1].fillColor = '#E6E6E6';
            }

            gsTable.table.body.push(row);

        })

        content.push(gsTable)

        return Promise.resolve(content)
    }

    disclosure = function(tools){
       var result = []

       return Promise.resolve(result)
    }

    userdisclosure = function(tools){
        var {disclosure} = tools.data

        if(!disclosure) return Promise.resolve([])

        var d = tools.byEditorjs(disclosure)

        if (d && d.length) d[0].pageBreak = 'before'

        return Promise.resolve(d)
    }
    
    make = function(keys, tools, p = {}){
        var parts = {}
        var percent = 0

        var allkeys = []

        _.each(this.meta, function(m){
            if(m.require || _.indexOf(keys, m.key) > -1) allkeys.push(m.key)
        })

        return Promise.all(_.map(allkeys, (k) => {

            return this.report(k, tools).then(cnt => {

                parts[k] = cnt

                percent += 1 / allkeys.length

                if(p.progress) p.progress(percent)

                return Promise.resolve()
            })
            

        })).then(() => {


            _.each(allkeys, (k) => {
                tools.compose(parts[k]) 
            })

            if(p.progress) p.progress(1)

            return Promise.resolve(tools)
        })
    }

    capacity = function(tools){
        var {portfolio, profile} = tools.data

        var result = []

        if (profile.questionnaire){

            var monteCarlo = new MonteCarlo()

            return this.api.crm.questionnaire.getresult(profile.questionnaire).then(questionnaire => {
                var initial = this.pct.riskscore.convertQrToCapacity(questionnaire.capacity)

                var values = {
                    ... monteCarlo.defaultValues(),
                    ... initial
                }

                var options = {
                    age : values.ages[0],
                    retire : values.ages[1],
                    savings : values.savings,
                    save : values.save,
                    withdraw : values.withdraw,
                    salary : values.salary //terminal value
                }
        
                var extra = {
                    savemoreRange1 : values.savemoreRange[0],
                    savemoreRange2 : values.savemoreRange[1],
                    withdrawRange1 : values.withdrawRange[0],
                    withdrawRange2 : values.withdrawRange[1],
                    withdraw : values.withdraw
                }

                var capacity = new this.pct.capacity({
                    options : options,
                    extra : extra
                })

                var image = tools.size({width : 1, height : 0.4})
        
                var size = {
                    width : image.width * 6,
                    height : image.height * 6
                }
    
                var simulation = capacity.simulation()

                var chartOptions = monteCarlo.chartOptions({
                    simulation : simulation,
                    dataoptions : options,
                    locale : tools.data.locale
                }, {
                    print : true,
                    ...size
                })

                var caption = tools.helpers.caption({
                    text : this.i18n.t("pdfreports.reports.capacity"),
                    style: 'h3',
                    pageBreak : 'before'
                })

                return tools.chart(chartOptions, size).then(img => {
                    image.image = img

                    result.push(caption)
                    result.push(image)
        
                    return Promise.resolve(result)
                })
            
            })
        }
        else{
            return Promise.resolve(result)
        }
    }

    distribution = function(tools){

        var {portfolio, profile} = tools.data

        var result = []


        return this.pct.standartDeviation(portfolio.id).then(deviation => {

            var distribution = new Distribution()

            var periods = distribution.periods()
            var stds = distribution.stds()

            var pares = []

            _.each(periods, (period) => {
                _.each(stds, (std) => {
                    pares.push({
                        period,
                        std,
                        id : period.value + '' + std.value
                    })
                })
            })

            var caption = tools.helpers.caption({
                text : this.i18n.t("pdfreports.reports.distribution"),
                style: 'h3',
                pageBreak : 'before'
            })

            result.push(caption)

            var groupresults = {}

            return Promise.all(_.map(pares, (pare) => {

                var result = []

                var image = tools.size({width : 1, height : 0.4})
        
                var size = {
                    width : image.width * 6,
                    height : image.height * 6
                }

                var series = distribution.series({
                    total : portfolio.total(),
                    locale : tools.data.locale,
                    deviation : deviation,
                    period : pare.period.value,
                    current_std : pare.std.value
                })

                var chartOptions = distribution.chartOptions(series, {
                    print : true,
                    ...size
                })

                var subcaption = tools.helpers.caption({
                    text : "Period: " + this.i18n.t(pare.period.text) + ", deviation: " + this.i18n.t(pare.std.text),
                    style: 'h4'
                })

                return tools.chart(chartOptions, size).then(img => {
                    image.image = img

                    result.push(subcaption)
                    result.push(image)
        
                    groupresults[pare.id] = result
                })

            })).then(r => {
                _.each(pares, (pare) => {
                    result = result.concat(groupresults[pare.id]) 
                })

                return Promise.resolve(result)
            })
            

        }).catch(e => {
            return Promise.resolve(result)
        })
    }

    allocation = function(tools){
        var {portfolio, profile} = tools.data

        var result = []

        var caption = tools.helpers.caption({
            text : this.i18n.t("pdfreports.reports.allocation"),
            style: 'h3',
            pageBreak : 'before'
        })
       

        return this.pct.assets(portfolio).then(assetsinfo => {
            result.push(caption)

            var allocation = new Allocation()

            var groups = allocation.groups()

            var groupresults = {}

            var positions = portfolio.joined()

            return Promise.all(_.map(groups, (group) => {

                var result = []

                var g = f.group(positions, (a) => {

                    var info = assetsinfo[a.ticker]
    
                    if(!info) return "Not covered"
    
                    return info[group.id] || 'Other'
                })

                var image = tools.size({width : 1, height : 0.4})
        
                var size = {
                    width : image.width * 6,
                    height : image.height * 6
                }

                var chartData = allocation.chartData(g)

                var chartOptions = allocation.chartOptions(chartData, {
                    print : true,
                    ...size
                })

                var subcaption = tools.helpers.caption({
                    text : this.i18n.t(group.text),
                    style: 'h4'
                })

                return tools.chart(chartOptions, size).then(img => {
                    image.image = img

                    result.push(subcaption)
                    result.push(image)
        
                    groupresults[group.id] = result
                })

            })).then(r => {
                _.each(groups, (group) => {
                    result = result.concat(groupresults[group.id]) 
                })

                return Promise.resolve(result)
            })


        }).catch(e => {
            return Promise.resolve(result)
        })

        
    }
}

export default PDFReports