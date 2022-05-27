import _ from "underscore"
import {Random} from 'random'

var quantile = require( 'compute-quantile' );
var cdf = require( 'distributions-lognormal-cdf' );



var normalArray = function(count, sigma){
    if(!count) count = 10000;

    var a = [];
    var random = new Random()


    for(var i = 0; i < count; i++){
        a.push(random.normal(0, sigma)())
    }

    return a;
}

var percentbv = function(v, v1, v2, y, lastValue, mode){

    if(mode == 0){
        return v;
    }

    if(mode == 1){
        return v1 * lastValue / 100
    }

    if(mode == 2){

        if(v2[y]) v = v2[y].val

        return v
    }
}

class Calculate {

    capacity = {}

    constructor(capacity){
        this.capacity = capacity
    }

    acceptValue = function(){
        return this.capacity.getOptions().salary * .9
    }

    terminalValue = function(){
        return this.capacity.getOptions().salary
    }

    timeToRetirement = function(){

        var options = this.capacity.getOptions()

        return options.retire - options.age
    }
}

class Capacity {

    sigma = 1.5
    invalidCut = 50

    options = {}
    extra = {}

    defaults = {
        extra : {
            savemoreRange1 : 20,
            savemoreRange2 : 40,
            withdrawRange1 : 0,
            withdrawRange2 : 0,
            unit : 0,
            save : 0,
            SCF : [],
            WCF : [],
            withdraw : 0

        },

        options : {
            simulationCount : 1000,
            age : 20,
            save : 0,
            withdraw : 0,
            savings : 0,
            retire : 40,
            salary : 0 // per year
        }
    }

    crByYears = [

        {
            y : 35,
            cr : 67,
            source : [14.31, 67, .071]
        },
        {
            y : 30,
            cr : 64,
            source : [13.41,64,.068]
        },
        {
            y : 25,
            cr : 62,
            source : [12.5,62,.0645]
        },
        {
            y : 20,
            cr : 59,
            source : [11.62,59,.0612]
        },
        {
            y : 10,
            cr : 55,
            source : [9.8, 55,.054]
        },
        {
            y : 5,
            cr : 51,
            source : [9,51,.0512]
        }

    ]

    constructor({options, extra} = {}){

        this.options = _.clone(this.defaults.options)
        this.extra = _.clone(this.defaults.extra)

        this.setOptions(options)
        this.setExtra(extra)

        this.calculate = new Calculate(this)
    }

    setOptions = function(options = {}){

        this.options = _.extend(this.options, options)
    }

    setExtra = function(extra = {}){
        this.extra = _.extend(this.extra, extra)
    }

    getOptions = function(){
        return this.options
    }

    getExtra = function(){
        return this.extra
    }

    crByYear = function(year){

        return _.min(this.crByYears, function(yd){
            return Math.abs(yd.y - year)
        })
    }

    save = function(y, lastValue){
        var annualsave = 0;

        var mode = this.options.unit || 0;

            y = this.options.age + y;

        if((this.extra.savemoreRange1 === null || this.extra.savemoreRange2 === null) || (this.extra.savemoreRange1 <= y && this.extra.savemoreRange2 >= y)){
            
            annualsave += percentbv(this.options.save, this.extra.save, this.extra.SCF, y, lastValue, mode);

        }


        if(this.extra.withdrawRange1 <= y && this.extra.withdrawRange2 >= y && this.extra.withdraw > 0){
            annualsave = annualsave - percentbv(this.options.withdraw, this.extra.withdraw, this.extra.WCF, y, lastValue, mode);
        }

        return annualsave

    }

    simulation = function(){

        var years = this.calculate.timeToRetirement()
        var portfolioValue = this.options.savings;
        var terminalValues = [];
        var termValue = this.calculate.terminalValue();
        var acceptValue = this.calculate.acceptValue();

        var sigma = this.sigma;
        var hv = this.options.simulationCount / 10;

        var random = new Random()
        var TDFCR = this.crByYear(years).cr


        var maxPortfolioValue = 0;

        var portfolios = [];

        for(var i = 0; i < this.options.simulationCount; i++){

            var currnetPortfolioValue = portfolioValue;

            portfolios[i] = [];

            portfolios[i].push(currnetPortfolioValue)

            for(var y = 0; y < years; y++){

                var crByYear = this.crByYear(years - y)


                //var normalrnd = random.normal(ltr, std)
                var normalrnd = random.normal(crByYear.source[2], crByYear.source[0] / 100)()
                var _annualsave = this.save(y, currnetPortfolioValue);
                

                if(!y) _annualsave = 0;

                currnetPortfolioValue = (_annualsave + currnetPortfolioValue) * (1 + normalrnd)

                portfolios[i][y + 1] = currnetPortfolioValue;

                if(maxPortfolioValue < currnetPortfolioValue) maxPortfolioValue = currnetPortfolioValue
            }

            terminalValues.push(currnetPortfolioValue)
        }


        terminalValues = _.sortBy(terminalValues, function(n){
            return n
        })				

        var worstav = 0;
        var under = 0;

        for(var m = 0; m < hv; m++) {

            worstav += terminalValues[m];

        }

        worstav = worstav / hv;

        var desiredmean = Math.log(acceptValue) - quantile(normalArray(null, this.sigma), TDFCR / 100) * sigma;

        var cutOffPercent = this.options.simulationCount / ( 100 / this.invalidCut);
        var z = null;
    
        if (terminalValues[cutOffPercent] >= termValue){

            z = cdf(worstav, {
                mu : desiredmean,
                sigma : sigma
            }) * 100;

            if(z.toString() == 'NaN') z = null
            
        }

        var under = 0;

        for(var m = 0; m < this.options.simulationCount; m++) {

            if(terminalValues[m] < termValue)
            {
                under++
            }

        }

        return {
            capacity : z,
            portfolios : portfolios,
            max : maxPortfolioValue,
            under : under,
            top : this.options.simulationCount - under,
            underp : under / this.options.simulationCount,
            topp : (this.options.simulationCount - under) / this.options.simulationCount,
            terminalValue : termValue
        }

    }


}

export default Capacity