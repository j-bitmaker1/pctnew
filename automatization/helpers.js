import Core from "../src/application/index.js";
import {Portfolio, Contact} from "../src/application/shared/kit.js";
import tickers from './data/tickers.json'
import names from './data/names.json'
import portfolionames from './data/portfolionames.json'
import f from "../src/application/shared/functions.js";
import 'dotenv/config'
global._ = require('underscore')
global.NODE = true

names = _.map(names, (name) => {
    var n = name.split(' ')
    
    return {
        fname : n[0],
        lname : n[1]
    }
})

var init = function(){

    var core = new Core(this, {});

    core.init();

    console.log("INIT CORE")

    return core.user.signin({
        password_value : 'qwerty1234',
        login_value : 'maximgrishkov@yandex.ru',
    }).then(() => {

        console.log("INIT CORE SUCCESS")

        return core
    }).catch(e => {

        console.log(e)

        return Promise.reject(e)
    })
}

var createRandomPortfolio = function(maxtickervalue = 10000, count = 20){

    var portfolio = new Portfolio({
        name : portfolionames[f.rand(0, portfolionames.length - 1)],
        id : -1,
        tempportfolio : true,
        positions : []
    })

    for(var i = 0; i < count; i++){
        var index = f.rand(0, tickers.length - 1)

        var asset = {
            ticker : tickers[index],
            isCovered : true,
            value : f.rand(1, maxtickervalue)
        }

        portfolio.positions.push(asset)
    }

    return portfolio

}

var createRandomClient = function(){

    var fname = names[f.rand(0, names.length - 1)].fname
    var lname = names[f.rand(0, names.length - 1)].lname

    var contact = new Contact({
        Email : "randomemail_"+f.rand(2000, 200000)+".com",
        FName : fname,
        LName : lname,
        ID : -1,
        Products : "PCT",
        Type : ["CLIENT", "LEAD"][f.rand(0,1)],
        __customfields__ : {
            $$PCT_Capacity: f.rand(12, 88),
            $$PCT_CrashRating : f.rand(12, 88),
            $$PCT_PortfoliosCount : f.rand(1, 5),
            $$PCT_PortfoliosTotalSum : f.rand(100000, 2000000),
            $$PCT_Tolerance: f.rand(12, 88)
        }

    })

    return contact

}

var createRandomQuestionnaire = function(core){

    var options = {
        age : f.rand(20,40),
        retire : f.rand(45,65),
        savings : f.rand(20000,300000),
        save : f.rand(2000, 20000),
        withdraw : f.rand(2000, 20000),
        salary : f.rand(300000,3000000) //terminal value
    }

    var extradata = {
        savemoreRange1 : f.rand(20,30),
        savemoreRange2 : f.rand(30,45),
        withdrawRange1 : f.rand(45,55),
        withdrawRange2 : f.rand(55,65),
        withdraw : f.rand(2000, 20000)
    }
    
    var capacity = new core.pct.capacity({
        options : options,
        extra : extradata
    })

    var simulation = capacity.simulation()

    return {
        simulation,
        extradata,
        options
    }

}

var randomAdvisorInfo = function(){
    return 'test'
}

var infinityAction = function(promiseFactory, timeout = 1000, counter = 1){

    console.log("iteration: " + counter)

    var promise = promiseFactory()

    return promise.then(() => {

        console.log("iteration success: " + counter)

    }).catch(e => {
        console.log('error', e)
    }).finally(() => {
        setTimeout(() => {
            infinityAction(promiseFactory, timeout, counter + 1)
        }, timeout)
    })
}

var getRandomAiTemplate = function(core){
    return core.api.ai.template.list().then(list => {
        list = _.filter(list, (p) => {
            return p.Parameters.PortfolioRequired
        })

        var template = list[f.rand(0, list.length - 1)]
        var parameters = {}

        _.each(template.Parameters.Parameters, (parameter) => {
            if (parameter.Values && parameter.Values.length){
                parameters[parameter.Id] = parameter.Values[f.rand(0, parameter.Values.length - 1)]
            }
            else{
                parameters[parameter.Id] = parameter.DefaultValue || ''
            }
        })

        return {
            template, parameters
        }

    })
}

export default {
    init,
    createRandomPortfolio,
    createRandomClient,
    createRandomQuestionnaire,
    infinityAction,
    randomAdvisorInfo,
    getRandomAiTemplate
}
