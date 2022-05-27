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
        this.init()
    },

  

    watch: {
        questions : {
            handler : function(){

                this.init()
    
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

        init : function(){
            this.values = {}


            _.each(this.questions, (f) => {

                if (f.form){

                    this.$set(this.values, f.id, {})

                    _.each(f.form.schema, (field) => {

                        var v = field.default || undefined

                        if (this.initial[f.id]){
                            if(this.initial[f.id][field.id] || this.initial[f.id][field.id] === 0){
                                v = this.initial[f.id][field.id]
                            }
                        }

                        var def = v

                        if(!def && def !== 0) {

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
        },

        input : function(page, result){


            this.setValues(page.data.question, result)
        },

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
                    if (this.$refs[cur])
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

        validate : function(){

            return _.find(this.questions, (question) => {

                if(!question.form) return false

                return _.find(question.form.schema, (field) => {
                    return !this.values[question.id] || (!this.values[question.id][field.id] && this.values[question.id][field.id] !== 0)
                })
            })
        },

        finish : function(){

            var v = this.validate()

            if(v) {

                this.core.notifier.simplemessage({
                    icon : "fas fa-exclamation-triangle",
                    title : "You haven't answered all the questions",
                    message : 'Please answer the question'
                })

                this.$refs['sequence'].to(v.id)

                return
            }

            this.$emit('finish', this.values)
        },

        exit : function(){
            this.$emit('back')
        }
    },
}