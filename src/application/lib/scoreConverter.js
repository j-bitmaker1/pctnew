import { _ } from "core-js";

class ScoreConverter {

    portfolios = [
        'SPY100',
        'SPY80/AGG20',
        'SPY70/AGG30',
        'SPY60/AGG40',
        'SPY50/AGG50',
        'SPY40/AGG60',
        'SPY30/AGG70',
        'SPY20/AGG80'
    ]

    scores = {}

    userDefined = {}

    constructor({ api, settings }) {
        this.api = api
        this.settings = settings
    }

    portfoliosFromMeta = function () {
        var portfolios = {};

        _.each(this.portfolios, (name) => {
            var positions = name.replace('SPY', 'SPY,').replace('AGG', 'AGG,').replace('/', ';');  // SPY80/AGG20 : "SPY,80;AGG,20"
            portfolios[name] = positions;
        })

        return portfolios
    }

    prepare() {
        return this.api.pct.crashtest.gets(this.portfoliosFromMeta()).then(r => {

            _.each(r, (portfolio) => {
                this.scores[portfolio.portfolio] = portfolio.ocr;
            })

            return this.getSettings()
        }).then(r => {
            this.ready = true
            return Promise.resolve()
        })
    }

    destroy(){
        this.ready = false
        this.scores = {}
        this.userDefined = {}
    }

    getSettings(){
        return this.settings.getall().then(settings => {
            this.userDefined = settings.definedRiskScore

            return Promise.resolve()
        })
    }

    setScores(v){
        return this.settings.set('definedRiskScore', v).then(r => {
            return this.getSettings()
        })
    }

    convert = function (score, backward) {


        var deviations = {};

        _.each(this.scores, (score, i) => {

            var initial = backward ? this.userDefined[i].value : this.scores[i],
                target = backward ? this.scores[i] : this.userDefined.value

            var deviation = Math.abs(score - initial);

            deviations[deviation] = {
                'initial': initial,
                'target': target
            }

        })

        if(_.toArray(deviations).length < 2) return score

        var sortedDeviations = Object.keys(deviations).sort(
            function (a, b) { return a - b }
        )


        var closestTwo = [
            deviations[sortedDeviations[0]],
            deviations[sortedDeviations[1]]
        ];

        var a1 = closestTwo[0].initial,
            b1 = closestTwo[0].target,
            a2 = closestTwo[1].initial,
            b2 = closestTwo[1].target,
            k1 = b1 / a1,
            k2 = b2 / a2,
            newScore = score * (k1 + (score - a1) / (a2 - a1) * (k2 - k1));

        if (newScore < 1) newScore = 1;
        if (newScore > 100) newScore = 100;

        return Math.round(newScore);
    }
}

export default ScoreConverter