import helpers from './helpers.js'
import f from "../src/application/shared/functions.js";



helpers.init().then((core) => {

    helpers.multipeInfinityActions(function(){

        var portfolio = helpers.createRandomPortfolio(f.rand(1000, 100000), f.rand(10, 30))
        var client = helpers.createRandomClient()
        var questionnaire = helpers.createRandomQuestionnaire(core)
        var extradata = {}
        var temperature = 0.1
        var context = {
            readyportfolio : portfolio,
            readyclient : client,
            readycapacity : questionnaire
        }

        return core.getaidata(context).then((data) => {

            extradata = data
            extradata.adviserInfo = helpers.randomAdvisorInfo()
            extradata.temperature = temperature

            return helpers.getRandomAiTemplate(core)

        }).then(({template, parameters}) => {

            //console.log('extradata', extradata)
            //console.log('parameters', parameters)
            //console.log('template.Id', template.Id)

            return core.api.ai.generate(template.Id, parameters, {automatization : 'frontend'}, extradata)

        }).then((result) => {
            //console.log('result', result)
        })


    }, 1000, 4)
})