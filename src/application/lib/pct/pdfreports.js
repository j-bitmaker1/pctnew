import f from '@/application/shared/functions.js'
import _ from 'underscore'
import moment from 'moment'
import SVGMainChart from './svgmainchart2.js'

import {
    Allocation,
    Distribution,
    MonteCarlo
} from "@/application/charts/index.js"

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

        scenarioDefinitions : {
            key : 'scenarioDefinitions',
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

    footnoteNumber = 1;
    replFootnotes = {};

    footnotesFind = [
        {
            rFind: /Russia('s)?/,
            footnote: 'Russia: Market weighted index of companies domiciled in Russia.'
        },
        {
            rFind: /China('s)?/,
            footnote: 'China: Market weighted index of companies domiciled in China.'
        },
        {
            rFind: /S&P 500/,
            footnote: 'S&P 500: Standard & Poors 500 stock index.'
        },
        {
            rFind: /(P|p)eak-to-trough/,
            footnote: 'Peak-to-trough: Return is the biggest loss realized during a given stress scenario. There is no set timeframe over which peak-to-trough losses occur.'
        }
    ];

    scenarioDefinitionsFootnotes = [
        {
            rFind: /10 Years US Government Curve/,
            footnote: '10 Years US Government Curve: Yield-to-maturity on a zero coupon US Treasury bond that matures in 10 years'
        },
        {
            rFind: /United States/i,
            footnote: 'United States: Market weighted index of companies domiciled in United States'
        },
        {
            rFind: /DJ US Total Stock Market Index/i,
            footnote: 'DJ US Total Stock Market Index: Dow Jones index of all US stocks'
        },
        {
            rFind: /Gold/i,
            footnote: 'Gold: Gold futures price series from Chicago Mercantile Exchange'
        },
        {
            rFind: /HYCCC/i,
            footnote: 'HYCCC: Is the credit spread (yield difference with a Treasury of comparable maturity) on the Merrill Lynch CCC or lower-rated index. It signifies the willingness of investors to lend to risky companies and their estimation of their default rate. During risky environments these spreads widen immediately.'
        },
        {
            rFind: /Japan/i,
            footnote: 'Japan: Market weighted index of companies domiciled in Japan'
        },
        {
            rFind: /30 Years US Government Curve/i,
            footnote: '30 Years US Government Curve: Yield-to-maturity on a zero coupon US Treasury bond that matures in 30 years'
        },
        {
            rFind: /EUR/i,
            footnote: 'EUR: Euro FX rate against the US Dollar'
        },
        {
            rFind: /Generic 1st Natural Gas/i,
            footnote: 'Generic 1st Natural Gas: Natural Gas futures price'
        },
        {
            rFind: /Germany/i,
            footnote: 'Germany: Market weighted index of companies domiciled in Germany'
        },
        {
            rFind: /Oil/i,
            footnote: 'Oil: Oil Brent Crude Price'
        },
        {
            rFind: /RUB/i,
            footnote: 'RUB: Russian Ruble FX rate against the US Dollar'
        },
        {
            rFind: /Brazil/i,
            footnote: 'Brazil: Market weighted index of companies domiciled in Brazil'
        },
        {
            rFind: /India/i,
            footnote: 'India: Market weighted index of companies domiciled in India'
        },
        {
            rFind: /Home Equity AAA Spread/i,
            footnote: 'Home Equity AAA Spread: Is the credit spread (yield difference with treasury of comparable maturity) on the bond index that contains securitized mortgages. A widening (increase) in this spread is caused by decreasing housing prices.'
        },
        {
            rFind: /US Generic 10 year BreakEven Spread/i,
            footnote: 'US Generic 10 year BreakEven Spread: Is the difference between the nominal yield on a fixed-rate investment and the real yield (fixed spread) on an inflation-linked investment of similar maturity and credit quality. It indicates inflation expectations as expressed by the traders who are trading government securities and inflation-linked instruments. In our convention when spreads narrow (decrease) – the inflation expectations are increasing.'
        }
    ];

    

    constructor({api, settings, pct, i18n}){
        this.api = api
        this.settings = settings
        this.i18n = i18n
        this.pct = pct
    }
    

    stressTest = function(tools){
        var {portfolio, profile, rollover, valuemode} = tools.data

        

        var size = {
            width : 2789,
            height : 3520
        }

        var images = []

        var portfolios = {}

        _.each([portfolio, rollover], (p) => {
            if(p){
                portfolios[p.id] = p
            }
        }) 


        _.find(portfolios, (portfolio) => {
            return portfolio.isModel
        }) ? valuemode = 'p' : '';


        return this.pct.stresstestskt(portfolios, valuemode, { term: true, fee : asset => {
            return portfolio.advisorFee || 0
        }}).then(cts => {

            var svgmainchart = new SVGMainChart()

            var xml = svgmainchart.createSvgs(cts, "Test Name", portfolios, valuemode);
   
            return Promise.all(_.map(xml, (xml, i) => {
                return tools.svgTools.topng(xml, size).then(img => {
                    images[i] = img
                })
            }))
 
        }).then(() => {

            var result = _.map(images, (img, i) => {
                var image = tools.size({width : 0.9, height : 0.9})

                    image.image = img
                    image.alignment = 'center'
                    image.width = 500
                    image.height = 631.050555

                if(!i){
                    image.pageBreak = 'before'
                }

                return image
            })

            
            return Promise.resolve(result)

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

        var footnotes = [];
        return this.pct.scenariosWithCustoms().then(s => {
            scenarios = s


            return this.pct.stresstest(portfolio.id).then(_ct => {
                ct = _ct

                return tools.helpers.tables({
                    rowsInTable : 9,   
                    pageOffset : 0, 
                    array : ct.scenarios,
                    
                    body : function(index){
                        return [[{
                            margin: [ 2, 4, 2, 4 ],
                            style : 'hScenarioDescription',
                            bold : true,
                            alignment : 'left',
                            text : 'Stress Scenarios'
                        }, {
                            margin: [ 2, 4, 2, 4 ],
                            style : 'hScenarioDescription',
                            bold : true,
                            alignment : 'left',
                            text : 'Description'
                        }, {
                            margin: [ 2, 4, 2, 4 ],
                            style : 'hScenarioDescription',
                            bold : true,
                            alignment : 'left',
                            text : 'Event Duration'
                        }]]
                    },
        
                    table : function(body, index){
                        return tools.tables.scenarioDescription({
                            margin: [ 2, 20, 2, 10 ],
                            body : body,
                            widths : [100, 200,'*']
                        })
                    },
        
                    row : (_p, clbk)=>{
                        var id = _p.item.id;
                        
                        var info = scenarios.find(x => x.id == id);

                     
                        var row = [
                            {
                                margin: [ 3, 3, 3, 5 ],
                                text : info.name,
                                style : 'table'
                            },
                            {
                                margin: [ 0, 3, 3, 5 ],
                                text : this.getFootnotes(footnotes, info.shocks, _p.pages, this.footnotesFind),
                                style : 'table'
                            },
                            {
                                margin: [ 0, 3, 3, 5 ],
                                text : this.getFootnotes(footnotes, info.description, _p.pages, this.footnotesFind),
                                style : 'table'
                            }
                        ];
        
                        clbk(row);
        
                    },
                })
            })
        }).then(r => {

            _.each(r.tables, function(t, i){   // i - page
                results.push(t);

                var first = 0;
                footnotes.forEach((footnote) => {
                    if(footnote.page == i){
                        if(first == 0){
                            first = 1;
                            var line = {
                                text: '___________________________',
                                style: 'note'
                            };
                            results.push(line);
                        }
                        var ss = {
                            text: footnote.text,
                            style: 'header'
                        }
                        results.push(ss);
                    }
                  })
            })

            return Promise.resolve(results)
        })
        
    }

    scenarioDefinitions = function(tools){
        var {portfolio, profile} = tools.data

        var scenarios = null,
            ct = null;

        var results = []

        var caption = tools.helpers.caption({
            text : this.i18n.t("Scenario Definitions"), 
            style: 'h3',
            pageBreak : 'before'
        })

        results.push(caption)

        var footnotes = [];
        return this.pct.scenariosWithCustoms().then(s => {
            scenarios = s

            var iid = 0;
            var maxt = 0;
            scenarios.forEach((tt) => {
                var k = 0;
                    tt.factors.forEach((kk) => {
                        if(kk.value != 0){
                            k++;
                        }
                      });
                if(k > maxt){
                    
                    maxt = k;
                    iid = tt.id;
                }
              });
        
            return this.pct.stresstest(portfolio.id).then(_ct => {
                ct = _ct

                var maxL = -1;
                if( maxL == -1){
                    ct.scenarios.forEach((xct) => {
                        var info = scenarios.find(x => x.id == xct.id);


                        if(maxL < info.factors.length){
                            maxL = info.factors.length;
                        }
                    });
                }
                if(maxL>7){
                    maxL = 7;
                }

                return tools.helpers.tables({
                    rowsInTable : 7,   
                    pageOffset : 0, 
                    array : ct.scenarios,
                    
                    body : function(index){
                      
                        
                        var result = [[{
                            margin: [ 2, 4, 2, 4 ],
                            style : 'hScenarioDescription',
                            bold : true,
                            alignment : 'left',
                            text : 'Stress Scenarios'
                        }, {
                            margin: [ 2, 4, 2, 4 ],
                            style : 'hScenarioDescription',
                            bold : true,
                            alignment : 'left',
                            text : 'Shocks',
                            colSpan: maxL
                        }]];
                        for(var i = 0; i<maxL-1;i++){
                            result[0].push({});
                        }

                        return result;
                    },
        
                    table : function(body, index){
                        
                        var wid = [];
                        
                        wid.push('*');
                        for(var i = 0; i < maxL; i++){
                            wid.push(50);
                        }

                        return tools.tables.scenarioDescription({
                            margin: [ 2, 20, 2, 10 ],
                            body : body,
                            widths : wid
                        })
                    },
        
                    row : (_p, clbk)=>{
                      
                        var id = _p.item.id;
                        
                        var info = scenarios.find(x => x.id == id);

                    
                        var row = [];
        
                        row.push(
                            {
                                margin: [ 3, 3, 0, 5 ],
                                text : info.name,
                                style : 'table'
                            }
                        )
                        for(var i = 0; i < maxL - 1; i++){

                            if(info.factors[i] != null){

                                var val = '';
                                if (info.factors[i].type == 'country' || 
                                    info.factors[i].type == 'currency' || 
                                    info.factors[i].type == 'industry' || 
                                    info.factors[i].type == 'perm_factor' || 
                                    info.factors[i].type == 'stress_index'
                                    ) 
                                    val += info.factors[i].value + '%';
                                else val += Math.round(info.factors[i].value * 100) + 'bps';

                                row.push(
                                    {
                                        text:[
                                            {
                                                margin: [ 2, 3, 2, 5 ],
                                                text : this.getFootnotes
                                                (
                                                    footnotes, 
                                                    info.factors[i].name + '\n',
                                                    _p.pages, 
                                                    this.scenarioDefinitionsFootnotes
                                                ),
                                                style : 'scenarioDefinitions'
                                            },
                                            {
                                                margin: [ 2, 3, 2, 5 ],
                                                text : val,
                                                style : info.factors[i].value >= 0 ? 'gVal' : 'rVal'
                                            },
                                        ]
                                });
                            }
                            else{
                                row.push(
                                    {
                                        margin: [ 3, 3, 0, 5 ],
                                        text : '',
                                        style : 'scenarioDefinitions'
                                });
                            }
                        }
                        if(info.factors.length > maxL){
                            var text = [];
                            for(var i = maxL - 1; i < info.factors.length; i++){

                                
                                var val = '';
                                if (info.factors[i].type == 'country' || 
                                    info.factors[i].type == 'currency' || 
                                    info.factors[i].type == 'industry' || 
                                    info.factors[i].type == 'perm_factor' || 
                                    info.factors[i].type == 'stress_index'
                                    ) 
                                    val += info.factors[i].value + '%';
                                else val += Math.round(info.factors[i].value * 100) + 'bps';
                                
                                text.push(
                                    {
                                        margin: [ 2, 3, 2, 5 ],
                                        text : info.factors[i].name + '\n',
                                        style : 'scenarioDefinitions'
                                    },
                                    {
                                        margin: [ 2, 3, 2, 5 ],
                                        text : val + '\n\n',
                                        style : info.factors[i].value >= 0 ? 'gVal' : 'rVal'
                                    },
                                )
                            }
                            row.push({
                                text: text
                            });
                        }
                        else{
                            if(info.factors[maxL - 1] != null){

                                var val = '';
                                if (info.factors[maxL - 1].type == 'country' || 
                                    info.factors[maxL - 1].type == 'currency' || 
                                    info.factors[maxL - 1].type == 'industry' || 
                                    info.factors[maxL - 1].type == 'perm_factor' || 
                                    info.factors[maxL - 1].type == 'stress_index'
                                    ) 
                                    val += info.factors[maxL - 1].value + '%';
                                else val += Math.round(info.factors[maxL - 1].value * 100) + 'bps';


                                row.push(
                                    {
                                        text:[
                                            {
                                                margin: [ 1, 3, 1, 5 ],
                                                text : info.factors[maxL - 1].name + '\n',
                                                style : 'scenarioDefinitions'
                                            },
                                            {
                                                margin: [ 1, 3, 1, 5 ],
                                                text : val,
                                                style : info.factors[maxL - 1].value >= 0 ? 'gVal' : 'rVal'
                                            },
                                        ]
                                });
                            }
                            else{
                                row.push(
                                    {
                                        margin: [ 2, 3, 2, 5 ],
                                        text : '',
                                        style : 'scenarioDefinitions'
                                });
                            }
                        }
                        clbk(row);
        
                    },
                })
            })
        }).then(r => {

            _.each(r.tables, function(t, i){   // i - page
                results.push(t);

                var first = 0;
                footnotes.forEach((footnote) => {
                    if(footnote.page == i){
                        if(first == 0){
                            first = 1;
                            var line = {
                                text: '___________________________',
                                style: 'note'
                            };
                            results.push(line);
                        }
                        var ss = {
                            text: footnote.text,
                            style: 'header'
                        }
                        results.push(ss);
                    }
                  })
            })

            return Promise.resolve(results)
        })
        
    }
    
    getFootnotesDuration = function(footnotes, rName, page){


        var result = rName;
        for(var i = 0; i < this.footnotesFind.length; i++){
            if(!this.replFootnotes[i] && result.search(this.footnotesFind[i].rFind) != -1){
                var replaceT = result.match(this.footnotesFind[i].rFind)[0];
                result = result.replace(this.footnotesFind[i].rFind, replaceT + ' (' + this.footnoteNumber + ')');

                footnotes.push({
                    page: page,
                    text: '\r\n' + this.footnoteNumber + '. ' + this.footnotesFind[i].footnote
                });

                
                this.replFootnotes[i] = this.footnoteNumber;

                this.footnoteNumber += 1;
            }
        }
        return result;
    }

    getFootnotes = function(footnotes, rName = '', page, footnotesAll){


        var result = rName;
        for(var i = 0; i < footnotesAll.length; i++){
            if(!this.replFootnotes[i] && result.search(footnotesAll[i].rFind) != -1){
                var replaceT = result.match(footnotesAll[i].rFind)[0];
                result = result.replace(footnotesAll[i].rFind, replaceT + ' (' + this.footnoteNumber + ')');

                footnotes.push({
                    page: page,
                    text: '\r\n' + this.footnoteNumber + '. ' + footnotesAll[i].footnote
                });

                
                this.replFootnotes[i] = this.footnoteNumber;

                this.footnoteNumber += 1;
            }
        }
        return result;
    }

    positionSummaryRollover = function(tools){

        var {portfolio, rollover} = tools.data

        var results = []
        var portfolios = [portfolio, rollover]

        var caption = tools.helpers.caption({
            text : this.i18n.t("pdfreports.reports.positionSummary"),
            style: 'h3',
            pageBreak : 'before'
        })

        var mode = 'p100'

        _.find(portfolios, (portfolio) => {
            return !portfolio.isModel
        }) ? mode = 'd' : ''


        var positions = {}

        _.each(portfolio.positions, (asset) => {

            var multiple = 1
            var multipleTraded = 1

            if (portfolio.isModel && !rollover.isModel) multiple = rollover.total()

            var position = {ticker : asset.ticker, name : asset.name}

            console.log('multiple', multiple, position.value)

                position.value = f.values.format(null, mode, asset.value * multiple) 
                position._value = asset.value * multiple

                position.traded = f.values.format(null, mode, 0)
                position._traded = 0

            var rolloverAsset = rollover.get(asset.ticker)

            if (rolloverAsset){

                if (!portfolio.isModel && rollover.isModel) multipleTraded = 1 / portfolio.total()

                position.traded = f.values.format(null, mode, rolloverAsset.value * multipleTraded) 
                position._traded = rolloverAsset.value * multipleTraded
            }


            positions[asset.ticker] = position
        })

        _.each(rollover.positions, (asset) => {

            if(positions[asset.ticker]) {return}

            var multipleTraded = 1

            var position = {ticker : asset.ticker, name : asset.name}

            position.value = f.values.format(null, mode, 0)
            position._value = 0

            if (!portfolio.isModel && rollover.isModel) multipleTraded = 1 / portfolio.total()

            position.traded = f.values.format(null, mode, asset.value * multipleTraded) 
            position._traded = asset.value * multipleTraded

            positions[asset.ticker] = position
        })


        positions = _.sortBy(_.toArray(positions), (position) => {
            return - Math.max(position._value, position._traded) 
        })


        return this.pct.assetsPortfolios(portfolios).then(assetsInfo => {

            results.push(caption)

            return tools.helpers.tables({
                rowsInTable : 14,   //строк в таблице
                pageOffset : 0, 
                array : positions,
    
                body : function(index){

                    var result = [[{
                        margin: [ 2, 4, 2, 4 ],
                        style : 'hScenarioDescription',
                        bold : true,
                        alignment : 'left',
                        text : 'Ticker ID'
                    }, {
                        margin: [ 2, 4, 2, 4 ],
                        style : 'hScenarioDescription',
                        bold : true,
                        alignment : 'left',
                        text : 'Ticker Name'
                    }, {
                        margin: [ 2, 4, 2, 4 ],
                        style : 'hScenarioDescription',
                        bold : true,
                        alignment : 'left',
                        text : 'Ticker Weight'
                    }, {
                        margin: [ 2, 4, 2, 4 ],
                        style : 'hScenarioDescription',
                        bold : true,
                        alignment : 'left',
                        text : 'Traded'
                    }, {
                        margin: [ 2, 4, 2, 4 ],
                        style : 'hScenarioDescription',
                        bold : true,
                        alignment : 'left',
                        text : 'Security Yield'
                    }, {
                        margin: [ 2, 4, 2, 4 ],
                        style : 'hScenarioDescription',
                        bold : true,
                        alignment : 'left',
                        text : 'Expense Ratio'
                    }]];

                    return result;
                },
    
                table : function(body, index){
                    return tools.tables.scenarioDescription({
                        margin: [ 0, 10, 0, 0 ],
                        body : body,
                        widths : [80, 120, 60, 60, 60, 60],
                        style : 'table'
                    })
                },
    
                row : function(_p, clbk){
                    var position = _p.item;
                    
                    var row = [{
                        margin: [ 2, 3, 2, 3 ],
                        text : position.ticker + '\n',
                        style : 'table'
                    },{
                        margin: [ 2, 3, 2, 3 ],
                        text : position.name,
                        style : 'table'
                    },{
                        margin: [ 2, 3, 2, 3 ],
                        text : position.value,
                        style : 'table'
                    },{
                        margin: [ 2, 3, 2, 3 ],
                        text : position.traded,
                        style : 'table'
                    },{
                        margin: [ 2, 3, 2, 3 ],
                        text : assetsInfo[position.ticker] ? assetsInfo[position.ticker].yield : '-',
                        style : 'table'
                    },{
                        margin: [ 2, 3, 2, 3 ],
                        text : assetsInfo[position.ticker] ? assetsInfo[position.ticker].expRatio : '-',
                        style : 'table'
                    }];
    
                    clbk(row);
    
                }
    
            })
        })

        .then(r => {
            
            
            _.each(r.tables, function(t){
                results.push(t);

                var tt = {
                    text: '\n\nSecurity Yield - Dividend Yield for equities and funds. Yield-to-Maturity for individual bonds.',
                    style: 'note'
                };
                results.push(tt);
                var tt = {
                    text: 'Expense Ratio - The amount investors pay for expenses incurred in operating a mutual fund (after any waivers).',
                    style: 'note'
                };
                results.push(tt);
            })
    
            return Promise.resolve(results)
          
        })

       
    }


    positionSummary = function(tools){

        var {portfolio, profile, rollover} = tools.data

        if (rollover){
            return this.positionSummaryRollover(tools)
        }

        var results = []

        var caption = tools.helpers.caption({
            text : this.i18n.t("pdfreports.reports.positionSummary"),
            style: 'h3',
            pageBreak : 'before'
        })

        var mode = portfolio.isModel ? 'p100' : 'd'

        return this.pct.assets(portfolio).then(assetsInfo => {

            results.push(caption)

            return tools.helpers.tables({
                rowsInTable : 14,   //строк в таблице
                pageOffset : 0, 
                array : portfolio.positions,
    
                body : function(index){

                    var result = [[{
                        margin: [ 2, 4, 2, 4 ],
                        style : 'hScenarioDescription',
                        bold : true,
                        alignment : 'left',
                        text : 'Ticker ID'
                    }, {
                        margin: [ 2, 4, 2, 4 ],
                        style : 'hScenarioDescription',
                        bold : true,
                        alignment : 'left',
                        text : 'Ticker Name'
                    }, {
                        margin: [ 2, 4, 2, 4 ],
                        style : 'hScenarioDescription',
                        bold : true,
                        alignment : 'left',
                        text : 'Ticker Weight'
                    }, {
                        margin: [ 2, 4, 2, 4 ],
                        style : 'hScenarioDescription',
                        bold : true,
                        alignment : 'left',
                        text : 'Security Yield'
                    }, {
                        margin: [ 2, 4, 2, 4 ],
                        style : 'hScenarioDescription',
                        bold : true,
                        alignment : 'left',
                        text : 'Expense Ratio'
                    }]];

                    return result;
                },
    
                table : function(body, index){
                    return tools.tables.scenarioDescription({
                        margin: [ 0, 10, 0, 0 ],
                        body : body,
                        widths : [100, 150, 70, 60, 60],
                        style : 'table'
                    })
                },
    
                row : function(_p, clbk){
                    var position = _p.item;
                    
                    var row = [{
                        margin: [ 2, 3, 2, 3 ],
                        text : position.ticker + '\n',
                        style : 'table'
                    },{
                        margin: [ 2, 3, 2, 3 ],
                        text : position.name,
                        style : 'table'
                    },{
                        margin: [ 2, 3, 2, 3 ],
                        text : f.values.format(null, mode, position.value) ,
                        style : 'table'
                    },{
                        margin: [ 2, 3, 2, 3 ],
                        text : assetsInfo[position.ticker] ? assetsInfo[position.ticker].yield : '-',
                        style : 'table'
                    },{
                        margin: [ 2, 3, 2, 3 ],
                        text : assetsInfo[position.ticker] ? assetsInfo[position.ticker].expRatio : '-',
                        style : 'table'
                    }];
    
                    clbk(row);
    
                }
    
            })
        })

        .then(r => {
            
            
            _.each(r.tables, function(t){
                results.push(t);

                var tt = {
                    text: '\n\nSecurity Yield - Dividend Yield for equities and funds. Yield-to-Maturity for individual bonds.',
                    style: 'note'
                };
                results.push(tt);
                var tt = {
                    text: 'Expense Ratio - The amount investors pay for expenses incurred in operating a mutual fund (after any waivers).',
                    style: 'note'
                };
                results.push(tt);
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
        // var results = [];
        
        // var table= [
        //         {
        //             style: 'tableExample',
        //             table: {
        //                 body: [
        //                     ['Column 1', 'Column 2', 'Column 3'],
        //                     ['One value goes here', 'Another one here', 'OK?']
        //                 ]
        //             }
        //         },
        // ];
        // results.push(table);

        // return Promise.resolve(results)
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
        var d = [];

        var tt = [{
            text: 'IMPORTANT DISCLOSURE INFORMATION ABOUT YOUR PORTFOLIO CRASH TEST',
            style: 'disclosure_H',
            pageBreak : 'before'
        },
        {
            text: '\0\tA Portfolio Crash Test is a stress-testing tool developed by RiXtrema, Inc. that uses simulations and statistical analyses to help investors and their financial professionals understand the risk profile of their investment portfolios.  Stress testing does this by measuring how different macroeconomic scenarios could affect portfolio returns.  In order to get the most out of your Portfolio Crash Test (sometimes called "PCT" below), it is important that you understand how the tool is designed and how it should and should not be used.  To that end, we urge you to read the following information carefully.',
            style: 'disclosure'
        },
        
        
        
        
        {
            text: '\0\tWhy the Concept of Risk Is Important',
            style: 'disclosure_H2'
        },
        {
            text: '\0\tAll investments involve risk.  Investing in equities (i.e., stocks) involves volatility risk, market risk, business risk and industry risk.  Volatility risk is the chance that the value of a stock will fall.  Market risk is the chance that the prices of all stocks will fall due to conditions in the economic environment.  Business risk is the chance that a specific company\'s stock will fall because of issues affecting it.  Industry risk is the chance that a set of factors particular to an industry group will adversely affect stock prices within the industry.',
            style: 'disclosure'
        },
        {
            text: '\0\tInvesting in fixed-income securities (e.g., bonds) involves interest-rate risk, credit risk and inflation risk. Interest rate risk is the possibility that bond prices will decrease because of an interest rate increase.  When interest rates rise, bond prices and the values of fixed-income securities fall; conversely, when interest rates fall, bond prices and the values of fixed-income securities rise.  Credit risk is the risk that a company will not be able to pay its debts, including the interest on its bonds. Inflation risk is the possibility that the interest paid on an investment in bonds will be lower than the inflation rate, thus decreasing purchasing power.',
            style: 'disclosure'
        },
        {
            text: '\0\tEven cash alternatives, such as money-market funds and US Treasury bills entail risk.  In addition to inflation risk, investments in money market securities may involve credit risk and a risk of principal loss.  Because such securities are neither insured nor guaranteed by any government agency, there is no assurance that the value of your investment will be held to $1 per share.  US Treasury bills are subject to market risk if sold prior to maturity.  Market risk is the possibility that the value, when sold, might be less than the purchase price.',
            style: 'disclosure'
        },
        {
            text: '\0\tInternational investing involves additional risks including, but not limited to, changes in currency exchange rates, differences in accounting and taxation policies and political or economic instabilities that can increase or decrease returns.',
            style: 'disclosure'
        },
        
        
        {
            text: '\0\tCriteria and Methodology Used in the PCT',
            style: 'disclosure_H2'
        },
        {
            text: '\0\tThe PCT tool uses a stress-testing methodology that is widely accepted in the risk-management industry and is based on a factor risk model.  This model describes relevant risk factors, such as liquidity, interest rates, equity, industry and other factors that explain a security\'s behavior.  RiXtrema then calculates how each security in an investor\'s portfolio  is exposed to each identified factor.  Stated another way, we determine the "Beta" (the tendency of a security\'s returns to respond to swings in the market) of each security to each risk factor.  Once this is accomplished, we create a matrix that describes the correlations between each of the factors and each of the securities in the portfolio, to arrive at a risk rating for each security. The aggregate risk of the portfolio is determined by aggregating each security\'s risk rating and weighting that rating by the security\'s position in the portfolio.  The results shown in the PCT reports reflect the changes in a portfolio based on the factors used to model each scenario.',
            style: 'disclosure'
        },
        
        
        
        
        
        {
            text: '\0\tPortfolio Crash Test Scenarios',
            style: 'disclosure_H2'
        },
        {
            text: '\0\tThe key scenarios displayed in the PCT are created by RiXtrema\'s research department and board of scientific advisors. These scenarios are updated approximately monthly, and reflect RiXtrema\'s deep experience in risk analysis and assessments of relevant risk scenarios given the state of the markets at a particular point in time.',
            style: 'disclosure'
        },
        {
            text: '\0\tWhile RiXtrema selects scenarios it deems to be plausible, Portfolio Crash Tests do not forecast the likelihood that any particular scenario will come to pass.  We do not believe it is possible to predict future market events and we discourage users of our stress-testing tool from trying to do so.  Although each scenario is designed separately, taken as a whole, the scenarios simulated in a PCT report are designed to be comprehensive in the sense that they cover a variety of impacts on key risk factors.',
            style: 'disclosure'
        },
        {
            text: '\0\tScenarios include positive events (events that would make portfolio returns rise) and negative events (events that would make portfolio returns fall).  The positive events tend to occur over multiple years, while the negative events (crashes) are transient.  In order to reflect this fact, the positive scenarios reflected in a PCT use estimates of annualized moves in factors, while the negative scenarios use peak-to-trough numbers.',
            style: 'disclosure'
        },
        {
            text: '\0\tRiXtrema\'s research team and scientific advisors determine the magnitude of shocks in each scenario by considering how the relevant factors moved in similar environments historically, and by then determining whether historical environments should be replicated or adjusted based on differences in the current environment.  In the absence of historic events to use as a guide, RiXtrema decides whether to move the factor 1 standard deviation* (mild shock), 2 standard deviations (strong shock) or 3 or more standard deviations (extreme shock).',
            style: 'disclosure'
        },
        
        
        
        {
            text: '\n\n\0\tThe Crash Rating',
            style: 'disclosure_H2'
        },
        {
            text: '\0\tEach PCT includes a crash rating, which is a number from 1 to 100 that indicates the relative riskiness of the portfolio in question.  The higher the number, the more vulnerable the portfolio is to losses in downside events.  In order to arrive at this number, we start with the sum of the three largest losses that the portfolio would incur among all stress scenarios.  We then compare that number to a table that maps the sum of the three losses to the crash rating.',
            style: 'disclosure'
        },
        {
            text: '\0\tThis mapping process involves computing the sum of the three largest losses for the MSCI Emerging Markets Index (used as a proxy for a risky portfolio) and assuming that number to be a crash rating of 90.  Anything above that number is extremely risky (e.g. individual emerging markets stocks), and ratings below that number signify relatively less risky portfolios.  By way of comparison, the crash rating of the S&P 500 index is typically around 70.',
            style: 'disclosure'
        },



        {
            text: '\0\tKey Assumptions and Limitations',
            style: 'disclosure_H2'
        },
        
        [
                {text: '\0\tLike all investment analysis tools, the PCT is a simulation based on certain assumptions.  In simulating various macroeconomic environments and the impact those factors have on portfolio performance, the PCT model assumes that: ',
                style: 'disclosure'},
                
                {
                    ul: [
                        {text: 'The set of scenarios that occur in real life will resemble the simulated set.  If there is a completely new scenario that contradicts presently modeled financial and economic relationships, the tool will be less useful.',
                            style: 'disclosure2'},
                        {text: 'RiXtrema has captured all the key systemic factors. ',
                            style: 'disclosure2'},
                        {text: 'Securities betas do not change dramatically in stress events and remain close to what RiXtrema estimates based on their past history. ',
                            style: 'disclosure2'},
                        {text: 'The underlying data used in calculating the returns displayed in a PCT report are reliable.',
                            style: 'disclosure2'}
                    ]
                    
                }

        ],
        {
            text: '\0\tFurthermore, while the PCT tool provides an easy-to-understand way to determine the risk profile of a particular portfolio, it is important that investors understand the tool\'s limitations, including the following: ',
            style: 'disclosure'
        },
        [
			{text: [
				{text: '\0\tIMPORTANT: ', style: 'disclosure_H3'},
				{text: 'The projections and other information generated by the Portfolio Crash Test tool regarding the likelihood of various investment outcomes are hypothetical in nature, do not reflect actual investment results and are not guarantees of future results.  ', style: 'disclosure'}
			]},

            {
                ul: [
                    {text: 'Portfolio Crash Tests do not forecast the likelihood that any particular scenario will come to pass. ',
                        style: 'disclosure2'},
                    {text: 'Because the tool\'s scenarios are updated from time to time, the results of the Portfolio Crash Test may vary with each use and over time. ',
                        style: 'disclosure2'},
                    {text: 'Performance results factored into the tool are calculated over many years; small changes can create large differences in future results. ',
                        style: 'disclosure2'},
                    {text: 'The Portfolio Crash Test is designed to be used with portfolios containing at least 5 different investments.  Any risk assessment tool involves imprecision, and this imprecision may grow if the tool is applied to a single security or just a few securities. ',
                        style: 'disclosure2'},
                    {text: 'Portfolio Crash Tests do not select investments for you.  You cannot use this tool alone to determine which securities to buy or sell or when to buy or sell them.  Before making an investment decision, consult with your investment professional. ',
                        style: 'disclosure2'},
                    {text: 'This Portfolio Crash Test report does not provide legal, tax or accounting advice.  Consult appropriate professionals for advice that meets your specific needs. ',
                        style: 'disclosure2'},
                    {text: 'In calculating the returns displayed in a Portfolio Crash Test report, RiXtrema relies on a variety of third-party sources for pricing information, mutual fund and ETF data, economic data and the like.  While RiXtrema believes these sources to be reliable and the data to be accurate, it does not guarantee that this is so.',
                        style: 'disclosure2'}
                ]
            }
		],
        {
            text: '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n_____________________________________________________',
            style: 'disclosure2'
        },
        {
            text: '* Standard deviation is a measure of the dispersion of a set of data from its mean. The more spread apart the data, the higher the deviation. Standard deviation is calculated as the square root of the sum of squared differences between historical returns and the average return for the stress index.',
            style: 'disclosure2'
        }
        ];

        d.push(tt);

        return Promise.resolve(d)

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

        if (profile && profile.questionnaire){

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
                },{
                    mode : portfolio.isModel ? 'p100' : 'd'
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
        var {portfolio, profile, rollover} = tools.data

        var result = []

        var caption = tools.helpers.caption({
            text : this.i18n.t("pdfreports.reports.allocation"),
            style: 'h3',
            pageBreak : 'before'
        })
       
        var portfolios = _.filter([portfolio, rollover], (p) => {return p})
        var assetsInfoBp = {}
        var widths = _.map(portfolios, (p) => {return "*"})

        return Promise.all(_.map(portfolios, (p) => {
            return this.pct.assets(portfolio).then((assetsinfo) => {
                assetsInfoBp[p.id] = assetsinfo

                return Promise.resolve()
            })
        })).then(() => {

            result.push(caption)

            var allocation = new Allocation()

            var groups = allocation.groups()
            var portfolioResults = {}
            var body = []

            console.log('assetsInfoBp', assetsInfoBp)

            return Promise.all(_.map(portfolios, (portfolio) => {
                var groupresults = {}

                var positions = portfolio.joined()

                var assetsinfo = assetsInfoBp[portfolio.id]

                return Promise.all(_.map(groups, (group) => {

                    //var result = []
    
                    var g = f.group(positions, (a) => {
    
                        var info = assetsinfo[a.ticker]
        
                        if(!info) return "Not covered"
        
                        return info[group.id] || 'Other'
                    })
    
                    var image = tools.size({width : 1 / portfolios.length, height : portfolios.length == 1 ? 0.4 : 0.3})
            
                    var size = {
                        width : image.width * 6,
                        height : image.height * 6
                    }

                    console.log('size', size)
    
                    var chartData = allocation.chartData(g)
    
                    var chartOptions = allocation.chartOptions(chartData, {
                        print : true,
                        ...size
                    })
    
    
                    return tools.chart(chartOptions, size).then(img => {
                        image.image = img
    
                        //result.push(subcaption)
                        //result.push(image)
            
                        groupresults[group.id] = image
                    })
    
                })).then(r => {

                    portfolioResults[portfolio.id] = groupresults

                    return Promise.resolve()

                    _.each(groups, (group) => {
                        result = result.concat(groupresults[group.id]) 
                    })
    
                    return Promise.resolve(result)
                })


            })).then(() => {

                _.each(groups, (group) => {

                    var crow = [{
                        ...tools.helpers.caption({
                            text : this.i18n.t(group.text),
                            style: 'h4'
                        }),

                        colSpan : portfolios.length
                    }]

                    for(var i = 1; i < portfolios.length; i++){
                        crow.push({})
                    }

                    body.push(crow)

                    var prow = []

                    _.each(portfolios, (portfolio) => {

                        var itable = tools.tables.nobp({
                            widths : ["*"],
                            body : [[{
                                text : portfolio.name,
                                style : 'table',
                                alignment : 'center'
                            }],
                            [portfolioResults[portfolio.id][group.id]]]
                        })

                        prow.push(itable)

                    })

                    body.push(prow)
                })



                result.push(tools.tables.nobp({
                    widths,
                    body
                }))

                console.log('result', result)


                return Promise.resolve(result)
            })
        }).catch(() => {
            return Promise.resolve(result)
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