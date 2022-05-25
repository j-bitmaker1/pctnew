import { mapState } from 'vuex';

import sequence from "@/components/common/sequence/index.vue";
import pages_question from "./pages/question/index.vue";
import pages_slide from "./pages/slide/index.vue";
import _ from 'underscore';

export default {
    name: 'questionnaire',
    props: {
        questions : Array,
        initial : {
            type : Object,
            default : () => {return {}}
        }
    },

    components : {
        sequence,
        pages_question,
        pages_slide
    },

    data : function(){

        return {
            loading : false,

            values : {}
        }

    },

    created() {

    },

  

    watch: {
        questions : {
            immediate : true,
            handler : function(){

                this.values = {}

                _.each(this.questions, (f) => {
    
                    if (f.form){
    
                        this.$set(this.values, f.id, {})
    
                        _.each(f.form.schema, (field) => {
    
                            var def = field.default || (this.initial[f.id] ? this.initial[f.id][field.id] || undefined : undefined)
    
                            if(!def) {
    
                                if(!field.input){
                                    if(field.type == 'number'){
                                        def = 0
                                    }
        
                                    if(!field.type || field.type == 'string') def = ''
                                }
                                else{
                                    def = undefined
                                }
    
                               
                            }
    
                            this.$set(this.values[f.id], field.id, def)
                        })

                        return
                    }
    
                    
                })
    
            }
        }
    },
    computed: mapState({
        auth : state => state.auth,

        pages : function(){

            var pages = []

            _.each(this.questions, (question) => {

                var p = {
                    id : question.id,
                    type : question.type || 'question',
                    data : {}
                }

                p.data[p.type] = question

                pages.push(p)
            })

            return pages

        },

       
    }),

    methods : {

        setValues : function(question, values){

            _.each(question.form.schema, (field) => {
                this.$set(this.values[question.id], field.id, values[field.id])
            })

        },

        next : function(page, result){

            this.setValues(page.data.question, result)

            this.$refs['sequence'].next(page.id)

            var cur = this.$refs['sequence'].current()

            if (cur){
                setTimeout(() => {
                    this.$refs[cur].focus()
                }, 50)
            }
                

            this.$emit('intermediate', this.values)

        },
        back : function(page){
            this.$refs['sequence'].back(page.id)
        },

        getmodule : function(page){

            if(page.type == 'question') return pages_question
            if(page.type == 'slide') return pages_slide
            
        },


        finish : function(){
            this.$emit('finish', this.values)
        },

        exit : function(){
            this.$emit('back')
        }
    },
}