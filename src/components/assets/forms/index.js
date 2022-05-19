import { mapState } from 'vuex';
import form from 'vuejs-form'
import _ from 'underscore';

export default {
    name: 'forms',
    props: {
        fields : Array,
        value : {
            type : Object,
            default : () => {return {}}
        },

        ignoreerrors : Boolean,
        
    },

    data : function(){

        return {
            loading : false,
            form : null,
            showerrors : false
        }

    },

    created : function(){

        var f1 = {}
        var r1 = {}
        var m1 = {}

        _.each(this.fields, (f) => {

            f1[f.id] = this.value[f.id] || ''

            r1[f.id] = _.map(f.rules || [], (r) => {
                return r.rule
            }).join('|')
            
            if(!f.disabled){
                _.each(f.rules || [], (r) => {
                    m1[f.id + '.' + r.rule] = r.rule == 'required' ? (this.$t(f.text) + ' is Required') : r.message ? this.$t(r.message) : ''
                })
            }
            
        })


        this.form = new form(f1).rules(r1).messages(m1)

    },

    watch: {
        ['form.data']: {
            deep: true,
            immediate: false,
            handler: function(now, old) { 
                this.$emit('change', this.form.all())
                this.$emit('input', this.getinternal())
            },
        }
        
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
    }),

    methods : {

        getinternal : function(){
            if (this.form.validate().errors().any() && !this.ignoreerrors) return null;

            return this.form.all()
        },

        get : function(){

            this.showerrors = true

            return this.getinternal()
        },

        onEnter : function(i){
            if(this.$refs[i + 1]) this.$refs[i + 1][0].focus()
        },

        onInput : function(){

        }
    },
}