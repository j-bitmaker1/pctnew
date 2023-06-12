import pctdefault from './pctdefault'
import f from '@/application/shared/functions.js'

class Riskscore {

    constants = {
        minLoss : 0,
        maxLoss : 60,
        crmap : null,
        scenarios : [
    
    
            {
                id : "loss",
                name : "Maximum Loss",
                negative : true,
                maxloss : true,
                max : -6.8,
                min : -60,
                description : 'Return you can expect in a market crash of 55%'
            },

            {
                id : "82",
                name : "Maximum Outcome",
                description : 'Portfolio return when stocks go up 30%',
                max : 40,
                min : 0
            },
    
            
            
        ],
        _loss : [
            [0, 0.072],
            [40, 15.2],
            [80, 50.9],
            [1, 0.074],
            [41, 16.0],
            [81, 51.8],
            [2, 0.075],
            [42, 16.8],
            [82, 52.8],
            [3, 0.077],
            [43, 17.5],
            [83, 53.8],
            [4, 0.079],
            [44, 18.3],
            [84, 54.8],
            [5, 0.080],
            [45, 19.1],
            [85, 55.8],
            [6, 0.082],
            [46, 19.9],
            [86, 56.8],
            [7, 0.083],
            [47, 20.7],
            [87, 57.8],
            [8, 0.085],
            [48, 21.5],
            [88, 58.8],
            [9, 0.087],
            [49, 22.4],
            [89, 59.8],
            [10, 0.089],
            [50, 23.2],
            [90, 60.8],
            [11, 0.090],
            [51, 24.0],
            [91, 61.8],
            [12, 0.092],
            [52, 24.9],
            [92, 62.8],
            [13, 0.094],
            [53, 25.7],
            [93, 63.8],
            [14, 0.096],
            [54, 26.6],
            [94, 64.8],
            [15, 0.098],
            [55, 27.5],
            [95, 65.8],
            [16, 0.1],
            [56, 28.3],
            [96, 66.8],
            [17, 0.6],
            [57, 29.2],
            [97, 67.8],
            [18, 1.1],
            [58, 30.1],
            [98, 68.8],
            [19, 1.6],
            [59, 31.0],
            [99, 69.8],
            [20, 2.2],
            [60, 31.9],
            [100, 70.8],
            [21, 2.7],
            [61, 32.8],
            [22, 3.3],
            [62, 33.7],
            [23, 3.8],
            [63, 34.6],
            [24, 4.4],
            [64, 35.6],
            [25, 5.0],
            [65, 36.5],
            [26, 5.6],
            [66, 37.4],
            [27, 6.2],
            [67, 38.3],
            [28, 6.9],
            [68, 39.3],
            [29, 7.5],
            [69, 40.2],
            [30, 8.2],
            [70, 41.2],
            [31, 8.8],
            [71, 42.1],
            [32, 9.5],
            [72, 43.1],
            [33, 10.2],
            [73, 44.0],
            [34, 10.9],
            [74, 45.0],
            [35, 11.6],
            [75, 46.0],
            [36, 12.3],
            [76, 46.9],
            [37, 13.0],
            [77, 47.9],
            [38, 13.7],
            [78, 48.9],
            [39, 14.5],
            [79, 49.9]
        ],

        loss : {},
        losscr : {}
        
    }

    constructor(pct){
        this.api = pct.api
        this.pct = pct

        _.each(this.constants._loss, (a) => {
            this.constants.loss[a[0]] = a[1]
        })
        
        _.each(this.constants.loss, (l, index) => {
            this.constants.losscr[l.toFixed(0)] = index;
        })


        this.constants.crmap = _.filter(this.pct.parseDefaultCt(pctdefault), function (f) {
            return f.loss
        })
    }

