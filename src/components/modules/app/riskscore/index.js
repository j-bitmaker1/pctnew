import { mapState } from 'vuex';

import questionnaire from "@/components/common/questionnaire/index.vue";
import _ from 'underscore';

import secondpart from "./secondpart/index.vue"    
import f from "@/application/shared/functions.js"

var testvalues = {
    values : {
        customCr : 0,

        c1 : {
            age : 20
        },

        c2 : {
            savings : 100000
        },
       
        c3 : {
            retire : 60
        },
        c4 : {
            save : 10000
        },
        c5 : {
            salary : 100000
        },

        q1 : {
            q1 : 2
        },

        q2 : {
            q2 : 2
        },

        q3 : {
            q3 : 2
        },

        q4 : {
            q4 : 2
        },

        q5 : {
            q5 : 2
        },

        q6 : {
            q6 : 2
        },
        FName : "M",
        LName : "G",
        Email : "maxgrishkov@gmail.com"
    }
}

export default {
    name: 'riskscore',
    props: {
        info : {
            type : Object,
            default : () => {
                return {}
            }
        },
        token : String,
        includeTolerance : Boolean
    },

    components : {
        questionnaire,
        secondpart
    },

    data : function(){

        return {
            loading : false,
            part : '',
            parts : ['c', 'q', 'r', 'f'],
            capacity : null,
            id : null,
            values : {
                customCr : 0
            },
            existlead : false,
            finished : false
        }

    },

    created() {
        this.init()

        window.addEventListener('beforeunload', this.sendThird)
    },

    beforeDestroy(){
        window.removeEventListener('beforeunload', this.sendThird)
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({

        direction : function(state){
            return state.dwidth <= 768 ? 'vertical' : 'horizontal'
        },

        auth : state => state.auth,

        capacityQuestions : function(){
            return this.core.pct.riskscore.capacityQuestions()
        },

      

        questions : function(){

            console.log('this.includeTolerance', this.includeTolerance)

            return this.includeTolerance ? this.core.pct.riskscore.questions() : []
        },

        commonQuestions : function(){

            var introduce = {
                id : 'com1',
                question : 'riscscore.questions.com1',
                tip : 'riscscore.questions.com1tip',
                back : false,
                form : {
                    schema : [

                        {
                            id : 'FName',
                            text : 'riscscore.fields.FName',
             
                            rules : [{
                                rule : 'required'
                            }]
                        },
                        {
                            id : 'LName',
                            text : 'riscscore.fields.LName',
             
                            rules : [{
                                rule : 'required'
                            }]
                        },
                        {
                            id : 'Email',
                            text : 'riscscore.fields.email',
             
                            rules : [{
                                rule : 'required'
                            },{
                                rule : 'email'
                            },{
                                rule : 'min:5'
                            }]
                        }

                    ]
                }
                
            }

            var existlead = {
                id : 'com0',
                question : 'Advisor '+f.name(this.info.AdvisorFName, this.info.AdvisorLName)+' sent you this questionnaire. Are you '+f.name(this.info.ContactFName, this.info.ContactLName)+'?',
                tip : 'riscscore.questions.com0tip',
                back : false,
                next : false,
                forceNext : true,
                form : {
                    schema : [
                        {
                            id : 'com0',
                            input : 'radio',
                            style : 'yesno',
                            values : [
                                {
                                    text : "Yes, i'm " + f.name(this.info.ContactFName, this.info.ContactLName)
                                },
                                {
                                    text : 'No'
                                }
                            ],

                            rules : [{
                                rule : 'required'
                            }]
                        }
                    ]
                }
                
            }

            var sequence = []

            if (this.existlead){
                sequence = [existlead]
            }
            else{
                sequence = [introduce]
            }


            return sequence
        },

        finishQuestions : function(){
            return [
                {
                    id : 'fin1',
                    question : 'riscscore.questions.fin1',
                    tip : 'riscscore.questions.fin1tip',
                    form : {
                        schema : [

                            {
                                id : 'Phone',
                                text : 'riscscore.fields.phone',
                 
                                rules : [{
                                    rule : 'required'
                                },{
                                    rule : 'phone'
                                },{
                                    rule : 'min:5'
                                }]
                            }

                        ]
                    }
                }, 
                {
                    id : 'fin2',
                    text : 'riscscore.questions.fin2',
                    type : 'slide',
                    back : false,
                    next : false
                }
            ]
        },

        allquestions : function(){
            return [
                ...this.questions,
                ...this.capacityQuestions
            ]
        },

        questionPoints : function(){
            var points = [];

            if(

                !this.values.q1 || !this.values.q2 || !this.values.q3 || 
                !this.values.q4 || !this.values.q5 || !this.values.q6 ||

                typeof this.values.q1.q1 == 'undefined' ||
                typeof this.values.q2.q2 == 'undefined' ||
                typeof this.values.q3.q3 == 'undefined' ||
                typeof this.values.q4.q4 == 'undefined' ||
                typeof this.values.q5.q5 == 'undefined' ||
                typeof this.values.q6.q6 == 'undefined'
            ) return null

            if (this.values.q2.q2 == 1 &&  this.values.q3.q3 == 0) points[0] = 50
            if (this.values.q2.q2 == 0 &&  this.values.q3.q3 == 1) points[0] = 50
            if (this.values.q2.q2 == 0 &&  this.values.q3.q3 == 0) points[0] = 25
            if (this.values.q2.q2 == 1 &&  this.values.q3.q3 == 1) points[0] = 75

            points[1] = Number(this.values.q4.q4) * 20

            if (this.values.q5.q5 == 0) points[2] = 15
            if (this.values.q5.q5 == 1) points[2] = 35
            if (this.values.q5.q5 == 2) points[2] = 55
            if (this.values.q5.q5 == 3) points[2] = 75
            if (this.values.q5.q5 == 4) points[2] = 90

            if (this.values.q6.q6 == 0) points[3] = 15
            if (this.values.q6.q6 == 1) points[3] = 35
            if (this.values.q6.q6 == 2) points[3] = 55
            if (this.values.q6.q6 == 3) points[3] = 75
            if (this.values.q6.q6 == 4) points[3] = 90
            if (this.values.q6.q6 == 5) points[3] = 90

            var total = _.reduce(points, function(m, p){
                return m + p
            }, 0) / points.length

            return total
        },

        crvalue : function(){
            return this.values.customCr || this.questionPoints
        },

        finishValues : function(){
            
            var cv = {}

            _.each(this.finishQuestions, (c) => {

                if (c.form)
                    _.each(c.form.schema, (f) => {
                        if (this.values[c.id]){
                            cv[f.id] = this.values[c.id][f.id]
                        }
                        else{
                            cv[f.id] = null
                        }
                    })
            })

            return cv
        },

        questionnaireValues : function(){
            var cv = {}

            _.each(this.questions, (c) => {
                _.each(c.form.schema, (f) => {

                    if (this.values[c.id])
                        cv[c.id] = this.values[c.id][f.id]
                })
            })


            return cv
        },

        capacityValues : function(){
            var cv = {}

            if(this.capacity && this.capacity.values){
                return this.capacity.values
            }

            _.each(this.capacityQuestions, (c) => {
                _.each(c.form.schema, (f) => {
                    if (this.values[c.id]){
                        cv[f.id] = this.values[c.id][f.id]
                    }
                    else{
                        cv[f.id] = null
                    }
                })
            })

            return cv
        },

        client : function(){
            return {
                FName : this.values.FName,
                LName : this.values.LName,
                Email : this.values.Email
            }
        }
        

    }),

    methods : {
       
        init : function(){
          

            if (this.info.previous){

                var i = this.info.previous

                var questions = [
                    ...this.questions,
                    ...this.capacityQuestions,
                    ...this.commonQuestions,
                    ...this.finishQuestions
                ]


                _.each(questions, (c) => {
                    if(c.form)
                        _.each(c.form.schema, (f) => {
        
                            if (typeof i.data[f.id] != 'undefined'){
                                this.values[c.id] || (this.values[c.id] = {})
                                this.values[c.id][f.id] = i.data[f.id]
                            }
                        })
                })

                if(i.client){
                    this.values.FName = i.client.FName
                    this.values.LName = i.client.LName
                    this.values.Email = i.client.Email
                }

                this.existlead = i.existlead
                this.id = i.id
                this.part = i.part
                this.finished = i.finished
                this.capacity = _.clone(i.capacity)

            }

            else{
                if (this.info.IsLead){
                    this.existlead = true
                }
                
                this.part = 'c'
            }

            

		},

        finish : function(){
            
        },

        checkClient : function(){
            if(this.existlead || (this.client.Email && this.client.FName && this.client.LName)) {

                return this.sendFirst()
            }

            return Promise.reject('empty')
        },

        commonFinished: function(values){


            if (values.com0 && values.com0.com0 == 1){
                this.existlead = false

                return
            }

            if (values.com0 && values.com0.com0 == 0){
                
            }

            if (values.com1){
                _.each(values.com1, (v, i) => {
                    this.$set(this.values, i, v)
                })
            }

            this.checkClient().then(() => {
                this.next()
            }).catch(e => {
                console.error(e)
            })
           
        },

        intermediate: function(values){

            console.log('values', values)

            _.each(values, (v, i) => {
                this.$set(this.values, i, v)
            })


            this.save()
            this.sendSecond()
        },

        questionnaireFinished : function(values){

            _.each(values, (v, i) => {
                this.$set(this.values, i, v)
            })

            this.capacity = null
            this.values.customCr = 0

            this.next()
        },

        changecr : function(v){
            this.$set(this.values, 'customCr', v)

            this.sendSecond()
        },

       

        next : function(){
            var i = _.indexOf(this.parts, this.part)

            i++
            
            this.save()

            this.parts[i] ? this.part = this.parts[i] : this.finish()
        },

        back : function(){
            var i = _.indexOf(this.parts, this.part)

            i--

            i >= 0 ? this.part = this.parts[i] : this.$emit('back')
        },

        save : function(){
            var data = this.getalldata()

            this.$emit('save', data)
        },

        sendsnext : function(){

            console.log("sendsnextsendsnext")

            this.next()

            this.sendSecond()
        },

        getalldata : function(){


            var questionnaire = {

                data : {
                    ...this.finishValues,
                    ...this.capacityValues,
                    ...this.questionnaireValues,
                    ...this.client,
                    customCr : this.values.customCr
                },

                client : this.client,

                capacity : this.capacity
                
            }

            console.log('questionnaire', questionnaire)

            _.each(questionnaire.data, (v, i) => {
                if(typeof v == 'undefined') delete questionnaire.data[i]
            })

            questionnaire.token = this.token
            questionnaire.id = this.id
            questionnaire.finished = this.finished
            questionnaire.part = this.part
            questionnaire.existlead = this.existlead

            return questionnaire
        },

        changecapacity : function(v){
            this.capacity = v
        },

        sendFirst : function(){

            if(this.id) return Promise.resolve()

            return this.core.api.crm.questionnaire.response.first(this.token, this.existlead ? {} : this.client, {
                preloader : true
            }).then(id => {

				this.id = id

                this.save()

				return Promise.resolve(id)

			})
        },

        sendSecond : function(){

            console.log('sendSecond', this.capacityValues)

            if(!this.id) return Promise.reject('id')

            return this.core.api.crm.questionnaire.response.second(this.token, this.id,  JSON.stringify({
                capacity : this.capacityValues,
                questions : this.questionnaireValues
            }), {
                
            }).then(() => {

				return Promise.resolve()

			})
        },

        sendThird : function(){

            if(this.finished) return Promise.resolve()

            if(!this.id) return Promise.reject('id')

            var data = {
                ...this.finishValues,
                Tolerance : Number((this.crvalue || 0).toFixed()),
                Capacity : this.capacity ? Number((this.capacity.capacity || 0).toFixed()) : null,

                ...(this.existlead ? {} : this.client)
            }

            _.each(data, (v, i) => {
                if(!v) delete data[i]
            })

            return this.core.api.crm.questionnaire.response.third(this.token, this.id, data, {
                preloader : true
            }).then(() => {

				this.finished = true

                this.save()

				return Promise.resolve()

			})
        },

        last : function(values){
            _.each(values, (v, i) => {
                this.$set(this.values, i, v)
            })
            this.save()
            this.sendThird().then(r => {
                
            })
        }
        
    },
}