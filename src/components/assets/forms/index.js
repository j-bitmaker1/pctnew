import { mapState } from 'vuex';
import form from 'vuejs-form'
import _ from 'underscore';
import f from '@/application/functions.js'

export default {
    name: 'forms',
    props: {
        fields : Array,

        value : {
            type : Object,
            default : () => {return {}}
        },

        formid : {
            type : String,
            default : () => {
                return f.makeid()
            }
        },

        ignoreerrors : Boolean,
        
    },

    data : function(){

        return {
            loading : false,
            form : null,
            showerrors : false,
            created : false
        }

    },

    created : function(){

        var f1 = {}
        var r1 = {}
        var m1 = {}

        _.each(this.fields, (f) => {

            f1[f.id] = this.value[f.id] || ''

            var addedRules = []

            if(f.type == 'number') addedRules.push({
                rule : 'numeric'
            })

            r1[f.id] = _.map((f.rules || []).concat(addedRules), (r) => {
                return r.rule
            }).join('|')
            
            if(!f.disabled){
                _.each(f.rules || [], (r) => {
                    m1[f.id + '.' + r.rule] = r.rule == 'required' ? (this.$t(f.text) + ' is Required') : r.message ? this.$t(r.message) : ''
                })
            }
            
        })

        this.form = new form(f1).rules(r1).messages(m1)

        console.log('this.form', f1)

        setTimeout(() => {
            this.created = true
        }, 10)

    },

    watch: {
        ['form.data']: {
            deep: true,
            immediate: false,
            handler: function(now, old) { 

                if (this.created || !this.form.validate().errors().any()){
                    this.$emit('change', this.form.all())
                    this.$emit('input', this.getinternal())
                }
               
            },
        }
        
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
    }),

    methods : {

        focusOnIntput : function(){
            if(this.$refs[0] && this.$refs[0][0].focus) this.$refs[0][0].focus()
        },

        getinternal : function(){
   
            if (this.form.validate().errors().any() && !this.ignoreerrors) return null;

            var result = this.form.all()

            _.each(this.fields, (f) => {
                if(f.type == 'number' && typeof result[f.id] != 'undefined'){
                    result[f.id] = Number(result[f.id])
                } 
            })

            return result
        },

        get : function(){

            this.showerrors = true

            return this.getinternal()
        },

        onEnter : function(i){
            if(this.$refs[i + 1]) this.$refs[i + 1][0].focus()
        },

        onInput : function(){

        },

        focus : function(){
            this.$refs[i][0].focus()
        }
    },
}