    defaultportfolio = function(){
        return {
            traded : [],
            assets : [
                {
                    
                    Country: "GLOBAL FUNDS",
                    ExpRatio: "0.050",
                    Group: "Fixed Income",
                    ID: "1",
                    Name: "iShares Barclays Aggregate Bond",
                    Sector: "Debt Fund",
                    StyleBox: "Aggregate Bond",
                    TID: "AGG US EQUITY",
                    TickerID: "AGG US",
                    Type: "Equity",
                    UEID: "",
                    WA: "50.00000"
                },
    
                {
                    Country: "UNITED STATES",
                    ExpRatio: "0.000",
                    Group: "Equity",
                    ID: "2",
                    Name: "S&P 500 INDEX",
                    Sector: "Equity Fund",
                    StyleBox: "",
                    TID: "SPX INDEX",
                    TickerID: "SPX INDEX",
                    Type: "Index",
                    UEID: "",
                    WA: "50.00000"
                },
    
                {
                    Country: "UNITED STATES",
                    ExpRatio: "0.000",
                    Group: "Fixed Income",
                    ID: "4",
                    Name: "Msci Usa/Inf Tech",
                    Sector: "Information Technology",
                    StyleBox: "",
                    TID: "MXUS0IT INDEX",
                    TickerID: "MXUS0IT INDEX",
                    Type: "Index",
                    UEID: "",
                    WA: "0"
                },
    
                {
                    Country: "GLOBAL FUNDS",
                    ExpRatio: "0.150",
                    Group: "Fixed Income",
                    ID: "4",
                    Name: "Ishares Barclays 1-3 Year Treasury Bond",
                    Sector: "Debt Fund",
                    StyleBox: "Government",
                    TID: "SHY US EQUITY",
                    TickerID: "SHY",
                    Type: "Equity",
                    UEID: "",
                    WA: "0"
                }
                
            ]
        }
    }

    portfolio = function(target){
        var result = _.min(this.constants.crmap, function (r) {
            return Math.abs(r.loss - target)
        })

        var portfolio = this.defaultportfolio() 
    
        if (result){
    
            portfolio.loss = {
                type : 'all',
                value : result.loss,
                pct : {
                    sc : _.toArray(result.scmap),
                    ocr : result.ocr
                }
            }
    
            portfolio.pct = {
                sc : _.toArray(result.scmap),
                ocr : result.ocr
            }
        }

        return portfolio
    }

    portfolioLoss = function(portfolio){
        return this.crtoLoss(f.deep(portfolio, 'loss.value') || 0)
    }

    
    crtoLoss = function(cr){
        return this.constants.loss[Number(cr).toFixed(0)]
    }

    lossToCr = function(loss){
        return this.constants.losscr[Number(loss).toFixed(0)]
    }

    questions = function(){
        return [
            {
                id : 'q1',
                question : 'riscscore.questions.q1',
                forceNext : true,
                form : {
                    schema : [
                        {
                            id : 'q1',
                            input : 'radio',

                            values : [
                                {
                                    text : 'riscscore.answers.q1.1'
                                },
                                {
                                    text : 'riscscore.answers.q1.2'
                                },
                                {
                                    text : 'riscscore.answers.q1.3'
                                },
                                {
                                    text : 'riscscore.answers.q1.4'
                                },
                            ],

                            rules : [{
                                rule : 'required'
                            }]
                        }
                    ]
                }
            },
            {
                id : 'q2',
                question : 'riscscore.questions.q2',
                forceNext : true,
                form : {
                    schema : [
                        {
                            id : 'q2',
                            input : 'radio',

                            values : [
                                {
                                    text : 'riscscore.answers.q2.1'
                                },
                                {
                                    text : 'riscscore.answers.q2.2'
                                },
                            ],

                            rules : [{
                                rule : 'required'
                            }]
                        }
                    ]
                }
            },

            {
                id : 'q3',
                question : 'riscscore.questions.q3',
                forceNext : true,
                form : {
                    schema : [
                        {
                            id : 'q3',
                            input : 'radio',

                            values : [
                                {
                                    text : 'riscscore.answers.q3.1'
                                },
                                {
                                    text : 'riscscore.answers.q3.2'
                                },
                            ],

                            rules : [{
                                rule : 'required'
                            }]
                        }
                    ]
                }
               
            },

            {
                id : 'q4',
                question : 'riscscore.questions.q4',
                forceNext : true,
                form : {
                    schema : [
                        {
                            id : 'q4',
                            input : 'radio',

                            values : [
                                {
                                    text : 'riscscore.answers.q4.1'
                                },
                                {
                                    text : 'riscscore.answers.q4.2'
                                },
                                {
                                    text : 'riscscore.answers.q4.3'
                                },
                                {
                                    text : 'riscscore.answers.q4.4'
                                }
                            ],

                            rules : [{
                                rule : 'required'
                            }]
                        }
                    ]
                }

            },

            {
                id : 'q5',
                question : 'riscscore.questions.q5',
                forceNext : true,
                form : {
                    schema : [
                        {
                            id : 'q5',
                            input : 'radio',

                            values : [
                                {
                                    text : 'riscscore.answers.q5.1'
                                },
                                {
                                    text : 'riscscore.answers.q5.2'
                                },
                                {
                                    text : 'riscscore.answers.q5.3'
                                },
                                {
                                    text : 'riscscore.answers.q5.4'
                                },
                                {
                                    text : 'riscscore.answers.q5.5'
                                }
                            ],

                            rules : [{
                                rule : 'required'
                            }]
                        }
                    ]
                }

            },

            {
                id : 'q6',
                question : 'riscscore.questions.q6',
                forceNext : true,
                form : {
                    schema : [
                        {
                            id : 'q6',
                            input : 'radio',

                            values : [
                                {
                                    text : 'riscscore.answers.q6.1'
                                },
                                {
                                    text : 'riscscore.answers.q6.2'
                                },
                                {
                                    text : 'riscscore.answers.q6.3'
                                },
                                {
                                    text : 'riscscore.answers.q6.4'
                                },
                                {
                                    text : 'riscscore.answers.q6.5'
                                },
                                {
                                    text : 'riscscore.answers.q6.6'
                                }
                            ],

                            rules : [{
                                rule : 'required'
                            }]
                        }
                    ]
                }
            }
        ]
    }

