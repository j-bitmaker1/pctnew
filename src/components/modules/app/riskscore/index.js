import { mapState } from 'vuex';

import questionnaire from "@/components/common/questionnaire/index.vue";
import _ from 'underscore';

import secondpart from "./secondpart/index.vue"    

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

            }
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
                                type : 'number',
                                
                                rules : [{
                                    rule : 'required'
                                }]
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
                                type : 'number',
                                rules : [{
                                    rule : 'required'
                                }]
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
                                type : 'number',
                                rules : [{
                                    rule : 'required'
                                }]
                            }
                        ]
                    }
                }
    
            ]
        },

        questions : function(){
            return [
                {
                    id : 'q1',
                    question : 'riscscore.questions.q1',
                    forceNext : true,
                    form : {
                        schema : [
                            {
                                id : 'answer',
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
                                id : 'answer',
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
                                id : 'answer',
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
                                id : 'answer',
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
                                id : 'answer',
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
                                id : 'answer',
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
                question : 'Advisor John Foo sent you this questionnaire. Are you Max Grishkov?',
                tip : 'riscscore.questions.com0tip',
                back : false,
                next : false,
                forceNext : true,
                form : {
                    schema : [
                        {
                            id : 'answer',
                            input : 'radio',
                            style : 'yesno',
                            values : [
                                {
                                    text : "Yes, i'm Max Grishkov"
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

            if(this.client.ID){
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
                                id : 'phone',
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

                typeof this.values.q1.answer == 'undefined' ||
                typeof this.values.q2.answer == 'undefined' ||
                typeof this.values.q3.answer == 'undefined' ||
                typeof this.values.q4.answer == 'undefined' ||
                typeof this.values.q5.answer == 'undefined' ||
                typeof this.values.q6.answer == 'undefined'
            ) return null

            if (this.values.q2.answer == 1 &&  this.values.q3.answer == 0) points[0] = 50
            if (this.values.q2.answer == 0 &&  this.values.q3.answer == 1) points[0] = 50
            if (this.values.q2.answer == 0 &&  this.values.q3.answer == 0) points[0] = 25
            if (this.values.q2.answer == 1 &&  this.values.q3.answer == 1) points[0] = 75

            points[1] = Number(this.values.q4.answer) * 20

            if (this.values.q5.answer == 0) points[2] = 15
            if (this.values.q5.answer == 1) points[2] = 35
            if (this.values.q5.answer == 2) points[2] = 55
            if (this.values.q5.answer == 3) points[2] = 75
            if (this.values.q5.answer == 4) points[2] = 90

            if (this.values.q6.answer == 0) points[3] = 15
            if (this.values.q6.answer == 1) points[3] = 35
            if (this.values.q6.answer == 2) points[3] = 55
            if (this.values.q6.answer == 3) points[3] = 75
            if (this.values.q6.answer == 4) points[3] = 90
            if (this.values.q6.answer == 5) points[3] = 90

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

            if(this.capacity){
                return this.capacity
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
            
            this.part = 'c'

		},

        finish : function(){
            
        },

        checkClient : function(){
            if(this.client.ID) return true

            if(this.client.Email && this.client.FName && this.client.LName) return true
        },

        commonFinished: function(values){

            if (values.com0 && values.com0.answer == 1){
                this.client = {}

                return
            }

            _.each(values.com1, (v, i) => {
                this.$set(this.client, i, v)
            })

            if (this.checkClient()) {
                this.next()
            }
        },

        commonFinishedIntermediate : function(values){

        },

        questionnaireFinished : function(values){

            _.each(values, (v, i) => {
                this.$set(this.values, i, v)
            })

            this.next()
        },

        lastIntermediate: function(values){


            _.each(values, (v, i) => {
                this.$set(this.values, i, v)
            })

            this.send()
        },

        questionnaireIntermediate : function(values){

            _.each(values, (v, i) => {
                this.$set(this.values, i, v)
            })
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
                ...this.capacityValues,
                ...this.questionnaireValues,
                ...this.finishValues
            }

            console.log("SEND", data)
        },

        changecapacity : function(v){
            this.capacity = v
        }
        
    },
}