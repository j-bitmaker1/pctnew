import { mapState } from 'vuex';
import form from 'vuejs-form'
import _ from 'underscore';
import f from '@/application/shared/functions.js'
import datepicker from '../datepicker/index.vue'
import timezonepicker from '../timezonepicker/index.vue'
import slider from '@/components/assets/slider/index.vue'


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

        grouping : Object
        
    },

    components : {
        datepicker, timezonepicker, slider
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

            var v = ''

            if(this.value[f.id] || this.value[f.id] === 0) v = this.value[f.id]

            f1[f.id] = v

            var addedRules = []

            if(f.type == 'number') addedRules.push({
                rule : 'numeric'
            })

            r1[f.id] = _.map((f.rules || []).concat(addedRules), (r) => {
                return r.rule
            })//.join('|')

            if(!f.disabled){
                _.each(f.rules || [], (r) => {

                    if(r.rule == 'required'){
                        f.__required = true
                    }

                    var rid =  r.rule

                    if (rid.indexOf('regex') > -1) rid = 'regex'

                    m1[f.id + '.' + rid] = r.rule == 'required' ? (this.$t(f.text) + ' is Required') : r.message ? this.$t(r.message) : ''
                })
            }


            if(!r1[f.id]) delete r1[f.id]
            
        })

        this.form = new form(f1).rules(r1).messages(m1)

        setTimeout(() => {

            this.created = true
        }, 10)

    },

    watch: {
        ['form.data']: {
            deep: true,
            immediate: false,
            handler: function(now, old) { 


                if (this.created /*|| !this.form.validate().errors().any()*/){
                    this.$emit('change', this.form.all())
                    this.$emit('input', this.getinternal())
                }

                else{
                    if(!this.form.validate().errors().any())
                        this.$emit('initial', this.getinternal())
                }
               
            },
        }
        
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,

        groups() {
            if (this.grouping){
                var groups = f.group(this.fields, (f) => {
                    return f.group || 'ungroupped'
                })

                var groupsext = {}

                _.each(groups, (g, i) => {

                    var d = this.grouping[i] || {}

                    groupsext[i] = {
                        name : d.name,
                        fields : g
                    }
                })

                return groupsext
            }

            return {
                ungroupped : {
                    fields : this.fields
                }
            }
        }
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
        },

        sliderOptions : function(field){

            var max = Number(((_.find(field.rules, (r) => {
                return r.rule && r.rule.indexOf('less_than') > -1
            }) || {}).rule || "").replace('less_than:', '') || "0") 

            var min = Number(((_.find(field.rules, (r) => {
                return r.rule && r.rule.indexOf('greater_than') > -1
            }) || {}).rule || "").replace('greater_than:', '') || "100")


            return {
				min,
				max,
				interval : ((max - min) / 100) || 0.1,
				type : Number,
			}

        }
    },
}