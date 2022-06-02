import f from '@/application/functions'
import _ from 'underscore'
import moment from 'moment'

import SVGCreator from './svgcreator'

class PDFReports {

    meta = {
        intro : {
            key : 'intro',
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

        glossary : {
            key : 'glossary',
            require : true
        }
    }

    constructor({api, settings, pct}){
       this.api = api
       this.settings = settings
       this.svgCreator = new SVGCreator()
       this.pct = pct
    }

    scenarioDescription = function(tools){

        var {portfolio, profile} = tools.data

        var image = {
            width : 464,
            height : 587
        }

        var size = {
            width : image.width * 6,
            height : image.height * 6
        }

        return this.pct.stresstest(portfolio.id).then(ct => {

            
    
            var xml = this.svgCreator.make(size, ct)
    
            return this.svgCreator.topng(xml, size)

 
        }).then(img => {
            image.image = img

            return Promise.resolve([image])

        })  

        

        
    }

    positionSummary = function(tools){

        var {portfolio, profile} = tools.data

        var results = []

        var caption = tools.helpers.caption({
            text : "Positions",
            style: 'h3',
            pageBreak : 'before'
        })

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

        }).then(r => {

    
            _.each(r.tables, function(t){
                results.push(t);
            })
    
            return Promise.resolve(results)
          
        })

       
    }

    intro = function(tools){


        moment.locale(tools.data.locale)

        return tools.logotype.insert({

            w : 250,
            h : 50,
            applySize: true,

        }).then(logo => {

            var paddingRight = 50;

            logo.logo.margin = [tools.helpers.sizeByPage(515, 'w') - logo.logo.width - paddingRight, 170, paddingRight, 20];

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

            /*result.push({
                cnt : {
                    text : flball(plan.PLAN_NAME),
                    style : 'h3',
                    margin : [200, 0, paddingRight, 5],
                    alignment : 'right',
                }
            })

            result.push({
                cnt : {
                    text : flball(plan.SPONSOR_DFE_NAME),
                    style : 'h4',
                    margin : [0, 0, paddingRight, 5],
                    alignment : 'right',
                }
            })*/

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

                console.error(e)

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

                percent += 1 / keys.length

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

    
}

export default PDFReports