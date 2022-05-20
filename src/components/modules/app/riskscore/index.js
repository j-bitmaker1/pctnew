import { mapState } from 'vuex';

import questionnaire from "@/components/common/questionnaire/index.vue";
import _ from 'underscore';



import secondpart from "./secondpart/index.vue"    

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
            part : 'f',
            parts : ['q','r','f'],
            values : {
                customCr : 0
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
            return [
                {
                    id : 'com1',
                    question : 'riscscore.questions.com1',
                    tip : 'riscscore.questions.com1tip',
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
                                id : 'email',
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
            ]
        },

        finishQuestion : function(){
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
                    next : false
                }
            ]
        },

        allquestions : function(){
            return [
                ...this.commonQuestions,
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

            if (this.values.q2.answer == 2 &&  this.values.q3.answer == 1) points[0] = 50
            if (this.values.q2.result == 1 &&  this.values.q3.answer == 2) points[0] = 50
            if (this.values.q2.result == 1 &&  this.values.q3.answer == 1) points[0] = 25
            if (this.values.q2.result == 2 &&  this.values.q3.answer == 2) points[0] = 75

            points[1] = Number(this.values.q4.result) * 20

            if (this.values.q5.result == 1) points[2] = 15
            if (this.values.q5.result == 2) points[2] = 35
            if (this.values.q5.result == 3) points[2] = 55
            if (this.values.q5.result == 4) points[2] = 75
            if (this.values.q5.result == 5) points[2] = 90

            if (this.values.q6.result == 1) points[3] = 15
            if (this.values.q6.result == 2) points[3] = 35
            if (this.values.q6.result == 3) points[3] = 55
            if (this.values.q6.result == 4) points[3] = 75
            if (this.values.q6.result == 5) points[3] = 90
            if (this.values.q6.result == 6) points[3] = 90
            
            var total = _.reduce(points, function(m, p){
                return m + p
            }, 0) / points.length

            return total
        },

        crvalue : function(){
            return this.values.customCr || this.questionPoints
        }
        

    }),

    methods : {

     
       
        init : function(){

		},

        finish : function(){

        },

        questionnaireFinished : function(values){

            _.each(values, (v, i) => {
                this.$set(this.values, i, v)
            })

            this.next()
        },

        questionnaireIntermediate : function(values){
            console.log('values', values)
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

            this.parts[i] ? this.part = this.parts[i] : this.$emit('finish')
        },

        back : function(){
            var i = _.indexOf(this.parts, this.part)

            i--

            i >= 0 ? this.part = this.parts[i] : this.$emit('back')
        }
        
    },
}