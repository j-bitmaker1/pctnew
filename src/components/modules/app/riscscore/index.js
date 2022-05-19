import { mapState } from 'vuex';

import questionnaire from "@/components/common/questionnaire/index.vue";
import _ from 'underscore';

export default {
    name: 'riscscore',
    props: {
    },

    components : {
        questionnaire
    },

    data : function(){

        return {
            loading : false,

            values : {}
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
                    form : {
                        schema : [
                            {
                                id : 'q1_answer',
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

                    form : {
                        schema : [
                            {
                                id : 'q2_answer',
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
                    form : {
                        schema : [
                            {
                                id : 'q3_answer',
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

                    form : {
                        schema : [
                            {
                                id : 'q4_answer',
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

                    form : {
                        schema : [
                            {
                                id : 'q5_answer',
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
                    form : {
                        schema : [
                            {
                                id : 'q6_answer',
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

        allquestions : function(){
            return [
                ...this.questions,
                ...this.capacityQuestions
            ]
        }
    }),

    methods : {
       
        init : function(){


		}
    },
}