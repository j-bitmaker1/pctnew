import { mapState } from 'vuex';

import sequence from "@/components/common/sequence/index.vue";
import pages_question from "./pages/question/index.vue";
import _ from 'underscore';

export default {
    name: 'questionnaire',
    props: {
        questions : Array
    },

    components : {
        sequence,
        pages_question
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

        pages : function(){

            var pages = []

            _.each(this.questions, (question) => {

                var questionPage = {
                    id : question.id,
                    type : 'question',
                    data : {
                        question
                    }
                }

                pages.push(questionPage)
            })

            return pages

        },

       
    }),

    methods : {

        setValues : function(question, values){

            console.log('question, values', question, values)

            _.each(question.form.schema, (field) => {
                this.$set(this.values[question.id], field.id, values[field.id])
            })

        },

        next : function(page, result){

            this.setValues(page.data.question, result)

            this.$refs['sequence'].next(page.id)

        },
        back : function(page){
            this.$refs['sequence'].back(page.id)
        },
        getmodule : function(page){

            if(page.type == 'question') return pages_question

        },
        init : function(){

			_.each(this.questions, (f) => {

                if (f.form){

                    this.$set(this.values, f.id, {})

                    _.each(f.form.schema, (field) => {

                        var def = field.default

                        if(!def) {
                            if(field.type == 'number'){
                                def = 0
                            }

                            if(!field.type || field.type == 'string') def = ''
                        }

                        this.$set(this.values[f.id], field.id, def)
                    })

                    return
                }

				
			})

		}
    },
}