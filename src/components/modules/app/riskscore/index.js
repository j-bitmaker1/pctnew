import { mapState } from 'vuex';

import questionnaire from "@/components/common/questionnaire/index.vue";
import _ from 'underscore';

import secondpart from "./secondpart/index.vue"    
import f from "@/application/functions.js"

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
            answer : 2
        },

        q2 : {
            answer : 2
        },

        q3 : {
            answer : 2
        },

        q4 : {
            answer : 2
        },

        q5 : {
            answer : 2
        },

        q6 : {
            answer : 2
        }
    },

    client : {
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
        token : String
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
            //values : testvalues.values,
            //client : testvalues.client,
            capacity : null,
            values : {
                customCr : 0
            },

            client : {

            },

            existlead : false
        }

    },

    created() {
        this.init()
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,

        capacityQuestions : function(){

            return this.core.pct.riskscore.capacityQuestions()

        },

        questions : function(){
            return this.core.pct.riskscore.questions()
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

            console.log('sequence', sequence)

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
                typeof this.values.q3.q4 == 'undefined' ||
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
        }
        

    }),

    methods : {
       
        init : function(){
            /*this.client = {
                ID : 414227
            }*/

            if (this.info.isLead){
                this.existlead = true
            }
            
            this.part = 'c'

		},

        finish : function(){
            
        },

        checkClient : function(){
            if(this.existlead) return Promise.resolve()

            if(this.client.Email && this.client.FName && this.client.LName) {

                return Promise.resolve()
            }

            return Promise.reject('empty')
        },

        commonFinished: function(values){

            if (values.com0 && values.com0.com0 == 1){
                this.existlead = false

                return
            }

            if (values.com0 && values.com0.com0 == 0){
                this.next()
                return
            }

            _.each(values.com1, (v, i) => {
                this.$set(this.client, i, v)
            })

            this.checkClient().then(() => {
                this.next()
            }).catch(e => {

            })
           
        },

        intermediate: function(values){

            _.each(values, (v, i) => {
                this.$set(this.values, i, v)
            })

            this.send()
        },

      

        questionnaireFinished : function(values){

            _.each(values, (v, i) => {
                this.$set(this.values, i, v)
            })

            this.next()
        },


        changecr : function(v){
            this.$set(this.values, 'customCr', v)
        },

        next : function(){
            var i = _.indexOf(this.parts, this.part)

            i++
            
            this.send()

            this.parts[i] ? this.part = this.parts[i] : this.$emit('finish')
        },

        back : function(){
            var i = _.indexOf(this.parts, this.part)

            i--

            i >= 0 ? this.part = this.parts[i] : this.$emit('back')
        },

        send : function(){

            var data = {
                ...this.client,
                ...this.finishValues
            }

            data.json = JSON.stringify({
                capacity : this.capacityValues,
                questions : this.questionnaireValues
            })

            data.Tolerance = this.values.customCr || this.questionPoints
            data.Capacity = this.capacity ? this.capacity.capacity : null

            _.each(data, (v, i) => {
                if(!v) delete data[i]
            })

            data.Token = this.token

            //if(!data.Tolerance) delete data.Tolerance
            //if(!data.Capacity) delete data.Capacity

            console.log("data", data)

        },

        changecapacity : function(v){
            console.log("VVV", v)
            this.capacity = v
        }
        
    },
}