    capacityQuestions = function(){
        return [
            {
                id : 'c1',
                question : 'riscscore.questions.c1',
                
                form : {
                    schema : [
                        {
                            id : 'age',
                            text : 'riscscore.fields.age',
                            type : 'number',
                            default : 20,
                            /*placeholder : "riscscore.fields.enterage",*/
                            rules : [{
                                rule : 'required'
                            }]
                        }
                    ]
                }
                
            },

            {
                id : 'c2',
                question : 'riscscore.questions.c2',
                form : {
                    schema : [
                        {
                            id : 'savings',
                            text : 'riscscore.fields.savings',
                            input : 'currency',
                            
                            rules : [{
                                rule : 'required'
                            }],

                            mode : 'd'
                        }
                    ]
                }
            },

            {
                id : 'c3',
                question : 'riscscore.questions.c3',
                form : {
                    schema : [
                        {
                            id : 'retire',
                            text : 'riscscore.fields.retire',
                            type : 'number',
                            default : 50,
                            rules : [{
                                rule : 'required'
                            }]
                        }
                    ]
                }
            },

            {
                id : 'c4',
                question : 'riscscore.questions.c4',

                form : {
                    schema : [
                        {
                            id : 'save',
                            text : 'riscscore.fields.save',
                            input : 'currency',
                            rules : [{
                                rule : 'required'
                            }],

                            mode : 'd'
                        }
                    ]
                }
            },

            {
                id : 'c5',
                question : 'riscscore.questions.c5',
                tip : 'riscscore.questions.c5tip',
                form : {
                    schema : [
                        {
                            id : 'salary',
                            text : 'riscscore.fields.target',
                            input : 'currency',
                            rules : [{
                                rule : 'required'
                            }],

                            mode : 'd'
                        }
                    ]
                }
            }

        ]
    }

    convertQrToCapacity = function(capacityValues){

        if(!capacityValues){
            return {}
        }

        return {
            ages : [capacityValues.age, capacityValues.retire],
            savings : capacityValues.savings,
            save : capacityValues.save,
            salary : capacityValues.salary/* * 12*/,
            savemoreRange : [capacityValues.age, capacityValues.retire],
            withdrawRange : [0,0],
            withdraw : 0
        }
    }

    convertCapacityToQr = function(values){
        if(!values) return null

        var converted = {
            age : values.ages[0],
            retire : values.ages[1],
            save : values.save,
            savings : values.savings,
            salary : values.salary/* / 12*/
        }

        return converted
    }
}
export default Riskscore